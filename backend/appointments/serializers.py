from rest_framework import serializers
from .models import Appointment

class AppointmentSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='appt_id')
    patientId = serializers.CharField(source='patient_id')
    doctorId = serializers.CharField(source='doctor_id')
    doctorName = serializers.CharField(source='doctor_name')
    deptName = serializers.CharField(source='dept_name')
    timeSlot = serializers.CharField(source='time_slot')

    class Meta:
        model = Appointment
        fields = ('id', 'patientId', 'doctorId', 'doctorName', 'deptName', 'date', 'timeSlot', 'symptoms', 'status', 'type')

    def create(self, validated_data):
        appt_id = validated_data.get('appt_id')
        
        appointment, created = Appointment.objects.update_or_create(
            appt_id=appt_id,
            defaults={
                'patient_id': validated_data.get('patient_id'),
                'doctor_id': validated_data.get('doctor_id'),
                'doctor_name': validated_data.get('doctor_name'),
                'dept_name': validated_data.get('dept_name'),
                'date': validated_data.get('date') or timezone_now_date(),
                'time_slot': validated_data.get('time_slot'),
                'symptoms': validated_data.get('symptoms', ''),
                'status': validated_data.get('status', 'pending'),
                'type': validated_data.get('type', 'Doctor Checkup')
            }
        )
        return appointment

def timezone_now_date():
    from django.utils import timezone
    return timezone.now().date()
