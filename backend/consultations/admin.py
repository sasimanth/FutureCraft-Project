from django.contrib import admin
from .models import Consultation

@admin.register(Consultation)
class ConsultationAdmin(admin.ModelAdmin):
    list_display = ('consultation_id', 'patient_id', 'doctor_name', 'consultation_date', 'diagnosis')
    search_fields = ('consultation_id', 'patient_id', 'doctor_name', 'diagnosis', 'symptoms', 'recommendations')
    list_filter = ('consultation_date',)
    ordering = ('-consultation_date',)
