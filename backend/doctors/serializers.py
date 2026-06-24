from rest_framework import serializers
from .models import Department, DoctorProfile

class DepartmentSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='dept_id')
    staffCount = serializers.IntegerField(source='staff_count')

    class Meta:
        model = Department
        fields = ('id', 'name', 'head', 'staffCount')

    def create(self, validated_data):
        dept_id = validated_data.get('dept_id')
        # Check if already exists
        dept, created = Department.objects.update_or_create(
            dept_id=dept_id,
            defaults={
                'name': validated_data.get('name'),
                'head': validated_data.get('head'),
                'staff_count': validated_data.get('staff_count', 0)
            }
        )
        return dept

class DoctorProfileSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='doctor_id', read_only=True)
    name = serializers.SerializerMethodField()
    deptId = serializers.CharField(source='department.dept_id', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = DoctorProfile
        fields = ('id', 'name', 'deptId', 'specialization', 'email')

    def get_name(self, obj):
        # Format name as "Dr. Name" if not already present
        name = obj.user.name
        if not name.startswith('Dr.'):
            return f"Dr. {name}"
        return name
