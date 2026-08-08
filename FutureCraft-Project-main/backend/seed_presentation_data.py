import os
import django
from django.utils import timezone

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'EHRLabPortal.settings')
django.setup()

from appointments.models import Appointment
from consultations.models import Consultation
from prescriptions.models import Prescription, PrescriptionMedicine
from laboratory.models import LabRequest, LabResult
from patients.models import PatientProfile, PatientVital, PatientMedicalHistory, PatientVisit, PatientBilling
from doctors.models import DoctorProfile, DoctorLeaveRequest, DoctorReview
from accounts.models import AuditLog, CustomUser

print("Cleaning existing database transactions for presentation...")
Appointment.objects.all().delete()
Consultation.objects.all().delete()
PrescriptionMedicine.objects.all().delete()
Prescription.objects.all().delete()
LabResult.objects.all().delete()
LabRequest.objects.all().delete()
PatientVital.objects.all().delete()
PatientMedicalHistory.objects.all().delete()
PatientVisit.objects.all().delete()
PatientBilling.objects.all().delete()
DoctorLeaveRequest.objects.all().delete()
DoctorReview.objects.all().delete()
AuditLog.objects.all().delete()

print("Seeding fresh, fully populated presentation workflow data...")

import datetime
today = timezone.now().date()
d1 = today - datetime.timedelta(days=30)
d2 = today - datetime.timedelta(days=20)
d3 = today - datetime.timedelta(days=10)
d4 = today

pat1 = PatientProfile.objects.filter(patient_id="pat-1").first()
pat2 = PatientProfile.objects.filter(patient_id="pat-2").first()
pat3 = PatientProfile.objects.filter(patient_id="pat-3").first()
pat4 = PatientProfile.objects.filter(patient_id="pat-4").first()
pat5 = PatientProfile.objects.filter(patient_id="pat-5").first()

# ==============================================================================
# WORKFLOW A: VITALS HISTORY & CLINICAL DATA
# ==============================================================================

# Patient 1 Vitals & History
if pat1:
    PatientVital.objects.create(patient=pat1, date=d1, bp_systolic=120, bp_diastolic=80, heart_rate=72, temp=98.6, weight=78)
    PatientVital.objects.create(patient=pat1, date=d2, bp_systolic=124, bp_diastolic=82, heart_rate=75, temp=98.4, weight=77)
    PatientVital.objects.create(patient=pat1, date=d3, bp_systolic=118, bp_diastolic=79, heart_rate=70, temp=98.6, weight=76.5)
    PatientVital.objects.create(patient=pat1, date=d4, bp_systolic=121, bp_diastolic=80, heart_rate=73, temp=98.8, weight=77.2)

    PatientMedicalHistory.objects.create(patient=pat1, date=d1, condition="Mild Hypertension", diagnosed_by="Dr. Sarah Connor", status="Managed")
    PatientMedicalHistory.objects.create(patient=pat1, date=d2, condition="Seasonal Influenza", diagnosed_by="Dr. Sarah Connor", status="Recovered")

    PatientVisit.objects.create(patient=pat1, date=d1, department="General Medicine", doctor_name="Dr. Sarah Connor", reason="Initial consult for blood pressure tracking.")
    PatientVisit.objects.create(patient=pat1, date=d2, department="General Medicine", doctor_name="Dr. Sarah Connor", reason="Follow-up visit and prescription adjustment.")

# Patient 2 Vitals & History
if pat2:
    PatientVital.objects.create(patient=pat2, date=d3, bp_systolic=110, bp_diastolic=70, heart_rate=68, temp=98.2, weight=58)
    PatientMedicalHistory.objects.create(patient=pat2, date=d3, condition="Vitamin D Deficiency", diagnosed_by="Dr. Emily Watson", status="Active")
    PatientVisit.objects.create(patient=pat2, date=d3, department="Pediatrics", doctor_name="Dr. Emily Watson", reason="Routine health assessment & vitamin checkup.")

