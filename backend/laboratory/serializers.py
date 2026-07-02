from rest_framework import serializers
from .models import LabRequest, LabResult

class LabResultSerializer(serializers.ModelSerializer):
    refRange = serializers.CharField(source='ref_range')

    class Meta:
        model = LabResult
        fields = ('parameter', 'value', 'unit', 'refRange', 'flag')

class LabRequestSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='lab_id')
    patientId = serializers.CharField(source='patient_id')
    patientName = serializers.CharField(source='patient_name')
    doctorName = serializers.CharField(source='doctor_name')
    testCategory = serializers.CharField(source='test_category')
    testName = serializers.CharField(source='test_name')
    requestDate = serializers.DateField(source='request_date')
    resultDate = serializers.DateField(source='result_date', required=False, allow_null=True)
    results = LabResultSerializer(source='parameters', many=True, required=False)
    consultationId = serializers.CharField(source='consultation_id', required=False, allow_blank=True)
    appointmentId = serializers.CharField(source='appointment_id', required=False, allow_blank=True)
    doctorNotes = serializers.CharField(source='doctor_notes', required=False, allow_blank=True)
    techComments = serializers.CharField(source='tech_comments', required=False, allow_blank=True)
    
    # Custom representation for file field (return file details or URL)
    rawReportFile = serializers.SerializerMethodField(required=False)

    class Meta:
        model = LabRequest
        fields = (
            'id', 'patientId', 'patientName', 'doctorName', 'testCategory', 'testName',
            'requestDate', 'status', 'resultDate', 'technician', 'priority', 'results', 'rawReportFile',
            'consultationId', 'appointmentId', 'doctorNotes', 'techComments'
        )

    def get_rawReportFile(self, obj):
        if obj.raw_report_file:
            return {
                'name': obj.raw_report_file.name.split('/')[-1],
                'url': obj.raw_report_file.url
            }
        return None

    def create(self, validated_data):
        results_data = validated_data.pop('parameters', [])
        lab_id = validated_data.get('lab_id')
        
        lab_request, created = LabRequest.objects.update_or_create(
            lab_id=lab_id,
            defaults={
                'patient_id': validated_data.get('patient_id'),
                'patient_name': validated_data.get('patient_name'),
                'doctor_name': validated_data.get('doctor_name'),
                'test_category': validated_data.get('test_category'),
                'test_name': validated_data.get('test_name'),
                'request_date': validated_data.get('request_date') or timezone_now_date(),
                'status': validated_data.get('status', 'pending'),
                'priority': validated_data.get('priority', 'Medium'),
                'consultation_id': validated_data.get('consultation_id', ''),
                'appointment_id': validated_data.get('appointment_id', ''),
                'doctor_notes': validated_data.get('doctor_notes', ''),
                'tech_comments': validated_data.get('tech_comments', '')
            }
        )
        return lab_request

    def update(self, instance, validated_data):
        results_data = validated_data.pop('parameters', None)
        
        instance.status = validated_data.get('status', instance.status)
        instance.result_date = validated_data.get('result_date', instance.result_date)
        instance.technician = validated_data.get('technician', instance.technician)
        instance.priority = validated_data.get('priority', instance.priority)
        instance.appointment_id = validated_data.get('appointment_id', instance.appointment_id)
        instance.doctor_notes = validated_data.get('doctor_notes', instance.doctor_notes)
        instance.tech_comments = validated_data.get('tech_comments', instance.tech_comments)
        
        if 'raw_report_file' in validated_data:
            instance.raw_report_file = validated_data.get('raw_report_file')
            
        instance.save()

        # Update parameter results
        if results_data is not None:
            instance.parameters.all().delete()
            for result_item in results_data:
                LabResult.objects.create(lab_request=instance, **result_item)
                
        return instance

def timezone_now_date():
    from django.utils import timezone
    return timezone.now().date()
