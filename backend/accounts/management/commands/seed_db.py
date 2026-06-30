from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from accounts.models import AuditLog, AdminProfile
from doctors.models import Department, DoctorProfile
from patients.models import PatientProfile, PatientVital, PatientMedicalHistory, PatientVisit, PatientFile
from appointments.models import Appointment
from prescriptions.models import Prescription, PrescriptionMedicine
from laboratory.models import LabRequest, LabResult, LabTechnicianProfile
import os

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds the EHR Laboratory Management Portal database with default demo data'

    def handle(self, *args, **options):
        self.stdout.write('Starting database seeding...')

        # Clear existing data
        self.stdout.write('Clearing old records...')
        User.objects.all().delete()
        Department.objects.all().delete()
        DoctorProfile.objects.all().delete()
        PatientProfile.objects.all().delete()
        AdminProfile.objects.all().delete()
        LabTechnicianProfile.objects.all().delete()
        PatientVital.objects.all().delete()
        PatientMedicalHistory.objects.all().delete()
        PatientVisit.objects.all().delete()
        PatientFile.objects.all().delete()
        Appointment.objects.all().delete()
        Prescription.objects.all().delete()
        PrescriptionMedicine.objects.all().delete()
        LabRequest.objects.all().delete()
        LabResult.objects.all().delete()
        AuditLog.objects.all().delete()

        # 1. Seed Departments
        depts = {}
        depts_data = [
            { 'dept_id': 'dept-1', 'name': 'General Medicine', 'head': 'Dr. Sarah Connor', 'staff_count': 12 },
            { 'dept_id': 'dept-2', 'name': 'Cardiology', 'head': 'Dr. Robert Chen', 'staff_count': 8 },
            { 'dept_id': 'dept-3', 'name': 'Neurology', 'head': 'Dr. Alice Vance', 'staff_count': 6 },
            { 'dept_id': 'dept-4', 'name': 'Pediatrics', 'head': 'Dr. Emily Watson', 'staff_count': 10 },
            { 'dept_id': 'dept-5', 'name': 'Radiology', 'head': 'Dr. Marcus Aurelius', 'staff_count': 9 },
            { 'dept_id': 'dept-6', 'name': 'Pathology & Lab', 'head': 'Dr. Gregory House', 'staff_count': 14 }
        ]
        for d in depts_data:
            dept = Department.objects.create(**d)
            depts[d['dept_id']] = dept

        # 2. Seed Users
        users_data = [
            { 'email': 'admin@ehrmail.com', 'password': 'password123', 'name': 'Administrator', 'role': 'admin', 'is_staff': True, 'is_superuser': True },
            { 'email': 'sarah.connor@ehrmail.com', 'password': 'password123', 'name': 'Dr. Sarah Connor', 'role': 'doctor' },
            { 'email': 'robert.chen@ehrmail.com', 'password': 'password123', 'name': 'Dr. Robert Chen', 'role': 'doctor' },
            { 'email': 'labtech@ehrmail.com', 'password': 'password123', 'name': 'Alex Mercer', 'role': 'labtech' },
            { 'email': 'john.doe@ehrmail.com', 'password': 'password123', 'name': 'John Doe', 'role': 'patient' },
            { 'email': 'emma.watson@ehrmail.com', 'password': 'password123', 'name': 'Emma Watson', 'role': 'patient' }
        ]

        users = {}
        for ud in users_data:
            password = ud.pop('password')
            user = User.objects.create_user(**ud)
            user.set_password(password)
            user.save()
            users[ud['email']] = user

        # Create profiles for admin and lab tech
        AdminProfile.objects.create(
            user=users['admin@ehrmail.com'],
            employee_id='emp-admin-1',
            department='IT & Administration',
            access_level='Super Admin'
        )
        LabTechnicianProfile.objects.create(
            user=users['labtech@ehrmail.com'],
            employee_id='emp-labtech-1',
            qualification='Senior Lab Scientist',
            shift='Day'
        )

        # 3. Seed Doctor Profiles
        doctors_data = [
            { 'email': 'sarah.connor@ehrmail.com', 'doctor_id': 'doc-1', 'dept_id': 'dept-1', 'specialization': 'Family Physician' },
            { 'email': 'robert.chen@ehrmail.com', 'doctor_id': 'doc-2', 'dept_id': 'dept-2', 'specialization': 'Interventional Cardiologist' }
        ]
        for dd in doctors_data:
            user = users[dd['email']]
            DoctorProfile.objects.create(
                user=user,
                doctor_id=dd['doctor_id'],
                specialization=dd['specialization'],
                department=depts[dd['dept_id']]
            )

        # 4. Seed Patient Profiles
        patients_data = [
            {
                'email': 'john.doe@ehrmail.com',
                'patient_id': 'pat-1',
                'dob': '1988-05-14',
                'gender': 'Male',
                'blood_group': 'O+',
                'phone': '+1 (555) 019-2834',
                'emergency_name': 'Jane Doe',
                'emergency_phone': '+1 (555) 019-2835',
                'allergies': 'Penicillin, Shellfish'
            },
            {
                'email': 'emma.watson@ehrmail.com',
                'patient_id': 'pat-2',
                'dob': '1995-10-22',
                'gender': 'Female',
                'blood_group': 'A-',
                'phone': '+1 (555) 014-9988',
                'emergency_name': 'Arthur Watson',
                'emergency_phone': '+1 (555) 014-9980',
                'allergies': 'Peanuts'
            }
        ]

        patients = {}
        for pd in patients_data:
            user = users[pd['email']]
            profile = PatientProfile.objects.create(
                user=user,
                patient_id=pd['patient_id'],
                dob=pd['dob'],
                gender=pd['gender'],
                blood_group=pd['blood_group'],
                phone=pd['phone'],
                emergency_name=pd['emergency_name'],
                emergency_phone=pd['emergency_phone'],
                allergies=pd['allergies']
            )
            patients[pd['patient_id']] = profile

        # Vitals History
        vitals_data = [
            { 'patient_id': 'pat-1', 'date': '2026-05-01', 'bp_systolic': 120, 'bp_diastolic': 80, 'heart_rate': 72, 'temp': 98.6, 'weight': 78 },
            { 'patient_id': 'pat-1', 'date': '2026-05-15', 'bp_systolic': 124, 'bp_diastolic': 82, 'heart_rate': 75, 'temp': 98.4, 'weight': 77 },
            { 'patient_id': 'pat-1', 'date': '2026-06-01', 'bp_systolic': 118, 'bp_diastolic': 79, 'heart_rate': 70, 'temp': 98.6, 'weight': 76.5 },
            { 'patient_id': 'pat-1', 'date': '2026-06-15', 'bp_systolic': 121, 'bp_diastolic': 80, 'heart_rate': 73, 'temp': 98.8, 'weight': 77.2 },
            { 'patient_id': 'pat-2', 'date': '2026-06-10', 'bp_systolic': 110, 'bp_diastolic': 70, 'heart_rate': 68, 'temp': 98.2, 'weight': 58 }
        ]
        for vd in vitals_data:
            pat_id = vd.pop('patient_id')
            PatientVital.objects.create(patient=patients[pat_id], **vd)

        # Medical History
        history_data = [
            { 'patient_id': 'pat-1', 'date': '2025-11-10', 'condition': 'Mild Hypertension', 'diagnosed_by': 'Dr. Sarah Connor', 'status': 'Managed' },
            { 'patient_id': 'pat-1', 'date': '2026-02-14', 'condition': 'Seasonal Influenza', 'diagnosed_by': 'Dr. Sarah Connor', 'status': 'Recovered' },
            { 'patient_id': 'pat-2', 'date': '2026-03-05', 'condition': 'Vitamin D Deficiency', 'diagnosed_by': 'Dr. Emily Watson', 'status': 'Active' }
        ]
        for hd in history_data:
            pat_id = hd.pop('patient_id')
            PatientMedicalHistory.objects.create(patient=patients[pat_id], **hd)

        # Hospital Visits
        visits_data = [
            { 'patient_id': 'pat-1', 'date': '2026-05-01', 'department': 'General Medicine', 'doctor_name': 'Dr. Sarah Connor', 'reason': 'Initial consult for blood pressure tracking.' },
            { 'patient_id': 'pat-1', 'date': '2026-05-15', 'department': 'General Medicine', 'doctor_name': 'Dr. Sarah Connor', 'reason': 'Follow-up visit and prescription adjustment.' },
            { 'patient_id': 'pat-2', 'date': '2026-06-10', 'department': 'Pediatrics', 'doctor_name': 'Dr. Emily Watson', 'reason': 'Routine health assessment & vitamin checkup.' }
        ]
        for vd in visits_data:
            pat_id = vd.pop('patient_id')
            PatientVisit.objects.create(patient=patients[pat_id], **vd)

        # Files
        files_data = [
            { 'patient_id': 'pat-1', 'name': 'Lab_CBC_May_Report.pdf', 'size': '1.4 MB', 'type': 'application/pdf', 'date': '2026-05-16' }
        ]
        for fd in files_data:
            pat_id = fd.pop('patient_id')
            PatientFile.objects.create(patient=patients[pat_id], **fd)

        # 5. Seed Appointments
        appts_data = [
            { 'appt_id': 'appt-1', 'patient_id': 'pat-1', 'doctor_id': 'doc-1', 'doctor_name': 'Dr. Sarah Connor', 'dept_name': 'General Medicine', 'date': '2026-06-20', 'time_slot': '09:30 AM', 'symptoms': 'Follow-up on blood pressure regulation.', 'status': 'confirmed', 'type': 'Doctor Checkup' },
            { 'appt_id': 'appt-2', 'patient_id': 'pat-2', 'doctor_id': 'doc-4', 'doctor_name': 'Dr. Emily Watson', 'dept_name': 'Pediatrics', 'date': '2026-06-22', 'time_slot': '11:00 AM', 'symptoms': 'Routine health checkup and vitamin consultation.', 'status': 'confirmed', 'type': 'Doctor Checkup' },
            { 'appt_id': 'appt-3', 'patient_id': 'pat-1', 'doctor_id': 'doc-1', 'doctor_name': 'Dr. Sarah Connor', 'dept_name': 'General Medicine', 'date': '2026-06-25', 'time_slot': '10:30 AM', 'symptoms': 'BP check and medication renewal.', 'status': 'confirmed', 'type': 'Doctor Checkup' }
        ]
        for ad in appts_data:
            Appointment.objects.create(**ad)

        # 6. Seed Prescriptions
        rx_data = [
            {
                'prescription_id': 'rx-1',
                'patient_id': 'pat-1',
                'doctor_name': 'Dr. Sarah Connor',
                'date': '2026-05-15',
                'diagnosis': 'Mild Hypertension',
                'medicines': [
                    { 'name': 'Lisinopril 10mg', 'dosage': '1 tablet daily', 'duration': '30 days', 'instructions': 'Take in the morning with water' },
                    { 'name': 'Amlodipine 5mg', 'dosage': '1 tablet daily', 'duration': '30 days', 'instructions': 'Take at night if BP is elevated' }
                ]
            }
        ]
        for rd in rx_data:
            meds = rd.pop('medicines')
            rx = Prescription.objects.create(**rd)
            for m in meds:
                PrescriptionMedicine.objects.create(prescription=rx, **m)

        # 7. Seed Lab Requests
        lab_data = [
            {
                'lab_id': 'lab-1',
                'patient_id': 'pat-1',
                'patient_name': 'John Doe',
                'doctor_name': 'Dr. Sarah Connor',
                'test_category': 'Blood Test',
                'test_name': 'Complete Blood Count (CBC)',
                'request_date': '2026-06-15',
                'status': 'completed',
                'result_date': '2026-06-16',
                'technician': 'Alex Mercer',
                'priority': 'High',
                'results': [
                    { 'parameter': 'White Blood Cell (WBC)', 'value': 6.8, 'unit': '10^3/uL', 'ref_range': '4.5 - 11.0', 'flag': 'Normal' },
                    { 'parameter': 'Red Blood Cell (RBC)', 'value': 4.9, 'unit': '10^6/uL', 'ref_range': '4.3 - 5.9', 'flag': 'Normal' },
                    { 'parameter': 'Hemoglobin (Hgb)', 'value': 14.8, 'unit': 'g/dL', 'ref_range': '13.5 - 17.5', 'flag': 'Normal' },
                    { 'parameter': 'Platelets', 'value': 245, 'unit': '10^3/uL', 'ref_range': '150 - 450', 'flag': 'Normal' }
                ]
            },
            {
                'lab_id': 'lab-2',
                'patient_id': 'pat-1',
                'patient_name': 'John Doe',
                'doctor_name': 'Dr. Sarah Connor',
                'test_category': 'Lipid Panel',
                'test_name': 'Cholesterol Profile',
                'request_date': '2026-06-18',
                'status': 'pending',
                'result_date': None,
                'technician': '',
                'priority': 'Medium',
                'results': []
            }
        ]
        for ld in lab_data:
            res_list = ld.pop('results')
            lab = LabRequest.objects.create(**ld)
            for rl in res_list:
                LabResult.objects.create(lab_request=lab, **rl)

        # 8. Seed Audit Logs
        audits_data = [
            { 'timestamp': '2026-06-22 09:30:00', 'module': 'accounts', 'initiator': 'admin@ehrmail.com', 'action': 'Administrator console session started.', 'flag': 'SECURE' },
            { 'timestamp': '2026-06-21 16:15:34', 'module': 'laboratory', 'initiator': 'labtech@ehrmail.com', 'action': 'Authorized results compiled for complete blood count CBC.', 'flag': 'SECURE' },
            { 'timestamp': '2026-06-20 11:22:12', 'module': 'patients', 'initiator': 'system', 'action': 'Patient profile record pat-1 demographics update.', 'flag': 'SECURE' },
            { 'timestamp': '2026-06-20 09:44:22', 'module': 'doctors', 'initiator': 'sarah.connor@ehrmail.com', 'action': 'New digital prescription rx-1 issued.', 'flag': 'SECURE' }
        ]
        for ad in audits_data:
            # Parse datetime
            import datetime
            dt = datetime.datetime.strptime(ad['timestamp'], '%Y-%m-%d %H:%M:%S')
            dt = timezone.make_aware(dt)
            AuditLog.objects.create(timestamp=dt, module=ad['module'], initiator=ad['initiator'], action=ad['action'], flag=ad['flag'])

        self.stdout.write(self.style.SUCCESS('Successfully seeded database!'))
