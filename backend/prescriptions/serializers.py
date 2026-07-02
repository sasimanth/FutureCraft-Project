from rest_framework import serializers
from .models import Prescription, PrescriptionMedicine

class PrescriptionMedicineSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrescriptionMedicine
        fields = ('name', 'dosage', 'frequency', 'duration', 'route', 'instructions', 'notes')

class PrescriptionSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='prescription_id')
    patientId = serializers.CharField(source='patient_id')
    doctorName = serializers.CharField(source='doctor_name')
    medicines = PrescriptionMedicineSerializer(many=True)

    class Meta:
        model = Prescription
        fields = ('id', 'patientId', 'doctorName', 'date', 'diagnosis', 'medicines')

    def create(self, validated_data):
        medicines_data = validated_data.pop('medicines')
        prescription_id = validated_data.get('prescription_id')
        
        prescription, created = Prescription.objects.update_or_create(
            prescription_id=prescription_id,
            defaults={
                'patient_id': validated_data.get('patient_id'),
                'doctor_name': validated_data.get('doctor_name'),
                'date': validated_data.get('date') or timezone_now_date(),
                'diagnosis': validated_data.get('diagnosis')
            }
        )
        
        # Clear existing medicines to prevent duplicates on update
        prescription.medicines.all().delete()
        
        for medicine_data in medicines_data:
            PrescriptionMedicine.objects.create(prescription=prescription, **medicine_data)
            
        return prescription

def timezone_now_date():
    from django.utils import timezone
    return timezone.now().date()
