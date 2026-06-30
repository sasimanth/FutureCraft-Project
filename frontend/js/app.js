/**
 * EHR & Laboratory Management Portal - Core JavaScript File
 * Developed by Antigravity AI (FutureCraft Project)
 * Contains Mock Database, Asynchronous ApiService (Django REST Mapped), Form Validators,
 * Chart Initializers, Role Guards, and Interactive Dashboard Controllers.
 */

// ==========================================
// Toast Notifications System Helper
// ==========================================
window.Toast = {
    show: function(msg, type = 'info') {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }
        const toast = document.createElement('div');
        toast.className = `toast-notification ${type}`;
        
        let icon = 'fa-info-circle';
        if (type === 'success') icon = 'fa-check-circle';
        else if (type === 'warning') icon = 'fa-exclamation-triangle';
        else if (type === 'danger') icon = 'fa-times-circle';
        
        toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${msg}</span>`;
        container.appendChild(toast);
        
        // Trigger show slide animation
        setTimeout(() => toast.classList.add('show'), 50);
        
        // Remove toast after 4 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    },
    success: function(msg) { this.show(msg, 'success'); },
    warning: function(msg) { this.show(msg, 'warning'); },
    error: function(msg) { this.show(msg, 'danger'); },
    info: function(msg) { this.show(msg, 'info'); }
};

// Overwrite native browser Alert to redirect calls to our Premium Toast System
window.alert = function(msg) {
    if (typeof msg !== 'string') msg = String(msg);
    if (msg && msg.toLowerCase().includes('success')) {
        window.Toast.success(msg);
    } else if (msg && (msg.toLowerCase().includes('error') || msg.toLowerCase().includes('failed') || msg.toLowerCase().includes('invalid'))) {
        window.Toast.error(msg);
    } else {
        window.Toast.info(msg);
    }
};

// ==========================================
// 1. MOCK DATABASE INITIALIZATION & SEEDS
// ==========================================

const DEFAULT_DEPARTMENTS = [
    { id: 'dept-1', name: 'General Medicine', head: 'Dr. Sarah Connor', staffCount: 12 },
    { id: 'dept-2', name: 'Cardiology', head: 'Dr. Robert Chen', staffCount: 8 },
    { id: 'dept-3', name: 'Neurology', head: 'Dr. Alice Vance', staffCount: 6 },
    { id: 'dept-4', name: 'Pediatrics', head: 'Dr. Emily Watson', staffCount: 10 },
    { id: 'dept-5', name: 'Radiology', head: 'Dr. Marcus Aurelius', staffCount: 9 },
    { id: 'dept-6', name: 'Pathology & Lab', head: 'Dr. Gregory House', staffCount: 14 }
];

const DEFAULT_DOCTORS = [
    { id: 'doc-1', name: 'Dr. Sarah Connor', deptId: 'dept-1', specialization: 'Family Physician', email: 'sarah.connor@ehrmail.com' },
    { id: 'doc-2', name: 'Dr. Robert Chen', deptId: 'dept-2', specialization: 'Interventional Cardiologist', email: 'robert.chen@ehrmail.com' },
    { id: 'doc-3', name: 'Dr. Alice Vance', deptId: 'dept-3', specialization: 'Neurologist', email: 'alice.vance@ehrmail.com' },
    { id: 'doc-4', name: 'Dr. Emily Watson', deptId: 'dept-4', specialization: 'Pediatric Specialist', email: 'emily.watson@ehrmail.com' }
];

const DEFAULT_PATIENTS = [
    {
        id: 'pat-1',
        name: 'John Doe',
        email: 'john.doe@ehrmail.com',
        dob: '1988-05-14',
        gender: 'Male',
        bloodGroup: 'O+',
        phone: '+1 (555) 019-2834',
        emergencyName: 'Jane Doe',
        emergencyPhone: '+1 (555) 019-2835',
        allergies: 'Penicillin, Shellfish',
        vitalsHistory: [
            { date: '2026-05-01', bpSystolic: 120, bpDiastolic: 80, heartRate: 72, temp: 98.6, weight: 78 },
            { date: '2026-05-15', bpSystolic: 124, bpDiastolic: 82, heartRate: 75, temp: 98.4, weight: 77 },
            { date: '2026-06-01', bpSystolic: 118, bpDiastolic: 79, heartRate: 70, temp: 98.6, weight: 76.5 },
            { date: '2026-06-15', bpSystolic: 121, bpDiastolic: 80, heartRate: 73, temp: 98.8, weight: 77.2 }
        ],
        medicalHistory: [
            { date: '2025-11-10', condition: 'Mild Hypertension', diagnosedBy: 'Dr. Sarah Connor', status: 'Managed' },
            { date: '2026-02-14', condition: 'Seasonal Influenza', diagnosedBy: 'Dr. Sarah Connor', status: 'Recovered' }
        ]
    },
    {
        id: 'pat-2',
        name: 'Emma Watson',
        email: 'emma.watson@ehrmail.com',
        dob: '1995-10-22',
        gender: 'Female',
        bloodGroup: 'A-',
        phone: '+1 (555) 014-9988',
        emergencyName: 'Arthur Watson',
        emergencyPhone: '+1 (555) 014-9980',
        allergies: 'Peanuts',
        vitalsHistory: [
            { date: '2026-06-10', bpSystolic: 110, bpDiastolic: 70, heartRate: 68, temp: 98.2, weight: 58 }
        ],
        medicalHistory: [
            { date: '2026-03-05', condition: 'Vitamin D Deficiency', diagnosedBy: 'Dr. Emily Watson', status: 'Active' }
        ]
    },
    {
        id: 'pat-3',
        name: 'Robert Downey',
        email: 'robert.downey@ehrmail.com',
        dob: '1975-04-04',
        gender: 'Male',
        bloodGroup: 'A+',
        phone: '+1 (555) 018-7722',
        emergencyName: 'Susan Downey',
        emergencyPhone: '+1 (555) 018-7723',
        allergies: 'None',
        vitalsHistory: [
            { date: '2026-05-10', bpSystolic: 130, bpDiastolic: 85, heartRate: 76, temp: 98.4, weight: 82 },
            { date: '2026-05-24', bpSystolic: 128, bpDiastolic: 84, heartRate: 74, temp: 98.6, weight: 81.5 },
            { date: '2026-06-07', bpSystolic: 125, bpDiastolic: 82, heartRate: 72, temp: 98.5, weight: 81.2 },
            { date: '2026-06-21', bpSystolic: 122, bpDiastolic: 80, heartRate: 70, temp: 98.6, weight: 80.8 }
        ],
        medicalHistory: [
            { date: '2026-05-10', condition: 'Type 2 Diabetes', diagnosedBy: 'Dr. Robert Chen', status: 'Active' }
        ]
    },
    {
        id: 'pat-4',
        name: 'Clara Oswald',
        email: 'clara.oswald@ehrmail.com',
        dob: '1992-11-23',
        gender: 'Female',
        bloodGroup: 'AB-',
        phone: '+1 (555) 016-1234',
        emergencyName: 'Danny Pink',
        emergencyPhone: '+1 (555) 016-1235',
        allergies: 'Pollen',
        vitalsHistory: [
            { date: '2026-05-12', bpSystolic: 112, bpDiastolic: 72, heartRate: 65, temp: 98.7, weight: 54 },
            { date: '2026-05-26', bpSystolic: 115, bpDiastolic: 75, heartRate: 68, temp: 98.8, weight: 54.2 },
            { date: '2026-06-09', bpSystolic: 118, bpDiastolic: 76, heartRate: 70, temp: 98.6, weight: 54.5 },
            { date: '2026-06-23', bpSystolic: 114, bpDiastolic: 74, heartRate: 67, temp: 98.6, weight: 54.1 }
        ],
        medicalHistory: [
            { date: '2026-05-12', condition: 'Chronic Migraine', diagnosedBy: 'Dr. Alice Vance', status: 'Managed' }
        ]
    },
    {
        id: 'pat-5',
        name: 'Bruce Banner',
        email: 'bruce.banner@ehrmail.com',
        dob: '1979-12-18',
        gender: 'Male',
        bloodGroup: 'O-',
        phone: '+1 (555) 011-9900',
        emergencyName: 'Betty Ross',
        emergencyPhone: '+1 (555) 011-9901',
        allergies: 'None',
        vitalsHistory: [
            { date: '2026-05-05', bpSystolic: 145, bpDiastolic: 95, heartRate: 98, temp: 99.1, weight: 85 },
            { date: '2026-05-19', bpSystolic: 140, bpDiastolic: 90, heartRate: 92, temp: 98.9, weight: 84.5 },
            { date: '2026-06-02', bpSystolic: 135, bpDiastolic: 88, heartRate: 85, temp: 98.7, weight: 84.2 },
            { date: '2026-06-16', bpSystolic: 130, bpDiastolic: 84, heartRate: 80, temp: 98.6, weight: 83.8 }
        ],
        medicalHistory: [
            { date: '2026-05-05', condition: 'Elevated Heart Rate', diagnosedBy: 'Dr. Sarah Connor', status: 'Active' }
        ]
    }
];

const DEFAULT_USERS = [
    { email: 'admin@ehrmail.com', password: 'password123', name: 'Administrator', role: 'admin', dateJoined: '2026-01-10T10:00:00Z', emailVerified: true, phoneVerified: true, status: 'Active' },
    { email: 'sarah.connor@ehrmail.com', password: 'password123', name: 'Dr. Sarah Connor', role: 'doctor', doctorId: 'doc-1', dateJoined: '2026-02-15T09:00:00Z', emailVerified: true, phoneVerified: true, status: 'Active', department: 'General Medicine' },
    { email: 'robert.chen@ehrmail.com', password: 'password123', name: 'Dr. Robert Chen', role: 'doctor', doctorId: 'doc-2', dateJoined: '2026-02-20T11:00:00Z', emailVerified: true, phoneVerified: true, status: 'Active', department: 'Cardiology' },
    { email: 'labtech@ehrmail.com', password: 'password123', name: 'Alex Mercer', role: 'labtech', dateJoined: '2026-03-01T08:30:00Z', emailVerified: true, phoneVerified: true, status: 'Active' },
    { email: 'john.doe@ehrmail.com', password: 'password123', name: 'John Doe', role: 'patient', patientId: 'pat-1', dateJoined: '2026-04-10T14:22:00Z', emailVerified: true, phoneVerified: false, status: 'Active' },
    { email: 'emma.watson@ehrmail.com', password: 'password123', name: 'Emma Watson', role: 'patient', patientId: 'pat-2', dateJoined: '2026-04-12T15:30:00Z', emailVerified: false, phoneVerified: false, status: 'Active' },
    { email: 'robert.downey@ehrmail.com', password: 'password123', name: 'Robert Downey', role: 'patient', patientId: 'pat-3', dateJoined: '2026-04-15T16:45:00Z', emailVerified: true, phoneVerified: true, status: 'Active' },
    { email: 'clara.oswald@ehrmail.com', password: 'password123', name: 'Clara Oswald', role: 'patient', patientId: 'pat-4', dateJoined: '2026-04-20T10:15:00Z', emailVerified: false, phoneVerified: true, status: 'Active' },
    { email: 'bruce.banner@ehrmail.com', password: 'password123', name: 'Bruce Banner', role: 'patient', patientId: 'pat-5', dateJoined: '2026-04-25T11:30:00Z', emailVerified: true, phoneVerified: true, status: 'Active' }
];

const DEFAULT_APPOINTMENTS = [
    { id: 'appt-1', patientId: 'pat-1', doctorId: 'doc-1', doctorName: 'Dr. Sarah Connor', deptName: 'General Medicine', date: '2026-06-20', timeSlot: '09:30 AM', symptoms: 'Follow-up on blood pressure regulation.', status: 'completed', type: 'Doctor Checkup' },
    { id: 'appt-2', patientId: 'pat-2', doctorId: 'doc-4', doctorName: 'Dr. Emily Watson', deptName: 'Pediatrics', date: '2026-06-22', timeSlot: '11:00 AM', symptoms: 'Routine health checkup and vitamin consultation.', status: 'completed', type: 'Doctor Checkup' },
    { id: 'appt-3', patientId: 'pat-1', doctorId: 'doc-1', doctorName: 'Dr. Sarah Connor', deptName: 'General Medicine', date: '2026-06-25', timeSlot: '10:30 AM', symptoms: 'BP check and medication renewal.', status: 'confirmed', type: 'Doctor Checkup' },
    { id: 'appt-4', patientId: 'pat-3', doctorId: 'doc-2', doctorName: 'Dr. Robert Chen', deptName: 'Cardiology', date: '2026-06-25', timeSlot: '09:00 AM', symptoms: 'Diabetes follow-up and ECG screening.', status: 'confirmed', type: 'Doctor Checkup' },
    { id: 'appt-5', patientId: 'pat-4', doctorId: 'doc-3', doctorName: 'Dr. Alice Vance', deptName: 'Neurology', date: '2026-06-25', timeSlot: '11:30 AM', symptoms: 'Migraine tracking and reflex check.', status: 'confirmed', type: 'Doctor Checkup' },
    { id: 'appt-6', patientId: 'pat-5', doctorId: 'doc-1', doctorName: 'Dr. Sarah Connor', deptName: 'General Medicine', date: '2026-06-25', timeSlot: '02:00 PM', symptoms: 'Anxiety and heart rate monitoring.', status: 'confirmed', type: 'Doctor Checkup' },
    { id: 'appt-7', patientId: 'pat-2', doctorId: 'doc-1', doctorName: 'Dr. Sarah Connor', deptName: 'General Medicine', date: '2026-06-25', timeSlot: '03:30 PM', symptoms: 'Mild cough and cold symptoms.', status: 'confirmed', type: 'Doctor Checkup' },
    { id: 'appt-8', patientId: 'pat-3', doctorId: 'doc-2', doctorName: 'Dr. Robert Chen', deptName: 'Cardiology', date: '2026-06-26', timeSlot: '10:00 AM', symptoms: 'Routine cardiology consult.', status: 'confirmed', type: 'Doctor Checkup' },
    { id: 'appt-9', patientId: 'pat-4', doctorId: 'doc-3', doctorName: 'Dr. Alice Vance', deptName: 'Neurology', date: '2026-06-26', timeSlot: '01:30 PM', symptoms: 'Follow-up consultation.', status: 'confirmed', type: 'Doctor Checkup' }
];

const DEFAULT_PRESCRIPTIONS = [
    {
        id: 'rx-1',
        patientId: 'pat-1',
        doctorName: 'Dr. Sarah Connor',
        date: '2026-05-15',
        diagnosis: 'Mild Hypertension',
        medicines: [
            { name: 'Lisinopril 10mg', dosage: '1 tablet daily', duration: '30 days', instructions: 'Take in the morning with water' },
            { name: 'Amlodipine 5mg', dosage: '1 tablet daily', duration: '30 days', instructions: 'Take at night if BP is elevated' }
        ]
    },
    {
        id: 'rx-2',
        patientId: 'pat-3',
        doctorName: 'Dr. Robert Chen',
        date: '2026-05-10',
        diagnosis: 'Type 2 Diabetes',
        medicines: [
            { name: 'Metformin 500mg', dosage: '1 tablet twice daily', duration: '60 days', instructions: 'Take with meals' }
        ]
    },
    {
        id: 'rx-3',
        patientId: 'pat-4',
        doctorName: 'Dr. Alice Vance',
        date: '2026-05-12',
        diagnosis: 'Chronic Migraine',
        medicines: [
            { name: 'Sumatriptan 50mg', dosage: '1 tablet as needed', duration: '30 days', instructions: 'Take at onset of migraine aura' }
        ]
    },
    {
        id: 'rx-4',
        patientId: 'pat-5',
        doctorName: 'Dr. Sarah Connor',
        date: '2026-05-05',
        diagnosis: 'Elevated Heart Rate',
        medicines: [
            { name: 'Propranolol 20mg', dosage: '1 tablet daily', duration: '30 days', instructions: 'Take in the morning' }
        ]
    }
];

const DEFAULT_LAB_REQUESTS = [
    {
        id: 'lab-1',
        patientId: 'pat-1',
        patientName: 'John Doe',
        doctorName: 'Dr. Sarah Connor',
        testCategory: 'Blood Test',
        testName: 'Complete Blood Count (CBC)',
        requestDate: '2026-06-15',
        status: 'completed',
        resultDate: '2026-06-16',
        technician: 'Alex Mercer',
        priority: 'High',
        results: [
            { parameter: 'White Blood Cell (WBC)', value: 6.8, unit: '10^3/uL', refRange: '4.5 - 11.0', flag: 'Normal' },
            { parameter: 'Red Blood Cell (RBC)', value: 4.9, unit: '10^6/uL', refRange: '4.3 - 5.9', flag: 'Normal' },
            { parameter: 'Hemoglobin (Hgb)', value: 14.8, unit: 'g/dL', refRange: '13.5 - 17.5', flag: 'Normal' },
            { parameter: 'Platelets', value: 245, unit: '10^3/uL', refRange: '150 - 450', flag: 'Normal' }
        ]
    },
    {
        id: 'lab-2',
        patientId: 'pat-1',
        patientName: 'John Doe',
        doctorName: 'Dr. Sarah Connor',
        testCategory: 'Lipid Panel',
        testName: 'Cholesterol Profile',
        requestDate: '2026-06-18',
        status: 'pending',
        resultDate: '',
        technician: '',
        priority: 'Medium',
        results: []
    },
    {
        id: 'lab-3',
        patientId: 'pat-3',
        patientName: 'Robert Downey',
        doctorName: 'Dr. Robert Chen',
        testCategory: 'Metabolic Panel',
        testName: 'HbA1c Glucose Test',
        requestDate: '2026-06-20',
        status: 'completed',
        resultDate: '2026-06-21',
        technician: 'Alex Mercer',
        priority: 'High',
        results: [
            { parameter: 'HbA1c', value: 6.4, unit: '%', refRange: '4.0 - 5.6', flag: 'High' },
            { parameter: 'Fasting Plasma Glucose', value: 126, unit: 'mg/dL', refRange: '70 - 99', flag: 'High' }
        ]
    },
    {
        id: 'lab-4',
        patientId: 'pat-5',
        patientName: 'Bruce Banner',
        doctorName: 'Dr. Sarah Connor',
        testCategory: 'Thyroid Panel',
        testName: 'TSH & Free T4 Test',
        requestDate: '2026-06-22',
        status: 'pending',
        resultDate: '',
        technician: '',
        priority: 'High',
        results: []
    },
    {
        id: 'lab-5',
        patientId: 'pat-4',
        patientName: 'Clara Oswald',
        doctorName: 'Dr. Alice Vance',
        testCategory: 'Urine Analysis',
        testName: 'Urinalysis Screen',
        requestDate: '2026-06-23',
        status: 'pending',
        resultDate: '',
        technician: '',
        priority: 'Low',
        results: []
    }
];

const DEFAULT_VISITS = [
    { id: 'v-1', patientId: 'pat-1', date: '2026-05-01', department: 'General Medicine', doctorName: 'Dr. Sarah Connor', reason: 'Initial consult for blood pressure tracking.' },
    { id: 'v-2', patientId: 'pat-1', date: '2026-05-15', department: 'General Medicine', doctorName: 'Dr. Sarah Connor', reason: 'Follow-up visit and prescription adjustment.' },
    { id: 'v-3', patientId: 'pat-2', date: '2026-06-10', department: 'Pediatrics', doctorName: 'Dr. Emily Watson', reason: 'Routine health assessment & vitamin checkup.' },
    { id: 'v-4', patientId: 'pat-3', date: '2026-05-10', department: 'Cardiology', doctorName: 'Dr. Robert Chen', reason: 'Diabetes management review and ECG check.' },
    { id: 'v-5', patientId: 'pat-4', date: '2026-05-12', department: 'Neurology', doctorName: 'Dr. Alice Vance', reason: 'Consultation regarding frequent cluster migraines.' },
    { id: 'v-6', patientId: 'pat-5', date: '2026-05-05', department: 'General Medicine', doctorName: 'Dr. Sarah Connor', reason: 'Initial checkup for chronic heart rate spikes.' }
];

const DEFAULT_FILES = [
    { id: 'f-1', patientId: 'pat-1', name: 'Lab_CBC_May_Report.pdf', size: '1.4 MB', type: 'application/pdf', date: '2026-05-16', file: 'data:application/pdf;base64,JVBERi0xLjQKJdPr6goxIDAgb2JqCjw8L1R5cGUvQ2F0YWxvZy9QYWdlcyAyIDAgUj4+CmVuZG9iagoyIDAgb2JqCjw8L1R5cGUvUGFnZXMvS2lkc1szIDAgUl0vQ291bnQgMT4+CmVuZG9iagozIDAgb2JqCjw8L1R5cGUvUGFnZS9QYXJlbnQgMiAwIFIvTWVkaWFCb3hbMCAwIDU5NSA4NDJdL1Jlc291cmNlczw8L0ZvbnQ8PC9GMSA0IDAgUj4+Pj4vQ29udGVudHMgNSAwIFI+PgplbmRvYmoKNCAwIG9iago8PCAvVHlwZSAvRm9udCAvU3VidHlwZSAvVHlwZTEgL0Jhc2VGb250IC9IZWx2ZXRpY2EgPj4KZW5kb2JqCjUgMCBvYmoKPDwvTGVuZ3RoIDcwPj4Kc3RyZWFtCkJUCi9GMSAyNCBUZgoxMDAgNzAwIFRkCihDdXJlUG9pbnQgLSBTYW1wbGUgUmVwb3J0KSBUagpETQpCVAovRjEgMTIgVGYKMTAwIDY1MCBUZAooVGhpcyBpcyBhIG1vY2sgcGRmIHJlcG9ydCBkb2N1bWVudC4pIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDE1IDAwMDAwIG4gCjAwMDAwMDAwNjAgMDAwMDAgbiAKMDAwMDAwMDEwOSAwMDAwMCBuIAowMDAwMDAwMTk4IDAwMDAwIG4gCjAwMDAwMDAyNjcgMDAwMDAgbiAKdHJhaWxlcgo8PC9TaXplIDYvUm9vdCAxIDAgUj4+CnN0YXJ0eHJlZgozODgKJSVFT0Y=' },
    { id: 'f-2', patientId: 'pat-3', name: 'HbA1c_Glucose_Report.pdf', size: '1.2 MB', type: 'application/pdf', date: '2026-06-21', file: 'data:application/pdf;base64,JVBERi0xLjQKJdPr6goxIDAgb2JqCjw8L1R5cGUvQ2F0YWxvZy9QYWdlcyAyIDAgUj4+CmVuZG9iagoyIDAgb2JqCjw8L1R5cGUvUGFnZXMvS2lkc1szIDAgUl0vQ291bnQgMT4+CmVuZG9iagozIDAgb2JqCjw8L1R5cGUvUGFnZS9QYXJlbnQgMiAwIFIvTWVkaWFCb3hbMCAwIDU5NSA4NDJdL1Jlc291cmNlczw8L0ZvbnQ8PC9GMSA0IDAgUj4+Pj4vQ29udGVudHMgNSAwIFI+PgplbmRvYmoKNCAwIG9iago8PCAvVHlwZSAvRm9udCAvU3VidHlwZSAvVHlwZTEgL0Jhc2VGb250IC9IZWx2ZXRpY2EgPj4KZW5kb2JqCjUgMCBvYmoKPDwvTGVuZ3RoIDcwPj4Kc3RyZWFtCkJUCi9GMSAyNCBUZgoxMDAgNzAwIFRkCihDdXJlUG9pbnQgLSBTYW1wbGUgUmVwb3J0KSBUagpETQpCVAovRjEgMTIgVGYKMTAwIDY1MCBUZAooVGhpcyBpcyBhIG1vY2sgcGRmIHJlcG9ydCBkb2N1bWVudC4pIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDE1IDAwMDAwIG4gCjAwMDAwMDAwNjAgMDAwMDAgbiAKMDAwMDAwMDEwOSAwMDAwMCBuIAowMDAwMDAwMTk4IDAwMDAwIG4gCjAwMDAwMDAyNjcgMDAwMDAgbiAKdHJhaWxlcgo8PC9TaXplIDYvUm9vdCAxIDAgUj4+CnN0YXJ0eHJlZgozODgKJSVFT0Y=' }
];

const DEFAULT_AUDITS = [
    { timestamp: '2026-06-25 11:22:12', module: 'patients', initiator: 'system', action: 'Patient profile record pat-3 demographics update.', flag: 'SECURE' },
    { timestamp: '2026-06-25 10:44:22', module: 'doctors', initiator: 'robert.chen@ehrmail.com', action: 'New digital prescription rx-2 issued.', flag: 'SECURE' },
    { timestamp: '2026-06-25 09:30:00', module: 'accounts', initiator: 'admin@ehrmail.com', action: 'Administrator console session started.', flag: 'SECURE' },
    { timestamp: '2026-06-24 16:15:34', module: 'laboratory', initiator: 'labtech@ehrmail.com', action: 'Authorized results compiled for complete blood count CBC.', flag: 'SECURE' },
    { timestamp: '2026-06-24 14:02:11', module: 'patients', initiator: 'system', action: 'Patient profile record pat-1 diagnostics history fetched.', flag: 'SECURE' },
    { timestamp: '2026-06-23 10:15:30', module: 'doctors', initiator: 'alice.vance@ehrmail.com', action: 'Patient pat-4 medical file updated.', flag: 'SECURE' }
];

// Seed databases in localStorage if empty
function initializeDatabase() {
    if (!localStorage.getItem('hc_seeded')) {
        localStorage.setItem('hc_users', JSON.stringify(DEFAULT_USERS));
        localStorage.setItem('hc_patients', JSON.stringify(DEFAULT_PATIENTS));
        localStorage.setItem('hc_doctors', JSON.stringify(DEFAULT_DOCTORS));
        localStorage.setItem('hc_departments', JSON.stringify(DEFAULT_DEPARTMENTS));
        localStorage.setItem('hc_appointments', JSON.stringify(DEFAULT_APPOINTMENTS));
        localStorage.setItem('hc_prescriptions', JSON.stringify(DEFAULT_PRESCRIPTIONS));
        localStorage.setItem('hc_lab_requests', JSON.stringify(DEFAULT_LAB_REQUESTS));
        localStorage.setItem('hc_visits', JSON.stringify(DEFAULT_VISITS));
        localStorage.setItem('hc_files', JSON.stringify(DEFAULT_FILES));
        localStorage.setItem('hc_audits', JSON.stringify(DEFAULT_AUDITS));
        localStorage.setItem('hc_seeded', 'true');
        console.log('EHR Laboratory Portal Database Seeded Successfully!');
    }
}

// Getters and setters helper
function getDB(key) {
    return JSON.parse(localStorage.getItem('hc_' + key)) || [];
}

function setDB(key, data) {
    localStorage.setItem('hc_' + key, JSON.stringify(data));
}

// Initialize on script load
initializeDatabase();


// ==========================================
// 2. CENTRALIZED API SERVICE LAYER (Django REST API Integration Ready)
// ==========================================

const ApiService = {
    baseUrl: 'http://127.0.0.1:8000/api', // Django local development server URL
    useMock: false, // Toggle this to FALSE to direct requests to actual Django backend

    // Helper wrapper for actual network HTTP fetch requests
    _request: async function (endpoint, options = {}) {
        if (this.useMock) {
            throw new Error("Mock database client is active. Set useMock to false in ApiService.");
        }
        const currentUser = JSON.parse(sessionStorage.getItem('hc_current_user'));
        const headers = {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        };
        if (currentUser && currentUser.token) {
            headers['Authorization'] = `Bearer ${currentUser.token}`;
        }
        const response = await fetch(`${this.baseUrl}${endpoint}`, { ...options, headers });
        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.message || response.statusText || 'API request failed.');
        }
        return response.json();
    },

    syncDataFromServer: async function () {
        if (this.useMock) return;
        try {
            const activeUser = JSON.parse(sessionStorage.getItem('hc_current_user'));
            if (!activeUser) return;
            
            const [patients, doctors, appointments, prescriptions, labRequests, audits, departments, leaves, reviews, invoices] = await Promise.all([
                this.getPatients().catch(() => []),
                this._request('/doctors/').catch(() => []),
                this.getAppointments().catch(() => []),
                this.getPrescriptions().catch(() => []),
                this.getLabTests().catch(() => []),
                this._request('/audits/').catch(() => []),
                this._request('/departments/').catch(() => []),
                this._request('/leaves/').catch(() => []),
                this._request('/reviews/').catch(() => []),
                this._request('/billing/').catch(() => [])
            ]);

            setDB('patients', patients);
            setDB('doctors', doctors);
            setDB('appointments', appointments);
            setDB('prescriptions', prescriptions);
            setDB('lab_requests', labRequests);
            setDB('audits', audits);
            setDB('departments', departments);
            setDB('leaves', leaves);
            setDB('doctor_reviews', reviews);
            setDB('patient_invoices', invoices);

            if (activeUser.role === 'patient' && activeUser.patientId) {
                const patId = activeUser.patientId;
                const visits = await this._request(`/patients/${patId}/visits/`).catch(() => []);
                const files = await this._request(`/patients/${patId}/files/`).catch(() => []);
                setDB('visits', visits);
                setDB('files', files);
            }

            if (activeUser.role === 'admin') {
                const users = await this._request('/users/').catch(() => []);
                setDB('users', users);
            }

            // Instantly refresh the UI dashboards with the fresh synced records
            if (typeof window.triggerDashboardSyncUpdate === 'function') {
                window.triggerDashboardSyncUpdate();
            }
        } catch (err) {
            console.error("Failed to sync database from Django server:", err);
        }
    },

    // --- Authentication APIs ---
    // POST /api/login/
    login: async function (email, password, role) {
        if (this.useMock) {
            await new Promise(r => setTimeout(r, 200));
            const users = getDB('users');
            const user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password && u.role === role);
            if (user) {
                sessionStorage.setItem('hc_current_user', JSON.stringify(user));
                this.addAuditLog('accounts', email, `Login successful with role: ${role}`);
                return { success: true, redirect: role + '-dashboard.html' };
            }
            throw new Error('Invalid credentials or selected role.');
        } else {
            const res = await this._request('/login/', {
                method: 'POST',
                body: JSON.stringify({ email, password, role })
            });
            sessionStorage.setItem('hc_current_user', JSON.stringify(res.user));
            await this.syncDataFromServer();
            return { success: true, redirect: role + '-dashboard.html' };
        }
    },

    // POST /api/register/
    register: async function (name, email, password, role, extraFields = {}) {
        if (this.useMock) {
            await new Promise(r => setTimeout(r, 200));
            const users = getDB('users');
            if (users.some(u => u.email === email)) {
                throw new Error('Email address already registered.');
            }

            const newUser = { name, email, password, role };
            if (role === 'patient') {
                const patients = getDB('patients');
                const newPatId = 'pat-' + (patients.length + 1);
                newUser.patientId = newPatId;

                const newPatient = {
                    id: newPatId,
                    name,
                    email,
                    dob: extraFields.dob || '',
                    gender: extraFields.gender || '',
                    bloodGroup: extraFields.bloodGroup || '',
                    phone: extraFields.phone || '',
                    emergencyName: extraFields.emergencyName || '',
                    emergencyPhone: extraFields.emergencyPhone || '',
                    allergies: extraFields.allergies || 'None',
                    vitalsHistory: [],
                    medicalHistory: []
                };
                patients.push(newPatient);
                setDB('patients', patients);

                // Add default registration visit
                const visits = getDB('visits');
                visits.push({
                    id: 'v-' + (visits.length + 1),
                    patientId: newPatId,
                    date: new Date().toISOString().split('T')[0],
                    department: 'General Medicine',
                    doctorName: 'System Registrar',
                    reason: 'Portal registration profile created.'
                });
                setDB('visits', visits);

            } else if (role === 'doctor') {
                const doctors = getDB('doctors');
                const newDocId = 'doc-' + (doctors.length + 1);
                newUser.doctorId = newDocId;

                const newDoctor = {
                    id: newDocId,
                    name: 'Dr. ' + name,
                    deptId: extraFields.deptId || 'dept-1',
                    specialization: extraFields.specialization || 'General Practice',
                    email
                };
                doctors.push(newDoctor);
                setDB('doctors', doctors);
            }

            users.push(newUser);
            setDB('users', users);
            this.addAuditLog('accounts', email, `Registered user account with role: ${role}`);
            return { success: true, message: 'Account registered successfully.' };
        } else {
            return this._request('/register/', {
                method: 'POST',
                body: JSON.stringify({ name, email, password, role, ...extraFields })
            });
        }
    },

    // --- Patient APIs ---
    // GET /api/patients/
    getPatients: async function () {
        return this.useMock ? getDB('patients') : this._request('/patients/');
    },

    // GET /api/patients/{id}/
    getPatient: async function (id) {
        if (this.useMock) {
            const patient = getDB('patients').find(p => p.id === id);
            if (!patient) throw new Error("Patient not found.");
            return patient;
        } else {
            return this._request(`/patients/${id}/`);
        }
    },

    // POST /api/patients/
    createPatient: async function (data) {
        if (this.useMock) {
            const patients = getDB('patients');
            patients.push(data);
            setDB('patients', patients);
            return data;
        } else {
            const res = await this._request('/patients/', { method: 'POST', body: JSON.stringify(data) });
            const patients = getDB('patients');
            patients.push(res);
            setDB('patients', patients);
            return res;
        }
    },

    // PUT /api/patients/{id}/
    updatePatient: async function (id, data) {
        if (this.useMock) {
            const patients = getDB('patients');
            const idx = patients.findIndex(p => p.id === id);
            if (idx === -1) throw new Error("Patient not found.");
            patients[idx] = { ...patients[idx], ...data };
            setDB('patients', patients);
            this.addAuditLog('patients', 'system', `Updated details for patient ID: ${id}`);
            return patients[idx];
        } else {
            const res = await this._request(`/patients/${id}/`, { method: 'PUT', body: JSON.stringify(data) });
            const patients = getDB('patients');
            const idx = patients.findIndex(p => p.id === id);
            if (idx !== -1) {
                patients[idx] = res;
                setDB('patients', patients);
            }
            return res;
        }
    },

    // DELETE /api/patients/{id}/
    deletePatient: async function (id) {
        if (this.useMock) {
            let patients = getDB('patients');
            patients = patients.filter(p => p.id !== id);
            setDB('patients', patients);
            return { success: true };
        } else {
            await this._request(`/patients/${id}/`, { method: 'DELETE' });
            let patients = getDB('patients');
            patients = patients.filter(p => p.id !== id);
            setDB('patients', patients);
            return { success: true };
        }
    },

    // --- Consultation APIs ---
    // GET /api/consultations/
    getConsultations: async function () {
        return this.useMock ? getDB('consultations') : this._request('/consultations/');
    },

    // POST /api/consultations/
    createConsultation: async function (data) {
        if (this.useMock) {
            const consults = getDB('consultations') || [];
            consults.push(data);
            setDB('consultations', consults);
            this.addAuditLog('doctors', data.doctorName, `Saved consultation diagnosis for patient: ${data.patientId}`);

            // Sync vitals to mock DB
            if (data.vitals) {
                const patients = getDB('patients');
                const patient = patients.find(p => p.id === data.patientId);
                if (patient) {
                    patient.vitalsHistory = patient.vitalsHistory || [];
                    patient.vitalsHistory.push({
                        date: data.consultationDate,
                        bpSystolic: data.vitals.bpSystolic,
                        bpDiastolic: data.vitals.bpDiastolic,
                        heartRate: data.vitals.heartRate,
                        temp: data.vitals.temp,
                        weight: data.vitals.weight
                    });
                    setDB('patients', patients);
                }
            }

            // Sync diagnosis to patient medical history in mock DB
            const patients = getDB('patients');
            const patient = patients.find(p => p.id === data.patientId);
            if (patient) {
                patient.medicalHistory = patient.medicalHistory || [];
                patient.medicalHistory.push({
                    date: data.consultationDate,
                    condition: data.diagnosis,
                    diagnosedBy: data.doctorName,
                    status: 'Active'
                });
                setDB('patients', patients);
            }

            // Sync visit to patient visit log in mock DB
            const visits = getDB('visits') || [];
            visits.push({
                id: 'v-' + Date.now(),
                patientId: data.patientId,
                date: data.consultationDate,
                department: 'General Medicine',
                doctorName: data.doctorName,
                reason: data.diagnosis
            });
            setDB('visits', visits);

            // Sync prescription to mock DB
            if (data.prescription) {
                const rx = getDB('prescriptions') || [];
                rx.push({
                    id: data.prescription.id,
                    patientId: data.patientId,
                    doctorName: data.doctorName,
                    date: data.consultationDate,
                    diagnosis: data.diagnosis,
                    medicines: data.prescription.medicines
                });
                setDB('prescriptions', rx);
            }

            // Sync lab request to mock DB
            if (data.labRequest) {
                const labs = getDB('lab_requests') || [];
                const patients = getDB('patients');
                const patient = patients.find(p => p.id === data.patientId);
                labs.push({
                    id: data.labRequest.id,
                    patientId: data.patientId,
                    patientName: patient ? patient.name : 'Unknown',
                    doctorName: data.doctorName,
                    testCategory: data.labRequest.testCategory,
                    testName: data.labRequest.testName,
                    requestDate: data.consultationDate,
                    status: 'pending',
                    resultDate: null,
                    technician: '',
                    priority: data.labRequest.priority || 'Medium',
                    results: []
                });
                setDB('lab_requests', labs);
            }

            // Complete appointment in mock DB
            if (data.appointmentId) {
                const appts = getDB('appointments') || [];
                const appt = appts.find(a => a.id === data.appointmentId || a.appt_id === data.appointmentId);
                if (appt) appt.status = 'completed';
                setDB('appointments', appts);
            }

            // Schedule follow-up in mock DB
            if (data.followup) {
                const appts = getDB('appointments') || [];
                appts.push({
                    id: data.followup.id,
                    patientId: data.patientId,
                    doctorId: 'doc-1',
                    doctorName: data.doctorName,
                    deptName: 'General Medicine',
                    date: data.followup.date,
                    timeSlot: data.followup.timeSlot,
                    symptoms: `Scheduled clinical follow-up for: ${data.diagnosis}`,
                    status: 'confirmed',
                    type: 'Doctor Checkup'
                });
                setDB('appointments', appts);
            }

            return data;
        } else {
            const res = await this._request('/consultations/', { method: 'POST', body: JSON.stringify(data) });
            const consults = getDB('consultations') || [];
            consults.push(res);
            setDB('consultations', consults);
            await this.syncDataFromServer();
            return res;
        }
    },

    // --- Prescription APIs ---
    // GET /api/prescriptions/
    getPrescriptions: async function () {
        return this.useMock ? getDB('prescriptions') : this._request('/prescriptions/');
    },

    // POST /api/prescriptions/
    createPrescription: async function (data) {
        if (this.useMock) {
            const rx = getDB('prescriptions');
            rx.push(data);
            setDB('prescriptions', rx);
            return data;
        } else {
            const res = await this._request('/prescriptions/', { method: 'POST', body: JSON.stringify(data) });
            const rx = getDB('prescriptions');
            rx.push(res);
            setDB('prescriptions', rx);
            return res;
        }
    },

    // --- Lab Test & Report APIs ---
    // GET /api/lab-tests/
    getLabTests: async function () {
        return this.useMock ? getDB('lab_requests') : this._request('/lab-tests/');
    },

    // POST /api/lab-tests/
    createLabTest: async function (data) {
        if (this.useMock) {
            const requests = getDB('lab_requests');
            requests.push(data);
            setDB('lab_requests', requests);
            return data;
        } else {
            const res = await this._request('/lab-tests/', { method: 'POST', body: JSON.stringify(data) });
            const requests = getDB('lab_requests');
            requests.push(res);
            setDB('lab_requests', requests);
            return res;
        }
    },

    // PUT /api/lab-tests/{id}/
    updateLabTest: async function (id, data) {
        if (this.useMock) {
            const requests = getDB('lab_requests');
            const idx = requests.findIndex(r => r.id === id);
            if (idx === -1) throw new Error("Lab request not found.");
            requests[idx] = { ...requests[idx], ...data };
            setDB('lab_requests', requests);
            return requests[idx];
        } else {
            const res = await this._request(`/lab-tests/${id}/`, { method: 'PUT', body: JSON.stringify(data) });
            const requests = getDB('lab_requests');
            const idx = requests.findIndex(r => r.id === id);
            if (idx !== -1) {
                requests[idx] = res;
                setDB('lab_requests', requests);
            }
            await this.syncDataFromServer();
            return res;
        }
    },

    // --- Appointment Scheduling APIs ---
    // GET /api/appointments/
    getAppointments: async function () {
        return this.useMock ? getDB('appointments') : this._request('/appointments/');
    },

    // POST /api/appointments/
    createAppointment: async function (data) {
        if (this.useMock) {
            const appts = getDB('appointments');
            appts.push(data);
            setDB('appointments', appts);
            return data;
        } else {
            const res = await this._request('/appointments/', { method: 'POST', body: JSON.stringify(data) });
            const appts = getDB('appointments');
            appts.push(res);
            setDB('appointments', appts);
            return res;
        }
    },

    // PATCH /api/appointments/{id}/
    updateAppointmentStatus: async function (id, status) {
        if (this.useMock) {
            const appts = getDB('appointments');
            const appt = appts.find(a => a.id === id);
            if (appt) {
                appt.status = status;
                setDB('appointments', appts);
            }
            return appt;
        } else {
            const res = await this._request(`/appointments/${id}/`, {
                method: 'PATCH',
                body: JSON.stringify({ status })
            });
            const appts = getDB('appointments');
            const idx = appts.findIndex(a => a.id === id);
            if (idx !== -1) {
                appts[idx] = res;
                setDB('appointments', appts);
            }
            await this.syncDataFromServer();
            return res;
        }
    },

    // DELETE /api/appointments/{id}/
    deleteAppointment: async function (id) {
        if (this.useMock) {
            let appts = getDB('appointments');
            appts = appts.filter(a => a.id !== id);
            setDB('appointments', appts);
            return { success: true };
        } else {
            await this._request(`/appointments/${id}/`, { method: 'DELETE' });
            let appts = getDB('appointments');
            appts = appts.filter(a => a.id !== id);
            setDB('appointments', appts);
            return { success: true };
        }
    },

    // POST /api/patients/{patientId}/vitals/
    addPatientVitals: async function (patientId, vitalData) {
        if (this.useMock) {
            const patients = getDB('patients');
            const idx = patients.findIndex(p => p.id === patientId);
            if (idx !== -1) {
                patients[idx].vitalsHistory.push(vitalData);
                setDB('patients', patients);
            }
            return vitalData;
        } else {
            const res = await this._request(`/patients/${patientId}/vitals/`, {
                method: 'POST',
                body: JSON.stringify(vitalData)
            });
            return res;
        }
    },

    // POST /api/patients/{patientId}/medical-history/
    addPatientMedicalHistory: async function (patientId, historyData) {
        if (this.useMock) {
            const patients = getDB('patients');
            const idx = patients.findIndex(p => p.id === patientId);
            if (idx !== -1) {
                patients[idx].medicalHistory.push(historyData);
                setDB('patients', patients);
            }
            return historyData;
        } else {
            const res = await this._request(`/patients/${patientId}/medical-history/`, {
                method: 'POST',
                body: JSON.stringify(historyData)
            });
            return res;
        }
    },

    // POST /api/patients/{patientId}/visits/
    addPatientVisit: async function (patientId, visitData) {
        if (this.useMock) {
            const visits = getDB('visits') || [];
            visitData.id = 'v-' + (visits.length + 1);
            visitData.patientId = patientId;
            visits.push(visitData);
            setDB('visits', visits);
            return visitData;
        } else {
            const res = await this._request(`/patients/${patientId}/visits/`, {
                method: 'POST',
                body: JSON.stringify(visitData)
            });
            return res;
        }
    },

    // --- Analytics APIs ---
    getAdminAnalytics: async function () {
        return this._request('/analytics/admin/');
    },
    getDoctorAnalytics: async function () {
        return this._request('/analytics/doctor/');
    },
    getLabAnalytics: async function () {
        return this._request('/analytics/laboratory/');
    },

    // PUT /api/users/{id}/
    updateUser: async function (id, data) {
        if (this.useMock) {
            const users = getDB('users');
            const idx = users.findIndex(u => u.id === id);
            if (idx !== -1) {
                users[idx] = { ...users[idx], ...data };
                setDB('users', users);
            }
            return data;
        } else {
            const res = await this._request(`/users/${id}/`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
            return res;
        }
    },

    // DELETE /api/users/{id}/
    deleteUser: async function (id) {
        if (this.useMock) {
            let users = getDB('users');
            users = users.filter(u => u.id !== id);
            setDB('users', users);
            return { success: true };
        } else {
            await this._request(`/users/${id}/`, { method: 'DELETE' });
            return { success: true };
        }
    },

    // Audit logger utility
    addAuditLog: function (module, initiator, action, flag = 'SECURE') {
        const audits = getDB('audits');
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
        audits.unshift({ timestamp, module, initiator, action, flag });
        setDB('audits', audits);
    }
};

const AuthService = {
    login: async function (email, password, role) {
        return ApiService.login(email, password, role);
    },
    register: async function (name, email, password, role, extraFields) {
        return ApiService.register(name, email, password, role, extraFields);
    },
    logout: function () {
        sessionStorage.removeItem('hc_current_user');
        window.location.href = 'login.html';
    },
    getCurrentUser: function () {
        const userStr = sessionStorage.getItem('hc_current_user');
        if (!userStr) return null;
        return JSON.parse(userStr);
    },
    requireAuth: function (allowedRoles = []) {
        const user = this.getCurrentUser();
        if (!user) {
            window.location.href = 'login.html';
            return null;
        }
        if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
            window.location.href = 'login.html';
            return null;
        }
        return user;
    }
};


// ==========================================
// 3. COMMON INTERACTIVE SPA TABS
// ==========================================

function setupDashboardNavigation() {
    const navLinks = document.querySelectorAll('.sidebar-link[data-panel]');
    const panels = document.querySelectorAll('.dashboard-panel');
    const mobileSidebar = document.querySelector('.dashboard-sidebar');
    const toggleBtn = document.querySelector('.mobile-sidebar-toggle');

    if (toggleBtn && mobileSidebar) {
        toggleBtn.addEventListener('click', () => {
            mobileSidebar.classList.toggle('show');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            if (mobileSidebar && mobileSidebar.classList.contains('show')) {
                mobileSidebar.classList.remove('show');
            }

            const targetPanel = this.getAttribute('data-panel');
            document.querySelectorAll('.sidebar-item').forEach(item => {
                item.classList.remove('active');
            });
            this.closest('.sidebar-item').classList.add('active');

            panels.forEach(panel => {
                if (panel.id === targetPanel) {
                    panel.classList.add('active');
                } else {
                    panel.classList.remove('active');
                }
            });

            const panelTitle = this.querySelector('span').innerText;
            const breadcrumbEl = document.getElementById('breadcrumb-title');
            if (breadcrumbEl) {
                breadcrumbEl.innerText = panelTitle;
            }
        });
    });
}


// ==========================================
// 4. PORTAL SPECIFIC LOGIC
// ==========================================

// --- PATIENT DASHBOARD WORKFLOWS ---
function initPatientPortal(patientUser) {
    const patientId = patientUser.patientId;
    const patients = getDB('patients');
    const patient = patients.find(p => p.id === patientId);
    if (!patient) return;

    // Header Display Setup
    document.getElementById('user-display-name').innerText = patient.name;
    document.getElementById('avatar-letters').innerText = patient.name.split(' ').map(n=>n[0]).join('');

    // Set records demographic panel details
    const recBlood = document.getElementById('records-blood-group');
    if (recBlood) recBlood.innerText = `${patient.bloodGroup} Blood Group`;
    const recEmergName = document.getElementById('records-emergency-name');
    const recEmergPhone = document.getElementById('records-emergency-phone');
    if (recEmergName && recEmergPhone) {
        recEmergName.innerText = patient.emergencyName;
        recEmergPhone.innerText = patient.emergencyPhone;
    }

    // Populate Lists & Views
    renderPatientOverview(patient);
    renderPatientVitalsCharts(patient);
    renderPatientMedicalHistory(patient);
    renderPatientPrescriptions(patient);
    renderPatientLabReports(patient);
    renderPatientAppointments(patient);
    renderPatientVisits(patient);
    renderPatientFiles(patient);

    // Setup Patient File Upload
    setupPatientFileUploader(patient);

    // Initialize 5-Step Appointment Booking Wizard
    initBookingWizard(patient);

    // Render verification badges & member joined date
    if (window.renderPatientVerificationBadges) {
        window.renderPatientVerificationBadges(patientUser);
    }

    // Profile Edit Handler
    const profileForm = document.getElementById('patient-profile-form');
    if (profileForm) {
        document.getElementById('profile-name').value = patient.name;
        document.getElementById('profile-dob').value = patient.dob;
        document.getElementById('profile-gender').value = patient.gender;
        document.getElementById('profile-blood').value = patient.bloodGroup;
        document.getElementById('profile-phone').value = patient.phone;
        document.getElementById('profile-emergency-name').value = patient.emergencyName;
        document.getElementById('profile-emergency-phone').value = patient.emergencyPhone;
        document.getElementById('profile-allergies').value = patient.allergies;
        
        document.getElementById('profile-card-name').innerText = patient.name;
        document.getElementById('profile-card-id').innerText = patient.id;
        
        if (patient.aadhaar) document.getElementById('profile-aadhaar').value = patient.aadhaar;
        if (patient.address) document.getElementById('profile-address').value = patient.address;
        if (patient.insuranceCarrier) document.getElementById('profile-insurance-carrier').value = patient.insuranceCarrier;
        if (patient.insurancePolicy) document.getElementById('profile-insurance-policy').value = patient.insurancePolicy;
        if (patient.avatar) document.getElementById('profile-avatar-img').src = patient.avatar;

        profileForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const phone = document.getElementById('profile-phone').value;
            if (!FormValidator.validatePhone(phone)) {
                Toast.error("Please enter a valid phone number.");
                return;
            }

            const updatedData = {
                dob: document.getElementById('profile-dob').value,
                gender: document.getElementById('profile-gender').value,
                bloodGroup: document.getElementById('profile-blood').value,
                phone: phone,
                emergencyName: document.getElementById('profile-emergency-name').value,
                emergencyPhone: document.getElementById('profile-emergency-phone').value,
                allergies: document.getElementById('profile-allergies').value,
                nationalId: document.getElementById('profile-aadhaar').value,
                address: document.getElementById('profile-address').value,
                insuranceCarrier: document.getElementById('profile-insurance-carrier').value,
                insurancePolicy: document.getElementById('profile-insurance-policy').value
            };

            try {
                if (!ApiService.useMock) {
                    await ApiService.updatePatient(patient.id, updatedData);
                    await ApiService.syncDataFromServer();
                } else {
                    const patIndex = patients.findIndex(p => p.id === patient.id);
                    patients[patIndex] = { ...patient, ...updatedData };
                    setDB('patients', patients);
                }
                
                // Refresh local patient reference
                const freshPatient = getDB('patients').find(p => p.id === patient.id);
                Toast.success("Profile demographics updated successfully!");
                renderPatientOverview(freshPatient || patient);
            } catch (err) {
                Toast.error("Failed to update profile: " + err.message);
            }
        });
    }

    // Change Password Handler
    const changePasswordForm = document.getElementById('profile-change-password-form');
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const newPass = document.getElementById('profile-new-pass').value;
            const confirmPass = document.getElementById('profile-confirm-pass').value;

            if (newPass !== confirmPass) {
                Toast.error("Passwords do not match.");
                return;
            }

            try {
                if (!ApiService.useMock && patientUser.id) {
                    await ApiService.updateUser(patientUser.id, { password: newPass });
                } else {
                    let users = getDB('users') || [];
                    const idx = users.findIndex(u => u.email === patientUser.email);
                    if (idx !== -1) {
                        users[idx].password = newPass;
                        setDB('users', users);
                    }
                }
                Toast.success("Password updated successfully!");
                changePasswordForm.reset();
            } catch (err) {
                Toast.error("Failed to update password: " + err.message);
            }
        });
    }

    // Global Search Listener
    const searchInput = document.getElementById('patient-dashboard-search');
    if (searchInput) {
        searchInput.addEventListener('input', function (e) {
            const query = e.target.value.toLowerCase().trim();
            filterPatientDashboardRecords(patient, query);
        });
    }

    // Initialize Payments Panel details
    renderPatientPayments(patient);
}

function filterPatientDashboardRecords(patient, query) {
    // 1. Filter appointments cards
    const apptCards = document.querySelectorAll('#patient-appts-cards .col-12');
    apptCards.forEach(card => {
        const text = card.innerText.toLowerCase();
        card.style.display = text.includes(query) ? '' : 'none';
    });

    // 2. Filter prescriptions table rows
    const rxRows = document.querySelectorAll('#patient-prescriptions-list tr');
    rxRows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
    });

    // 3. Filter medical records table rows
    const historyRows = document.querySelectorAll('#patient-history-list tr');
    historyRows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
    });

    // 4. Filter lab reports table rows
    const labRows = document.querySelectorAll('#patient-labs-list tr');
    labRows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
    });

    // 5. Filter outstanding invoices table rows
    const invoiceRows = document.querySelectorAll('#patient-invoices-list tr');
    invoiceRows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
    });

    // 6. Filter payment history table rows
    const receiptRows = document.querySelectorAll('#patient-receipts-list tr');
    receiptRows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
    });
}

function renderPatientOverview(patient) {
    const prescriptions = getDB('prescriptions').filter(pr => pr.patientId === patient.id);
    const labRequests = getDB('lab_requests').filter(l => l.patientId === patient.id);
    const appts = getDB('appointments').filter(ap => ap.patientId === patient.id);

    document.getElementById('patient-active-rx').innerText = prescriptions.length;
    document.getElementById('patient-pending-labs').innerText = labRequests.filter(l => l.status === 'pending').length;

    const todayStr = new Date().toISOString().split('T')[0];
    const upcoming = appts.filter(ap => ap.date >= todayStr && ap.status === 'confirmed');
    document.getElementById('patient-next-appt').innerText = upcoming.length > 0 ? `${upcoming[0].date} @ ${upcoming[0].timeSlot}` : 'None Scheduled';
    document.getElementById('panel-allergies-summary').innerText = patient.allergies || 'No known allergies.';

    if (patient.vitalsHistory && patient.vitalsHistory.length > 0) {
        const latest = patient.vitalsHistory[patient.vitalsHistory.length - 1];
        document.getElementById('vital-bp-val').innerText = `${latest.bpSystolic}/${latest.bpDiastolic}`;
        document.getElementById('vital-hr-val').innerText = `${latest.heartRate} bpm`;
        document.getElementById('vital-temp-val').innerText = `${latest.temp} °F`;
        document.getElementById('vital-weight-val').innerText = `${latest.weight} kg`;
    } else {
        document.querySelectorAll('.vital-value').forEach(el => el.innerText = '--');
    }
}

let patientVitalsChartInstance = null;

function renderPatientVitalsCharts(patient) {
    const ctx = document.getElementById('patientVitalsChart');
    if (!ctx) return;

    if (patientVitalsChartInstance) patientVitalsChartInstance.destroy();

    const labels = patient.vitalsHistory.map(v => v.date);
    const sysData = patient.vitalsHistory.map(v => v.bpSystolic);
    const diaData = patient.vitalsHistory.map(v => v.bpDiastolic);
    const hrData = patient.vitalsHistory.map(v => v.heartRate);

    patientVitalsChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                { label: 'BP Systolic', data: sysData, borderColor: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.05)', tension: 0.25 },
                { label: 'BP Diastolic', data: diaData, borderColor: '#f59e0b', backgroundColor: 'rgba(245, 158, 11, 0.05)', tension: 0.25 },
                { label: 'Heart Rate', data: hrData, borderColor: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.05)', tension: 0.25 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { grid: { color: '#e2e8f0' } },
                x: { grid: { display: false } }
            }
        }
    });
}

function renderPatientMedicalHistory(patient) {
    const container = document.getElementById('patient-history-timeline');
    if (!container) return;

    if (!patient.medicalHistory || patient.medicalHistory.length === 0) {
        container.innerHTML = `<p class="text-muted">No recorded medical conditions.</p>`;
        return;
    }

    let html = '';
    patient.medicalHistory.forEach(h => {
        html += `
        <div class="timeline-event">
            <div class="timeline-date">${h.date}</div>
            <div class="timeline-card">
                <h5 class="timeline-title">${h.condition}</h5>
                <p class="text-muted mb-1">Diagnosed by: <strong>${h.diagnosedBy}</strong> | Status: <span class="badge bg-success">${h.status}</span></p>
                ${h.notes ? `<p class="font-size-xs mb-0 text-secondary" style="border-left: 2px solid #cbd5e1; padding-left: 8px; margin-top: 4px;"><strong>Doctor Notes:</strong> ${h.notes}</p>` : ''}
            </div>
        </div>`;
    });
    container.innerHTML = html;
}

function renderPatientPrescriptions(patient) {
    const rxList = document.getElementById('patient-prescriptions-list');
    if (!rxList) return;

    const prescriptions = getDB('prescriptions').filter(pr => pr.patientId === patient.id);
    if (prescriptions.length === 0) {
        rxList.innerHTML = `<tr><td colspan="7" class="text-center text-muted">No prescriptions issued.</td></tr>`;
        return;
    }

    let html = '';
    prescriptions.forEach(rx => {
        rx.medicines.forEach((med, i) => {
            html += `
            <tr>
                <td>${i === 0 ? `<strong>${rx.date}</strong>` : ''}</td>
                <td>${med.name}</td>
                <td>${med.dosage}</td>
                <td>${med.frequency || 'N/A'}</td>
                <td>${med.duration}</td>
                <td>${med.route || 'N/A'}</td>
                <td>${med.instructions || med.notes || ''}</td>
            </tr>`;
        });
    });
    rxList.innerHTML = html;
}

function renderPatientLabReports(patient) {
    const labList = document.getElementById('patient-labs-list');
    if (!labList) return;

    const labRequests = getDB('lab_requests').filter(l => l.patientId === patient.id);
    if (labRequests.length === 0) {
        labList.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No laboratory reports available.</td></tr>`;
        return;
    }

    let html = '';
    labRequests.forEach(req => {
        const isCompleted = req.status === 'completed';
        html += `
        <tr>
            <td><strong>${req.requestDate}</strong></td>
            <td>${req.testName}</td>
            <td>${req.doctorName}</td>
            <td><span class="hc-badge-status ${isCompleted ? 'badge-completed' : 'badge-pending'}">${req.status.toUpperCase()}</span></td>
            <td>
                ${isCompleted ? `<button class="btn btn-sm btn-outline-primary" onclick="viewLabReportModal('${req.id}')"><i class="fa-solid fa-eye me-1"></i> View Report</button>` : `<span class="text-muted"><i class="fa-solid fa-hourglass-half me-1"></i> Processing</span>`}
            </td>
        </tr>`;
    });
    labList.innerHTML = html;
}

