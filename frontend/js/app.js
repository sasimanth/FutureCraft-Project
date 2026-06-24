/**
 * EHR & Laboratory Management Portal - Core JavaScript File
 * Developed by Antigravity AI (FutureCraft Project)
 * Contains Mock Database, Asynchronous ApiService (Django REST Mapped), Form Validators,
 * Chart Initializers, Role Guards, and Interactive Dashboard Controllers.
 */

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
        dob: '1990-04-15',
        gender: 'Female',
        bloodGroup: 'A+',
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
        name: 'James Smith',
        email: 'james.smith@ehrmail.com',
        dob: '1976-11-05',
        gender: 'Male',
        bloodGroup: 'B+',
        phone: '+1 (555) 018-7766',
        emergencyName: 'Mary Smith',
        emergencyPhone: '+1 (555) 018-7760',
        allergies: 'None',
        vitalsHistory: [
            { date: '2026-06-15', bpSystolic: 125, bpDiastolic: 82, heartRate: 74, temp: 98.4, weight: 82 }
        ],
        medicalHistory: [
            { date: '2026-04-10', condition: 'Type 2 Diabetes', diagnosedBy: 'Dr. Sarah Connor', status: 'Managed' }
        ]
    }
];

const DEFAULT_USERS = [
    { email: 'admin@ehrmail.com', password: 'password123', name: 'Administrator', role: 'admin' },
    { email: 'sarah.connor@ehrmail.com', password: 'password123', name: 'Dr. Sarah Connor', role: 'doctor', doctorId: 'doc-1' },
    { email: 'robert.chen@ehrmail.com', password: 'password123', name: 'Dr. Robert Chen', role: 'doctor', doctorId: 'doc-2' },
    { email: 'labtech@ehrmail.com', password: 'password123', name: 'Alex Mercer', role: 'labtech' },
    { email: 'john.doe@ehrmail.com', password: 'password123', name: 'John Doe', role: 'patient', patientId: 'pat-1' },
    { email: 'emma.watson@ehrmail.com', password: 'password123', name: 'Emma Watson', role: 'patient', patientId: 'pat-2' },
    { email: 'james.smith@ehrmail.com', password: 'password123', name: 'James Smith', role: 'patient', patientId: 'pat-3' }
];

const DEFAULT_APPOINTMENTS = [
    { id: 'appt-1', patientId: 'pat-1', doctorId: 'doc-1', doctorName: 'Dr. Sarah Connor', deptName: 'General Medicine', date: '2026-06-24', timeSlot: '09:30 AM', symptoms: 'Follow-up on blood pressure regulation.', status: 'Waiting', priority: 'High', type: 'Doctor Checkup' },
    { id: 'appt-2', patientId: 'pat-2', doctorId: 'doc-1', doctorName: 'Dr. Sarah Connor', deptName: 'General Medicine', date: '2026-06-24', timeSlot: '10:30 AM', symptoms: 'Mild headache and fatigue.', status: 'In Consultation', priority: 'Medium', type: 'Doctor Checkup' },
    { id: 'appt-3', patientId: 'pat-3', doctorId: 'doc-1', doctorName: 'Dr. Sarah Connor', deptName: 'General Medicine', date: '2026-06-24', timeSlot: '11:00 AM', symptoms: 'Routine checkup and blood sugar review.', status: 'Completed', priority: 'Low', type: 'Doctor Checkup' }
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
    }
];

const DEFAULT_VISITS = [
    { id: 'v-1', patientId: 'pat-1', date: '2026-05-01', department: 'General Medicine', doctorName: 'Dr. Sarah Connor', reason: 'Initial consult for blood pressure tracking.' },
    { id: 'v-2', patientId: 'pat-1', date: '2026-05-15', department: 'General Medicine', doctorName: 'Dr. Sarah Connor', reason: 'Follow-up visit and prescription adjustment.' },
    { id: 'v-3', patientId: 'pat-2', date: '2026-06-10', department: 'Pediatrics', doctorName: 'Dr. Emily Watson', reason: 'Routine health assessment & vitamin checkup.' }
];

const DEFAULT_FILES = [
    { id: 'f-1', patientId: 'pat-1', name: 'Lab_CBC_May_Report.pdf', size: '1.4 MB', type: 'application/pdf', date: '2026-05-16' }
];

const DEFAULT_AUDITS = [
    { timestamp: '2026-06-22 09:30:00', module: 'accounts', initiator: 'admin@ehrmail.com', action: 'Administrator console session started.', flag: 'SECURE' },
    { timestamp: '2026-06-21 16:15:34', module: 'laboratory', initiator: 'labtech@ehrmail.com', action: 'Authorized results compiled for complete blood count CBC.', flag: 'SECURE' },
    { timestamp: '2026-06-20 11:22:12', module: 'patients', initiator: 'system', action: 'Patient profile record pat-1 demographics update.', flag: 'SECURE' },
    { timestamp: '2026-06-20 09:44:22', module: 'doctors', initiator: 'sarah.connor@ehrmail.com', action: 'New digital prescription rx-1 issued.', flag: 'SECURE' }
];

const DEFAULT_TASKS = [
    { id: 'task-1', doctorId: 'doc-1', title: 'Review CBC Lab Results for John Doe', priority: 'High', category: 'Lab Review', status: 'pending', date: '2026-06-22' },
    { id: 'task-2', doctorId: 'doc-1', title: 'Follow-up on Emma Watson blood pressure management', priority: 'Medium', category: 'Follow-up', status: 'pending', date: '2026-06-23' },
    { id: 'task-3', doctorId: 'doc-1', title: 'Sign off on monthly clinical department report', priority: 'Low', category: 'Admin', status: 'completed', date: '2026-06-21' },
    { id: 'task-4', doctorId: 'doc-1', title: 'Call pharmacy regarding Lisinopril supply', priority: 'High', category: 'Patient Care', status: 'pending', date: '2026-06-23' }
];

// Seed databases in localStorage if empty
function initializeDatabase() {
    if (localStorage.getItem('hc_seeded') !== 'v4') {
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
        localStorage.setItem('hc_tasks', JSON.stringify(DEFAULT_TASKS));
        localStorage.setItem('hc_seeded', 'v4');
        console.log('EHR Laboratory Portal Database Seeded Successfully (v4)!');
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
    useMock: true, // Toggle this to FALSE to direct requests to actual Django backend

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

    // --- Authentication APIs ---
    // POST /api/login/
    login: async function (email, password, role) {
        if (this.useMock) {
            await new Promise(r => setTimeout(r, 200));
            const users = getDB('users');
            const user = users.find(u => u.email === email && u.password === password && u.role === role);
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
            return this._request('/patients/', { method: 'POST', body: JSON.stringify(data) });
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
            return this._request(`/patients/${id}/`, { method: 'PUT', body: JSON.stringify(data) });
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
            return this._request(`/patients/${id}/`, { method: 'DELETE' });
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
            return data;
        } else {
            return this._request('/consultations/', { method: 'POST', body: JSON.stringify(data) });
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
            return this._request('/prescriptions/', { method: 'POST', body: JSON.stringify(data) });
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
            return this._request('/lab-tests/', { method: 'POST', body: JSON.stringify(data) });
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
            return this._request(`/lab-tests/${id}/`, { method: 'PUT', body: JSON.stringify(data) });
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
            return this._request('/appointments/', { method: 'POST', body: JSON.stringify(data) });
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

    // Book Appointment Form Handler
    const apptForm = document.getElementById('book-appointment-form');
    if (apptForm) {
        const doctorSelect = document.getElementById('appt-doctor');
        const doctors = getDB('doctors');
        doctorSelect.innerHTML = '<option value="">Select Doctor</option>';
        doctors.forEach(doc => {
            doctorSelect.innerHTML += `<option value="${doc.id}">${doc.name} (${doc.specialization})</option>`;
        });

        apptForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const doctorId = document.getElementById('appt-doctor').value;
            const apptDate = document.getElementById('appt-date').value;
            const apptTime = document.getElementById('appt-time').value;
            const apptSymptoms = document.getElementById('appt-symptoms').value;

            if (!FormValidator.validateRequired({ doctorId, apptDate, apptTime })) {
                showToast("Please fill out all required booking fields.");
                return;
            }

            const docObj = doctors.find(d => d.id === doctorId);
            const depts = getDB('departments');
            const deptObj = depts.find(dp => dp.id === docObj.deptId);
            const appts = getDB('appointments');
            const newAppt = {
                id: 'appt-' + (appts.length + 1),
                patientId: patient.id,
                doctorId: doctorId,
                doctorName: docObj.name,
                deptName: deptObj ? deptObj.name : 'Outpatient Department',
                date: apptDate,
                timeSlot: apptTime,
                symptoms: apptSymptoms,
                status: 'confirmed',
                type: 'Doctor Checkup'
            };

            appts.push(newAppt);
            setDB('appointments', appts);
            showToast("Appointment successfully booked and synced!");
            apptForm.reset();
            renderPatientAppointments(patient);
            document.querySelector('[data-panel="panel-appointments"]').click();
        });
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

        profileForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const phone = document.getElementById('profile-phone').value;
            if (!FormValidator.validatePhone(phone)) {
                alert("Please enter a valid 10-digit phone number.");
                return;
            }

            patient.dob = document.getElementById('profile-dob').value;
            patient.gender = document.getElementById('profile-gender').value;
            patient.bloodGroup = document.getElementById('profile-blood').value;
            patient.phone = phone;
            patient.emergencyName = document.getElementById('profile-emergency-name').value;
            patient.emergencyPhone = document.getElementById('profile-emergency-phone').value;
            patient.allergies = document.getElementById('profile-allergies').value;

            const patIndex = patients.findIndex(p => p.id === patient.id);
            patients[patIndex] = patient;
            setDB('patients', patients);

            showToast("Profile settings updated successfully!");
            renderPatientOverview(patient);
        });
    }
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