# Patient 3 Vitals & History
if pat3:
    PatientVital.objects.create(patient=pat3, date=d1, bp_systolic=130, bp_diastolic=85, heart_rate=76, temp=98.4, weight=82.0)
    PatientVital.objects.create(patient=pat3, date=d2, bp_systolic=128, bp_diastolic=84, heart_rate=74, temp=98.6, weight=81.5)
    PatientVital.objects.create(patient=pat3, date=d3, bp_systolic=125, bp_diastolic=82, heart_rate=72, temp=98.5, weight=81.2)
    PatientVital.objects.create(patient=pat3, date=d4, bp_systolic=122, bp_diastolic=80, heart_rate=70, temp=98.6, weight=80.8)

    PatientMedicalHistory.objects.create(patient=pat3, date=d1, condition="Type 2 Diabetes", diagnosed_by="Dr. Robert Chen", status="Active")
    PatientVisit.objects.create(patient=pat3, date=d1, department="Cardiology", doctor_name="Dr. Robert Chen", reason="Diabetes management review and ECG check.")

# Patient 4 Vitals & History
if pat4:
    PatientVital.objects.create(patient=pat4, date=d1, bp_systolic=112, bp_diastolic=72, heart_rate=65, temp=98.7, weight=54.0)
    PatientVital.objects.create(patient=pat4, date=d2, bp_systolic=115, bp_diastolic=75, heart_rate=68, temp=98.8, weight=54.2)
    PatientVital.objects.create(patient=pat4, date=d3, bp_systolic=118, bp_diastolic=76, heart_rate=70, temp=98.6, weight=54.5)
    PatientVital.objects.create(patient=pat4, date=d4, bp_systolic=114, bp_diastolic=74, heart_rate=67, temp=98.6, weight=54.1)

    PatientMedicalHistory.objects.create(patient=pat4, date=d1, condition="Chronic Migraine", diagnosed_by="Dr. Alice Vance", status="Managed")
    PatientVisit.objects.create(patient=pat4, date=d1, department="Neurology", doctor_name="Dr. Alice Vance", reason="Consultation regarding frequent cluster migraines.")

# Patient 5 Vitals & History
if pat5:
    PatientVital.objects.create(patient=pat5, date=d1, bp_systolic=145, bp_diastolic=95, heart_rate=98, temp=99.1, weight=85.0)
    PatientVital.objects.create(patient=pat5, date=d2, bp_systolic=140, bp_diastolic=90, heart_rate=92, temp=98.9, weight=84.5)
    PatientVital.objects.create(patient=pat5, date=d3, bp_systolic=135, bp_diastolic=88, heart_rate=85, temp=98.7, weight=84.2)
    PatientVital.objects.create(patient=pat5, date=d4, bp_systolic=130, bp_diastolic=84, heart_rate=80, temp=98.6, weight=83.8)

    PatientMedicalHistory.objects.create(patient=pat5, date=d1, condition="Elevated Heart Rate", diagnosed_by="Dr. Sarah Connor", status="Active")
    PatientVisit.objects.create(patient=pat5, date=d1, department="General Medicine", doctor_name="Dr. Sarah Connor", reason="Initial checkup for chronic heart rate spikes.")


# ==============================================================================
# WORKFLOW B: COMPLETED CONSULTATIONS & PRESCRIPTIONS
# ==============================================================================

# Consultations
Consultation.objects.create(
    consultation_id="con-pres-101",
    patient_id="pat-1",
    doctor_name="Dr. Sarah Connor",
    diagnosis="Mild Essential Hypertension",
    consultation_date=today,
    symptoms="Occasional morning headache and chest tightness",
    recommendations="Start low sodium diet. Exercise 30 minutes daily. Follow up in 2 weeks."
)

Consultation.objects.create(
    consultation_id="con-pres-102",
    patient_id="pat-3",
    doctor_name="Dr. Robert Chen",
    diagnosis="Type 2 Diabetes",
    consultation_date=today,
    symptoms="Increased thirst and mild fatigue.",
    recommendations="Monitor blood glucose daily. Reduce carbohydrate intake."
)

