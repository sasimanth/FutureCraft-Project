from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework import permissions
from prescriptions.models import Prescription
from consultations.models import Consultation
from laboratory.models import LabRequest
from patients.models import PatientBilling
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
import io

class PrescriptionPdfView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, prescription_id):
        try:
            rx = Prescription.objects.get(prescription_id=prescription_id)
        except Prescription.DoesNotExist:
            return HttpResponse("Prescription not found", status=404)

        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
        story = []

        styles = getSampleStyleSheet()
        
        # Styles
        title_style = ParagraphStyle(
            'TitleStyle',
            parent=styles['Heading1'],
            fontSize=20,
            leading=24,
            textColor=colors.HexColor('#0f172a'),
            spaceAfter=15
        )
        subtitle_style = ParagraphStyle(
            'SubtitleStyle',
            parent=styles['Normal'],
            fontSize=10,
            leading=14,
            textColor=colors.HexColor('#64748b'),
            spaceAfter=20
        )
        section_style = ParagraphStyle(
            'SectionStyle',
            parent=styles['Heading2'],
            fontSize=14,
            leading=18,
            textColor=colors.HexColor('#1e3a8a'),
            spaceBefore=15,
            spaceAfter=10
        )
        body_style = ParagraphStyle(
            'BodyStyle',
            parent=styles['Normal'],
            fontSize=10,
            leading=14,
            textColor=colors.HexColor('#334155')
        )
        header_cell_style = ParagraphStyle(
            'HeaderCell',
            parent=styles['Normal'],
            fontSize=10,
            leading=12,
            textColor=colors.white,
            fontName='Helvetica-Bold'
        )

        # Header
        story.append(Paragraph("<b>🏥 Smart EHR & Lab Portal</b>", title_style))
        story.append(Paragraph("EHR & Laboratory Portal | Digital Prescription System", subtitle_style))
        story.append(Spacer(1, 10))

        # Prescription Info Table
        info_data = [
            [Paragraph("<b>Prescription ID:</b>", body_style), Paragraph(rx.prescription_id, body_style),
             Paragraph("<b>Date:</b>", body_style), Paragraph(str(rx.date), body_style)],
            [Paragraph("<b>Patient ID:</b>", body_style), Paragraph(rx.patient_id, body_style),
             Paragraph("<b>Prescribing Doctor:</b>", body_style), Paragraph(rx.doctor_name, body_style)],
            [Paragraph("<b>Diagnosis:</b>", body_style), Paragraph(rx.diagnosis, body_style), "", ""]
        ]
        info_table = Table(info_data, colWidths=[100, 160, 100, 160])
        info_table.setStyle(TableStyle([
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('SPAN', (1,2), (3,2)),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ]))
        story.append(info_table)
        story.append(Spacer(1, 20))
        story.append(Paragraph("Prescribed Medications", section_style))

        # Medicines Table
        meds_data = [[
            Paragraph("Medicine Name", header_cell_style),
            Paragraph("Dosage", header_cell_style),
            Paragraph("Duration", header_cell_style),
            Paragraph("Instructions", header_cell_style)
        ]]

        for med in rx.medicines.all():
            meds_data.append([
                Paragraph(med.name, body_style),
                Paragraph(med.dosage, body_style),
                Paragraph(med.duration, body_style),
                Paragraph(med.instructions or 'Take as directed', body_style)
            ])

        meds_table = Table(meds_data, colWidths=[140, 100, 80, 200])
        meds_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e3a8a')),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ]))
        story.append(meds_table)
        story.append(Spacer(1, 40))

        # Signatures
        sig_data = [
            [Paragraph("_____________________________<br/>Prescribing Doctor Signature", body_style),
             Paragraph("_____________________________<br/>Patient Signature", body_style)]
        ]
        sig_table = Table(sig_data, colWidths=[270, 270])
        sig_table.setStyle(TableStyle([
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ]))
        story.append(sig_table)

        doc.build(story)
        pdf = buffer.getvalue()
        buffer.close()
        
        response = HttpResponse(pdf, content_type='application/pdf')
        response['Content-Disposition'] = f'inline; filename="prescription_{prescription_id}.pdf"'
        return response

