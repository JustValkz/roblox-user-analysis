let badgeChartInstance = null;

/**
 * Badge Growth Chart (Line Chart with actual dates)
 * @param {HTMLCanvasElement} ctx
 * @param {Object} statsData - Contains dates and badgeHistory
 */
export function renderBadgeChart(ctx, statsData) {
    if (!ctx) return null;

    // destroy old chart if it exists
    if (badgeChartInstance) {
        badgeChartInstance.destroy();
    }

    // Prepare data
    const dates = statsData.dates || [];
    const counts = statsData.badgeHistory || [];

    const labels = dates.map(date => date.toLocaleDateString());

    badgeChartInstance = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Total Badges",
                    data: counts,
                    borderColor: "#5865f2",
                    backgroundColor: "rgba(88, 101, 242, 0.15)",
                    borderWidth: 3,
                    tension: 0.35,
                    fill: true,
                    pointRadius: 2,
                    pointHoverRadius: 6,
                    pointBackgroundColor: "#5865f2",
                    pointBorderColor: "#fff",
                    pointBorderWidth: 2
                }
            ]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    display: false
                },

                tooltip: {
                    enabled: true,
                    mode: "index",
                    intersect: false,
                    backgroundColor: "rgba(17, 24, 39, 0.95)",
                    titleColor: "#fff",
                    bodyColor: "#9ca3af",
                    borderColor: "rgba(88, 101, 242, 0.5)",
                    borderWidth: 1,
                    padding: 12,
                    displayColors: true,
                    callbacks: {
                        title: function(context) {
                            return `Date: ${context[0].label}`;
                        },
                        label: function(context) {
                            return `Total Badges: ${context.parsed.y}`;
                        }
                    }
                },

                zoom: {
                    zoom: {
                        wheel: {
                            enabled: true
                        },
                        pinch: {
                            enabled: true
                        },
                        mode: "x"
                    },
                    pan: {
                        enabled: true,
                        mode: "x"
                    }
                }
            },

            interaction: {
                mode: "index",
                intersect: false
            },

            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: "#9ca3af",
                        maxTicksLimit: 10,
                        maxRotation: 45,
                        minRotation: 45
                    }
                },

                y: {
                    beginAtZero: true,
                    grid: {
                        color: "rgba(255,255,255,0.05)"
                    },
                    ticks: {
                        color: "#9ca3af",
                        callback: function(value) {
                            return value.toLocaleString();
                        }
                    }
                }
            }
        }
    });

    return badgeChartInstance;
}

/**
 * Export chart as PNG
 */
export function exportChartAsPNG() {
    if (!badgeChartInstance) {
        alert("No chart to export!");
        return;
    }

    const link = document.createElement('a');
    link.download = `roblox-badge-chart-${Date.now()}.png`;
    link.href = badgeChartInstance.toBase64Image();
    link.click();
}