# Prescriptions
rx1 = Prescription.objects.create(prescription_id="rx-pres-201", patient_id="pat-1", doctor_name="Dr. Sarah Connor", date=today, diagnosis="Mild Essential Hypertension")
PrescriptionMedicine.objects.create(prescription=rx1, name="Lisinopril 10mg", dosage="1 tablet", frequency="Once daily", duration="30 days", route="Oral", instructions="Take in the morning with water", notes="Take in the morning with water")

rx2 = Prescription.objects.create(prescription_id="rx-pres-202", patient_id="pat-3", doctor_name="Dr. Robert Chen", date=today, diagnosis="Type 2 Diabetes")
PrescriptionMedicine.objects.create(prescription=rx2, name="Metformin 500mg", dosage="1 tablet", frequency="Twice daily", duration="60 days", route="Oral", instructions="Take with meals", notes="Take with dinner")

rx3 = Prescription.objects.create(prescription_id="rx-pres-203", patient_id="pat-4", doctor_name="Dr. Alice Vance", date=today, diagnosis="Chronic Migraine")
PrescriptionMedicine.objects.create(prescription=rx3, name="Sumatriptan 50mg", dosage="1 tablet", frequency="As needed", duration="30 days", route="Oral", instructions="Take at onset of migraine aura", notes="Maximum 2 tablets in 24 hours")

rx4 = Prescription.objects.create(prescription_id="rx-pres-204", patient_id="pat-5", doctor_name="Dr. Sarah Connor", date=today, diagnosis="Elevated Heart Rate")
PrescriptionMedicine.objects.create(prescription=rx4, name="Propranolol 20mg", dosage="1 tablet", frequency="Once daily", duration="30 days", route="Oral", instructions="Take in the morning", notes="Check pulse before taking")


# ==============================================================================
# WORKFLOW C: APPOINTMENTS
# ==============================================================================
Appointment.objects.create(appt_id="appt-pres-401", patient_id="pat-1", doctor_id="doc-1", doctor_name="Dr. Sarah Connor", dept_name="General Medicine", date=today - datetime.timedelta(days=5), time_slot="09:30 AM", symptoms="Follow-up on blood pressure regulation.", status="completed", type="Doctor Checkup")
Appointment.objects.create(appt_id="appt-pres-402", patient_id="pat-2", doctor_id="doc-4", doctor_name="Dr. Emily Watson", dept_name="Pediatrics", date=today - datetime.timedelta(days=3), time_slot="11:00 AM", symptoms="Routine health checkup and vitamin consultation.", status="completed", type="Doctor Checkup")
Appointment.objects.create(appt_id="appt-pres-403", patient_id="pat-1", doctor_id="doc-1", doctor_name="Dr. Sarah Connor", dept_name="General Medicine", date=today, time_slot="10:30 AM", symptoms="BP check and medication renewal.", status="confirmed", type="Doctor Checkup")
Appointment.objects.create(appt_id="appt-pres-404", patient_id="pat-3", doctor_id="doc-2", doctor_name="Dr. Robert Chen", dept_name="Cardiology", date=today, time_slot="09:00 AM", symptoms="Diabetes follow-up and ECG screening.", status="confirmed", type="Doctor Checkup")
Appointment.objects.create(appt_id="appt-pres-405", patient_id="pat-4", doctor_id="doc-3", doctor_name="Dr. Alice Vance", dept_name="Neurology", date=today, time_slot="11:30 AM", symptoms="Migraine tracking and reflex check.", status="confirmed", type="Doctor Checkup")
Appointment.objects.create(appt_id="appt-pres-406", patient_id="pat-5", doctor_id="doc-1", doctor_name="Dr. Sarah Connor", dept_name="General Medicine", date=today, time_slot="02:00 PM", symptoms="Anxiety and heart rate monitoring.", status="confirmed", type="Doctor Checkup")
Appointment.objects.create(appt_id="appt-pres-407", patient_id="pat-2", doctor_id="doc-1", doctor_name="Dr. Sarah Connor", dept_name="General Medicine", date=today, time_slot="03:30 PM", symptoms="Mild cough and cold symptoms.", status="confirmed", type="Doctor Checkup")
Appointment.objects.create(appt_id="appt-pres-408", patient_id="pat-3", doctor_id="doc-2", doctor_name="Dr. Robert Chen", dept_name="Cardiology", date=today + datetime.timedelta(days=1), time_slot="10:00 AM", symptoms="Routine cardiology consult.", status="confirmed", type="Doctor Checkup")
Appointment.objects.create(appt_id="appt-pres-409", patient_id="pat-4", doctor_id="doc-3", doctor_name="Dr. Alice Vance", dept_name="Neurology", date=today + datetime.timedelta(days=1), time_slot="01:30 PM", symptoms="Follow-up consultation.", status="confirmed", type="Doctor Checkup")


