from django.contrib import admin
from .models import Department, DoctorProfile

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('dept_id', 'name', 'head', 'staff_count')
    search_fields = ('dept_id', 'name', 'head')
    ordering = ('dept_id',)

@admin.register(DoctorProfile)
class DoctorProfileAdmin(admin.ModelAdmin):
    list_display = ('doctor_id', 'user_email', 'user_name', 'specialization', 'department')
    search_fields = ('doctor_id', 'user__email', 'user__name', 'specialization')
    list_filter = ('department', 'specialization')

    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = 'Email'

    def user_name(self, obj):
        return obj.user.name
    user_name.short_description = 'Name'