function renderPatientAppointments(patient) {
    const cardsContainer = document.getElementById('patient-appts-cards');
    if (!cardsContainer) return;

    const appts = getDB('appointments').filter(ap => ap.patientId === patient.id);
    if (appts.length === 0) {
        cardsContainer.innerHTML = `<div class="col-12 text-center text-muted p-5 bg-white rounded border shadow-sm"><i class="fa-solid fa-calendar-times fs-2 mb-3 text-muted"></i><p class="mb-0 font-size-sm">No consultations scheduled.</p></div>`;
        return;
    }

    const invoices = getDB('patient_invoices') || [];

    let html = '';
    appts.forEach(ap => {
        let badgeClass = 'badge-active';
        if (ap.status === 'pending') badgeClass = 'badge-pending';
        if (ap.status === 'confirmed') badgeClass = 'badge-completed';
        if (ap.status === 'cancelled') badgeClass = 'badge-cancelled';
        if (ap.status === 'completed') badgeClass = 'badge-completed';

        // Est wait time calculation
        let estWait = ap.status === 'pending' ? '45 mins' : (ap.status === 'confirmed' ? '15 mins' : '--');

        // Check billing/payment status
        const invoice = invoices.find(inv => inv.description.toLowerCase().includes(ap.doctorName.toLowerCase()) || inv.patientId === patient.id && inv.status === 'unpaid');
        const paymentStatus = invoice ? invoice.status.toUpperCase() : 'PAID';
        const paymentBadgeClass = paymentStatus === 'PAID' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning';

        // Generate initials for avatar
        const initials = ap.doctorName.replace('Dr. ', '').split(' ').map(n => n[0]).join('');

        html += `
        <div class="col-12 col-md-12 col-lg-12 mb-3">
            <div class="card border-0 shadow-sm rounded-4 p-4 position-relative overflow-hidden" style="background: #ffffff; border-left: 5px solid ${ap.status === 'cancelled' ? '#ef4444' : '#3b82f6'} !important; transition: transform 0.2s ease;">
                <div class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-3">
                    <div class="d-flex align-items-center gap-3">
                        <div class="avatar-mock text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm" style="width: 54px; height: 54px; font-size: 1.1rem; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);">
                            ${initials}
                        </div>
                        <div>
                            <h6 class="fw-bold text-dark mb-0 font-size-sm" style="font-size:1.05rem;">${ap.doctorName}</h6>
                            <span class="badge bg-secondary-subtle text-secondary font-size-xxs px-2 py-1 mt-1">${ap.deptName}</span>
                        </div>
                    </div>
                    <div class="text-sm-end">
                        <span class="hc-badge-status ${badgeClass} px-3 py-1.5 font-size-xxs fw-bold text-uppercase rounded-3">${ap.status}</span>
                        <span class="badge ${paymentBadgeClass} px-3 py-1.5 font-size-xxs fw-bold text-uppercase rounded-3 ms-2">${paymentStatus}</span>
                    </div>
                </div>

                <div class="row g-3 bg-light rounded-3 p-3 mb-3 border border-light-subtle">
                    <div class="col-sm-4 col-6">
                        <span class="text-muted d-block font-size-xxs text-uppercase fw-bold" style="letter-spacing: 0.5px;">Schedule Date</span>
                        <strong class="text-dark font-size-xs"><i class="fa-solid fa-calendar text-primary me-2"></i>${ap.date}</strong>
                    </div>
                    <div class="col-sm-4 col-6">
                        <span class="text-muted d-block font-size-xxs text-uppercase fw-bold" style="letter-spacing: 0.5px;">Time Slot</span>
                        <strong class="text-dark font-size-xs"><i class="fa-solid fa-clock text-success me-2"></i>${ap.timeSlot}</strong>
                    </div>
                    <div class="col-sm-4 col-12">
                        <span class="text-muted d-block font-size-xxs text-uppercase fw-bold" style="letter-spacing: 0.5px;">Queue Tracker</span>
                        <strong class="text-dark font-size-xs"><i class="fa-solid fa-hourglass-start text-warning me-2"></i>#${ap.id.slice(-4).toUpperCase()} (${estWait})</strong>
                    </div>
                </div>

                <div class="d-flex justify-content-end gap-2">
                    ${ap.status === 'pending' || ap.status === 'confirmed' ? `
                        <button type="button" class="btn btn-sm btn-outline-danger px-4 rounded-3 py-2 font-size-xs" onclick="cancelAppointment('${ap.id}')"><i class="fa-solid fa-ban me-1.5"></i>Cancel</button>
                        <button type="button" class="btn btn-sm btn-outline-primary px-4 rounded-3 py-2 font-size-xs" onclick="rescheduleAppointment('${ap.id}')"><i class="fa-solid fa-calendar-alt me-1.5"></i>Reschedule</button>
                    ` : ''}
                    ${ap.status === 'completed' ? `
                        <button type="button" class="btn btn-sm btn-warning text-dark px-4 rounded-3 py-2 font-size-xs fw-bold" onclick="openFeedbackModal('${ap.id}', '${ap.doctorName}')">
                            <i class="fa-solid fa-star me-1.5"></i>Rate Consultation
                        </button>
                    ` : ''}
                </div>
            </div>
        </div>`;
    });
    cardsContainer.innerHTML = html;
}

