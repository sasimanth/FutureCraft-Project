from django.contrib import admin
from .models import CustomUser, AuditLog

@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('id', 'email', 'name', 'role', 'is_active', 'is_staff')
    list_filter = ('role', 'is_active', 'is_staff')
    search_fields = ('email', 'name')
    ordering = ('id',)

@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ('id', 'timestamp', 'module', 'initiator', 'action', 'flag')
    list_filter = ('module', 'flag', 'timestamp')
    search_fields = ('initiator', 'action')
    ordering = ('-timestamp',)