function renderPatientVitalsCharts(patient) {
    const ctx = document.getElementById('patientVitalsChart');
    if (!ctx) return;

    const labels = patient.vitalsHistory.map(v => v.date);
    const sysData = patient.vitalsHistory.map(v => v.bpSystolic);
    const diaData = patient.vitalsHistory.map(v => v.bpDiastolic);
    const hrData = patient.vitalsHistory.map(v => v.heartRate);

    new Chart(ctx, {
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
                <p class="text-muted mb-0">Diagnosed by: <strong>${h.diagnosedBy}</strong> | Status: <span class="badge bg-success">${h.status}</span></p>
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
        rxList.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No prescriptions issued.</td></tr>`;
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
                <td>${med.duration}</td>
                <td>${med.instructions}</td>
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
    const apptList = document.getElementById('patient-appts-list');
    if (!apptList) return;

    const appts = getDB('appointments').filter(ap => ap.patientId === patient.id);
    if (appts.length === 0) {
        apptList.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No consultations scheduled.</td></tr>`;
        return;
    }

    let html = '';
    appts.forEach(ap => {
        html += `
        <tr>
            <td><strong>${ap.date}</strong></td>
            <td>${ap.timeSlot}</td>
            <td>${ap.doctorName}</td>
            <td>${ap.deptName}</td>
            <td>${ap.symptoms || 'Routine follow-up'}</td>
            <td><span class="hc-badge-status badge-active">${ap.status.toUpperCase()}</span></td>
        </tr>`;
    });
    apptList.innerHTML = html;
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
            <td>${v.reason}</td>
        </tr>`;
    });
    visitsList.innerHTML = html;
}

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
        html += `
        <div class="hc-file-preview-card">
            <div class="hc-file-preview-info">
                <i class="fa-solid fa-file-pdf hc-file-preview-icon"></i>
                <div>
                    <h6 class="mb-0 fw-bold font-size-sm text-dark">${f.name}</h6>
                    <span class="text-muted font-size-xs">${f.size} | Uploaded ${f.date}</span>
                </div>
            </div>
            <button class="btn btn-sm btn-link text-danger p-0" onclick="deletePatientFile('${f.id}', '${patient.id}')"><i class="fa-solid fa-trash-can"></i></button>
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

function handlePatientFileUpload(file, patient) {
    if (!FormValidator.validateFileSize(file, 5)) {
        alert("File size exceeds 5MB limit.");
        return;
    }
    const allowed = ['application/pdf', 'image/png', 'image/jpeg'];
    if (!allowed.includes(file.type)) {
        alert("Invalid file type. Please upload a PDF or image.");
        return;
    }

    const files = getDB('files');
    const newFile = {
        id: 'f-' + (files.length + 1),
        patientId: patient.id,
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        type: file.type,
        date: new Date().toISOString().split('T')[0]
    };

    files.push(newFile);
    setDB('files', files);
    showToast(`Successfully uploaded: ${file.name}`);
    renderPatientFiles(patient);
}

window.deletePatientFile = function (fileId, patientId) {
    let files = getDB('files');
    files = files.filter(f => f.id !== fileId);
    setDB('files', files);
    showToast("File document deleted.");
    const patient = getDB('patients').find(p => p.id === patientId);
    if (patient) renderPatientFiles(patient);
};


// --- DOCTOR DASHBOARD WORKFLOWS ---
let doctorConsultsChartInstance = null;
let doctorConsultsTrendChartInstance = null;
let doctorApptStatusChartInstance = null;
let doctorSpecialtyChartInstance = null;
let currentCalendarView = 'month'; // 'month' | 'week' | 'day'
let currentCalendarDate = new Date(2026, 5, 22); // Default to Monday, June 22, 2026
let currentDirectoryPage = 1;
const directoryPageSize = 5;

function initDarkMode() {
    const isDarkMode = localStorage.getItem('hc_dark_mode') === 'true';
    const btn = document.getElementById('dark-mode-toggle-btn');
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        if (btn) btn.innerHTML = '<i class="fa-solid fa-sun text-warning"></i>';
    } else {
        document.body.classList.remove('dark-mode');
        if (btn) btn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }
    if (btn) {
        btn.replaceWith(btn.cloneNode(true));
        const newBtn = document.getElementById('dark-mode-toggle-btn');
        newBtn.addEventListener('click', toggleDarkMode);
    }
}

function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('dark-mode');
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('hc_dark_mode', isDarkMode ? 'true' : 'false');
    
    const btn = document.getElementById('dark-mode-toggle-btn');
    if (btn) {
        btn.innerHTML = isDarkMode 
            ? '<i class="fa-solid fa-sun text-warning"></i>' 
            : '<i class="fa-solid fa-moon"></i>';
    }
    
    const activeUser = JSON.parse(sessionStorage.getItem('hc_current_user'));
    if (activeUser && activeUser.role === 'doctor') {
        const doctor = getDB('doctors').find(d => d.id === activeUser.doctorId);
        if (doctor) {
            renderDoctorAnalytics(doctor);
            renderMiniPerformanceChart();
        }
    }
}

function setupReportsDateFilters(doctor) {
    const dateFilter = document.getElementById('reports-date-filter');
    const customDates = document.getElementById('reports-custom-dates');
    if (dateFilter && customDates) {
        dateFilter.replaceWith(dateFilter.cloneNode(true));
        const newDateFilter = document.getElementById('reports-date-filter');
        newDateFilter.addEventListener('change', function () {
            if (this.value === 'custom') {
                customDates.classList.remove('d-none');
            } else {
                customDates.classList.add('d-none');
            }
        });
    }

    const applyBtn = document.getElementById('apply-reports-filter');
    if (applyBtn) {
        applyBtn.replaceWith(applyBtn.cloneNode(true));
        const newApplyBtn = document.getElementById('apply-reports-filter');
        newApplyBtn.addEventListener('click', function () {
            renderDoctorAnalytics(doctor);
        });
    }
}

function initDoctorPortal(doctorUser) {
    const docId = doctorUser.doctorId;
    const doctors = getDB('doctors');
    const doctor = doctors.find(d => d.id === docId);
    if (!doctor) return;

    document.getElementById('user-display-name').innerText = doctor.name;
    document.getElementById('avatar-letters').innerText = doctor.name.replace('Dr. ', '').split(' ').map(n=>n[0]).join('');

    initDarkMode();
    renderDoctorDashboard(doctor);
    setupDoctorPatientSelectors();
    renderDoctorPatientDirectory();
    setupPatientDirectoryListeners();
    setupDoctorCalendarListeners();
    renderDoctorCalendar(2026, 5); // June is 0-indexed month 5
    setupReportsDateFilters(doctor);
    renderDoctorAnalytics(doctor);
    renderDoctorTasks(doctor);

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

    // Task list Filters
    const taskPriorityFilter = document.getElementById('task-filter-priority');
    const taskStatusFilter = document.getElementById('task-filter-status');
    if (taskPriorityFilter) {
        taskPriorityFilter.addEventListener('change', () => renderDoctorTasks(doctor));
    }
    if (taskStatusFilter) {
        taskStatusFilter.addEventListener('change', () => renderDoctorTasks(doctor));
    }

    // Add Task Form Submit
    const addTaskForm = document.getElementById('add-doctor-task-form');
    if (addTaskForm) {
        addTaskForm.addEventListener('submit', function (e) {
            e.preventDefault();
            submitDoctorTask(doctor);
        });
    }

    // Setup real-time vitals status checkers
    setupVitalsStatusWatchers();
}

