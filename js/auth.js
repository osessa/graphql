// ================= AUTHENTICATION =================

// Get authentication token
const token =
    localStorage.getItem("token");

// Redirect to login page if token does not exist
if (!token) {

    window.location.href =
        "index.html";
}