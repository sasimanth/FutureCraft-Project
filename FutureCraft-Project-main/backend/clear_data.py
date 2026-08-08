import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'EHRLabPortal.settings')
django.setup()

from appointments.models import Appointment
from consultations.models import Consultation
from prescriptions.models import Prescription, PrescriptionMedicine
from laboratory.models import LabRequest, LabResult
from patients.models import PatientVital, PatientMedicalHistory, PatientVisit
from accounts.models import AuditLog

print("Cleaning up database transactions and history...")

try:
    count, _ = Appointment.objects.all().delete()
    print(f"Deleted {count} Appointments.")

    count, _ = Consultation.objects.all().delete()
    print(f"Deleted {count} Consultations.")

    count, _ = PrescriptionMedicine.objects.all().delete()
    print(f"Deleted {count} Prescription Medicines.")

    count, _ = Prescription.objects.all().delete()
    print(f"Deleted {count} Prescriptions.")

    count, _ = LabResult.objects.all().delete()
    print(f"Deleted {count} Lab Results.")

    count, _ = LabRequest.objects.all().delete()
    print(f"Deleted {count} Lab Requests.")

    count, _ = PatientVital.objects.all().delete()
    print(f"Deleted {count} Patient Vitals.")

    count, _ = PatientMedicalHistory.objects.all().delete()
    print(f"Deleted {count} Patient Medical History items.")

    count, _ = PatientVisit.objects.all().delete()
    print(f"Deleted {count} Patient Visits.")

    count, _ = AuditLog.objects.all().delete()
    print(f"Deleted {count} Audit Logs.")

    print("Database cleanup completed successfully! Ready for a fresh start.")
except Exception as e:
    print(f"Error during cleanup: {e}")
