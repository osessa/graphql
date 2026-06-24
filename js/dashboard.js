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


                    levels: transaction(
                        where: { type: { _eq: "level" } }
                    ) {
                        amount
                    }

                    user {
                        firstName
                        lastName
                        auditRatio
                    }

                   
                    transaction(
                        where: {
                            type: {
                                _eq: "xp"
                            }
                        }
                        limit: 1
                    ) {
                        amount

                        user {
                            id
                            login
                        }
                    }
                   
                    progress {
                        grade
                        path

                        object {
                            type
                            name
                        }
                    }
                }
                `
            })
        }
    );



    const data = await response.json();


    console.log(data.data.user[0]);

    // ================= PROJECT INFORMATION =================

    // Get only bh-module projects
    const projects =
        data.data.progress.filter(
            project =>
                project.object?.type === "project" &&
                project.path.includes("/bh-module/")
        );

    // Unique projects (for donut center number)
    const uniqueProjects =
        [...new Map(
            projects.map(project => [
                project.path,
                project
            ])
        ).values()];

    // Total unique projects
    const totalProjects =
        uniqueProjects.length;

    // Count all pass attempts
    const passedProjects =
        projects.filter(
            project => project.grade >= 1
        ).length;

    // Count all fail attempts
    const failedProjects =
        projects.filter(
            project => project.grade === 0
        ).length;


    if ( !data.data || !data.data.user ) {

        localStorage.removeItem("token");

        window.location.href = "index.html";

        return;
    }

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

    const projectXP =
        xpTransactions.filter(transaction => {

            const path = transaction.path;

            return (
                path.includes("/bh-module/") &&
                !path.includes("/checkpoint") &&
                (
                    !path.includes("/piscine-js/") ||
                    path === "/bahrain/bh-module/piscine-js"
                )
            );
        });
    
    const totalXP =
        projectXP.reduce(
            (sum, transaction) =>
                sum + transaction.amount,
            0
        );

    console.table(
        projectXP.map(x => ({
            amount: x.amount,
            path: x.path
        }))
    );

    console.table(
        xpTransactions
            .filter(x =>
                x.path.includes("piscine-js")
            )
            .map(x => ({
                amount: x.amount,
                path: x.path
            }))
    );



    document.getElementById("totalXP").textContent =
        formatXP(totalXP);

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
        (totalUp / totalDown).toFixed(1);

    document.getElementById("auditRatio").textContent =
        auditRatio;

    document.getElementById("totalUp").textContent =
        formatXP(totalUp);

    document.getElementById("totalDown").textContent =
        formatXP(totalDown);

    
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

function formatXP(value) {

    const kb = value / 1000;

    if (kb >= 1000) {
        return `${(kb / 1000).toFixed(2)} MB`;
    }

    return `${Math.round(kb).toLocaleString()} KB`;
}