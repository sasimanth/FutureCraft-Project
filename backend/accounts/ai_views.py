import os
import json
import urllib.request
from datetime import datetime
from django.utils import timezone
from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response

from accounts.models import AuditLog
from patients.models import PatientProfile, PatientVital, PatientMedicalHistory, PatientVisit, PatientSmartWatchDevice, PatientSmartWatchData
from doctors.models import DoctorProfile
from laboratory.models import LabRequest, LabResult
from appointments.models import Appointment
from prescriptions.models import Prescription, PrescriptionMedicine

class AIChatView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        message = request.data.get('message', '').strip()
        if not message:
            return Response({'error': 'Message is required.'}, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        role = user.role
        name = user.name or user.email.split('@')[0]
        
        # 1. Gather Context based on user role
        context = {
            'username': name,
            'role': role,
            'email': user.email,
            'current_time': timezone.now().strftime('%Y-%m-%d %H:%M:%S'),
        }

        if role == 'patient':
            try:
                patient = user.patientprofile
                context['patient_id'] = patient.patient_id
                context['blood_group'] = patient.blood_group
                context['allergies'] = patient.allergies
                context['dob'] = str(patient.dob) if patient.dob else 'Unknown'
                context['gender'] = patient.gender
                
                # Fetch records
                vitals = PatientVital.objects.filter(patient=patient).order_by('-date')[:5]
                context['vitals'] = [
                    {'date': str(v.date), 'bp': f"{v.bp_systolic}/{v.bp_diastolic}", 'hr': v.heart_rate, 'temp': float(v.temp), 'weight': float(v.weight)}
                    for v in vitals
                ]

                history = PatientMedicalHistory.objects.filter(patient=patient).order_by('-date')[:5]
                context['medical_history'] = [
                    {'date': str(h.date), 'condition': h.condition, 'diagnosed_by': h.diagnosed_by, 'status': h.status}
                    for h in history
                ]

                prescriptions = Prescription.objects.filter(patient_id=patient.patient_id).order_by('-date')[:5]
                context['prescriptions'] = []
                for p in prescriptions:
                    meds = PrescriptionMedicine.objects.filter(prescription=p)
                    context['prescriptions'].append({
                        'date': str(p.date),
                        'diagnosis': p.diagnosis,
                        'doctor': p.doctor_name,
                        'medicines': [
                            {'name': m.name, 'dosage': m.dosage, 'frequency': m.frequency, 'duration': m.duration, 'instructions': m.instructions}
                            for m in meds
                        ]
                    })

                appts = Appointment.objects.filter(patient_id=patient.patient_id).order_by('-date')[:5]
                context['appointments'] = [
                    {'id': a.appt_id, 'doctor': a.doctor_name, 'date': str(a.date), 'slot': a.time_slot, 'status': a.status, 'type': a.type, 'symptoms': a.symptoms}
                    for a in appts
                ]

                # Smartwatch details
                if hasattr(patient, 'smartwatch_device'):
                    device = patient.smartwatch_device
                    context['smartwatch_device'] = {
                        'name': device.device_name,
                        'type': device.device_type,
                        'is_connected': device.is_connected,
                        'battery': device.battery_level,
                        'last_sync': device.last_sync.strftime('%Y-%m-%d %H:%M:%S')
                    }
                else:
                    context['smartwatch_device'] = None

                sw_data = PatientSmartWatchData.objects.filter(patient=patient).order_by('-date')[:5]
                context['smartwatch_history'] = [
                    {
                        'date': str(d.date), 'hr': d.heart_rate, 'bp': f"{d.bp_systolic}/{d.bp_diastolic}", 
                        'spo2': d.spo2, 'steps': d.steps, 'calories': d.calories, 
                        'sleep_duration': d.sleep_duration, 'distance': d.distance
                    }
                    for d in sw_data
                ]

            except Exception as e:
                context['error'] = f"Failed to retrieve patient profile context: {str(e)}"

        elif role == 'doctor':
            try:
                doctor = user.doctorprofile
                context['specialization'] = doctor.specialization
                context['department'] = doctor.department.name if doctor.department else 'Unknown'
                context['doctor_id'] = doctor.doctor_id
                
                appts = Appointment.objects.filter(doctor_id=doctor.doctor_id).order_by('date', 'time_slot')
                context['appointments'] = [
                    {'id': a.appt_id, 'patient_id': a.patient_id, 'date': str(a.date), 'slot': a.time_slot, 'status': a.status, 'symptoms': a.symptoms}
                    for a in appts
                ]
            except Exception as e:
                context['error'] = f"Failed to retrieve doctor profile context: {str(e)}"

        elif role == 'labtech':
            try:
                requests = LabRequest.objects.all().order_by('-request_date')[:15]
                context['lab_requests'] = [
                    {'id': r.lab_id, 'patient': r.patient_name, 'test': r.test_name, 'category': r.test_category, 'priority': r.priority, 'status': r.status, 'date': str(r.request_date)}
                    for r in requests
                ]
            except Exception as e:
                context['error'] = f"Failed to retrieve laboratory context: {str(e)}"

        elif role == 'admin':
            try:
                context['system_stats'] = {
                    'total_patients': PatientProfile.objects.count(),
                    'total_doctors': DoctorProfile.objects.count(),
                    'total_appointments': Appointment.objects.count(),
                    'total_lab_requests': LabRequest.objects.count(),
                }
                logs = AuditLog.objects.all().order_by('-timestamp')[:5]
                context['recent_logs'] = [
                    {'time': l.timestamp.strftime('%H:%M:%S'), 'module': l.module, 'initiator': l.initiator, 'action': l.action}
                    for l in logs
                ]
            except Exception as e:
                context['error'] = f"Failed to retrieve admin context: {str(e)}"

        # 2. Query LLM or fall back to local rule-based response
        gemini_key = os.environ.get('GEMINI_API_KEY')
        if gemini_key:
            response_text = self._query_gemini(message, context, gemini_key)
        else:
            response_text = self._local_clinical_responder(message, context)

        # 3. Log interaction in Audits
        AuditLog.objects.create(
            module='ai_assistant',
            initiator=user.email,
            action=f"AI query by {user.role}: '{message[:40]}...'",
            flag='SECURE'
        )

        return Response({
            'response': response_text,
            'role': role,
            'context_verified': True
        })

    def _query_gemini(self, message, context, api_key):
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
        
        system_instruction = (
            f"You are CurePoint AI, an intelligent, empathetic, and professional healthcare assistant. "
            f"You are talking to a user named {context['username']} who is logged in as a {context['role'].upper()}. "
            f"Use the verified database context provided below to formulate your answers. "
            f"Never leak private clinical details of other patients. Patients should only receive advice about their own records. "
            f"Keep your answers concise, well-structured (using bullet points and bolding), and clinically sound."
        )

        prompt = (
            f"{system_instruction}\n\n"
            f"--- DATABASE CONTEXT ---\n"
            f"{json.dumps(context, indent=2)}\n\n"
            f"--- USER QUESTION ---\n"
            f"\"{message}\"\n\n"
            f"Answer:"
        )

        body = {
            "contents": [
                {
                    "parts": [
                        {"text": prompt}
                    ]
                }
            ]
        }

        try:
            req = urllib.request.Request(
                url,
                data=json.dumps(body).encode('utf-8'),
                headers={'Content-Type': 'application/json'},
                method='POST'
            )
            with urllib.request.urlopen(req, timeout=10) as response:
                res_data = json.loads(response.read().decode('utf-8'))
                return res_data['contents'][0]['parts'][0]['text']
        except Exception as e:
            # Fallback to local responder if API fails
            return f"(API Connection failed: {str(e)}) \n\n" + self._local_clinical_responder(message, context)

    def _local_clinical_responder(self, message, context):
        msg = message.lower()
        role = context['role']
        name = context['username']

        # Patient responses
        if role == 'patient':
            if 'prescription' in msg or 'medication' in msg or 'meds' in msg:
                rx_list = context.get('prescriptions', [])
                if not rx_list:
                    return f"Hi {name}, I couldn't find any prescriptions in your medical record. If you recently had a consultation, the prescribing doctor might still be finalizing the notes."
                
                res = f"Hi {name}, here are your recent prescriptions:\n\n"
                for r in rx_list:
                    res += f"**Diagnosis**: {r['diagnosis']} (Dated {r['date']}) by {r['doctor']}\n"
                    for m in r['medicines']:
                        res += f"- 💊 **{m['name']}**: Take {m['dosage']}, {m['frequency']} for {m['duration']}. *Instructions: {m['instructions']}*\n"
                res += "\n*Remember to follow the exact dosing instructions provided by your doctor. Do you have any questions about these medications?*"
                return res

            if 'lab' in msg or 'report' in msg or 'test' in msg:
                appts = context.get('appointments', [])
                res = f"Hi {name}, regarding your laboratory records:\n\n"
                
                # Check for laboratory records
                found_lab = False
                for a in appts:
                    if 'lab' in a.get('type', '').lower():
                        res += f"- **{a['type']}**: Scheduled on {a['date']} at {a['slot']} | Status: **{a['status'].upper()}**\n"
                        found_lab = True
                
                # Retrieve from allergies or general
                if not found_lab:
                    res += "I don't see any pending or completed laboratory reports registered in your profile.\n"
                else:
                    res += "\nYou can download completed PDF reports from the **Lab Reports** tab in your sidebar."
                return res

            if 'appointment' in msg or 'schedule' in msg or 'visit' in msg:
                appts = context.get('appointments', [])
                if not appts:
                    return f"Hi {name}, you have no scheduled appointments. You can book an appointment using the **New Appointment Wizard** on your dashboard."
                
                res = f"Hi {name}, here are your appointments:\n\n"
                for a in appts:
                    res += f"- 📅 **{a['type']}** with {a['doctor']} on {a['date']} @ {a['slot']} | Status: **{a['status'].upper()}**\n"
                    if a['symptoms']:
                        res += f"  *Symptoms: {a['symptoms']}*\n"
                return res

            if 'vital' in msg or 'blood pressure' in msg or 'bp' in msg or 'heart rate' in msg or 'temperature' in msg:
                vitals = context.get('vitals', [])
                if not vitals:
                    return f"Hi {name}, no vital signs have been recorded in the system yet. Ask your nurse or doctor to update your records during your next checkup."
                
                latest = vitals[0]
                return (
                    f"Hi {name}, here is your latest vitals check from **{latest['date']}**:\n\n"
                    f"- 🩸 **Blood Pressure**: {latest['bp']} mmHg\n"
                    f"- ❤️ **Heart Rate**: {latest['hr']} bpm\n"
                    f"- 🌡️ **Temperature**: {latest['temp']} °F\n"
                    f"- ⚖️ **Weight**: {latest['weight']} kg\n\n"
                    f"Your readings appear stable. If your blood pressure exceeds 140/90, please contact your care team immediately."
                )

            if 'smartwatch' in msg or 'steps' in msg or 'sleep' in msg or 'spo2' in msg or 'device' in msg:
                dev = context.get('smartwatch_device')
                if not dev:
                    return f"Hi {name}, you haven't connected a smart watch yet. Click **Connect Smart Watch** in the **Smart Watch** dashboard tab to sync your wearable device."
                
                history = context.get('smartwatch_history', [])
                res = (
                    f"Hi {name}, here is your wearable status:\n\n"
                    f"📶 **Device**: {dev['name']} ({dev['type']})\n"
                    f"🔋 **Battery**: {dev['battery']}% | Connected: **Yes**\n"
                    f"⏰ **Last Sync**: {dev['last_sync']}\n\n"
                )
                
                if history:
                    latest = history[0]
                    res += (
                        f"📊 **Latest Wearable Vitals ({latest['date']})**:\n"
                        f"- 👣 **Steps**: {latest['steps']:,} steps\n"
                        f"- ❤️ **Heart Rate**: {latest['hr']} bpm\n"
                        f"- 🩸 **BP**: {latest['bp']} mmHg\n"
                        f"- 🫁 **SpO2**: {latest['spo2']}%\n"
                        f"- 😴 **Sleep**: {latest['sleep_duration']} hours\n"
                        f"- 🔥 **Calories**: {latest['calories']} kcal\n\n"
                    )
                    
                    # Alerts check
                    alerts = []
                    if latest['hr'] > 100:
                        alerts.append("⚠️ High Heart Rate detected during rest.")
                    if latest['spo2'] < 95:
                        alerts.append("⚠️ Low Blood Oxygen (SpO2) level.")
                    if latest['bp'] and int(latest['bp'].split('/')[0]) > 130:
                        alerts.append("⚠️ Elevated Blood Pressure recorded.")
                    
                    if alerts:
                        res += "**Wearable Alerts:**\n" + "\n".join(alerts) + "\n\n"
                    else:
                        res += "✅ All wearable vitals are within normal target ranges."
                else:
                    res += "No activity trends are synced yet. Press **Sync Data** to upload history."
                return res

            if 'tips' in msg or 'health tips' in msg or 'diet' in msg:
                allergies = context.get('allergies', 'None')
                history = context.get('medical_history', [])
                
                res = f"Hi {name}, here are some customized health tips for you:\n\n"
                res += "1. 💧 **Hydration**: Drink at least 8-10 glasses of water daily to maintain electrolyte balance.\n"
                res += "2. 🚶 **Daily Movement**: Target at least 7,500 steps per day using your smartwatch to strengthen cardiovascular health.\n"
                
                # Check for specific medical conditions
                conditions = [h['condition'].lower() for h in history]
                if any('hypertension' in c for c in conditions):
                    res += "3. 🧂 **Low Sodium**: Reduce salt intake to under 2,000 mg daily to manage blood pressure.\n"
                if any('diabetes' in c for c in conditions):
                    res += "4. 🍞 **Carb Control**: Focus on complex carbohydrates and high-fiber foods to regulate blood glucose.\n"
                
                if allergies and allergies != 'None':
                    res += f"\n*Note: Keep in mind your active allergy to **{allergies}** when trying new diets.*"
                return res

            return (
                f"Hello {name}! I am the **CurePoint AI Assistant**.\n\n"
                f"I can help you review your healthcare information. Try asking me:\n"
                f"- 📅 *\"Show my appointments\"*\n"
                f"- 💊 *\"Explain my prescription\"*\n"
                f"- 🩸 *\"What was my last blood pressure reading?\"*\n"
                f"- ⌚ *\"Give me smartwatch insights\"*\n"
                f"- 🥗 *\"Give me health tips\"*"
            )

        # Doctor responses
        elif role == 'doctor':
            if 'consultation' in msg or 'appointment' in msg or 'schedule' in msg:
                appts = context.get('appointments', [])
                if not appts:
                    return f"Hello Dr. {name}, you have no consultations scheduled in your calendar for today."
                
                res = f"Hello Dr. {name}, here is your schedule:\n\n"
                for a in appts:
                    res += f"- 🕒 Slot **{a['slot']}**: Patient ID: {a['patient_id']} | Symptoms: {a['symptoms']} | Status: **{a['status'].upper()}**\n"
                return res

            if 'summary' in msg or 'patient' in msg:
                appts = context.get('appointments', [])
                patient_ids = list(set([a['patient_id'] for a in appts if a['patient_id']]))
                if not patient_ids:
                    return f"Dr. {name}, you do not have any assigned patients in today's clinics."
                return f"Dr. {name}, you are scheduled to consult with patients: {', '.join(patient_ids)} today. You can view their full charts by selecting them in the patient lookup panel."

            if 'interaction' in msg or 'drug' in msg:
                return (
                    "🔬 **Clinical Drug Interaction Warnings (Reference)**:\n\n"
                    "- 🚫 **ACE Inhibitors (e.g. Lisinopril) + Potassium Supplements**: High risk of hyperkalemia.\n"
                    "- 🚫 **Metformin + Contrast Media**: Hold Metformin for 48 hours post-iodinated contrast to prevent lactic acidosis.\n"
                    "- 🚫 **Propranolol + Albuterol**: Beta-blockers antagonize beta-agonists. Do not co-prescribe to asthmatics."
                )

            return (
                f"Welcome back, Dr. {name}.\n\n"
                f"I can assist you with clinical navigation. Try asking me:\n"
                f"- 📅 *\"Show today's consultations\"*\n"
                f"- 🔬 *\"Review drug interactions for Metformin\"*\n"
                f"- 📋 *\"Show patient summary\"*"
            )

        # Lab tech responses
        elif role == 'labtech':
            if 'pending' in msg or 'order' in msg or 'workflow' in msg:
                reqs = context.get('lab_requests', [])
                pending = [r for r in reqs if r['status'] == 'pending']
                if not pending:
                    return "All lab requests have been registered and processed. There are no pending requests at this time."
                
                res = f"Here are the **Pending Lab Orders** ({len(pending)} total):\n\n"
                for p in pending[:5]:
                    res += f"- 🧪 ID: **{p['id']}** | Test: {p['test']} ({p['category']}) | Priority: **{p['priority']}** | Date: {p['date']}\n"
                res += "\nTo progress these samples, select the request and proceed with **Sample Collection** or **Result Entry**."
                return res

            return (
                f"Hello Technician {name}.\n\n"
                f"How can I assist you in the lab workflow today? Quick options:\n"
                f"- 🧪 *\"Show pending lab orders\"*\n"
                f"- 📖 *\"Sample workflow guidance\"*\n"
                f"- 🗂️ *\"Laboratory SOP help\"*"
            )

        # Admin responses
        elif role == 'admin':
            if 'revenue' in msg or 'overview' in msg or 'stats' in msg:
                stats = context.get('system_stats', {})
                logs = context.get('recent_logs', [])
                
                res = (
                    f"📊 **CurePoint System Overview**:\n\n"
                    f"- 👥 **Total Patients**: {stats.get('total_patients', 0)}\n"
                    f"- 🩺 **Total Doctors**: {stats.get('total_doctors', 0)}\n"
                    f"- 📅 **Total Appointments**: {stats.get('total_appointments', 0)}\n"
                    f"- 🧪 **Total Lab Requests**: {stats.get('total_lab_requests', 0)}\n\n"
                )
                
                if logs:
                    res += "**Recent Audited System Activity:**\n"
                    for l in logs:
                        res += f"- [{l['time']}] **{l['initiator']}** did: {l['action']} ({l['module']})\n"
                return res

            return (
                f"System Admin Console AI - Active.\n\n"
                f"Welcome, {name}. I can provide overview reporting on system operations. Ask me:\n"
                f"- 📊 *\"Revenue and hospital stats overview\"*\n"
                f"- 🔒 *\"Show recent audit logs\"*\n"
                f"- 👥 *\"Staff management guidance\"*"
            )

        return f"Hello, how can I help you today?"