class ConsultationPdfView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, consultation_id):
        try:
            consult = Consultation.objects.get(consultation_id=consultation_id)
        except Consultation.DoesNotExist:
            return HttpResponse("Consultation log not found", status=404)

        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
        story = []

        styles = getSampleStyleSheet()
        title_style = ParagraphStyle('TStyle', parent=styles['Heading1'], fontSize=18, textColor=colors.HexColor('#0f172a'))
        subtitle_style = ParagraphStyle('SubStyle', parent=styles['Normal'], fontSize=10, textColor=colors.HexColor('#64748b'), spaceAfter=15)
        section_style = ParagraphStyle('SectStyle', parent=styles['Heading2'], fontSize=13, textColor=colors.HexColor('#0d9488'), spaceBefore=10, spaceAfter=8)
        body_style = ParagraphStyle('BStyle', parent=styles['Normal'], fontSize=10, leading=14)

        story.append(Paragraph("<b>🏥 Smart EHR & Lab Portal</b>", title_style))
        story.append(Paragraph("EHR System | Clinician Consultation Record", subtitle_style))
        story.append(Spacer(1, 10))

        info_data = [
            [Paragraph("<b>Consultation ID:</b>", body_style), Paragraph(consult.consultation_id, body_style),
             Paragraph("<b>Date:</b>", body_style), Paragraph(str(consult.consultation_date), body_style)],
            [Paragraph("<b>Patient ID:</b>", body_style), Paragraph(consult.patient_id, body_style),
             Paragraph("<b>Clinician Name:</b>", body_style), Paragraph(consult.doctor_name, body_style)]
        ]
        info_table = Table(info_data, colWidths=[100, 160, 100, 160])
        info_table.setStyle(TableStyle([
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ]))
        story.append(info_table)
        story.append(Spacer(1, 15))

        story.append(Paragraph("Patient Symptoms", section_style))
        story.append(Paragraph(consult.symptoms, body_style))
        story.append(Spacer(1, 10))

        story.append(Paragraph("Clinical Diagnosis & Findings", section_style))
        story.append(Paragraph(consult.diagnosis, body_style))
        story.append(Spacer(1, 10))

        story.append(Paragraph("Recommendations & Treatment Plan", section_style))
        story.append(Paragraph(consult.recommendations, body_style))
        story.append(Spacer(1, 30))

        sig_data = [
            [Paragraph("_____________________________<br/>Clinician Signature", body_style), ""]
        ]
        sig_table = Table(sig_data, colWidths=[270, 270])
        story.append(sig_table)

        doc.build(story)
        pdf = buffer.getvalue()
        buffer.close()

        response = HttpResponse(pdf, content_type='application/pdf')
        response['Content-Disposition'] = f'inline; filename="consultation_{consultation_id}.pdf"'
        return response

