from rest_framework import serializers
from .models import Consultation

class ConsultationSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='consultation_id')
    patientId = serializers.CharField(source='patient_id')
    doctorName = serializers.CharField(source='doctor_name')
    consultationDate = serializers.DateField(source='consultation_date', required=False)

    # Extra fields for single transaction save
    vitals = serializers.JSONField(required=False, write_only=True)
    prescription = serializers.JSONField(required=False, write_only=True)
    labRequest = serializers.JSONField(required=False, write_only=True)
    appointmentId = serializers.CharField(required=False, write_only=True, allow_blank=True, allow_null=True)
    followup = serializers.JSONField(required=False, write_only=True)

    class Meta:
        model = Consultation
        fields = (
            'id', 'patientId', 'doctorName', 'diagnosis', 'consultationDate', 'symptoms', 'recommendations',
            'vitals', 'prescription', 'labRequest', 'appointmentId', 'followup'
        )

    def create(self, validated_data):
        from django.db import transaction
        from django.utils import timezone
        from patients.models import PatientProfile, PatientVital, PatientMedicalHistory, PatientVisit
        from prescriptions.models import Prescription, PrescriptionMedicine
        from laboratory.models import LabRequest
        from appointments.models import Appointment

        patient_id = validated_data.get('patient_id')
        doctor_name = validated_data.get('doctor_name')
        diagnosis = validated_data.get('diagnosis')
        consultation_id = validated_data.get('consultation_id')
        consultation_date = validated_data.get('consultation_date') or timezone.now().date()
        symptoms = validated_data.get('symptoms', '')
        recommendations = validated_data.get('recommendations', '')

        vitals_data = validated_data.pop('vitals', None)
        prescription_data = validated_data.pop('prescription', None)
        lab_request_data = validated_data.pop('labRequest', None)
        appointment_id = validated_data.pop('appointmentId', None)
        followup_data = validated_data.pop('followup', None)

        with transaction.atomic():
            # 1. Create/Update Consultation
            consult, created = Consultation.objects.update_or_create(
                consultation_id=consultation_id,
                defaults={
                    'patient_id': patient_id,
                    'doctor_name': doctor_name,
                    'diagnosis': diagnosis,
                    'consultation_date': consultation_date,
                    'symptoms': symptoms,
                    'recommendations': recommendations
                }
            )

            patient = PatientProfile.objects.filter(patient_id=patient_id).first()

            # 2. Save Patient Vitals
            if vitals_data and patient:
                defaults = {
                    'bp_systolic': vitals_data.get('bpSystolic', 120),
                    'bp_diastolic': vitals_data.get('bpDiastolic', 80),
                    'heart_rate': vitals_data.get('heartRate', 72),
                    'temp': vitals_data.get('temp', 98.6),
                    'weight': vitals_data.get('weight', 70.0)
                }
                vital = PatientVital.objects.filter(patient=patient, date=consultation_date).first()
                if vital:
                    for key, val in defaults.items():
                        setattr(vital, key, val)
                    vital.save()
                else:
                    PatientVital.objects.create(patient=patient, date=consultation_date, **defaults)

            # 3. Save Patient Medical History
            if patient:
                defaults = {
                    'diagnosed_by': doctor_name,
                    'status': 'Active',
                    'notes': recommendations or ''
                }
                history = PatientMedicalHistory.objects.filter(patient=patient, date=consultation_date, condition=diagnosis).first()
                if history:
                    for key, val in defaults.items():
                        setattr(history, key, val)
                    history.save()
                else:
                    PatientMedicalHistory.objects.create(patient=patient, date=consultation_date, condition=diagnosis, **defaults)

            # 4. Save Patient Visit
            if patient:
                from doctors.models import DoctorProfile
                doctor_profile = DoctorProfile.objects.filter(user__name=doctor_name).first()
                dept_name = 'General Medicine'
                if doctor_profile and doctor_profile.department:
                    dept_name = doctor_profile.department.name

                defaults = {
                    'department': dept_name,
                    'doctor_name': doctor_name,
                    'notes': recommendations or ''
                }
                visit = PatientVisit.objects.filter(patient=patient, date=consultation_date, reason=diagnosis).first()
                if visit:
                    for key, val in defaults.items():
                        setattr(visit, key, val)
                    visit.save()
                else:
                    PatientVisit.objects.create(patient=patient, date=consultation_date, reason=diagnosis, **defaults)

            # 5. Save Prescription & PrescriptionMedicine
            if prescription_data:
                rx_id = prescription_data.get('id') or f"rx-{int(timezone.now().timestamp())}"
                prescription_obj, rx_created = Prescription.objects.update_or_create(
                    prescription_id=rx_id,
                    defaults={
                        'patient_id': patient_id,
                        'doctor_name': doctor_name,
                        'date': consultation_date,
                        'diagnosis': diagnosis
                    }
                )
                # Delete existing medicines to prevent duplicates
                prescription_obj.medicines.all().delete()

                medicines = prescription_data.get('medicines', [])
                for med in medicines:
                    PrescriptionMedicine.objects.create(
                        prescription=prescription_obj,
                        name=med.get('name'),
                        dosage=med.get('dosage'),
                        frequency=med.get('frequency', ''),
                        duration=med.get('duration'),
                        route=med.get('route', ''),
                        instructions=med.get('instructions', ''),
                        notes=med.get('notes', '')
                    )

            # 6. Save LabRequest (Pending Lab Order)
            if lab_request_data:
                lab_id = lab_request_data.get('id') or f"lab-{int(timezone.now().timestamp())}"
                patient_name = patient.user.name if (patient and patient.user) else 'Unknown'
                LabRequest.objects.update_or_create(
                    lab_id=lab_id,
                    defaults={
                        'patient_id': patient_id,
                        'patient_name': patient_name,
                        'doctor_name': doctor_name,
                        'test_category': lab_request_data.get('testCategory', 'Blood Test'),
                        'test_name': lab_request_data.get('testName'),
                        'request_date': consultation_date,
                        'status': 'pending',
                        'priority': lab_request_data.get('priority', 'Medium'),
                        'consultation_id': consultation_id,
                        'appointment_id': appointment_id or '',
                        'doctor_notes': recommendations or ''
                    }
                )

            # 7. Complete Current Appointment
            if appointment_id:
                Appointment.objects.filter(appt_id=appointment_id).update(status='completed')

            # 8. Schedule Follow-up Appointment
            if followup_data:
                appt_id = followup_data.get('id') or f"appt-{int(timezone.now().timestamp())}"
                from doctors.models import DoctorProfile
                doctor_profile = DoctorProfile.objects.filter(user__name=doctor_name).first()
                doctor_id = doctor_profile.doctor_id if doctor_profile else 'doc-1'
                dept_name = doctor_profile.department.name if (doctor_profile and doctor_profile.department) else 'General Medicine'

                Appointment.objects.update_or_create(
                    appt_id=appt_id,
                    defaults={
                        'patient_id': patient_id,
                        'doctor_id': doctor_id,
                        'doctor_name': doctor_name,
                        'dept_name': dept_name,
                        'date': followup_data.get('date'),
                        'time_slot': followup_data.get('timeSlot'),
                        'symptoms': f"Scheduled clinical follow-up for: {diagnosis}",
                        'status': 'confirmed',
                        'type': 'Doctor Checkup'
                    }
                )

        return consult
