from django.contrib import admin
from .models import Prescription, PrescriptionMedicine

class PrescriptionMedicineInline(admin.TabularInline):
    model = PrescriptionMedicine
    extra = 1

@admin.register(Prescription)
class PrescriptionAdmin(admin.ModelAdmin):
    list_display = ('prescription_id', 'patient_id', 'doctor_name', 'date', 'diagnosis')
    search_fields = ('prescription_id', 'patient_id', 'doctor_name', 'diagnosis')
    list_filter = ('date',)
    inlines = [PrescriptionMedicineInline]
    ordering = ('-date',)

@admin.register(PrescriptionMedicine)
class PrescriptionMedicineAdmin(admin.ModelAdmin):
    list_display = ('id', 'prescription', 'name', 'dosage', 'duration', 'instructions')
    search_fields = ('prescription__prescription_id', 'name')