class LabReportPdfView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, lab_id):
        try:
            lab = LabRequest.objects.get(lab_id=lab_id)
        except LabRequest.DoesNotExist:
            return HttpResponse("Lab report not found", status=404)

        if lab.raw_report_file:
            try:
                response = HttpResponse(lab.raw_report_file.read(), content_type='application/pdf')
                response['Content-Disposition'] = f'inline; filename="{lab.raw_report_file.name.split("/")[-1]}"'
                return response
            except Exception:
                pass

        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
        story = []

        styles = getSampleStyleSheet()
        title_style = ParagraphStyle('TStyle', parent=styles['Heading1'], fontSize=18, textColor=colors.HexColor('#0f172a'))
        subtitle_style = ParagraphStyle('SubStyle', parent=styles['Normal'], fontSize=10, textColor=colors.HexColor('#64748b'), spaceAfter=15)
        section_style = ParagraphStyle('SectStyle', parent=styles['Heading2'], fontSize=13, textColor=colors.HexColor('#eab308'), spaceBefore=10, spaceAfter=8)
        body_style = ParagraphStyle('BStyle', parent=styles['Normal'], fontSize=10, leading=14)
        header_cell_style = ParagraphStyle('HCell', parent=styles['Normal'], fontSize=10, textColor=colors.white, fontName='Helvetica-Bold')

        story.append(Paragraph("<b>🏥 Smart EHR LaboraX Diagnostic Desk</b>", title_style))
        story.append(Paragraph("Clinical Laboratory Findings Report", subtitle_style))
        story.append(Spacer(1, 10))

        info_data = [
            [Paragraph("<b>Request ID:</b>", body_style), Paragraph(lab.lab_id, body_style),
             Paragraph("<b>Category:</b>", body_style), Paragraph(lab.test_category, body_style)],
            [Paragraph("<b>Patient Name:</b>", body_style), Paragraph(lab.patient_name, body_style),
             Paragraph("<b>Test Name:</b>", body_style), Paragraph(lab.test_name, body_style)],
            [Paragraph("<b>Requested By:</b>", body_style), Paragraph(lab.doctor_name, body_style),
             Paragraph("<b>Result Date:</b>", body_style), Paragraph(str(lab.result_date or 'N/A'), body_style)],
            [Paragraph("<b>Technician:</b>", body_style), Paragraph(lab.technician or 'N/A', body_style),
             Paragraph("<b>Status:</b>", body_style), Paragraph(lab.status.upper(), body_style)]
        ]
        info_table = Table(info_data, colWidths=[100, 160, 100, 160])
        info_table.setStyle(TableStyle([
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ]))
        story.append(info_table)
        story.append(Spacer(1, 15))

        story.append(Paragraph("Test Parameter Results", section_style))

        results_data = [[
            Paragraph("Parameter", header_cell_style),
            Paragraph("Observed Value", header_cell_style),
            Paragraph("Unit", header_cell_style),
            Paragraph("Reference Range", header_cell_style),
            Paragraph("Flag", header_cell_style)
        ]]

        for param in lab.parameters.all():
            flag_style = body_style
            if param.flag in ['High', 'Low']:
                flag_style = ParagraphStyle('Flag', parent=body_style, textColor=colors.red, fontName='Helvetica-Bold')
            results_data.append([
                Paragraph(param.parameter, body_style),
                Paragraph(str(param.value), body_style),
                Paragraph(param.unit, body_style),
                Paragraph(param.ref_range, body_style),
                Paragraph(param.flag, flag_style)
            ])

        results_table = Table(results_data, colWidths=[160, 100, 70, 110, 80])
        results_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#eab308')),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ]))
        story.append(results_table)
        story.append(Spacer(1, 40))

        sig_data = [
            [Paragraph("_____________________________<br/>Lab Technician Signature", body_style),
             Paragraph("_____________________________<br/>Authorized Pathologist Signature", body_style)]
        ]
        sig_table = Table(sig_data, colWidths=[270, 270])
        sig_table.setStyle(TableStyle([
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ]))
        story.append(sig_table)

        doc.build(story)
        pdf = buffer.getvalue()
        buffer.close()

        response = HttpResponse(pdf, content_type='application/pdf')
        response['Content-Disposition'] = f'inline; filename="lab_report_{lab_id}.pdf"'
        return response

