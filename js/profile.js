const token = localStorage.getItem("token");


if (!token) {
    window.location.href = "index.html";
}


async function getUserData() {

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
                    }
                }
                `
            })
        }
    );

    const data = await response.json();

    const user = data.data.user[0];

    document.getElementById("userId").textContent = user.id;
        

    document.getElementById("userLogin").textContent = user.login;
        
}

getUserData();