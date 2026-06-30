from django.contrib import admin
from .models import LabRequest, LabResult

class LabResultInline(admin.TabularInline):
    model = LabResult
    extra = 1

@admin.register(LabRequest)
class LabRequestAdmin(admin.ModelAdmin):
    list_display = ('lab_id', 'patient_id', 'patient_name', 'doctor_name', 'test_name', 'status', 'request_date', 'priority')
    search_fields = ('lab_id', 'patient_id', 'patient_name', 'doctor_name', 'test_name', 'technician')
    list_filter = ('status', 'priority', 'request_date', 'test_category')
    inlines = [LabResultInline]
    ordering = ('-request_date',)

@admin.register(LabResult)
class LabResultAdmin(admin.ModelAdmin):
    list_display = ('id', 'lab_request', 'parameter', 'value', 'unit', 'ref_range', 'flag')
    search_fields = ('lab_request__lab_id', 'parameter')
    list_filter = ('flag',)