function renderPatientVisits(patient) {
    const visitsList = document.getElementById('patient-visits-list');
    if (!visitsList) return;

    const visits = getDB('visits').filter(v => v.patientId === patient.id);
    if (visits.length === 0) {
        visitsList.innerHTML = `<tr><td colspan="4" class="text-center text-muted">No visits recorded.</td></tr>`;
        return;
    }

    let html = '';
    visits.forEach(v => {
        html += `
        <tr>
            <td><strong>${v.date}</strong></td>
            <td>${v.department}</td>
            <td>${v.doctorName}</td>
            <td>
                <div>${v.reason}</div>
                ${v.notes ? `<div class="font-size-xxs text-muted mt-1">Notes: ${v.notes}</div>` : ''}
            </td>
        </tr>`;
    });
    visitsList.innerHTML = html;
}

window.viewMockPatientFile = function (fileId) {
    window.mockFilesMemory = window.mockFilesMemory || {};
    const fileObj = window.mockFilesMemory[fileId];
    if (fileObj) {
        const url = URL.createObjectURL(fileObj);
        window.open(url, '_blank');
    } else {
        const files = getDB('files');
        const f = files.find(file => file.id === fileId);
        const fileData = (f && f.file) ? f.file : 'data:application/pdf;base64,JVBERi0xLjQKJdPr6goxIDAgb2JqCjw8L1R5cGUvQ2F0YWxvZy9QYWdlcyAyIDAgUj4+CmVuZG9iagoyIDAgb2JqCjw8L1R5cGUvUGFnZXMvS2lkc1szIDAgUl0vQ291bnQgMT4+CmVuZG9iagozIDAgb2JqCjw8L1R5cGUvUGFnZS9QYXJlbnQgMiAwIFIvTWVkaWFCb3hbMCAwIDU5NSA4NDJdL1Jlc291cmNlczw8L0ZvbnQ8PC9GMSA0IDAgUj4+Pj4vQ29udGVudHMgNSAwIFI+PgplbmRvYmoKNCAwIG9iago8PCAvVHlwZSAvRm9udCAvU3VidHlwZSAvVHlwZTEgL0Jhc2VGb250IC9IZWx2ZXRpY2EgPj4KZW5kb2JqCjUgMCBvYmoKPDwvTGVuZ3RoIDcwPj4Kc3RyZWFtCkJUCi9GMSAyNCBUZgoxMDAgNzAwIFRkCihDdXJlUG9pbnQgLSBTYW1wbGUgUmVwb3J0KSBUagpETQpCVAovRjEgMTIgVGYKMTAwIDY1MCBUZAooVGhpcyBpcyBhIG1vY2sgcGRmIHJlcG9ydCBkb2N1bWVudC4pIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDE1IDAwMDAwIG4gCjAwMDAwMDAwNjAgMDAwMDAgbiAKMDAwMDAwMDEwOSAwMDAwMCBuIAowMDAwMDAwMTk4IDAwMDAwIG4gCjAwMDAwMDAyNjcgMDAwMDAgbiAKdHJhaWxlcgo8PC9TaXplIDYvUm9vdCAxIDAgUj4+CnN0YXJ0eHJlZgozODgKJSVFT0Y=';
        window.open(fileData, '_blank');
    }
};

function renderPatientFiles(patient) {
    const fileContainer = document.getElementById('patient-uploaded-files-list');
    if (!fileContainer) return;

    const files = getDB('files').filter(f => f.patientId === patient.id);
    if (files.length === 0) {
        fileContainer.innerHTML = `<p class="text-muted font-size-sm text-center py-3">No external reports uploaded.</p>`;
        return;
    }

    let html = '';
    files.forEach(f => {
        let onClickAction = '';
        if (ApiService.useMock) {
            onClickAction = `onclick="viewMockPatientFile('${f.id}')" style="cursor: pointer;"`;
        } else {
            onClickAction = `onclick="window.open('${f.file || '#'}', '_blank')" style="cursor: pointer;"`;
        }

        html += `
        <div class="hc-file-preview-card">
            <div class="hc-file-preview-info" ${onClickAction}>
                <i class="fa-solid fa-file-pdf hc-file-preview-icon text-primary"></i>
                <div class="flex-grow-1">
                    <h6 class="mb-0 fw-bold font-size-sm text-dark file-name-hover" style="text-decoration: underline; color: var(--hc-primary) !important;">${f.name}</h6>
                    <span class="text-muted font-size-xs">${f.size} | Uploaded ${f.date}</span>
                </div>
            </div>
            <div class="d-flex align-items-center gap-2">
                <button class="btn btn-sm btn-link text-primary p-0" ${onClickAction} title="View Document"><i class="fa-solid fa-eye"></i></button>
                <button class="btn btn-sm btn-link text-danger p-0" onclick="deletePatientFile('${f.id}', '${patient.id}')" title="Delete Document"><i class="fa-solid fa-trash-can"></i></button>
            </div>
        </div>`;
    });
    fileContainer.innerHTML = html;
}

function setupPatientFileUploader(patient) {
    const dropzone = document.getElementById('patient-upload-dropzone');
    const fileInput = document.getElementById('patient-file-input');
    if (!dropzone || !fileInput) return;

    dropzone.addEventListener('click', () => fileInput.click());
    dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('dragover'); });
    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) {
            handlePatientFileUpload(e.dataTransfer.files[0], patient);
        }
    });
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            handlePatientFileUpload(fileInput.files[0], patient);
        }
    });
}

async function handlePatientFileUpload(file, patient) {
    if (!FormValidator.validateFileSize(file, 5)) {
        Toast.warning("File size exceeds 5MB limit.");
        return;
    }
    const allowed = ['application/pdf', 'image/png', 'image/jpeg'];
    if (!allowed.includes(file.type)) {
        Toast.warning("Invalid file type. Please upload a PDF or image.");
        return;
    }

    if (ApiService.useMock) {
        const files = getDB('files');
        const fileId = 'f-' + (files.length + 1);

        window.mockFilesMemory = window.mockFilesMemory || {};
        window.mockFilesMemory[fileId] = file;

        const newFile = {
            id: fileId,
            patientId: patient.id,
            name: file.name,
            size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
            type: file.type,
            date: new Date().toISOString().split('T')[0]
        };

        files.push(newFile);
        setDB('files', files);
        Toast.success(`Successfully uploaded: ${file.name}`);
        renderPatientFiles(patient);
    } else {
        const formData = new FormData();
        formData.append('file', file);
        try {
            const token = JSON.parse(sessionStorage.getItem('hc_current_user')).token;
            const res = await fetch(`${ApiService.baseUrl}/patients/${patient.id}/files/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
            if (!res.ok) throw new Error("Upload failed.");
            Toast.success(`Successfully uploaded: ${file.name}`);
            await ApiService.syncDataFromServer();
            renderPatientFiles(patient);
        } catch (err) {
            Toast.error("File upload failed: " + err.message);
        }
    }
}

window.deletePatientFile = async function (fileId, patientId) {
    if (ApiService.useMock) {
        let files = getDB('files');
        files = files.filter(f => f.id !== fileId);
        setDB('files', files);
        Toast.success("File document deleted.");
        const patient = getDB('patients').find(p => p.id === patientId);
        if (patient) renderPatientFiles(patient);
    } else {
        try {
            const token = JSON.parse(sessionStorage.getItem('hc_current_user')).token;
            const res = await fetch(`${ApiService.baseUrl}/patients/${patientId}/files/${fileId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!res.ok) throw new Error("Delete failed.");
            Toast.success("File document deleted.");
            await ApiService.syncDataFromServer();
            const patient = getDB('patients').find(p => p.id === patientId);
            if (patient) renderPatientFiles(patient);
        } catch (err) {
            Toast.error("File deletion failed: " + err.message);
        }
    }
};


// --- DOCTOR DASHBOARD WORKFLOWS ---
let doctorConsultsChartInstance = null;
let doctorDemographicsChartInstance = null;

function initDoctorPortal(doctorUser) {
    const docId = doctorUser.doctorId;
    const doctors = getDB('doctors');
    const doctor = doctors.find(d => d.id === docId);
    if (!doctor) return;

    document.getElementById('user-display-name').innerText = doctor.name;
    document.getElementById('avatar-letters').innerText = doctor.name.replace('Dr. ', '').split(' ').map(n=>n[0]).join('');

    renderDoctorDashboard(doctor);
    setupDoctorPatientSelectors();
    
    // Initialize directory state
    patientDirectoryView = 'grid'; // default view
    renderDoctorPatientDirectory();
    setupDoctorPatientDirectoryFilters();

    // Initialize leave history & form
    renderDoctorLeaves(doctor);
    setupDoctorLeaveForm(doctor);

    // Initialize calendar workspace state & events
    currentCalendarDate = new Date(2026, 5, 1); // June 2026
    currentCalendarView = 'month';
    renderDoctorCalendarWorkspace(doctor);
    setupDoctorCalendarEvents(doctor);

    renderDoctorAnalytics(doctor, 'daily');
    renderDoctorReviews(doctor);

    // Reports Time Frame Filter Selector
    const reportsFilter = document.getElementById('reports-time-filter');
    if (reportsFilter) {
        const filterBtns = reportsFilter.querySelectorAll('button');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                const timeframe = this.getAttribute('data-filter');
                renderDoctorAnalytics(doctor, timeframe);
            });
        });
    }

    // Consultation Med Rows Button
    const addMedBtn = document.getElementById('doc-add-med-btn');
    if (addMedBtn) {
        addMedBtn.addEventListener('click', addPrescriptionRowToConsult);
    }

    // Submit consultation
    const consultForm = document.getElementById('doctor-consult-form');
    if (consultForm) {
        consultForm.addEventListener('submit', function (e) {
            e.preventDefault();
            submitDoctorConsultation(doctor);
        });
    }
}

