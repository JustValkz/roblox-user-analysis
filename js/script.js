import {
    getUserProfile,
    getUserTimeline,
    getUserStats
} from "./api.js";

import {
    renderBadgeChart,
    exportChartAsPNG
} from "./charts.js";

/* =========================
   ELEMENTS
========================= */

const usernameInput = document.getElementById("usernameInput");
const analyzeBtn = document.getElementById("analyzeBtn");

const loadingSection = document.getElementById("loadingSection");
const dashboard = document.getElementById("dashboard");

/* Profile */
const avatar = document.getElementById("avatar");
const usernameEl = document.getElementById("username");
const displayNameEl = document.getElementById("displayName");
const userIdEl = document.getElementById("userId");
const joinDateEl = document.getElementById("joinDate");
const accountAgeEl = document.getElementById("accountAge");

/* Stats */
const badgeCountEl = document.getElementById("badgeCount");
const activityScoreEl = document.getElementById("activityScore");
const badgeVelocityEl = document.getElementById("badgeVelocity");
const largestGapEl = document.getElementById("largestGap");

/* Sections */
const timelineEl = document.getElementById("timeline");
const gapContainer = document.getElementById("gapContainer");
const heatmapEl = document.getElementById("heatmap");
const analysisBox = document.getElementById("analysisBox");

/* Chart */
let badgeChartInstance = null;
const exportBtn = document.getElementById("exportBtn");

/* =========================
   EVENT LISTENERS
========================= */

analyzeBtn.addEventListener("click", async () => {
    const username = usernameInput.value.trim();
    if (!username) {
        alert("Please enter a username");
        return;
    }

    await loadUser(username);
});

// Allow Enter key to submit
usernameInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        analyzeBtn.click();
    }
});

// Export chart button
exportBtn.addEventListener("click", () => {
    exportChartAsPNG();
});

/* =========================
   MAIN LOADER
========================= */

async function loadUser(username) {
    showLoading(true);
    dashboard.classList.add("hidden");

    try {
        console.log(`Analyzing user: ${username}`);
        
        // Get profile first
        const profile = await getUserProfile(username);

        if (!profile) {
            alert(`User "${username}" not found. Please check the username and try again.`);
            showLoading(false);
            return;
        }

        console.log("Profile loaded:", profile);

        // Render profile immediately
        renderProfile(profile);
        
        // Show dashboard with profile
        dashboard.classList.remove("hidden");

        // Now fetch stats (this will take time)
        const stats = await getUserStats(username);
        
        if (!stats) {
            alert("Error fetching badge data. The user's inventory may be private.");
            showLoading(false);
            return;
        }

        console.log("Stats loaded:", stats);

        // Render all stats
        renderStats(stats);
        renderGapAnalysis(stats.gaps || []);
        renderHeatmap(stats.heatmap || []);
        renderAnalysis(profile, stats);
        
        // Render chart
        renderBadgeChartSafe(stats);

        // Generate timeline
        const timeline = await getUserTimeline(username);
        renderTimeline(timeline);

        showLoading(false);

    } catch (err) {
        console.error("Error loading user:", err);
        
        let errorMessage = "Error loading user data.";
        
        if (err.message.includes("private")) {
            errorMessage = "Cannot view inventory - user profile may be private.";
        } else if (err.message.includes("Unauthorized")) {
            errorMessage = "API authentication failed. Please check the API key configuration.";
        } else if (err.message.includes("403")) {
            errorMessage = "Access denied. The user's inventory may be private or API permissions are insufficient.";
        }
        
        alert(errorMessage + "\n\nSee console for details.");
        showLoading(false);
    }
}

/* =========================
   LOADING
========================= */

function showLoading(state) {
    if (state) {
        loadingSection.classList.remove("hidden");
    } else {
        loadingSection.classList.add("hidden");
    }
}

/* =========================
   PROFILE
========================= */

function renderProfile(profile) {
    avatar.src = profile.avatar || "https://via.placeholder.com/150?text=No+Avatar";
    usernameEl.textContent = profile.username || "-";
    displayNameEl.textContent = profile.displayName || profile.username || "";

    userIdEl.textContent = profile.id || "-";
    joinDateEl.textContent = profile.joinDate || "-";
    accountAgeEl.textContent = `${profile.accountAge || 0} days`;
}

/* =========================
   STATS
========================= */

function renderStats(stats) {
    badgeCountEl.textContent = (stats.badgeCount || 0).toLocaleString();
    activityScoreEl.textContent = `${stats.activityScore || 0}%`;
    badgeVelocityEl.textContent = `${stats.badgeVelocity || 0}/mo`;
    largestGapEl.textContent = `${stats.largestGap || 0} Days`;
}

/* =========================
   TIMELINE
========================= */

function renderTimeline(events) {
    timelineEl.innerHTML = "";

    if (!events || events.length === 0) {
        timelineEl.innerHTML = "<p style='opacity:0.6;padding:20px;'>No timeline events available.</p>";
        return;
    }

    events.forEach(ev => {
        const div = document.createElement("div");
        div.className = "timeline-item fade-in";

        div.innerHTML = `
            <strong>${ev.title || "Event"}</strong>
            <div style="opacity:.6;font-size:12px;margin-top:4px;">
                ${ev.date || ""}
            </div>
            <div style="margin-top:8px;opacity:0.8;">
                ${ev.description || ""}
            </div>
        `;

        timelineEl.appendChild(div);
    });
}

