from rest_framework import serializers
from .models import PatientProfile, PatientVital, PatientMedicalHistory, PatientVisit, PatientFile, PatientBilling

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
        fields = ('date', 'condition', 'diagnosedBy', 'status', 'notes')

class PatientVisitSerializer(serializers.ModelSerializer):
    doctorName = serializers.CharField(source='doctor_name')

    class Meta:
        model = PatientVisit
        fields = ('id', 'date', 'department', 'doctorName', 'reason', 'notes')

class PatientFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientFile
        fields = ('id', 'name', 'size', 'type', 'date', 'file')

class PatientBillingSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='billing_id', read_only=True)
    patientId = serializers.CharField(source='patient.patient_id', read_only=True)
    paidOn = serializers.DateTimeField(source='paid_on', read_only=True)
    receiptId = serializers.CharField(source='receipt_id', read_only=True)
    consultationCharge = serializers.DecimalField(source='consultation_charge', max_digits=10, decimal_places=2, required=False)
    laboratoryCharge = serializers.DecimalField(source='laboratory_charge', max_digits=10, decimal_places=2, required=False)
    refundStatus = serializers.CharField(source='refund_status', required=False)

    class Meta:
        model = PatientBilling
        fields = ('id', 'patientId', 'description', 'amount', 'status', 'paidOn', 'method', 'receiptId', 'consultationCharge', 'laboratoryCharge', 'refundStatus')

class PatientProfileSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='patient_id', read_only=True)
    name = serializers.CharField(source='user.name', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    bloodGroup = serializers.CharField(source='blood_group', required=False, allow_blank=True)
    emergencyName = serializers.CharField(source='emergency_name', required=False, allow_blank=True)
    emergencyPhone = serializers.CharField(source='emergency_phone', required=False, allow_blank=True)
    nationalId = serializers.CharField(source='national_id', required=False, allow_blank=True)
    insuranceCarrier = serializers.CharField(source='insurance_carrier', required=False, allow_blank=True)
    insurancePolicy = serializers.CharField(source='insurance_policy', required=False, allow_blank=True)
    
    vitalsHistory = PatientVitalSerializer(source='vitals', many=True, read_only=True)
    medicalHistory = PatientMedicalHistorySerializer(source='medical_history', many=True, read_only=True)
    billings = PatientBillingSerializer(many=True, read_only=True)

    class Meta:
        model = PatientProfile
        fields = (
            'id', 'name', 'email', 'dob', 'gender', 'bloodGroup', 'phone',
            'emergencyName', 'emergencyPhone', 'allergies', 'address', 'nationalId',
            'insuranceCarrier', 'insurancePolicy', 'avatar', 'vitalsHistory', 'medicalHistory', 'billings'
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
        instance.address = validated_data.get('address', instance.address)
        instance.national_id = validated_data.get('national_id', instance.national_id)
        instance.insurance_carrier = validated_data.get('insurance_carrier', instance.insurance_carrier)
        instance.insurance_policy = validated_data.get('insurance_policy', instance.insurance_policy)
        if 'avatar' in validated_data:
            instance.avatar = validated_data['avatar']
        
        # Also allow updating user's name
        user_data = self.initial_data.get('user', {})
        if 'name' in user_data:
            instance.user.name = user_data['name']
            instance.user.save()
            
        instance.save()
        return instance
