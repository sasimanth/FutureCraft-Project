from django.contrib import admin
from .models import PatientProfile, PatientVital, PatientMedicalHistory, PatientVisit, PatientFile

@admin.register(PatientProfile)
class PatientProfileAdmin(admin.ModelAdmin):
    list_display = ('patient_id', 'user_email', 'user_name', 'gender', 'blood_group', 'phone')
    search_fields = ('patient_id', 'user__email', 'user__name', 'phone')
    list_filter = ('gender', 'blood_group')

    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = 'Email'

    def user_name(self, obj):
        return obj.user.name
    user_name.short_description = 'Name'

@admin.register(PatientVital)
class PatientVitalAdmin(admin.ModelAdmin):
    list_display = ('id', 'patient', 'date', 'bp_systolic', 'bp_diastolic', 'heart_rate', 'temp', 'weight')
    search_fields = ('patient__patient_id', 'patient__user__name')
    list_filter = ('date',)

@admin.register(PatientMedicalHistory)
class PatientMedicalHistoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'patient', 'date', 'condition', 'diagnosed_by', 'status')
    search_fields = ('patient__patient_id', 'patient__user__name', 'condition', 'diagnosed_by')
    list_filter = ('status', 'date')

@admin.register(PatientVisit)
class PatientVisitAdmin(admin.ModelAdmin):
    list_display = ('id', 'patient', 'date', 'department', 'doctor_name', 'reason')
    search_fields = ('patient__patient_id', 'patient__user__name', 'doctor_name', 'reason')
    list_filter = ('department', 'date')

@admin.register(PatientFile)
class PatientFileAdmin(admin.ModelAdmin):
    list_display = ('id', 'patient', 'name', 'size', 'type', 'date', 'file')
    search_fields = ('patient__patient_id', 'patient__user__name', 'name')
    list_filter = ('date', 'type')
