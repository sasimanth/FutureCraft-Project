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

    def __str__(self):
        return f"{self.doctor_id} - {self.user.name}"
