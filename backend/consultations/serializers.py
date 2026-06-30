from rest_framework import serializers
from .models import Consultation

class ConsultationSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='consultation_id')
    patientId = serializers.CharField(source='patient_id')
    doctorName = serializers.CharField(source='doctor_name')
    consultationDate = serializers.DateField(source='consultation_date', required=False)

    class Meta:
        model = Consultation
        fields = ('id', 'patientId', 'doctorName', 'diagnosis', 'consultationDate', 'symptoms', 'recommendations')

    def create(self, validated_data):
        consultation_id = validated_data.get('consultation_id')
        # Check if already exists, else create
        consult, created = Consultation.objects.update_or_create(
            consultation_id=consultation_id,
            defaults={
                'patient_id': validated_data.get('patient_id'),
                'doctor_name': validated_data.get('doctor_name'),
                'diagnosis': validated_data.get('diagnosis'),
                'consultation_date': validated_data.get('consultation_date') or timezone_now_date(),
                'symptoms': validated_data.get('symptoms', ''),
                'recommendations': validated_data.get('recommendations', '')
            }
        )
        
        # Log to medical history of the patient
        from patients.models import PatientProfile, PatientMedicalHistory
        patient = PatientProfile.objects.filter(patient_id=validated_data.get('patient_id')).first()
        if patient:
            PatientMedicalHistory.objects.get_or_create(
                patient=patient,
                date=consult.consultation_date,
                condition=consult.diagnosis,
                defaults={
                    'diagnosed_by': consult.doctor_name,
                    'status': 'Active'
                }
            )
            
        return consult

def timezone_now_date():
    from django.utils import timezone
    return timezone.now().date()