function renderDoctorDashboard(doctor) {
    const appointments = getDB('appointments').filter(ap => ap.doctorId === doctor.id);
    const labs = getDB('lab_requests').filter(l => l.doctorName === doctor.name);

    document.getElementById('doc-today-appts').innerText = appointments.filter(ap => ap.status !== 'completed' && ap.status !== 'cancelled').length;
    document.getElementById('doc-pending-labs').innerText = labs.filter(l => l.status === 'pending').length;

    const apptQueue = document.getElementById('doctor-appt-queue');
    if (apptQueue) {
        if (appointments.length === 0) {
            apptQueue.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No appointments scheduled.</td></tr>`;
            return;
        }

        let html = '';
        const patients = getDB('patients');
        appointments.forEach(ap => {
            const pat = patients.find(p => p.id === ap.patientId);
            const age = pat ? (new Date().getFullYear() - new Date(pat.dob).getFullYear()) : '--';
            let statusBadge = '';
            let actionBtn = '';

            if (ap.status === 'pending') {
                statusBadge = `<span class="hc-badge-status badge-pending">PENDING</span>`;
                actionBtn = `
                    <div class="d-flex gap-2">
                        <button class="btn btn-xs btn-success text-white px-2 py-1" onclick="handleDoctorApptStatus('${ap.id}', 'confirmed')"><i class="fa-solid fa-check"></i> Accept</button>
                        <button class="btn btn-xs btn-danger text-white px-2 py-1" onclick="handleDoctorApptStatus('${ap.id}', 'cancelled')"><i class="fa-solid fa-xmark"></i> Reject</button>
                    </div>`;
            } else if (ap.status === 'confirmed') {
                statusBadge = `<span class="hc-badge-status badge-active">CONFIRMED</span>`;
                actionBtn = `<button class="btn btn-sm btn-hc-primary" onclick="startConsultation('${ap.patientId}', '${ap.id}')"><i class="fa-solid fa-stethoscope me-1"></i> Consult</button>`;
            } else if (ap.status === 'completed') {
                statusBadge = `<span class="hc-badge-status badge-completed">COMPLETED</span>`;
                actionBtn = `<span class="text-muted font-size-xs"><i class="fa-solid fa-circle-check text-success"></i> Consulted</span>`;
            } else {
                statusBadge = `<span class="hc-badge-status badge-cancelled">CANCELLED</span>`;
                actionBtn = `<span class="text-muted font-size-xs">No Action</span>`;
            }

            html += `
            <tr>
                <td><strong>${ap.date} ${ap.timeSlot}</strong></td>
                <td>${pat ? pat.name : 'Unknown'}</td>
                <td>${age}</td>
                <td>${ap.symptoms || 'General Consult'}</td>
                <td>${statusBadge}</td>
                <td>${actionBtn}</td>
            </tr>`;
        });
        apptQueue.innerHTML = html;
    }
}

window.handleDoctorApptStatus = async function (apptId, newStatus) {
    try {
        await ApiService.updateAppointmentStatus(apptId, newStatus);
        showToast(`Appointment status updated to ${newStatus}!`);
        // Refresh doctor dashboard view
        const currentUser = AuthService.getCurrentUser();
        if (currentUser && currentUser.role === 'doctor') {
            const doctors = getDB('doctors');
            const doctor = doctors.find(d => d.id === currentUser.doctorId);
            if (doctor) {
                renderDoctorDashboard(doctor);
            }
        }
    } catch (err) {
        alert("Failed to update appointment: " + err.message);
    }
};

function setupDoctorPatientSelectors() {
    const patSelect = document.getElementById('consult-patient-select');
    if (!patSelect) return;

    const patients = getDB('patients');
    patSelect.innerHTML = '<option value="">-- Choose Patient --</option>';
    patients.forEach(pat => {
        patSelect.innerHTML += `<option value="${pat.id}">${pat.name} (${pat.id})</option>`;
    });

    patSelect.replaceWith(patSelect.cloneNode(true));
    const newPatSelect = document.getElementById('consult-patient-select');

    newPatSelect.addEventListener('change', function () {
        const patId = this.value;
        const summary = document.getElementById('consult-patient-summary');
        const placeholder = document.getElementById('consult-patient-info-placeholder');
        
        if (!patId) {
            sessionStorage.removeItem('hc_active_appt_consult');
            if (summary) summary.classList.add('d-none');
            document.querySelectorAll('.consult-active-fields').forEach(el => el.classList.add('d-none'));
            if (placeholder) placeholder.classList.remove('d-none');
            return;
        }

        // Auto-associate the confirmed appointment for this patient with this doctor
        const activeUser = AuthService.getCurrentUser();
        const docId = activeUser ? activeUser.doctorId : null;
        const appointments = getDB('appointments');
        const activeAppt = appointments.find(a => a.patientId === patId && a.doctorId === docId && a.status === 'confirmed');
        if (activeAppt) {
            sessionStorage.setItem('hc_active_appt_consult', activeAppt.id || activeAppt.appt_id);
        } else {
            sessionStorage.removeItem('hc_active_appt_consult');
        }

        const patient = patients.find(p => p.id === patId);
        if (patient) {
            document.getElementById('consult-info-name').innerText = patient.name;
            document.getElementById('consult-info-id').innerText = patient.id;
            document.getElementById('consult-info-age').innerText = new Date().getFullYear() - new Date(patient.dob).getFullYear();
            document.getElementById('consult-info-gender').innerText = patient.gender;
            
            const bloodEl = document.getElementById('consult-info-blood');
            if (bloodEl) bloodEl.innerText = patient.bloodGroup;
            
            const phoneEl = document.getElementById('consult-info-phone');
            if (phoneEl) phoneEl.innerText = patient.phone;
            
            const allergyEl = document.getElementById('consult-info-allergies');
            if (allergyEl) {
                allergyEl.innerText = patient.allergies || 'None';
                if (!patient.allergies || patient.allergies.toLowerCase() === 'none') {
                    allergyEl.className = 'badge bg-success text-white font-size-xs';
                } else {
                    allergyEl.className = 'badge bg-danger text-white font-size-xs';
                }
            }

            const avatarEl = document.getElementById('consult-summary-avatar');
            if (avatarEl) avatarEl.innerText = patient.name.split(' ').map(n=>n[0]).join('');

            if (summary) summary.classList.remove('d-none');
            document.querySelectorAll('.consult-active-fields').forEach(el => el.classList.remove('d-none'));
            if (placeholder) placeholder.classList.add('d-none');

            // Render past medical history reference
            const historyList = document.getElementById('consult-history-list');
            if (historyList) {
                if (patient.medicalHistory && patient.medicalHistory.length > 0) {
                    historyList.innerHTML = patient.medicalHistory.map(h => `
                        <div class="p-2 mb-2 bg-light rounded border font-size-xs text-dark">
                            <div class="d-flex justify-content-between mb-1 font-size-xxs text-muted">
                                <strong>Date: ${h.date}</strong>
                                <span>Doctor: ${h.diagnosedBy}</span>
                            </div>
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="fw-bold text-primary">${h.condition}</span>
                                <span class="badge ${h.status === 'Recovered' ? 'bg-success text-white' : 'bg-warning text-dark'} font-size-xxs">${h.status}</span>
                            </div>
                        </div>
                    `).join('');
                } else {
                    historyList.innerHTML = `<p class="text-muted font-size-xs mb-0">No past visits/conditions recorded.</p>`;
                }
            }

            // Pre-populate a blank medication row so inputs are immediately available to fill
            const medRowsContainer = document.getElementById('consult-med-rows');
            if (medRowsContainer) {
                medRowsContainer.innerHTML = '';
                addPrescriptionRowToConsult();
            }

            // Stepper Initialization
            if (typeof changeConsultStep === 'function') {
                changeConsultStep(1);
            }

            // Track input fields for real-time checklist update
            const fieldsToTrack = ['consult-sys', 'consult-dia', 'consult-hr', 'consult-diagnosis', 'consult-order-lab', 'consult-followup-check'];
            fieldsToTrack.forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    el.addEventListener('input', () => { if (typeof updateConsultChecklist === 'function') updateConsultChecklist(); });
                    el.addEventListener('change', () => { if (typeof updateConsultChecklist === 'function') updateConsultChecklist(); });
                }
            });
        }
    });
}

window.startConsultation = function (patientId, appointmentId = null) {
    document.querySelector('[data-panel="panel-consultation"]').click();
    const patSelect = document.getElementById('consult-patient-select');
    if (patSelect) {
        patSelect.value = patientId;
        patSelect.dispatchEvent(new Event('change'));
    }
    if (appointmentId) {
        sessionStorage.setItem('hc_active_appt_consult', appointmentId);
    }
};

function checkNoMedsPlaceholder() {
    const list = document.getElementById('consult-med-rows');
    if (!list) return;
    const rows = list.querySelectorAll('.prescription-item-row');
    let placeholder = document.getElementById('no-meds-placeholder');
    
    if (rows.length === 0) {
        if (!placeholder) {
            placeholder = document.createElement('div');
            placeholder.id = 'no-meds-placeholder';
            placeholder.className = 'text-center py-4 text-muted font-size-xs';
            placeholder.innerHTML = `
                <i class="fa-solid fa-pills fs-3 text-secondary mb-2 d-block text-success" style="opacity: 0.7;"></i>
                No medications prescribed yet. Click "Add Med" to begin.
            `;
            list.appendChild(placeholder);
        }
    } else {
        if (placeholder) {
            placeholder.remove();
        }
    }
}

function addPrescriptionRowToConsult() {
    const list = document.getElementById('consult-med-rows');
    if (!list) return;

    // Remove placeholder if present
    const placeholder = document.getElementById('no-meds-placeholder');
    if (placeholder) placeholder.remove();

    const card = document.createElement('div');
    card.className = 'prescription-item-row card border border-1 p-3 mb-3 animate-slide-up rounded-3 shadow-sm bg-white';
    card.style.borderLeft = '4px solid #10b981'; // Vibrant Emerald Green
    card.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
            <span class="fw-bold text-success font-size-sm"><i class="fa-solid fa-pills me-2"></i>Medication Item</span>
            <button type="button" class="btn btn-xs btn-outline-danger border-0 font-size-xxs py-1 px-2 rounded-2" onclick="this.closest('.prescription-item-row').remove(); checkNoMedsPlaceholder();">
                <i class="fa-solid fa-trash-can me-1"></i>Remove
            </button>
        </div>
        <div class="row g-2">
            <div class="col-md-6 col-12">
                <label class="form-label font-size-xxs text-secondary mb-1 fw-semibold text-uppercase" style="letter-spacing:0.5px;">Medication Name *</label>
                <input type="text" class="form-control form-control-sm med-name" placeholder="e.g. Lisinopril 10mg" style="border-radius:6px; border:1px solid #cbd5e1;">
            </div>
            <div class="col-md-6 col-12">
                <label class="form-label font-size-xxs text-secondary mb-1 fw-semibold text-uppercase" style="letter-spacing:0.5px;">Dosage *</label>
                <input type="text" class="form-control form-control-sm med-dose" placeholder="e.g. 1 tablet" style="border-radius:6px; border:1px solid #cbd5e1;">
            </div>
            <div class="col-md-4 col-6 mt-2">
                <label class="form-label font-size-xxs text-secondary mb-1 fw-semibold text-uppercase" style="letter-spacing:0.5px;">Frequency *</label>
                <input type="text" class="form-control form-control-sm med-freq" placeholder="e.g. Once daily" style="border-radius:6px; border:1px solid #cbd5e1;">
            </div>
            <div class="col-md-4 col-6 mt-2">
                <label class="form-label font-size-xxs text-secondary mb-1 fw-semibold text-uppercase" style="letter-spacing:0.5px;">Duration *</label>
                <input type="text" class="form-control form-control-sm med-duration" placeholder="e.g. 30 days" style="border-radius:6px; border:1px solid #cbd5e1;">
            </div>
            <div class="col-md-4 col-12 mt-2">
                <label class="form-label font-size-xxs text-secondary mb-1 fw-semibold text-uppercase" style="letter-spacing:0.5px;">Route *</label>
                <input type="text" class="form-control form-control-sm med-route" placeholder="e.g. Oral" style="border-radius:6px; border:1px solid #cbd5e1;">
            </div>
            <div class="col-12 mt-2">
                <label class="form-label font-size-xxs text-secondary mb-1 fw-semibold text-uppercase" style="letter-spacing:0.5px;">Notes / Special Instructions</label>
                <input type="text" class="form-control form-control-sm med-notes" placeholder="e.g. Take in morning with water" style="border-radius:6px; border:1px solid #cbd5e1;">
            </div>
        </div>`;
    list.appendChild(card);
}

async function submitDoctorConsultation(doctor) {
    try {
        const patientId = document.getElementById('consult-patient-select').value;
        if (!patientId) {
            Toast.warning('Please choose a patient.');
            return;
        }

        const bpSystolicVal = document.getElementById('consult-sys').value;
        const bpDiastolicVal = document.getElementById('consult-dia').value;
        const heartRateVal = document.getElementById('consult-hr').value;

        const bpSystolic = bpSystolicVal ? parseInt(bpSystolicVal) : 120;
        const bpDiastolic = bpDiastolicVal ? parseInt(bpDiastolicVal) : 80;
        const heartRate = heartRateVal ? parseInt(heartRateVal) : 72;
        const temp = parseFloat(document.getElementById('consult-temp').value) || 98.6;
        const weight = parseFloat(document.getElementById('consult-weight').value) || 70;

        const diagnosis = document.getElementById('consult-diagnosis').value;
        const clinicalNotes = document.getElementById('consult-notes').value;
        const symptomsNotes = document.getElementById('consult-symptoms').value;

        const requestLabTest = document.getElementById('consult-order-lab').checked;
        const labTestName = document.getElementById('consult-lab-name').value;
        const labTestCategory = document.getElementById('consult-lab-cat').value;

        const followupCheck = document.getElementById('consult-followup-check').checked;
        const followupDate = document.getElementById('consult-followup-date').value;
        const followupTime = document.getElementById('consult-followup-time').value;

        if (!diagnosis || !diagnosis.trim()) {
            Toast.warning("Please enter a Diagnosis details.");
            return;
        }

        const patient = getDB('patients').find(p => p.id === patientId);
        if (!patient) {
            Toast.error("Patient profile not found in database cache.");
            return;
        }

        const todayStr = new Date().toISOString().split('T')[0];

        const payload = {
            id: 'con-' + Date.now(),
            patientId: patientId,
            doctorName: doctor.name,
            diagnosis: diagnosis,
            consultationDate: todayStr,
            symptoms: symptomsNotes || 'N/A',
            recommendations: clinicalNotes || 'N/A',
            vitals: {
                bpSystolic,
                bpDiastolic,
                heartRate,
                temp,
                weight
            }
        };

        // Validate and gather medications
        const medRows = document.querySelectorAll('.prescription-item-row');
        if (medRows.length > 0) {
            const medicines = [];
            for (let i = 0; i < medRows.length; i++) {
                const row = medRows[i];
                const name = row.querySelector('.med-name').value.trim();
                const dosage = row.querySelector('.med-dose').value.trim();
                const frequency = row.querySelector('.med-freq').value.trim();
                const duration = row.querySelector('.med-duration').value.trim();
                const route = row.querySelector('.med-route').value.trim();
                const notesVal = row.querySelector('.med-notes').value.trim() || 'Take as directed';

                if (!name && !dosage && !frequency && !duration && !route) {
                    // Completely blank row, skip it
                    continue;
                }

                if (!name || !dosage || !frequency || !duration || !route) {
                    Toast.warning("Please fill out all required medication fields (Name, Dosage, Frequency, Duration, Route).");
                    return;
                }

                medicines.push({
                    name,
                    dosage,
                    frequency,
                    duration,
                    route,
                    instructions: notesVal,
                    notes: notesVal
                });
            }

            if (medicines.length > 0) {
                payload.prescription = {
                    id: 'rx-' + Date.now(),
                    medicines: medicines
                };
            }
        }

        // Validate and gather lab requests
        if (requestLabTest) {
            if (!labTestName || !labTestName.trim()) {
                Toast.warning("Please provide a Lab Test Name.");
                return;
            }
            payload.labRequest = {
                id: 'lab-' + Date.now(),
                testCategory: labTestCategory,
                testName: labTestName.trim(),
                priority: 'Medium'
            };
        }

        // Follow-up scheduling details
        if (followupCheck && followupDate) {
            payload.followup = {
                id: 'appt-' + (getDB('appointments').length + Date.now()),
                date: followupDate,
                timeSlot: followupTime
            };
        }

        // Current active appointment ID to complete
        const activeApptId = sessionStorage.getItem('hc_active_appt_consult');
        if (activeApptId) {
            payload.appointmentId = activeApptId;
        }

        // Submit unified request (creates consultation, vitals, medical history, visit, prescription, lab request, completes appointment, schedules follow-up)
        await ApiService.createConsultation(payload);
        sessionStorage.removeItem('hc_active_appt_consult');

        Toast.success('Consultation completed successfully! EHR updated.');
        document.getElementById('doctor-consult-form').reset();
        document.getElementById('consult-med-rows').innerHTML = '';
        checkNoMedsPlaceholder();
        if (typeof changeConsultStep === 'function') {
            changeConsultStep(1);
        }
        
        // Hide summary cards
        const summary = document.getElementById('consult-patient-summary');
        if (summary) summary.classList.add('d-none');
        document.querySelectorAll('.consult-active-fields').forEach(el => el.classList.add('d-none'));
        const placeholder = document.getElementById('consult-patient-info-placeholder');
        if (placeholder) placeholder.classList.remove('d-none');

        // Hide toggleable panels
        const followupInputs = document.getElementById('consult-followup-inputs');
        if (followupInputs) followupInputs.classList.add('d-none');
        const labInputs = document.getElementById('consult-lab-inputs');
        if (labInputs) labInputs.classList.add('d-none');

        // Refresh views
        renderDoctorDashboard(doctor);
        renderDoctorCalendarWorkspace(doctor);
        renderDoctorAnalytics(doctor);
        document.querySelector('[data-panel="panel-dashboard"]').click();
    } catch (err) {
        console.error("Critical error in submitDoctorConsultation:", err);
        alert("Failed to submit consultation:\n\n" + err.stack);
    }
}
window.setupDoctorPatientDirectoryFilters = function () {
    const searchInput = document.getElementById('patient-search');
    const genderSelect = document.getElementById('patient-filter-gender');
    const bloodSelect = document.getElementById('patient-filter-blood');
    const viewGridBtn = document.getElementById('btn-patient-grid');
    const viewListBtn = document.getElementById('btn-patient-list');

    if (searchInput) {
        searchInput.addEventListener('input', renderDoctorPatientDirectory);
    }
    if (genderSelect) {
        genderSelect.addEventListener('change', renderDoctorPatientDirectory);
    }
    if (bloodSelect) {
        bloodSelect.addEventListener('change', renderDoctorPatientDirectory);
    }
    if (viewGridBtn) {
        viewGridBtn.addEventListener('click', () => {
            patientDirectoryView = 'grid';
            viewGridBtn.classList.add('active');
            if (viewListBtn) viewListBtn.classList.remove('active');
            renderDoctorPatientDirectory();
        });
    }
    if (viewListBtn) {
        viewListBtn.addEventListener('click', () => {
            patientDirectoryView = 'list';
            viewListBtn.classList.add('active');
            if (viewGridBtn) viewGridBtn.classList.remove('active');
            renderDoctorPatientDirectory();
        });
    }
};

function renderDoctorPatientDirectory() {
    const gridView = document.getElementById('patient-grid-view');
    const listView = document.getElementById('patient-list-view');
    const tableBody = document.getElementById('doctor-patients-list-table');
    
    if (!gridView || !listView || !tableBody) return;

    const query = (document.getElementById('patient-search')?.value || '').toLowerCase();
    const genderFilter = document.getElementById('patient-filter-gender')?.value || '';
    const bloodFilter = document.getElementById('patient-filter-blood')?.value || '';

    const patients = getDB('patients');
    const visits = getDB('visits');

    // Filter patients
    const filtered = patients.filter(p => {
        const patVisits = visits.filter(v => v.patientId === p.id);
        const matchesHistory = (p.medicalHistory || []).some(h => 
            h.condition.toLowerCase().includes(query) || 
            h.diagnosedBy.toLowerCase().includes(query)
        );
        const matchesVisits = patVisits.some(v => 
            v.department.toLowerCase().includes(query) || 
            v.reason.toLowerCase().includes(query)
        );
        
        const matchesQuery = p.id.toLowerCase().includes(query) || 
                             p.name.toLowerCase().includes(query) || 
                             (p.allergies || '').toLowerCase().includes(query) || 
                             matchesHistory || 
                             matchesVisits;

        const matchesGender = genderFilter === '' || p.gender === genderFilter;
        const matchesBlood = bloodFilter === '' || p.bloodGroup === bloodFilter;
        return matchesQuery && matchesGender && matchesBlood;
    });

    if (patientDirectoryView === 'grid') {
        gridView.classList.remove('d-none');
        listView.classList.add('d-none');
        
        if (filtered.length === 0) {
            gridView.innerHTML = `<div class="col-12 text-center text-muted py-5">No patient records found.</div>`;
            return;
        }

        gridView.innerHTML = filtered.map(p => {
            const patVisits = visits.filter(v => v.patientId === p.id);
            patVisits.sort((a, b) => new Date(b.date) - new Date(a.date));
            const lastVisit = patVisits[0];
            const lastVisitText = lastVisit ? `${lastVisit.date} (${lastVisit.department})` : 'None';

            const activeConditions = (p.medicalHistory || []).filter(h => h.status !== 'Recovered');
            const statusText = activeConditions.length > 0 ? 'Active Care' : 'Stable';
            const statusClass = activeConditions.length > 0 ? 'bg-warning text-dark' : 'bg-success text-white';

            const initials = p.name.split(' ').map(n=>n[0]).join('');

            return `
                <div class="col-md-4 col-sm-6 animate-fade-in">
                    <div class="hc-card p-3 d-flex flex-column h-100 border border-light shadow-sm hover-shadow">
                        <div class="d-flex align-items-center gap-3 mb-3">
                            <div class="patient-avatar font-size-lg fw-bold text-primary bg-primary-subtle d-flex align-items-center justify-content-center" style="width: 50px; height: 50px; border-radius: 50%;">
                                ${initials}
                            </div>
                            <div>
                                <h6 class="fw-bold mb-0 text-dark">${p.name}</h6>
                                <span class="text-muted font-size-xs">ID: ${p.id}</span>
                            </div>
                        </div>
                        <div class="flex-grow-1 font-size-xs text-muted mb-3">
                            <div class="d-flex justify-content-between mb-1">
                                <span>Gender / Blood:</span>
                                <strong class="text-dark">${p.gender} / <span class="badge bg-secondary font-size-xxs">${p.bloodGroup}</span></strong>
                            </div>
                            <div class="d-flex justify-content-between mb-1">
                                <span>Phone:</span>
                                <strong class="text-dark">${p.phone}</strong>
                            </div>
                            <div class="d-flex justify-content-between mb-1">
                                <span>Last Visit:</span>
                                <strong class="text-dark font-size-xxs">${lastVisitText}</strong>
                            </div>
                            <div class="d-flex justify-content-between mb-1">
                                <span>Status:</span>
                                <span class="badge ${statusClass} font-size-xxs">${statusText}</span>
                            </div>
                            <div class="mt-2 text-danger">
                                <i class="fa-solid fa-triangle-exclamation me-1"></i>Allergies: <span class="badge bg-danger-subtle text-danger font-size-xxs">${p.allergies || 'None'}</span>
                            </div>
                        </div>
                        <div class="d-flex gap-2 mt-auto">
                            <button class="btn btn-xs btn-hc-primary flex-grow-1" onclick="startConsultation('${p.id}')">Consult</button>
                            <button class="btn btn-xs btn-outline-primary" onclick="viewPatientEHR('${p.id}')">EHR</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

    } else {
        listView.classList.remove('d-none');
        gridView.classList.add('d-none');

        if (filtered.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="8" class="text-center text-muted py-5">No patient records found.</td></tr>`;
            return;
        }

        tableBody.innerHTML = filtered.map(p => {
            const patVisits = visits.filter(v => v.patientId === p.id);
            patVisits.sort((a, b) => new Date(b.date) - new Date(a.date));
            const lastVisit = patVisits[0];
            const lastVisitText = lastVisit ? lastVisit.date : 'None';

            const activeConditions = (p.medicalHistory || []).filter(h => h.status !== 'Recovered');
            const statusText = activeConditions.length > 0 ? 'Active Care' : 'Stable';
            const statusClass = activeConditions.length > 0 ? 'bg-warning text-dark' : 'bg-success text-white';

            return `
                <tr>
                    <td><strong>${p.id}</strong></td>
                    <td>${p.name}</td>
                    <td>${p.gender}</td>
                    <td><span class="badge bg-secondary">${p.bloodGroup}</span></td>
                    <td>${p.phone}</td>
                    <td>${lastVisitText}</td>
                    <td><span class="badge ${statusClass} font-size-xxs">${statusText}</span></td>
                    <td>
                        <div class="d-flex gap-2">
                            <button class="btn btn-xs btn-hc-primary" onclick="startConsultation('${p.id}')">Consult</button>
                            <button class="btn btn-xs btn-outline-primary" onclick="viewPatientEHR('${p.id}')">EHR</button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }
}

// EHR Patient Modal Details & Trends
let modalVitalsChart = null;
window.viewPatientEHR = function (patientId) {
    const patients = getDB('patients');
    const patient = patients.find(p => p.id === patientId);
    if (!patient) return;

    document.getElementById('ehr-p-name').innerText = patient.name;
    document.getElementById('ehr-p-dob').innerText = patient.dob;
    document.getElementById('ehr-p-gender').innerText = patient.gender;
    document.getElementById('ehr-p-blood').innerText = patient.bloodGroup;
    document.getElementById('ehr-p-phone').innerText = patient.phone;
    document.getElementById('ehr-p-allergies').innerText = patient.allergies || 'None';

    // Populate timeline list
    const timeline = document.getElementById('doctor-p-timeline');
    timeline.innerHTML = '';
    if (patient.medicalHistory && patient.medicalHistory.length > 0) {
        patient.medicalHistory.forEach(h => {
            timeline.innerHTML += `
            <div class="timeline-event">
                <div class="timeline-date font-size-xs text-primary">${h.date}</div>
                <div class="timeline-card py-2 px-3">
                    <h6 class="timeline-title font-size-sm fw-bold mb-1">${h.condition}</h6>
                    <p class="text-muted font-size-xs mb-0">Diagnosed by: ${h.diagnosedBy} | Status: <span class="badge bg-success font-size-xxs">Active</span></p>
                </div>
            </div>`;
        });
    } else {
        timeline.innerHTML = '<p class="text-muted font-size-xs">No clinical diagnoses recorded.</p>';
    }

    // Populate prescriptions
    const rxList = document.getElementById('doctor-p-rx-list');
    rxList.innerHTML = '';
    const prescriptions = getDB('prescriptions').filter(p => p.patientId === patientId);
    if (prescriptions.length > 0) {
        prescriptions.forEach(rx => {
            rx.medicines.forEach(m => {
                rxList.innerHTML += `
                <tr>
                    <td>${rx.date}</td>
                    <td><strong>${m.name}</strong></td>
                    <td>${m.dosage}</td>
                    <td>${m.frequency || 'N/A'}</td>
                    <td>${m.duration}</td>
                    <td>${m.route || 'N/A'}</td>
                </tr>`;
            });
        });
    } else {
        rxList.innerHTML = '<tr><td colspan="6" class="text-center text-muted font-size-xs">No active prescriptions.</td></tr>';
    }

    // Populate laboratory results
    const labsList = document.getElementById('doctor-p-labs-list');
    labsList.innerHTML = '';
    const labRequests = getDB('lab_requests').filter(l => l.patientId === patientId);
    if (labRequests.length > 0) {
        labRequests.forEach(req => {
            const isCompleted = req.status === 'completed';
            labsList.innerHTML += `
            <tr>
                <td>${req.requestDate}</td>
                <td>${req.testName}</td>
                <td><span class="badge ${isCompleted ? 'bg-success' : 'bg-warning'}">${req.status.toUpperCase()}</span></td>
                <td>
                    ${isCompleted ? `<button class="btn btn-xs btn-outline-primary py-0" onclick="viewLabReportModal('${req.id}')" style="font-size:0.7rem;">View</button>` : '<span class="text-muted font-size-xs">Pending</span>'}
                </td>
            </tr>`;
        });
    } else {
        labsList.innerHTML = '<tr><td colspan="4" class="text-center text-muted font-size-xs">No lab requests order.</td></tr>';
    }

    // Render vital trend history chart inside Modal
    setTimeout(() => {
        const canvas = document.getElementById('doctorPatientVitalsChart');
        if (!canvas) return;
        if (modalVitalsChart) modalVitalsChart.destroy();

        const labels = patient.vitalsHistory.map(v => v.date);
        const sys = patient.vitalsHistory.map(v => v.bpSystolic);
        const dia = patient.vitalsHistory.map(v => v.bpDiastolic);
        const hr = patient.vitalsHistory.map(v => v.heartRate);

        modalVitalsChart = new Chart(canvas, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    { label: 'BP Systolic', data: sys, borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.05)', tension: 0.2 },
                    { label: 'BP Diastolic', data: dia, borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.05)', tension: 0.2 },
                    { label: 'Heart Rate', data: hr, borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.05)', tension: 0.2 }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: false }, x: { grid: { display: false } } }
            }
        });
    }, 200);

    const modal = new bootstrap.Modal(document.getElementById('ehrHistoryModal'));
    modal.show();
};

function renderDoctorCalendarWorkspace(doctor) {
    const grid = document.getElementById('doctor-calendar-grid');
    const labelsGrid = document.getElementById('doctor-calendar-labels');
    if (!grid || !labelsGrid) return;

    const appointments = getDB('appointments');
    
    // Update Upcoming Sidebar
    renderDoctorUpcomingSidebar(doctor);

    // Fetch leaves to block calendar days
    const leaves = getDB('leaves') || [];
    const doctorLeaves = leaves.filter(l => l.doctorId === doctor.id && l.status === 'Approved');

    function isDoctorOnLeave(dateStr) {
        const d = new Date(dateStr);
        return doctorLeaves.some(l => {
            const start = new Date(l.startDate);
            const end = new Date(l.endDate);
            return d >= start && d <= end;
        });
    }

    if (currentCalendarView === 'month') {
        grid.style.gridTemplateColumns = 'repeat(7, 1fr)';
        labelsGrid.style.gridTemplateColumns = 'repeat(7, 1fr)';
        labelsGrid.innerHTML = `
            <div class="calendar-day-label">Mon</div>
            <div class="calendar-day-label">Tue</div>
            <div class="calendar-day-label">Wed</div>
            <div class="calendar-day-label">Thu</div>
            <div class="calendar-day-label">Fri</div>
            <div class="calendar-day-label">Sat</div>
            <div class="calendar-day-label">Sun</div>
        `;

        grid.innerHTML = '';
        const year = currentCalendarDate.getFullYear();
        const month = currentCalendarDate.getMonth();
        
        // Month name display
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        document.getElementById('doctor-calendar-month').innerText = `${monthNames[month]} ${year}`;

        const firstDay = new Date(year, month, 1);
        const startDay = firstDay.getDay(); // 0 is Sun, 1 is Mon...
        const adjustedStart = startDay === 0 ? 6 : startDay - 1;
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Fillers for previous month
        for (let i = 0; i < adjustedStart; i++) {
            grid.innerHTML += `<div class="calendar-cell other-month"></div>`;
        }

        // Days in month
        for (let day = 1; day <= daysInMonth; day++) {
            const currentDayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayAppts = appointments.filter(a => a.doctorId === doctor.id && a.date === currentDayStr);
            const isOnLeave = isDoctorOnLeave(currentDayStr);

            let apptHtml = '';
            dayAppts.forEach(ap => {
                let colorClass = 'event-checkup';
                if (ap.type === 'Laboratory test' || ap.type === 'Lab Test') colorClass = 'event-lab';
                if (ap.type === 'Emergency') colorClass = 'event-emergency';
                
                apptHtml += `
                    <div class="calendar-event-tag ${colorClass}" draggable="true" data-appt-id="${ap.id}" onclick="startConsultation('${ap.patientId}', '${ap.id}')">
                        ${ap.timeSlot} | ${ap.patientId}
                    </div>
                `;
            });

            let leaveBadge = '';
            let leaveClass = '';
            if (isOnLeave) {
                leaveClass = 'bg-light-gray opacity-75';
                leaveBadge = `<span class="badge bg-secondary font-size-xxs text-white d-block mt-1">Leave</span>`;
            }

            grid.innerHTML += `
                <div class="calendar-cell ${leaveClass}" data-date="${currentDayStr}">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                        <span class="calendar-date-number">${day}</span>
                        ${isOnLeave ? '' : '<span class="status-step-dot active" style="width: 6px; height: 6px; background-color: #10b981;"></span>'}
                    </div>
                    ${leaveBadge}
                    <div class="calendar-events-container">${apptHtml}</div>
                </div>
            `;
        }
    } else if (currentCalendarView === 'week') {
        grid.style.gridTemplateColumns = 'repeat(7, 1fr)';
        labelsGrid.style.gridTemplateColumns = 'repeat(7, 1fr)';
        labelsGrid.innerHTML = '';
        grid.innerHTML = '';

        const startOfWeek = new Date(currentCalendarDate);
        const dayOfWeek = startOfWeek.getDay(); // 0 is Sun, 1 is Mon...
        const diff = startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        startOfWeek.setDate(diff);

        document.getElementById('doctor-calendar-month').innerText = `Week of ${startOfWeek.toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})}`;

        const weekDates = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(startOfWeek);
            d.setDate(startOfWeek.getDate() + i);
            weekDates.push(d);
            const dayLabel = d.toLocaleDateString(undefined, {weekday: 'short', day: 'numeric'});
            labelsGrid.innerHTML += `<div class="calendar-day-label">${dayLabel}</div>`;
        }

        weekDates.forEach(date => {
            const currentDayStr = date.toISOString().split('T')[0];
            const dayAppts = appointments.filter(a => a.doctorId === doctor.id && a.date === currentDayStr);
            const isOnLeave = isDoctorOnLeave(currentDayStr);

            let apptHtml = '';
            dayAppts.forEach(ap => {
                let colorClass = 'event-checkup';
                if (ap.type === 'Laboratory test' || ap.type === 'Lab Test') colorClass = 'event-lab';
                if (ap.type === 'Emergency') colorClass = 'event-emergency';
                apptHtml += `<div class="calendar-event-tag ${colorClass}" draggable="true" data-appt-id="${ap.id}" onclick="startConsultation('${ap.patientId}', '${ap.id}')">${ap.timeSlot} | ${ap.patientId}</div>`;
            });

            let leaveBadge = '';
            let leaveClass = '';
            if (isOnLeave) {
                leaveClass = 'bg-light-gray opacity-75';
                leaveBadge = `<span class="badge bg-secondary font-size-xxs text-white d-block mb-1">Leave</span>`;
            }

            grid.innerHTML += `
                <div class="calendar-cell ${leaveClass}" data-date="${currentDayStr}" style="min-height: 250px;">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="text-muted font-size-xxs">${date.toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
                        ${isOnLeave ? '' : '<span class="status-step-dot active" style="width: 6px; height: 6px; background-color: #10b981;"></span>'}
                    </div>
                    ${leaveBadge}
                    <div class="calendar-events-container">${apptHtml}</div>
                </div>
            `;
        });
    } else if (currentCalendarView === 'day') {
        labelsGrid.style.gridTemplateColumns = '120px 1fr';
        labelsGrid.innerHTML = `
            <div class="calendar-day-label text-start ps-3">Time Slot</div>
            <div class="calendar-day-label text-start ps-3">Appointment Details</div>
        `;
        grid.style.gridTemplateColumns = '1fr';
        grid.innerHTML = '';

        const currentDayStr = currentCalendarDate.toISOString().split('T')[0];
        document.getElementById('doctor-calendar-month').innerText = currentCalendarDate.toLocaleDateString(undefined, {weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'});

        const dayAppts = appointments.filter(a => a.doctorId === doctor.id && a.date === currentDayStr);
        const isOnLeave = isDoctorOnLeave(currentDayStr);

        if (isOnLeave) {
            grid.innerHTML = `
                <div class="text-center py-5 bg-light rounded border m-3 w-100">
                    <i class="fa-solid fa-plane-departure fs-1 text-muted mb-3 d-block"></i>
                    <p class="text-muted mb-0 fw-bold">You are on Leave / Vacation on this day.</p>
                </div>
            `;
            return;
        }

        const slots = [
            "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
            "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
            "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM"
        ];

        slots.forEach(slot => {
            const slotAppt = dayAppts.find(a => a.timeSlot === slot);
            let contentHtml = '';
            if (slotAppt) {
                let colorClass = 'event-checkup';
                if (slotAppt.type === 'Laboratory test' || slotAppt.type === 'Lab Test') colorClass = 'event-lab';
                if (slotAppt.type === 'Emergency') colorClass = 'event-emergency';
                const patients = getDB('patients');
                const pat = patients.find(p => p.id === slotAppt.patientId);
                
                contentHtml = `
                    <div class="calendar-event-tag ${colorClass} w-100 p-2 font-size-xs" style="height: auto; cursor: grab;" draggable="true" data-appt-id="${slotAppt.id}" onclick="startConsultation('${slotAppt.patientId}', '${slotAppt.id}')">
                        <strong>${pat ? pat.name : 'Unknown'} (${slotAppt.patientId})</strong> - ${slotAppt.symptoms || 'General Consult'}
                    </div>
                `;
            } else {
                contentHtml = `<span class="text-muted font-size-xs">Open Slot (Available)</span>`;
            }
            grid.innerHTML += `
                <div class="d-flex align-items-center border-bottom py-2 calendar-slot-row" data-date="${currentDayStr}" data-slot="${slot}" style="min-height: 60px;">
                    <div class="fw-bold text-secondary font-size-xs" style="width: 120px; padding-left: 15px;">${slot}</div>
                    <div class="flex-grow-1 px-3 d-flex align-items-center calendar-slot-cell" style="min-height: 45px; border-left: 2px solid var(--hc-border);">
                        ${contentHtml}
                    </div>
                </div>
            `;
        });
    }

    // Attach Drag and Drop handlers to the grid
    setupCalendarDragDrop(doctor);
}

async function renderDoctorAnalytics(doctor, timeframe = 'daily') {
    let totalConsults = getDB('prescriptions').filter(p => p.doctorName === doctor.name).length;
    let patients = getDB('patients').length;
    let labsOrdered = getDB('lab_requests').filter(l => l.doctorName === doctor.name).length;

    // Timeframe filters for consultations chart
    let chartLabels = [];
    let chartData = [];

    if (timeframe === 'daily') {
        chartLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        chartData = [5, 8, 12, 7, 10, 4, 1];
    } else if (timeframe === 'weekly') {
        chartLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        chartData = [24, 32, 28, 35];
    } else {
        // Monthly
        chartLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        chartData = [65, 82, 95, 78, 90, totalConsults + 10];
    }

    if (!ApiService.useMock) {
        try {
            const data = await ApiService.getDoctorAnalytics();
            totalConsults = data.totalConsultations;
            patients = data.totalPatients;
            if (timeframe === 'daily' && data.dailyLoad) {
                chartData = data.dailyLoad;
            } else if (timeframe === 'weekly' && data.weeklyLoad) {
                chartData = data.weeklyLoad;
            } else if (timeframe === 'monthly' && data.monthlyLoad) {
                chartData = data.monthlyLoad;
            }
        } catch (err) {
            console.error("Failed to fetch doctor analytics from server:", err);
        }
    }

    const elTotal = document.getElementById('doc-stat-total-consults');
    const elUnique = document.getElementById('doc-stat-unique-patients');
    const elLabs = document.getElementById('doc-labs-ordered');

    if (elTotal) elTotal.innerText = totalConsults;
    if (elUnique) elUnique.innerText = patients;
    if (elLabs) elLabs.innerText = labsOrdered;

    // 1. Consultations Volume Chart
    const canvas = document.getElementById('doctorConsultsChart');
    if (canvas) {
        if (doctorConsultsChartInstance) doctorConsultsChartInstance.destroy();
        doctorConsultsChartInstance = new Chart(canvas, {
            type: timeframe === 'monthly' ? 'line' : 'bar',
            data: {
                labels: chartLabels,
                datasets: [{
                    label: 'Consultation Load',
                    data: chartData,
                    backgroundColor: timeframe === 'monthly' ? 'rgba(59, 130, 246, 0.2)' : '#3b82f6',
                    borderColor: '#3b82f6',
                    borderWidth: 2.5,
                    fill: true,
                    borderRadius: timeframe === 'monthly' ? 0 : 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: { y: { beginAtZero: true }, x: { grid: { display: false } } }
            }
        });
    }

    // 2. Patient Demographics Doughnut Chart
    const demoCanvas = document.getElementById('doctorDemographicsChart');
    if (demoCanvas) {
        const patientsList = getDB('patients') || [];
        let under18 = 0, youngAdult = 0, adult = 0, senior = 0;
        patientsList.forEach(p => {
            const age = new Date().getFullYear() - new Date(p.dob).getFullYear();
            if (age < 18) under18++;
            else if (age <= 35) youngAdult++;
            else if (age <= 55) adult++;
            else senior++;
        });
        
        // Fallback default values
        if (under18 + youngAdult + adult + senior === 0) {
            under18 = 2; youngAdult = 8; adult = 6; senior = 4;
        }

        if (doctorDemographicsChartInstance) doctorDemographicsChartInstance.destroy();
        doctorDemographicsChartInstance = new Chart(demoCanvas, {
            type: 'doughnut',
            data: {
                labels: ['< 18', '18-35', '36-55', '55+'],
                datasets: [{
                    data: [under18, youngAdult, adult, senior],
                    backgroundColor: ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            boxWidth: 10,
                            font: { size: 9 }
                        }
                    }
                },
                cutout: '65%'
            }
        });
    }
}


// --- LAB DASHBOARD WORKFLOWS ---
let laboraxOrdersChartInstance = null;
let laboraxStatusChartInstance = null;

function initLabPortal(labUser) {
    document.getElementById('user-display-name').innerText = labUser.name;
    document.getElementById('avatar-letters').innerText = labUser.name.split(' ').map(n=>n[0]).join('');

    renderLabRequests();
    renderLabDashboardCharts();
    setupLabWalkinSelectors();
    updateLabTechStats();

    if (window.renderWalkinQueue) window.renderWalkinQueue();
    if (window.renderSpecimenQueue) window.renderSpecimenQueue();

    // Register search input filter
    const searchInput = document.getElementById('lab-search-input');
    if (searchInput) {
        searchInput.addEventListener('input', renderLabRequests);
    }

    // Results Submitter
    const labEntryForm = document.getElementById('lab-entry-form');
    if (labEntryForm) {
        labEntryForm.replaceWith(labEntryForm.cloneNode(true));
        document.getElementById('lab-entry-form').addEventListener('submit', function (e) {
            e.preventDefault();
            submitLabResults(labUser);
        });
    }

    // Walk-in requests Form
    const walkinForm = document.getElementById('lab-walkin-form');
    if (walkinForm) {
        walkinForm.replaceWith(walkinForm.cloneNode(true));
        document.getElementById('lab-walkin-form').addEventListener('submit', function (e) {
            e.preventDefault();
            submitLabWalkin();
        });
    }

    // Modal Patient Register Form
    const modalPatForm = document.getElementById('modal-patient-register-form');
    if (modalPatForm) {
        modalPatForm.replaceWith(modalPatForm.cloneNode(true));
        document.getElementById('modal-patient-register-form').addEventListener('submit', async function (e) {
            e.preventDefault();
            const name = document.getElementById('modal-pat-name').value;
            const email = document.getElementById('modal-pat-email').value;
            const dob = document.getElementById('modal-pat-dob').value;
            const gender = document.getElementById('modal-pat-gender').value;
            const blood = document.getElementById('modal-pat-blood').value;
            const phone = document.getElementById('modal-pat-phone').value;
            const allergies = document.getElementById('modal-pat-allergies').value || 'None';
            const emergencyName = document.getElementById('modal-pat-emergency-name').value;
            const emergencyPhone = document.getElementById('modal-pat-emergency-phone').value;
            
            try {
                // Register patient
                const res = await AuthService.register(name, email, 'password123', 'patient', {
                    dob, gender, bloodGroup: blood, phone, allergies, emergencyName, emergencyPhone
                });
                
                Toast.success('Walk-In Patient registered successfully!');
                
                // Hide modal
                const modalEl = document.getElementById('registerPatientModal');
                const modal = bootstrap.Modal.getInstance(modalEl);
                if (modal) modal.hide();
                
                document.getElementById('modal-patient-register-form').reset();
                
                // Refresh selectors
                setupLabWalkinSelectors();
                
                // Select new patient
                const patients = getDB('patients');
                const newPat = patients.find(p => p.email === email);
                if (newPat) {
                    document.getElementById('walkin-patient').value = newPat.id;
                }
            } catch (err) {
                Toast.error('Failed to register patient: ' + err.message);
            }
        });
    }

    // Dropzone setup
    setupLabFileUploader();
}

window.activeLabTab = 'pending';

window.filterLabOrders = function(status) {
    window.activeLabTab = status;
    document.querySelectorAll('#lab-orders-tabs .nav-link').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeBtn = document.getElementById(`tab-${status}-btn`);
    if (activeBtn) activeBtn.classList.add('active');
    
    renderLabRequests();
};

window.scanBarcode = function(reqId) {
    let requests = getDB('lab_requests') || [];
    let req = requests.find(r => r.id === reqId);
    if (req) {
        let oldStatus = req.status;
        let newStatus = '';
        if (oldStatus === 'pending') {
            newStatus = 'registered';
            Toast.success(`Barcode scanned: Order accepted/registered for ${reqId}!`);
        } else if (oldStatus === 'registered' || oldStatus === 'accepted') {
            newStatus = 'sample_collected';
            Toast.success(`Barcode scanned: Specimen collected for ${reqId}!`);
        } else if (oldStatus === 'sample_collected') {
            newStatus = 'sample_received';
            Toast.success(`Barcode scanned: Specimen received/checked-in at processing lab for ${reqId}.`);
        } else if (oldStatus === 'sample_received') {
            newStatus = 'processing';
            Toast.success(`Barcode scanned: Analyzer processing started for ${reqId}.`);
        } else if (oldStatus === 'processing') {
            newStatus = 'results_ready';
            Toast.success(`Barcode scanned: Analyzer compile completed. Results ready for ${reqId}.`);
        } else if (oldStatus === 'results_ready') {
            Toast.info(`Results are ready. Please fill in parameter values in the Results tab to verify and release.`);
            return;
        } else if (oldStatus === 'completed') {
            Toast.info(`Lab Report ${reqId} has already been completed.`);
            return;
        }
        
        if (newStatus) {
            req.status = newStatus;
            setDB('lab_requests', requests);
            renderLabRequests();
            window.renderSpecimenQueue();
            if (typeof renderLabDashboardCharts === 'function') {
                renderLabDashboardCharts();
            }
        }
    }
};

function renderLabRequests() {
    const requests = getDB('lab_requests') || [];
    const pendingList = document.getElementById('lab-pending-requests');
    const completedList = document.getElementById('lab-completed-requests');

    if (!window.activeLabTab) window.activeLabTab = 'pending';

    // Segment based on active sub-tab
    let filtered = [];
    if (window.activeLabTab === 'pending') {
        filtered = requests.filter(r => r.status === 'pending');
    } else if (window.activeLabTab === 'accepted') {
        filtered = requests.filter(r => r.status === 'registered' || r.status === 'accepted');
    } else if (window.activeLabTab === 'sample_collection') {
        filtered = requests.filter(r => r.status === 'sample_collected');
    } else if (window.activeLabTab === 'sample_received') {
        filtered = requests.filter(r => r.status === 'sample_received');
    } else if (window.activeLabTab === 'in_progress') {
        filtered = requests.filter(r => r.status === 'processing');
    } else if (window.activeLabTab === 'awaiting_verification') {
        filtered = requests.filter(r => r.status === 'results_ready');
    } else if (window.activeLabTab === 'completed') {
        filtered = requests.filter(r => r.status === 'completed');
    } else if (window.activeLabTab === 'critical') {
        filtered = requests.filter(r => r.priority === 'Critical' && r.status !== 'completed');
    } else if (window.activeLabTab === 'urgent') {
        filtered = requests.filter(r => (r.priority === 'High' || r.priority === 'Critical') && r.status !== 'completed');
    }

    // Apply Search query filter
    const searchInput = document.getElementById('lab-search-input');
    const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : '';
    if (searchQuery) {
        filtered = filtered.filter(r => {
            const testName = String(r.testName || '').toLowerCase();
            const patId = String(r.patientId || '').toLowerCase();
            const reqId = String(r.id || '').toLowerCase();
            return testName.includes(searchQuery) || patId.includes(searchQuery) || reqId.includes(searchQuery);
        });
    }

    if (document.getElementById('lab-stat-pending')) {
        const totalPending = requests.filter(r => r.status !== 'completed').length;
        document.getElementById('lab-stat-pending').innerText = `${totalPending} pending requests`;
    }

    if (pendingList) {
        if (filtered.length === 0) {
            pendingList.innerHTML = `<tr><td colspan="8" class="text-center text-muted font-size-xs p-4">No orders found in this workspace filter.</td></tr>`;
        } else {
            let html = '';
            filtered.forEach(p => {
                let priorityClass = 'badge-low';
                if (p.priority === 'Critical') priorityClass = 'badge-critical';
                if (p.priority === 'High') priorityClass = 'badge-high';
                if (p.priority === 'Medium') priorityClass = 'badge-medium';

                let statusBadge = '';
                let actionBtn = '';

                if (p.status === 'pending') {
                    statusBadge = `<span class="badge bg-warning text-dark font-size-xxs py-1 px-2">PENDING</span>`;
                    actionBtn = `<button class="btn btn-xs btn-primary text-white" onclick="advanceLabStatus('${p.id}', 'registered')"><i class="fa-solid fa-check me-1"></i>Accept</button>`;
                } else if (p.status === 'registered' || p.status === 'accepted') {
                    statusBadge = `<span class="badge bg-info text-white font-size-xxs py-1 px-2">ACCEPTED</span>`;
                    actionBtn = `<button class="btn btn-xs btn-success text-white" onclick="advanceLabStatus('${p.id}', 'sample_collected')"><i class="fa-solid fa-vial me-1"></i>Collect Sample</button>`;
                } else if (p.status === 'sample_collected') {
                    statusBadge = `<span class="badge bg-primary text-white font-size-xxs py-1 px-2">SAMPLE COLLECTED</span>`;
                    actionBtn = `<button class="btn btn-xs btn-warning text-dark" onclick="advanceLabStatus('${p.id}', 'processing')"><i class="fa-solid fa-gear me-1"></i>Start Process</button>`;
                } else if (p.status === 'processing') {
                    statusBadge = `<span class="badge text-white font-size-xxs py-1 px-2" style="background-color: #8b5cf6;">PROCESSING</span>`;
                    actionBtn = `<button class="btn btn-xs btn-hc-secondary text-white" onclick="enterLabResults('${p.id}')"><i class="fa-solid fa-edit me-1"></i>Enter Results</button>`;
                } else if (p.status === 'results_ready') {
                    statusBadge = `<span class="badge bg-danger text-white font-size-xxs py-1 px-2">RESULTS READY</span>`;
                    actionBtn = `<button class="btn btn-xs btn-hc-secondary text-white" onclick="enterLabResults('${p.id}')"><i class="fa-solid fa-file-shield me-1"></i>Compile & Authorize</button>`;
                } else if (p.status === 'completed') {
                    statusBadge = `<span class="badge bg-success text-white font-size-xxs py-1 px-2">COMPLETED</span>`;
                    actionBtn = `<button class="btn btn-xs btn-outline-primary" onclick="viewLabReportModal('${p.id}')"><i class="fa-solid fa-file-invoice me-1"></i> View Report</button>`;
                } else {
                    statusBadge = `<span class="badge bg-secondary text-white font-size-xxs py-1 px-2">${p.status.toUpperCase()}</span>`;
                    actionBtn = `<button class="btn btn-xs btn-hc-secondary text-white" onclick="enterLabResults('${p.id}')"><i class="fa-solid fa-edit me-1"></i>Enter Results</button>`;
                }

                // Barcode simulation SVG graphics
                const barcodeSvg = `
                <div class="d-flex align-items-center gap-1.5" onclick="scanBarcode('${p.id}')" style="cursor:pointer;" title="Click to Scan / Advance status">
                    <svg width="55" height="20">
                        <rect width="55" height="20" fill="#f8fafc" rx="2" stroke="#e2e8f0" stroke-width="0.5"/>
                        <g fill="#0f172a">
                            <rect x="4" y="3" width="1.5" height="14" />
                            <rect x="7" y="3" width="0.7" height="14" />
                            <rect x="9" y="3" width="2" height="14" />
                            <rect x="13" y="3" width="0.7" height="14" />
                            <rect x="15" y="3" width="1.5" height="14" />
                            <rect x="18" y="3" width="2" height="14" />
                            <rect x="22" y="3" width="0.7" height="14" />
                            <rect x="24" y="3" width="1.5" height="14" />
                            <rect x="27" y="3" width="3" height="14" />
                            <rect x="31" y="3" width="0.7" height="14" />
                            <rect x="33" y="3" width="1.5" height="14" />
                            <rect x="36" y="3" width="0.7" height="14" />
                            <rect x="38" y="3" width="2" height="14" />
                            <rect x="42" y="3" width="0.7" height="14" />
                            <rect x="44" y="3" width="1.5" height="14" />
                            <rect x="47" y="3" width="0.7" height="14" />
                            <rect x="49" y="3" width="2" height="14" />
                        </g>
                    </svg>
                    <i class="fa-solid fa-barcode text-muted font-size-xxs"></i>
                </div>`;

                html += `
                <tr>
                    <td><strong>${p.id}</strong></td>
                    <td>
                        <span class="fw-semibold text-dark font-size-xs">${p.patientName}</span>
                        <span class="text-muted font-size-xxs d-block">UID: ${p.patientId}</span>
                    </td>
                    <td>
                        <span class="fw-semibold text-dark font-size-xs">${p.testName}</span>
                        ${p.doctorNotes ? `<span class="text-muted font-size-xxs d-block">Notes: ${p.doctorNotes}</span>` : ''}
                        ${p.appointmentId ? `<span class="text-muted font-size-xxs d-block">Appt ID: ${p.appointmentId}</span>` : ''}
                        ${p.consultationId ? `<span class="text-muted font-size-xxs d-block">Consult ID: ${p.consultationId}</span>` : ''}
                    </td>
                    <td><span class="hc-badge-status ${priorityClass}">${p.priority || 'Medium'}</span></td>
                    <td>${barcodeSvg}</td>
                    <td>${p.requestDate}</td>
                    <td>${statusBadge}</td>
                    <td>
                        <div class="d-flex gap-2">
                            ${actionBtn}
                        </div>
                    </td>
                </tr>`;
            });
            pendingList.innerHTML = html;
        }
    }

    if (completedList) {
        const completed = requests.filter(r => r.status === 'completed');
        if (completed.length === 0) {
            completedList.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No completed diagnostic reports archived.</td></tr>`;
        } else {
            let html = '';
            completed.forEach(c => {
                html += `
                <tr>
                    <td><strong>${c.id}</strong></td>
                    <td>${c.patientName}</td>
                    <td>${c.testName}</td>
                    <td>${c.resultDate}</td>
                    <td>${c.technician}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary" onclick="viewLabReportModal('${c.id}')"><i class="fa-solid fa-file-invoice me-1"></i> View Report</button>
                    </td>
                </tr>`;
            });
            completedList.innerHTML = html;
        }
    }
}

async function renderLabDashboardCharts() {
    const canvasOrders = document.getElementById('laboraxOrdersChart');
    const canvasStatus = document.getElementById('laboraxStatusChart');
    if (!canvasOrders || !canvasStatus) return;

    if (laboraxOrdersChartInstance) laboraxOrdersChartInstance.destroy();
    if (laboraxStatusChartInstance) laboraxStatusChartInstance.destroy();

    const requests = getDB('lab_requests');
    let pendingCount = requests.filter(r => r.status !== 'completed').length;
    let completedCount = requests.filter(r => r.status === 'completed').length;
    let ordersTrend = [14, 18, 22, 19, 25, 12, 16];
    let processingLabels = ['Completed', 'Pending Orders'];
    let processingData = [completedCount, pendingCount];

    if (!ApiService.useMock) {
        try {
            const data = await ApiService.getLabAnalytics();
            ordersTrend = data.ordersTrend || ordersTrend;
            if (data.processingStatus) {
                processingLabels = data.processingStatus.labels;
                processingData = data.processingStatus.data;
            }
        } catch (err) {
            console.error("Failed to load lab analytics:", err);
        }
    }

    laboraxOrdersChartInstance = new Chart(canvasOrders, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Test Orders',
                data: ordersTrend,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16,185,129,0.05)',
                tension: 0.25,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true }, x: { grid: { display: false } } }
        }
    });

    laboraxStatusChartInstance = new Chart(canvasStatus, {
        type: 'doughnut',
        data: {
            labels: processingLabels,
            datasets: [{
                data: processingData,
                backgroundColor: ['#10b981', '#f59e0b', '#3b82f6'],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom' } }
        }
    });
}

function setupLabWalkinSelectors() {
    const selectEl = document.getElementById('walkin-patient');
    if (!selectEl) return;
    const patients = getDB('patients');
    selectEl.innerHTML = '<option value="">-- Choose Patient --</option>';
    patients.forEach(p => {
        selectEl.innerHTML += `<option value="${p.id}">${p.name} (${p.id})</option>`;
    });
}

async function submitLabWalkin() {
    const patientId = document.getElementById('walkin-patient').value;
    const doctor = document.getElementById('walkin-doctor').value;
    const priority = document.getElementById('walkin-priority').value;
    const payment = document.getElementById('walkin-payment').value;
    const sampleStatus = document.getElementById('walkin-sample-status').value;

    const patient = getDB('patients').find(p => p.id === patientId);
    if (!patient) {
        Toast.warning('Please choose a valid patient.');
        return;
    }

    const checkboxes = document.querySelectorAll('.walkin-test-cb:checked');
    if (checkboxes.length === 0) {
        Toast.warning('Please select at least one diagnostic assessment.');
        return;
    }

    const token = "TKN-" + Math.floor(100 + Math.random() * 900);
    const requests = getDB('lab_requests') || [];
    const invoices = getDB('patient_invoices') || [];

    checkboxes.forEach((cb, index) => {
        const testName = cb.value;
        const testCat = cb.getAttribute('data-category');
        const labId = 'lab-' + Date.now() + '-' + index;

        requests.push({
            id: labId,
            patientId: patientId,
            patientName: patient.name,
            doctorName: doctor,
            testCategory: testCat,
            testName: testName,
            requestDate: new Date().toISOString().split('T')[0],
            status: sampleStatus, // pending or sample_collected
            resultDate: null,
            technician: '',
            priority: priority,
            results: [],
            techComments: `[Token: ${token}] [Payment: ${payment}]`
        });

        // If unpaid, generate billing item
        if (payment === 'unpaid') {
            invoices.push({
                id: 'INV-' + Math.floor(10000 + Math.random() * 90000),
                patientId: patientId,
                description: `Laboratory Analysis - ${testName}`,
                amount: 75.00,
                status: 'unpaid'
            });
        }
    });

    setDB('lab_requests', requests);
    if (payment === 'unpaid') {
        setDB('patient_invoices', invoices);
    }

    // Call API if server mode
    if (!ApiService.useMock) {
        try {
            for (let index = 0; index < checkboxes.length; index++) {
                const cb = checkboxes[index];
                const testName = cb.value;
                const testCat = cb.getAttribute('data-category');
                await ApiService._request('/lab-tests/', {
                    method: 'POST',
                    body: JSON.stringify({
                        lab_id: 'lab-' + Date.now() + '-' + index,
                        patient_id: patientId,
                        patient_name: patient.name,
                        doctor_name: doctor,
                        test_category: testCat,
                        test_name: testName,
                        status: sampleStatus,
                        priority: priority,
                        tech_comments: `[Token: ${token}] [Payment: ${payment}]`
                    })
                });
            }
            await ApiService.syncDataFromServer();
        } catch (err) {
            console.error("Failed to sync registered walk-in to backend:", err);
        }
    }

    Toast.success(`Walk-In token ${token} registered successfully!`);
    document.getElementById('lab-walkin-form').reset();
    
    // Refresh queues & stats
    renderLabRequests();
    renderLabDashboardCharts();
    updateLabTechStats();
    window.renderWalkinQueue();
    window.renderSpecimenQueue();

    // Navigate back to overview dashboard
    document.querySelector('[data-panel="panel-dashboard"]').click();
}

window.enterLabResults = function (requestId) {
    document.querySelector('[data-panel="panel-results-entry"]').click();
    window.selectSpecimenForEntry(requestId);
};

window.selectSpecimenForEntry = function(requestId) {
    const reqs = getDB('lab_requests');
    const req = reqs.find(r => r.id === requestId);

    if (req) {
        // Highlight active card
        document.querySelectorAll('.specimen-queue-card').forEach(card => {
            card.classList.remove('active-item');
        });
        const activeCard = document.getElementById(`specimen-card-${requestId}`);
        if (activeCard) activeCard.classList.add('active-item');

        // Toggle layout visibility
        document.getElementById('results-editor-placeholder').classList.add('d-none');
        const workspace = document.getElementById('results-editor-workspace');
        workspace.classList.remove('d-none');

        // Extract token if present
        let token = "TKN-000";
        if (req.techComments && req.techComments.includes('[Token: ')) {
            const matches = req.techComments.match(/\[Token:\s*([A-Z0-9-]+)\]/);
            if (matches && matches[1]) token = matches[1];
        }
        document.getElementById('entry-token-display').innerText = token;

        document.getElementById('entry-request-id').value = req.id;
        document.getElementById('entry-patient-name').value = req.patientName;
        document.getElementById('entry-test-name').value = req.testName;
        document.getElementById('entry-priority').value = req.priority || 'Medium';
        document.getElementById('entry-appointment-id').value = req.appointmentId || 'N/A';
        document.getElementById('entry-consultation-id').value = req.consultationId || 'N/A';
        document.getElementById('entry-doctor-notes').value = req.doctorNotes || 'No notes provided';

        const container = document.getElementById('dynamic-param-rows');
        container.innerHTML = '';
        const params = getParametersForTest(req.testName);

        // Retrieve draft if saved
        const draftStr = localStorage.getItem('draft_' + req.id);
        const draft = draftStr ? JSON.parse(draftStr) : null;
        if (draft && draft.comments) {
            document.getElementById('entry-tech-comments').value = draft.comments;
        } else {
            document.getElementById('entry-tech-comments').value = req.techComments || '';
        }

        params.forEach((p, idx) => {
            let val = '';
            if (draft && draft.results && draft.results[idx]) {
                val = draft.results[idx].value;
            }
            
            container.innerHTML += `
            <tr class="dynamic-param-row">
                <td><span class="fw-semibold font-size-xs param-name">${p.name}</span></td>
                <td>
                    <input type="number" step="0.01" class="form-control form-control-sm param-value" placeholder="Result Value" value="${val}" oninput="window.interpretParamValue(this, '${p.range}')" required>
                </td>
                <td><span class="text-muted font-size-xs param-unit">${p.unit}</span></td>
                <td><span class="text-secondary font-size-xs param-range">${p.range}</span></td>
                <td><span class="param-flag badge bg-success-subtle text-success fw-bold font-size-xxs py-1 px-2.5">Normal</span></td>
            </tr>`;
        });

        // Trigger interpretation if value is restored from draft
        document.querySelectorAll('#dynamic-param-rows .param-value').forEach(input => {
            if (input.value) {
                input.dispatchEvent(new Event('input'));
            }
        });
    }
};

function getParametersForTest(testName) {
    const normalized = testName.toLowerCase();
    if (normalized.includes('cbc') || normalized.includes('blood')) {
        return [
            { name: 'White Blood Cell (WBC)', unit: '10^3/uL', range: '4.5 - 11.0' },
            { name: 'Red Blood Cell (RBC)', unit: '10^6/uL', range: '4.3 - 5.9' },
            { name: 'Hemoglobin (Hgb)', unit: 'g/dL', range: '13.5 - 17.5' },
            { name: 'Platelets', unit: '10^3/uL', range: '150 - 450' }
        ];
    } else if (normalized.includes('lipid') || normalized.includes('cholesterol')) {
        return [
            { name: 'Total Cholesterol', unit: 'mg/dL', range: '125 - 200' },
            { name: 'HDL Cholesterol', unit: 'mg/dL', range: '> 40' },
            { name: 'LDL Cholesterol', unit: 'mg/dL', range: '< 100' },
            { name: 'Triglycerides', unit: 'mg/dL', range: '< 150' }
        ];
    }
    return [
        { name: 'Test Parameter 1', unit: 'u/L', range: '10 - 50' },
        { name: 'Test Parameter 2', unit: 'mg/dL', range: '70 - 100' }
    ];
}

let labScannedFileRecord = null;
let labScannedFileObj = null;

function setupLabFileUploader() {
    const dropzone = document.getElementById('lab-upload-dropzone');
    const fileInput = document.getElementById('lab-file-input');
    if (!dropzone || !fileInput) return;

    dropzone.addEventListener('click', () => fileInput.click());
    dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('dragover'); });
    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) {
            handleLabFileUpload(e.dataTransfer.files[0]);
        }
    });
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            handleLabFileUpload(fileInput.files[0]);
        }
    });
}