function renderDoctorDashboard(doctor) {
    const appointments = getDB('appointments').filter(ap => ap.doctorId === doctor.id);
    const labs = getDB('lab_requests').filter(l => l.doctorName === doctor.name);
    const patients = getDB('patients');

    // Welcome message stats binding
    const todayApptsCount = appointments.length;
    const pendingLabsCount = labs.filter(l => l.status === 'pending').length;
    const welcomeDoctorName = document.getElementById('welcome-doctor-name');
    if (welcomeDoctorName) {
        welcomeDoctorName.innerText = doctor.name;
    }
    const welcomeSummary = document.getElementById('welcome-summary-text');
    if (welcomeSummary) {
        welcomeSummary.innerText = `You have ${todayApptsCount} appointment${todayApptsCount === 1 ? '' : 's'} and ${pendingLabsCount} pending lab request${pendingLabsCount === 1 ? '' : 's'} today.`;
    }

    // Summary Cards binding
    const elAppts = document.getElementById('doc-today-appts');
    if (elAppts) elAppts.innerText = todayApptsCount;

    const elLabs = document.getElementById('doc-pending-labs');
    if (elLabs) elLabs.innerText = pendingLabsCount;

    // Seen today, Completed, Pending Rx, Follow ups
    let statsSeen = localStorage.getItem('hc_stats_seen') ? parseInt(localStorage.getItem('hc_stats_seen')) : 15;
    let statsCompleted = localStorage.getItem('hc_stats_completed') ? parseInt(localStorage.getItem('hc_stats_completed')) : 12;
    let statsPendingRx = localStorage.getItem('hc_stats_pending_rx') ? parseInt(localStorage.getItem('hc_stats_pending_rx')) : 4;
    let statsFollowups = localStorage.getItem('hc_stats_followups') ? parseInt(localStorage.getItem('hc_stats_followups')) : 6;

    const elSeen = document.getElementById('doc-patients-seen');
    if (elSeen) elSeen.innerText = statsSeen;

    const elCompleted = document.getElementById('doc-completed-consults');
    if (elCompleted) elCompleted.innerText = statsCompleted;

    const elRx = document.getElementById('doc-pending-rx');
    if (elRx) elRx.innerText = statsPendingRx;

    const elFollowups = document.getElementById('doc-followups-due');
    if (elFollowups) elFollowups.innerText = statsFollowups;

    // Quick Actions Bar listeners setup
    const qaNewConsult = document.getElementById('qa-new-consult');
    if (qaNewConsult) {
        qaNewConsult.onclick = () => {
            document.querySelector('[data-panel="panel-consultation"]').click();
        };
    }
    const qaNewPrescription = document.getElementById('qa-new-prescription');
    if (qaNewPrescription) {
        qaNewPrescription.onclick = () => {
            document.querySelector('[data-panel="panel-consultation"]').click();
            setTimeout(() => {
                const addMedBtn = document.getElementById('doc-add-med-btn');
                if (addMedBtn) addMedBtn.click();
            }, 150);
        };
    }
    const qaScheduleAppt = document.getElementById('qa-schedule-appt');
    if (qaScheduleAppt) {
        qaScheduleAppt.onclick = () => {
            document.querySelector('[data-panel="panel-schedule"]').click();
        };
    }

    // Active Consultation Queue rendering
    const apptQueue = document.getElementById('doctor-appt-queue');
    if (apptQueue) {
        if (appointments.length === 0) {
            apptQueue.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No appointments scheduled for today.</td></tr>`;
        } else {
            let html = '';
            appointments.forEach(ap => {
                const pat = patients.find(p => p.id === ap.patientId);
                
                // Get Status Badge
                let statusBadge = '';
                const s = (ap.status || 'Waiting').toLowerCase();
                if (s === 'waiting') {
                    statusBadge = '<span class="badge bg-success-light text-success fw-bold"><i class="fa-solid fa-circle-dot me-1"></i>Waiting</span>';
                } else if (s === 'in consultation' || s === 'consulting') {
                    statusBadge = '<span class="badge bg-warning-light text-warning fw-bold"><i class="fa-solid fa-spinner fa-spin me-1"></i>In Consultation</span>';
                } else if (s === 'completed') {
                    statusBadge = '<span class="badge bg-info-light text-info fw-bold"><i class="fa-solid fa-circle-check me-1"></i>Completed</span>';
                } else if (s === 'cancelled') {
                    statusBadge = '<span class="badge bg-danger-light text-danger fw-bold"><i class="fa-solid fa-circle-xmark me-1"></i>Cancelled</span>';
                } else {
                    statusBadge = `<span class="badge bg-secondary-light text-secondary fw-bold">${ap.status}</span>`;
                }

                // Get Priority Badge
                let priorityBadge = '';
                const p = (ap.priority || 'Low').toLowerCase();
                if (p === 'high') {
                    priorityBadge = '<span class="badge bg-danger text-white fw-bold"><i class="fa-solid fa-triangle-exclamation me-1"></i>High</span>';
                } else if (p === 'medium') {
                    priorityBadge = '<span class="badge bg-warning text-dark fw-bold">Medium</span>';
                } else {
                    priorityBadge = '<span class="badge bg-success text-white fw-bold">Low</span>';
                }

                html += `
                <tr class="patient-row">
                    <td><strong>${ap.timeSlot}</strong></td>
                    <td>
                        <div class="fw-bold text-dark">${pat ? pat.name : 'Unknown'}</div>
                        <div class="text-muted font-size-xs mt-0.5">
                            <span class="me-2"><i class="fa-solid fa-calendar me-1"></i>${pat ? (new Date().getFullYear() - new Date(pat.dob).getFullYear()) + ' Years' : '--'}</span>
                            <span class="me-2"><i class="fa-solid fa-droplet text-danger me-1"></i>${pat ? pat.bloodGroup : '--'}</span>
                            <span><i class="fa-solid fa-triangle-exclamation text-warning me-1"></i>Allergy: ${pat && pat.allergies && pat.allergies !== 'None' ? pat.allergies : 'None'}</span>
                        </div>
                    </td>
                    <td>${statusBadge}</td>
                    <td>${priorityBadge}</td>
                    <td>
                        <div class="d-flex justify-content-end gap-1">
                            <button class="btn btn-xs btn-outline-primary" onclick="startConsultation('${ap.patientId}', '${ap.id}')" title="Consult"><i class="fa-solid fa-stethoscope me-1"></i>Consult</button>
                            <button class="btn btn-xs btn-outline-info" onclick="teleconsultPatient('${ap.patientId}')" title="Video Call"><i class="fa-solid fa-video"></i></button>
                            <button class="btn btn-xs btn-outline-secondary" onclick="quickEHRPreview('${ap.patientId}')" title="View History"><i class="fa-solid fa-history"></i></button>
                        </div>
                    </td>
                </tr>`;
            });
            apptQueue.innerHTML = html;
        }
    }

    // Critical Alerts Section rendering
    const alertsContainer = document.getElementById('doctor-critical-alerts');
    if (alertsContainer) {
        const mockAlerts = [
            { patient: 'John Doe', alert: 'Penicillin Allergy', icon: 'fa-triangle-exclamation', color: 'text-danger', bg: 'bg-danger-light border-danger-subtle' },
            { patient: 'Emma Watson', alert: 'High Blood Pressure', icon: 'fa-heart-circle-exclamation', color: 'text-warning', bg: 'bg-warning-light border-warning-subtle' }
        ];
        let html = '';
        mockAlerts.forEach(a => {
            html += `
            <div class="col-md-6">
                <div class="p-3 rounded border d-flex align-items-center gap-3 ${a.bg}">
                    <div style="font-size: 1.5rem;" class="${a.color}"><i class="fa-solid ${a.icon}"></i></div>
                    <div>
                        <h6 class="fw-bold mb-0.5 text-dark" style="font-size: 0.9rem;">${a.patient}</h6>
                        <p class="mb-0 text-muted font-size-xs fw-semibold">${a.alert}</p>
                    </div>
                </div>
            </div>`;
        });
        alertsContainer.innerHTML = html;
    }

    // Today's Schedule timeline rendering
    const scheduleList = document.getElementById('doctor-today-schedule-list');
    if (scheduleList) {
        let html = '';
        if (appointments.length === 0) {
            html = '<div class="text-center py-3 text-muted font-size-xs">No appointments scheduled for today.</div>';
        } else {
            const sorted = [...appointments].sort((a,b) => a.timeSlot.localeCompare(b.timeSlot));
            sorted.forEach(ap => {
                const pat = patients.find(p => p.id === ap.patientId);
                let borderClass = 'border-success';
                let textClass = 'text-success';
                if (ap.status === 'Completed') {
                    borderClass = 'border-info';
                    textClass = 'text-info';
                } else if (ap.status === 'In Consultation') {
                    borderClass = 'border-warning';
                    textClass = 'text-warning';
                }
                html += `
                <div class="d-flex align-items-center justify-content-between p-2.5 mb-2 bg-light-subtle rounded border-start border-3 ${borderClass}" style="font-size: 0.85rem;">
                    <div class="d-flex align-items-center gap-2">
                        <div class="text-muted fw-bold" style="min-width: 70px;">${ap.timeSlot}</div>
                        <div class="fw-semibold text-dark">${pat ? pat.name : 'Unknown'}</div>
                    </div>
                    <span class="font-size-xxs px-2 py-0.5 rounded-pill bg-light fw-bold ${textClass}">${ap.status || 'Waiting'}</span>
                </div>`;
            });
        }
        scheduleList.innerHTML = html;
    }

    // Upgraded Checklist rendering
    renderDoctorQuickTasks();

    // Recent Lab Results Panel rendering
    const labsList = document.getElementById('doctor-recent-labs-widget');
    if (labsList) {
        const mockLabs = [
            { name: 'CBC Report', status: 'Ready', badge: 'bg-success-light text-success' },
            { name: 'Blood Sugar', status: 'Ready', badge: 'bg-success-light text-success' },
            { name: 'X-Ray', status: 'Pending', badge: 'bg-warning-light text-warning' }
        ];
        let html = '';
        mockLabs.forEach(l => {
            html += `
            <div class="list-group-item d-flex align-items-center justify-content-between p-2.5 border-0 bg-transparent" style="font-size: 0.85rem;">
                <span class="fw-semibold text-dark"><i class="fa-solid fa-file-medical text-muted me-2"></i>${l.name}</span>
                <span class="badge ${l.badge} fw-bold" style="font-size: 0.75rem;">${l.status}</span>
            </div>`;
        });
        labsList.innerHTML = html;
    }

    // Performance Section Card rendering (mini bar chart)
    renderMiniPerformanceChart();
}

let miniPerformanceChartInstance = null;

function renderMiniPerformanceChart() {
    const ctx = document.getElementById('miniPerformanceChart');
    if (!ctx) return;

    if (miniPerformanceChartInstance) {
        miniPerformanceChartInstance.destroy();
    }

    const isDark = document.body.classList.contains('dark-mode');
    const textColor = isDark ? '#cbd5e1' : '#475569';
    const gridColor = isDark ? '#334155' : '#e2e8f0';

    miniPerformanceChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
            datasets: [{
                label: 'Consultations',
                data: [8, 12, 10, 15, 7],
                backgroundColor: '#0e7490',
                borderRadius: 4,
                barPercentage: 0.6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: true }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: textColor, font: { size: 10 } }
                },
                y: {
                    grid: { color: gridColor },
                    ticks: { color: textColor, font: { size: 10 }, stepSize: 5 },
                    min: 0,
                    max: 20
                }
            }
        }
    });
}

function renderDoctorQuickTasks() {
    let qTasks = JSON.parse(localStorage.getItem('hc_quick_tasks'));
    if (!qTasks || qTasks.length === 0) {
        qTasks = [
            { id: 'task-q1', title: 'Review Lab Results', completed: true },
            { id: 'task-q2', title: 'Complete Prescriptions', completed: true },
            { id: 'task-q3', title: 'Follow-up Calls', completed: true },
            { id: 'task-q4', title: 'Patient Documentation', completed: false }
        ];
        localStorage.setItem('hc_quick_tasks', JSON.stringify(qTasks));
    }

    const container = document.getElementById('doctor-quick-tasks-list');
    if (container) {
        let html = '';
        qTasks.forEach(t => {
            html += `
            <div class="form-check p-2.5 mb-2 bg-light-subtle rounded border d-flex align-items-center justify-content-between" style="border-radius: 8px;">
                <div class="d-flex align-items-center gap-2">
                    <input class="form-check-input ms-0 mt-0" type="checkbox" id="${t.id}" ${t.completed ? 'checked' : ''} onchange="toggleQuickTask('${t.id}')" style="cursor: pointer; width: 1.15rem; height: 1.15rem;">
                    <label class="form-check-label text-dark ${t.completed ? 'text-decoration-line-through text-muted' : ''}" for="${t.id}" style="cursor: pointer; font-size: 0.85rem; font-weight: 500; margin-left: 6px;">
                        ${t.title}
                    </label>
                </div>
            </div>`;
        });
        container.innerHTML = html;

        // Calculate progress
        const completedCount = qTasks.filter(t => t.completed).length;
        const progressPct = Math.round((completedCount / qTasks.length) * 100);
        
        const badge = document.getElementById('tasks-progress-badge');
        if (badge) badge.innerText = `${progressPct}% Done`;
        
        const bar = document.getElementById('tasks-progress-bar');
        if (bar) {
            bar.style.width = `${progressPct}%`;
            if (progressPct === 100) {
                bar.className = 'progress-bar bg-success';
            } else {
                bar.className = 'progress-bar bg-info';
            }
        }
    }
}

window.toggleQuickTask = function(taskId) {
    let qTasks = JSON.parse(localStorage.getItem('hc_quick_tasks')) || [];
    qTasks = qTasks.map(t => {
        if (t.id === taskId) {
            t.completed = !t.completed;
        }
        return t;
    });
    localStorage.setItem('hc_quick_tasks', JSON.stringify(qTasks));
    renderDoctorQuickTasks();
};

function setupDoctorPatientSelectors() {
    const patSelect = document.getElementById('consult-patient-select');
    if (!patSelect) return;

    const patients = getDB('patients');
    patSelect.innerHTML = '<option value="">-- Choose Patient --</option>';
    patients.forEach(pat => {
        patSelect.innerHTML += `<option value="${pat.id}">${pat.name} (${pat.id})</option>`;
    });

    patSelect.addEventListener('change', function () {
        const patId = this.value;
        const infoCard = document.getElementById('consult-patient-info');
        const placeholder = document.getElementById('consult-patient-info-placeholder');
        if (!patId) {
            infoCard.classList.add('d-none');
            if (placeholder) placeholder.classList.remove('d-none');
            return;
        }

        const patient = patients.find(p => p.id === patId);
        if (patient) {
            document.getElementById('consult-info-name').innerText = patient.name;
            document.getElementById('consult-info-age').innerText = new Date().getFullYear() - new Date(patient.dob).getFullYear();
            document.getElementById('consult-info-gender').innerText = patient.gender;
            document.getElementById('consult-info-blood').innerText = patient.bloodGroup;
            document.getElementById('consult-info-allergies').innerText = patient.allergies;

            infoCard.classList.remove('d-none');
            if (placeholder) placeholder.classList.add('d-none');
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

function addPrescriptionRowToConsult() {
    const list = document.getElementById('consult-med-rows');
    if (!list) return;

    const row = document.createElement('div');
    row.className = 'prescription-medication-row animate-slide-up';
    row.innerHTML = `
        <div class="row g-3">
            <div class="col-md-4">
                <label class="clinical-label font-size-xs">Medication Name</label>
                <input type="text" class="form-control clinical-form-control med-name" placeholder="e.g. Lisinopril 10mg" required>
            </div>
            <div class="col-md-3">
                <label class="clinical-label font-size-xs">Dosage & Frequency</label>
                <input type="text" class="form-control clinical-form-control med-dose" placeholder="e.g. 1 tablet daily" required>
            </div>
            <div class="col-md-2">
                <label class="clinical-label font-size-xs">Duration</label>
                <input type="text" class="form-control clinical-form-control med-duration" placeholder="e.g. 30 days" required>
            </div>
            <div class="col-md-2">
                <label class="clinical-label font-size-xs">Special Instructions</label>
                <input type="text" class="form-control clinical-form-control med-instr" placeholder="e.g. Take with water">
            </div>
            <div class="col-md-1 d-flex align-items-end justify-content-center">
                <button type="button" class="btn btn-sm btn-outline-danger py-2 px-3" onclick="this.closest('.prescription-medication-row').remove()"><i class="fa-solid fa-trash-can"></i></button>
            </div>
        </div>`;
    list.appendChild(row);
}

async function submitDoctorConsultation(doctor) {
    const patientId = document.getElementById('consult-patient-select').value;
    if (!patientId) {
        alert('Please choose a patient.');
        return;
    }

    const bpSystolic = parseInt(document.getElementById('consult-sys').value);
    const bpDiastolic = parseInt(document.getElementById('consult-dia').value);
    const heartRate = parseInt(document.getElementById('consult-hr').value);
    const temp = parseFloat(document.getElementById('consult-temp').value) || 98.6;
    const weight = parseFloat(document.getElementById('consult-weight').value) || 70;

    const diagnosis = document.getElementById('consult-diagnosis').value;
    const clinicalNotes = document.getElementById('consult-notes').value;

    const requestLabTest = document.getElementById('consult-order-lab').checked;
    const labTestName = document.getElementById('consult-lab-name').value;
    const labTestCategory = document.getElementById('consult-lab-cat').value;

    if (!FormValidator.validateRequired({ bpSystolic, bpDiastolic, heartRate, diagnosis })) {
        alert("Please complete all required vitals and diagnosis details.");
        return;
    }

    const patient = getDB('patients').find(p => p.id === patientId);
    if (!patient) return;

    const todayStr = new Date().toISOString().split('T')[0];

    // 1. Add Vitals
    patient.vitalsHistory.push({ date: todayStr, bpSystolic, bpDiastolic, heartRate, temp, weight });

    // 2. Add Diagnosis
    patient.medicalHistory.push({ date: todayStr, condition: diagnosis, diagnosedBy: doctor.name, status: 'Active' });

    // Save Patient EHR
    await ApiService.updatePatient(patientId, { vitalsHistory: patient.vitalsHistory, medicalHistory: patient.medicalHistory });

    // 3. Add Prescription
    const medRows = document.querySelectorAll('.prescription-item-row');
    if (medRows.length > 0) {
        const medicines = [];
        medRows.forEach(row => {
            medicines.push({
                name: row.querySelector('.med-name').value,
                dosage: row.querySelector('.med-dose').value,
                duration: row.querySelector('.med-duration').value,
                instructions: row.querySelector('.med-instr').value || 'Take as directed'
            });
        });

        const prescriptions = getDB('prescriptions');
        prescriptions.push({
            id: 'rx-' + (prescriptions.length + 1),
            patientId: patient.id,
            doctorName: doctor.name,
            date: todayStr,
            diagnosis: diagnosis,
            medicines: medicines
        });
        setDB('prescriptions', prescriptions);
    }

    // 4. Order Lab Request
    if (requestLabTest && labTestName) {
        const labReq = {
            id: 'lab-' + (getDB('lab_requests').length + 1),
            patientId: patient.id,
            patientName: patient.name,
            doctorName: doctor.name,
            testCategory: labTestCategory,
            testName: labTestName,
            requestDate: todayStr,
            status: 'pending',
            resultDate: '',
            technician: '',
            priority: 'Medium',
            results: []
        };
        await ApiService.createLabTest(labReq);
    }

    // 5. Update active consult appt status and increment dashboard counters
    const activeApptId = sessionStorage.getItem('hc_active_appt_consult');
    if (activeApptId) {
        let appointments = getDB('appointments');
        appointments = appointments.map(a => {
            if (a.id === activeApptId) {
                a.status = 'Completed';
            }
            return a;
        });
        setDB('appointments', appointments);
        sessionStorage.removeItem('hc_active_appt_consult');

        // Increment stats
        let statsSeen = localStorage.getItem('hc_stats_seen') ? parseInt(localStorage.getItem('hc_stats_seen')) : 15;
        let statsCompleted = localStorage.getItem('hc_stats_completed') ? parseInt(localStorage.getItem('hc_stats_completed')) : 12;
        localStorage.setItem('hc_stats_seen', statsSeen + 1);
        localStorage.setItem('hc_stats_completed', statsCompleted + 1);
    }

    alert('Consultation completed successfully! EHR has been updated.');
    document.getElementById('doctor-consult-form').reset();
    document.getElementById('consult-med-rows').innerHTML = '';
    document.getElementById('consult-patient-info').classList.add('d-none');
    document.getElementById('consult-patient-info-placeholder').classList.remove('d-none');

    // Refresh views
    renderDoctorDashboard(doctor);
    renderDoctorCalendar(2026, 5);
    renderDoctorAnalytics(doctor);
    document.querySelector('[data-panel="panel-dashboard"]').click();
}

function setupPatientDirectoryListeners() {
    const searchInput = document.getElementById('search-patient-input');
    const genderSel = document.getElementById('filter-gender');
    const bloodSel = document.getElementById('filter-blood');
    const ageSel = document.getElementById('filter-age');
    const allergySel = document.getElementById('filter-allergy');

    if (searchInput) {
        searchInput.replaceWith(searchInput.cloneNode(true));
        const newSearchInput = document.getElementById('search-patient-input');
        newSearchInput.addEventListener('input', () => {
            currentDirectoryPage = 1;
            renderDoctorPatientDirectory();
        });
    }

    [genderSel, bloodSel, ageSel, allergySel].forEach(el => {
        if (el) {
            el.replaceWith(el.cloneNode(true));
            const newEl = document.getElementById(el.id);
            newEl.addEventListener('change', () => {
                currentDirectoryPage = 1;
                renderDoctorPatientDirectory();
            });
        }
    });

    const addPatientForm = document.getElementById('add-patient-form');
    if (addPatientForm) {
        addPatientForm.replaceWith(addPatientForm.cloneNode(true));
        const newForm = document.getElementById('add-patient-form');
        newForm.addEventListener('submit', function (e) {
            e.preventDefault();
            registerNewPatient();
        });
    }
}

function getFilteredPatientsList() {
    const patients = getDB('patients');
    const searchVal = document.getElementById('search-patient-input')?.value.toLowerCase() || '';
    const genderVal = document.getElementById('filter-gender')?.value || 'all';
    const bloodVal = document.getElementById('filter-blood')?.value || 'all';
    const ageVal = document.getElementById('filter-age')?.value || 'all';
    const allergyVal = document.getElementById('filter-allergy')?.value || 'all';

    return patients.filter(p => {
        const pAllergies = p.allergies || 'None';

        // 1. Search text
        if (searchVal) {
            const matchesId = p.id.toLowerCase().includes(searchVal);
            const matchesName = p.name.toLowerCase().includes(searchVal);
            if (!matchesId && !matchesName) return false;
        }

        // 2. Gender
        if (genderVal !== 'all') {
            if (p.gender !== genderVal) return false;
        }

        // 3. Blood Group
        if (bloodVal !== 'all') {
            if (!p.bloodGroup.includes(bloodVal)) return false;
        }

        // 4. Age Group
        if (ageVal !== 'all') {
            const age = new Date().getFullYear() - new Date(p.dob).getFullYear();
            if (ageVal === 'under18' && age >= 18) return false;
            if (ageVal === '18-35' && (age < 18 || age > 35)) return false;
            if (ageVal === '36-60' && (age < 36 || age > 60)) return false;
            if (ageVal === 'over60' && age <= 60) return false;
        }

        // 5. Allergy
        if (allergyVal !== 'all') {
            const hasAllergies = pAllergies.toLowerCase() !== 'none' && pAllergies.trim() !== '';
            if (allergyVal === 'yes' && !hasAllergies) return false;
            if (allergyVal === 'no' && hasAllergies) return false;
        }

        return true;
    });
}

function renderPatientSidebars() {
    // 1. Recently Registered Patients
    const recentEl = document.getElementById('sidebar-recent-patients');
    if (recentEl) {
        const patients = getDB('patients');
        const sorted = [...patients].reverse().slice(0, 3); // last 3 registered
        let html = '';
        sorted.forEach(p => {
            const initials = p.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            html += `
            <div class="d-flex align-items-center gap-2">
                <div class="avatar-circle-sm bg-light text-secondary">${initials}</div>
                <div>
                    <span class="fw-semibold d-block font-size-sm">${p.name}</span>
                    <span class="text-muted font-size-xs">${p.id}</span>
                </div>
            </div>`;
        });
        recentEl.innerHTML = html;
    }

    // 2. Upcoming Follow-ups
    const followupsEl = document.getElementById('sidebar-followups');
    if (followupsEl) {
        followupsEl.innerHTML = `
        <div class="p-2 bg-light rounded border border-start border-3 border-warning" style="border-left-color: #f59e0b !important;">
            <span class="fw-bold d-block font-size-sm">Emma Watson</span>
            <span class="text-muted font-size-xs">2:00 PM - Routine Follow-up</span>
        </div>
        <div class="p-2 bg-light rounded border border-start border-3 border-warning mt-2" style="border-left-color: #f59e0b !important;">
            <span class="fw-bold d-block font-size-sm">John Doe</span>
            <span class="text-muted font-size-xs">4:00 PM - BP Check</span>
        </div>`;
    }

    // 3. High Risk Allergy alerts
    const allergyEl = document.getElementById('sidebar-high-risk-allergies');
    if (allergyEl) {
        allergyEl.innerHTML = `
        <div class="p-2 bg-white rounded border border-danger">
            <span class="fw-bold text-danger font-size-sm"><i class="fa-solid fa-triangle-exclamation"></i> John Doe</span>
            <span class="text-danger font-size-xs d-block">Penicillin, Shellfish Allergy</span>
        </div>
        <div class="p-2 bg-white rounded border border-danger mt-2">
            <span class="fw-bold text-danger font-size-sm"><i class="fa-solid fa-triangle-exclamation"></i> Emma Watson</span>
            <span class="text-danger font-size-xs d-block">Peanut Allergy</span>
        </div>`;
    }
}

function registerNewPatient() {
    const name = document.getElementById('reg-name').value;
    const dob = document.getElementById('reg-dob').value;
    const gender = document.getElementById('reg-gender').value;
    const blood = document.getElementById('reg-blood').value;
    const phone = document.getElementById('reg-phone').value;
    const emergency = document.getElementById('reg-emergency').value;
    const allergies = document.getElementById('reg-allergies').value || 'None';
    const status = document.getElementById('reg-status').value;

    const patients = getDB('patients');
    const newId = `pat-${patients.length + 1}`;

    const newPatient = {
        id: newId,
        name: name,
        dob: dob,
        gender: gender,
        bloodGroup: blood,
        phone: phone,
        emergencyPhone: emergency,
        allergies: allergies,
        status: status,
        lastConsultation: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
        vitalsHistory: [],
        medicalHistory: []
    };

    patients.push(newPatient);
    setDB('patients', patients);

    const modalEl = document.getElementById('registerPatientModal');
    const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
    modal.hide();

    document.getElementById('add-patient-form').reset();
    alert('Patient registered successfully!');
    renderDoctorPatientDirectory();
}

window.changeDirectoryPage = function(page) {
    currentDirectoryPage = page;
    renderDoctorPatientDirectory();
};

window.quickEHRPreview = function(patientId) {
    const patients = getDB('patients');
    const p = patients.find(pat => pat.id === patientId);
    if (!p) return;

    const initials = p.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    const details = `${p.gender} | Age ${new Date().getFullYear() - new Date(p.dob).getFullYear()}`;

    const prescriptions = getDB('prescriptions').filter(rx => rx.patientId === patientId);
    let recentDiagnosis = 'No record found';
    let currentMeds = 'None';

    if (p.medicalHistory && p.medicalHistory.length > 0) {
        recentDiagnosis = p.medicalHistory[p.medicalHistory.length - 1].condition;
    } else if (prescriptions.length > 0) {
        recentDiagnosis = prescriptions[prescriptions.length - 1].diagnosis;
    }

    if (prescriptions.length > 0) {
        const meds = prescriptions[prescriptions.length - 1].medicines;
        currentMeds = meds.map(m => m.name).join(', ');
    }

    const lastVisit = p.lastConsultation || (p.id === 'pat-1' ? '15 Jun 2026' : p.id === 'pat-2' ? '22 Jun 2026' : '15 Jun 2026');

    document.getElementById('quick-avatar').innerText = initials;
    document.getElementById('quick-p-name').innerText = p.name;
    document.getElementById('quick-p-details').innerText = details;
    document.getElementById('quick-p-diagnosis').innerText = recentDiagnosis;
    document.getElementById('quick-p-meds').innerText = currentMeds;
    document.getElementById('quick-p-allergies').innerText = p.allergies || 'None';
    document.getElementById('quick-p-last-visit').innerText = lastVisit;

    const modal = new bootstrap.Modal(document.getElementById('quickEHRModal'));
    modal.show();

    appendAccessLog(p.name);
};

window.scheduleFollowUp = function(patientId) {
    const patients = getDB('patients');
    const p = patients.find(pat => pat.id === patientId);
    if (p) {
        alert(`Follow-up appointment booking interface triggered for ${p.name}.`);
    }
};

window.teleconsultPatient = function(patientId) {
    const patients = getDB('patients');
    const p = patients.find(pat => pat.id === patientId);
    if (p) {
        alert(`Initiating video teleconsult link for ${p.name}...`);
    }
};

function appendAccessLog(patientName) {
    const activeUser = JSON.parse(sessionStorage.getItem('hc_current_user'));
    const docName = activeUser ? activeUser.name || 'Dr. Sarah Connor' : 'Dr. Sarah Connor';
    const time = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    
    const infoEl = document.getElementById('compliance-log-info');
    if (infoEl) {
        infoEl.innerHTML = `${docName}<br><span class="text-muted">Accessed ${patientName}'s EHR at ${time}</span>`;
    }
}

function renderDoctorPatientDirectory() {
    const list = document.getElementById('doctor-patients-list');
    if (!list) return;

    const filtered = getFilteredPatientsList();
    const totalCount = filtered.length;
    const totalPages = Math.ceil(totalCount / directoryPageSize);

    if (currentDirectoryPage > totalPages && totalPages > 0) {
        currentDirectoryPage = totalPages;
    }

    const paginated = filtered.slice((currentDirectoryPage - 1) * directoryPageSize, currentDirectoryPage * directoryPageSize);

    let html = '';
    paginated.forEach(p => {
        const age = new Date().getFullYear() - new Date(p.dob).getFullYear();
        const initials = p.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        
        let bloodClass = 'badge-blood-other';
        const bg = p.bloodGroup.toUpperCase();
        if (bg.startsWith('O')) bloodClass = 'badge-blood-o';
        else if (bg.startsWith('A')) bloodClass = 'badge-blood-a';
        else if (bg.startsWith('B')) bloodClass = 'badge-blood-b';
        else if (bg.startsWith('AB')) bloodClass = 'badge-blood-ab';

        const pStatus = p.status || (p.id === 'pat-1' ? 'Critical' : p.id === 'pat-2' ? 'Follow-Up Due' : 'Stable');
        let statusClass = 'badge-status-stable';
        let statusText = '🟢 Stable';
        if (pStatus === 'Critical') {
            statusClass = 'badge-status-critical';
            statusText = '🔴 Critical';
        } else if (pStatus === 'Follow-Up Due') {
            statusClass = 'badge-status-followup';
            statusText = '🟡 Follow-Up';
        }

        const lastConsult = p.lastConsultation || (p.id === 'pat-1' ? '15 Jun 2026' : p.id === 'pat-2' ? '22 Jun 2026' : '15 Jun 2026');
        const emergency = p.emergencyPhone || '+1 (555) 019-2835';

        html += `
        <tr class="patient-row" style="cursor: pointer;">
            <td><strong>${p.id}</strong></td>
            <td>
                <div class="d-flex align-items-center gap-2">
                    <div class="avatar-circle-sm">${initials}</div>
                    <span class="fw-semibold">${p.name}</span>
                </div>
            </td>
            <td>${age}</td>
            <td>${p.gender}</td>
            <td><span class="badge ${bloodClass}">${p.bloodGroup}</span></td>
            <td>${lastConsult}</td>
            <td><span class="badge ${statusClass}">${statusText}</span></td>
            <td><i class="fa-solid fa-phone text-muted me-1"></i> ${emergency}</td>
            <td>
                <div class="dropdown">
                    <button class="btn btn-xs btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" onclick="event.stopPropagation()">
                        <i class="fa-solid fa-ellipsis-vertical"></i> Actions
                    </button>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="#" onclick="event.stopPropagation(); startConsultation('${p.id}')"><i class="fa-solid fa-stethoscope me-2 text-primary"></i>Consult</a></li>
                        <li><a class="dropdown-item" href="#" onclick="event.stopPropagation(); viewPatientEHR('${p.id}')"><i class="fa-solid fa-id-card me-2 text-secondary"></i>View EHR</a></li>
                        <li><a class="dropdown-item" href="#" onclick="event.stopPropagation(); quickEHRPreview('${p.id}')"><i class="fa-solid fa-eye me-2 text-success"></i>Quick View</a></li>
                        <li><a class="dropdown-item" href="#" onclick="event.stopPropagation(); scheduleFollowUp('${p.id}')"><i class="fa-solid fa-calendar-plus me-2 text-warning"></i>Schedule</a></li>
                        <li><a class="dropdown-item" href="#" onclick="event.stopPropagation(); teleconsultPatient('${p.id}')"><i class="fa-solid fa-video me-2 text-info"></i>Teleconsult</a></li>
                    </ul>
                </div>
            </td>
        </tr>`;
    });

    list.innerHTML = html || `<tr><td colspan="9" class="text-center py-4 text-muted">No patients found.</td></tr>`;

    const patients = getDB('patients');
    const totalPatientsCount = 1200 + patients.length;
    const criticalPatientsCount = patients.filter(p => {
        const s = p.status || (p.id === 'pat-1' ? 'Critical' : p.id === 'pat-2' ? 'Follow-Up Due' : 'Stable');
        return s === 'Critical';
    }).length + 10;
    
    const totalEl = document.getElementById('dir-stat-total');
    if (totalEl) totalEl.innerText = totalPatientsCount;
    
    const criticalEl = document.getElementById('dir-stat-critical');
    if (criticalEl) criticalEl.innerText = criticalPatientsCount;

    renderPatientSidebars();

    const infoEl = document.getElementById('dir-pagination-info');
    if (infoEl) {
        const startIdx = totalCount === 0 ? 0 : (currentDirectoryPage - 1) * directoryPageSize + 1;
        const endIdx = Math.min(currentDirectoryPage * directoryPageSize, totalCount);
        infoEl.innerText = `Showing patients ${startIdx}-${endIdx} of ${totalCount}`;
    }

    const paginationEl = document.getElementById('dir-pagination-controls');
    if (paginationEl) {
        let pagHtml = '';
        const prevDisabled = currentDirectoryPage === 1 ? 'disabled' : '';
        pagHtml += `<li class="page-item ${prevDisabled}"><a class="page-link" href="#" onclick="event.preventDefault(); changeDirectoryPage(${currentDirectoryPage - 1})">Previous</a></li>`;

        for (let page = 1; page <= totalPages; page++) {
            const activeClass = page === currentDirectoryPage ? 'active' : '';
            pagHtml += `<li class="page-item ${activeClass}"><a class="page-link" href="#" onclick="event.preventDefault(); changeDirectoryPage(${page})">${page}</a></li>`;
        }

        const nextDisabled = currentDirectoryPage === totalPages || totalPages === 0 ? 'disabled' : '';
        pagHtml += `<li class="page-item ${nextDisabled}"><a class="page-link" href="#" onclick="event.preventDefault(); changeDirectoryPage(${currentDirectoryPage + 1})">Next</a></li>`;
        
        paginationEl.innerHTML = pagHtml;
    }
}

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

    const timeline = document.getElementById('doctor-p-timeline');
    timeline.innerHTML = '';
    
    const medHistory = patient.medicalHistory && patient.medicalHistory.length > 0
        ? patient.medicalHistory
        : [
            { date: '2026-05-15', condition: 'Consultation & BP Review', diagnosedBy: 'Dr. Sarah Connor' },
            { date: '2026-05-15', condition: 'Digital Prescription Issued', diagnosedBy: 'Dr. Sarah Connor' },
            { date: '2025-11-10', condition: 'Laboratory Diagnostic Test', diagnosedBy: 'Dr. Sarah Connor' },
            { date: '2025-11-10', condition: 'Primary Diagnosis: Mild Hypertension', diagnosedBy: 'Dr. Sarah Connor' }
        ];

    const groups = {};
    medHistory.forEach(h => {
        const year = h.date.split('-')[0];
        if (!groups[year]) groups[year] = [];
        groups[year].push(h);
    });

    const years = Object.keys(groups).sort((a, b) => b - a);
    years.forEach(yr => {
        let eventsHtml = '';
        groups[yr].forEach(h => {
            eventsHtml += `
            <div class="timeline-event mb-3">
                <div class="timeline-date font-size-xs text-primary fw-semibold mb-1">${h.date}</div>
                <div class="ehr-timeline-point py-2 px-3 bg-white rounded border">
                    <h6 class="timeline-title font-size-sm fw-bold mb-1">${h.condition}</h6>
                    <p class="text-muted font-size-xs mb-0">Recorded by: <strong>${h.diagnosedBy || 'Dr. Sarah Connor'}</strong></p>
                </div>
            </div>`;
        });

        timeline.innerHTML += `
        <div class="timeline-year-group mb-4">
            <span class="badge bg-primary font-size-xs fw-bold py-1 px-3 mb-2" style="border-radius: 10px;"><i class="fa-solid fa-calendar me-1"></i> ${yr}</span>
            <div class="ps-3 border-start border-2 ms-2">
                ${eventsHtml}
            </div>
        </div>`;
    });

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
                    <td>${m.duration}</td>
                </tr>`;
            });
        });
    } else {
        rxList.innerHTML = '<tr><td colspan="4" class="text-center text-muted font-size-xs">No active prescriptions.</td></tr>';
    }

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

    setTimeout(() => {
        const canvas = document.getElementById('doctorPatientVitalsChart');
        if (!canvas) return;
        if (modalVitalsChart) modalVitalsChart.destroy();

        const vitals = patient.vitalsHistory && patient.vitalsHistory.length > 0
            ? patient.vitalsHistory
            : [
                { date: '2026-05-01', bpSystolic: 120, bpDiastolic: 80, heartRate: 72 },
                { date: '2026-05-15', bpSystolic: 124, bpDiastolic: 82, heartRate: 75 },
                { date: '2026-06-01', bpSystolic: 118, bpDiastolic: 79, heartRate: 70 },
                { date: '2026-06-15', bpSystolic: 121, bpDiastolic: 80, heartRate: 73 }
              ];

        const labels = vitals.map(v => v.date);
        const sys = vitals.map(v => v.bpSystolic);
        const dia = vitals.map(v => v.bpDiastolic);
        const hr = vitals.map(v => v.heartRate);

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

    appendAccessLog(patient.name);
};

function setupDoctorCalendarListeners() {
    const btnGroup = document.getElementById('calendar-view-btn-group');
    if (btnGroup) {
        btnGroup.replaceWith(btnGroup.cloneNode(true));
    }

    const newBtnGroup = document.getElementById('calendar-view-btn-group');
    if (newBtnGroup) {
        const buttons = newBtnGroup.querySelectorAll('button');
        buttons.forEach(btn => {
            btn.addEventListener('click', function () {
                buttons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentCalendarView = this.getAttribute('data-view');
                renderDoctorCalendar();
            });
        });
    }

    const prevBtn = document.getElementById('prev-month-btn');
    const nextBtn = document.getElementById('next-month-btn');

    if (prevBtn) {
        prevBtn.replaceWith(prevBtn.cloneNode(true));
    }
    if (nextBtn) {
        nextBtn.replaceWith(nextBtn.cloneNode(true));
    }

    const newPrevBtn = document.getElementById('prev-month-btn');
    const newNextBtn = document.getElementById('next-month-btn');

    if (newPrevBtn) {
        newPrevBtn.addEventListener('click', function () {
            navigateCalendar(-1);
        });
    }

    if (newNextBtn) {
        newNextBtn.addEventListener('click', function () {
            navigateCalendar(1);
        });
    }
}

function navigateCalendar(offset) {
    if (currentCalendarView === 'month') {
        currentCalendarDate.setMonth(currentCalendarDate.getMonth() + offset);
    } else if (currentCalendarView === 'week') {
        currentCalendarDate.setDate(currentCalendarDate.getDate() + offset * 7);
    } else if (currentCalendarView === 'day') {
        currentCalendarDate.setDate(currentCalendarDate.getDate() + offset);
    }
    renderDoctorCalendar();
}

function renderDoctorCalendar(year, month) {
    const grid = document.getElementById('doctor-calendar-grid');
    const headerTitle = document.getElementById('doctor-calendar-month');
    const daysHeader = document.getElementById('calendar-days-header');
    if (!grid || !headerTitle) return;

    if (year !== undefined && month !== undefined) {
        currentCalendarDate = new Date(year, month, 22);
        currentCalendarView = 'month';
        const btnGroup = document.getElementById('calendar-view-btn-group');
        if (btnGroup) {
            const buttons = btnGroup.querySelectorAll('button');
            buttons.forEach(btn => {
                if (btn.getAttribute('data-view') === 'month') {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        }
    }

    grid.innerHTML = '';
    const appointments = getDB('appointments');

    if (currentCalendarView === 'month') {
        if (daysHeader) daysHeader.classList.remove('d-none');
        grid.style.gridTemplateColumns = 'repeat(7, 1fr)';

        const y = currentCalendarDate.getFullYear();
        const m = currentCalendarDate.getMonth();

        headerTitle.innerText = currentCalendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

        const date = new Date(y, m, 1);
        const startDay = date.getDay(); // 0 is Sunday, 1 is Monday
        const adjustedStart = startDay === 0 ? 6 : startDay - 1;

        const daysInMonth = new Date(y, m + 1, 0).getDate();

        // Filler blocks for previous month
        for (let i = 0; i < adjustedStart; i++) {
            grid.innerHTML += `<div class="calendar-cell other-month"></div>`;
        }

        // Grid days
        for (let day = 1; day <= daysInMonth; day++) {
            const currentDayStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayAppts = appointments.filter(a => a.date === currentDayStr);

            let apptHtml = '';
            dayAppts.forEach(ap => {
                let colorClass = 'event-checkup';
                if (ap.type === 'Laboratory test') colorClass = 'event-lab';
                if (ap.type === 'Emergency') colorClass = 'event-emergency';
                apptHtml += `<div class="calendar-event-tag ${colorClass}" onclick="startConsultation('${ap.patientId}', '${ap.id}')">${ap.timeSlot} | ${ap.doctorName.replace('Dr. ', '')}</div>`;
            });

            const isToday = new Date().toDateString() === new Date(y, m, day).toDateString();
            const cellClass = isToday ? 'calendar-cell today' : 'calendar-cell';

            grid.innerHTML += `
            <div class="${cellClass}">
                <span class="calendar-date-number">${day}</span>
                <div class="calendar-events-container">${apptHtml}</div>
            </div>`;
        }
    } else if (currentCalendarView === 'week') {
        if (daysHeader) daysHeader.classList.remove('d-none');
        grid.style.gridTemplateColumns = 'repeat(7, 1fr)';

        // Find Monday of current calendar date's week
        const startOfWeek = new Date(currentCalendarDate);
        const dayOfWeek = startOfWeek.getDay();
        const distanceToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        startOfWeek.setDate(startOfWeek.getDate() + distanceToMonday);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);

        const startStr = startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const endStr = endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        headerTitle.innerText = `${startStr} - ${endStr}`;

        for (let i = 0; i < 7; i++) {
            const dayDate = new Date(startOfWeek);
            dayDate.setDate(dayDate.getDate() + i);

            const y = dayDate.getFullYear();
            const m = dayDate.getMonth();
            const d = dayDate.getDate();

            const currentDayStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const dayAppts = appointments.filter(a => a.date === currentDayStr);

            let apptHtml = '';
            dayAppts.forEach(ap => {
                let colorClass = 'event-checkup';
                if (ap.type === 'Laboratory test') colorClass = 'event-lab';
                if (ap.type === 'Emergency') colorClass = 'event-emergency';
                apptHtml += `<div class="calendar-event-tag ${colorClass}" onclick="startConsultation('${ap.patientId}', '${ap.id}')">${ap.timeSlot} | ${ap.doctorName.replace('Dr. ', '')}</div>`;
            });

            const isToday = new Date().toDateString() === dayDate.toDateString();
            const cellClass = isToday ? 'calendar-cell today' : 'calendar-cell';

            grid.innerHTML += `
            <div class="${cellClass}">
                <span class="calendar-date-number">${dayDate.toLocaleDateString('en-US', { weekday: 'short' })} ${d}</span>
                <div class="calendar-events-container">${apptHtml}</div>
            </div>`;
        }
    } else if (currentCalendarView === 'day') {
        if (daysHeader) daysHeader.classList.add('d-none');
        grid.style.gridTemplateColumns = '1fr';

        headerTitle.innerText = currentCalendarDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

        const y = currentCalendarDate.getFullYear();
        const m = currentCalendarDate.getMonth();
        const d = currentCalendarDate.getDate();
        const currentDayStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

        const dayAppts = appointments.filter(a => a.date === currentDayStr);

        const hourlySlots = [
            { label: '08:00 AM', hour: 8 },
            { label: '09:00 AM', hour: 9 },
            { label: '10:00 AM', hour: 10 },
            { label: '11:00 AM', hour: 11 },
            { label: '12:00 PM', hour: 12 },
            { label: '01:00 PM', hour: 13 },
            { label: '02:00 PM', hour: 14 },
            { label: '03:00 PM', hour: 15 },
            { label: '04:00 PM', hour: 16 },
            { label: '05:00 PM', hour: 17 },
            { label: '06:00 PM', hour: 18 }
        ];

        let html = '';
        hourlySlots.forEach(slot => {
            const slotAppts = dayAppts.filter(ap => {
                const parts = ap.timeSlot.split(' ');
                if (parts.length < 2) return false;
                const timeParts = parts[0].split(':');
                let h = parseInt(timeParts[0]);
                const isPm = parts[1].toLowerCase() === 'pm';
                if (isPm && h !== 12) h += 12;
                if (!isPm && h === 12) h = 0;
                return h === slot.hour;
            });

            let apptsHtml = '';
            if (slotAppts.length > 0) {
                slotAppts.forEach(ap => {
                    let colorClass = 'event-checkup';
                    if (ap.type === 'Laboratory test') colorClass = 'event-lab';
                    if (ap.type === 'Emergency') colorClass = 'event-emergency';
                    apptsHtml += `
                    <div class="calendar-event-tag ${colorClass} p-2 my-1" style="font-size: 0.85rem; border-radius: 6px;" onclick="startConsultation('${ap.patientId}', '${ap.id}')">
                        <strong>${ap.timeSlot}</strong> | ${ap.deptName} - Patient ID: ${ap.patientId} (${ap.doctorName})
                        <div class="font-size-xs fw-normal mt-1 text-white-50">${ap.symptoms}</div>
                    </div>`;
                });
            } else {
                apptsHtml = `<span class="text-muted font-size-xs italic align-self-center my-auto">No appointments</span>`;
            }

            html += `
            <div class="d-flex align-items-stretch border-bottom py-2" style="min-height: 70px;">
                <div class="time-label fw-bold text-secondary text-end pe-3 border-end d-flex align-items-center justify-content-end" style="width: 100px; flex-shrink: 0;">
                    ${slot.label}
                </div>
                <div class="slot-events flex-grow-1 ps-3 d-flex flex-column justify-content-center">
                    ${apptsHtml}
                </div>
            </div>`;
        });
        grid.innerHTML = `<div class="day-view-container w-100">${html}</div>`;
    }
}

function getFilteredAnalyticsData(doctor, rangeType, customStart, customEnd) {
    const now = new Date(2026, 5, 23); // June 23, 2026 is today in the system context
    let start = null;
    let end = null;

    if (rangeType === 'today') {
        start = new Date(now);
        start.setHours(0,0,0,0);
        end = new Date(now);
        end.setHours(23,59,59,999);
    } else if (rangeType === 'week') {
        start = new Date(now);
        const day = start.getDay();
        const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Monday
        start.setDate(diff);
        start.setHours(0,0,0,0);
        
        end = new Date(start);
        end.setDate(end.getDate() + 6); // Sunday
        end.setHours(23,59,59,999);
    } else if (rangeType === 'month') {
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    } else if (rangeType === 'custom') {
        start = customStart ? new Date(customStart) : null;
        if (start) start.setHours(0,0,0,0);
        end = customEnd ? new Date(customEnd) : null;
        if (end) end.setHours(23,59,59,999);
    }

    const prescriptions = getDB('prescriptions').filter(p => {
        if (p.doctorName !== doctor.name) return false;
        const pDate = new Date(p.date);
        return (!start || pDate >= start) && (!end || pDate <= end);
    });

    const labs = getDB('lab_requests').filter(l => {
        if (l.doctorName !== doctor.name) return false;
        const lDate = new Date(l.requestDate);
        return (!start || lDate >= start) && (!end || lDate <= end);
    });

    const patientIds = [...new Set(prescriptions.map(p => p.patientId))];
    let totalConsults = prescriptions.length;
    let labsOrdered = labs.length;
    let uniquePatients = patientIds.length;

    // Fallbacks to keep dashboard populated with realistic clinical mock data if DB empty
    if (totalConsults === 0) {
        if (rangeType === 'today') {
            totalConsults = 3;
            labsOrdered = 2;
            uniquePatients = 3;
        } else if (rangeType === 'week') {
            totalConsults = 14;
            labsOrdered = 8;
            uniquePatients = 12;
        } else if (rangeType === 'month') {
            totalConsults = 58;
            labsOrdered = 24;
            uniquePatients = 45;
        } else {
            totalConsults = 10;
            labsOrdered = 4;
            uniquePatients = 8;
        }
    }

    return {
        totalConsults: totalConsults,
        labsOrdered: labsOrdered,
        uniquePatients: uniquePatients
    };
}

function renderTopDiseases() {
    const list = document.getElementById('disease-list');
    if (!list) return;

    const diseases = [
        { name: 'Fever', cases: 25, color: 'bg-info' },
        { name: 'Diabetes', cases: 18, color: 'bg-warning text-dark' },
        { name: 'Hypertension', cases: 15, color: 'bg-danger' },
        { name: 'Asthma', cases: 8, color: 'bg-success' }
    ];

    let html = '';
    diseases.forEach(d => {
        const pct = (d.cases / 25) * 100;
        html += `
        <div>
            <div class="d-flex justify-content-between align-items-center mb-1">
                <span class="fw-semibold font-size-sm">${d.name}</span>
                <span class="badge bg-light text-dark font-size-xs fw-bold border">${d.cases} cases</span>
            </div>
            <div class="progress" style="height: 8px; border-radius: 4px; background-color: var(--hc-border);">
                <div class="progress-bar ${d.color}" role="progressbar" style="width: ${pct}%; border-radius: 4px;"></div>
            </div>
        </div>`;
    });
    list.innerHTML = html;
}

function renderDoctorAnalytics(doctor) {
    const dateFilterVal = document.getElementById('reports-date-filter')?.value || 'month';
    const customStart = document.getElementById('reports-start-date')?.value;
    const customEnd = document.getElementById('reports-end-date')?.value;

    const data = getFilteredAnalyticsData(doctor, dateFilterVal, customStart, customEnd);

    const elTotal = document.getElementById('doc-stat-total-consults');
    const elUnique = document.getElementById('doc-stat-unique-patients');
    const elRxGen = document.getElementById('reports-rx-generated');
    const elLabReqs = document.getElementById('reports-lab-requests');

    if (elTotal) elTotal.innerText = data.totalConsults;
    if (elUnique) elUnique.innerText = data.uniquePatients;
    if (elRxGen) elRxGen.innerText = Math.round(data.totalConsults * 0.95);
    if (elLabReqs) elLabReqs.innerText = data.labsOrdered;

    renderTopDiseases();

    const isDark = document.body.classList.contains('dark-mode');
    const textColor = isDark ? '#cbd5e1' : '#475569';
    const gridColor = isDark ? '#334155' : '#e2e8f0';

    Chart.defaults.color = textColor;

    // 1. Consultation Trends (Area/Line Chart)
    const trendCanvas = document.getElementById('doctorConsultsTrendChart');
    if (trendCanvas) {
        if (doctorConsultsTrendChartInstance) doctorConsultsTrendChartInstance.destroy();
        doctorConsultsTrendChartInstance = new Chart(trendCanvas, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Consultations',
                    data: [15, 24, 35, 22, 38, data.totalConsults],
                    fill: true,
                    backgroundColor: isDark ? 'rgba(14, 116, 144, 0.25)' : 'rgba(14, 116, 144, 0.1)',
                    borderColor: '#0e7490',
                    tension: 0.35,
                    borderWidth: 2,
                    pointBackgroundColor: '#0e7490'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: gridColor },
                        ticks: { color: textColor }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: textColor }
                    }
                }
            }
        });
    }

    // 2. Appointment Status (Donut Chart)
    const apptStatusCanvas = document.getElementById('doctorApptStatusChart');
    if (apptStatusCanvas) {
        if (doctorApptStatusChartInstance) doctorApptStatusChartInstance.destroy();
        doctorApptStatusChartInstance = new Chart(apptStatusCanvas, {
            type: 'doughnut',
            data: {
                labels: ['Completed', 'Pending', 'Cancelled'],
                datasets: [{
                    data: [70, 20, 10],
                    backgroundColor: ['#0e7490', '#b45309', '#991b1b'],
                    borderWidth: isDark ? 2 : 0,
                    borderColor: isDark ? '#1e293b' : '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: textColor,
                            boxWidth: 12,
                            padding: 15
                        }
                    }
                },
                cutout: '70%'
            }
        });
    }

    // 3. Case Specialty Distribution (Pie Chart)
    const specialtyCanvas = document.getElementById('doctorSpecialtyChart');
    if (specialtyCanvas) {
        if (doctorSpecialtyChartInstance) doctorSpecialtyChartInstance.destroy();
        doctorSpecialtyChartInstance = new Chart(specialtyCanvas, {
            type: 'pie',
            data: {
                labels: ['General Medicine', 'Cardiology', 'Pediatrics', 'Others'],
                datasets: [{
                    data: [55, 20, 15, 10],
                    backgroundColor: ['#0d2847', '#0e7490', '#b45309', '#64748b'],
                    borderWidth: isDark ? 2 : 0,
                    borderColor: isDark ? '#1e293b' : '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: textColor,
                            boxWidth: 12,
                            padding: 15
                        }
                    }
                }
            }
        });
    }
}

function renderDoctorTasks(doctor) {
    const tasks = getDB('tasks').filter(t => t.doctorId === doctor.id);
    const tasksListEl = document.getElementById('doctor-tasks-list');
    const quickTasksListEl = document.getElementById('doctor-quick-tasks-list');
    
    // Filters
    const priorityFilter = document.getElementById('task-filter-priority')?.value || 'all';
    const statusFilter = document.getElementById('task-filter-status')?.value || 'pending';
    
    const filteredTasks = tasks.filter(t => {
        const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
        const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
        return matchesPriority && matchesStatus;
    });

    // 1. Render Full Task Manager
    if (tasksListEl) {
        if (filteredTasks.length === 0) {
            tasksListEl.innerHTML = `<div class="text-center py-5 text-muted"><i class="fa-solid fa-clipboard-list fs-1 mb-3 d-block"></i>No tasks found matching the filters.</div>`;
        } else {
            let html = '';
            filteredTasks.forEach(task => {
                const isCompleted = task.status === 'completed';
                let priorityBadge = '';
                if (task.priority === 'High') priorityBadge = '<span class="badge bg-danger">High</span>';
                else if (task.priority === 'Medium') priorityBadge = '<span class="badge bg-warning text-dark">Medium</span>';
                else priorityBadge = '<span class="badge bg-info">Low</span>';

                html += `
                <div class="task-card-item ${isCompleted ? 'completed' : ''}">
                    <div class="task-checkbox-wrapper">
                        <input type="checkbox" class="task-custom-checkbox" ${isCompleted ? 'checked' : ''} onchange="toggleTaskStatus('${task.id}', '${doctor.id}')">
                        <div>
                            <span class="task-text">${task.title}</span>
                            <div class="task-meta">
                                <span><i class="fa-solid fa-tag"></i> ${task.category}</span>
                                <span><i class="fa-solid fa-clock"></i> ${task.date}</span>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex align-items-center gap-3">
                        ${priorityBadge}
                        <button type="button" class="btn btn-sm btn-link text-danger p-0" onclick="deleteTask('${task.id}', '${doctor.id}')"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                </div>`;
            });
            tasksListEl.innerHTML = html;
        }
    }

    // 2. Render Dashboard Quick Widget (Pending tasks only)
    if (quickTasksListEl) {
        const pendingTasks = tasks.filter(t => t.status === 'pending');
        if (pendingTasks.length === 0) {
            quickTasksListEl.innerHTML = `<p class="text-muted font-size-sm mb-0 py-3 text-center">No pending tasks for today.</p>`;
        } else {
            let html = '';
            pendingTasks.slice(0, 5).forEach(task => {
                let priorityColor = 'text-info';
                if (task.priority === 'High') priorityColor = 'text-danger';
                else if (task.priority === 'Medium') priorityColor = 'text-warning';

                html += `
                <div class="quick-task-widget-item">
                    <div class="d-flex align-items-center gap-2">
                        <input type="checkbox" class="form-check-input" onchange="toggleTaskStatus('${task.id}', '${doctor.id}')">
                        <span class="font-size-sm fw-semibold text-dark">${task.title}</span>
                    </div>
                    <i class="fa-solid fa-circle font-size-xxs ${priorityColor}"></i>
                </div>`;
            });
            quickTasksListEl.innerHTML = html;
        }
    }
}

function submitDoctorTask(doctor) {
    const titleInput = document.getElementById('task-title');
    const priorityInput = document.getElementById('task-priority');
    const categoryInput = document.getElementById('task-category');
    if (!titleInput) return;

    const title = titleInput.value;
    const priority = priorityInput.value;
    const category = categoryInput.value;

    if (!title) return;

    const tasks = getDB('tasks');
    const newTask = {
        id: 'task-' + (tasks.length + 1),
        doctorId: doctor.id,
        title: title,
        priority: priority,
        category: category,
        status: 'pending',
        date: new Date().toISOString().split('T')[0]
    };

    tasks.unshift(newTask);
    setDB('tasks', tasks);
    titleInput.value = '';
    
    showToast('Clinical task added successfully!');
    renderDoctorTasks(doctor);
}

window.toggleTaskStatus = function (taskId, doctorId) {
    const tasks = getDB('tasks');
    const idx = tasks.findIndex(t => t.id === taskId);
    if (idx !== -1) {
        tasks[idx].status = tasks[idx].status === 'completed' ? 'pending' : 'completed';
        setDB('tasks', tasks);
        showToast(tasks[idx].status === 'completed' ? 'Task marked as completed' : 'Task reopened');
        
        const doctors = getDB('doctors');
        const doctor = doctors.find(d => d.id === doctorId);
        if (doctor) {
            renderDoctorTasks(doctor);
        }
    }
};

window.deleteTask = function (taskId, doctorId) {
    if (confirm('Delete this task?')) {
        let tasks = getDB('tasks');
        tasks = tasks.filter(t => t.id !== taskId);
        setDB('tasks', tasks);
        showToast('Clinical task deleted.');
        
        const doctors = getDB('doctors');
        const doctor = doctors.find(d => d.id === doctorId);
        if (doctor) {
            renderDoctorTasks(doctor);
        }
    }
};



// --- LAB DASHBOARD WORKFLOWS ---
let laboraxOrdersChartInstance = null;
let laboraxStatusChartInstance = null;

function initLabPortal(labUser) {
    document.getElementById('user-display-name').innerText = labUser.name;
    document.getElementById('avatar-letters').innerText = labUser.name.split(' ').map(n=>n[0]).join('');

    renderLabRequests();
    renderLabDashboardCharts();
    setupLabWalkinSelectors();

    // Results Submitter
    const labEntryForm = document.getElementById('lab-entry-form');
    if (labEntryForm) {
        labEntryForm.addEventListener('submit', function (e) {
            e.preventDefault();
            submitLabResults(labUser);
        });
    }

    // Dropzone setup
    setupLabFileUploader();

    // Walk-in requests Form
    const walkinForm = document.getElementById('lab-walkin-form');
    if (walkinForm) {
        walkinForm.addEventListener('submit', function (e) {
            e.preventDefault();
            submitLabWalkin();
        });
    }
}

function renderLabRequests() {
    const requests = getDB('lab_requests');
    const pendingList = document.getElementById('lab-pending-requests');
    const completedList = document.getElementById('lab-completed-requests');

    const pending = requests.filter(r => r.status === 'pending');
    const completed = requests.filter(r => r.status === 'completed');

    if (document.getElementById('lab-stat-pending')) {
        document.getElementById('lab-stat-pending').innerText = `${pending.length} pending orders`;
    }

    if (pendingList) {
        if (pending.length === 0) {
            pendingList.innerHTML = `<tr><td colspan="7" class="text-center text-muted">No pending laboratory orders.</td></tr>`;
        } else {
            let html = '';
            pending.forEach(p => {
                let priorityClass = 'badge-low';
                if (p.priority === 'Critical') priorityClass = 'badge-critical';
                if (p.priority === 'High') priorityClass = 'badge-high';
                if (p.priority === 'Medium') priorityClass = 'badge-medium';

                html += `
                <tr>
                    <td><strong>${p.id}</strong></td>
                    <td>${p.patientName}</td>
                    <td>${p.testName}</td>
                    <td><span class="hc-badge-status ${priorityClass}">${p.priority || 'Medium'}</span></td>
                    <td>${p.requestDate}</td>
                    <td><span class="hc-badge-status badge-pending">PENDING</span></td>
                    <td>
                        <button class="btn btn-sm btn-hc-secondary" onclick="enterLabResults('${p.id}')"><i class="fa-solid fa-edit me-1"></i> Enter Results</button>
                    </td>
                </tr>`;
            });
            pendingList.innerHTML = html;
        }
    }

    if (completedList) {
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

function renderLabDashboardCharts() {
    const canvasOrders = document.getElementById('laboraxOrdersChart');
    const canvasStatus = document.getElementById('laboraxStatusChart');
    if (!canvasOrders || !canvasStatus) return;

    if (laboraxOrdersChartInstance) laboraxOrdersChartInstance.destroy();
    if (laboraxStatusChartInstance) laboraxStatusChartInstance.destroy();

    const requests = getDB('lab_requests');
    const pendingCount = requests.filter(r => r.status === 'pending').length;
    const completedCount = requests.filter(r => r.status === 'completed').length;

    laboraxOrdersChartInstance = new Chart(canvasOrders, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Test Orders',
                data: [14, 18, 22, 19, 25, 12, 16],
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
            labels: ['Completed', 'Pending Orders'],
            datasets: [{
                data: [completedCount, pendingCount],
                backgroundColor: ['#10b981', '#f59e0b'],
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
    const testCat = document.getElementById('walkin-cat').value;
    const testName = document.getElementById('walkin-name').value;
    const priority = document.getElementById('walkin-priority').value;

    const patient = getDB('patients').find(p => p.id === patientId);
    if (!patient) return;

    const newRequest = {
        id: 'lab-' + (getDB('lab_requests').length + 1),
        patientId: patientId,
        patientName: patient.name,
        doctorName: doctor,
        testCategory: testCat,
        testName: testName,
        requestDate: new Date().toISOString().split('T')[0],
        status: 'pending',
        resultDate: '',
        technician: '',
        priority: priority,
        results: []
    };

    await ApiService.createLabTest(newRequest);
    alert('Walk-in lab test request created!');
    document.getElementById('lab-walkin-form').reset();
    renderLabRequests();
    renderLabDashboardCharts();
    document.querySelector('[data-panel="panel-dashboard"]').click();
}

window.enterLabResults = function (requestId) {
    document.querySelector('[data-panel="panel-results-entry"]').click();
    const reqs = getDB('lab_requests');
    const req = reqs.find(r => r.id === requestId);

    if (req) {
        document.getElementById('entry-request-id').value = req.id;
        document.getElementById('entry-patient-name').value = req.patientName;
        document.getElementById('entry-test-name').value = req.testName;

        const container = document.getElementById('dynamic-param-rows');
        container.innerHTML = '';
        const params = getParametersForTest(req.testName);
        params.forEach(p => {
            container.innerHTML += `
            <div class="row g-3 mb-3 dynamic-param-row align-items-center">
                <div class="col-md-4">
                    <input type="text" class="form-control form-control-sm param-name" value="${p.name}" readonly>
                </div>
                <div class="col-md-3">
                    <input type="number" step="0.01" class="form-control form-control-sm param-value" placeholder="Result Value" required>
                </div>
                <div class="col-md-2">
                    <input type="text" class="form-control form-control-sm param-unit" value="${p.unit}" readonly>
                </div>
                <div class="col-md-3">
                    <input type="text" class="form-control form-control-sm param-range" value="${p.range}" readonly>
                </div>
            </div>`;
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
            <button type="button" class="btn btn-sm btn-link text-danger p-0" onclick="labScannedFileRecord=null; this.closest('.alert').remove()"><i class="fa-solid fa-times"></i></button>
        </div>`;
    }
}