# ==============================================================================
# WORKFLOW D: LAB REQUESTS & RESULTS
# ==============================================================================

# Lab 1: Completed CBC for pat-1
lab_completed_cbc = LabRequest.objects.create(
    lab_id="lab-pres-301",
    patient_id="pat-1",
    patient_name="John Doe",
    doctor_name="Dr. Sarah Connor",
    test_category="Blood Test",
    test_name="Complete Blood Count (CBC)",
    request_date=today - datetime.timedelta(days=10),
    status="completed",
    result_date=today - datetime.timedelta(days=9),
    technician="Alex Mercer",
    priority="High",
    consultation_id="con-pres-101"
)
LabResult.objects.create(lab_request=lab_completed_cbc, parameter="White Blood Cell (WBC)", value=6.8, unit="10^3/uL", ref_range="4.5 - 11.0", flag="Normal")
LabResult.objects.create(lab_request=lab_completed_cbc, parameter="Red Blood Cell (RBC)", value=4.9, unit="10^6/uL", ref_range="4.3 - 5.9", flag="Normal")
LabResult.objects.create(lab_request=lab_completed_cbc, parameter="Hemoglobin (Hgb)", value=14.8, unit="g/dL", ref_range="13.5 - 17.5", flag="Normal")
LabResult.objects.create(lab_request=lab_completed_cbc, parameter="Platelets", value=245, unit="10^3/uL", ref_range="150 - 450", flag="Normal")

# Lab 2: Pending Lipid Panel for pat-1
LabRequest.objects.create(
    lab_id="lab-pres-302",
    patient_id="pat-1",
    patient_name="John Doe",
    doctor_name="Dr. Sarah Connor",
    test_category="Lipid Panel",
    test_name="Cholesterol Profile",
    request_date=today - datetime.timedelta(days=7),
    status="pending",
    priority="Medium",
    consultation_id="con-pres-101"
)

# Lab 3: Completed HbA1c for pat-3
lab_completed_hba1c = LabRequest.objects.create(
    lab_id="lab-pres-303",
    patient_id="pat-3",
    patient_name="Robert Downey",
    doctor_name="Dr. Robert Chen",
    test_category="Metabolic Panel",
    test_name="HbA1c Glucose Test",
    request_date=today - datetime.timedelta(days=5),
    status="completed",
    result_date=today - datetime.timedelta(days=4),
    technician="Alex Mercer",
    priority="High",
    consultation_id="con-pres-102"
)
LabResult.objects.create(lab_request=lab_completed_hba1c, parameter="HbA1c", value=6.4, unit="%", ref_range="4.0 - 5.6", flag="High")
LabResult.objects.create(lab_request=lab_completed_hba1c, parameter="Fasting Plasma Glucose", value=126.0, unit="mg/dL", ref_range="70 - 99", flag="High")

# Lab 4: Pending TSH for pat-5
LabRequest.objects.create(
    lab_id="lab-pres-304",
    patient_id="pat-5",
    patient_name="Bruce Banner",
    doctor_name="Dr. Sarah Connor",
    test_category="Thyroid Panel",
    test_name="TSH & Free T4 Test",
    request_date=today - datetime.timedelta(days=3),
    status="pending",
    priority="High",
    consultation_id="con-pres-103"
)