function handleLabFileUpload(file) {
    if (!FormValidator.validateFileSize(file, 5)) {
        alert("Scanned file exceeds 5MB size limit.");
        return;
    }
    labScannedFileObj = file;
    labScannedFileRecord = {
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        date: new Date().toISOString().split('T')[0]
    };
    const preview = document.getElementById('lab-uploaded-file-preview');
    if (preview) {
        preview.innerHTML = `
        <div class="alert alert-success d-flex align-items-center justify-content-between p-2 mt-2 font-size-xs text-success">
            <span><i class="fa-solid fa-file-circle-check me-2"></i>Attached: <strong>${file.name}</strong></span>
            <button type="button" class="btn btn-sm btn-link text-danger p-0" onclick="labScannedFileRecord=null; labScannedFileObj=null; this.closest('.alert').remove()"><i class="fa-solid fa-times"></i></button>
        </div>`;
    }
}

async function submitLabResults(technician) {
    const reqId = document.getElementById('entry-request-id').value;
    const reqs = getDB('lab_requests');
    const reqIndex = reqs.findIndex(r => r.id === reqId);

    if (reqIndex === -1) {
        Toast.error("Please enter results for a valid request ID.");
        return;
    }

    const rows = document.querySelectorAll('.dynamic-param-row');
    const results = [];

    rows.forEach(row => {
        const nameEl = row.querySelector('.param-name');
        const parameter = nameEl.tagName === 'INPUT' ? nameEl.value : nameEl.innerText;
        const value = parseFloat(row.querySelector('.param-value').value);
        const unitEl = row.querySelector('.param-unit');
        const unit = unitEl.tagName === 'INPUT' ? unitEl.value : unitEl.innerText;
        const rangeEl = row.querySelector('.param-range');
        const refRange = rangeEl.tagName === 'INPUT' ? rangeEl.value : rangeEl.innerText;

        let flag = 'Normal';
        if (refRange.includes('-')) {
            const parts = refRange.split('-');
            const min = parseFloat(parts[0]);
            const max = parseFloat(parts[1]);
            if (value < min) flag = 'Low';
            if (value > max) flag = 'High';
            if (value < min * 0.7 || value > max * 1.3) flag = 'Critical';
        } else if (refRange.includes('<')) {
            const limit = parseFloat(refRange.replace('<', '').trim());
            if (value >= limit) flag = 'High';
        } else if (refRange.includes('>')) {
            const limit = parseFloat(refRange.replace('>', '').trim());
            if (value <= limit) flag = 'Low';
        }

        results.push({ parameter, value, unit, refRange, flag });
    });

    const comments = document.getElementById('entry-tech-comments')?.value || '';

    // Clear local draft
    localStorage.removeItem('draft_' + reqId);

    if (!ApiService.useMock) {
        const formData = new FormData();
        formData.append('status', 'completed');
        formData.append('resultDate', new Date().toISOString().split('T')[0]);
        formData.append('technician', technician.name);
        formData.append('results', JSON.stringify(results));
        formData.append('techComments', comments);
        
        if (labScannedFileObj) {
            formData.append('rawReportFile', labScannedFileObj);
        }

        try {
            const token = JSON.parse(sessionStorage.getItem('hc_current_user')).token;
            const res = await fetch(`${ApiService.baseUrl}/lab-tests/${reqId}/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.message || "Failed to submit results.");
            }
            Toast.success('Lab report authorized and compiled successfully!');
            document.getElementById('lab-entry-form').reset();
            document.getElementById('dynamic-param-rows').innerHTML = '';
            const preview = document.getElementById('lab-uploaded-file-preview');
            if (preview) preview.innerHTML = '';
            labScannedFileRecord = null;
            labScannedFileObj = null;

            await ApiService.syncDataFromServer();
            renderLabRequests();
            renderLabDashboardCharts();
            
            // Return to placeholder
            document.getElementById('results-editor-workspace').classList.add('d-none');
            document.getElementById('results-editor-placeholder').classList.remove('d-none');
            window.renderSpecimenQueue();

            document.querySelector('[data-panel="panel-dashboard"]').click();
            return;
        } catch (err) {
            Toast.error("Submission failed: " + err.message);
            return;
        }
    }

    const updateData = {
        status: 'completed',
        resultDate: new Date().toISOString().split('T')[0],
        technician: technician.name,
        results: results,
        techComments: comments
    };

    if (labScannedFileRecord) {
        updateData.rawReportFile = labScannedFileRecord;
        const patientFiles = getDB('files');
        patientFiles.push({
            id: 'f-' + (patientFiles.length + 1),
            patientId: reqs[reqIndex].patientId,
            name: labScannedFileRecord.name,
            size: labScannedFileRecord.size,
            type: 'application/pdf',
            date: updateData.resultDate
        });
        setDB('files', patientFiles);
    }

    await ApiService.updateLabTest(reqId, updateData);
    Toast.success('Lab report authorized and compiled successfully!');
    document.getElementById('lab-entry-form').reset();
    document.getElementById('dynamic-param-rows').innerHTML = '';
    const preview = document.getElementById('lab-uploaded-file-preview');
    if (preview) preview.innerHTML = '';
    labScannedFileRecord = null;

    renderLabRequests();
    renderLabDashboardCharts();
    
    // Return to placeholder
    document.getElementById('results-editor-workspace').classList.add('d-none');
    document.getElementById('results-editor-placeholder').classList.remove('d-none');
    window.renderSpecimenQueue();

    document.querySelector('[data-panel="panel-dashboard"]').click();
}


// --- ADMIN DASHBOARD WORKFLOWS ---
let adminActivityChartInstance = null;
let adminYearlyChartInstance = null;
let adminIncomeChartInstance = null;

function initAdminPortal(adminUser) {
    document.getElementById('user-display-name').innerText = adminUser.name;
    document.getElementById('avatar-letters').innerText = adminUser.name.split(' ').map(n=>n[0]).join('');

    renderAdminDashboard();
    renderAdminUserTable();
    renderAdminDepartments();
    renderAdminAudits();
    renderAdminAnalyticsCharts();

    if (window.renderAdminApprovals) window.renderAdminApprovals();
    if (window.renderAdminVerifications) window.renderAdminVerifications();
    if (window.renderAdminLeaves) window.renderAdminLeaves();
    if (window.renderAdminEmailLogs) window.renderAdminEmailLogs();

    // Register User Form
    const adminUserForm = document.getElementById('admin-add-user-form');
    if (adminUserForm) {
        adminUserForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const name = document.getElementById('admin-user-name').value;
            const email = document.getElementById('admin-user-email').value;
            const role = document.getElementById('admin-user-role').value;
            const pass = document.getElementById('admin-user-password').value;

            try {
                const res = await ApiService.register(name, email, pass, role);
                alert(res.message);
                adminUserForm.reset();
                renderAdminUserTable();
                renderAdminDashboard();
                const modal = bootstrap.Modal.getInstance(document.getElementById('addUserModal'));
                if (modal) modal.hide();
            } catch (err) {
                alert('Registration failed: ' + err.message);
            }
        });
    }

    // Edit User Form Submit
    const editForm = document.getElementById('admin-edit-user-form');
    if (editForm) {
        editForm.addEventListener('submit', function (e) {
            e.preventDefault();
            submitAdminUserEdit();
        });
    }

    // Create Specialty Form
    const deptForm = document.getElementById('admin-add-dept-form');
    if (deptForm) {
        deptForm.addEventListener('submit', function (e) {
            e.preventDefault();
            submitAdminCreateDept();
        });
    }
}

function renderAdminDashboard() {
    const users = getDB('users') || [];
    const labs = getDB('lab_requests') || [];
    const depts = getDB('departments') || [];
    const appointments = getDB('appointments') || [];
    const leaves = getDB('leaves') || [];

    const todayStr = new Date().toISOString().split('T')[0];

    // Count today's appointments
    const todayAppts = appointments.filter(a => a.date === todayStr).length;

    // Count active doctors and techs
    const activeDocs = users.filter(u => u.role === 'doctor' && u.status !== 'Pending').length;
    const activeTechs = users.filter(u => u.role === 'labtech' && u.status !== 'Pending').length;

    // Count pending approvals & leaves
    const pendingApprovals = users.filter(u => u.status === 'Pending').length;
    const pendingLeaves = leaves.filter(l => l.status === 'pending' || l.status === 'Pending').length;

    // Count completed reports
    const completedReports = labs.filter(r => r.status === 'completed').length;

    document.getElementById('admin-stat-patients').innerText = users.filter(u => u.role === 'patient').length;
    document.getElementById('admin-stat-appointments').innerText = todayAppts;
    document.getElementById('admin-stat-doctors').innerText = activeDocs;
    if (document.getElementById('admin-stat-techs')) {
        document.getElementById('admin-stat-techs').innerText = activeTechs;
    }

    // Calculate dynamic revenue stats (Today, Week, Month, Year)
    const invoices = getDB('patient_invoices') || [];
    const paidInvoices = invoices.filter(inv => inv.status === 'paid' && inv.paidOn);
    const todayMs = new Date(todayStr).getTime();

    let revToday = 0;
    let revWeek = 0;
    let revMonth = 0;
    let revYear = 0;

    paidInvoices.forEach(inv => {
        const paidMs = new Date(inv.paidOn).getTime();
        const diffDays = (todayMs - paidMs) / (1000 * 3600 * 24);
        const amount = parseFloat(inv.amount) || 0;

        if (inv.paidOn === todayStr) {
            revToday += amount;
        }
        if (diffDays <= 7) {
            revWeek += amount;
        }
        if (diffDays <= 30) {
            revMonth += amount;
        }
        if (diffDays <= 365) {
            revYear += amount;
        }
    });

    // Fallbacks if no invoices exist or mock data is empty
    if (revYear === 0) {
        revToday = 180.00;
        revWeek = 1450.00;
        revMonth = 5820.00;
        revYear = 68400.00;
    }

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
    };

    if (document.getElementById('admin-stat-revenue-today')) {
        document.getElementById('admin-stat-revenue-today').innerText = formatCurrency(revToday);
    }
    if (document.getElementById('admin-stat-pending-approvals')) {
        document.getElementById('admin-stat-pending-approvals').innerText = pendingApprovals;
    }
    if (document.getElementById('admin-stat-pending-leaves')) {
        document.getElementById('admin-stat-pending-leaves').innerText = pendingLeaves;
    }
    if (document.getElementById('admin-stat-reports-completed')) {
        document.getElementById('admin-stat-reports-completed').innerText = completedReports;
    }

    const elRevToday = document.getElementById('admin-rev-today');
    const elRevWeek = document.getElementById('admin-rev-week');
    const elRevMonth = document.getElementById('admin-rev-month');
    const elRevYear = document.getElementById('admin-rev-year');

    if (elRevToday) elRevToday.innerText = formatCurrency(revToday);
    if (elRevWeek) elRevWeek.innerText = formatCurrency(revWeek);
    if (elRevMonth) elRevMonth.innerText = formatCurrency(revMonth);
    if (elRevYear) elRevYear.innerText = formatCurrency(revYear);

    // Populate global appointments list
    const apptsTable = document.getElementById('admin-appointments-list');
    if (apptsTable) {
        if (appointments.length === 0) {
            apptsTable.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No appointments found in the system.</td></tr>`;
        } else {
            let html = '';
            appointments.forEach(ap => {
                let statusClass = 'badge-pending';
                if (ap.status === 'confirmed') statusClass = 'badge-completed';
                if (ap.status === 'cancelled') statusClass = 'badge-cancelled';
                if (ap.status === 'completed') statusClass = 'badge-active';

                const patUser = users.find(u => u.patientId === ap.patientId || u.email.includes(ap.patientId));
                const patName = patUser ? patUser.name : ap.patientId;

                html += `
                <tr>
                    <td><strong>${ap.id}</strong></td>
                    <td>${patName}</td>
                    <td>${ap.doctorName}</td>
                    <td><code>${ap.date} (${ap.timeSlot})</code></td>
                    <td><span class="hc-badge-status ${statusClass}">${ap.status.toUpperCase()}</span></td>
                </tr>`;
            });
            apptsTable.innerHTML = html;
        }
    }
}

function renderAdminUserTable() {
    const table = document.getElementById('admin-users-list');
    if (!table) return;

    const users = getDB('users') || [];
    let html = '';
    users.forEach(u => {
        const deptText = u.department || 'None / General';
        const statusBadge = u.status === 'Suspended' 
            ? `<span class="badge bg-danger px-2 py-1">Suspended</span>` 
            : `<span class="badge bg-success px-2 py-1">Active</span>`;

        html += `
        <tr>
            <td><strong>${u.name}</strong></td>
            <td>${u.email}</td>
            <td><span class="badge bg-secondary px-2 py-1">${u.role.toUpperCase()}</span></td>
            <td><code>${deptText}</code></td>
            <td>${statusBadge}</td>
            <td class="d-flex gap-2">
                <button class="btn btn-xs btn-outline-primary" onclick="openAdminUserEditModal('${u.email}')"><i class="fa-solid fa-edit"></i></button>
                <button class="btn btn-xs btn-outline-danger" onclick="deleteUser('${u.email}')"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>`;
    });
    table.innerHTML = html;
}

function renderAdminDepartments() {
    const list = document.getElementById('admin-depts-list');
    if (!list) return;

    const depts = getDB('departments');
    let html = '';
    depts.forEach(d => {
        html += `
        <tr>
            <td><strong>${d.name}</strong></td>
            <td>${d.head}</td>
            <td>${d.staffCount}</td>
            <td><span class="badge bg-success">Active</span></td>
        </tr>`;
    });
    list.innerHTML = html;
}

function renderAdminAudits() {
    const list = document.getElementById('admin-audits-list') || document.querySelector('#panel-audits tbody');
    if (!list) return;

    const audits = getDB('audits') || [];
    let html = '';
    audits.forEach(log => {
        html += `
        <tr>
            <td><code>${log.timestamp}</code></td>
            <td><span class="badge bg-secondary font-size-xxs">${log.module}</span></td>
            <td><code>${log.initiator}</code></td>
            <td class="font-size-xs">${log.action}</td>
            <td><span class="badge bg-success font-size-xxs">${log.flag}</span></td>
        </tr>`;
    });
    list.innerHTML = html;
}

window.openAdminUserEditModal = function (email) {
    const users = getDB('users');
    const user = users.find(u => u.email === email);
    if (!user) return;

    document.getElementById('edit-user-original-email').value = user.email;
    document.getElementById('edit-user-name').value = user.name;
    document.getElementById('edit-user-email').value = user.email;
    document.getElementById('edit-user-role').value = user.role;
    document.getElementById('edit-user-password').value = '';
    document.getElementById('edit-user-status').value = user.status || 'Active';
    document.getElementById('edit-user-dept').value = user.department || 'None';
    document.getElementById('editUserModal').setAttribute('data-user-id', user.id || '');

    const modal = new bootstrap.Modal(document.getElementById('editUserModal'));
    modal.show();
};

async function submitAdminUserEdit() {
    const originalEmail = document.getElementById('edit-user-original-email').value;
    const name = document.getElementById('edit-user-name').value;
    const email = document.getElementById('edit-user-email').value;
    const role = document.getElementById('edit-user-role').value;
    const password = document.getElementById('edit-user-password').value;
    const status = document.getElementById('edit-user-status').value;
    const department = document.getElementById('edit-user-dept').value;
    const userId = document.getElementById('editUserModal').getAttribute('data-user-id');

    const updatePayload = { name, email, role, status, department };
    if (password) {
        updatePayload.password = password;
    }

    if (!ApiService.useMock && userId) {
        try {
            await ApiService.updateUser(userId, updatePayload);
            await ApiService.syncDataFromServer();
            Toast.success("User profile updated successfully in database!");
        } catch (err) {
            Toast.error("Failed to update user: " + err.message);
            return;
        }
    } else {
        const users = getDB('users');
        const idx = users.findIndex(u => u.email === originalEmail);
        if (idx !== -1) {
            users[idx].name = name;
            users[idx].email = email;
            users[idx].role = role;
            users[idx].status = status;
            users[idx].department = department;
            if (password) {
                users[idx].password = password;
            }
            setDB('users', users);
            Toast.success("User profile updated successfully!");
        }
    }

    const modal = bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
    if (modal) modal.hide();

    renderAdminUserTable();
    renderAdminDashboard();
}

window.deleteUser = async function (email) {
    if (confirm('Are you sure you want to delete this user?')) {
        const users = getDB('users');
        const user = users.find(u => u.email === email);
        if (!user) return;

        if (!ApiService.useMock && user.id) {
            try {
                await ApiService.deleteUser(user.id);
                await ApiService.syncDataFromServer();
                alert("User deleted successfully from database!");
            } catch (err) {
                alert("Failed to delete user: " + err.message);
                return;
            }
        } else {
            const filteredUsers = users.filter(u => u.email !== email);
            setDB('users', filteredUsers);
            ApiService.addAuditLog('accounts', 'admin', `Deleted user account: ${email}`);
            alert("User deleted successfully!");
        }

        renderAdminUserTable();
        renderAdminDashboard();
        renderAdminAudits();
    }
};

function submitAdminCreateDept() {
    const name = document.getElementById('admin-dept-name').value;
    const head = document.getElementById('admin-dept-head').value;
    const staff = parseInt(document.getElementById('admin-dept-staff').value);

    const depts = getDB('departments');
    depts.push({
        id: 'dept-' + (depts.length + 1),
        name: name,
        head: head,
        staffCount: staff
    });

    setDB('departments', depts);
    ApiService.addAuditLog('system', 'admin', `Created medical specialty department: ${name}`);
    alert('Department specialty created successfully!');
    document.getElementById('admin-add-dept-form').reset();

    renderAdminDepartments();
    renderAdminDashboard();
    renderAdminAudits();
}

async function renderAdminAnalyticsCharts() {
    const ctxLoad = document.getElementById('adminActivityChart');
    const ctxYearly = document.getElementById('adminYearlyIncomeChart');
    const ctxIncome = document.getElementById('adminIncomeDistChart');

    let loadData = {
        labels: ['Pediatrics', 'Cardiology', 'Neurology', 'General Med', 'Radiology', 'Pathology'],
        activeCases: [15, 32, 12, 45, 24, 50],
        consultations: [20, 24, 18, 55, 30, 42]
    };
    let yearlyData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        revenue: [5000, 8000, 7500, 11000, 9500, 12000, 14000, 13000, 15000, 18000, 16000, 22000],
        expenses: [3000, 4500, 4000, 6000, 5000, 7000, 8500, 7500, 8000, 10000, 9500, 12000]
    };
    let incomeData = {
        labels: ['OPD', 'IPD', 'Pharmacy', 'Pathology', 'Radiology'],
        data: [10462, 2802, 21293, 3165, 2304]
    };

    if (!ApiService.useMock) {
        try {
            const data = await ApiService.getAdminAnalytics();
            if (data.loadChart) loadData = data.loadChart;
            if (data.yearlyChart) yearlyData = data.yearlyChart;
            if (data.incomeDist) incomeData = data.incomeDist;
            
            // Also update the summary stats on the admin dashboard if they exist
            if (data.stats) {
                const patCount = document.getElementById('admin-stat-patients');
                const docCount = document.getElementById('admin-stat-doctors');
                const apptCount = document.getElementById('admin-stat-appointments');
                const labCount = document.getElementById('admin-stat-labs');
                if (patCount) patCount.innerText = data.stats.totalPatients;
                if (docCount) docCount.innerText = data.stats.totalDoctors;
                if (apptCount) apptCount.innerText = data.stats.totalAppointments;
                if (labCount) labCount.innerText = data.stats.totalLabTests;
            }
        } catch (err) {
            console.error("Failed to load admin analytics:", err);
        }
    }

    if (ctxLoad) {
        if (adminActivityChartInstance) adminActivityChartInstance.destroy();
        adminActivityChartInstance = new Chart(ctxLoad, {
            type: 'bar',
            data: {
                labels: loadData.labels,
                datasets: [
                    { label: 'Active Cases', data: loadData.activeCases, backgroundColor: '#0f52ba' },
                    { label: 'Consultations', data: loadData.consultations, backgroundColor: '#10b981' }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: true } }
            }
        });
    }

    if (ctxYearly) {
        if (adminYearlyChartInstance) adminYearlyChartInstance.destroy();
        adminYearlyChartInstance = new Chart(ctxYearly, {
            type: 'line',
            data: {
                labels: yearlyData.labels,
                datasets: [
                    { label: 'Total Revenue ($)', data: yearlyData.revenue, borderColor: '#10b981', fill: false },
                    { label: 'Total Expenses ($)', data: yearlyData.expenses, borderColor: '#ef4444', fill: false }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    if (ctxIncome) {
        if (adminIncomeChartInstance) adminIncomeChartInstance.destroy();
        adminIncomeChartInstance = new Chart(ctxIncome, {
            type: 'doughnut',
            data: {
                labels: incomeData.labels,
                datasets: [{
                    data: incomeData.data,
                    backgroundColor: ['#10b981', '#3b82f6', '#8b5cf6', '#f43f5e', '#f97316']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } }
            }
        });
    }
}


// ==========================================
// 5. VIEW REPORT PDF MODAL GENERATOR
// ==========================================

// ==========================================
// 5. VIEW REPORT PDF MODAL GENERATOR
// ==========================================

function base64ToBlob(base64, mimeType = 'application/pdf') {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
}

window.viewLabReportModal = async function (reportId) {
    try {
        console.log("viewLabReportModal called with reportId:", reportId);
        if (!reportId) {
            console.error("No reportId provided to viewLabReportModal");
            return;
        }

        const reqs = getDB('lab_requests') || [];
        const req = reqs.find(r => String(r.id).trim() === String(reportId).trim());
        if (!req) {
            console.error("Lab request not found in database for reportId:", reportId);
            alert("Report record not found in local cache.");
            return;
        }

        let modalEl = document.getElementById('labReportModal');
        if (modalEl) {
            // Safely dispose of existing bootstrap instance to prevent state corruption
            if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
                const existingInstance = bootstrap.Modal.getInstance(modalEl);
                if (existingInstance) {
                    try {
                        existingInstance.dispose();
                    } catch (e) {
                        console.warn("Error disposing bootstrap modal instance:", e);
                    }
                }
            }
            modalEl.innerHTML = '';
        } else {
            modalEl = document.createElement('div');
            modalEl.id = 'labReportModal';
            modalEl.className = 'modal fade';
            modalEl.setAttribute('tabindex', '-1');
            document.body.appendChild(modalEl);
        }

        let resultsHtml = '';
        if (req.results && Array.isArray(req.results)) {
            req.results.forEach(res => {
                const isNormal = res.flag === 'Normal';
                resultsHtml += `
                <tr>
                    <td>${res.parameter || ''}</td>
                    <td><strong>${res.value !== undefined ? res.value : ''}</strong></td>
                    <td>${res.unit || ''}</td>
                    <td>${res.refRange || ''}</td>
                    <td><span class="badge ${isNormal ? 'bg-success' : 'bg-danger'}">${res.flag || 'Normal'}</span></td>
                </tr>`;
            });
        }

        modalEl.innerHTML = `
        <div class="modal-dialog modal-xl modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header border-bottom no-print pb-2 pt-3 px-4 d-flex align-items-center">
                    <ul class="nav nav-tabs border-0 flex-grow-1" id="labReportTabs" role="tablist">
                        <li class="nav-item" role="presentation">
                            <button class="nav-link active fw-semibold" id="pdf-tab" data-bs-toggle="tab" data-bs-target="#pdf-panel" type="button" role="tab" aria-controls="pdf-panel" aria-selected="true" style="border: none; border-bottom: 3px solid var(--bs-primary); border-radius: 0; padding-bottom: 8px;">
                                <i class="fa-solid fa-file-pdf text-danger me-1"></i> PDF Document Report
                            </button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link fw-semibold text-secondary" id="data-tab" data-bs-toggle="tab" data-bs-target="#data-panel" type="button" role="tab" aria-controls="data-panel" aria-selected="false" style="border: none; border-bottom: 3px solid transparent; border-radius: 0; padding-bottom: 8px;">
                                <i class="fa-solid fa-table me-1"></i> Structured Data Table
                            </button>
                        </li>
                    </ul>
                    <button type="button" class="btn-close ms-2" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body p-0 animate-fade-in" id="printable-report-body" style="background-color: #f8fafc;">
                    <div class="tab-content" id="labReportTabContent">
                        <!-- PDF Panel -->
                        <div class="tab-pane fade show active" id="pdf-panel" role="tabpanel" aria-labelledby="pdf-tab" style="height: 680px; position: relative;">
                            <div id="pdf-loading-spinner" class="d-flex justify-content-center align-items-center h-100 w-100 flex-column" style="position: absolute; background-color: #fff; z-index: 10;">
                                <div class="spinner-border text-primary mb-2" role="status">
                                    <span class="visually-hidden">Generating and Loading PDF...</span>
                                </div>
                                <p class="text-secondary fw-semibold mb-0">Generating Diagnostics PDF Report...</p>
                                <p class="text-muted font-size-xs">Please wait a moment...</p>
                            </div>
                            <iframe id="report-pdf-iframe" class="w-100 h-100 border-0 d-none"></iframe>
                        </div>
                        
                        <!-- Structured Data Panel -->
                        <div class="tab-pane fade p-5 bg-white" id="data-panel" role="tabpanel" aria-labelledby="data-tab">
                            <div class="d-flex justify-content-between align-items-center mb-4">
                                <div>
                                    <h2 class="text-primary mb-1 fw-bold">CurePoint</h2>
                                    <p class="text-muted mb-0 font-size-sm">Clinical Diagnostics & Lab Platform</p>
                                </div>
                                <div class="text-end">
                                    <h4 class="fw-bold text-dark">LABORATORY DIAGNOSTIC REPORT</h4>
                                    <p class="mb-0 text-secondary">Report ID: <strong>${req.id}</strong></p>
                                </div>
                            </div>
                            <hr>
                            <div class="row mb-4">
                                <div class="col-6">
                                    <p class="mb-1 text-muted font-size-xs uppercase fw-bold">Patient Details</p>
                                    <h5 class="text-dark"><strong>${req.patientName}</strong></h5>
                                    <p class="mb-0 text-muted font-size-xs">Patient ID: ${req.patientId}</p>
                                </div>
                                <div class="col-6 text-end">
                                    <p class="mb-1 text-muted font-size-xs uppercase fw-bold">Report Details</p>
                                    <p class="mb-1 font-size-sm text-dark">Requested By: <strong>${req.doctorName}</strong></p>
                                    <p class="mb-1 font-size-sm text-secondary">Request Date: ${req.requestDate}</p>
                                    <p class="mb-0 font-size-sm text-secondary">Result Date: ${req.resultDate || 'N/A'}</p>
                                </div>
                            </div>
                            <h5 class="text-secondary fw-bold mb-3">${req.testCategory} - ${req.testName}</h5>
                            <div class="table-responsive">
                                <table class="table table-bordered">
                                    <thead class="table-light">
                                        <tr>
                                            <th>Test Parameter</th>
                                            <th>Result</th>
                                            <th>Unit</th>
                                            <th>Reference Range</th>
                                            <th>Status Flag</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${resultsHtml || `<tr><td colspan="5" class="text-center text-muted py-3">No parameter results entered. Scanned file attached.</td></tr>`}
                                    </tbody>
                                </table>
                            </div>
                            ${req.rawReportFile ? `
                            <div class="alert alert-info mt-3 font-size-xs">
                                <i class="fa-solid fa-paperclip me-2"></i>Attached Raw Scanned Document: <strong>${req.rawReportFile.name || 'scanned_report.pdf'}</strong>
                            </div>` : ''}
                            <div class="row mt-5">
                                <div class="col-6">
                                    <p class="text-muted mb-0 font-size-xs">Technician Signature</p>
                                    <h6 class="mt-3 border-bottom d-inline-block pb-1 pe-5 font-size-sm"><strong>${req.technician || 'Pending'}</strong></h6>
                                </div>
                                <div class="col-6 text-end">
                                    <p class="text-muted mb-0 font-size-xs">Approved By Pathologist</p>
                                    <h6 class="mt-3 border-bottom d-inline-block pb-1 ps-5 font-size-sm"><strong>Dr. Gregory House</strong></h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer border-top no-print py-2 px-4 d-flex justify-content-between align-items-center">
                    <span class="text-muted font-size-xs"><i class="fa-solid fa-circle-info me-1"></i> Interactive PDF viewer enabled</span>
                    <div>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-success text-white" onclick="downloadPdfReport('lab-report', '${req.id}')"><i class="fa-solid fa-download me-1"></i> Download PDF</button>
                    </div>
                </div>
            </div>
        </div>`;

        // Hook tab switches to adjust borders
        modalEl.querySelectorAll('#labReportTabs button').forEach(btn => {
            btn.addEventListener('shown.bs.tab', (e) => {
                modalEl.querySelectorAll('#labReportTabs button').forEach(b => {
                    b.style.borderBottom = '3px solid transparent';
                    b.classList.add('text-secondary');
                });
                e.target.style.borderBottom = '3px solid var(--bs-primary)';
                e.target.classList.remove('text-secondary');
            });
        });

        if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
            const bsModal = new bootstrap.Modal(modalEl);
            bsModal.show();
        } else {
            console.warn("Bootstrap library is not loaded. Showing simple browser view fallback.");
            alert(`Bootstrap library is not loaded.\n\nReport ID: ${req.id}\nPatient: ${req.patientName}\nTest: ${req.testCategory} - ${req.testName}\nStatus: ${req.status}`);
            return;
        }

        // Load PDF asynchronously
        try {
            if (ApiService.useMock || window.location.protocol === 'file:') {
                // Local file system fallback or mock mode: browser security blocks iframe Blobs or mock PDF is generic.
                // Display a high-fidelity paper preview document sheet instead.
                const pdfPanel = document.getElementById('pdf-panel');
                if (pdfPanel) {
                    pdfPanel.style.overflowY = 'auto';
                    pdfPanel.innerHTML = `
                        <div class="alert alert-info font-size-xs mx-auto my-3 d-flex align-items-center" style="max-width: 800px; border-left: 4px solid var(--bs-info);">
                            <i class="fa-solid fa-circle-info fa-lg me-2 text-info"></i>
                            <div>
                                <strong>Showcase Note:</strong> Local file protocol (<code>file://</code>) detected. Browser security blocks local iframe Blobs. Displaying a high-fidelity HTML printable sheet preview.
                            </div>
                        </div>
                        
                        <div class="paper-preview p-5 mx-auto bg-white mb-4 shadow-sm" style="max-width: 800px; border: 1px solid #e2e8f0; border-radius: 4px; color: #334155; min-height: 800px; font-family: 'Outfit', sans-serif;">
                            <div class="d-flex justify-content-between align-items-center mb-4">
                                <div>
                                    <h3 class="text-primary mb-1 fw-bold">🏥 CurePoint Lab Desk</h3>
                                    <p class="text-muted mb-0 font-size-sm">Clinical Diagnostics & Lab Platform</p>
                                </div>
                                <div class="text-end">
                                    <h5 class="fw-bold text-dark mb-1">LABORATORY FINDINGS REPORT</h5>
                                    <p class="mb-0 text-secondary font-size-xs">Report ID: <strong>${req.id}</strong></p>
                                </div>
                            </div>
                            <hr style="border-top: 2px solid #e2e8f0; margin-bottom: 20px; margin-top: 10px;">
                            
                            <div class="row mb-4 bg-light p-3 rounded mx-0">
                                <div class="col-6">
                                    <p class="mb-1 text-muted font-size-xs uppercase fw-bold" style="letter-spacing: 0.5px;">PATIENT DETAILS</p>
                                    <h6 class="text-dark mb-1">Name: <strong>${req.patientName}</strong></h6>
                                    <p class="mb-0 text-muted font-size-xs">Patient ID: ${req.patientId}</p>
                                </div>
                                <div class="col-6 text-end">
                                    <p class="mb-1 text-muted font-size-xs uppercase fw-bold" style="letter-spacing: 0.5px;">ORDER DETAILS</p>
                                    <p class="mb-1 font-size-xs text-dark">Requested By: <strong>${req.doctorName}</strong></p>
                                    <p class="mb-1 font-size-xs text-secondary">Request Date: ${req.requestDate}</p>
                                    <p class="mb-0 font-size-xs text-secondary">Result Date: ${req.resultDate || 'N/A'}</p>
                                </div>
                            </div>
                            
                            <h6 class="text-secondary fw-bold mb-3 border-bottom pb-2">${req.testCategory} - ${req.testName}</h6>
                            <div class="table-responsive">
                                <table class="table table-striped table-bordered align-middle font-size-sm">
                                    <thead class="table-light text-secondary">
                                        <tr>
                                            <th>Test Parameter</th>
                                            <th>Result</th>
                                            <th>Unit</th>
                                            <th>Reference Range</th>
                                            <th>Status Flag</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${resultsHtml || `<tr><td colspan="5" class="text-center text-muted py-3">No parameter results entered. Scanned file attached.</td></tr>`}
                                    </tbody>
                                </table>
                            </div>
                            
                            ${req.rawReportFile ? `
                            <div class="alert alert-info mt-3 font-size-xs py-2 px-3">
                                <i class="fa-solid fa-paperclip me-2"></i>Attached Raw Scanned Document: <strong>${req.rawReportFile.name || 'scanned_report.pdf'}</strong>
                            </div>` : ''}
                            
                            <div style="margin-top: 100px;" class="row">
                                <div class="col-6">
                                    <p class="text-muted mb-0 font-size-xs">Technician Signature</p>
                                    <h6 class="mt-4 border-bottom d-inline-block pb-1 pe-5 font-size-sm text-dark"><strong>${req.technician || 'Pending'}</strong></h6>
                                </div>
                                <div class="col-6 text-end">
                                    <p class="text-muted mb-0 font-size-xs">Approved By Pathologist</p>
                                    <h6 class="mt-4 border-bottom d-inline-block pb-1 ps-5 font-size-sm text-dark"><strong>Dr. Gregory House</strong></h6>
                                </div>
                            </div>
                        </div>
                    `;
                    const spinner = document.getElementById('pdf-loading-spinner');
                    if (spinner) spinner.classList.add('d-none');
                }
                return;
            }

            let pdfUrl = '';
            const currentUser = JSON.parse(sessionStorage.getItem('hc_current_user')) || {};
            const token = currentUser.token || '';
            const res = await fetch(`${ApiService.baseUrl}/reports/lab-report/${req.id}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!res.ok) throw new Error("Failed to load PDF report from backend server.");
            const blob = await res.blob();
            pdfUrl = URL.createObjectURL(blob);

            const iframe = document.getElementById('report-pdf-iframe');
            if (iframe) {
                iframe.src = pdfUrl;
                iframe.onload = () => {
                    const spinner = document.getElementById('pdf-loading-spinner');
                    if (spinner) spinner.classList.add('d-none');
                    iframe.classList.remove('d-none');
                };
            }
        } catch (err) {
            console.error("PDF loading error: ", err);
            const spinner = document.getElementById('pdf-loading-spinner');
            if (spinner) {
                spinner.innerHTML = `
                    <div class="text-danger mb-2"><i class="fa-solid fa-triangle-exclamation fa-2x"></i></div>
                    <p class="text-danger fw-bold mb-1">Failed to load Report PDF</p>
                    <p class="text-muted font-size-xs px-4 text-center">${err.message || 'Check server connection.'}</p>
                `;
            }
        }
    } catch (outerErr) {
        console.error("Critical error in viewLabReportModal:", outerErr);
        alert("An error occurred while opening the report preview modal:\n\n" + outerErr.stack);
    }
};

window.downloadPdfReport = async function (type, id) {
    if (ApiService.useMock) {
        const dummyPdf = 'data:application/pdf;base64,JVBERi0xLjQKJdPr6goxIDAgb2JqCjw8L1R5cGUvQ2F0YWxvZy9QYWdlcyAyIDAgUj4+CmVuZG9iagoyIDAgb2JqCjw8L1R5cGUvUGFnZXMvS2lkc1szIDAgUl0vQ291bnQgMT4+CmVuZG9iagozIDAgb2JqCjw8L1R5cGUvUGFnZS9QYXJlbnQgMiAwIFIvTWVkaWFCb3hbMCAwIDU5NSA4NDJdL1Jlc291cmNlczw8L0ZvbnQ8PC9GMSA0IDAgUj4+Pj4vQ29udGVudHMgNSAwIFI+PgplbmRvYmoKNCAwIG9iago8PCAvVHlwZSAvRm9udCAvU3VidHlwZSAvVHlwZTEgL0Jhc2VGb250IC9IZWx2ZXRpY2EgPj4KZW5kb2JqCjUgMCBvYmoKPDwvTGVuZ3RoIDcwPj4Kc3RyZWFtCkJUCi9GMSAyNCBUZgoxMDAgNzAwIFRkCihDdXJlUG9pbnQgLSBTYW1wbGUgUmVwb3J0KSBUagpFVApCVAovRjEgMTIgVGYKMTAwIDY1MCBUZAooVGhpcyBpcyBhIG1vY2sgcGRmIHJlcG9ydCBkb2N1bWVudC4pIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDE1IDAwMDAwIG4gCjAwMDAwMDAwNjAgMDAwMDAgbiAKMDAwMDAwMDEwOSAwMDAwMCBuIAowMDAwMDAwMTk4IDAwMDAwIG4gCjAwMDAwMDAyNjcgMDAwMDAgbiAKdHJhaWxlcgo8PC9TaXplIDYvUm9vdCAxIDAgUj4+CnN0YXJ0eHJlZgozODgKJSVFT0Y=';
        const a = document.createElement('a');
        a.href = dummyPdf;
        a.download = `${type}_${id}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        showToast("Mock Report PDF downloaded successfully.");
        return;
    }

    try {
        const token = JSON.parse(sessionStorage.getItem('hc_current_user')).token;
        const res = await fetch(`${ApiService.baseUrl}/reports/${type}/${id}/`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!res.ok) throw new Error("Failed to download PDF report from server.");
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${type}_${id}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        showToast("Report PDF downloaded successfully.");
    } catch (err) {
        alert("PDF download failed: " + err.message);
    }
};


// ==========================================
// 6. VALIDATION & TOAST HELPER UTILITIES & EXTENSIONS
// ==========================================

const FormValidator = {
    validateRequired: function (fields) {
        for (let key in fields) {
            if (fields[key] === null || fields[key] === undefined || String(fields[key]).trim() === '') {
                return false;
            }
        }
        return true;
    },
    validatePhone: function (phone) {
        return /^[+]?[0-9]{10,14}$/.test(phone.replace(/[\s()-]/g, ''));
    },
    validateFileSize: function (file, maxMB) {
        return file.size <= maxMB * 1024 * 1024;
    }
};

const Toast = {
    show: function (message, type = 'info') {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${type}`;
        
        let iconClass = 'fa-info-circle';
        if (type === 'success') iconClass = 'fa-circle-check';
        if (type === 'error') iconClass = 'fa-circle-exclamation';
        if (type === 'warning') iconClass = 'fa-triangle-exclamation';

        toast.innerHTML = `
            <div class="toast-icon"><i class="fa-solid ${iconClass}"></i></div>
            <div class="toast-message flex-grow-1 font-size-xs fw-semibold">${message}</div>
            <button class="btn-close ms-2 font-size-xs" style="background: none; border: none; color: inherit; cursor: pointer; font-size: 1.2rem; line-height: 1;" onclick="this.parentElement.remove()">&times;</button>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('fadeOut');
            toast.addEventListener('animationend', () => toast.remove());
        }, 4000);
    },
    success: function (msg) { this.show(msg, 'success'); },
    error: function (msg) { this.show(msg, 'error'); },
    warning: function (msg) { this.show(msg, 'warning'); },
    info: function (msg) { this.show(msg, 'info'); }
};

// Global overrides
window.alert = function (message) {
    Toast.show(message, 'info');
};
window.showToast = function (message) {
    Toast.show(message, 'success');
};

// --- LEAVE & VACATION FUNCTIONS ---
window.renderDoctorLeaves = function (doctor) {
    const list = document.getElementById('doctor-leaves-list');
    if (!list) return;

    const leaves = getDB('leaves') || [];
    const doctorLeaves = leaves.filter(l => l.doctorId === doctor.id);

    if (doctorLeaves.length === 0) {
        list.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-3">No leaves requested.</td></tr>`;
        return;
    }

    list.innerHTML = doctorLeaves.map(l => {
        let statusBadge = '';
        if (l.status === 'Approved') {
            statusBadge = `<span class="badge bg-success text-white font-size-xxs">APPROVED</span>`;
        } else if (l.status === 'Pending') {
            statusBadge = `<span class="badge bg-warning text-dark font-size-xxs">PENDING</span>`;
        } else {
            statusBadge = `<span class="badge bg-danger text-white font-size-xxs">REJECTED</span>`;
        }

        return `
            <tr>
                <td><strong>${l.type}</strong></td>
                <td>${l.startDate}</td>
                <td>${l.endDate}</td>
                <td>${l.reason}</td>
                <td>${statusBadge}</td>
                <td>
                    <button class="btn btn-xs btn-outline-danger" onclick="deleteDoctorLeave('${l.id}')"><i class="fa-solid fa-trash-can"></i> Cancel</button>
                </td>
            </tr>
        `;
    }).join('');
};

window.deleteDoctorLeave = async function (leaveId) {
    try {
        if (!ApiService.useMock) {
            await ApiService._request(`/leaves/${leaveId}/`, {
                method: 'DELETE'
            });
            await ApiService.syncDataFromServer();
        } else {
            let leaves = getDB('leaves') || [];
            leaves = leaves.filter(l => l.id !== leaveId);
            setDB('leaves', leaves);
        }
        
        Toast.success('Leave cancelled successfully.');
        
        const currentUser = AuthService.getCurrentUser();
        if (currentUser && currentUser.role === 'doctor') {
            const doctors = getDB('doctors');
            const doctor = doctors.find(d => d.id === currentUser.doctorId);
            if (doctor) {
                renderDoctorLeaves(doctor);
                renderDoctorCalendarWorkspace(doctor);
            }
        }
    } catch (err) {
        Toast.error("Failed to cancel leave request: " + err.message);
    }
};

window.setupDoctorLeaveForm = function (doctor) {
    const form = document.getElementById('doctor-leave-form');
    if (!form) return;

    form.replaceWith(form.cloneNode(true));
    const newForm = document.getElementById('doctor-leave-form');

    newForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const start = document.getElementById('leave-start').value;
        const end = document.getElementById('leave-end').value;
        const type = document.getElementById('leave-type').value;
        const reason = document.getElementById('leave-reason').value;

        if (new Date(start) > new Date(end)) {
            Toast.error('Start date cannot be after end date.');
            return;
        }

        try {
            if (!ApiService.useMock) {
                await ApiService._request('/leaves/', {
                    method: 'POST',
                    body: JSON.stringify({
                        startDate: start,
                        endDate: end,
                        leaveType: type,
                        reason: reason
                    })
                });
                await ApiService.syncDataFromServer();
            } else {
                const leaves = getDB('leaves') || [];
                const newLeave = {
                    id: 'leave-' + Date.now(),
                    doctorId: doctor.id,
                    doctorName: doctor.name,
                    startDate: start,
                    endDate: end,
                    leaveType: type,
                    reason: reason,
                    status: 'Pending'
                };
                leaves.push(newLeave);
                setDB('leaves', leaves);
            }

            Toast.success('Leave request submitted successfully as PENDING!');
            newForm.reset();
            
            renderDoctorLeaves(doctor);
            renderDoctorCalendarWorkspace(doctor);
        } catch (err) {
            Toast.error("Failed to submit leave request: " + err.message);
        }
    });
};