/* =========================
   GAP ANALYSIS
========================= */

function renderGapAnalysis(gaps) {
    gapContainer.innerHTML = "";

    if (!gaps || gaps.length === 0) {
        gapContainer.innerHTML = "<p style='opacity:0.6;padding:20px;grid-column:1/-1;'>No significant activity gaps detected (threshold: 60+ days).</p>";
        return;
    }

    gaps.forEach(gap => {
        const card = document.createElement("div");
        card.className = "gap-card fade-in";

        card.innerHTML = `
            <div class="gap-title">${gap.start} → ${gap.end}</div>
            <div class="gap-value">${gap.days} Days</div>
            <div style="margin-top:8px;font-size:12px;opacity:0.6;">Activity Gap</div>
        `;

        gapContainer.appendChild(card);
    });
}

/* =========================
   HEATMAP
========================= */

function renderHeatmap(data) {
    heatmapEl.innerHTML = "";

    if (!data || data.length === 0) {
        heatmapEl.innerHTML = "<p style='opacity:0.6;padding:20px;'>No heatmap data available.</p>";
        return;
    }

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    
    // Get last 12 months
    const monthLabels = [];
    for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        monthLabels.push(months[d.getMonth()]);
    }

    data.forEach((val, index) => {
        const cell = document.createElement("div");
        cell.className = `heat-cell level-${val} fade-in`;
        cell.title = `${monthLabels[index]}: Level ${val}`;
        cell.style.animationDelay = `${index * 0.05}s`;
        heatmapEl.appendChild(cell);
    });
}

/* =========================
   AI ANALYSIS BOX
========================= */

function renderAnalysis(profile, stats) {
    const activity = stats?.activityScore || 0;
    const badgeCount = stats?.badgeCount || 0;
    const velocity = parseFloat(stats?.badgeVelocity) || 0;
    const largestGap = stats?.largestGap || 0;

    let analysis = [];

    // Activity level assessment
    if (activity < 30) {
        analysis.push(`<span class="analysis-danger">⚠️ Low Activity:</span> This user shows minimal badge collection activity (${activity}% activity score).`);
    } else if (activity < 70) {
        analysis.push(`<span class="analysis-warning">📊 Moderate Activity:</span> This user has inconsistent engagement patterns (${activity}% activity score).`);
    } else {
        analysis.push(`<span class="analysis-positive">✅ High Activity:</span> This user is highly engaged with consistent badge collection (${activity}% activity score).`);
    }

    // Badge velocity
    if (velocity > 10) {
        analysis.push(`<span class="analysis-positive">🚀 Fast Collector:</span> Earning ${velocity} badges per month on average.`);
    } else if (velocity > 5) {
        analysis.push(`<span class="analysis-warning">📈 Steady Collector:</span> Earning ${velocity} badges per month on average.`);
    } else {
        analysis.push(`<span class="analysis-danger">🐌 Slow Collector:</span> Only earning ${velocity} badges per month on average.`);
    }

    // Gap analysis
    if (largestGap > 180) {
        analysis.push(`<span class="analysis-danger">💤 Long Inactivity:</span> Largest activity gap is ${largestGap} days - user may have taken extended breaks.`);
    } else if (largestGap > 60) {
        analysis.push(`<span class="analysis-warning">⏸️ Moderate Gaps:</span> Some inactivity periods detected (up to ${largestGap} days).`);
    } else {
        analysis.push(`<span class="analysis-positive">⚡ Consistent:</span> No major activity gaps detected - steady engagement.`);
    }

    // Badge count assessment
    if (badgeCount > 1000) {
        analysis.push(`<span class="analysis-positive">🏆 Elite Collector:</span> ${badgeCount.toLocaleString()} badges is exceptional!`);
    } else if (badgeCount > 500) {
        analysis.push(`<span class="analysis-positive">🎯 Dedicated Collector:</span> ${badgeCount.toLocaleString()} badges shows strong commitment.`);
    } else if (badgeCount > 100) {
        analysis.push(`<span class="analysis-warning">📦 Growing Collection:</span> ${badgeCount.toLocaleString()} badges - room for growth.`);
    } else {
        analysis.push(`<span class="analysis-danger">🌱 Starting Out:</span> Only ${badgeCount.toLocaleString()} badges collected so far.`);
    }

    analysisBox.innerHTML = analysis.join("<br><br>");
}

/* =========================
   CHART
========================= */

function renderBadgeChartSafe(stats) {
    const ctx = document.getElementById("badgeChart");

    if (!ctx || !stats || !stats.dates || stats.dates.length === 0) {
        console.error("Cannot render chart - missing data");
        return;
    }

    if (badgeChartInstance) {
        badgeChartInstance.destroy();
    }

    badgeChartInstance = renderBadgeChart(ctx, stats);
}