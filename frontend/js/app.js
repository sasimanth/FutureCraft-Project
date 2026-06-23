/**
 * EHR & Laboratory Management Portal - Core JavaScript File
 * Developed by Antigravity AI (FutureCraft Project)
 * Contains Mock Database, LocalStorage Sync, Form Validators, Chart Initializers, and Portal Workflows.
 */

// ==========================================
// 1. MOCK DATABASE INITIALIZATION
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
    { id: 'appt-1', patientId: 'pat-1', doctorId: 'doc-1', doctorName: 'Dr. Sarah Connor', deptName: 'General Medicine', date: '2026-06-20', timeSlot: '09:30 AM', symptoms: 'Follow-up on blood pressure regulation.', status: 'confirmed' },
    { id: 'appt-2', patientId: 'pat-2', doctorId: 'doc-4', doctorName: 'Dr. Emily Watson', deptName: 'Pediatrics', date: '2026-06-20', timeSlot: '11:00 AM', symptoms: 'Routine health checkup and vitamin consultation.', status: 'confirmed' }
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
        results: [
            { parameter: 'White Blood Cell (WBC)', value: 6.8, unit: '10^3/uL', refRange: '4.5 - 11.0', flag: 'Normal' },
            { parameter: 'Red Blood Cell (RBC)', value: 4.9, unit: '10^6/uL', refRange: '4.3 - 5.9', flag: 'Normal' },
            { parameter: 'Hemoglobin (Hgb)', value: 14.8, unit: 'g/dL', refRange: '13.5 - 17.5', flag: 'Normal' },
            { parameter: 'Hematocrit (Hct)', value: 44.2, unit: '%', refRange: '41.0 - 50.0', flag: 'Normal' },
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
        results: []
    }
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
        localStorage.setItem('hc_seeded', 'true');
        console.log('EHR Laboratory Portal Database Seeded Successfully!');
    }
}

// Getters and setters
function getDB(key) {
    return JSON.parse(localStorage.getItem('hc_' + key)) || [];
}

function setDB(key, data) {
    localStorage.setItem('hc_' + key, JSON.stringify(data));
}

// Initialize on script load
initializeDatabase();


// ==========================================
// 2. AUTHENTICATION SERVICES
// ==========================================