# Lab 5: Pending Urine Analysis for pat-4
LabRequest.objects.create(
    lab_id="lab-pres-305",
    patient_id="pat-4",
    patient_name="Clara Oswald",
    doctor_name="Dr. Alice Vance",
    test_category="Urine Analysis",
    test_name="Urinalysis Screen",
    request_date=today - datetime.timedelta(days=2),
    status="pending",
    priority="Low",
    consultation_id="con-pres-104"
)


# ==============================================================================
# WORKFLOW E: BILLINGS, LEAVES & REVIEWS
# ==============================================================================

doc1 = DoctorProfile.objects.filter(doctor_id="doc-1").first()
doc2 = DoctorProfile.objects.filter(doctor_id="doc-2").first()
from laboratory.models import LabTechnicianProfile
tech1 = LabTechnicianProfile.objects.filter(employee_id="emp-labtech-1").first()

# Seeding Doctor & Technician Leave Requests
if doc1:
    DoctorLeaveRequest.objects.create(
        doctor=doc1,
        start_date=today + datetime.timedelta(days=2),
        end_date=today + datetime.timedelta(days=5),
        leave_type="Sick Leave",
        reason="Medical checkup & recovery",
        status="Approved"
    )
    DoctorLeaveRequest.objects.create(
        doctor=doc1,
        start_date=today + datetime.timedelta(days=15),
        end_date=today + datetime.timedelta(days=16),
        leave_type="Personal Leave",
        reason="Family event",
        status="Rejected",
        remarks="Not approved due to lack of staff on these dates"
    )
if doc2:
    DoctorLeaveRequest.objects.create(
        doctor=doc2,
        start_date=today + datetime.timedelta(days=10),
        end_date=today + datetime.timedelta(days=12),
        leave_type="Vacation",
        reason="Family trip",
        status="Pending"
    )
if tech1:
    DoctorLeaveRequest.objects.create(
        technician=tech1,
        start_date=today + datetime.timedelta(days=6),
        end_date=today + datetime.timedelta(days=8),
        leave_type="Vacation",
        reason="Rest and recuperation",
        status="Pending"
    )
    DoctorLeaveRequest.objects.create(
        technician=tech1,
        start_date=today - datetime.timedelta(days=5),
        end_date=today - datetime.timedelta(days=3),
        leave_type="Sick Leave",
        reason="Severe dental pain",
        status="Approved"
    )

# Seeding Doctor Reviews
if doc1:
    DoctorReview.objects.create(
        doctor=doc1,
        patient_name="John Doe",
        appt_id="appt-pres-401",
        rating=5,
        comments="Very detailed explanation, very helpful!",
        response=""
    )
if doc2:
    DoctorReview.objects.create(
        doctor=doc2,
        patient_name="Robert Downey",
        appt_id="appt-pres-404",
        rating=4,
        comments="Good doctor, but there was a slight delay in consultation.",
        response="Thank you for your feedback. We are working on optimizing wait times."
    )

