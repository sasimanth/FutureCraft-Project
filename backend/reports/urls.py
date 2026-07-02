from django.urls import path
from .views import PrescriptionPdfView, ConsultationPdfView, LabReportPdfView, ReceiptPdfView

urlpatterns = [
    path('reports/prescription/<str:prescription_id>/', PrescriptionPdfView.as_view(), name='prescription_pdf'),
    path('reports/consultation/<str:consultation_id>/', ConsultationPdfView.as_view(), name='consultation_pdf'),
    path('reports/lab-report/<str:lab_id>/', LabReportPdfView.as_view(), name='lab_report_pdf'),
    path('reports/receipt/<str:billing_id>/', ReceiptPdfView.as_view(), name='receipt_pdf'),
]
