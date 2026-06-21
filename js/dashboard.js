// ================= DASHBOARD DATA =================

async function loadDashboard() {

    // Fetch dashboard data from GraphQL API
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
                    }

                    user {
                        firstName
                        lastName
                    }
                }
                `
            })
        }
    );

    const data = await response.json();

    // ================= USER INFORMATION =================

    const user =
        data.data.user[0];

    const fullName =
        `${user.firstName} ${user.lastName}`;

    document.getElementById("welcomeUsername").textContent =
        fullName;

    // ================= LEVEL INFORMATION =================

    const currentLevel =
        data.data.levels[
            data.data.levels.length - 1
        ].amount;

    document.getElementById("userLevel").textContent =
        currentLevel;

    // ================= XP INFORMATION =================

    const xpTransactions =
        data.data.xp;

    const totalXP =
        xpTransactions.reduce(
            (sum, transaction) =>
                sum + transaction.amount,
            0
        );

    document.getElementById("totalXP").textContent =
        totalXP.toLocaleString();

    // ================= AUDIT INFORMATION =================

    const auditTransactions =
        data.data.audits;

    const totalUp =
        auditTransactions
            .filter(transaction =>
                transaction.type === "up"
            )
            .reduce(
                (sum, transaction) =>
                    sum + transaction.amount,
                0
            );

    const totalDown =
        auditTransactions
            .filter(transaction =>
                transaction.type === "down"
            )
            .reduce(
                (sum, transaction) =>
                    sum + transaction.amount,
                0
            );

    const auditRatio =
        (totalUp / totalDown).toFixed(2);

    document.getElementById("auditRatio").textContent =
        auditRatio;

    document.getElementById("totalUp").textContent =
        totalUp.toLocaleString();

    document.getElementById("totalDown").textContent =
        totalDown.toLocaleString();

    // ================= PROJECT INFORMATION =================

    const projectProgress =
        data.data.progress.filter(project => {

            return (
                project.path.startsWith(
                    "/bahrain/bh-module/"
                ) &&
                !project.path.includes(
                    "/piscine-js"
                ) &&
                !project.path.includes(
                    "/checkpoint"
                )
            );
        });

    const uniqueProjects = [
        ...new Set(
            projectProgress.map(
                project => project.path
            )
        )
    ];

    const totalProjects =
        uniqueProjects.length;

    const passedProjects =
        projectProgress.filter(
            project => project.grade > 1
        ).length;

    const failedProjects =
        projectProgress.filter(
            project => project.grade < 1
        ).length;

    // ================= CHARTS =================

    createProjectChart(
        passedProjects,
        failedProjects,
        totalProjects
    );

    createXPChart(
        xpTransactions
    );
}

// Load dashboard data when page opens
loadDashboard();