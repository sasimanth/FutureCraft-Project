from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import PatientProfile, PatientVisit, PatientFile, PatientBilling
from .serializers import (
    PatientProfileSerializer, PatientVitalSerializer, PatientMedicalHistorySerializer,
    PatientVisitSerializer, PatientFileSerializer, PatientBillingSerializer
)
from accounts.permissions import IsOwnerOrStaff
from django.utils import timezone
from accounts.models import AuditLog

class PatientProfileViewSet(viewsets.ModelViewSet):
    queryset = PatientProfile.objects.all()
    serializer_class = PatientProfileSerializer
    permission_classes = (permissions.IsAuthenticated, IsOwnerOrStaff)
    lookup_field = 'patient_id'

    # Custom action to add vitals
    @action(detail=True, methods=['post'], url_path='vitals')
    def add_vitals(self, request, patient_id=None):
        patient = self.get_object()
        data = request.data.copy()
        
        # Map frontend camelCase to serializer expected fields
        vital_data = {
            'date': data.get('date', timezone.now().date()),
            'bpSystolic': data.get('bpSystolic'),
            'bpDiastolic': data.get('bpDiastolic'),
            'heartRate': data.get('heartRate'),
            'temp': data.get('temp'),
            'weight': data.get('weight')
        }
        
        serializer = PatientVitalSerializer(data=vital_data)
        if serializer.is_valid():
            serializer.save(patient=patient)
            
            # Log audit
            AuditLog.objects.create(
                module='patients',
                initiator=request.user.email,
                action=f"Added vital signs for patient ID: {patient.patient_id}",
                flag='SECURE'
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Custom action to add medical history
    @action(detail=True, methods=['post'], url_path='medical-history')
    def add_medical_history(self, request, patient_id=None):
        patient = self.get_object()
        data = request.data.copy()
        
        history_data = {
            'date': data.get('date', timezone.now().date()),
            'condition': data.get('condition'),
            'diagnosedBy': data.get('diagnosedBy', request.user.name or 'Staff'),
            'status': data.get('status', 'Active')
        }
        
        serializer = PatientMedicalHistorySerializer(data=history_data)
        if serializer.is_valid():
            serializer.save(patient=patient)
            AuditLog.objects.create(
                module='patients',
                initiator=request.user.email,
                action=f"Added medical history item ({history_data['condition']}) for patient ID: {patient.patient_id}",
                flag='SECURE'
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Custom action to upload/list/add visits log
    @action(detail=True, methods=['post', 'get'], url_path='visits')
    def manage_visits(self, request, patient_id=None):
        patient = self.get_object()
        
        if request.method == 'GET':
            visits = PatientVisit.objects.filter(patient=patient)
            serializer = PatientVisitSerializer(visits, many=True)
            return Response(serializer.data)
            
        elif request.method == 'POST':
            data = request.data.copy() if hasattr(request.data, 'copy') else request.data
            visit_data = {
                'date': data.get('date', timezone.now().date()),
                'department': data.get('department'),
                'doctorName': data.get('doctorName'),
                'reason': data.get('reason')
            }
            
            serializer = PatientVisitSerializer(data=visit_data)
            if serializer.is_valid():
                serializer.save(patient=patient)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Custom action to upload/list documents
    @action(detail=True, methods=['post', 'get'], url_path='files')
    def manage_files(self, request, patient_id=None):
        patient = self.get_object()
        
        if request.method == 'GET':
            files = PatientFile.objects.filter(patient=patient)
            serializer = PatientFileSerializer(files, many=True)
            return Response(serializer.data)
            
        elif request.method == 'POST':
            file_obj = request.FILES.get('file')
            if not file_obj:
                return Response({'error': 'No file attached.'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Auto-calculate size and format
            size_mb = file_obj.size / (1024 * 1024)
            size_str = f"{size_mb:.1f} MB"
            
            new_file = PatientFile.objects.create(
                patient=patient,
                name=file_obj.name,
                file=file_obj,
                size=size_str,
                type=file_obj.content_type,
                date=timezone.now().date()
            )
            
            serializer = PatientFileSerializer(new_file)
            
            AuditLog.objects.create(
                module='patients',
                initiator=request.user.email,
                action=f"Uploaded document: {file_obj.name} for patient ID: {patient.patient_id}",
                flag='SECURE'
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)

    # Delete specific file action
    @action(detail=True, methods=['delete'], url_path='files/(?P<file_id>[^/.]+)')
    def delete_file(self, request, patient_id=None, file_id=None):
        patient = self.get_object()
        try:
            patient_file = PatientFile.objects.get(patient=patient, id=file_id)
            file_name = patient_file.name
            patient_file.delete()
            
            AuditLog.objects.create(
                module='patients',
                initiator=request.user.email,
                action=f"Deleted document: {file_name} for patient ID: {patient.patient_id}",
                flag='SECURE'
            )
            return Response({'success': True, 'message': 'File document deleted.'})
        except PatientFile.DoesNotExist:
            return Response({'error': 'File not found.'}, status=status.HTTP_404_NOT_FOUND)

class PatientBillingViewSet(viewsets.ModelViewSet):
    queryset = PatientBilling.objects.all()
    serializer_class = PatientBillingSerializer
    permission_classes = (permissions.IsAuthenticated,)
    lookup_field = 'billing_id'

    def get_queryset(self):
        qs = super().get_queryset()
        patient_id = self.request.query_params.get('patientId')
        if patient_id:
            qs = qs.filter(patient__patient_id=patient_id)
        # Patients can only see their own bills
        if self.request.user.role == 'patient' and hasattr(self.request.user, 'patientprofile'):
            qs = qs.filter(patient=self.request.user.patientprofile)
        return qs

    @action(detail=True, methods=['post'], url_path='pay')
    def pay_bill(self, request, billing_id=None):
        bill = self.get_object()
        if bill.status == 'paid':
            return Response({'error': 'Invoice already paid.'}, status=status.HTTP_400_BAD_REQUEST)
        
        method = request.data.get('method', 'Card')
        bill.status = 'paid'
        bill.method = method
        bill.paid_on = timezone.now()
        bill.receipt_id = f"REC-{timezone.now().strftime('%y%m%d%H%M%S')}"
        bill.save()

        AuditLog.objects.create(
            module='patients',
            initiator=request.user.email,
            action=f"Completed payment of ${bill.amount:.2f} for bill {bill.billing_id} via {method}",
            flag='SECURE'
        )
        return Response(PatientBillingSerializer(bill).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='refund')
    def refund_bill(self, request, billing_id=None):
        bill = self.get_object()
        if bill.status != 'paid':
            return Response({'error': 'Only paid bills can be refunded.'}, status=status.HTTP_400_BAD_REQUEST)

        bill.status = 'refunded'
        bill.refund_status = 'processed'
        bill.save()

        AuditLog.objects.create(
            module='patients',
            initiator=request.user.email,
            action=f"Refunded payment of ${bill.amount:.2f} for bill {bill.billing_id}",
            flag='SECURE'
        )
        return Response(PatientBillingSerializer(bill).data, status=status.HTTP_200_OK)