async function submitLabResults(technician) {
    const reqId = document.getElementById('entry-request-id').value;
    const reqs = getDB('lab_requests');
    const reqIndex = reqs.findIndex(r => r.id === reqId);

    if (reqIndex === -1) {
        alert("Please enter results for a valid request ID.");
        return;
    }

    const rows = document.querySelectorAll('.dynamic-param-row');
    const results = [];

    rows.forEach(row => {
        const parameter = row.querySelector('.param-name').value;
        const value = parseFloat(row.querySelector('.param-value').value);
        const unit = row.querySelector('.param-unit').value;
        const refRange = row.querySelector('.param-range').value;

        let flag = 'Normal';
        if (refRange.includes('-')) {
            const parts = refRange.split('-');
            const min = parseFloat(parts[0]);
            const max = parseFloat(parts[1]);
            if (value < min) flag = 'Low';
            if (value > max) flag = 'High';
        } else if (refRange.includes('<')) {
            const limit = parseFloat(refRange.replace('<', '').trim());
            if (value >= limit) flag = 'High';
        } else if (refRange.includes('>')) {
            const limit = parseFloat(refRange.replace('>', '').trim());
            if (value <= limit) flag = 'Low';
        }

        results.push({ parameter, value, unit, refRange, flag });
    });

    const updateData = {
        status: 'completed',
        resultDate: new Date().toISOString().split('T')[0],
        technician: technician.name,
        results: results
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
    alert('Lab results authorized and report compiled successfully!');
    document.getElementById('lab-entry-form').reset();
    document.getElementById('dynamic-param-rows').innerHTML = '';
    const preview = document.getElementById('lab-uploaded-file-preview');
    if (preview) preview.innerHTML = '';
    labScannedFileRecord = null;

    renderLabRequests();
    renderLabDashboardCharts();
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
    const users = getDB('users');
    const labs = getDB('lab_requests');
    const depts = getDB('departments');

    document.getElementById('admin-stat-patients').innerText = users.filter(u => u.role === 'patient').length;
    document.getElementById('admin-stat-doctors').innerText = users.filter(u => u.role === 'doctor').length;
    document.getElementById('admin-stat-labs').innerText = labs.length;
    document.getElementById('admin-stat-depts').innerText = depts.length;
}

function renderAdminUserTable() {
    const table = document.getElementById('admin-users-list');
    if (!table) return;

    const users = getDB('users');
    let html = '';
    users.forEach(u => {
        html += `
        <tr>
            <td><strong>${u.name}</strong></td>
            <td>${u.email}</td>
            <td><span class="badge bg-secondary px-2 py-1">${u.role.toUpperCase()}</span></td>
            <td><code>${u.patientId || u.doctorId || 'System Admin'}</code></td>
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
    const list = document.querySelector('#panel-audits tbody');
    if (!list) return;

    const audits = getDB('audits');
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
    document.getElementById('edit-user-password').value = user.password;

    const modal = new bootstrap.Modal(document.getElementById('editUserModal'));
    modal.show();
};

function submitAdminUserEdit() {
    const originalEmail = document.getElementById('edit-user-original-email').value;
    const name = document.getElementById('edit-user-name').value;
    const email = document.getElementById('edit-user-email').value;
    const role = document.getElementById('edit-user-role').value;
    const password = document.getElementById('edit-user-password').value;

    const users = getDB('users');
    const idx = users.findIndex(u => u.email === originalEmail);
    if (idx === -1) return;

    users[idx].name = name;
    users[idx].email = email;
    users[idx].role = role;
    users[idx].password = password;

    setDB('users', users);
    alert("User profile updated successfully!");

    const modal = bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
    if (modal) modal.hide();

    renderAdminUserTable();
    renderAdminDashboard();
}

window.deleteUser = function (email) {
    if (confirm('Are you sure you want to delete this user?')) {
        let users = getDB('users');
        users = users.filter(u => u.email !== email);
        setDB('users', users);
        ApiService.addAuditLog('accounts', 'admin', `Deleted user account: ${email}`);
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

function renderAdminAnalyticsCharts() {
    const ctxLoad = document.getElementById('adminActivityChart');
    const ctxYearly = document.getElementById('adminYearlyIncomeChart');
    const ctxIncome = document.getElementById('adminIncomeDistChart');

    if (ctxLoad) {
        if (adminActivityChartInstance) adminActivityChartInstance.destroy();
        adminActivityChartInstance = new Chart(ctxLoad, {
            type: 'bar',
            data: {
                labels: ['Pediatrics', 'Cardiology', 'Neurology', 'General Med', 'Radiology', 'Pathology'],
                datasets: [
                    { label: 'Active Cases', data: [15, 32, 12, 45, 24, 50], backgroundColor: '#0f52ba' },
                    { label: 'Consultations', data: [20, 24, 18, 55, 30, 42], backgroundColor: '#10b981' }
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
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [
                    { label: 'Total Revenue ($)', data: [5000, 8000, 7500, 11000, 9500, 12000, 14000, 13000, 15000, 18000, 16000, 22000], borderColor: '#10b981', fill: false },
                    { label: 'Total Expenses ($)', data: [3000, 4500, 4000, 6000, 5000, 7000, 8500, 7500, 8000, 10000, 9500, 12000], borderColor: '#ef4444', fill: false }
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
                labels: ['OPD', 'IPD', 'Pharmacy', 'Pathology', 'Radiology'],
                datasets: [{
                    data: [10462, 2802, 21293, 3165, 2304],
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

window.viewLabReportModal = function (reportId) {
    const reqs = getDB('lab_requests');
    const req = reqs.find(r => r.id === reportId);
    if (!req) return;

    let modalEl = document.getElementById('labReportModal');
    if (!modalEl) {
        modalEl = document.createElement('div');
        modalEl.id = 'labReportModal';
        modalEl.className = 'modal fade';
        modalEl.setAttribute('tabindex', '-1');
        document.body.appendChild(modalEl);
    }

    let resultsHtml = '';
    req.results.forEach(res => {
        const isNormal = res.flag === 'Normal';
        resultsHtml += `
        <tr>
            <td>${res.parameter}</td>
            <td><strong>${res.value}</strong></td>
            <td>${res.unit}</td>
            <td>${res.refRange}</td>
            <td><span class="badge ${isNormal ? 'bg-success' : 'bg-danger'}">${res.flag}</span></td>
        </tr>`;
    });

    modalEl.innerHTML = `
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header border-0 no-print">
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body p-5 animate-fade-in" id="printable-report-body">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 class="text-primary mb-1 fw-bold"><i class="fa-solid fa-hospital text-success me-2 animate-pulse"></i>FutureCraft Health</h2>
                        <p class="text-muted mb-0 font-size-sm">EHR & Lab Management Portal</p>
                    </div>
                    <div class="text-end">
                        <h4 class="fw-bold">LABORATORY DIAGNOSTIC REPORT</h4>
                        <p class="mb-0">Report ID: <strong>${req.id}</strong></p>
                    </div>
                </div>
                <hr>
                <div class="row mb-4">
                    <div class="col-6">
                        <p class="mb-1 text-muted font-size-xs">PATIENT DETAILS</p>
                        <h5><strong>${req.patientName}</strong></h5>
                        <p class="mb-0 text-muted font-size-xs">Patient ID: ${req.patientId}</p>
                    </div>
                    <div class="col-6 text-end">
                        <p class="mb-1 text-muted font-size-xs">REPORT DETAILS</p>
                        <p class="mb-1 font-size-sm">Requested By: <strong>${req.doctorName}</strong></p>
                        <p class="mb-1 font-size-sm">Request Date: ${req.requestDate}</p>
                        <p class="mb-0 font-size-sm">Result Date: ${req.resultDate}</p>
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
                    <i class="fa-solid fa-paperclip me-2"></i>Attached Raw Scanned Document: <strong>${req.rawReportFile.name}</strong>
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
            <div class="modal-footer border-0 no-print">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" onclick="window.print()"><i class="fa-solid fa-print me-1"></i> Print / Save PDF</button>
            </div>
        </div>
    </div>`;

    const bsModal = new bootstrap.Modal(modalEl);
    bsModal.show();
};


// ==========================================
// 6. VALIDATION & TOAST HELPER UTILITIES
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

function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'hc-toast';
    toast.innerHTML = `
        <span><i class="fa-solid fa-circle-check text-success me-2 animate-pulse"></i>${message}</span>
        <button class="hc-toast-close">&times;</button>`;

    container.appendChild(toast);

    toast.querySelector('.hc-toast-close').addEventListener('click', () => toast.remove());
    setTimeout(() => toast.remove(), 4000);
}


// ==========================================
// 7. PORTAL BOOTSTRAP INITIALIZER
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
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
                    selectedRoleInput.value = this.getAttribute('data-role');
                });
            });

            loginForm.addEventListener('submit', async function (e) {
                e.preventDefault();
                const email = document.getElementById('login-email').value;
                const pass = document.getElementById('login-password').value;
                const role = selectedRoleInput.value;

                if (!role) {
                    alert('Please select your user portal role before logging in.');
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
                        alert(err.message);
                    }
                }
            });
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
                    alert('Passwords do not match.');
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
                    alert(res.message);
                    window.location.href = 'login.html';
                } catch (err) {
                    alert('Registration failed: ' + err.message);
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
});

function setupVitalsStatusWatchers() {
    const sysInput = document.getElementById('consult-sys');
    const diaInput = document.getElementById('consult-dia');
    const hrInput = document.getElementById('consult-hr');
    const tempInput = document.getElementById('consult-temp');

    const updateSysStatus = () => {
        const el = document.getElementById('sys-status');
        if (!el) return;
        const val = parseFloat(sysInput.value);
        if (isNaN(val) || sysInput.value === '') {
            el.innerText = '--';
            el.className = 'font-size-xxs fw-bold d-block mt-1 text-muted';
            return;
        }
        if (val < 90) {
            el.innerText = 'Low BP';
            el.className = 'font-size-xxs fw-bold d-block mt-1 text-info';
        } else if (val <= 120) {
            el.innerText = 'Normal';
            el.className = 'font-size-xxs fw-bold d-block mt-1 text-success';
        } else if (val <= 139) {
            el.innerText = 'Elevated';
            el.className = 'font-size-xxs fw-bold d-block mt-1 text-warning';
        } else {
            el.innerText = 'High BP';
            el.className = 'font-size-xxs fw-bold d-block mt-1 text-danger';
        }
    };

    const updateDiaStatus = () => {
        const el = document.getElementById('dia-status');
        if (!el) return;
        const val = parseFloat(diaInput.value);
        if (isNaN(val) || diaInput.value === '') {
            el.innerText = '--';
            el.className = 'font-size-xxs fw-bold d-block mt-1 text-muted';
            return;
        }
        if (val < 60) {
            el.innerText = 'Low BP';
            el.className = 'font-size-xxs fw-bold d-block mt-1 text-info';
        } else if (val <= 80) {
            el.innerText = 'Normal';
            el.className = 'font-size-xxs fw-bold d-block mt-1 text-success';
        } else if (val <= 89) {
            el.innerText = 'Elevated';
            el.className = 'font-size-xxs fw-bold d-block mt-1 text-warning';
        } else {
            el.innerText = 'High BP';
            el.className = 'font-size-xxs fw-bold d-block mt-1 text-danger';
        }
    };

    const updateHRStatus = () => {
        const el = document.getElementById('hr-status');
        if (!el) return;
        const val = parseFloat(hrInput.value);
        if (isNaN(val) || hrInput.value === '') {
            el.innerText = '--';
            el.className = 'font-size-xxs fw-bold d-block mt-1 text-muted';
            return;
        }
        if (val < 60) {
            el.innerText = 'Low HR';
            el.className = 'font-size-xxs fw-bold d-block mt-1 text-info';
        } else if (val <= 100) {
            el.innerText = 'Normal';
            el.className = 'font-size-xxs fw-bold d-block mt-1 text-success';
        } else {
            el.innerText = 'High HR';
            el.className = 'font-size-xxs fw-bold d-block mt-1 text-danger';
        }
    };

    const updateTempStatus = () => {
        const el = document.getElementById('temp-status');
        if (!el) return;
        const val = parseFloat(tempInput.value);
        if (isNaN(val) || tempInput.value === '') {
            el.innerText = '--';
            el.className = 'font-size-xxs fw-bold d-block mt-1 text-muted';
            return;
        }
        if (val < 95.0) {
            el.innerText = 'Low Temp';
            el.className = 'font-size-xxs fw-bold d-block mt-1 text-info';
        } else if (val <= 99.4) {
            el.innerText = 'Normal';
            el.className = 'font-size-xxs fw-bold d-block mt-1 text-success';
        } else if (val <= 100.4) {
            el.innerText = 'Low Grade Fever';
            el.className = 'font-size-xxs fw-bold d-block mt-1 text-warning';
        } else {
            el.innerText = 'High Fever';
            el.className = 'font-size-xxs fw-bold d-block mt-1 text-danger';
        }
    };

    if (sysInput) { sysInput.addEventListener('input', updateSysStatus); updateSysStatus(); }
    if (diaInput) { diaInput.addEventListener('input', updateDiaStatus); updateDiaStatus(); }
    if (hrInput) { hrInput.addEventListener('input', updateHRStatus); updateHRStatus(); }
    if (tempInput) { tempInput.addEventListener('input', updateTempStatus); updateTempStatus(); }

    // Clear vitals indicators when form is reset
    const consultForm = document.getElementById('doctor-consult-form');
    if (consultForm) {
        consultForm.addEventListener('reset', () => {
            setTimeout(() => {
                updateSysStatus();
                updateDiaStatus();
                updateHRStatus();
                updateTempStatus();
            }, 10);
        });
    }
}
