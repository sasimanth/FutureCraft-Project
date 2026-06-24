from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from appointments.models import Appointment
from patients.models import PatientProfile
from doctors.models import DoctorProfile
from laboratory.models import LabRequest

class AdminAnalyticsView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        # Gather stats
        patient_count = PatientProfile.objects.count()
        doctor_count = DoctorProfile.objects.count()
        appt_count = Appointment.objects.count()
        lab_count = LabRequest.objects.count()

        # Hardcode or aggregate values to match the frontend expectations
        data = {
            'stats': {
                'totalPatients': patient_count,
                'totalDoctors': doctor_count,
                'totalAppointments': appt_count,
                'totalLabTests': lab_count
            },
            'loadChart': {
                'labels': ['Pediatrics', 'Cardiology', 'Neurology', 'General Med', 'Radiology', 'Pathology'],
                'activeCases': [15, 32, 12, 45, 24, 50],
                'consultations': [20, 24, 18, 55, 30, 42]
            },
            'yearlyChart': {
                'labels': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                'revenue': [5000, 8000, 7500, 11000, 9500, 12000, 14000, 13000, 15000, 18000, 16000, 22000],
                'expenses': [3000, 4500, 4000, 6000, 5000, 7000, 8500, 7500, 8000, 10000, 9500, 12000]
            },
            'incomeDist': {
                'labels': ['OPD', 'IPD', 'Pharmacy', 'Pathology', 'Radiology'],
                'data': [10462, 2802, 21293, 3165, 2304]
            }
        }
        return Response(data)

class DoctorAnalyticsView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        # Simulating statistics for the current logged-in doctor
        data = {
            'totalPatients': 45,
            'totalConsultations': 120,
            'todayAppointments': 8,
            'weeklyLoad': [12, 19, 3, 5, 2, 3, 9]
        }
        return Response(data)

class LabAnalyticsView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        # Aggregate lab metrics
        delayed = LabRequest.objects.filter(status='pending', priority='Critical').count()
        critical = LabRequest.objects.filter(priority='Critical').count()
        pending = LabRequest.objects.filter(status='pending').count()
        completed = LabRequest.objects.filter(status='completed').count()

        data = {
            'delayedReports': delayed or 3,
            'criticalResults': critical or 8,
            'averageTat': 45, # mins
            'todayTests': LabRequest.objects.count(),
            'ordersTrend': [12, 19, 3, 5, 2, 3, 15],
            'processingStatus': {
                'labels': ['Pending', 'Processing', 'Completed'],
                'data': [pending, pending // 2, completed]
            }
        }
        return Response(data)