// --- CALENDAR EXTENSIONS ---
let currentCalendarDate = new Date(2026, 5, 1);
let currentCalendarView = 'month';

window.renderDoctorUpcomingSidebar = function (doctor) {
    const sidebar = document.getElementById('upcoming-appts-sidebar');
    if (!sidebar) return;
    
    const appointments = getDB('appointments');
    const patients = getDB('patients');
    
    const doctorAppts = appointments.filter(a => a.doctorId === doctor.id && a.status !== 'completed' && a.status !== 'cancelled');
    doctorAppts.sort((a, b) => new Date(a.date + ' ' + a.timeSlot.split(' - ')[0]) - new Date(b.date + ' ' + b.timeSlot.split(' - ')[0]));
    
    if (doctorAppts.length === 0) {
        sidebar.innerHTML = `<p class="text-muted font-size-xs mb-0 text-center py-3">No upcoming appointments.</p>`;
        return;
    }
    
    sidebar.innerHTML = doctorAppts.map(ap => {
        const pat = patients.find(p => p.id === ap.patientId);
        return `
            <div class="p-2 border rounded bg-light font-size-xs text-dark hover-shadow cursor-pointer mb-2" onclick="startConsultation('${ap.patientId}', '${ap.id}')">
                <div class="d-flex justify-content-between align-items-center mb-1">
                    <strong class="text-primary">${pat ? pat.name : 'Unknown'}</strong>
                    <span class="badge bg-info-subtle text-info font-size-xxs">${ap.timeSlot}</span>
                </div>
                <div class="text-muted font-size-xxs d-flex justify-content-between">
                    <span>Date: ${ap.date}</span>
                    <span>Type: ${ap.type || 'Consult'}</span>
                </div>
            </div>
        `;
    }).join('');
};

window.setupDoctorCalendarEvents = function (doctor) {
    const viewSelector = document.getElementById('calendar-view-selector');
    if (viewSelector) {
        const btns = viewSelector.querySelectorAll('button');
        btns.forEach(btn => {
            btn.addEventListener('click', function () {
                btns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentCalendarView = this.getAttribute('data-view');
                renderDoctorCalendarWorkspace(doctor);
            });
        });
    }

    const prevBtn = document.getElementById('prev-month-btn');
    const nextBtn = document.getElementById('next-month-btn');

    if (prevBtn && nextBtn) {
        prevBtn.replaceWith(prevBtn.cloneNode(true));
        nextBtn.replaceWith(nextBtn.cloneNode(true));

        const newPrev = document.getElementById('prev-month-btn');
        const newNext = document.getElementById('next-month-btn');

        newPrev.addEventListener('click', function () {
            adjustCalendarDate(-1, doctor);
        });
        newNext.addEventListener('click', function () {
            adjustCalendarDate(1, doctor);
        });
    }
};

function adjustCalendarDate(direction, doctor) {
    if (currentCalendarView === 'month') {
        currentCalendarDate.setMonth(currentCalendarDate.getMonth() + direction);
    } else if (currentCalendarView === 'week') {
        currentCalendarDate.setDate(currentCalendarDate.getDate() + (direction * 7));
    } else if (currentCalendarView === 'day') {
        currentCalendarDate.setDate(currentCalendarDate.getDate() + direction);
    }
    renderDoctorCalendarWorkspace(doctor);
}

function setupCalendarDragDrop(doctor) {
    const grid = document.getElementById('doctor-calendar-grid');
    if (!grid) return;

    grid.querySelectorAll('.calendar-event-tag').forEach(tag => {
        tag.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', e.target.getAttribute('data-appt-id'));
            e.target.classList.add('dragging');
        });
        tag.addEventListener('dragend', (e) => {
            e.target.classList.remove('dragging');
        });
    });

    const dropTargets = grid.querySelectorAll('.calendar-cell, .calendar-slot-row');
    dropTargets.forEach(target => {
        target.addEventListener('dragover', (e) => {
            const cell = e.target.closest('.calendar-cell, .calendar-slot-row');
            if (cell) {
                e.preventDefault();
                cell.classList.add('drag-over');
            }
        });
        target.addEventListener('dragleave', (e) => {
            const cell = e.target.closest('.calendar-cell, .calendar-slot-row');
            if (cell) {
                cell.classList.remove('drag-over');
            }
        });
        target.addEventListener('drop', async (e) => {
            const cell = e.target.closest('.calendar-cell, .calendar-slot-row');
            if (cell) {
                e.preventDefault();
                cell.classList.remove('drag-over');
                const apptId = e.dataTransfer.getData('text/plain');
                const newDate = cell.getAttribute('data-date');
                const newSlot = cell.getAttribute('data-slot') || '09:00 AM';

                if (apptId && newDate) {
                    try {
                        if (!ApiService.useMock) {
                            await ApiService._request(`/appointments/${apptId}/`, {
                                method: 'PATCH',
                                body: JSON.stringify({ date: newDate, timeSlot: newSlot })
                            });
                            await ApiService.syncDataFromServer();
                            Toast.success(`Appointment rescheduled to ${newDate} at ${newSlot}`);
                        } else {
                            const appointments = getDB('appointments');
                            const appt = appointments.find(a => a.id === apptId);
                            if (appt) {
                                appt.date = newDate;
                                appt.timeSlot = newSlot;
                                setDB('appointments', appointments);
                                Toast.success(`Appointment rescheduled to ${newDate} at ${newSlot}`);
                            }
                        }
                    } catch (err) {
                        Toast.error("Failed to reschedule: " + err.message);
                    }
                    renderDoctorCalendarWorkspace(doctor);
                }
            }
        });
    });
}

// --- PATIENT BOOKING WIZARD HANDLERS ---
window.initBookingWizard = function (patient) {
    const specGrid = document.getElementById('booking-spec-grid');
    if (!specGrid) return;

    const depts = getDB('departments');
    specGrid.innerHTML = depts.map(dept => `
        <div class="spec-card p-3 border rounded text-center cursor-pointer hover-shadow position-relative" data-dept-id="${dept.id}" data-dept-name="${dept.name}" style="transition: all 0.2s ease;">
            <i class="fa-solid fa-notes-medical fs-3 text-primary mb-2"></i>
            <div class="fw-bold font-size-sm">${dept.name}</div>
            <div class="text-muted font-size-xxs">${dept.staffCount} staff</div>
        </div>
    `).join('');

    const cards = specGrid.querySelectorAll('.spec-card');
    cards.forEach(card => {
        card.addEventListener('click', function () {
            cards.forEach(c => {
                c.classList.remove('active', 'border-primary', 'bg-primary-subtle');
                const existingCheck = c.querySelector('.spec-check-icon');
                if (existingCheck) existingCheck.remove();
            });
            this.classList.add('active', 'border-primary', 'bg-primary-subtle');

            // Add small green check mark icon
            const checkEl = document.createElement('div');
            checkEl.className = 'spec-check-icon position-absolute';
            checkEl.style.top = '8px';
            checkEl.style.right = '8px';
            checkEl.style.color = '#10b981';
            checkEl.innerHTML = '<i class="fa-solid fa-circle-check fs-6"></i>';
            this.appendChild(checkEl);
            const deptId = this.getAttribute('data-dept-id');
            const deptName = this.getAttribute('data-dept-name');
            document.getElementById('booking-specialization').value = deptName;
            
            // Populate step 2 doctors
            const doctors = getDB('doctors').filter(d => d.deptId === deptId);
            const docList = document.getElementById('booking-doctors-list');
            if (doctors.length === 0) {
                docList.innerHTML = `<p class="text-muted font-size-xs text-center py-3">No doctors available in this department.</p>`;
                document.getElementById('btn-to-step3').setAttribute('disabled', 'true');
            } else {
                docList.innerHTML = doctors.map(doc => `
                    <div class="doc-booking-card p-3 border rounded d-flex align-items-center justify-content-between cursor-pointer hover-shadow mb-2" data-doc-id="${doc.id}" data-doc-name="${doc.name}">
                        <div class="d-flex align-items-center gap-3">
                            <div class="patient-avatar font-weight-bold bg-success-subtle text-success d-flex align-items-center justify-content-center" style="width:45px; height:45px; border-radius:50%;">
                                ${doc.name.replace('Dr. ', '').split(' ').map(n=>n[0]).join('')}
                            </div>
                            <div>
                                <h6 class="fw-bold mb-0 text-dark">${doc.name}</h6>
                                <span class="text-muted font-size-xs">${doc.specialization}</span>
                            </div>
                        </div>
                        <div class="text-end text-muted font-size-xxs">
                            <div class="text-success"><i class="fa-solid fa-circle-check"></i> Available</div>
                            <div>Rating: 4.9/5.0</div>
                        </div>
                    </div>
                `).join('');
                document.getElementById('btn-to-step3').setAttribute('disabled', 'true');

                const docCards = docList.querySelectorAll('.doc-booking-card');
                docCards.forEach(dCard => {
                    dCard.addEventListener('click', function () {
                        docCards.forEach(c => c.classList.remove('active', 'border-primary'));
                        this.classList.add('active', 'border-primary');
                        const docId = this.getAttribute('data-doc-id');
                        document.getElementById('booking-doctor-id').value = docId;
                        document.getElementById('btn-to-step3').removeAttribute('disabled');
                        
                        document.getElementById('booking-date').value = '';
                        document.getElementById('booking-slots-grid').innerHTML = '';
                        document.getElementById('booking-time-slot').value = '';
                        document.getElementById('btn-to-step4').setAttribute('disabled', 'true');
                    });
                });
            }
        });
    });

    const dateInput = document.getElementById('booking-date');
    if (dateInput) {
        dateInput.addEventListener('change', function () {
            const selectedDateStr = this.value;
            const docId = document.getElementById('booking-doctor-id').value;
            const slotsGrid = document.getElementById('booking-slots-grid');
            document.getElementById('btn-to-step4').setAttribute('disabled', 'true');
            document.getElementById('booking-time-slot').value = '';

            if (!selectedDateStr || !docId) return;

            const selDate = new Date(selectedDateStr);
            const isHoliday = selDate.getDay() === 0;

            const leaves = getDB('leaves') || [];
            const isOnLeave = leaves.some(l => {
                if (l.doctorId !== docId || l.status !== 'Approved') return false;
                const start = new Date(l.startDate);
                const end = new Date(l.endDate);
                return selDate >= start && selDate <= end;
            });

            if (isHoliday) {
                slotsGrid.innerHTML = `<div class="alert alert-warning font-size-xs col-12 py-2"><i class="fa-solid fa-triangle-exclamation me-1"></i>Hospital is closed on Sundays. Please choose another date.</div>`;
                return;
            }

            if (isOnLeave) {
                slotsGrid.innerHTML = `<div class="alert alert-warning font-size-xs col-12 py-2"><i class="fa-solid fa-triangle-exclamation me-1"></i>Doctor is on leave/unavailable on this date.</div>`;
                return;
            }

            const allSlots = [
                "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
                "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
            ];

            const existingAppts = getDB('appointments').filter(a => a.doctorId === docId && a.date === selectedDateStr && a.status !== 'cancelled');
            const bookedSlots = existingAppts.map(a => a.timeSlot);
            const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

            slotsGrid.innerHTML = allSlots.map(slot => {
                const isBooked = bookedSlots.includes(slot);
                if (isBooked) {
                    return `<div class="slot-btn disabled opacity-50 bg-secondary-subtle border-0 text-muted" style="cursor: not-allowed;" data-slot="${slot}">${slot} (Booked)</div>`;
                } else {
                    return `<div class="slot-btn" data-slot="${slot}">${slot}</div>`;
                }
            }).join('');

            const slotBtns = slotsGrid.querySelectorAll('.slot-btn:not(.disabled)');
            slotBtns.forEach(btn => {
                btn.addEventListener('click', function () {
                    slotsGrid.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    const selectedSlot = this.getAttribute('data-slot');
                    document.getElementById('booking-time-slot').value = selectedSlot;
                    document.getElementById('btn-to-step4').removeAttribute('disabled');
                });
            });
        });
    }
};

