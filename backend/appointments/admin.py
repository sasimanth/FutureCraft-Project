from django.contrib import admin
from .models import Appointment

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('appt_id', 'patient_id', 'doctor_name', 'dept_name', 'date', 'time_slot', 'status', 'type')
    search_fields = ('appt_id', 'patient_id', 'doctor_name', 'dept_name', 'symptoms')
    list_filter = ('status', 'type', 'date', 'time_slot')
    ordering = ('-date',)
