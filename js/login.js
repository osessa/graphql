// ================= PASSWORD VISIBILITY =================

// Get password input and toggle icon
const passwordInput =
    document.getElementById("password");

const togglePassword =
    document.getElementById("togglePassword");

// Show or hide password
togglePassword.addEventListener("click", () => {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";

        togglePassword.classList.remove("fa-eye");
        togglePassword.classList.add("fa-eye-slash");

    } else {

        passwordInput.type = "password";

        togglePassword.classList.remove("fa-eye-slash");
        togglePassword.classList.add("fa-eye");
    }
});


// ================= LOGIN FORM =================

// Get login form
const loginForm =
    document.getElementById("loginForm");

// Handle login submission
loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const errorMessage =
        document.getElementById("errorMessage");

    errorMessage.textContent = "";

    // Get user input
    const username =
        document.getElementById("username")
            .value
            .trim();

    const password =
        document.getElementById("password")
            .value
            .trim();

    try {

        // Check if fields are empty
        if (!username || !password) {

            errorMessage.textContent =
                "Please fill all fields";

            return;
        }

        // Allow only English characters
        const englishPattern =
            /^[A-Za-z0-9@._-]+$/;

        if (!englishPattern.test(username)) {

            errorMessage.textContent =
                "Only English characters are allowed";

            return;
        }

        // Encode credentials
        const credentials =
            btoa(`${username}:${password}`);

        // Send login request
        const response = await fetch(
            "https://learn.reboot01.com/api/auth/signin",
            {
                method: "POST",

                headers: {
                    Authorization:
                        `Basic ${credentials}`
                }
            }
        );

        // Check login result
        if (!response.ok) {

            errorMessage.textContent =
                "Invalid username or password";

            return;
        }

        // Get JWT token
        const token =
            JSON.parse(await response.text());

        // Save token in localStorage
        localStorage.setItem(
            "token",
            token
        );

        // Redirect to profile page
        window.location.href =
            "profile.html";

    } catch (error) {

        // Handle connection errors
        errorMessage.textContent =
            "Connection error. Please try again.";

        console.error(error);
    }
});