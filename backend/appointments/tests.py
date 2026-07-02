from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from appointments.models import Appointment

User = get_user_model()

class AppointmentTests(APITestCase):

    def setUp(self):
        # Create a doctor user
        self.doctor_user = User.objects.create_user(
            email='doctor@ehrmail.com',
            password='password123',
            name='Dr. Sarah Connor',
            role='doctor'
        )

        # Create appointment
        self.appointment = Appointment.objects.create(
            appt_id='appt-test-1',
            patient_id='pat-test-1',
            doctor_id='doc-test-1',
            doctor_name='Dr. Sarah Connor',
            dept_name='General Medicine',
            time_slot='09:30 AM',
            status='pending'
        )

        # Authenticate
        self.client.force_authenticate(user=self.doctor_user)

    def test_patch_appointment_status(self):
        url = reverse('appointment-detail', kwargs={'appt_id': 'appt-test-1'})
        data = {
            'status': 'confirmed'
        }
        response = self.client.patch(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.appointment.refresh_from_db()
        self.assertEqual(self.appointment.status, 'confirmed')

    def test_patient_double_booking_fails(self):
        # The setUp has already created an appointment for patient 'pat-test-1' at '09:30 AM'
        url = reverse('appointment-list')
        data = {
            'id': 'appt-test-2',
            'patientId': 'pat-test-1',
            'doctorId': 'doc-test-2',
            'doctorName': 'Dr. Neil Tyson',
            'deptName': 'Radiology',
            'date': self.appointment.date.strftime('%Y-%m-%d'),
            'timeSlot': '09:30 AM',
            'status': 'pending'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Patient already has an appointment booked at this time slot.", str(response.data))

    def test_receipt_pdf_download(self):
        from patients.models import PatientProfile, PatientBilling
        # Create a patient profile associated with doctor_user
        patient_profile = PatientProfile.objects.create(
            user=self.doctor_user,
            patient_id='pat-test-1'
        )
        
        # Create a paid patient billing entry
        bill = PatientBilling.objects.create(
            billing_id='bill-test-999',
            patient=patient_profile,
            description='Test Consultation',
            amount=100.00,
            status='paid',
            consultation_charge=100.00
        )
        
        # Request pdf download
        url = reverse('receipt_pdf', kwargs={'billing_id': 'bill-test-999'})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response['Content-Type'], 'application/pdf')
