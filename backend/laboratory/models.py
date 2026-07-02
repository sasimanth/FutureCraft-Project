from django.db import models
from django.utils import timezone

class LabRequest(models.Model):
    PRIORITY_CHOICES = (
        ('Low', 'Low'),
        ('Medium', 'Medium'),
        ('High', 'High'),
        ('Critical', 'Critical'),
    )
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('registered', 'Registered'),
        ('sample_collected', 'Sample Collected'),
        ('processing', 'Processing'),
        ('results_ready', 'Results Ready'),
        ('completed', 'Completed'),
    )

    lab_id = models.CharField(max_length=50, unique=True)
    patient_id = models.CharField(max_length=50) # pat-1
    patient_name = models.CharField(max_length=255)
    doctor_name = models.CharField(max_length=255) # Dr. Sarah Connor
    test_category = models.CharField(max_length=100) # Blood Test
    test_name = models.CharField(max_length=255) # Complete Blood Count (CBC)
    request_date = models.DateField(default=timezone.now)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    result_date = models.DateField(null=True, blank=True)
    technician = models.CharField(max_length=255, blank=True, default='')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='Medium')
    
    raw_report_file = models.FileField(upload_to='lab_reports/', null=True, blank=True)
    consultation_id = models.CharField(max_length=50, blank=True, default='')
    appointment_id = models.CharField(max_length=50, blank=True, default='')
    doctor_notes = models.TextField(blank=True, default='')
    tech_comments = models.TextField(blank=True, default='')

    class Meta:
        ordering = ['-request_date']

    def __str__(self):
        return f"{self.lab_id} - {self.test_name} ({self.status})"

class LabResult(models.Model):
    lab_request = models.ForeignKey(LabRequest, on_delete=models.CASCADE, related_name='parameters')
    parameter = models.CharField(max_length=255) # e.g. Hemoglobin
    value = models.DecimalField(max_digits=8, decimal_places=2)
    unit = models.CharField(max_length=50) # e.g. g/dL
    ref_range = models.CharField(max_length=100) # e.g. 13.5 - 17.5
    flag = models.CharField(max_length=50, default='Normal') # Normal, High, Low

    def __str__(self):
        return f"{self.parameter}: {self.value} {self.unit} ({self.flag})"

class LabTechnicianProfile(models.Model):
    user = models.OneToOneField('accounts.CustomUser', on_delete=models.CASCADE, related_name='labtech_profile')
    employee_id = models.CharField(max_length=50, unique=True)
    qualification = models.CharField(max_length=255, blank=True)
    shift = models.CharField(max_length=50, default='Day')

    def __str__(self):
        return f"{self.employee_id} - {self.user.name}"
