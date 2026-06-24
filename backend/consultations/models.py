from django.db import models
from django.utils import timezone

class Consultation(models.Model):
    consultation_id = models.CharField(max_length=50, unique=True)
    patient_id = models.CharField(max_length=50) # pat-1
    doctor_name = models.CharField(max_length=255) # Dr. Sarah Connor
    diagnosis = models.TextField()
    consultation_date = models.DateField(default=timezone.now)
    symptoms = models.TextField()
    recommendations = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-consultation_date']

    def __str__(self):
        return f"{self.consultation_id} - {self.patient_id} - {self.doctor_name}"
