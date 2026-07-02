from rest_framework import views, status, viewsets, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import CustomUser, AuditLog
from .serializers import UserSerializer, AuditLogSerializer, RegisterSerializer
from .permissions import IsAdminUser, IsOwnerOrStaff

class RegisterView(views.APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'success': True, 'message': 'Account registered successfully.'}, status=status.HTTP_201_CREATED)
        return Response({'success': False, 'message': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class LoginView(views.APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        role = request.data.get('role')

        if not email or not password or not role:
            return Response({'message': 'Please provide email, password, and role.'}, status=status.HTTP_400_BAD_REQUEST)

        # Authenticate user
        user = authenticate(email=email, password=password)
        if user is not None:
            if user.role != role:
                return Response({'message': 'Invalid credentials or selected role.'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Generate JWT token
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            # Build user response payload
            user_data = {
                'email': user.email,
                'name': user.name,
                'role': user.role,
                'token': access_token
            }

            # Map patient or doctor IDs
            if user.role == 'patient' and hasattr(user, 'patientprofile'):
                user_data['patientId'] = user.patientprofile.patient_id
            elif user.role == 'doctor' and hasattr(user, 'doctorprofile'):
                user_data['doctorId'] = user.doctorprofile.doctor_id

            # Log audit trail
            AuditLog.objects.create(
                module='accounts',
                initiator=email,
                action=f"Login successful with role: {role}",
                flag='SECURE'
            )

            return Response({'success': True, 'user': user_data}, status=status.HTTP_200_OK)
        
        return Response({'message': 'Invalid credentials or selected role.'}, status=status.HTTP_400_BAD_REQUEST)

class ProfileView(views.APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        user_data = serializer.data
        if user.role == 'patient' and hasattr(user, 'patientprofile'):
            user_data['patientId'] = user.patientprofile.patient_id
        elif user.role == 'doctor' and hasattr(user, 'doctorprofile'):
            user_data['doctorId'] = user.doctorprofile.doctor_id
        return Response(user_data, status=status.HTTP_200_OK)

class AuditLogViewSet(viewsets.ModelViewSet):
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer
    permission_classes = (IsAdminUser,)

class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated, IsOwnerOrStaff)

    def get_queryset(self):
        user = self.request.user
        if user.role == 'patient':
            return CustomUser.objects.filter(id=user.id)
        return CustomUser.objects.all()

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        data = request.data
        
        user.name = data.get('name', user.name)
        user.email = data.get('email', user.email)
        # Prevent non-admin users from changing their own role/active status
        if request.user.role == 'admin' or request.user.is_superuser:
            user.role = data.get('role', user.role)
            user.is_active = data.get('is_active', user.is_active)
            if 'emailVerified' in data:
                user.email_verified = data.get('emailVerified')
            if 'phoneVerified' in data:
                user.phone_verified = data.get('phoneVerified')
        else:
            # Patients/doctors/techs can verify their own details if they trigger it
            if 'emailVerified' in data:
                user.email_verified = data.get('emailVerified')
            if 'phoneVerified' in data:
                user.phone_verified = data.get('phoneVerified')
                
        if 'password' in data and data['password']:
            user.set_password(data['password'])
        user.save()

        # Update profiles name
        if user.role == 'patient' and hasattr(user, 'patientprofile'):
            user.patientprofile.save()
        elif user.role == 'doctor' and hasattr(user, 'doctorprofile'):
            user.doctorprofile.save()

        # Log audit
        AuditLog.objects.create(
            module='accounts',
            initiator=request.user.email,
            action=f"Updated details for user account: {user.email}",
            flag='SECURE'
        )

        serializer = self.get_serializer(user)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        user = self.get_object()
        email = user.email
        response = super().destroy(request, *args, **kwargs)
        
        # Log audit
        AuditLog.objects.create(
            module='accounts',
            initiator=request.user.email,
            action=f"Deleted user account: {email}",
            flag='SECURE'
        )
        return response

