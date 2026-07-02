from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LabRequestViewSet

router = DefaultRouter()
router.register(r'lab-tests', LabRequestViewSet, basename='labtest')

urlpatterns = [
    path('', include(router.urls)),
]
