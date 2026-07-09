from django.db import models
from django.utils import timezone

class Prescription(models.Model):
    prescription_id = models.CharField(max_length=50, unique=True)
    patient_id = models.CharField(max_length=50) # pat-1
    doctor_name = models.CharField(max_length=255) # Dr. Sarah Connor
    date = models.DateField(default=timezone.now)
    diagnosis = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f"{self.prescription_id} - {self.patient_id} - {self.doctor_name}"

class PrescriptionMedicine(models.Model):
    prescription = models.ForeignKey(Prescription, on_delete=models.CASCADE, related_name='medicines')
    name = models.CharField(max_length=255)
    dosage = models.CharField(max_length=100)
    frequency = models.CharField(max_length=100, blank=True, default='')
    duration = models.CharField(max_length=100)
    route = models.CharField(max_length=100, blank=True, default='')
    instructions = models.TextField(blank=True, default='')
    notes = models.TextField(blank=True, default='')

    def __str__(self):
        return f"{self.name} for {self.prescription.prescription_id}"

