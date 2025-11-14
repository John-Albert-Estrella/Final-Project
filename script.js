// ===========================
// ADMIN LOGIN
// ===========================
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

function adminLogin(event) {
    event.preventDefault();

    const user = document.getElementById("adminUser").value.trim();
    const pass = document.getElementById("adminPass").value.trim();

    if (user === ADMIN_USERNAME && pass === ADMIN_PASSWORD) {
        localStorage.setItem("isAdminLoggedIn", "true");
        window.location.href = "dashboard.html";
    } else {
        alert("❌ Invalid username or password.");
    }
}

// ===========================
// PATIENT APPOINTMENT SUBMISSION
// ===========================
function submitAppointment(event) {
    event.preventDefault();

    const fullName = document.getElementById("fullname").value.trim();
    const email = document.getElementById("email").value.trim();
    const date = document.getElementById("date").value;
    const concern = document.getElementById("concern").value.trim();

    if (!fullName || !email || !date || !concern) {
        alert("⚠️ Please fill out all fields.");
        return;
    }

    const appointment = {
        id: Date.now(),
        name: fullName,
        email: email,
        date: date,
        concern: concern,
        status: "Pending"
    };

    let list = JSON.parse(localStorage.getItem("appointments")) || [];
    list.push(appointment);

    localStorage.setItem("appointments", JSON.stringify(list));

    alert("✅ Appointment submitted successfully!\n\nWe'll contact you soon.");
    document.getElementById("appointmentForm").reset();
}

// ===========================
// LOAD APPOINTMENTS ON ADMIN PAGE
// ===========================
function loadAppointments() {
    const container = document.getElementById("appointmentList");
    
    if (!container) return;

    if (localStorage.getItem("isAdminLoggedIn") !== "true") {
        window.location.href = "login.html";
        return;
    }

    container.innerHTML = "";

    const list = JSON.parse(localStorage.getItem("appointments")) || [];

    if (list.length === 0) {
        container.innerHTML = `
            <div style="background: white; padding: 3rem; border-radius: 1rem; text-align: center; color: #6B7280;">
                <p style="font-size: 1.2rem;">📋 No appointments yet.</p>
            </div>
        `;
        return;
    }

    list.forEach(app => {
        const statusColor = app.status === "Approved" ? "#10B981" : 
                           app.status === "Declined" ? "#EF4444" : "#F59E0B";
        
        container.innerHTML += `
            <div class="appointment-card" style="border-left-color: ${statusColor};">
                <p><strong>👤 Name:</strong> ${app.name}</p>
                <p><strong>📧 Email:</strong> ${app.email}</p>
                <p><strong>📅 Date:</strong> ${app.date}</p>
                <p><strong>💬 Concern:</strong> ${app.concern}</p>
                <p><strong>📌 Status:</strong> <span style="color: ${statusColor}; font-weight: 600;">${app.status}</span></p>
                ${app.status === "Pending" ? `
                    <div>
                        <button onclick="approve(${app.id})">✓ Approve</button>
                        <button onclick="decline(${app.id})">✗ Decline</button>
                    </div>
                ` : ''}
            </div>
        `;
    });
}

// ===========================
// APPROVE / DECLINE APPOINTMENTS
// ===========================
function approve(id) {
    updateStatus(id, "Approved");
}

function decline(id) {
    updateStatus(id, "Declined");
}

function updateStatus(id, newStatus) {
    let list = JSON.parse(localStorage.getItem("appointments")) || [];

    list = list.map(app => {
        if (app.id === id) {
            app.status = newStatus;
        }
        return app;
    });

    localStorage.setItem("appointments", JSON.stringify(list));
    loadAppointments();
}

// ===========================
// LOGOUT
// ===========================
function logoutAdmin() {
    if (confirm("Are you sure you want to logout?")) {
        localStorage.removeItem("isAdminLoggedIn");
        window.location.href = "index.html";
    }
}

// ===========================
// PROTECT ADMIN PAGES
// ===========================
function checkAdminAuth() {
    if (localStorage.getItem("isAdminLoggedIn") !== "true") {
        window.location.href = "login.html";
    }
}

// Auto-check on dashboard page
if (window.location.pathname.includes("dashboard.html")) {
    checkAdminAuth();
}