# Seeding Patient Billings (Multi-month distribution for beautiful Revenue Analytics charts)
billing_configs = [
    { 'id': 'bill-hist-101', 'pat': pat1, 'desc': 'Cardiology ECG Consultation', 'amt': 150.00, 'date': datetime.datetime(2026, 1, 10, 10, 0), 'status': 'paid', 'method': 'Card' },
    { 'id': 'bill-hist-102', 'pat': pat3, 'desc': 'Complete Blood Count Analysis', 'amt': 70.00, 'date': datetime.datetime(2026, 1, 24, 14, 30), 'status': 'paid', 'method': 'Cash' },
    { 'id': 'bill-hist-103', 'pat': pat2, 'desc': 'Pediatric Allergy Checkup', 'amt': 180.00, 'date': datetime.datetime(2026, 2, 5, 11, 0), 'status': 'paid', 'method': 'UPI' },
    { 'id': 'bill-hist-104', 'pat': pat4, 'desc': 'Neurology MRI Analysis Fee', 'amt': 320.00, 'date': datetime.datetime(2026, 2, 18, 16, 0), 'status': 'paid', 'method': 'Card' },
    { 'id': 'bill-hist-105', 'pat': pat5, 'desc': 'General Medicine Consultation', 'amt': 90.00, 'date': datetime.datetime(2026, 3, 3, 9, 30), 'status': 'paid', 'method': 'UPI' },
    { 'id': 'bill-hist-106', 'pat': pat1, 'desc': 'Thyroid Panel Laboratory Fee', 'amt': 140.00, 'date': datetime.datetime(2026, 3, 20, 10, 15), 'status': 'paid', 'method': 'Card' },
    { 'id': 'bill-hist-107', 'pat': pat3, 'desc': 'Diabetes Management Consultation', 'amt': 210.00, 'date': datetime.datetime(2026, 4, 12, 15, 0), 'status': 'paid', 'method': 'UPI' },
    { 'id': 'bill-hist-108', 'pat': pat2, 'desc': 'Pediatric General Checkup', 'amt': 110.00, 'date': datetime.datetime(2026, 4, 28, 12, 0), 'status': 'paid', 'method': 'Cash' },
    { 'id': 'bill-hist-109', 'pat': pat4, 'desc': 'Migraine Treatment & Vitals Check', 'amt': 260.00, 'date': datetime.datetime(2026, 5, 15, 14, 0), 'status': 'paid', 'method': 'Card' },
    { 'id': 'bill-hist-110', 'pat': pat5, 'desc': 'Cardiology Stress Test Analysis', 'amt': 420.00, 'date': datetime.datetime(2026, 5, 29, 10, 30), 'status': 'paid', 'method': 'Card' },
    { 'id': 'bill-hist-111', 'pat': pat1, 'desc': 'Urinalysis Laboratory Screening', 'amt': 85.00, 'date': datetime.datetime(2026, 6, 8, 11, 45), 'status': 'paid', 'method': 'UPI' },
    { 'id': 'bill-hist-112', 'pat': pat3, 'desc': 'HbA1c Blood Sugar Consultation', 'amt': 290.00, 'date': datetime.datetime(2026, 6, 22, 16, 15), 'status': 'paid', 'method': 'UPI' },
    { 'id': 'bill-hist-113', 'pat': pat4, 'desc': 'Neurology Consultation', 'amt': 150.00, 'date': datetime.datetime(2026, 7, 2, 10, 0), 'status': 'paid', 'method': 'Card' },
    { 'id': 'bill-hist-114', 'pat': pat5, 'desc': 'Lipid Panel Blood Test Fee', 'amt': 180.00, 'date': datetime.datetime(2026, 7, 5, 13, 0), 'status': 'paid', 'method': 'UPI' }
]

for b in billing_configs:
    if b['pat']:
        # Make timezone aware
        dt_aware = timezone.make_aware(b['date']) if timezone.is_naive(b['date']) else b['date']
        PatientBilling.objects.create(
            billing_id=b['id'],
            patient=b['pat'],
            description=b['desc'],
            amount=b['amt'],
            status=b['status'],
            paid_on=dt_aware,
            method=b['method'],
            receipt_id='REC-' + b['id'].split('-')[2]
        )

# Seed additional unpaid billings to show outstanding claims
PatientBilling.objects.create(billing_id="bill-unpaid-201", patient=pat1, description="Pending Radiology Scanning Fee", amount=350.00, status="unpaid")
PatientBilling.objects.create(billing_id="bill-unpaid-202", patient=pat3, description="Pending Metabolic Blood Panel", amount=120.00, status="unpaid")
PatientBilling.objects.create(billing_id="bill-unpaid-203", patient=pat4, description="Pending General Consultation", amount=50.00, status="unpaid")


# ==============================================================================
# WORKFLOW F: EXTRA SCHEDULING DATA FOR DENSE CHARTS & GRID ROWS
# ==============================================================================

