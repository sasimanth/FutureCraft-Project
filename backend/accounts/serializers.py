from rest_framework import serializers
from .models import CustomUser, AuditLog

class UserSerializer(serializers.ModelSerializer):
    patientId = serializers.SerializerMethodField(required=False)
    doctorId = serializers.SerializerMethodField(required=False)

    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'name', 'role', 'is_active', 'patientId', 'doctorId')

    def get_patientId(self, obj):
        if obj.role == 'patient' and hasattr(obj, 'patientprofile'):
            return obj.patientprofile.patient_id
        return None

    def get_doctorId(self, obj):
        if obj.role == 'doctor' and hasattr(obj, 'doctorprofile'):
            return obj.doctorprofile.doctor_id
        return None

class AuditLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditLog
        fields = ('id', 'timestamp', 'module', 'initiator', 'action', 'flag')

class RegisterSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=CustomUser.ROLE_CHOICES, default='patient')

    # Patient extra fields (optional in serializer, validated in create)
    dob = serializers.DateField(required=False, allow_null=True)
    gender = serializers.CharField(required=False, allow_blank=True)
    bloodGroup = serializers.CharField(required=False, allow_blank=True)
    phone = serializers.CharField(required=False, allow_blank=True)
    emergencyName = serializers.CharField(required=False, allow_blank=True)
    emergencyPhone = serializers.CharField(required=False, allow_blank=True)

    # Doctor extra fields (optional in serializer)
    deptId = serializers.CharField(required=False, allow_blank=True)
    specialization = serializers.CharField(required=False, allow_blank=True)

    # Labtech extra fields (optional in serializer)
    qualification = serializers.CharField(required=False, allow_blank=True)
    shift = serializers.CharField(required=False, allow_blank=True)

    # Admin extra fields (optional in serializer)
    department = serializers.CharField(required=False, allow_blank=True)
    access_level = serializers.CharField(required=False, allow_blank=True)

    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email address already registered.")
        return value

    def create(self, validated_data):
        email = validated_data.get('email')
        password = validated_data.get('password')
        role = validated_data.get('role', 'patient')
        name = validated_data.get('name', '')

        # Create user
        user = CustomUser.objects.create_user(
            email=email,
            password=password,
            role=role,
            name=name
        )

        # Create associated profiles based on role
        if role == 'patient':
            from patients.models import PatientProfile, PatientVisit
            # Determine new patient ID sequence (e.g. pat-1, pat-2)
            patient_count = PatientProfile.objects.count() + 1
            patient_id = f"pat-{patient_count}"
            
            # Map frontend keys (camelCase) to model keys (snake_case)
            profile = PatientProfile.objects.create(
                user=user,
                patient_id=patient_id,
                dob=validated_data.get('dob') or '1990-01-01',
                gender=validated_data.get('gender', 'Other'),
                blood_group=validated_data.get('bloodGroup', ''),
                phone=validated_data.get('phone', ''),
                emergency_name=validated_data.get('emergencyName', ''),
                emergency_phone=validated_data.get('emergencyPhone', ''),
                allergies='None'
            )

            # Create default registration visit
            PatientVisit.objects.create(
                patient=profile,
                date=timezone_now_date(),
                department='General Medicine',
                doctor_name='System Registrar',
                reason='Portal registration profile created.'
            )

        elif role == 'doctor':
            from doctors.models import DoctorProfile, Department
            doctor_count = DoctorProfile.objects.count() + 1
            doctor_id = f"doc-{doctor_count}"
            
            dept_id = validated_data.get('deptId', 'dept-1')
            dept, _ = Department.objects.get_or_create(
                dept_id=dept_id,
                defaults={'name': 'General Medicine', 'head': 'System Head', 'staff_count': 1}
            )

            DoctorProfile.objects.create(
                user=user,
                doctor_id=doctor_id,
                specialization=validated_data.get('specialization', 'General Practice'),
                department=dept
            )

        elif role == 'labtech':
            from laboratory.models import LabTechnicianProfile
            labtech_count = LabTechnicianProfile.objects.count() + 1
            employee_id = f"emp-labtech-{labtech_count}"
            LabTechnicianProfile.objects.create(
                user=user,
                employee_id=employee_id,
                qualification=validated_data.get('qualification', 'Senior Lab Scientist'),
                shift=validated_data.get('shift', 'Day')
            )

        elif role == 'admin':
            from accounts.models import AdminProfile
            admin_count = AdminProfile.objects.count() + 1
            employee_id = f"emp-admin-{admin_count}"
            AdminProfile.objects.create(
                user=user,
                employee_id=employee_id,
                department=validated_data.get('department', 'IT & Administration'),
                access_level=validated_data.get('access_level', 'Super Admin')
            )

        # Log audit trail
        AuditLog.objects.create(
            module='accounts',
            initiator=email,
            action=f"Registered user account with role: {role}",
            flag='SECURE'
        )

        return user

def timezone_now_date():
    from django.utils import timezone
    return timezone.now().date()
