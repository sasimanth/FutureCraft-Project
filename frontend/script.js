// -----------------------------
// Appointment Booking
// -----------------------------
const appointmentForm = document.getElementById("appointmentForm");

if (appointmentForm) {
  appointmentForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let appointments = JSON.parse(localStorage.getItem("appointments")) || [];

    const newAppointment = {
      id: appointments.length + 1,
      patientName: document.getElementById("patientName").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      doctor: document.getElementById("doctor").value,
      department: document.getElementById("department").value,
      date: document.getElementById("date").value,
      time: document.getElementById("time").value,
      status: "Booked"
    };

    appointments.push(newAppointment);
    localStorage.setItem("appointments", JSON.stringify(appointments));

    alert("Appointment booked successfully!");
    appointmentForm.reset();
  });
}

// -----------------------------
// Appointment History
// -----------------------------
const historyBody = document.getElementById("historyBody");

if (historyBody) {
  let appointments = JSON.parse(localStorage.getItem("appointments")) || [];
  historyBody.innerHTML = "";

  appointments.forEach((app, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${app.id}</td>
      <td>${app.patientName}</td>
      <td>${app.doctor}</td>
      <td>${app.department}</td>
      <td>${app.date}</td>
      <td>${app.time}</td>
      <td>${app.status}</td>
      <td>
        ${
          app.status !== "Cancelled"
            ? `<button class="cancel-btn" onclick="cancelAppointment(${index})">Cancel</button>`
            : "—"
        }
      </td>
    `;
    historyBody.appendChild(row);
  });
}

function cancelAppointment(index) {
  let appointments = JSON.parse(localStorage.getItem("appointments")) || [];
  appointments[index].status = "Cancelled";
  localStorage.setItem("appointments", JSON.stringify(appointments));
  alert("Appointment cancelled successfully!");
  location.reload();
}

// -----------------------------
// Reports Dashboard
// -----------------------------
const reportBody = document.getElementById("reportBody");

if (reportBody) {
  let appointments = JSON.parse(localStorage.getItem("appointments")) || [];

  document.getElementById("totalAppointments").textContent = appointments.length;

  let completed = appointments.filter(app => app.status === "Completed").length;
  let cancelled = appointments.filter(app => app.status === "Cancelled").length;
  let upcoming = appointments.filter(app => app.status === "Booked").length;

  document.getElementById("completedAppointments").textContent = completed;
  document.getElementById("upcomingAppointments").textContent = upcoming;
  document.getElementById("cancelledAppointments").textContent = cancelled;

  appointments.forEach(app => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${app.id}</td>
      <td>${app.patientName}</td>
      <td>${app.doctor}</td>
      <td>${app.department}</td>
      <td>${app.date}</td>
      <td>${app.time}</td>
      <td>${app.status}</td>
    `;
    reportBody.appendChild(row);
  });
}

// -----------------------------
// Analytics Dashboard
// -----------------------------
const departmentAnalyticsBody = document.getElementById("departmentAnalyticsBody");
const doctorAnalyticsBody = document.getElementById("doctorAnalyticsBody");

if (departmentAnalyticsBody && doctorAnalyticsBody) {
  let appointments = JSON.parse(localStorage.getItem("appointments")) || [];

  document.getElementById("analyticsTotal").textContent = appointments.length;

  let booked = appointments.filter(app => app.status === "Booked").length;
  let completed = appointments.filter(app => app.status === "Completed").length;
  let cancelled = appointments.filter(app => app.status === "Cancelled").length;

  document.getElementById("analyticsBooked").textContent = booked;
  document.getElementById("analyticsCompleted").textContent = completed;
  document.getElementById("analyticsCancelled").textContent = cancelled;

  let departmentCount = {};
  appointments.forEach(app => {
    departmentCount[app.department] = (departmentCount[app.department] || 0) + 1;
  });

  for (let dept in departmentCount) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${dept}</td>
      <td>${departmentCount[dept]}</td>
    `;
    departmentAnalyticsBody.appendChild(row);
  }

  let doctorCount = {};
  appointments.forEach(app => {
    doctorCount[app.doctor] = (doctorCount[app.doctor] || 0) + 1;
  });

  for (let doctor in doctorCount) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${doctor}</td>
      <td>${doctorCount[doctor]}</td>
    `;
    doctorAnalyticsBody.appendChild(row);
  }
}