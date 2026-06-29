import os
import django
from django.utils import timezone

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'EHRLabPortal.settings')
django.setup()

from appointments.models import Appointment

print("Seeding fresh pending appointments...")

try:
    Appointment.objects.all().delete()

    Appointment.objects.create(
        appt_id="appt-fresh-1",
        patient_id="pat-1",
        doctor_id="doc-1",
        doctor_name="Dr. Sarah Connor",
        dept_name="General Medicine",
        date=timezone.now().date(),
        time_slot="09:30 AM",
        symptoms="Follow-up on blood pressure and general checkup.",
        status="confirmed",
        type="Doctor Checkup"
    )

    Appointment.objects.create(
        appt_id="appt-fresh-2",
        patient_id="pat-2",
        doctor_id="doc-1",
        doctor_name="Dr. Sarah Connor",
        dept_name="General Medicine",
        date=timezone.now().date(),
        time_slot="10:30 AM",
        symptoms="Routine clinical assessment.",
        status="confirmed",
        type="Doctor Checkup"
    )

    print("Successfully seeded 2 fresh appointments for today!")
except Exception as e:
    print(f"Error seeding: {e}")
