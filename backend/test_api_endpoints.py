import os
import sys
import django
from django.urls import reverse

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'EHRLabPortal.settings')
django.setup()

from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from patients.models import PatientProfile
from laboratory.models import LabRequest
from prescriptions.models import Prescription, PrescriptionMedicine

User = get_user_model()

def test_api_suite():
    client = APIClient()
    print("==================================================")
    print("   CUREPOINT - AUTOMATED REST API TEST SUITE")
    print("==================================================")

    # 1. TEST AUTHENTICATION & ROLE GUARDS
    print("\n[+] Testing User Authentication & Token Generation...")
    
    # Successful Login - Admin
    res = client.post('/api/login/', {'email': 'admin@ehrmail.com', 'password': 'password123', 'role': 'admin'}, format='json')
    if res.status_code != 200:
        print(f"[-] FAILED: Admin login failed. Status code: {res.status_code}")
        return False
    admin_token = res.data['user']['token']
    print("[OK] Admin login successful. Token acquired.")

    # Successful Login - Doctor
    res = client.post('/api/login/', {'email': 'sarah.connor@ehrmail.com', 'password': 'password123', 'role': 'doctor'}, format='json')
    if res.status_code != 200:
        print(f"[-] FAILED: Doctor login failed. Status: {res.status_code}")
        return False
    doctor_token = res.data['user']['token']
    print("[OK] Doctor login successful. Token acquired.")

    # Successful Login - Labtech
    res = client.post('/api/login/', {'email': 'labtech@ehrmail.com', 'password': 'password123', 'role': 'labtech'}, format='json')
    if res.status_code != 200:
        print(f"[-] FAILED: Lab tech login failed. Status: {res.status_code}")
        return False
    labtech_token = res.data['user']['token']
    print("[OK] Lab technician login successful. Token acquired.")

    # Successful Login - Patient
    res = client.post('/api/login/', {'email': 'john.doe@ehrmail.com', 'password': 'password123', 'role': 'patient'}, format='json')
    if res.status_code != 200:
        print(f"[-] FAILED: Patient login failed. Status: {res.status_code}")
        return False
    patient_token = res.data['user']['token']
    print("[OK] Patient login successful. Token acquired.")

    # Failed Login Case
    res = client.post('/api/login/', {'email': 'admin@ehrmail.com', 'password': 'wrongpassword', 'role': 'admin'}, format='json')
    if res.status_code == 200:
        print("[-] FAILED: Login accepted wrong password.")
        return False
    print("[OK] Wrong credentials correctly rejected (400 Bad Request).")

    # 2. TEST ROLE-BASED ACCESS CONTROL (RBAC) & PROFILE VIEWS
    print("\n[+] Testing Profile & User Permissions...")
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {patient_token}')
    res = client.get('/api/profile/')
    if res.status_code != 200 or res.data['email'] != 'john.doe@ehrmail.com':
        print("[-] FAILED: Patient profile endpoint failed.")
        return False
    print("[OK] Patient profile endpoint returned authenticated user info.")

    # Admin access to audits (Should pass)
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {admin_token}')
    res = client.get('/api/audits/')
    if res.status_code != 200:
        print(f"[-] FAILED: Admin unable to view audits. Status: {res.status_code}")
        return False
    print("[OK] Admin audit list fetched successfully.")

    # Patient access to audits (Should be rejected with 403 Forbidden)
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {patient_token}')
    res = client.get('/api/audits/')
    if res.status_code != 403:
        print(f"[-] FAILED: Patient was allowed access to audits. Status: {res.status_code}")
        return False
    print("[OK] Audits endpoint restricted for Patient role (403 Forbidden).")

    # 3. TEST PATIENT PROFILE DATA & VITALS OPERATIONS
    print("\n[+] Testing Patient Profile Vitals & Records...")
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {doctor_token}')
    
    # Get patients list
    res = client.get('/api/patients/')
    if res.status_code != 200 or len(res.data) == 0:
        print("[-] FAILED: Unable to fetch patients list as clinician.")
        return False
    print(f"[OK] Doctors can retrieve patient directory list (found {len(res.data)} profiles).")

    # Post Patient Vitals
    res = client.post('/api/patients/pat-1/vitals/', {
        'bpSystolic': 118,
        'bpDiastolic': 78,
        'heartRate': 70,
        'temp': 98.4,
        'weight': 69.5
    }, format='json')
    if res.status_code != 201:
        print(f"[-] FAILED: Vital creation failed. Status: {res.status_code}, Msg: {res.data}")
        return False
    print("[OK] Vital signs recorded successfully for patient 'pat-1'.")

    # 4. TEST CLINICAL PRESCRIPTIONS & WORKFLOWS
    print("\n[+] Testing Prescriptions & Consultations...")
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {doctor_token}')
    
    # Create Prescription
    rx_data = {
        'id': 'rx-test-999',
        'patientId': 'pat-1',
        'doctorName': 'Dr. Sarah Connor',
        'diagnosis': 'Seasonal Allergic Rhinitis',
        'medicines': [
            {'name': 'Cetirizine 10mg', 'dosage': '1 tablet', 'frequency': 'Once daily', 'duration': '10 days', 'route': 'Oral', 'instructions': 'Take at night before bed', 'notes': 'Do not drive if feeling sleepy'}
        ]
    }
    res = client.post('/api/prescriptions/', rx_data, format='json')
    if res.status_code != 201:
        print(f"[-] FAILED: Prescription creation failed. Status: {res.status_code}, Msg: {res.data}")
        return False
    print("[OK] Prescription 'rx-test-999' created and medicine item serialized.")

    # 5. TEST LAB REQUEST & RESULTS COMPILATION
    print("\n[+] Testing Laboratory technician updates & results ready...")
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {labtech_token}')

    # Retrieve specific lab request
    res = client.get('/api/lab-tests/lab-pres-302/')
    if res.status_code != 200:
        print(f"[-] FAILED: Lab request lookup failed. Status: {res.status_code}")
        return False
    print(f"[OK] Retrieved Lab Request 'lab-pres-302' (Status: {res.data['status']}).")

    # Update lab results parameter and set status to completed
    update_payload = {
        'status': 'completed',
        'technician': 'Alex Mercer',
        'results': [
            {'parameter': 'Cholesterol Total', 'value': '195.00', 'unit': 'mg/dL', 'refRange': '125 - 200', 'flag': 'Normal'},
            {'parameter': 'Triglycerides', 'value': '160.00', 'unit': 'mg/dL', 'refRange': '40 - 150', 'flag': 'High'}
        ]
    }
    res = client.put('/api/lab-tests/lab-pres-302/', update_payload, format='json')
    if res.status_code != 200 or res.data['status'] != 'completed' or len(res.data['results']) != 2:
        print(f"[-] FAILED: Laboratory test compilation failed. Status: {res.status_code}")
        return False
    print("[OK] Lab Request results compiled and status marked as completed.")

    # 6. TEST PDF REPORT COMPILATION & GENERATION
    print("\n[+] Testing PDF Generation endpoints...")
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {patient_token}')

    # Prescription PDF
    res = client.get('/api/reports/prescription/rx-test-999/')
    if res.status_code != 200 or res['Content-Type'] != 'application/pdf':
        print(f"[-] FAILED: Prescription PDF download endpoint failed. Status: {res.status_code}")
        return False
    print("[OK] Prescription PDF report compiled & downloaded successfully.")

    # Lab Report PDF
    res = client.get('/api/reports/lab-report/lab-pres-302/')
    if res.status_code != 200 or res['Content-Type'] != 'application/pdf':
        print(f"[-] FAILED: Lab Report PDF download endpoint failed. Status: {res.status_code}")
        return False
    print("[OK] Diagnostic Laboratory PDF report compiled & downloaded successfully.")

    # 7. TEST DASHBOARD ANALYTICS SYNCHRONIZATION
    print("\n[+] Testing Analytics dashboards & telemetry data sync...")
    
    # Admin Analytics
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {admin_token}')
    res = client.get('/api/analytics/admin/')
    if res.status_code != 200 or 'stats' not in res.data:
        print("[-] FAILED: Admin analytics sync failed.")
        return False
    print("[OK] Admin analytics synchronization successful.")

    # Doctor Analytics
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {doctor_token}')
    res = client.get('/api/analytics/doctor/')
    if res.status_code != 200 or 'totalPatients' not in res.data:
        print("[-] FAILED: Doctor analytics sync failed.")
        return False
    print("[OK] Doctor workbench analytics synchronization successful.")

    # Lab Tech Analytics
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {labtech_token}')
    res = client.get('/api/analytics/laboratory/')
    if res.status_code != 200 or 'processingStatus' not in res.data:
        print("[-] FAILED: Lab tech analytics sync failed.")
        return False
    print("[OK] Lab technician analytics synchronization successful.")

    print("\n==================================================")
    print("   SUCCESS: ALL API ENDPOINTS VERIFIED & STABLE!")
    print("==================================================")
    
    # Cleanup created prescription
    Prescription.objects.filter(prescription_id='rx-test-999').delete()
    return True

if __name__ == '__main__':
    success = test_api_suite()
    if not success:
        sys.exit(1)
    sys.exit(0)
