// ================= PROJECT RESULTS CHART =================

function createProjectChart(
    passedProjects,
    failedProjects,
    totalProjects
) {

    const total =
        passedProjects + failedProjects;

    const passedPercent =
        total > 0
            ? (passedProjects / total) * 100
            : 0;

    const radius = 90;

    const circumference =
        2 * Math.PI * radius;

    const svg = `
        <svg
            width="260"
            height="260"
            viewBox="0 0 260 260"
        >

            <!-- Failed Circle -->
            <circle
                cx="130"
                cy="130"
                r="90"
                fill="none"
                stroke="rgba(239,68,68,0.8)"
                stroke-width="80"
            />

            <!-- Passed Circle -->
            <circle
                cx="130"
                cy="130"
                r="90"
                fill="none"
                stroke="rgba(34,197,94,0.9)"
                stroke-width="80"
                stroke-dasharray="${
                    (passedPercent / 100) * circumference
                    } ${circumference}"
                transform="rotate(-90 130 130)"
            />

            <!-- Total Projects -->
            <text
                x="130"
                y="125"
                text-anchor="middle"
                fill="white"
                font-size="40"
                font-weight="bold"
            >
                ${totalProjects}
            </text>

            <text
                x="130"
                y="150"
                text-anchor="middle"
                fill="#94a3b8"
                font-size="20"
            >
                Projects
            </text>

        </svg>
    `;

    document.getElementById(
        "projectChart"
    ).innerHTML = svg;
}


// ================= XP PROGRESS CHART =================

function createXPChart(xpTransactions) {

    // Calculate cumulative XP
    let cumulativeXP = 0;

    const xpProgress =
        xpTransactions.map(transaction => {

            cumulativeXP += transaction.amount;

            return {
                date: new Date(transaction.createdAt),
                xp: cumulativeXP
            };
        });

    const width = 900;
    const height = 350;

    const maxXP =
        Math.max(
            ...xpProgress.map(item => item.xp)
        );

    const chartHeight = 280;

    const stepX =
        width / (xpProgress.length - 1);

    // Create SVG points
    const points =
        xpProgress.map((item, index) => {

            const x =
                index * stepX;

            const y =
                height -
                (item.xp / maxXP) * chartHeight;

            return { x, y };
        });

    // Create smooth SVG path
    let linePath =
        `M ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length; i++) {

        const prev =
            points[i - 1];

        const current =
            points[i];

        const controlX =
            (prev.x + current.x) / 2;

        linePath += `
            C
            ${controlX} ${prev.y},
            ${controlX} ${current.y},
            ${current.x} ${current.y}
        `;
    }

    // Create area path
    const areaPath =
        `
        ${linePath}
        L ${width} ${height}
        L 0 ${height}
        Z
        `;

    // Create grid lines
    let gridLines = "";
    let yLabels = "";

    const steps = 6;

    for (let i = 0; i <= steps; i++) {

        const y =
            height -
            (i / steps) * chartHeight;

        const value =
            Math.round(
                (maxXP / steps) * i
            );

        gridLines += `
            <line
                x1="0"
                y1="${y}"
                x2="${width}"
                y2="${y}"
                stroke="rgba(255,255,255,0.08)"
                stroke-width="1"
            />
        `;

        yLabels += `
            <text
                x="-10"
                y="${y + 5}"
                text-anchor="end"
                fill="#94a3b8"
                font-size="17"
            >
                ${value.toLocaleString()}
            </text>
        `;
    }

    // Create month labels
    let monthLabels = "";

    const labelCount = 10;

    for (
        let i = 0;
        i < labelCount;
        i++
    ) {

        const index =
            Math.floor(
                (xpProgress.length - 1)
                * (i / (labelCount - 1))
            );

        const item =
            xpProgress[index];

        const x =
            (width / (labelCount - 1))
            * i;

        const month =
            item.date.toLocaleDateString(
                "en-US",
                {
                    month: "short",
                    year: "numeric"
                }
            );

        monthLabels += `
            <text
                x="${x}"
                y="390"
                text-anchor="middle"
                fill="#94a3b8"
                font-size="16"
            >
                ${month}
            </text>
        `;
    }

    const svg = `
        <svg
            viewBox="-110 0 1100 430"
            width="100%"
            height="100%"
        >

            ${gridLines}

            ${yLabels}

            <path
                d="${areaPath}"
                fill="#8b5cf6"
                fill-opacity="0.20"
            />

            <path
                d="${linePath}"
                fill="none"
                stroke="#8b5cf6"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
            />

            ${monthLabels}

        </svg>
    `;

    document.getElementById(
        "xpChart"
    ).innerHTML = svg;
}