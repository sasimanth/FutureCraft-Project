from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, role='patient', name='', **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, role=role, name=name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'admin')
        extra_fields.setdefault('name', 'Administrator')
        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ('patient', 'Patient'),
        ('doctor', 'Doctor'),
        ('labtech', 'Lab Technician'),
        ('admin', 'Administrator'),
    )

    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='patient')
    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return f"{self.email} ({self.role})"

class AuditLog(models.Model):
    timestamp = models.DateTimeField(default=timezone.now)
    module = models.CharField(max_length=100)
    initiator = models.CharField(max_length=255)
    action = models.TextField()
    flag = models.CharField(max_length=50, default='SECURE')

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.timestamp} - {self.initiator} - {self.action}"

class AdminProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='admin_profile')
    employee_id = models.CharField(max_length=50, unique=True)
    department = models.CharField(max_length=100, default='IT & Administration')
    access_level = models.CharField(max_length=50, default='Super Admin')

    def __str__(self):
        return f"{self.employee_id} - {self.user.name}"
