from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PatientProfileViewSet, PatientBillingViewSet

router = DefaultRouter()
router.register(r'patients', PatientProfileViewSet, basename='patient')
router.register(r'billing', PatientBillingViewSet, basename='billing')

urlpatterns = [
    path('', include(router.urls)),
]
