from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from patients.models import PatientProfile, PatientMedicalHistory
from prescriptions.models import Prescription, PrescriptionMedicine
from consultations.models import Consultation
from laboratory.models import LabRequest

User = get_user_model()

class HealthcareWorkflowTests(APITestCase):

    def setUp(self):
        # Create a doctor user
        self.doctor_user = User.objects.create_user(
            email='doctor@ehrmail.com',
            password='password123',
            name='Dr. Sarah Connor',
            role='doctor'
        )

        # Create a patient user and profile
        self.patient_user = User.objects.create_user(
            email='patient@ehrmail.com',
            password='password123',
            name='Test Patient',
            role='patient'
        )
        self.patient_profile = PatientProfile.objects.create(
            user=self.patient_user,
            patient_id='pat-test-1',
            dob='1990-01-01',
            gender='Female',
            blood_group='O+',
            phone='+1234567890',
            allergies='None'
        )

        # Authenticate as doctor
        self.client.force_authenticate(user=self.doctor_user)

    def test_create_prescription_with_new_fields(self):
        url = reverse('prescription-list')
        data = {
            'id': 'rx-test-123',
            'patientId': 'pat-test-1',
            'doctorName': 'Dr. Sarah Connor',
            'date': '2026-06-24',
            'diagnosis': 'Asthma management',
            'medicines': [
                {
                    'name': 'Albuterol',
                    'dosage': '2 puffs',
                    'frequency': 'Every 4 hours as needed',
                    'duration': '7 days',
                    'instructions': 'Use spacer',
                    'notes': 'Rescue inhaler'
                },
                {
                    'name': 'Fluticasone',
                    'dosage': '1 puff',
                    'frequency': '2x/day',
                    'duration': '30 days',
                    'instructions': 'Rinse mouth after use',
                    'notes': 'Maintenance controller'
                }
            ]
        }

        # POST prescription
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Verify database record
        rx = Prescription.objects.get(prescription_id='rx-test-123')
        self.assertEqual(rx.patient_id, 'pat-test-1')
        self.assertEqual(rx.diagnosis, 'Asthma management')

        medicines = rx.medicines.all()
        self.assertEqual(medicines.count(), 2)
        med1 = medicines.get(name='Albuterol')
        self.assertEqual(med1.dosage, '2 puffs')
        self.assertEqual(med1.frequency, 'Every 4 hours as needed')
        self.assertEqual(med1.notes, 'Rescue inhaler')

        med2 = medicines.get(name='Fluticasone')
        self.assertEqual(med2.dosage, '1 puff')
        self.assertEqual(med2.frequency, '2x/day')
        self.assertEqual(med2.notes, 'Maintenance controller')

    def test_consultation_history_update_workflow(self):
        url = reverse('consultation-list')
        data = {
            'id': 'con-test-123',
            'patientId': 'pat-test-1',
            'doctorName': 'Dr. Sarah Connor',
            'diagnosis': 'Hypertension',
            'consultationDate': '2026-06-24',
            'symptoms': 'Headache, dizziness',
            'recommendations': 'Rest and follow up'
        }

        # POST consultation
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Verify Consultation saved
        consult = Consultation.objects.get(consultation_id='con-test-123')
        self.assertEqual(consult.patient_id, 'pat-test-1')

        # Verify Patient Medical History updated automatically
        history = PatientMedicalHistory.objects.filter(patient=self.patient_profile, condition='Hypertension')
        self.assertTrue(history.exists())
        self.assertEqual(history.first().diagnosed_by, 'Dr. Sarah Connor')

    def test_lab_request_status_transitions(self):
        # 1. Doctor orders a lab request
        url = reverse('labtest-list')
        data = {
            'id': 'lab-test-123',
            'patientId': 'pat-test-1',
            'patientName': 'Test Patient',
            'doctorName': 'Dr. Sarah Connor',
            'testCategory': 'Blood Test',
            'testName': 'Complete Blood Count',
            'requestDate': '2026-06-24',
            'status': 'pending',
            'priority': 'Medium'
        }

        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # 2. Lab Tech updates status to 'sample_collected'
        detail_url = reverse('labtest-detail', kwargs={'lab_id': 'lab-test-123'})
        response = self.client.patch(detail_url, {'status': 'sample_collected'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(LabRequest.objects.get(lab_id='lab-test-123').status, 'sample_collected')

        # 3. Lab Tech updates status to 'processing'
        response = self.client.patch(detail_url, {'status': 'processing'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(LabRequest.objects.get(lab_id='lab-test-123').status, 'processing')
