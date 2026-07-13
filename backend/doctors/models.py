from django.db import models
from django.conf import settings

class Department(models.Model):
    dept_id = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=100)
    head = models.CharField(max_length=255)
    staff_count = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.name} ({self.dept_id})"

class DoctorProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    doctor_id = models.CharField(max_length=50, unique=True)
    specialization = models.CharField(max_length=255)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, related_name='doctors')
    phone = models.CharField(max_length=50, blank=True, default='')
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)

    def __str__(self):
        return f"{self.doctor_id} - {self.user.name}"

class DoctorLeaveRequest(models.Model):
    STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
    )
    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE, related_name='leaves', null=True, blank=True)
    technician = models.ForeignKey('laboratory.LabTechnicianProfile', on_delete=models.CASCADE, related_name='leaves', null=True, blank=True)
    start_date = models.DateField()
    end_date = models.DateField()
    leave_type = models.CharField(max_length=50)
    reason = models.TextField(blank=True, default='')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    remarks = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-start_date']

    def __str__(self):
        identifier = self.doctor.doctor_id if self.doctor else (self.technician.employee_id if self.technician else "Unknown")
        return f"{identifier} - {self.start_date} to {self.end_date} ({self.status})"

class DoctorReview(models.Model):
    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE, related_name='reviews')
    patient_name = models.CharField(max_length=255)
    appt_id = models.CharField(max_length=50)
    rating = models.IntegerField()
    comments = models.TextField(blank=True, default='')
    date = models.DateField(auto_now_add=True)
    response = models.TextField(blank=True, default='')

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f"Review for {self.doctor.doctor_id} - {self.rating} stars"
