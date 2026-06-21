// ================= PROFILE DATA =================

async function loadProfile() {

    // Fetch profile information
    const response = await fetch(
        "https://learn.reboot01.com/api/graphql-engine/v1/graphql",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },

            body: JSON.stringify({
                query: `
                {
                    user {
                        id
                        login
                        email
                        createdAt
                        firstName
                        lastName
                    }
                }
                `
            })
        }
    );

    const data = await response.json();

    const user =
        data.data.user[0];

    const fullName =
        `${user.firstName} ${user.lastName}`;

    // Display profile information
    document.getElementById("profileName").textContent =
        fullName;

    document.getElementById("profileUsername").textContent =
        "@" + user.login;

    document.getElementById("profileId").textContent =
        user.id;

    document.getElementById("profileLogin").textContent =
        user.login;

    document.getElementById("profileEmail").textContent =
        user.email;

    document.getElementById("profileCreatedAt").textContent =
        new Date(user.createdAt).toLocaleDateString(
            "en-GB",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );

    // Display welcome message
    document.getElementById("welcomeUsername").textContent =
        fullName;
}

loadProfile();


// ================= LOGOUT =================

document
    .getElementById("logoutBtn")
    .addEventListener("click", () => {

        localStorage.removeItem("token");

        window.location.href = "index.html";
    });


// ================= SIDEBAR NAVIGATION =================

// Get sidebar buttons
const dashboardBtn =
    document.getElementById("dashboardBtn");

const profileBtn =
    document.getElementById("profileBtn");

// Get page sections
const dashboardSection =
    document.getElementById("dashboardSection");

const profileSection =
    document.getElementById("profileSection");

// Show dashboard section
dashboardBtn.addEventListener("click", () => {

    dashboardSection.style.display = "block";
    profileSection.style.display = "none";

    dashboardBtn.classList.add("active");
    profileBtn.classList.remove("active");
});

// Show profile section
profileBtn.addEventListener("click", () => {

    dashboardSection.style.display = "none";
    profileSection.style.display = "block";

    profileBtn.classList.add("active");
    dashboardBtn.classList.remove("active");
});