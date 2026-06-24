from django.urls import path
from .views import AdminAnalyticsView, DoctorAnalyticsView, LabAnalyticsView

urlpatterns = [
    path('analytics/admin/', AdminAnalyticsView.as_view(), name='admin_analytics'),
    path('analytics/doctor/', DoctorAnalyticsView.as_view(), name='doctor_analytics'),
    path('analytics/laboratory/', LabAnalyticsView.as_view(), name='lab_analytics'),
]
