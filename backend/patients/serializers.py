from rest_framework import serializers
from .models import PatientProfile, PatientVital, PatientMedicalHistory, PatientVisit, PatientFile

class PatientVitalSerializer(serializers.ModelSerializer):
    bpSystolic = serializers.IntegerField(source='bp_systolic')
    bpDiastolic = serializers.IntegerField(source='bp_diastolic')
    heartRate = serializers.IntegerField(source='heart_rate')
    
    class Meta:
        model = PatientVital
        fields = ('date', 'bpSystolic', 'bpDiastolic', 'heartRate', 'temp', 'weight')

class PatientMedicalHistorySerializer(serializers.ModelSerializer):
    diagnosedBy = serializers.CharField(source='diagnosed_by')

    class Meta:
        model = PatientMedicalHistory
        fields = ('date', 'condition', 'diagnosedBy', 'status')

class PatientVisitSerializer(serializers.ModelSerializer):
    doctorName = serializers.CharField(source='doctor_name')

    class Meta:
        model = PatientVisit
        fields = ('id', 'date', 'department', 'doctorName', 'reason')

class PatientFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientFile
        fields = ('id', 'name', 'size', 'type', 'date', 'file')

class PatientProfileSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='patient_id', read_only=True)
    name = serializers.CharField(source='user.name', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    bloodGroup = serializers.CharField(source='blood_group', required=False, allow_blank=True)
    emergencyName = serializers.CharField(source='emergency_name', required=False, allow_blank=True)
    emergencyPhone = serializers.CharField(source='emergency_phone', required=False, allow_blank=True)
    
    vitalsHistory = PatientVitalSerializer(source='vitals', many=True, read_only=True)
    medicalHistory = PatientMedicalHistorySerializer(source='medical_history', many=True, read_only=True)

    class Meta:
        model = PatientProfile
        fields = (
            'id', 'name', 'email', 'dob', 'gender', 'bloodGroup', 'phone',
            'emergencyName', 'emergencyPhone', 'allergies', 'vitalsHistory', 'medicalHistory'
        )

    def update(self, instance, validated_data):
        # Allow updating patient profile details
        instance.dob = validated_data.get('dob', instance.dob)
        instance.gender = validated_data.get('gender', instance.gender)
        instance.blood_group = validated_data.get('blood_group', instance.blood_group)
        instance.phone = validated_data.get('phone', instance.phone)
        instance.emergency_name = validated_data.get('emergency_name', instance.emergency_name)
        instance.emergency_phone = validated_data.get('emergency_phone', instance.emergency_phone)
        instance.allergies = validated_data.get('allergies', instance.allergies)
        
        # Also allow updating user's name
        user_data = self.initial_data.get('user', {})
        if 'name' in user_data:
            instance.user.name = user_data['name']
            instance.user.save()
            
        instance.save()
        return instance
