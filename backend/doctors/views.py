from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Department, DoctorProfile, DoctorLeaveRequest, DoctorReview
from .serializers import DepartmentSerializer, DoctorProfileSerializer, DoctorLeaveRequestSerializer, DoctorReviewSerializer
from accounts.permissions import IsAdminUser
from accounts.models import AuditLog

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = (permissions.IsAuthenticated,)
    lookup_field = 'dept_id'

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return super().get_permissions()

class DoctorViewSet(viewsets.ModelViewSet):
    queryset = DoctorProfile.objects.all()
    serializer_class = DoctorProfileSerializer
    permission_classes = (permissions.IsAuthenticated,)
    lookup_field = 'doctor_id'

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return super().get_permissions()

class DoctorLeaveRequestViewSet(viewsets.ModelViewSet):
    queryset = DoctorLeaveRequest.objects.all()
    serializer_class = DoctorLeaveRequestSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        qs = super().get_queryset()
        # If doctor logged in, they see their own leaves
        if self.request.user.role == 'doctor' and hasattr(self.request.user, 'doctorprofile'):
            qs = qs.filter(doctor=self.request.user.doctorprofile)
        return qs

    def perform_create(self, serializer):
        # Auto-assign doctor if a doctor is logged in
        if self.request.user.role == 'doctor' and hasattr(self.request.user, 'doctorprofile'):
            serializer.save(doctor=self.request.user.doctorprofile, status='Pending')
        else:
            # Admins or others must specify a doctor in request data
            doctor_id = self.request.data.get('doctorId')
            try:
                doctor = DoctorProfile.objects.get(doctor_id=doctor_id)
                serializer.save(doctor=doctor, status='Pending')
            except DoctorProfile.DoesNotExist:
                from rest_framework.exceptions import ValidationError
                raise ValidationError({'doctor': 'Doctor profile not found.'})

    @action(detail=True, methods=['post'], url_path='approve')
    def approve_leave(self, request, pk=None):
        if request.user.role != 'admin':
            return Response({'error': 'Only administrators can approve leaves.'}, status=status.HTTP_403_FORBIDDEN)
        
        leave = self.get_object()
        leave.status = 'Approved'
        leave.save()

        # Cancel overlapping appointments
        from appointments.models import Appointment
        overlapping_appts = Appointment.objects.filter(
            doctor_id=leave.doctor.doctor_id,
            date__range=[leave.start_date, leave.end_date]
        ).exclude(status__in=['cancelled', 'completed'])
        
        cancelled_count = overlapping_appts.count()
        if cancelled_count > 0:
            # We can log each cancelled appt ID in the action description
            appt_ids = list(overlapping_appts.values_list('appt_id', flat=True))
            overlapping_appts.update(status='cancelled')
            
            AuditLog.objects.create(
                module='doctors',
                initiator=request.user.email,
                action=f"Cancelled conflicting appointments {appt_ids} due to approved leave for doctor {leave.doctor.doctor_id}",
                flag='SECURE'
            )

        AuditLog.objects.create(
            module='doctors',
            initiator=request.user.email,
            action=f"Approved leave request for doctor {leave.doctor.doctor_id} ({leave.start_date} to {leave.end_date})",
            flag='SECURE'
        )
        return Response(DoctorLeaveRequestSerializer(leave).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='reject')
    def reject_leave(self, request, pk=None):
        if request.user.role != 'admin':
            return Response({'error': 'Only administrators can reject leaves.'}, status=status.HTTP_403_FORBIDDEN)
        
        leave = self.get_object()
        leave.status = 'Rejected'
        leave.save()

        AuditLog.objects.create(
            module='doctors',
            initiator=request.user.email,
            action=f"Rejected leave request for doctor {leave.doctor.doctor_id} ({leave.start_date} to {leave.end_date})",
            flag='SECURE'
        )
        return Response(DoctorLeaveRequestSerializer(leave).data, status=status.HTTP_200_OK)

class DoctorReviewViewSet(viewsets.ModelViewSet):
    queryset = DoctorReview.objects.all()
    serializer_class = DoctorReviewSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        qs = super().get_queryset()
        doctor_id = self.request.query_params.get('doctorId')
        if doctor_id:
            qs = qs.filter(doctor__doctor_id=doctor_id)
        # If doctor logged in, they can see reviews directed at them
        if self.request.user.role == 'doctor' and hasattr(self.request.user, 'doctorprofile'):
            qs = qs.filter(doctor=self.request.user.doctorprofile)
        return qs

    def perform_create(self, serializer):
        doctor_id = self.request.data.get('doctorId')
        appt_id = self.request.data.get('apptId')
        
        # Prevent duplicate reviews for the same consultation/appointment
        if appt_id and DoctorReview.objects.filter(appt_id=appt_id).exists():
            from rest_framework.exceptions import ValidationError
            raise ValidationError({'apptId': 'This consultation has already been rated.'})

        try:
            doctor = DoctorProfile.objects.get(doctor_id=doctor_id)
            serializer.save(doctor=doctor)
        except DoctorProfile.DoesNotExist:
            from rest_framework.exceptions import ValidationError
            raise ValidationError({'doctor': 'Doctor profile not found.'})

    @action(detail=True, methods=['post'], url_path='respond')
    def respond_to_review(self, request, pk=None):
        review = self.get_object()
        # Only the doctor this review belongs to can respond
        if request.user.role != 'doctor' or not hasattr(request.user, 'doctorprofile') or review.doctor != request.user.doctorprofile:
            return Response({'error': 'Unauthorized to respond to this review.'}, status=status.HTTP_403_FORBIDDEN)
        
        response_text = request.data.get('response', '')
        review.response = response_text
        review.save()

        AuditLog.objects.create(
            module='doctors',
            initiator=request.user.email,
            action=f"Doctor {review.doctor.doctor_id} responded to patient review ID {review.id}",
            flag='SECURE'
        )
        return Response(DoctorReviewSerializer(review).data, status=status.HTTP_200_OK)
