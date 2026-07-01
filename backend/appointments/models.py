from django.db import models
from django.utils import timezone

class Appointment(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
        ('completed_with_rating', 'Completed with Rating'),
    )
    TYPE_CHOICES = (
        ('Doctor Checkup', 'Doctor Checkup'),
        ('Laboratory Test', 'Laboratory Test'),
        ('Emergency Patient', 'Emergency Patient'),
    )

    appt_id = models.CharField(max_length=50, unique=True)
    patient_id = models.CharField(max_length=50) # pat-1
    doctor_id = models.CharField(max_length=50) # doc-1
    doctor_name = models.CharField(max_length=255)
    dept_name = models.CharField(max_length=100) # General Medicine
    date = models.DateField(default=timezone.now)
    time_slot = models.CharField(max_length=50) # 09:30 AM
    symptoms = models.TextField(blank=True, default='')
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending')
    type = models.CharField(max_length=50, choices=TYPE_CHOICES, default='Doctor Checkup')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['date', 'time_slot']

    def __str__(self):
        return f"{self.appt_id} - {self.patient_id} - {self.doctor_name} ({self.status})"