const AuthService = {
    login: function (email, password, role) {
        const users = getDB('users');
        const user = users.find(u => u.email === email && u.password === password && u.role === role);
        
        if (user) {
            sessionStorage.setItem('hc_current_user', JSON.stringify(user));
            return { success: true, redirect: role + '-dashboard.html' };
        }
        return { success: false, message: 'Invalid credentials or selected role.' };
    },

    register: function (name, email, password, role, extraFields = {}) {
        const users = getDB('users');
        if (users.some(u => u.email === email)) {
            return { success: false, message: 'Email address already registered.' };
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
        } else if (role === 'doctor') {
            const doctors = getDB('doctors');
            const newDocId = 'doc-' + (doctors.length + 1);
            newUser.doctorId = newDocId;

            const newDoctor = {
                id: newDocId,
                name: 'Dr. ' + name,
                deptId: extraFields.deptId || 'dept-1',
                specialization: extraFields.specialization || 'General Practitioner',
                email
            };

            doctors.push(newDoctor);
            setDB('doctors', doctors);
        }

        users.push(newUser);
        setDB('users', users);

        return { success: true, message: 'Account registered successfully.' };
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
            
            // Hide sidebar on mobile click
            if (mobileSidebar && mobileSidebar.classList.contains('show')) {
                mobileSidebar.classList.remove('show');
            }

            const targetPanel = this.getAttribute('data-panel');

            // Remove active class from menu items
            document.querySelectorAll('.sidebar-item').forEach(item => {
                item.classList.remove('active');
            });
            this.closest('.sidebar-item').classList.add('active');

            // Show current panel, hide others
            panels.forEach(panel => {
                if (panel.id === targetPanel) {
                    panel.classList.add('active');
                } else {
                    panel.classList.remove('active');
                }
            });

            // Set Breadcrumb Title
            const panelTitle = this.querySelector('span').innerText;
            const breadcrumbEl = document.getElementById('breadcrumb-title');
            if (breadcrumbEl) {
                breadcrumbEl.innerText = panelTitle;
            }
        });
    });
    function setupDashboardNavigation() {

    const navLinks = document.querySelectorAll('.sidebar-link[data-panel]');
    const panels = document.querySelectorAll('.dashboard-panel');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetPanel = this.getAttribute('data-panel');

            panels.forEach(panel => {
                panel.classList.remove('active');
            });

            document.getElementById(targetPanel).classList.add('active');
        });
    });

    // ADD YOUR NEW CODE HERE

} // function ends here
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

    // Header updates
    document.getElementById('user-display-name').innerText = patient.name;
    document.getElementById('avatar-letters').innerText = patient.name.split(' ').map(n=>n[0]).join('');

    // Load Overview Panels
    renderPatientOverview(patient);
    renderPatientVitalsCharts(patient);
    renderPatientMedicalHistory(patient);
    renderPatientPrescriptions(patient);
    renderPatientLabReports(patient);
    renderPatientAppointments(patient);

    // Book Appointment Form Handler
    const apptForm = document.getElementById('book-appointment-form');
    if (apptForm) {
        // Load Doctors Dropdown
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

            if (!doctorId || !apptDate || !apptTime) {
                alert('Please fill out all required fields.');
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
                deptName: deptObj ? deptObj.name : 'Outpatient Dept',
                date: apptDate,
                timeSlot: apptTime,
                symptoms: apptSymptoms,
                status: 'confirmed'
            };

            appts.push(newAppt);
            setDB('appointments', appts);

            alert('Appointment booked successfully!');
            apptForm.reset();
            renderPatientAppointments(patient);
            
            // Go to appointment panel
            document.querySelector('[data-panel="panel-appointments"]').click();
        });
    }

    // Profile Edit Handler
    const profileForm = document.getElementById('patient-profile-form');
    if (profileForm) {
        // Fill initial profile
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
            patient.dob = document.getElementById('profile-dob').value;
            patient.gender = document.getElementById('profile-gender').value;
            patient.bloodGroup = document.getElementById('profile-blood').value;
            patient.phone = document.getElementById('profile-phone').value;
            patient.emergencyName = document.getElementById('profile-emergency-name').value;
            patient.emergencyPhone = document.getElementById('profile-emergency-phone').value;
            patient.allergies = document.getElementById('profile-allergies').value;

            // Save back
            const patIndex = patients.findIndex(p => p.id === patient.id);
            patients[patIndex] = patient;
            setDB('patients', patients);

            alert('Profile updated successfully!');
            renderPatientOverview(patient);
        });
    }
}

function renderPatientOverview(patient) {
    // Fill stats cards
    const prescriptions = getDB('prescriptions').filter(pr => pr.patientId === patient.id);
    const labRequests = getDB('lab_requests').filter(l => l.patientId === patient.id);
    const appts = getDB('appointments').filter(ap => ap.patientId === patient.id);

    document.getElementById('patient-active-rx').innerText = prescriptions.length;
    document.getElementById('patient-pending-labs').innerText = labRequests.filter(l => l.status === 'pending').length;
    
    // Find next appointment
    const todayStr = new Date().toISOString().split('T')[0];
    const upcoming = appts.filter(ap => ap.date >= todayStr && ap.status === 'confirmed');
    document.getElementById('patient-next-appt').innerText = upcoming.length > 0 ? upcoming[0].date : 'None Scheduled';

    // Set side panel summaries
    document.getElementById('panel-allergies-summary').innerText = patient.allergies || 'No known allergies.';

    // Populate Current Vitals Card Details
    if (patient.vitalsHistory && patient.vitalsHistory.length > 0) {
        const latest = patient.vitalsHistory[patient.vitalsHistory.length - 1];
        document.getElementById('vital-bp-val').innerText = `${latest.bpSystolic}/${latest.bpDiastolic} mmHg`;
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
                {
                    label: 'BP Systolic',
                    data: sysData,
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.3,
                    yAxisID: 'y'
                },
                {
                    label: 'BP Diastolic',
                    data: diaData,
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    tension: 0.3,
                    yAxisID: 'y'
                },
                {
                    label: 'Heart Rate (bpm)',
                    data: hrData,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.3,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: { display: true, text: 'mmHg' }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: { display: true, text: 'bpm' },
                    grid: { drawOnChartArea: false }
                }
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
                <p class="text-muted mb-0">Diagnosed by: <strong>${h.diagnosedBy}</strong> | Status: <span class="badge ${h.status === 'Managed' ? 'bg-info' : 'bg-success'}">${h.status}</span></p>
            </div>
        </div>
        `;
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
    prescriptions.forEach((rx, index) => {
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
        labList.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No laboratory tests requested.</td></tr>`;
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
                ${isCompleted ? `<button class="btn btn-sm btn-outline-primary" onclick="viewLabReportModal('${req.id}')"><i class="fa-solid fa-eye me-1"></i> View Report</button>` : `<span class="text-muted"><i class="fa-solid fa-hourglass-half me-1"></i> In Progress</span>`}
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
        apptList.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No appointments booked.</td></tr>`;
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
            <td>${ap.symptoms || 'General Checkup'}</td>
            <td><span class="hc-badge-status badge-active">${ap.status.toUpperCase()}</span></td>
        </tr>`;
    });
    apptList.innerHTML = html;
}


