from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DepartmentViewSet, DoctorViewSet, DoctorLeaveRequestViewSet, DoctorReviewViewSet

router = DefaultRouter()
router.register(r'departments', DepartmentViewSet, basename='department')
router.register(r'doctors', DoctorViewSet, basename='doctor')
router.register(r'leaves', DoctorLeaveRequestViewSet, basename='leave')
router.register(r'reviews', DoctorReviewViewSet, basename='review')

urlpatterns = [
    path('', include(router.urls)),
]
