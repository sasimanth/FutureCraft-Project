from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import LabRequest, LabResult
from .serializers import LabRequestSerializer
from accounts.models import AuditLog

class LabRequestViewSet(viewsets.ModelViewSet):
    queryset = LabRequest.objects.all()
    serializer_class = LabRequestSerializer
    permission_classes = (permissions.IsAuthenticated,)
    lookup_field = 'lab_id'

    def update(self, request, *args, **kwargs):
        # Support file uploads sent alongside JSON fields via multipart/form-data
        # If it's sent as JSON, request.data is a dict. If multipart, convert QueryDict to a standard dict to prevent list-wrapping issues.
        if hasattr(request.data, 'dict'):
            data = request.data.dict()
        else:
            data = request.data.copy()
        
        # If file is attached in request.FILES, map it to raw_report_file
        file_obj = request.FILES.get('rawReportFile') or request.FILES.get('file')
        if file_obj:
            data['raw_report_file'] = file_obj

        # Map results from JSON if sent as a string (which sometimes happens in multipart form submits)
        import json
        if isinstance(data.get('results'), str):
            try:
                data['results'] = json.loads(data['results'])
            except json.JSONDecodeError:
                pass

        # Since we use nested write, we need to map results input key to parameters
        # DRF serializer with source='parameters' will map 'results' input to 'parameters' automatically.
        serializer = self.get_serializer(self.get_object(), data=data, partial=True)
        if serializer.is_valid():
            self.perform_update(serializer)
            
            # Log audit trail
            AuditLog.objects.create(
                module='laboratory',
                initiator=request.user.email,
                action=f"Authorized results compiled for test request ID: {self.get_object().lab_id}",
                flag='SECURE'
            )
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