// --- DOCTOR DASHBOARD WORKFLOWS ---
function initDoctorPortal(doctorUser) {
    const docId = doctorUser.doctorId;
    const doctors = getDB('doctors');
    const doctor = doctors.find(d => d.id === docId);
    if (!doctor) return;

    // Header updates
    document.getElementById('user-display-name').innerText = doctor.name;
    document.getElementById('avatar-letters').innerText = doctor.name.replace('Dr. ', '').split(' ').map(n=>n[0]).join('');

    renderDoctorDashboard(doctor);

    // Initialize consultation workbench details
    setupDoctorPatientSelectors();

    // Consultation builder prescription rows
    const addMedBtn = document.getElementById('doc-add-med-btn');
    if (addMedBtn) {
        addMedBtn.addEventListener('click', addPrescriptionRowToConsult);
    }

    // Submit consultation details
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

    document.getElementById('doc-today-appts').innerText = appointments.length;
    document.getElementById('doc-pending-labs').innerText = labs.filter(l => l.status === 'pending').length;

    // Doctor appointment queue table
    const apptQueue = document.getElementById('doctor-appt-queue');
    if (apptQueue) {
        if (appointments.length === 0) {
            apptQueue.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No consultations scheduled.</td></tr>`;
            return;
        }

        let html = '';
        const patients = getDB('patients');
        appointments.forEach(ap => {
            const pat = patients.find(p => p.id === ap.patientId);
            html += `
            <tr>
                <td><strong>${ap.timeSlot}</strong></td>
                <td>${pat ? pat.name : 'Unknown Patient'}</td>
                <td>${pat ? (new Date().getFullYear() - new Date(pat.dob).getFullYear()) : '--'}</td>
                <td>${ap.symptoms}</td>
                <td>
                    <button class="btn btn-sm btn-hc-primary" onclick="startConsultation('${ap.patientId}', '${ap.id}')"><i class="fa-solid fa-stethoscope me-1"></i> Consult</button>
                </td>
            </tr>`;
        });
        apptQueue.innerHTML = html;
    }
}

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
        if (!patId) {
            infoCard.classList.add('d-none');
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
        }
    });
}

function startConsultation(patientId, appointmentId) {
    // Navigate to Consult tab programmatically
    document.querySelector('[data-panel="panel-consultation"]').click();
    
    // Select patient in dropdown
    const patSelect = document.getElementById('consult-patient-select');
    if (patSelect) {
        patSelect.value = patientId;
        patSelect.dispatchEvent(new Event('change'));
    }

    // Save appointment target
    sessionStorage.setItem('hc_active_appt_consult', appointmentId);
}

function addPrescriptionRowToConsult() {
    const list = document.getElementById('consult-med-rows');
    if (!list) return;

    const row = document.createElement('div');
    row.className = 'row g-3 prescription-item-row animate-slide-up';
    row.innerHTML = `
        <div class="col-md-4">
            <label class="form-label font-size-sm">Medication Name</label>
            <input type="text" class="form-control form-control-sm med-name" placeholder="e.g. Paracetamol 500mg" required>
        </div>
        <div class="col-md-3">
            <label class="form-label font-size-sm">Dosage</label>
            <input type="text" class="form-control form-control-sm med-dose" placeholder="e.g. 1 tablet twice daily" required>
        </div>
        <div class="col-md-2">
            <label class="form-label font-size-sm">Duration</label>
            <input type="text" class="form-control form-control-sm med-duration" placeholder="e.g. 7 days" required>
        </div>
        <div class="col-md-2">
            <label class="form-label font-size-sm">Instructions</label>
            <input type="text" class="form-control form-control-sm med-instr" placeholder="e.g. After meals">
        </div>
        <div class="col-md-1 d-flex align-items-end">
            <button type="button" class="btn btn-sm btn-outline-danger mb-1" onclick="this.closest('.prescription-item-row').remove()"><i class="fa-solid fa-trash"></i></button>
        </div>
    `;
    list.appendChild(row);
}

function submitDoctorConsultation(doctor) {
    const patientId = document.getElementById('consult-patient-select').value;
    if (!patientId) {
        alert('Please select a patient.');
        return;
    }

    const bpSystolic = parseInt(document.getElementById('consult-sys').value);
    const bpDiastolic = parseInt(document.getElementById('consult-dia').value);
    const heartRate = parseInt(document.getElementById('consult-hr').value);
    const temp = parseFloat(document.getElementById('consult-temp').value);
    const weight = parseFloat(document.getElementById('consult-weight').value);

    const diagnosis = document.getElementById('consult-diagnosis').value;
    const clinicalNotes = document.getElementById('consult-notes').value;

    const requestLabTest = document.getElementById('consult-order-lab').checked;
    const labTestName = document.getElementById('consult-lab-name').value;
    const labTestCategory = document.getElementById('consult-lab-cat').value;

    const patients = getDB('patients');
    const patient = patients.find(p => p.id === patientId);

    if (!patient) return;

    const todayStr = new Date().toISOString().split('T')[0];

    // 1. Add Vitals
    if (bpSystolic && bpDiastolic && heartRate) {
        patient.vitalsHistory.push({
            date: todayStr,
            bpSystolic,
            bpDiastolic,
            heartRate,
            temp: temp || 98.6,
            weight: weight || 70
        });
    }

    // 2. Add Diagnosis
    patient.medicalHistory.push({
        date: todayStr,
        condition: diagnosis,
        diagnosedBy: doctor.name,
        status: 'Active'
    });

    const patIndex = patients.findIndex(p => p.id === patient.id);
    patients[patIndex] = patient;
    setDB('patients', patients);

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

    // 4. Order Lab Test
    if (requestLabTest && labTestName) {
        const labRequests = getDB('lab_requests');
        labRequests.push({
            id: 'lab-' + (labRequests.length + 1),
            patientId: patient.id,
            patientName: patient.name,
            doctorName: doctor.name,
            testCategory: labTestCategory || 'General',
            testName: labTestName,
            requestDate: todayStr,
            status: 'pending',
            resultDate: '',
            technician: '',
            results: []
        });
        setDB('lab_requests', labRequests);
    }

    // 5. Complete Appointment
    const activeApptId = sessionStorage.getItem('hc_active_appt_consult');
    if (activeApptId) {
        const appointments = getDB('appointments');
        const apptIdx = appointments.findIndex(a => a.id === activeApptId);
        if (apptIdx !== -1) {
            appointments.splice(apptIdx, 1); // Remove or change status. Let's just remove to clear queue
            setDB('appointments', appointments);
        }
        sessionStorage.removeItem('hc_active_appt_consult');
    }

    alert('Consultation saved successfully and EHR records updated!');
    document.getElementById('doctor-consult-form').reset();
    document.getElementById('consult-med-rows').innerHTML = '';
    document.getElementById('consult-patient-info').classList.add('d-none');
    
    // Refresh Dashboard Data
    renderDoctorDashboard(doctor);
    document.querySelector('[data-panel="panel-dashboard"]').click();
}


// --- LAB DASHBOARD WORKFLOWS ---
function initLabPortal(labUser) {
    // Header updates
    document.getElementById('user-display-name').innerText = labUser.name;

    renderLabRequests();

    // Results Submitter
    const labEntryForm = document.getElementById('lab-entry-form');
    if (labEntryForm) {
        labEntryForm.addEventListener('submit', function (e) {
            e.preventDefault();
            submitLabResults(labUser);
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
        document.getElementById('lab-stat-pending').innerText = pending.length;
        document.getElementById('lab-stat-completed').innerText = completed.length;
    }

    if (pendingList) {
        if (pending.length === 0) {
            pendingList.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No pending tests requested.</td></tr>`;
        } else {
            let html = '';
            pending.forEach(p => {
                html += `
                <tr>
                    <td><strong>${p.id}</strong></td>
                    <td>${p.patientName}</td>
                    <td>${p.testName}</td>
                    <td>${p.doctorName}</td>
                    <td>${p.requestDate}</td>
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
            completedList.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No completed tests.</td></tr>`;
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

function enterLabResults(requestId) {
    document.querySelector('[data-panel="panel-results-entry"]').click();
    const reqs = getDB('lab_requests');
    const req = reqs.find(r => r.id === requestId);

    if (req) {
        document.getElementById('entry-request-id').value = req.id;
        document.getElementById('entry-patient-name').value = req.patientName;
        document.getElementById('entry-test-name').value = req.testName;
        
        // Dynamically build input rows depending on test
        const container = document.getElementById('dynamic-param-rows');
        container.innerHTML = '';
        
        const params = getParametersForTest(req.testName);
        params.forEach((p, idx) => {
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
}

function getParametersForTest(testName) {
    if (testName.toLowerCase().includes('cbc') || testName.toLowerCase().includes('blood')) {
        return [
            { name: 'White Blood Cell (WBC)', unit: '10^3/uL', range: '4.5 - 11.0' },
            { name: 'Red Blood Cell (RBC)', unit: '10^6/uL', range: '4.3 - 5.9' },
            { name: 'Hemoglobin (Hgb)', unit: 'g/dL', range: '13.5 - 17.5' },
            { name: 'Platelets', unit: '10^3/uL', range: '150 - 450' }
        ];
    } else if (testName.toLowerCase().includes('lipid') || testName.toLowerCase().includes('cholesterol')) {
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

function submitLabResults(technician) {
    const reqId = document.getElementById('entry-request-id').value;
    const reqs = getDB('lab_requests');
    const reqIndex = reqs.findIndex(r => r.id === reqId);

    if (reqIndex === -1) return;

    const rows = document.querySelectorAll('.dynamic-param-row');
    const results = [];
    
    rows.forEach(row => {
        const parameter = row.querySelector('.param-name').value;
        const value = parseFloat(row.querySelector('.param-value').value);
        const unit = row.querySelector('.param-unit').value;
        const refRange = row.querySelector('.param-range').value;
        
        // Simple flag evaluator
        let flag = 'Normal';
        if (refRange.includes('-')) {
            const parts = refRange.split('-');
            const min = parseFloat(parts[0]);
            const max = parseFloat(parts[1]);
            if (value < min) flag = 'Low';
            if (value > max) flag = 'High';
        } else if (refRange.includes('<')) {
            const valLimit = parseFloat(refRange.replace('<', '').trim());
            if (value >= valLimit) flag = 'High';
        } else if (refRange.includes('>')) {
            const valLimit = parseFloat(refRange.replace('>', '').trim());
            if (value <= valLimit) flag = 'Low';
        }

        results.push({ parameter, value, unit, refRange, flag });
    });

    reqs[reqIndex].status = 'completed';
    reqs[reqIndex].resultDate = new Date().toISOString().split('T')[0];
    reqs[reqIndex].technician = technician.name;
    reqs[reqIndex].results = results;

    setDB('lab_requests', reqs);

    alert('Lab results entry saved and validated!');
    document.getElementById('lab-entry-form').reset();
    document.getElementById('dynamic-param-rows').innerHTML = '';
    
    renderLabRequests();
    document.querySelector('[data-panel="panel-dashboard"]').click();
}


// --- ADMIN DASHBOARD WORKFLOWS ---
function initAdminPortal(adminUser) {
    document.getElementById('user-display-name').innerText = adminUser.name;

    renderAdminDashboard();
    renderAdminUserTable();
    renderAdminDepartments();

    // User Create Form Handler
    const adminUserForm = document.getElementById('admin-add-user-form');
    if (adminUserForm) {
        adminUserForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = document.getElementById('admin-user-name').value;
            const email = document.getElementById('admin-user-email').value;
            const role = document.getElementById('admin-user-role').value;
            const pass = document.getElementById('admin-user-password').value;

            const res = AuthService.register(name, email, pass, role);
            if (res.success) {
                alert('User created successfully.');
                adminUserForm.reset();
                renderAdminUserTable();
                
                // Hide modal bootstrap way
                const modal = bootstrap.Modal.getInstance(document.getElementById('addUserModal'));
                if (modal) modal.hide();
            } else {
                alert('Registration failed: ' + res.message);
            }
        });
    }
}

function renderAdminDashboard() {
    const users = getDB('users');
    const appointments = getDB('appointments');
    const labs = getDB('lab_requests');
    const depts = getDB('departments');

    document.getElementById('admin-stat-patients').innerText = users.filter(u => u.role === 'patient').length;
    document.getElementById('admin-stat-doctors').innerText = users.filter(u => u.role === 'doctor').length;
    document.getElementById('admin-stat-labs').innerText = labs.length;
    document.getElementById('admin-stat-depts').innerText = depts.length;

    // Activity graphs using Chart.js
    const ctx = document.getElementById('adminActivityChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Pediatrics', 'Cardiology', 'Neurology', 'General Med', 'Radiology', 'Pathology'],
                datasets: [
                    {
                        label: 'Active Cases',
                        data: [15, 32, 12, 45, 24, 50],
                        backgroundColor: '#0f52ba',
                    },
                    {
                        label: 'Consultations',
                        data: [20, 24, 18, 55, 30, 42],
                        backgroundColor: '#10b981',
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }
}

function renderAdminUserTable() {
    const userTable = document.getElementById('admin-users-list');
    if (!userTable) return;

    const users = getDB('users');
    let html = '';
    users.forEach((u, index) => {
        html += `
        <tr>
            <td><strong>${u.name}</strong></td>
            <td>${u.email}</td>
            <td><span class="badge bg-secondary">${u.role.toUpperCase()}</span></td>
            <td>${u.patientId || u.doctorId || 'System User'}</td>
            <td>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteUser('${u.email}')"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>`;
    });
    userTable.innerHTML = html;
}

function renderAdminDepartments() {
    const deptList = document.getElementById('admin-depts-list');
    if (!deptList) return;

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
    deptList.innerHTML = html;
}

function deleteUser(email) {
    if (confirm('Are you sure you want to delete this user?')) {
        let users = getDB('users');
        users = users.filter(u => u.email !== email);
        setDB('users', users);
        renderAdminUserTable();
        renderAdminDashboard();
    }
}


// ==========================================
// 5. VIEW REPORT PDF MODAL GENERATOR
// ==========================================

function viewLabReportModal(reportId) {
    const reqs = getDB('lab_requests');
    const req = reqs.find(r => r.id === reportId);
    if (!req) return;

    // Dynamically insert modal html in body if it doesn't exist
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
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header border-0 no-print">
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body p-5" id="printable-report-body">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 class="text-primary mb-1"><i class="fa-solid fa-hospital-user me-2"></i>FutureCraft Health</h2>
                        <p class="text-muted mb-0">EHR & Lab Management Portal</p>
                    </div>
                    <div class="text-end">
                        <h4>LABORATORY DIAGNOSTIC REPORT</h4>
                        <p class="mb-0">Report ID: <strong>${req.id}</strong></p>
                    </div>
                </div>
                <hr>
                <div class="row mb-4">
                    <div class="col-6">
                        <p class="mb-1 text-muted">PATIENT DETAILS</p>
                        <h5><strong>${req.patientName}</strong></h5>
                        <p class="mb-0">Patient ID: ${req.patientId}</p>
                    </div>
                    <div class="col-6 text-end">
                        <p class="mb-1 text-muted">REPORT DETAILS</p>
                        <p class="mb-1">Requested By: <strong>${req.doctorName}</strong></p>
                        <p class="mb-1">Request Date: ${req.requestDate}</p>
                        <p class="mb-0">Result Date: ${req.resultDate}</p>
                    </div>
                </div>
                <h5 class="text-secondary mb-3">${req.testCategory} - ${req.testName}</h5>
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
                            ${resultsHtml}
                        </tbody>
                    </table>
                </div>
                <div class="row mt-5">
                    <div class="col-6">
                        <p class="text-muted mb-0">Technician Signature</p>
                        <h6 class="mt-3 border-bottom d-inline-block pb-1 pe-5"><strong>${req.technician}</strong></h6>
                    </div>
                    <div class="col-6 text-end">
                        <p class="text-muted">Approved By Pathologist</p>
                        <h6 class="mt-3 border-bottom d-inline-block pb-1 ps-5"><strong>Dr. Gregory House</strong></h6>
                    </div>
                </div>
            </div>
            <div class="modal-footer border-0 no-print">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" onclick="printReport()"><i class="fa-solid fa-print me-1"></i> Print / Save PDF</button>
            </div>
        </div>
    </div>
    `;

    const bsModal = new bootstrap.Modal(modalEl);
    bsModal.show();
}

function printReport() {
    window.print();
}


// ==========================================
// 6. PORTAL BOOTSTRAP INITIALIZER
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Determine user session states and bootstrap pages
    const activeUser = AuthService.getCurrentUser();
    const pathname = window.location.pathname;

    // Handle authentication views protection
    if (pathname.includes('-dashboard.html')) {
        if (!activeUser) {
            window.location.href = 'login.html';
            return;
        }

        // Verify page matched user role
        const currentPageRole = pathname.substring(pathname.lastIndexOf('/') + 1).replace('-dashboard.html', '');
        if (activeUser.role !== currentPageRole) {
            window.location.href = activeUser.role + '-dashboard.html';
            return;
        }

        // Setup common sidebar navigation tabs
        setupDashboardNavigation();

        // Bootstrapping the correct page script logic
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

    // AUTH PAGES ROUTING
    if (pathname.includes('login.html')) {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            // Setup selector active clicks
            const roleCards = document.querySelectorAll('.auth-role-card');
            const selectedRoleInput = document.getElementById('login-role');
            
            roleCards.forEach(card => {
                card.addEventListener('click', function () {
                    roleCards.forEach(c => c.classList.remove('active'));
                    this.classList.add('active');
                    selectedRoleInput.value = this.getAttribute('data-role');
                });
            });

            loginForm.addEventListener('submit', function (e) {
                e.preventDefault();
                const email = document.getElementById('login-email').value;
                const pass = document.getElementById('login-password').value;
                const role = selectedRoleInput.value;

                if (!role) {
                    alert('Please select your user portal role before logging in.');
                    return;
                }

                const res = AuthService.login(email, pass, role);
                if (res.success) {
                    window.location.href = res.redirect;
                } else {
                    const errEl = document.getElementById('login-error-msg');
                    if (errEl) {
                        errEl.innerText = res.message;
                        errEl.classList.remove('d-none');
                    } else {
                        alert(res.message);
                    }
                }
            });
        }
    }

    if (pathname.includes('register.html')) {
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', function (e) {
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

                const res = AuthService.register(name, email, password, role, extraFields);
                if (res.success) {
                    alert('Registration complete! Redirecting to login.');
                    window.location.href = 'login.html';
                } else {
                    alert('Registration failed: ' + res.message);
                }
            });

            // Toggle extra fields based on role selection
            const roleSelect = document.getElementById('reg-role');
            const patientFields = document.getElementById('patient-extra-fields');
            
            if (roleSelect && patientFields) {
                roleSelect.addEventListener('change', function () {
                    if (this.value === 'patient') {
                        patientFields.classList.remove('d-none');
                        // Make fields required
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
