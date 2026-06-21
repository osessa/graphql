// ================= PROJECT RESULTS CHART =================

function createProjectChart(
    passedProjects,
    failedProjects,
    totalProjects
) {

    // Display total projects inside doughnut chart
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

            // Total projects number
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 42px Arial";

            ctx.fillText(
                totalProjects,
                x,
                y - 10
            );

            // Projects label
            ctx.fillStyle = "#94a3b8";
            ctx.font = "16px Arial";

            ctx.fillText(
                "Projects",
                x,
                y + 20
            );

            ctx.restore();
        }
    };

    // Create project results chart
    new Chart(
        document.getElementById("projectChart"),
        {
            type: "doughnut",

            data: {
                labels: [
                    "Passed",
                    "Failed"
                ],

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
}


// ================= XP PROGRESS CHART =================

function createXPChart(xpTransactions) {

    // Calculate cumulative XP
    let cumulativeXP = 0;

    const xpProgress =
        xpTransactions.map(transaction => {

            cumulativeXP += transaction.amount;

            return {
                date: transaction.createdAt,
                xp: cumulativeXP
            };
        });

    // Create chart labels
    const chartLabels =
        xpProgress.map(item =>
            new Date(item.date).toLocaleDateString(
                "en-US",
                {
                    month: "short",
                    year: "numeric"
                }
            )
        );

    // Extract XP values
    const chartData =
        xpProgress.map(item => item.xp);

    // Create XP chart
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

                        borderWidth: 4,

                        tension: 0.3,

                        fill: true,

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
}