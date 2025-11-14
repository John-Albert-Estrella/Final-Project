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
        // ✅ FIXED: Redirect to admin-home.html instead of dashboard.html
        window.location.href = "admin-home.html";
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
    const phone = document.getElementById("phone") ? document.getElementById("phone").value.trim() : '';
    const date = document.getElementById("date").value;
    const time = document.getElementById("time") ? document.getElementById("time").value : '';
    const concern = document.getElementById("concern").value.trim();

    if (!fullName || !email || !date || !concern) {
        alert("⚠️ Please fill out all required fields.");
        return;
    }

    const appointment = {
        id: Date.now(),
        name: fullName,
        email: email,
        phone: phone,
        date: date,
        time: time,
        concern: concern,
        status: "Pending",
        submittedAt: new Date().toISOString()
    };

    let list = JSON.parse(localStorage.getItem("appointments")) || [];
    list.push(appointment);

    localStorage.setItem("appointments", JSON.stringify(list));

    alert("✅ Appointment Request Submitted!\n\nThank you " + fullName + "!\nWe've received your appointment request.\n\nYou'll receive a confirmation email within 24 hours.\n\nAppointment Details:\n• Date: " + date + "\n• Time: " + time + "\n• Email: " + email);
    
    document.getElementById("appointmentForm").reset();
    
    // Redirect to home after 2 seconds
    setTimeout(() => {
        window.location.href = "index.html";
    }, 2000);
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

    let list = JSON.parse(localStorage.getItem("appointments")) || [];
    
    // Apply filter if currentFilter exists
    if (typeof currentFilter !== 'undefined' && currentFilter !== 'all') {
        list = list.filter(app => app.status === currentFilter);
    }

    if (list.length === 0) {
        container.innerHTML = `
            <div style="background: white; padding: 3rem; border-radius: 1rem; text-align: center; color: #6B7280; margin-top: 2rem;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">📋</div>
                <p style="font-size: 1.2rem; margin: 0;">No appointments found</p>
            </div>
        `;
        return;
    }

    // Sort by date (newest first)
    list.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

    list.forEach(app => {
        const statusColor = app.status === "Approved" ? "#10B981" : 
                           app.status === "Declined" ? "#EF4444" : "#F59E0B";
        
        const statusIcon = app.status === "Approved" ? "✅" : 
                          app.status === "Declined" ? "❌" : "⏳";
        
        container.innerHTML += `
            <div class="appointment-card" style="border-left-color: ${statusColor};">
                <div class="appointment-header">
                    <h3>${statusIcon} ${app.name}</h3>
                    <span class="status-badge status-${app.status.toLowerCase()}">${app.status}</span>
                </div>
                <div class="appointment-details">
                    <p><strong>📧 Email:</strong> ${app.email}</p>
                    ${app.phone ? `<p><strong>📞 Phone:</strong> ${app.phone}</p>` : ''}
                    <p><strong>📅 Date:</strong> ${app.date} ${app.time ? 'at ' + app.time : ''}</p>
                    <p><strong>💬 Concern:</strong> ${app.concern}</p>
                </div>
                ${app.status === "Pending" ? `
                    <div class="appointment-actions">
                        <button onclick="approve(${app.id})" class="btn-approve">✓ Approve</button>
                        <button onclick="decline(${app.id})" class="btn-decline">✗ Decline</button>
                    </div>
                ` : `
                    <div class="appointment-info">
                        <small style="color: #6B7280;">Status updated: ${app.status}</small>
                    </div>
                `}
            </div>
        `;
    });
}

// ===========================
// APPROVE / DECLINE APPOINTMENTS
// ===========================
function approve(id) {
    if (confirm("Approve this appointment?")) {
        updateStatus(id, "Approved");
    }
}

function decline(id) {
    if (confirm("Decline this appointment?")) {
        updateStatus(id, "Declined");
    }
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
    
    // Show success message
    const icon = newStatus === "Approved" ? "✅" : "❌";
    alert(icon + " Appointment " + newStatus.toLowerCase() + " successfully!");
    
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
        alert("⚠️ Access Denied\n\nYou must be logged in to access this page.");
        window.location.href = "login.html";
    }
}

// Auto-check on admin pages
const adminPages = ['admin-home.html', 'appointments-list.html', 'patients.html', 'dashboard.html'];
const currentPage = window.location.pathname.split('/').pop();

if (adminPages.includes(currentPage)) {
    if (localStorage.getItem("isAdminLoggedIn") !== "true") {
        window.location.href = "login.html";
    }
}
