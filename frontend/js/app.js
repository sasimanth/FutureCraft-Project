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
    }
];

const DEFAULT_USERS = [
    { email: 'admin@ehrmail.com', password: 'password123', name: 'Administrator', role: 'admin' },
    { email: 'sarah.connor@ehrmail.com', password: 'password123', name: 'Dr. Sarah Connor', role: 'doctor', doctorId: 'doc-1' },
    { email: 'robert.chen@ehrmail.com', password: 'password123', name: 'Dr. Robert Chen', role: 'doctor', doctorId: 'doc-2' },
    { email: 'labtech@ehrmail.com', password: 'password123', name: 'Alex Mercer', role: 'labtech' },
    { email: 'john.doe@ehrmail.com', password: 'password123', name: 'John Doe', role: 'patient', patientId: 'pat-1' },
    { email: 'emma.watson@ehrmail.com', password: 'password123', name: 'Emma Watson', role: 'patient', patientId: 'pat-2' }
];

const DEFAULT_APPOINTMENTS = [
    { id: 'appt-1', patientId: 'pat-1', doctorId: 'doc-1', doctorName: 'Dr. Sarah Connor', deptName: 'General Medicine', date: '2026-06-20', timeSlot: '09:30 AM', symptoms: 'Follow-up on blood pressure regulation.', status: 'confirmed', type: 'Doctor Checkup' },
    { id: 'appt-2', patientId: 'pat-2', doctorId: 'doc-4', doctorName: 'Dr. Emily Watson', deptName: 'Pediatrics', date: '2026-06-22', timeSlot: '11:00 AM', symptoms: 'Routine health checkup and vitamin consultation.', status: 'confirmed', type: 'Doctor Checkup' },
    { id: 'appt-3', patientId: 'pat-1', doctorId: 'doc-1', doctorName: 'Dr. Sarah Connor', deptName: 'General Medicine', date: '2026-06-25', timeSlot: '10:30 AM', symptoms: 'BP check and medication renewal.', status: 'confirmed', type: 'Doctor Checkup' }
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

    syncDataFromServer: async function () {
        if (this.useMock) return;
        try {
            const activeUser = JSON.parse(sessionStorage.getItem('hc_current_user'));
            if (!activeUser) return;
            
            const [patients, doctors, appointments, prescriptions, labRequests, audits, departments] = await Promise.all([
                this.getPatients().catch(() => []),
                this._request('/doctors/').catch(() => []),
                this.getAppointments().catch(() => []),
                this.getPrescriptions().catch(() => []),
                this.getLabTests().catch(() => []),
                this._request('/audits/').catch(() => []),
                this._request('/departments/').catch(() => [])
            ]);

            setDB('patients', patients);
            setDB('doctors', doctors);
            setDB('appointments', appointments);
            setDB('prescriptions', prescriptions);
            setDB('lab_requests', labRequests);
            setDB('audits', audits);
            setDB('departments', departments);

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
        let badgeClass = 'badge-active';
        if (ap.status === 'pending') badgeClass = 'badge-pending';
        if (ap.status === 'confirmed') badgeClass = 'badge-completed';
        if (ap.status === 'cancelled') badgeClass = 'badge-cancelled';
        if (ap.status === 'completed') badgeClass = 'badge-completed';

        html += `
        <tr>
            <td><strong>${ap.date}</strong></td>
            <td>${ap.timeSlot}</td>
            <td>${ap.doctorName}</td>
            <td>${ap.deptName}</td>
            <td>${ap.symptoms || 'Routine follow-up'}</td>
            <td><span class="hc-badge-status ${badgeClass}">${ap.status.toUpperCase()}</span></td>
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

    renderDoctorAnalytics(doctor);

    // Consultation Med Rows Button
    const addMedBtn = document.getElementById('doc-add-med-btn');
    if (addMedBtn) {
        addMedBtn.replaceWith(addMedBtn.cloneNode(true)); // remove old listeners
        document.getElementById('doc-add-med-btn').addEventListener('click', addPrescriptionRowToConsult);
    }

    // Submit consultation
    const consultForm = document.getElementById('doctor-consult-form');
    if (consultForm) {
        consultForm.replaceWith(consultForm.cloneNode(true)); // remove old listeners
        document.getElementById('doctor-consult-form').addEventListener('submit', function (e) {
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
            if (summary) summary.classList.add('d-none');
            document.querySelectorAll('.consult-active-fields').forEach(el => el.classList.add('d-none'));
            if (placeholder) placeholder.classList.remove('d-none');
            return;
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
    row.className = 'row g-3 prescription-item-row animate-slide-up mt-1';
    row.innerHTML = `
        <div class="col-md-4">
            <input type="text" class="form-control form-control-sm med-name" placeholder="Medication Name" required>
        </div>
        <div class="col-md-3">
            <input type="text" class="form-control form-control-sm med-dose" placeholder="Dosage (e.g. 1 tab)" required>
        </div>
        <div class="col-md-2">
            <input type="text" class="form-control form-control-sm med-duration" placeholder="Duration" required>
        </div>
        <div class="col-md-2">
            <input type="text" class="form-control form-control-sm med-instr" placeholder="Instructions">
        </div>
        <div class="col-md-1 d-flex align-items-end justify-content-center">
            <button type="button" class="btn btn-sm btn-outline-danger" onclick="this.closest('.prescription-item-row').remove()"><i class="fa-solid fa-trash"></i></button>
        </div>`;
    list.appendChild(row);
}

async function submitDoctorConsultation(doctor) {
    const patientId = document.getElementById('consult-patient-select').value;
    if (!patientId) {
        Toast.warning('Please choose a patient.');
        return;
    }

    const bpSystolic = parseInt(document.getElementById('consult-sys').value);
    const bpDiastolic = parseInt(document.getElementById('consult-dia').value);
    const heartRate = parseInt(document.getElementById('consult-hr').value);
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

    if (isNaN(bpSystolic) || isNaN(bpDiastolic) || isNaN(heartRate) || !diagnosis || !diagnosis.trim()) {
        Toast.warning("Please complete all required vitals (Systolic, Diastolic, Heart Rate) and diagnosis details.");
        return;
    }

    const patient = getDB('patients').find(p => p.id === patientId);
    if (!patient) return;

    const todayStr = new Date().toISOString().split('T')[0];

    try {
        // 1. Add Vitals via dedicated endpoint
        const vitalData = { date: todayStr, bpSystolic, bpDiastolic, heartRate, temp, weight };
        await ApiService.addPatientVitals(patientId, vitalData);

        // 2. Add Diagnosis via dedicated endpoint
        const historyData = { date: todayStr, condition: diagnosis, diagnosedBy: doctor.name, status: 'Active' };
        await ApiService.addPatientMedicalHistory(patientId, historyData);

        // 2a. Save explicit Consultation record
        const newConsultation = {
            id: 'con-' + Date.now(),
            patientId: patientId,
            doctorName: doctor.name,
            diagnosis: diagnosis,
            consultationDate: todayStr,
            symptoms: symptomsNotes || 'N/A',
            recommendations: clinicalNotes || 'N/A'
        };
        await ApiService.createConsultation(newConsultation);

        // 2b. Log the Patient Visit record
        const depts = getDB('departments') || [];
        const deptObj = depts.find(d => d.id === doctor.deptId);
        const deptName = deptObj ? deptObj.name : 'General Medicine';
        const newVisit = {
            date: todayStr,
            department: deptName,
            doctorName: doctor.name,
            reason: diagnosis
        };
        await ApiService.addPatientVisit(patientId, newVisit);

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

            const newRx = {
                id: 'rx-' + Date.now(),
                patientId: patient.id,
                doctorName: doctor.name,
                date: todayStr,
                diagnosis: diagnosis,
                medicines: medicines
            };
            await ApiService.createPrescription(newRx);
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
                resultDate: null,
                technician: '',
                priority: 'Medium',
                results: []
            };
            await ApiService.createLabTest(labReq);
        }

        // 4a. Handle Follow-up scheduling
        if (followupCheck && followupDate) {
            const newAppt = {
                id: 'appt-' + (getDB('appointments').length + Date.now()),
                patientId: patientId,
                doctorId: doctor.id,
                doctorName: doctor.name,
                deptName: deptName,
                date: followupDate,
                timeSlot: followupTime,
                symptoms: `Scheduled clinical follow-up for: ${diagnosis}`,
                status: 'confirmed',
                type: 'Doctor Checkup'
            };
            await ApiService.createAppointment(newAppt);
        }

        // 5. Update appointment status to completed
        const activeApptId = sessionStorage.getItem('hc_active_appt_consult');
        if (activeApptId) {
            await ApiService.updateAppointmentStatus(activeApptId, 'completed');
            sessionStorage.removeItem('hc_active_appt_consult');
        } else {
            await ApiService.syncDataFromServer();
        }

        Toast.success('Consultation completed successfully! EHR updated.');
        document.getElementById('doctor-consult-form').reset();
        document.getElementById('consult-med-rows').innerHTML = '';
        
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
        Toast.error("Failed to submit consultation: " + err.message);
    }
}

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
        const matchesQuery = p.id.toLowerCase().includes(query) || p.name.toLowerCase().includes(query);
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
                    <td>${m.duration}</td>
                </tr>`;
            });
        });
    } else {
        rxList.innerHTML = '<tr><td colspan="4" class="text-center text-muted font-size-xs">No active prescriptions.</td></tr>';
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
async function renderDoctorAnalytics(doctor) {
    let totalConsults = getDB('prescriptions').filter(p => p.doctorName === doctor.name).length;
    let patients = getDB('patients').length;
    let labsOrdered = getDB('lab_requests').filter(l => l.doctorName === doctor.name).length;
    let chartLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    let chartData = [18, 22, 28, 20, 24, totalConsults + 5];

    if (!ApiService.useMock) {
        try {
            const data = await ApiService.getDoctorAnalytics();
            totalConsults = data.totalConsultations;
            patients = data.totalPatients;
            // todayAppointments is also returned, but totalConsults and patients map directly
            // For the load chart, use weeklyLoad if available from server
            if (data.weeklyLoad) {
                chartLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                chartData = data.weeklyLoad;
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

    const canvas = document.getElementById('doctorConsultsChart');
    if (!canvas) return;

    if (doctorConsultsChartInstance) doctorConsultsChartInstance.destroy();

    doctorConsultsChartInstance = new Chart(canvas, {
        type: 'bar',
        data: {
            labels: chartLabels,
            datasets: [{
                label: 'Consultation Load',
                data: chartData,
                backgroundColor: '#0f52ba',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true }, x: { grid: { display: false } } }
        }
    });
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

function renderLabRequests() {
    const requests = getDB('lab_requests');
    const pendingList = document.getElementById('lab-pending-requests');
    const completedList = document.getElementById('lab-completed-requests');

    const pending = requests.filter(r => r.status !== 'completed');
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

                let statusBadge = '';
                let actionBtn = '';

                if (p.status === 'pending' || p.status === 'registered') {
                    statusBadge = `<span class="badge bg-info text-white font-size-xxs py-1 px-2">REGISTERED</span>`;
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
                } else {
                    statusBadge = `<span class="badge bg-secondary text-white font-size-xxs py-1 px-2">${p.status.toUpperCase()}</span>`;
                    actionBtn = `<button class="btn btn-xs btn-hc-secondary text-white" onclick="enterLabResults('${p.id}')"><i class="fa-solid fa-edit me-1"></i>Enter Results</button>`;
                }

                html += `
                <tr>
                    <td><strong>${p.id}</strong></td>
                    <td>${p.patientName}</td>
                    <td>${p.testName}</td>
                    <td><span class="hc-badge-status ${priorityClass}">${p.priority || 'Medium'}</span></td>
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
    const testCat = document.getElementById('walkin-cat').value;
    const testName = document.getElementById('walkin-name').value;
    const priority = document.getElementById('walkin-priority').value;

    const patient = getDB('patients').find(p => p.id === patientId);
    if (!patient) {
        Toast.warning('Please choose a valid patient.');
        return;
    }

    const newRequest = {
        id: 'lab-' + (getDB('lab_requests').length + 1),
        patientId: patientId,
        patientName: patient.name,
        doctorName: doctor,
        testCategory: testCat,
        testName: testName,
        requestDate: new Date().toISOString().split('T')[0],
        status: 'registered', // start in Registered stage
        resultDate: null,
        technician: '',
        priority: priority,
        results: []
    };

    await ApiService.createLabTest(newRequest);
    Toast.success('Walk-in laboratory request registered successfully!');
    document.getElementById('lab-walkin-form').reset();
    renderLabRequests();
    renderLabDashboardCharts();
    updateLabTechStats();
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

    if (!ApiService.useMock) {
        const formData = new FormData();
        formData.append('status', 'completed');
        formData.append('resultDate', new Date().toISOString().split('T')[0]);
        formData.append('technician', technician.name);
        formData.append('results', JSON.stringify(results));
        
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
            alert('Lab results authorized and report compiled successfully!');
            document.getElementById('lab-entry-form').reset();
            document.getElementById('dynamic-param-rows').innerHTML = '';
            const preview = document.getElementById('lab-uploaded-file-preview');
            if (preview) preview.innerHTML = '';
            labScannedFileRecord = null;
            labScannedFileObj = null;

            await ApiService.syncDataFromServer();
            renderLabRequests();
            renderLabDashboardCharts();
            document.querySelector('[data-panel="panel-dashboard"]').click();
            return;
        } catch (err) {
            alert("Submission failed: " + err.message);
            return;
        }
    }

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
    const appointments = getDB('appointments');

    document.getElementById('admin-stat-patients').innerText = users.filter(u => u.role === 'patient').length;
    document.getElementById('admin-stat-doctors').innerText = users.filter(u => u.role === 'doctor').length;
    document.getElementById('admin-stat-labs').innerText = labs.length;
    document.getElementById('admin-stat-depts').innerText = depts.length;

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
    document.getElementById('edit-user-password').value = user.password || '';
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
    const userId = document.getElementById('editUserModal').getAttribute('data-user-id');

    if (!ApiService.useMock && userId) {
        try {
            await ApiService.updateUser(userId, { name, email, role, password });
            await ApiService.syncDataFromServer();
            alert("User profile updated successfully in database!");
        } catch (err) {
            alert("Failed to update user: " + err.message);
            return;
        }
    } else {
        const users = getDB('users');
        const idx = users.findIndex(u => u.email === originalEmail);
        if (idx !== -1) {
            users[idx].name = name;
            users[idx].email = email;
            users[idx].role = role;
            users[idx].password = password;
            setDB('users', users);
            alert("User profile updated successfully!");
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
                        <h2 class="text-primary mb-1 fw-bold">CurePoint</h2>
                        <p class="text-muted mb-0 font-size-sm">Clinical Diagnostics & Lab Platform</p>
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
                ${!ApiService.useMock ? `<button type="button" class="btn btn-success text-white" onclick="downloadPdfReport('lab-report', '${req.id}')"><i class="fa-solid fa-download me-1"></i> Download PDF</button>` : ''}
                <button type="button" class="btn btn-primary" onclick="window.print()"><i class="fa-solid fa-print me-1"></i> Print / Save PDF</button>
            </div>
        </div>
    </div>`;

    const bsModal = new bootstrap.Modal(modalEl);
    bsModal.show();
};

window.downloadPdfReport = async function (type, id) {
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

window.deleteDoctorLeave = function (leaveId) {
    let leaves = getDB('leaves') || [];
    leaves = leaves.filter(l => l.id !== leaveId);
    setDB('leaves', leaves);
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
};

window.setupDoctorLeaveForm = function (doctor) {
    const form = document.getElementById('doctor-leave-form');
    if (!form) return;

    form.replaceWith(form.cloneNode(true));
    const newForm = document.getElementById('doctor-leave-form');

    newForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const start = document.getElementById('leave-start').value;
        const end = document.getElementById('leave-end').value;
        const type = document.getElementById('leave-type').value;
        const reason = document.getElementById('leave-reason').value;

        if (new Date(start) > new Date(end)) {
            Toast.error('Start date cannot be after end date.');
            return;
        }

        const leaves = getDB('leaves') || [];
        const newLeave = {
            id: 'leave-' + Date.now(),
            doctorId: doctor.id,
            doctorName: doctor.name,
            startDate: start,
            endDate: end,
            type: type,
            reason: reason,
            status: 'Approved' // auto-approved
        };

        leaves.push(newLeave);
        setDB('leaves', leaves);
        Toast.success('Leave requested and approved successfully!');
        newForm.reset();
        
        renderDoctorLeaves(doctor);
        renderDoctorCalendarWorkspace(doctor);
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
                    const appointments = getDB('appointments');
                    const appt = appointments.find(a => a.id === apptId);
                    if (appt) {
                        appt.date = newDate;
                        appt.timeSlot = newSlot;
                        setDB('appointments', appointments);
                        
                        Toast.success(`Appointment rescheduled to ${newDate} at ${newSlot}`);
                        renderDoctorCalendarWorkspace(doctor);
                    }
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
        <div class="spec-card p-3 border rounded text-center cursor-pointer hover-shadow" data-dept-id="${dept.id}" data-dept-name="${dept.name}">
            <i class="fa-solid fa-notes-medical fs-3 text-primary mb-2"></i>
            <div class="fw-bold font-size-sm">${dept.name}</div>
            <div class="text-muted font-size-xxs">${dept.staffCount} staff</div>
        </div>
    `).join('');

    const cards = specGrid.querySelectorAll('.spec-card');
    cards.forEach(card => {
        card.addEventListener('click', function () {
            cards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
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

            if (availableSlots.length === 0) {
                slotsGrid.innerHTML = `<div class="alert alert-info font-size-xs col-12 py-2">No available time slots on this date.</div>`;
            } else {
                slotsGrid.innerHTML = availableSlots.map(slot => `
                    <div class="slot-btn" data-slot="${slot}">${slot}</div>
                `).join('');

                const slotBtns = slotsGrid.querySelectorAll('.slot-btn');
                slotBtns.forEach(btn => {
                    btn.addEventListener('click', function () {
                        slotBtns.forEach(b => b.classList.remove('active'));
                        this.classList.add('active');
                        const selectedSlot = this.getAttribute('data-slot');
                        document.getElementById('booking-time-slot').value = selectedSlot;
                        document.getElementById('btn-to-step4').removeAttribute('disabled');
                    });
                });
            }
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
    const requests = getDB('lab_requests');
    const todayStr = new Date().toISOString().split('T')[0];
    const todayRequests = requests.filter(r => r.requestDate === todayStr);

    const delayedCount = requests.filter(r => r.status !== 'completed' && r.requestDate < todayStr).length;
    const criticalCount = requests.filter(r => (r.priority === 'Critical' || r.priority === 'High') && r.status !== 'completed').length;
    let avgTatText = "04 hr 15 mins";

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

window.advanceLabStatus = function (reqId, newStatus) {
    const requests = getDB('lab_requests');
    const req = requests.find(r => r.id === reqId);
    if (req) {
        req.status = newStatus;
        setDB('lab_requests', requests);
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
