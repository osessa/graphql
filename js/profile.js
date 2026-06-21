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
                        email
                        createdAt
                        firstName
                        lastName
                    }

                    xp: transaction(
                        where: { type: { _eq: "xp" } }
                        order_by: { createdAt: asc }
                    ) {
                        amount
                        path
                        createdAt
                    }

                    audits: transaction(
                        where: { type: { _in: ["up", "down"] } }
                    ) {
                        type
                        amount
                    }

                    progress {
                        grade
                        path
                    }

                    levels: transaction(
                        where: { type: { _eq: "level" } }
                    ) {
                        amount
                        createdAt
                    }
                }
                `
            })
        }
    );

    const data = await response.json();

    const currentLevel =
        data.data.levels[data.data.levels.length - 1].amount;

    console.log("LEVEL:", currentLevel);

    console.log(data.data.progress);

    const projectProgress = data.data.progress.filter(project => {

        return project.path.startsWith("/bahrain/bh-module/")
            && !project.path.includes("/piscine-js")
            && !project.path.includes("/checkpoint");
    });

    const uniqueProjects = [
        ...new Set(
            projectProgress.map(project => project.path)
        )
    ];

    console.log(uniqueProjects);
    console.log("MAIN PROJECTS:", uniqueProjects.length);
    
    const totalProjects = uniqueProjects.length;

    const centerText = {
        id: "centerText",

        beforeDraw(chart) {

            const { ctx } = chart;

            const x =
                chart.getDatasetMeta(0).data[0].x;

            const y =
                chart.getDatasetMeta(0).data[0].y;

            ctx.save();

            ctx.textAlign = "center";

            ctx.fillStyle = "#ffffff";

            ctx.font = "bold 42px Arial";

            ctx.fillText(
                totalProjects,
                x,
                y - 10
            );

            ctx.font = "16px Arial";

            ctx.fillStyle = "#94a3b8";

            ctx.fillText(
                "Projects",
                x,
                y + 20
            );

            ctx.restore();
        }
    };

    const passedProjects = projectProgress
        .filter(project => project.grade > 1)
        .length;

    const failedProjects = projectProgress
        .filter(project => project.grade < 1)
        .length;

    console.log("PASSED:", passedProjects);
    console.log("FAILED:", failedProjects);

    new Chart(
        document.getElementById("projectChart"),
        {
            type: "doughnut",

            data: {
                labels: ["Passed", "Failed"],

                datasets: [
                    {
                        data: [
                            passedProjects,
                            failedProjects
                        ],

                        backgroundColor: [
                            "rgba(34,197,94,0.8)",
                            "rgba(239,68,68,0.8)"
                        ],

                        borderColor: [
                            "#22c55e",
                            "#ef4444"
                        ],

                        borderWidth: 2
                    }
                ]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,

                layout: {
                    padding: {
                        bottom: 40
                    }
                }
                
            },

            plugins: [
                centerText
            ]

            
        }
    );

    console.log(projectProgress);

    const xpTransactions = data.data.xp;

    console.log(xpTransactions.length);

    let cumulativeXP = 0;

    const xpProgress = xpTransactions.map(transaction => {

        cumulativeXP += transaction.amount;

        return {
            date: transaction.createdAt,
            xp: cumulativeXP
        };
    });

    const chartLabels = xpProgress.map(item =>
        new Date(item.date).toLocaleDateString(
            "en-US",
            {
                month: "short",
                year: "numeric"
            }
        )
    );

    console.log(chartLabels.length);

    console.log(xpProgress.slice(0, 10));

    const chartData = xpProgress.map(item => item.xp);

    new Chart(
        document.getElementById("xpChart"),
        {
            type: "line",

            data: {
                labels: chartLabels,

                datasets: [
                    {
                        label: "Total XP",

                        data: chartData,

                        borderColor: "#8b5cf6",

                        backgroundColor:
                            "rgba(139,92,246,0.2)",

                        tension: 0.3,

                        fill: true,

                        borderWidth: 4,

                        pointRadius: 0,

                        pointHoverRadius: 6
                    }
                ]
            },

            options: {
                responsive: true,

                maintainAspectRatio: false,

                layout: {
                    padding: {
                        bottom: 20
                    }
                },

                scales: {
                    x: {
                        ticks: {
                            maxTicksLimit: 10
                        }
                    }
                }
            }
        }
    );

    
    console.log(data.data.xp[0]);

    const totalXP = data.data.xp.reduce(
        (sum, transaction) => sum + transaction.amount,
        0
    );
    document.getElementById("totalXP").textContent =
        totalXP.toLocaleString();

    document.getElementById("userLevel").textContent =
        currentLevel;
        
    const auditTransactions = data.data.audits;

    const totalUp = auditTransactions 
        .filter(t => t.type === "up")
        .reduce((sum, t) => sum + t.amount, 0);

    const totalDown = auditTransactions 
        .filter(t => t.type === "down")
        .reduce((sum, t) => sum + t.amount, 0);

    const auditRatio = (totalUp / totalDown).toFixed(2);

    console.log("UP:", totalUp);
    console.log("DOWN:", totalDown);
    console.log("RATIO:", auditRatio);


        


    console.log(JSON.stringify(data, null, 2));

    const user = data.data.user[0];

    const fullName = `${user.firstName} ${user.lastName}`;

    console.log(data.data.user[0]);

    console.log("EMAIL:", user.email);
    console.log("CREATED AT:", user.createdAt);
    console.log(user);

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
   


    document.getElementById("profileId").textContent = user.id;

    document.getElementById("profileLogin").textContent = user.login;

    document.getElementById("profileEmail").textContent = user.email;

    

    document.getElementById("welcomeUsername").textContent = fullName;
    
    document.getElementById("auditRatio").textContent = auditRatio;

    document.getElementById("totalUp").textContent = totalUp.toLocaleString();

    document.getElementById("totalDown").textContent = totalDown.toLocaleString();
        
   
    document.getElementById("logoutBtn")
        .addEventListener("click", () => {

            localStorage.removeItem("token");

            window.location.href = "index.html";

        });
}

getUserData();

const dashboardBtn =
    document.getElementById("dashboardBtn");

const profileBtn =
    document.getElementById("profileBtn");

const dashboardSection =
    document.getElementById("dashboardSection");

const profileSection =
    document.getElementById("profileSection");

dashboardBtn.addEventListener("click", () => {

    dashboardSection.style.display = "block";

    profileSection.style.display = "none";

});

profileBtn.addEventListener("click", () => {

    dashboardSection.style.display = "none";

    profileSection.style.display = "block";

});


dashboardBtn.addEventListener("click", () => {

    dashboardSection.style.display = "block";
    profileSection.style.display = "none";

    dashboardBtn.classList.add("active");
    profileBtn.classList.remove("active");
});

profileBtn.addEventListener("click", () => {

    dashboardSection.style.display = "none";
    profileSection.style.display = "block";

    profileBtn.classList.add("active");
    dashboardBtn.classList.remove("active");
});

