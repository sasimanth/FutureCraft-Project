from django.db import models
from django.conf import settings
from django.utils import timezone

class PatientProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    patient_id = models.CharField(max_length=50, unique=True)
    dob = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=50, blank=True)
    blood_group = models.CharField(max_length=10, blank=True)
    phone = models.CharField(max_length=50, blank=True)
    emergency_name = models.CharField(max_length=255, blank=True)
    emergency_phone = models.CharField(max_length=50, blank=True)
    allergies = models.TextField(default='None')

    def __str__(self):
        return f"{self.patient_id} - {self.user.name}"

class PatientVital(models.Model):
    patient = models.ForeignKey(PatientProfile, on_delete=models.CASCADE, related_name='vitals')
    date = models.DateField(default=timezone.now)
    bp_systolic = models.IntegerField()
    bp_diastolic = models.IntegerField()
    heart_rate = models.IntegerField()
    temp = models.DecimalField(max_digits=5, decimal_places=2)
    weight = models.DecimalField(max_digits=5, decimal_places=2)

    class Meta:
        ordering = ['date']

    def __str__(self):
        return f"Vitals for {self.patient.patient_id} on {self.date}"

class PatientMedicalHistory(models.Model):
    patient = models.ForeignKey(PatientProfile, on_delete=models.CASCADE, related_name='medical_history')
    date = models.DateField(default=timezone.now)
    condition = models.CharField(max_length=255)
    diagnosed_by = models.CharField(max_length=255)
    status = models.CharField(max_length=100) # e.g. Active, Managed, Recovered

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f"{self.condition} - {self.patient.patient_id} ({self.status})"

class PatientVisit(models.Model):
    patient = models.ForeignKey(PatientProfile, on_delete=models.CASCADE, related_name='visits')
    date = models.DateField(default=timezone.now)
    department = models.CharField(max_length=100)
    doctor_name = models.CharField(max_length=255)
    reason = models.TextField()

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f"Visit by {self.patient.patient_id} to {self.department} on {self.date}"

class PatientFile(models.Model):
    patient = models.ForeignKey(PatientProfile, on_delete=models.CASCADE, related_name='files')
    name = models.CharField(max_length=255)
    file = models.FileField(upload_to='patient_files/')
    size = models.CharField(max_length=50) # e.g. "1.4 MB"
    type = models.CharField(max_length=100) # e.g. "application/pdf"
    date = models.DateField(default=timezone.now)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f"File {self.name} for {self.patient.patient_id}"
