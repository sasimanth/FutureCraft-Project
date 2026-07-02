from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from patients.models import PatientProfile, PatientVital, PatientMedicalHistory, PatientVisit

User = get_user_model()

class PatientIntegrationTests(APITestCase):

    def setUp(self):
        # Create a patient user
        self.patient_user = User.objects.create_user(
            email='patient@ehrmail.com',
            password='password123',
            name='Test Patient',
            role='patient'
        )
        
        # Create PatientProfile
        self.patient_profile = PatientProfile.objects.create(
            user=self.patient_user,
            patient_id='pat-test-1',
            dob='1990-01-01',
            gender='Female',
            blood_group='O+',
            phone='+1234567890',
            allergies='None'
        )

        # Authenticate
        self.client.force_authenticate(user=self.patient_user)

    def test_get_patient_profile_serialization(self):
        # Add vitals & medical history
        PatientVital.objects.create(
            patient=self.patient_profile,
            bp_systolic=120,
            bp_diastolic=80,
            heart_rate=72,
            temp=98.6,
            weight=70.0
        )
        PatientMedicalHistory.objects.create(
            patient=self.patient_profile,
            condition='Asthma',
            diagnosed_by='Dr. Sarah Connor',
            status='Active'
        )

        url = reverse('patient-detail', kwargs={'patient_id': 'pat-test-1'})
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Verify custom mapping serialization
        self.assertEqual(response.data['id'], 'pat-test-1')
        self.assertEqual(response.data['name'], 'Test Patient')
        self.assertEqual(len(response.data['vitalsHistory']), 1)
        self.assertEqual(len(response.data['medicalHistory']), 1)
        self.assertEqual(response.data['medicalHistory'][0]['condition'], 'Asthma')

    def test_post_patient_vitals(self):
        url = reverse('patient-add-vitals', kwargs={'patient_id': 'pat-test-1'})
        data = {
            'bpSystolic': 118,
            'bpDiastolic': 78,
            'heartRate': 70,
            'temp': 98.4,
            'weight': 69.5
        }
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(PatientVital.objects.filter(patient=self.patient_profile).count(), 1)
        vital = PatientVital.objects.first()
        self.assertEqual(vital.bp_systolic, 118)

    def test_post_patient_medical_history(self):
        url = reverse('patient-add-medical-history', kwargs={'patient_id': 'pat-test-1'})
        data = {
            'condition': 'Diabetes',
            'diagnosedBy': 'Dr. Sarah Connor',
            'status': 'Active'
        }
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(PatientMedicalHistory.objects.filter(patient=self.patient_profile).count(), 1)
        history = PatientMedicalHistory.objects.first()
        self.assertEqual(history.condition, 'Diabetes')

    def test_manage_visits_get_and_post(self):
        url = reverse('patient-manage-visits', kwargs={'patient_id': 'pat-test-1'})
        
        # 1. Test POST visit
        data = {
            'department': 'General Medicine',
            'doctorName': 'Dr. Sarah Connor',
            'reason': 'Follow-up consultation'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(PatientVisit.objects.filter(patient=self.patient_profile).count(), 1)

        # 2. Test GET visits
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['reason'], 'Follow-up consultation')
