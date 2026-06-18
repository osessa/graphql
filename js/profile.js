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
                }
                `
            })
        }
    );

    const data = await response.json();

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

                        fill: true
                    }
                ]
            },

            options: {
                responsive: true,

                maintainAspectRatio: false,

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

    document.getElementById("userId").textContent = user.id;
        

    document.getElementById("userName").textContent = user.login;

    document.getElementById("welcomeUsername").textContent = user.login;
    
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