# Seeding 20 more historical completed appointments spread across all 6 departments/doctors
extra_appts = [
    { 'id': 'appt-ext-01', 'pat': 'pat-1', 'doc_id': 'doc-1', 'doc_name': 'Dr. Sarah Connor', 'dept': 'General Medicine', 'day_offset': -25, 'slot': '10:00 AM' },
    { 'id': 'appt-ext-02', 'pat': 'pat-2', 'doc_id': 'doc-4', 'doc_name': 'Dr. Emily Watson', 'dept': 'Pediatrics', 'day_offset': -22, 'slot': '11:30 AM' },
    { 'id': 'appt-ext-03', 'pat': 'pat-3', 'doc_id': 'doc-2', 'doc_name': 'Dr. Robert Chen', 'dept': 'Cardiology', 'day_offset': -20, 'slot': '09:00 AM' },
    { 'id': 'appt-ext-04', 'pat': 'pat-4', 'doc_id': 'doc-3', 'doc_name': 'Dr. Alice Vance', 'dept': 'Neurology', 'day_offset': -18, 'slot': '02:30 PM' },
    { 'id': 'appt-ext-05', 'pat': 'pat-5', 'doc_id': 'doc-5', 'doc_name': 'Dr. Marcus Aurelius', 'dept': 'Radiology', 'day_offset': -15, 'slot': '04:00 PM' },
    { 'id': 'appt-ext-06', 'pat': 'pat-1', 'doc_id': 'doc-6', 'doc_name': 'Dr. Gregory House', 'dept': 'Pathology & Lab', 'day_offset': -12, 'slot': '10:30 AM' },
    { 'id': 'appt-ext-07', 'pat': 'pat-2', 'doc_id': 'doc-1', 'doc_name': 'Dr. Sarah Connor', 'dept': 'General Medicine', 'day_offset': -10, 'slot': '11:00 AM' },
    { 'id': 'appt-ext-08', 'pat': 'pat-3', 'doc_id': 'doc-4', 'doc_name': 'Dr. Emily Watson', 'dept': 'Pediatrics', 'day_offset': -8, 'slot': '01:00 PM' },
    { 'id': 'appt-ext-09', 'pat': 'pat-4', 'doc_id': 'doc-2', 'doc_name': 'Dr. Robert Chen', 'dept': 'Cardiology', 'day_offset': -6, 'slot': '03:00 PM' },
    { 'id': 'appt-ext-10', 'pat': 'pat-5', 'doc_id': 'doc-3', 'doc_name': 'Dr. Alice Vance', 'dept': 'Neurology', 'day_offset': -5, 'slot': '09:30 AM' },
    { 'id': 'appt-ext-11', 'pat': 'pat-1', 'doc_id': 'doc-5', 'doc_name': 'Dr. Marcus Aurelius', 'dept': 'Radiology', 'day_offset': -4, 'slot': '02:00 PM' },
    { 'id': 'appt-ext-12', 'pat': 'pat-2', 'doc_id': 'doc-6', 'doc_name': 'Dr. Gregory House', 'dept': 'Pathology & Lab', 'day_offset': -3, 'slot': '11:30 AM' },
    { 'id': 'appt-ext-13', 'pat': 'pat-3', 'doc_id': 'doc-1', 'doc_name': 'Dr. Sarah Connor', 'dept': 'General Medicine', 'day_offset': -2, 'slot': '10:00 AM' },
    { 'id': 'appt-ext-14', 'pat': 'pat-4', 'doc_id': 'doc-4', 'doc_name': 'Dr. Emily Watson', 'dept': 'Pediatrics', 'day_offset': -1, 'slot': '03:30 PM' }
]

for ap in extra_appts:
    appt_date = today + datetime.timedelta(days=ap['day_offset'])
    Appointment.objects.create(
        appt_id=ap['id'],
        patient_id=ap['pat'],
        doctor_id=ap['doc_id'],
        doctor_name=ap['doc_name'],
        dept_name=ap['dept'],
        date=appt_date,
        time_slot=ap['slot'],
        symptoms="Routine historical health evaluation checkup.",
        status="completed",
        type="Doctor Checkup"
    )