window.goToBookingStep = function (step) {
    document.querySelectorAll('.step-panel').forEach(panel => panel.classList.add('d-none'));
    const currentPanel = document.getElementById('step-panel-' + step);
    if (currentPanel) currentPanel.classList.remove('d-none');

    for (let i = 1; i <= 5; i++) {
        const node = document.getElementById('node-' + i);
        if (node) {
            if (i < step) {
                node.className = 'wizard-step-node completed';
                node.innerHTML = '<i class="fa-solid fa-check"></i>';
            } else if (i === step) {
                node.className = 'wizard-step-node active';
                node.innerHTML = i === 5 ? '<i class="fa-solid fa-check"></i>' : i;
            } else {
                node.className = 'wizard-step-node';
                node.innerHTML = i === 5 ? '<i class="fa-solid fa-check"></i>' : i;
            }
        }
    }

    const progressBar = document.getElementById('booking-progress');
    if (progressBar) {
        progressBar.style.width = ((step - 1) / 4) * 100 + '%';
    }
};

window.submitWizardBooking = async function () {
    const activeUser = AuthService.getCurrentUser();
    if (!activeUser || activeUser.role !== 'patient') return;

    const patientId = activeUser.patientId;
    const docId = document.getElementById('booking-doctor-id').value;
    const date = document.getElementById('booking-date').value;
    const slot = document.getElementById('booking-time-slot').value;
    const symptoms = document.getElementById('booking-symptoms').value;

    if (!docId || !date || !slot || !symptoms) {
        Toast.warning("Please ensure all booking steps are completed.");
        return;
    }

    const doctors = getDB('doctors');
    const docObj = doctors.find(d => d.id === docId);
    if (!docObj) return;

    const depts = getDB('departments');
    const deptObj = depts.find(dp => dp.id === docObj.deptId);

    const appts = getDB('appointments');
    const newApptId = 'appt-' + Date.now();
    const newAppt = {
        id: newApptId,
        patientId: patientId,
        doctorId: docId,
        doctorName: docObj.name,
        deptName: deptObj ? deptObj.name : 'Outpatient Department',
        date: date,
        timeSlot: slot,
        symptoms: symptoms,
        status: 'pending',
        type: 'Doctor Checkup'
    };

    try {
        await ApiService.createAppointment(newAppt);
        Toast.success("Appointment successfully booked!");

        document.getElementById('confirm-appt-id').innerText = newApptId;
        document.getElementById('confirm-doctor-name').innerText = docObj.name;
        document.getElementById('confirm-dept').innerText = newAppt.deptName;
        document.getElementById('confirm-datetime').innerText = `${date} at ${slot}`;

        goToBookingStep(5);

        const patients = getDB('patients');
        const patient = patients.find(p => p.id === patientId);
        if (patient) {
            renderPatientAppointments(patient);
        }
    } catch (err) {
        Toast.error("Booking failed: " + err.message);
    }
};

window.resetBookingWizard = function () {
    document.getElementById('book-appointment-form').reset();
    document.getElementById('booking-specialization').value = '';
    document.getElementById('booking-doctor-id').value = '';
    document.getElementById('booking-time-slot').value = '';
    
    document.querySelectorAll('#booking-spec-grid .spec-card').forEach(c => c.classList.remove('active'));
    document.getElementById('booking-doctors-list').innerHTML = '';
    document.getElementById('booking-slots-grid').innerHTML = '';

    document.getElementById('btn-to-step3').setAttribute('disabled', 'true');
    document.getElementById('btn-to-step4').setAttribute('disabled', 'true');

    goToBookingStep(1);
};

// --- LAB TECH WORKFLOW EXTENSIONS ---
window.updateLabTechStats = function () {
    const requests = getDB('lab_requests') || [];
    const todayStr = new Date().toISOString().split('T')[0];
    const todayRequests = requests.filter(r => r.requestDate === todayStr);

    const delayedCount = requests.filter(r => r.status !== 'completed' && r.requestDate < todayStr).length;
    const criticalCount = requests.filter(r => (r.priority === 'Critical' || r.priority === 'High') && r.status !== 'completed').length;
    
    // Dynamic Turnaround Time (TAT) Calculation
    const completedRequests = requests.filter(r => r.status === 'completed' && r.resultDate && r.requestDate);
    let avgTatHours = 4.25; // default 4 hr 15 mins
    if (completedRequests.length > 0) {
        let totalDiff = 0;
        completedRequests.forEach(r => {
            const reqTime = new Date(r.requestDate).getTime();
            const resTime = new Date(r.resultDate).getTime();
            // Fallback to 2 hours if processed same day
            const diff = Math.max(2 * 3600 * 1000, resTime - reqTime);
            totalDiff += diff;
        });
        avgTatHours = (totalDiff / completedRequests.length) / (1000 * 3600);
    }

    const hours = Math.floor(avgTatHours);
    const minutes = Math.round((avgTatHours - hours) * 60);
    const avgTatText = `${String(hours).padStart(2, '0')} hr ${String(minutes).padStart(2, '0')} mins`;

    const todayCount = todayRequests.length;
    const completedToday = todayRequests.filter(r => r.status === 'completed').length;
    const pendingToday = todayRequests.filter(r => r.status !== 'completed').length;

    const delayedEl = document.getElementById('lab-stat-delayed');
    if (delayedEl) delayedEl.innerText = delayedCount;

    const criticalEl = document.getElementById('lab-stat-critical');
    if (criticalEl) criticalEl.innerText = criticalCount;

    const tatEl = document.getElementById('lab-stat-tat');
    if (tatEl) tatEl.innerText = avgTatText;

    const todayEl = document.getElementById('lab-stat-today');
    if (todayEl) todayEl.innerText = todayCount;

    const detailsEl = document.getElementById('lab-stat-today-details');
    if (detailsEl) detailsEl.innerText = `Completed: ${completedToday} | Need Test: ${pendingToday}`;
};

window.advanceLabStatus = async function (reqId, newStatus) {
    const requests = getDB('lab_requests');
    const req = requests.find(r => r.id === reqId);
    if (req) {
        req.status = newStatus;
        setDB('lab_requests', requests);
        
        if (!ApiService.useMock) {
            try {
                await ApiService.updateLabTest(reqId, { status: newStatus });
            } catch (err) {
                Toast.error(`Failed to update backend status: ${err.message}`);
                return;
            }
        }
        
        Toast.success(`Lab request status updated to: ${newStatus.replace('_', ' ').toUpperCase()}`);
        
        const currentUser = AuthService.getCurrentUser();
        const techName = currentUser ? currentUser.name : 'Lab Technician';
        ApiService.addAuditLog('laboratory', techName, `Advanced request ${reqId} to status: ${newStatus}`);
        
        renderLabRequests();
        renderLabDashboardCharts();
        updateLabTechStats();
    }
};

// --- DOMContentLoaded Routing and Listeners ---
document.addEventListener('DOMContentLoaded', async () => {
    const activeUser = AuthService.getCurrentUser();
    const pathname = window.location.pathname;

    if (pathname.includes('-dashboard.html')) {
        if (!activeUser) {
            window.location.href = 'login.html';
            return;
        }

        const currentPageRole = pathname.substring(pathname.lastIndexOf('/') + 1).replace('-dashboard.html', '');
        if (activeUser.role !== currentPageRole) {
            window.location.href = activeUser.role + '-dashboard.html';
            return;
        }

        if (!ApiService.useMock) {
            await ApiService.syncDataFromServer();
        }

        setupDashboardNavigation();

        if (currentPageRole === 'patient') {
            initPatientPortal(activeUser);
        } else if (currentPageRole === 'doctor') {
            initDoctorPortal(activeUser);
        } else if (currentPageRole === 'labtech') {
            initLabPortal(activeUser);
        } else if (currentPageRole === 'admin') {
            initAdminPortal(activeUser);
        }

        // Helper function to trigger updates when storage or sync event occurs
        window.triggerDashboardSyncUpdate = function () {
            const freshUser = AuthService.getCurrentUser();
            if (!freshUser) return;
            if (currentPageRole === 'doctor') {
                const docId = freshUser.doctorId;
                const doctor = getDB('doctors').find(d => d.id === docId);
                if (doctor) {
                    renderDoctorDashboard(doctor);
                    renderDoctorCalendarWorkspace(doctor);
                    renderDoctorAnalytics(doctor);
                }
            } else if (currentPageRole === 'labtech') {
                renderLabRequests();
                renderLabDashboardCharts();
                updateLabTechStats();
            } else if (currentPageRole === 'patient') {
                const patId = freshUser.patientId;
                const patient = getDB('patients').find(p => p.id === patId);
                if (patient) {
                    renderPatientOverview(patient);
                    renderPatientVitalsCharts(patient);
                    renderPatientMedicalHistory(patient);
                    renderPatientPrescriptions(patient);
                    renderPatientLabReports(patient);
                    renderPatientAppointments(patient);
                    renderPatientVisits(patient);
                    renderPatientFiles(patient);
                }
            } else if (currentPageRole === 'admin') {
                renderAdminDashboard();
                renderAdminUserTable();
                renderAdminDepartments();
                renderAdminAudits();
                renderAdminAnalyticsCharts();
            }
        };

        // 1. Cross-tab synchronization via local storage changes (ideal for Mock Mode)
        window.addEventListener('storage', (e) => {
            if (e.key && e.key.startsWith('hc_')) {
                window.triggerDashboardSyncUpdate();
            }
        });

        // 2. Periodic polling for remote DB updates (ideal for Server Mode)
        setInterval(async () => {
            if (!ApiService.useMock) {
                await ApiService.syncDataFromServer();
                window.triggerDashboardSyncUpdate();
            }
        }, 5000); // Poll every 5 seconds
    }

    // LOGIN ROUTING
    if (pathname.includes('login.html')) {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            const roleCards = document.querySelectorAll('.auth-role-card');
            const selectedRoleInput = document.getElementById('login-role');

            roleCards.forEach(card => {
                card.addEventListener('click', function () {
                    roleCards.forEach(c => c.classList.remove('active'));
                    this.classList.add('active');
                    const role = this.getAttribute('data-role');
                    selectedRoleInput.value = role;

                    // Dynamically toggle the left sidebar visual panel
                    const panels = document.querySelectorAll('.role-visual-panel');
                    panels.forEach(p => {
                        p.classList.add('d-none');
                    });
                    const targetPanel = document.getElementById('panel-' + role);
                    if (targetPanel) {
                        targetPanel.classList.remove('d-none');
                    }

                    // Morph background theme gradient smoothly
                    const sidebar = document.querySelector('.auth-sidebar');
                    if (sidebar) {
                        sidebar.className = 'auth-sidebar d-none d-lg-flex flex-column justify-content-between theme-' + role;
                    }

                    // Show registration option only for patients
                    const regContainer = document.getElementById('register-container');
                    if (regContainer) {
                        if (role === 'patient') {
                            regContainer.classList.remove('d-none');
                        } else {
                            regContainer.classList.add('d-none');
                        }
                    }
                });
            });

            loginForm.addEventListener('submit', async function (e) {
                e.preventDefault();
                const email = document.getElementById('login-email').value;
                const pass = document.getElementById('login-password').value;
                const role = selectedRoleInput.value;

                if (!role) {
                    Toast.warning('Please select your user portal role before logging in.');
                    return;
                }

                try {
                    const res = await AuthService.login(email, pass, role);
                    window.location.href = res.redirect;
                } catch (err) {
                    const errEl = document.getElementById('login-error-msg');
                    if (errEl) {
                        errEl.innerText = err.message;
                        errEl.classList.remove('d-none');
                    } else {
                        Toast.error(err.message);
                    }
                }
            });

            const resetDbBtn = document.getElementById('reset-db-btn');
            if (resetDbBtn) {
                resetDbBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    localStorage.clear();
                    initializeDatabase();
                    Toast.success('Demo database reset successfully! You can now log in.');
                    // Hide any active error message
                    const errEl = document.getElementById('login-error-msg');
                    if (errEl) errEl.classList.add('d-none');
                });
            }
        }
    }

    // REGISTER ROUTING
    if (pathname.includes('register.html')) {
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', async function (e) {
                e.preventDefault();
                const name = document.getElementById('reg-name').value;
                const email = document.getElementById('reg-email').value;
                const password = document.getElementById('reg-password').value;
                const confirmPass = document.getElementById('reg-confirm-password').value;
                const role = document.getElementById('reg-role').value;

                if (password !== confirmPass) {
                    Toast.error('Passwords do not match.');
                    return;
                }

                const extraFields = {};
                if (role === 'patient') {
                    extraFields.dob = document.getElementById('reg-dob').value;
                    extraFields.gender = document.getElementById('reg-gender').value;
                    extraFields.bloodGroup = document.getElementById('reg-blood').value;
                    extraFields.phone = document.getElementById('reg-phone').value;
                    extraFields.emergencyName = document.getElementById('reg-emergency-name').value;
                    extraFields.emergencyPhone = document.getElementById('reg-emergency-phone').value;
                }

                try {
                    const res = await AuthService.register(name, email, password, role, extraFields);
                    Toast.success(res.message);
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 1000);
                } catch (err) {
                    Toast.error('Registration failed: ' + err.message);
                }
            });

            // Toggle extra fields based on role selection
            const roleSelect = document.getElementById('reg-role');
            const patientFields = document.getElementById('patient-extra-fields');
            if (roleSelect && patientFields) {
                roleSelect.addEventListener('change', function () {
                    if (this.value === 'patient') {
                        patientFields.classList.remove('d-none');
                        patientFields.querySelectorAll('input, select').forEach(el => {
                            if (el.id !== 'reg-emergency-name' && el.id !== 'reg-emergency-phone') {
                                el.setAttribute('required', 'true');
                            }
                        });
                    } else {
                        patientFields.classList.add('d-none');
                        patientFields.querySelectorAll('input, select').forEach(el => el.removeAttribute('required'));
                    }
                });
            }
        }
    }

    if (!pathname.includes('-dashboard.html') && !pathname.includes('login.html') && !pathname.includes('register.html')) {
        setupLandingPageFeatures();
    }
});

function setupLandingPageFeatures() {
    // 1. Smooth scrolling for nav-links & anchor buttons
    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 2. Active navbar items highlight (Scroll-Spy)
    const spyLinks = document.querySelectorAll('.nav-link-spy');
    const sections = Array.from(spyLinks)
        .map(link => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                return document.querySelector(href);
            }
            return null;
        })
        .filter(sec => sec !== null);

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 100; // offset for sticky navbar

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            if (scrollPosition >= top && scrollPosition < top + height) {
                currentSectionId = section.getAttribute('id');
            }
        });

        spyLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === '#' + currentSectionId || (href === '#landingPage' && currentSectionId === 'landingPage')) {
                link.classList.add('active');
            }
        });
    });

    // 3. Intelligent redirect for authenticated users
    const activeUser = AuthService.getCurrentUser();
    if (activeUser) {
        const loginLinks = document.querySelectorAll('a[href="login.html"]');
        loginLinks.forEach(link => {
            link.href = activeUser.role + '-dashboard.html';
            if (link.innerText.includes('Login')) {
                link.innerHTML = `<i class="fa-solid fa-chart-line me-1"></i> Dashboard`;
            }
        });
    }
}

// --- Theme Switcher Utility ---
window.toggleTheme = function () {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('hc_theme', newTheme);
    window.updateThemeToggleIcons(newTheme);
    window.applyChartThemeDefaults(newTheme);
};

window.initTheme = function () {
    const savedTheme = localStorage.getItem('hc_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    window.updateThemeToggleIcons(savedTheme);
    window.applyChartThemeDefaults(savedTheme);
};

window.updateThemeToggleIcons = function (theme) {
    const iconClass = theme === 'light' ? 'fa-moon' : 'fa-sun';
    const titleText = theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode';
    document.querySelectorAll('.theme-toggle-btn i').forEach(icon => {
        icon.className = `fa-solid ${iconClass} fs-6`;
    });
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
        btn.title = titleText;
    });
};

window.applyChartThemeDefaults = function (theme) {
    if (typeof Chart === 'undefined') return;
    const isDark = theme === 'dark';
    
    // Chart.js global defaults configuration
    Chart.defaults.color = isDark ? '#9ca3af' : '#64748b'; // Gray-400 vs Slate-500
    Chart.defaults.borderColor = isDark ? 'rgba(75, 85, 99, 0.3)' : 'rgba(226, 232, 240, 0.8)';
    
    if (Chart.defaults.scale && Chart.defaults.scale.grid) {
        Chart.defaults.scale.grid.color = isDark ? 'rgba(75, 85, 99, 0.2)' : 'rgba(226, 232, 240, 0.8)';
    }
};

// Auto-run theme initialization
window.initTheme();

// --- PATIENT PORTAL UPGRADE FUNCTIONS ---
function ensurePaymentsSeeded(patientId) {
    let invoices = getDB('patient_invoices') || [];
    if (invoices.filter(i => i.patientId === patientId).length === 0) {
        invoices.push(
            { id: 'INV-2841', patientId: patientId, description: 'Consultation Fee - Dr. Sarah Connor', amount: 50.00, status: 'unpaid' },
            { id: 'INV-2842', patientId: patientId, description: 'Laboratory Analysis - Lipid Profile', amount: 75.00, status: 'unpaid' },
            { id: 'INV-2843', patientId: patientId, description: 'Consultation Fee - Dr. Neil Tyson', amount: 60.00, status: 'paid', paidOn: '2026-06-25', method: 'UPI', receiptId: 'REC-5501' }
        );
        setDB('patient_invoices', invoices);
    }
    return invoices;
}

window.renderPatientPayments = function(patient) {
    const invList = document.getElementById('patient-invoices-list');
    const recList = document.getElementById('patient-receipts-list');
    if (!invList || !recList) return;

    const invoices = ensurePaymentsSeeded(patient.id).filter(i => i.patientId === patient.id);

    // Unpaid
    let invHtml = '';
    const unpaid = invoices.filter(i => i.status === 'unpaid');
    if (unpaid.length === 0) {
        invHtml = `<tr><td colspan="5" class="text-center text-muted font-size-xs">No outstanding invoices.</td></tr>`;
    } else {
        unpaid.forEach(inv => {
            invHtml += `
            <tr>
                <td><strong>${inv.id}</strong></td>
                <td>${inv.description}</td>
                <td>$${inv.amount.toFixed(2)}</td>
                <td><span class="hc-badge-status badge-pending">UNPAID</span></td>
                <td><button type="button" class="btn btn-xs btn-hc-primary font-size-xxs py-1 px-2.5" onclick="selectInvoiceToPay('${inv.id}', '${inv.description}', ${inv.amount})">Select</button></td>
            </tr>`;
        });
    }
    invList.innerHTML = invHtml;

    // Paid Receipts
    let recHtml = '';
    const paid = invoices.filter(i => i.status === 'paid');
    if (paid.length === 0) {
        recHtml = `<tr><td colspan="5" class="text-center text-muted font-size-xs">No payment history found.</td></tr>`;
    } else {
        paid.forEach(inv => {
            recHtml += `
            <tr>
                <td><strong>${inv.receiptId || 'REC-0000'}</strong></td>
                <td>${inv.description}</td>
                <td>${inv.method || 'Card'}</td>
                <td>${inv.paidOn}</td>
                <td><button type="button" class="btn btn-xs btn-outline-secondary font-size-xxs py-1 px-2" onclick="downloadReceipt('${inv.id}')"><i class="fa-solid fa-download"></i> Receipt</button></td>
            </tr>`;
        });
    }
    recList.innerHTML = recHtml;
};

window.selectInvoiceToPay = function(id, desc, amount) {
    document.getElementById('payment-active-id').value = id;
    document.getElementById('payment-active-desc').innerText = desc;
    document.getElementById('payment-active-amount').innerText = `$${amount.toFixed(2)}`;
    
    // Clear select radios
    document.querySelectorAll('input[name="payment-method"]').forEach(r => r.checked = false);
    document.getElementById('btn-pay-now').disabled = true;
};

window.selectPaymentMethod = function(method) {
    if (method === 'UPI') document.getElementById('pay-upi').checked = true;
    if (method === 'Card') document.getElementById('pay-card').checked = true;
    if (method === 'NetBanking') document.getElementById('pay-nb').checked = true;
    
    document.getElementById('btn-pay-now').disabled = false;
};

window.executeSecurePayment = async function() {
    const activeId = document.getElementById('payment-active-id').value;
    const methodEl = document.querySelector('input[name="payment-method"]:checked');
    if (!activeId || !methodEl) return;

    const method = methodEl.value;
    
    if (ApiService.useMock) {
        let invoices = getDB('patient_invoices') || [];
        let inv = invoices.find(i => i.id === activeId);
        if (inv) {
            inv.status = 'paid';
            inv.paidOn = new Date().toISOString().split('T')[0];
            inv.method = method;
            inv.receiptId = 'REC-' + Math.floor(1000 + Math.random() * 9000);
            setDB('patient_invoices', invoices);
            
            Toast.success(`Payment of $${inv.amount.toFixed(2)} completed successfully via ${method}!`);
            resetPaymentUI();
            refreshPaymentsUI();
        }
    } else {
        try {
            const res = await ApiService._request(`/billing/${activeId}/pay/`, {
                method: 'POST',
                body: JSON.stringify({ method })
            });
            Toast.success(`Payment of $${parseFloat(res.amount).toFixed(2)} completed successfully via ${method}!`);
            
            // Sync with server to get updated billing list
            await ApiService.syncDataFromServer();
            
            resetPaymentUI();
            refreshPaymentsUI();
        } catch (err) {
            Toast.error(`Payment failed: ${err.message}`);
        }
    }
};

function resetPaymentUI() {
    const elId = document.getElementById('payment-active-id');
    const elDesc = document.getElementById('payment-active-desc');
    const elAmt = document.getElementById('payment-active-amount');
    const elBtn = document.getElementById('btn-pay-now');
    if (elId) elId.value = '';
    if (elDesc) elDesc.innerText = 'Select an invoice to proceed...';
    if (elAmt) elAmt.innerText = '$0.00';
    if (elBtn) elBtn.disabled = true;
}

function refreshPaymentsUI() {
    const currentUser = JSON.parse(sessionStorage.getItem('hc_current_user'));
    if (currentUser) {
        const patients = getDB('patients') || [];
        const patient = patients.find(p => p.id === currentUser.patientId);
        if (patient) renderPatientPayments(patient);
    }
}

window.downloadReceipt = function(invId) {
    if (ApiService.useMock) {
        Toast.success(`Receipt for invoice ${invId} downloaded successfully (Mock).`);
    } else {
        window.downloadPdfReport('receipt', invId);
    }
};

window.cancelAppointment = async function(apptId) {
    let appointments = getDB('appointments') || [];
    let appt = appointments.find(a => a.id === apptId);
    if (appt) {
        appt.status = 'cancelled';
        setDB('appointments', appointments);

        if (!ApiService.useMock) {
            try {
                await ApiService.updateAppointmentStatus(apptId, 'cancelled');
            } catch (err) {
                Toast.error(`Failed to cancel appointment: ${err.message}`);
                return;
            }
        }
        
        Toast.success("Appointment cancelled successfully.");
        
        // Re-render
        const patients = getDB('patients');
        const currentUser = AuthService.getCurrentUser();
        if (currentUser) {
            const patient = patients.find(p => p.id === currentUser.patientId);
            if (patient) renderPatientAppointments(patient);
        }
    }
};

window.rescheduleAppointment = async function(apptId) {
    const newDate = prompt("Enter new Date (YYYY-MM-DD):", new Date().toISOString().split('T')[0]);
    if (!newDate) return;
    const newTime = prompt("Enter new Time Slot (e.g., 09:30 AM, 11:00 AM, 02:00 PM):", "09:30 AM");
    if (!newTime) return;

    if (!ApiService.useMock) {
        try {
            await ApiService._request(`/appointments/${apptId}/`, {
                method: 'PATCH',
                body: JSON.stringify({ date: newDate, timeSlot: newTime })
            });
            await ApiService.syncDataFromServer();
            Toast.success("Appointment rescheduled successfully!");
        } catch (err) {
            Toast.error(`Failed to reschedule appointment: ${err.message}`);
            return;
        }
    } else {
        let appts = getDB('appointments') || [];
        let appt = appts.find(a => a.id === apptId);
        if (appt) {
            appt.date = newDate;
            appt.timeSlot = newTime;
            setDB('appointments', appts);
            Toast.success("Appointment rescheduled successfully!");
        }
    }

    const patients = getDB('patients');
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
        const patient = patients.find(p => p.id === currentUser.patientId);
        if (patient) renderPatientAppointments(patient);
    }
};

window.openFeedbackModal = function(apptId, doctorName) {
    document.getElementById('feedback-appt-id').value = apptId;
    document.getElementById('feedback-doctor-name').innerText = doctorName;
    document.getElementById('feedback-rating-value').value = '0';
    document.getElementById('feedback-comments').value = '';
    
    // Clear active star highlights
    document.querySelectorAll('.rating-star-icon').forEach(s => s.style.color = '#cbd5e1'); // gray-300
    
    const modalEl = document.getElementById('feedbackRatingModal');
    if (modalEl) {
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
    }
};

window.selectRatingStar = function(rating) {
    document.getElementById('feedback-rating-value').value = rating;
    document.querySelectorAll('.rating-star-icon').forEach(s => {
        const rVal = parseInt(s.getAttribute('data-rating'));
        if (rVal <= rating) {
            s.style.color = '#eab308'; // yellow-500
        } else {
            s.style.color = '#cbd5e1'; // gray-300
        }
    });
};

window.submitPatientFeedback = async function() {
    const apptId = document.getElementById('feedback-appt-id').value;
    const rating = parseInt(document.getElementById('feedback-rating-value').value);
    const comments = document.getElementById('feedback-comments').value;
    
    if (rating === 0) {
        Toast.warning("Please select a star rating before submitting.");
        return;
    }

    const doctorName = document.getElementById('feedback-doctor-name').innerText;
    const doctorObj = getDB('doctors').find(d => d.name.toLowerCase().includes(doctorName.toLowerCase()) || doctorName.toLowerCase().includes(d.name.toLowerCase()));
    const doctorId = doctorObj ? doctorObj.id : 'doc-1';

    if (!ApiService.useMock) {
        try {
            const currentUser = AuthService.getCurrentUser();
            const patientName = currentUser ? currentUser.name : 'Patient';
            await ApiService._request('/reviews/', {
                method: 'POST',
                body: JSON.stringify({
                    doctorId: doctorId,
                    patientName: patientName,
                    apptId: apptId,
                    rating: rating,
                    comments: comments
                })
            });
            Toast.success("Thank you for your rating! Feedback submitted successfully.");
        } catch (err) {
            Toast.error(`Failed to submit feedback to backend: ${err.message}`);
            return;
        }
    } else {
        let reviews = getDB('doctor_reviews') || [];
        reviews.push({
            id: 'REV-' + Math.floor(1000 + Math.random() * 9000),
            apptId: apptId,
            doctorName: doctorName,
            rating: rating,
            comments: comments,
            date: new Date().toISOString().split('T')[0]
        });
        setDB('doctor_reviews', reviews);
        Toast.success("Thank you for your rating! Feedback submitted successfully.");
    }
    
    const modalEl = document.getElementById('feedbackRatingModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
};

window.uploadProfileAvatar = function(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const dataUrl = e.target.result;
            document.getElementById('profile-avatar-img').src = dataUrl;
            
            // Sync with Patient Profile in DB
            const patients = getDB('patients');
            const currentUser = getDB('users').find(u => u.username === localStorage.getItem('hc_username'));
            if (currentUser) {
                const patient = patients.find(p => p.id === currentUser.patientId);
                if (patient) {
                    patient.avatar = dataUrl;
                    const patIndex = patients.findIndex(p => p.id === patient.id);
                    patients[patIndex] = patient;
                    setDB('patients', patients);
                    
                    // Sync the sidebar avatar
                    const sidebarAvatar = document.getElementById('avatar-letters');
                    if (sidebarAvatar) {
                        sidebarAvatar.innerHTML = `<img src="${dataUrl}" class="rounded-circle" style="width:100%; height:100%; object-fit:cover;">`;
                    }
                    Toast.success("Profile avatar uploaded successfully!");
                }
            }
        };
        reader.readAsDataURL(input.files[0]);
    }
};
window.renderDoctorReviews = function(doctor) {
    const container = document.getElementById('doc-reviews-feed-container');
    if (!container) return;

    let reviews = getDB('doctor_reviews') || [];
    let docReviews = reviews.filter(r => r.doctorName.toLowerCase().includes(doctor.name.toLowerCase()));

    // Seed mock data if none exist
    if (docReviews.length === 0) {
        docReviews = [
            { id: 'REV-101', doctorName: doctor.name, rating: 5, comments: 'Extremely professional and polite. Explained my symptoms in detail.', date: '2026-06-27', patientName: 'Amit Sharma' },
            { id: 'REV-102', doctorName: doctor.name, rating: 4, comments: 'Good advice and checkup. Waiting queue was a bit long.', date: '2026-06-26', patientName: 'Priyanka Patel' },
            { id: 'REV-103', doctorName: doctor.name, rating: 5, comments: 'Highly qualified! The digital prescriptions were generated immediately.', date: '2026-06-24', patientName: 'Vikram Singh' }
        ];
        reviews = reviews.concat(docReviews);
        setDB('doctor_reviews', reviews);
    }

    // Calculate rating averages
    const total = docReviews.reduce((sum, r) => sum + r.rating, 0);
    const avg = docReviews.length > 0 ? (total / docReviews.length).toFixed(1) : '5.0';
    document.getElementById('doc-review-avg').innerText = `Average: ${avg} / 5.0 (${docReviews.length} Reviews)`;

    let html = '';
    docReviews.forEach(r => {
        let starsHtml = '';
        for (let i = 1; i <= 5; i++) {
            starsHtml += `<i class="fa-solid fa-star" style="color: ${i <= r.rating ? '#eab308' : '#cbd5e1'}; font-size: 0.9rem;"></i>`;
        }
        
        const initials = (r.patientName || 'Patient').split(' ').map(n=>n[0]).join('');

        html += `
        <div class="col-12 col-md-6 col-lg-4">
            <div class="hc-card p-3 shadow-sm border border-light h-100 d-flex flex-column justify-content-between">
                <div>
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <div class="d-flex align-items-center gap-2">
                            <div class="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold font-size-xs" style="width: 32px; height: 32px;">
                                ${initials}
                            </div>
                            <div>
                                <h6 class="fw-bold mb-0 text-dark font-size-xs">${r.patientName || 'Verified Patient'}</h6>
                                <span class="text-muted font-size-xxs">${r.date}</span>
                            </div>
                        </div>
                    </div>
                    <div class="mb-2 d-flex gap-1">${starsHtml}</div>
                    <p class="text-secondary font-size-xs mb-0 italic" style="line-height: 1.5;">"${r.comments}"</p>
                </div>
                <div>
                    ${r.response ? `
                        <div class="mt-3 p-2 bg-light rounded border border-light-subtle font-size-xxs text-secondary">
                            <strong>My Response:</strong> "${r.response}"
                        </div>
                    ` : `
                        <div class="mt-3">
                            <div class="input-group input-group-sm">
                                <input type="text" class="form-control font-size-xxs" id="reply-input-${r.id}" placeholder="Type a reply...">
                                <button class="btn btn-hc-primary font-size-xxs py-1" onclick="submitReviewReply('${r.id}')">Reply</button>
                            </div>
                        </div>
                    `}
                </div>
            </div>
        </div>`;
    });
    container.innerHTML = html;
};

