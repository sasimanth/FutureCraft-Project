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

    def validate(self, attrs):
        doctor_id = attrs.get('doctor_id')
        patient_id = attrs.get('patient_id')
        date = attrs.get('date')
        time_slot = attrs.get('time_slot')
        status = attrs.get('status')

        if self.instance:
            if doctor_id is None:
                doctor_id = self.instance.doctor_id
            if patient_id is None:
                patient_id = self.instance.patient_id
            if date is None:
                date = self.instance.date
            if time_slot is None:
                time_slot = self.instance.time_slot
            if status is None:
                status = self.instance.status

        if status is None:
            status = 'pending'

        # Skip checks for cancelled appointments
        if status == 'cancelled':
            return attrs

        # 1. Check doctor leave requests
        from doctors.models import DoctorLeaveRequest
        on_leave = DoctorLeaveRequest.objects.filter(
            doctor__doctor_id=doctor_id,
            start_date__lte=date,
            end_date__gte=date,
            status='Approved'
        ).exists()
        if on_leave:
            raise serializers.ValidationError("Doctor is on leave on this date.")

        # 2. Check doctor double booking
        # Exclude self if updating
        qs = Appointment.objects.filter(
            doctor_id=doctor_id,
            date=date,
            time_slot=time_slot
        ).exclude(status='cancelled')
        
        if self.instance:
            qs = qs.exclude(appt_id=self.instance.appt_id)

        if qs.exists():
            raise serializers.ValidationError("Already Booked")

        # 3. Check patient double booking
        if patient_id:
            pat_qs = Appointment.objects.filter(
                patient_id=patient_id,
                date=date,
                time_slot=time_slot
            ).exclude(status='cancelled')
            
            if self.instance:
                pat_qs = pat_qs.exclude(appt_id=self.instance.appt_id)
                
            if pat_qs.exists():
                raise serializers.ValidationError("Patient already has an appointment booked at this time slot.")

        return attrs

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