# Seed more pending/confirmed appointments for doctor today queue
Appointment.objects.create(appt_id="appt-pres-ext-901", patient_id="pat-4", doctor_id="doc-4", doctor_name="Dr. Emily Watson", dept_name="Pediatrics", date=today, time_slot="10:00 AM", symptoms="Pediatric screening", status="confirmed", type="Doctor Checkup")
Appointment.objects.create(appt_id="appt-pres-ext-902", patient_id="pat-5", doctor_id="doc-5", doctor_name="Dr. Marcus Aurelius", dept_name="Radiology", date=today, time_slot="11:00 AM", symptoms="Chest X-Ray scan", status="confirmed", type="Doctor Checkup")
Appointment.objects.create(appt_id="appt-pres-ext-903", patient_id="pat-2", doctor_id="doc-6", doctor_name="Dr. Gregory House", dept_name="Pathology & Lab", date=today, time_slot="01:30 PM", symptoms="Biopsy review", status="confirmed", type="Doctor Checkup")


# ==============================================================================
# WORKFLOW G: SYSTEM AUDIT TRAIL LOGS (Dense logs for dashboard table)
# ==============================================================================
dense_audits = [
    { 'time_offset': 5, 'module': 'accounts', 'initiator': 'admin@ehrmail.com', 'action': 'Administrator console session started.', 'flag': 'SECURE' },
    { 'time_offset': 10, 'module': 'patients', 'initiator': 'system', 'action': 'Patient profile record pat-1 diagnostics history fetched.', 'flag': 'SECURE' },
    { 'time_offset': 15, 'module': 'doctors', 'initiator': 'sarah.connor@ehrmail.com', 'action': 'Approved doctor leave request for Dr. Sarah Connor', 'flag': 'SUCCESS' },
    { 'time_offset': 20, 'module': 'laboratory', 'initiator': 'labtech@ehrmail.com', 'action': 'Authorized results compiled for complete blood count CBC.', 'flag': 'SECURE' },
    { 'time_offset': 25, 'module': 'doctors', 'initiator': 'robert.chen@ehrmail.com', 'action': 'New digital prescription rx-pres-202 issued.', 'flag': 'SECURE' },
    { 'time_offset': 30, 'module': 'patients', 'initiator': 'system', 'action': 'Patient profile record pat-3 demographics update.', 'flag': 'SECURE' },
    { 'time_offset': 35, 'module': 'doctors', 'initiator': 'alice.vance@ehrmail.com', 'action': 'Patient pat-4 medical file updated.', 'flag': 'SECURE' },
    { 'time_offset': 40, 'module': 'system', 'initiator': 'system@curepoint.com', 'action': 'Automated database log compression executed successfully', 'flag': 'SUCCESS' },
    { 'time_offset': 45, 'module': 'accounts', 'initiator': 'admin@ehrmail.com', 'action': 'Created medical specialty department: Cardiology', 'flag': 'SUCCESS' },
    { 'time_offset': 50, 'module': 'system', 'initiator': 'admin@ehrmail.com', 'action': 'PostgreSQL Database Backup generated and saved to Cloud storage bucket!', 'flag': 'SUCCESS' },
    { 'time_offset': 55, 'module': 'laboratory', 'initiator': 'labtech@ehrmail.com', 'action': 'Advanced request lab-pres-303 to status: completed', 'flag': 'SUCCESS' },
    { 'time_offset': 60, 'module': 'accounts', 'initiator': 'admin@ehrmail.com', 'action': 'Staff application approved: robert.chen@ehrmail.com', 'flag': 'SUCCESS' },
    { 'time_offset': 65, 'module': 'leaves', 'initiator': 'admin@ehrmail.com', 'action': 'Leave request approved (ID: leave-pres-201).', 'flag': 'SUCCESS' },
    { 'time_offset': 70, 'module': 'patients', 'initiator': 'system', 'action': 'Patient profile record pat-5 vitals history updated.', 'flag': 'SECURE' },
    { 'time_offset': 75, 'module': 'laboratory', 'initiator': 'labtech@ehrmail.com', 'action': 'Walk-In token TKN-482 registered successfully!', 'flag': 'SUCCESS' }
]

for idx, audit in enumerate(dense_audits):
    dt = timezone.now() - datetime.timedelta(minutes=audit['time_offset'])
    AuditLog.objects.create(timestamp=dt, module=audit['module'], initiator=audit['initiator'], action=audit['action'], flag=audit['flag'])

print("Successfully seeded all dashboards with clean, interconnected presentation workflows!")