window.submitReviewReply = async function(reviewId) {
    const input = document.getElementById(`reply-input-${reviewId}`);
    if (!input) return;
    const responseText = input.value.trim();
    if (!responseText) {
        Toast.warning("Reply cannot be empty.");
        return;
    }

    try {
        if (!ApiService.useMock) {
            await ApiService._request(`/reviews/${reviewId}/respond/`, {
                method: 'POST',
                body: JSON.stringify({ response: responseText })
            });
            await ApiService.syncDataFromServer();
        } else {
            let reviews = getDB('doctor_reviews') || [];
            const idx = reviews.findIndex(r => r.id === reviewId);
            if (idx !== -1) {
                reviews[idx].response = responseText;
                setDB('doctor_reviews', reviews);
            }
        }
        Toast.success("Reply submitted successfully!");
        
        const currentUser = AuthService.getCurrentUser();
        if (currentUser && currentUser.role === 'doctor') {
            const doctors = getDB('doctors');
            const doctor = doctors.find(d => d.id === currentUser.doctorId);
            if (doctor) renderDoctorReviews(doctor);
        }
    } catch (err) {
        Toast.error("Failed to submit reply: " + err.message);
    }
};

let consultCurrentStep = 1;

window.changeConsultStep = function(step) {
    if (step < 1 || step > 4) return;
    
    // Validate fields before proceeding forward
    if (step > consultCurrentStep) {
        if (consultCurrentStep === 1) {
            const sys = document.getElementById('consult-sys').value;
            const dia = document.getElementById('consult-dia').value;
            const hr = document.getElementById('consult-hr').value;
            if (!sys || !dia || !hr) {
                Toast.warning("Please fill in systolic/diastolic BP and Pulse Rate before continuing.");
                return;
            }
        }
        if (consultCurrentStep === 2) {
            const diag = document.getElementById('consult-diagnosis').value;
            if (!diag || !diag.trim()) {
                Toast.warning("Please specify a primary diagnosis / ICD-10 code before continuing.");
                return;
            }
        }
    }

    consultCurrentStep = step;
    
    // Show active step pane, hide others
    for (let i = 1; i <= 4; i++) {
        const pane = document.getElementById('step-pane-' + i);
        const indicator = document.getElementById('step-ind-' + i);
        if (pane) {
            if (i === step) {
                pane.classList.remove('d-none');
            } else {
                pane.classList.add('d-none');
            }
        }
        if (indicator) {
            if (i === step) {
                indicator.classList.add('active');
                indicator.style.opacity = '1';
                indicator.querySelector('.badge').className = 'badge bg-primary rounded-circle px-2.5 py-1.5 font-size-xs';
                indicator.querySelector('span:last-child').className = 'fw-bold font-size-sm text-primary';
            } else if (i < step) {
                indicator.classList.remove('active');
                indicator.style.opacity = '0.8';
                indicator.querySelector('.badge').className = 'badge bg-success rounded-circle px-2.5 py-1.5 font-size-xs';
                indicator.querySelector('span:last-child').className = 'fw-semibold font-size-sm text-success';
            } else {
                indicator.classList.remove('active');
                indicator.style.opacity = '0.5';
                indicator.querySelector('.badge').className = 'badge bg-secondary rounded-circle px-2.5 py-1.5 font-size-xs';
                indicator.querySelector('span:last-child').className = 'fw-semibold font-size-sm text-muted';
            }
        }
    }

    // Toggle navigation buttons
    const prevBtn = document.getElementById('consult-prev-btn');
    const nextBtn = document.getElementById('consult-next-btn');
    const saveBtn = document.getElementById('consult-save-btn');
    
    if (prevBtn) prevBtn.disabled = (step === 1);
    if (nextBtn) {
        if (step === 4) {
            nextBtn.classList.add('d-none');
            if (saveBtn) saveBtn.classList.remove('d-none');
        } else {
            nextBtn.classList.remove('d-none');
            if (saveBtn) saveBtn.classList.add('d-none');
        }
    }

    // Update Checklist tasks
    updateConsultChecklist();
};

window.nextConsultStep = function(dir) {
    changeConsultStep(consultCurrentStep + dir);
};

window.updateConsultChecklist = function() {
    const chkVitals = document.getElementById('chk-vitals');
    const chkDiag = document.getElementById('chk-diagnosis');
    const chkRx = document.getElementById('chk-rx');
    const chkLab = document.getElementById('chk-lab');

    // 1. Vitals Check
    const sys = document.getElementById('consult-sys').value;
    const dia = document.getElementById('consult-dia').value;
    const hr = document.getElementById('consult-hr').value;
    if (chkVitals) {
        if (sys && dia && hr) {
            chkVitals.className = 'fa-solid fa-circle-check text-success';
        } else {
            chkVitals.className = 'fa-solid fa-circle-notch text-muted';
        }
    }

    // 2. Diagnosis Check
    const diag = document.getElementById('consult-diagnosis').value;
    if (chkDiag) {
        if (diag && diag.trim()) {
            chkDiag.className = 'fa-solid fa-circle-check text-success';
        } else {
            chkDiag.className = 'fa-solid fa-circle-notch text-muted';
        }
    }

    // 3. Rx Check
    const medRows = document.querySelectorAll('#consult-med-rows .prescription-item-row');
    if (chkRx) {
        if (medRows.length > 0) {
            chkRx.className = 'fa-solid fa-circle-check text-success';
        } else {
            chkRx.className = 'fa-solid fa-circle-notch text-muted';
        }
    }

    // 4. Lab Check
    const labChecked = document.getElementById('consult-order-lab').checked;
    const followupChecked = document.getElementById('consult-followup-check').checked;
    if (chkLab) {
        if (labChecked || followupChecked) {
            chkLab.className = 'fa-solid fa-circle-check text-success';
        } else {
            chkLab.className = 'fa-solid fa-circle-notch text-muted';
        }
    }
};

window.triggerConsultationSave = function() {
    const form = document.getElementById('doctor-consult-form');
    if (form) {
        form.dispatchEvent(new Event('submit', { cancelable: true }));
    }
};

// --- IDENTITY & DETAILS VERIFICATION LOGIC ---
window.activeOtpType = 'email';

window.renderPatientVerificationBadges = function(user) {
    const emailBadge = document.getElementById('email-badge');
    const phoneBadge = document.getElementById('phone-badge');
    const btnVerifyEmail = document.getElementById('btn-verify-email');
    const btnVerifyPhone = document.getElementById('btn-verify-phone');
    const cardCreated = document.getElementById('profile-card-created');

    if (emailBadge && btnVerifyEmail) {
        if (user.emailVerified) {
            emailBadge.innerHTML = `<i class="fa-solid fa-circle-check me-1"></i>Verified`;
            emailBadge.className = "badge bg-success-subtle text-success fw-bold font-size-xxs py-1 px-2";
            btnVerifyEmail.style.display = 'none';
        } else {
            emailBadge.innerHTML = `<i class="fa-solid fa-triangle-exclamation me-1"></i>Unverified`;
            emailBadge.className = "badge bg-warning-subtle text-warning fw-bold font-size-xxs py-1 px-2";
            btnVerifyEmail.style.display = 'inline-block';
        }
    }

    if (phoneBadge && btnVerifyPhone) {
        if (user.phoneVerified) {
            phoneBadge.innerHTML = `<i class="fa-solid fa-circle-check me-1"></i>Verified`;
            phoneBadge.className = "badge bg-success-subtle text-success fw-bold font-size-xxs py-1 px-2";
            btnVerifyPhone.style.display = 'none';
        } else {
            phoneBadge.innerHTML = `<i class="fa-solid fa-triangle-exclamation me-1"></i>Unverified`;
            phoneBadge.className = "badge bg-warning-subtle text-warning fw-bold font-size-xxs py-1 px-2";
            btnVerifyPhone.style.display = 'inline-block';
        }
    }

    if (cardCreated) {
        let joinedDate = new Date(user.dateJoined || '2026-04-10');
        const options = { year: 'numeric', month: 'long' };
        cardCreated.innerText = joinedDate.toLocaleDateString('en-US', options);
    }
};

window.triggerOtpVerification = function(type) {
    window.activeOtpType = type;
    document.getElementById('otp-1').value = '';
    document.getElementById('otp-2').value = '';
    document.getElementById('otp-3').value = '';
    document.getElementById('otp-4').value = '';

    const titleEl = document.getElementById('otpModalTitle');
    const instEl = document.getElementById('otpModalInstructions');
    const activeUser = AuthService.getCurrentUser();

    if (type === 'email') {
        if (titleEl) titleEl.innerText = "Verify Email Address";
        if (instEl) instEl.innerText = `Enter the 4-digit verification code sent to ${activeUser.email}. (Enter 1234)`;
    } else {
        if (titleEl) titleEl.innerText = "Verify Phone Number";
        const phoneInput = document.getElementById('profile-phone');
        const phoneVal = phoneInput ? phoneInput.value : activeUser.phone || 'your phone';
        if (instEl) instEl.innerText = `Enter the 4-digit verification code sent to ${phoneVal}. (Enter 1234)`;
    }

    const modal = new bootstrap.Modal(document.getElementById('otpVerificationModal'));
    modal.show();
    setTimeout(() => document.getElementById('otp-1').focus(), 400);
};

window.moveOtpFocus = function(input, nextId) {
    if (input.value.length === 1) {
        const nextEl = document.getElementById(nextId);
        if (nextEl) nextEl.focus();
    }
};

window.confirmOtpVerification = async function() {
    const code = document.getElementById('otp-1').value + 
                 document.getElementById('otp-2').value + 
                 document.getElementById('otp-3').value + 
                 document.getElementById('otp-4').value;

    if (code.length < 4) {
        Toast.error("Please enter the complete 4-digit code.");
        return;
    }

    const activeUser = AuthService.getCurrentUser();
    if (window.activeOtpType === 'email') {
        activeUser.emailVerified = true;
    } else {
        activeUser.phoneVerified = true;
    }

    if (!ApiService.useMock && activeUser.id) {
        try {
            await ApiService.updateUser(activeUser.id, {
                emailVerified: activeUser.emailVerified,
                phoneVerified: activeUser.phoneVerified
            });
            await ApiService.syncDataFromServer();
        } catch (err) {
            Toast.error("Failed to update status on server: " + err.message);
            return;
        }
    } else {
        const users = getDB('users');
        const idx = users.findIndex(u => u.email === activeUser.email);
        if (idx !== -1) {
            users[idx].emailVerified = activeUser.emailVerified;
            users[idx].phoneVerified = activeUser.phoneVerified;
            setDB('users', users);
        }
    }

    sessionStorage.setItem('hc_current_user', JSON.stringify(activeUser));
    window.renderPatientVerificationBadges(activeUser);

    const modalEl = document.getElementById('otpVerificationModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();

    Toast.success(`${window.activeOtpType === 'email' ? 'Email Address' : 'Phone Number'} verified successfully!`);
};

// --- LAB WORKSPACE QUEUES AND INTERPRETATION ---
window.renderWalkinQueue = function() {
    const queueBody = document.getElementById('walkin-queue-body');
    if (!queueBody) return;

    const requests = getDB('lab_requests') || [];
    // Filter walk-in requests (which contain token in techComments)
    const walkins = requests.filter(r => r.techComments && r.techComments.includes('[Token: '));

    queueBody.innerHTML = '';
    if (walkins.length === 0) {
        queueBody.innerHTML = '<tr><td colspan="5" class="text-center text-muted font-size-xs p-4">No active walk-in requests registered today.</td></tr>';
        return;
    }

    walkins.forEach(r => {
        // Extract token
        let token = "TKN-000";
        let payment = "unpaid";
        const tokenMatches = r.techComments.match(/\[Token:\s*([A-Z0-9-]+)\]/);
        if (tokenMatches && tokenMatches[1]) token = tokenMatches[1];
        const payMatches = r.techComments.match(/\[Payment:\s*([a-z]+)\]/);
        if (payMatches && payMatches[1]) payment = payMatches[1];

        let drawBadge = `<span class="badge bg-warning-subtle text-warning font-size-xxs"><i class="fa-solid fa-hourglass-start me-1"></i>Pending Draw</span>`;
        if (r.status !== 'pending' && r.status !== 'registered' && r.status !== 'accepted') {
            drawBadge = `<span class="badge bg-success-subtle text-success font-size-xxs"><i class="fa-solid fa-circle-check me-1"></i>Collected</span>`;
        }

        let payBadge = payment === 'paid' ? 
            `<span class="badge bg-success-subtle text-success font-size-xxs">Paid</span>` :
            `<span class="badge bg-danger-subtle text-danger font-size-xxs">Unpaid</span>`;

        queueBody.innerHTML += `
        <tr>
            <td><strong class="text-primary font-size-xs">${token}</strong></td>
            <td>
                <div class="fw-bold text-dark">${r.patientName}</div>
                <div class="text-muted font-size-xxs">Ref: ${r.patientId}</div>
            </td>
            <td>
                <span class="badge bg-secondary font-size-xxs">${r.testCategory}</span>
                <div class="font-size-xs text-dark mt-1">${r.testName}</div>
            </td>
            <td>${drawBadge}</td>
            <td>${payBadge}</td>
        </tr>`;
    });
};

window.renderSpecimenQueue = function() {
    const container = document.getElementById('specimen-queue-container');
    const countEl = document.getElementById('active-queue-count');
    if (!container) return;

    const requests = getDB('lab_requests') || [];
    // Active orders are any requests that are NOT completed
    const actives = requests.filter(r => r.status !== 'completed');
    
    // Filter by search query if any
    const searchVal = document.getElementById('queue-search-input')?.value.toLowerCase().trim() || '';
    let filtered = actives;
    if (searchVal) {
        filtered = actives.filter(r => 
            r.patientName.toLowerCase().includes(searchVal) ||
            r.id.toLowerCase().includes(searchVal) ||
            r.testName.toLowerCase().includes(searchVal)
        );
    }

    if (countEl) countEl.innerText = filtered.length;

    container.innerHTML = '';
    if (filtered.length === 0) {
        container.innerHTML = '<div class="text-center py-4 text-muted font-size-xs">No active specimens in queue.</div>';
        return;
    }

    filtered.forEach(r => {
        let token = "TKN-000";
        if (r.techComments && r.techComments.includes('[Token: ')) {
            const matches = r.techComments.match(/\[Token:\s*([A-Z0-9-]+)\]/);
            if (matches && matches[1]) token = matches[1];
        } else {
            token = r.id.substring(4, 10).toUpperCase();
        }

        let priorityClass = 'badge-medium';
        if (r.priority === 'Critical') priorityClass = 'badge-critical';
        if (r.priority === 'High') priorityClass = 'badge-high';
        if (r.priority === 'Low') priorityClass = 'badge-low';

        let statusText = 'Pending';
        let statusClass = 'bg-secondary';
        if (r.status === 'sample_collected') { statusText = 'Sample Drawn'; statusClass = 'bg-warning text-dark'; }
        if (r.status === 'sample_received') { statusText = 'Received'; statusClass = 'bg-info text-dark'; }
        if (r.status === 'processing') { statusText = 'Processing'; statusClass = 'bg-primary'; }
        if (r.status === 'results_ready') { statusText = 'Awaiting Verify'; statusClass = 'bg-success'; }

        container.innerHTML += `
        <div class="specimen-queue-card p-2.5 rounded border border-light shadow-sm cursor-pointer hover-lift d-flex flex-column gap-1" id="specimen-card-${r.id}" onclick="window.selectSpecimenForEntry('${r.id}')" style="background:var(--hc-bg-card-solid); transition:all 0.25s ease;">
            <div class="d-flex justify-content-between align-items-center">
                <span class="fw-bold text-primary font-size-xs">${token}</span>
                <span class="badge ${priorityClass} font-size-xxs py-0.5 px-1.5">${r.priority || 'Medium'}</span>
            </div>
            <div class="fw-semibold text-dark font-size-xs">${r.patientName}</div>
            <div class="text-muted font-size-xxs text-truncate">${r.testName}</div>
            <div class="d-flex justify-content-between align-items-center mt-1">
                <span class="badge ${statusClass} font-size-xxs py-0.5 px-1.5">${statusText}</span>
                <span class="text-muted font-size-xxs">${r.requestDate}</span>
            </div>
        </div>`;
    });
};

window.interpretParamValue = function(inputEl, refRange) {
    let flag = 'Normal';
    const val = parseFloat(inputEl.value);
    if (!isNaN(val)) {
        if (refRange.includes('-')) {
            const parts = refRange.split('-');
            const min = parseFloat(parts[0]);
            const max = parseFloat(parts[1]);
            if (val < min) flag = 'Low';
            if (val > max) flag = 'High';
            if (val < min * 0.7 || val > max * 1.3) flag = 'Critical';
        } else if (refRange.includes('<')) {
            const limit = parseFloat(refRange.replace('<', '').trim());
            if (val >= limit) flag = 'High';
        } else if (refRange.includes('>')) {
            const limit = parseFloat(refRange.replace('>', '').trim());
            if (val <= limit) flag = 'Low';
        }
    }
    
    const badge = inputEl.closest('tr').querySelector('.param-flag');
    if (badge) {
        badge.innerText = flag;
        badge.className = `param-flag badge font-size-xxs py-1 px-2.5 fw-bold`;
        if (flag === 'Normal') badge.className += ' bg-success-subtle text-success';
        if (flag === 'Low') badge.className += ' bg-primary-subtle text-primary';
        if (flag === 'High') badge.className += ' bg-warning-subtle text-warning';
        if (flag === 'Critical') badge.className += ' bg-danger-subtle text-danger animate-pulse';
    }
};

window.saveLabDraft = function() {
    const reqId = document.getElementById('entry-request-id').value;
    if (!reqId) {
        Toast.warning("No active specimen selected.");
        return;
    }

    const rows = document.querySelectorAll('.dynamic-param-row');
    const results = [];
    rows.forEach(row => {
        const nameEl = row.querySelector('.param-name');
        const parameter = nameEl.tagName === 'INPUT' ? nameEl.value : nameEl.innerText;
        const value = row.querySelector('.param-value').value;
        results.push({ parameter, value });
    });

    const comments = document.getElementById('entry-tech-comments').value;

    localStorage.setItem('draft_' + reqId, JSON.stringify({ results, comments }));
    Toast.success("Worksheet draft saved successfully.");
};

// --- ADMIN MANAGEMENT AND UTILITIES LOGIC ---
window.switchUserSubTab = function(subtab) {
    document.querySelectorAll('#panel-users .nav-link').forEach(btn => {
        btn.classList.remove('active');
    });
    const clickedBtn = document.getElementById(`subtab-${subtab}-btn`);
    if (clickedBtn) clickedBtn.classList.add('active');

    document.getElementById('user-subpanel-registry').classList.add('d-none');
    document.getElementById('user-subpanel-approvals').classList.add('d-none');
    document.getElementById('user-subpanel-verifications').classList.add('d-none');

    document.getElementById(`user-subpanel-${subtab}`).classList.remove('d-none');

    if (subtab === 'registry') renderAdminUserTable();
    if (subtab === 'approvals') window.renderAdminApprovals();
    if (subtab === 'verifications') window.renderAdminVerifications();
};

window.renderAdminApprovals = function() {
    const container = document.getElementById('admin-approvals-list');
    const badge = document.getElementById('admin-pending-approval-badge');
    if (!container) return;

    const users = getDB('users') || [];
    const pendings = users.filter(u => u.status === 'Pending' || u.status === 'pending');

    if (badge) badge.innerText = pendings.length;

    container.innerHTML = '';
    if (pendings.length === 0) {
        container.innerHTML = '<tr><td colspan="7" class="text-center text-muted font-size-xs p-4">No pending doctor or technician approvals found.</td></tr>';
        return;
    }

    pendings.forEach(u => {
        const appDate = u.dateJoined ? new Date(u.dateJoined).toISOString().split('T')[0] : '2026-06-25';
        const dept = u.department || 'General Medicine';
        container.innerHTML += `
        <tr>
            <td class="fw-bold text-dark">${u.name}</td>
            <td><code>${u.email}</code></td>
            <td><span class="badge bg-primary-subtle text-primary font-size-xxs">${u.role.toUpperCase()}</span></td>
            <td>${dept}</td>
            <td><code>${appDate}</code></td>
            <td><span class="badge bg-warning-subtle text-warning font-size-xxs">Pending Review</span></td>
            <td>
                <div class="d-flex gap-1.5">
                    <button class="btn btn-xxs btn-success py-1" onclick="window.approveUser('${u.email}')"><i class="fa-solid fa-check me-1"></i>Approve</button>
                    <button class="btn btn-xxs btn-danger py-1" onclick="window.rejectUser('${u.email}')"><i class="fa-solid fa-xmark me-1"></i>Deny</button>
                </div>
            </td>
        </tr>`;
    });
};

window.approveUser = function(email) {
    const users = getDB('users') || [];
    const idx = users.findIndex(u => u.email === email);
    if (idx !== -1) {
        users[idx].status = 'Active';
        setDB('users', users);
        Toast.success(`User ${email} approved and set to Active!`);
        
        // Log in audit trail
        const audits = getDB('audits') || [];
        audits.unshift({
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            module: 'accounts',
            initiator: 'admin@ehrmail.com',
            action: `Staff application approved: ${email}`,
            flag: 'SECURE'
        });
        setDB('audits', audits);

        renderAdminDashboard();
        window.renderAdminApprovals();
        renderAdminAudits();
    }
};

window.rejectUser = function(email) {
    const users = getDB('users') || [];
    const idx = users.findIndex(u => u.email === email);
    if (idx !== -1) {
        users.splice(idx, 1);
        setDB('users', users);
        Toast.info(`Application for ${email} denied and deleted.`);
        
        // Log in audit trail
        const audits = getDB('audits') || [];
        audits.unshift({
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            module: 'accounts',
            initiator: 'admin@ehrmail.com',
            action: `Staff application denied: ${email}`,
            flag: 'SECURE'
        });
        setDB('audits', audits);

        renderAdminDashboard();
        window.renderAdminApprovals();
        renderAdminAudits();
    }
};

window.renderAdminVerifications = function() {
    const container = document.getElementById('admin-verifications-list');
    if (!container) return;

    const users = getDB('users') || [];
    const patients = users.filter(u => u.role === 'patient');

    container.innerHTML = '';
    if (patients.length === 0) {
        container.innerHTML = '<tr><td colspan="8" class="text-center text-muted font-size-xs p-4">No patients registered in database.</td></tr>';
        return;
    }

    patients.forEach(p => {
        const emailVerified = p.emailVerified ? 
            `<span class="badge bg-success-subtle text-success font-size-xxs"><i class="fa-solid fa-check-circle me-1"></i>Verified</span>` :
            `<span class="badge bg-warning-subtle text-warning font-size-xxs"><i class="fa-solid fa-triangle-exclamation me-1"></i>Unverified</span>`;

        const phoneVerified = p.phoneVerified ? 
            `<span class="badge bg-success-subtle text-success font-size-xxs"><i class="fa-solid fa-check-circle me-1"></i>Verified</span>` :
            `<span class="badge bg-warning-subtle text-warning font-size-xxs"><i class="fa-solid fa-triangle-exclamation me-1"></i>Unverified</span>`;

        const appDate = p.dateJoined ? new Date(p.dateJoined).toISOString().split('T')[0] : '2026-06-20';

        container.innerHTML += `
        <tr>
            <td><strong class="text-primary font-size-xs">${p.patientId || 'N/A'}</strong></td>
            <td class="fw-bold text-dark">${p.name}</td>
            <td><code>${p.email}</code></td>
            <td>${emailVerified}</td>
            <td><code>${p.phone || '+1 (555) 001-9923'}</code></td>
            <td>${phoneVerified}</td>
            <td><code>${appDate}</code></td>
            <td>
                <div class="d-flex gap-1">
                    <button class="btn btn-xxs btn-outline-primary py-0.5" onclick="window.toggleVerification('${p.email}', 'email')"><i class="fa-solid fa-envelope me-1"></i>Toggle Email</button>
                    <button class="btn btn-xxs btn-outline-primary py-0.5" onclick="window.toggleVerification('${p.email}', 'phone')"><i class="fa-solid fa-phone me-1"></i>Toggle Phone</button>
                </div>
            </td>
        </tr>`;
    });
};

window.toggleVerification = function(email, type) {
    const users = getDB('users') || [];
    const idx = users.findIndex(u => u.email === email);
    if (idx !== -1) {
        if (type === 'email') {
            users[idx].emailVerified = !users[idx].emailVerified;
        } else {
            users[idx].phoneVerified = !users[idx].phoneVerified;
        }
        setDB('users', users);
        Toast.success(`Verification status updated for ${email}.`);
        window.renderAdminVerifications();
    }
};

window.renderAdminLeaves = function() {
    const container = document.getElementById('admin-leaves-list');
    if (!container) return;

    // Seed mock leaves if empty
    let leaves = getDB('leaves') || [];
    if (leaves.length === 0) {
        leaves = [
            { id: 'LV-3921', staffName: 'Dr. Sarah Connor', role: 'doctor', dates: '2026-07-02 to 2026-07-05', reason: 'Medical Conference Attendance', status: 'pending' },
            { id: 'LV-3922', staffName: 'Alex Mercer', role: 'labtech', dates: '2026-07-10 to 2026-07-11', reason: 'Personal Family Leave', status: 'pending' }
        ];
        setDB('leaves', leaves);
    }

    container.innerHTML = '';
    const pendings = leaves.filter(l => l.status === 'pending');
    if (pendings.length === 0) {
        container.innerHTML = '<tr><td colspan="5" class="text-center text-muted font-size-xs p-4">No active staff leave requests pending.</td></tr>';
        return;
    }

    pendings.forEach(l => {
        container.innerHTML += `
        <tr>
            <td>
                <div class="fw-bold text-dark">${l.staffName}</div>
                <div class="text-muted font-size-xxs">${l.role.toUpperCase()}</div>
            </td>
            <td><code>${l.dates}</code></td>
            <td class="font-size-xs">${l.reason}</td>
            <td><span class="badge bg-warning-subtle text-warning font-size-xxs">Pending</span></td>
            <td>
                <div class="d-flex gap-1">
                    <button class="btn btn-xxs btn-success py-1" onclick="window.approveLeave('${l.id}')"><i class="fa-solid fa-check me-1"></i>Approve</button>
                    <button class="btn btn-xxs btn-danger py-1" onclick="window.rejectLeave('${l.id}')"><i class="fa-solid fa-xmark me-1"></i>Deny</button>
                </div>
            </td>
        </tr>`;
    });
};

window.approveLeave = function(leaveId) {
    const leaves = getDB('leaves') || [];
    const idx = leaves.findIndex(l => l.id === leaveId);
    if (idx !== -1) {
        leaves[idx].status = 'Approved';
        setDB('leaves', leaves);
        Toast.success(`Leave request ${leaveId} approved successfully.`);

        // Log audit
        const audits = getDB('audits') || [];
        audits.unshift({
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            module: 'leaves',
            initiator: 'admin@ehrmail.com',
            action: `Leave request approved: ${leaveId}`,
            flag: 'SECURE'
        });
        setDB('audits', audits);

        renderAdminDashboard();
        window.renderAdminLeaves();
        renderAdminAudits();
    }
};

window.rejectLeave = function(leaveId) {
    const leaves = getDB('leaves') || [];
    const idx = leaves.findIndex(l => l.id === leaveId);
    if (idx !== -1) {
        leaves[idx].status = 'Rejected';
        setDB('leaves', leaves);
        Toast.info(`Leave request ${leaveId} rejected.`);

        // Log audit
        const audits = getDB('audits') || [];
        audits.unshift({
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            module: 'leaves',
            initiator: 'admin@ehrmail.com',
            action: `Leave request rejected: ${leaveId}`,
            flag: 'SECURE'
        });
        setDB('audits', audits);

        renderAdminDashboard();
        window.renderAdminLeaves();
        renderAdminAudits();
    }
};

window.triggerGlobalBroadcast = function(event) {
    event.preventDefault();
    const title = document.getElementById('broadcast-title').value;
    const msg = document.getElementById('broadcast-message').value;
    const target = document.getElementById('broadcast-target').value;

    const broadcasts = getDB('broadcasts') || [];
    broadcasts.push({
        id: 'BC-' + Date.now(),
        title: title,
        message: msg,
        target: target,
        date: new Date().toISOString().split('T')[0]
    });
    setDB('broadcasts', broadcasts);

    Toast.success(`Broadcast announcement published successfully!`);
    document.getElementById('admin-broadcast-form').reset();

    // Log audit
    const audits = getDB('audits') || [];
    audits.unshift({
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        module: 'system',
        initiator: 'admin@ehrmail.com',
        action: `Global system broadcast published: ${title}`,
        flag: 'SECURE'
    });
    setDB('audits', audits);
    renderAdminAudits();
};

window.saveHospitalSettings = function(event) {
    event.preventDefault();
    const name = document.getElementById('settings-hospital-name').value;
    const email = document.getElementById('settings-hospital-email').value;
    const phone = document.getElementById('settings-hospital-phone').value;
    const license = document.getElementById('settings-hospital-license').value;

    const config = { name, email, phone, license };
    localStorage.setItem('hc_hospital_settings', JSON.stringify(config));
    Toast.success("Hospital configuration updated successfully!");

    // Log audit
    const audits = getDB('audits') || [];
    audits.unshift({
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        module: 'system',
        initiator: 'admin@ehrmail.com',
        action: `Hospital general configurations updated.`,
        flag: 'SECURE'
    });
    setDB('audits', audits);
    renderAdminAudits();
};

window.triggerDbBackup = function() {
    Toast.info("Compiling local database tables...");
    setTimeout(() => {
        const todayStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
        document.getElementById('admin-last-backup').innerHTML = `<i class="fa-solid fa-clock-rotate-left me-1.5"></i>Today at ${todayStr.split(' ')[1]}`;
        
        Toast.success("PostgreSQL Database Backup generated and saved to Cloud storage bucket!");
        
        // Log audit
        const audits = getDB('audits') || [];
        audits.unshift({
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            module: 'system',
            initiator: 'admin@ehrmail.com',
            action: `PostgreSQL database backup snapshot generated.`,
            flag: 'SECURE'
        });
        setDB('audits', audits);
        renderAdminAudits();
    }, 1200);
};

window.checkDbHealth = function() {
    Toast.info("Running PostgreSQL table indexing check...");
    setTimeout(() => {
        Toast.success("Database health checks complete: All indices are valid (100% integrity).");
        
        // Log audit
        const audits = getDB('audits') || [];
        audits.unshift({
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            module: 'system',
            initiator: 'admin@ehrmail.com',
            action: `Diagnostics database integrity audit finished. Status: HEALTHY`,
            flag: 'SECURE'
        });
        setDB('audits', audits);
        renderAdminAudits();
    }, 1000);
};

window.renderAdminEmailLogs = function() {
    const container = document.getElementById('admin-email-logs');
    if (!container) return;

    const mockEmailLogs = [
        { recipient: 'john.doe@ehrmail.com', subject: 'Lab Report Released: CBC', status: 'Sent', time: '10 mins ago' },
        { recipient: 'emma.watson@ehrmail.com', subject: 'Verification Security Code', status: 'Sent', time: '1 hr ago' },
        { recipient: 'sarah.connor@ehrmail.com', subject: 'New Patient Scheduled', status: 'Sent', time: '2 hrs ago' }
    ];

    container.innerHTML = '';
    mockEmailLogs.forEach(l => {
        container.innerHTML += `
        <div class="d-flex align-items-center justify-content-between p-2 rounded border border-light" style="background:var(--hc-bg-card-solid);">
            <div>
                <strong class="text-dark d-block font-size-xs">${l.recipient}</strong>
                <span class="text-muted d-block" style="font-size: 10px;">${l.subject}</span>
            </div>
            <div class="text-end">
                <span class="badge bg-success-subtle text-success font-size-xxs mb-1">${l.status}</span>
                <span class="text-muted d-block" style="font-size: 9px;">${l.time}</span>
            </div>
        </div>`;
    });
};
