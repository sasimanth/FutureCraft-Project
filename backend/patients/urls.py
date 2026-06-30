from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PatientProfileViewSet

router = DefaultRouter()
router.register(r'patients', PatientProfileViewSet, basename='patient')

urlpatterns = [
    path('', include(router.urls)),
]
