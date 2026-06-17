const togglePassword =
    document.getElementById("togglePassword");

const password =
    document.getElementById("password");

togglePassword.addEventListener("click", () => {

    if (password.type === "password") {

        password.type = "text";

        togglePassword.classList.remove("fa-eye");
        togglePassword.classList.add("fa-eye-slash");

    } else {

        password.type = "password";

        togglePassword.classList.remove("fa-eye-slash");
        togglePassword.classList.add("fa-eye");

    }

});


const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();
    errorMessage.textContent = "";
    const errorMessage = document.getElementById("errorMessage");
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();


    try {

        if (!username || !password) {
            errorMessage.textContent = "Please fill all fields";
            return;
        }

        const englishPattern = /^[A-Za-z0-9@._-]+$/;

        if (!englishPattern.test(username)) {
            errorMessage.textContent = "Only English characters are allowed";
            return;
        }

        const credentials = btoa(`${username}:${password}`);


        const response = await fetch(
            "https://learn.reboot01.com/api/auth/signin",
            {
                method: "POST",

                headers: {
                    Authorization: `Basic ${credentials}`
                }
            }
        );

        if (!response.ok) {
            errorMessage.textContent ="Invalid username or password";
            return;
        }

        const token = await response.text();


        localStorage.setItem("token", token);


        window.location.href = "profile.html";

    } catch (error) {

        errorMessage.textContent = "Connection error. Please try again.";

        console.error(error);

    }

});