class ReceiptPdfView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, billing_id):
        try:
            bill = PatientBilling.objects.get(billing_id=billing_id)
        except PatientBilling.DoesNotExist:
            return HttpResponse("Billing record not found", status=404)

        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
        story = []

        styles = getSampleStyleSheet()
        
        # Styles
        title_style = ParagraphStyle(
            'ReceiptTitleStyle',
            parent=styles['Heading1'],
            fontSize=20,
            leading=24,
            textColor=colors.HexColor('#0f172a'),
            spaceAfter=15
        )
        subtitle_style = ParagraphStyle(
            'ReceiptSubtitleStyle',
            parent=styles['Normal'],
            fontSize=10,
            leading=14,
            textColor=colors.HexColor('#64748b'),
            spaceAfter=20
        )
        section_style = ParagraphStyle(
            'ReceiptSectionStyle',
            parent=styles['Heading2'],
            fontSize=13,
            leading=16,
            textColor=colors.HexColor('#0284c7'),
            spaceBefore=15,
            spaceAfter=10
        )
        body_style = ParagraphStyle(
            'ReceiptBodyStyle',
            parent=styles['Normal'],
            fontSize=10,
            leading=14,
            textColor=colors.HexColor('#334155')
        )
        header_cell_style = ParagraphStyle(
            'ReceiptHeaderCell',
            parent=styles['Normal'],
            fontSize=10,
            leading=12,
            textColor=colors.white,
            fontName='Helvetica-Bold'
        )

        # Header
        story.append(Paragraph("<b>🏥 Smart EHR & Lab Portal Invoice/Receipt</b>", title_style))
        story.append(Paragraph("CurePoint Clinical Network | Payment Operations", subtitle_style))
        story.append(Spacer(1, 10))

        # Status badge color
        status_color = '#10b981' if bill.status == 'paid' else '#ef4444'
        if bill.status == 'refunded':
            status_color = '#f97316'

        # Invoice Info Table
        info_data = [
            [Paragraph("<b>Billing ID:</b>", body_style), Paragraph(bill.billing_id, body_style),
             Paragraph("<b>Payment Status:</b>", body_style), Paragraph(f"<font color='{status_color}'><b>{bill.status.upper()}</b></font>", body_style)],
            [Paragraph("<b>Patient Name:</b>", body_style), Paragraph(bill.patient.user.name, body_style),
             Paragraph("<b>Payment Method:</b>", body_style), Paragraph(bill.method or 'N/A', body_style)],
            [Paragraph("<b>Receipt Reference:</b>", body_style), Paragraph(bill.receipt_id or 'N/A', body_style),
             Paragraph("<b>Transaction Date:</b>", body_style), Paragraph(str(bill.paid_on.date()) if bill.paid_on else 'N/A', body_style)],
            [Paragraph("<b>Description:</b>", body_style), Paragraph(bill.description, body_style), "", ""]
        ]
        info_table = Table(info_data, colWidths=[100, 160, 110, 150])
        info_table.setStyle(TableStyle([
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ('SPAN', (1,3), (3,3)),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ]))
        story.append(info_table)
        story.append(Spacer(1, 20))
        story.append(Paragraph("Charges breakdown", section_style))

        # Items Table
        items_data = [[
            Paragraph("Charge Type", header_cell_style),
            Paragraph("Item Description", header_cell_style),
            Paragraph("Amount ($)", header_cell_style)
        ]]

        if bill.consultation_charge > 0:
            items_data.append([
                Paragraph("OPD Consultation", body_style),
                Paragraph("Professional Consultation Fee", body_style),
                Paragraph(f"{bill.consultation_charge:.2f}", body_style)
            ])
        if bill.laboratory_charge > 0:
            items_data.append([
                Paragraph("Laboratory Service", body_style),
                Paragraph("Clinical Lab Tests / Specimen Analysis", body_style),
                Paragraph(f"{bill.laboratory_charge:.2f}", body_style)
            ])
            
        other_charge = float(bill.amount) - float(bill.consultation_charge) - float(bill.laboratory_charge)
        if other_charge > 0.01:
            items_data.append([
                Paragraph("Other Services", body_style),
                Paragraph("Administrative / Pharmacy / Utilities Fee", body_style),
                Paragraph(f"{other_charge:.2f}", body_style)
            ])

        # Total Row
        items_data.append([
            Paragraph("<b>Total Due / Paid</b>", body_style),
            Paragraph("", body_style),
            Paragraph(f"<b>${bill.amount:.2f}</b>", body_style)
        ])

        items_table = Table(items_data, colWidths=[150, 240, 110])
        items_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0284c7')),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('GRID', (0, 0), (-1, -2), 0.5, colors.HexColor('#cbd5e1')),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('LINEABOVE', (0, -1), (-1, -1), 1.5, colors.HexColor('#0284c7')),
        ]))
        story.append(items_table)
        story.append(Spacer(1, 40))

        # Signatures
        sig_data = [
            [Paragraph("_____________________________<br/>Billing Coordinator Signature", body_style),
             Paragraph("_____________________________<br/>Patient Signature", body_style)]
        ]
        sig_table = Table(sig_data, colWidths=[270, 270])
        sig_table.setStyle(TableStyle([
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ]))
        story.append(sig_table)

        doc.build(story)
        pdf = buffer.getvalue()
        buffer.close()

        response = HttpResponse(pdf, content_type='application/pdf')
        response['Content-Disposition'] = f'inline; filename="receipt_{billing_id}.pdf"'
        return response

