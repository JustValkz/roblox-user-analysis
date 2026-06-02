// js/api.js

/* =========================
   CONFIGURATION
========================= */

// Your Roblox Open Cloud API Key from the Python code
const API_KEY = "qcW0a5Dd+UedqgEcq357y6yVpGJ6mQSTabbvYKU/6DuWmj6fZXlKaGJHY2lPaUpTVXpJMU5pSXNJbXRwWkNJNkluTnBaeTB5TURJeExUQTNMVEV6VkRFNE9qVXhPalE1V2lJc0luUjVjQ0k2SWtwWFZDSjkuZXlKaGRXUWlPaUpTYjJKc2IzaEpiblJsY201aGJDSXNJbWx6Y3lJNklrTnNiM1ZrUVhWMGFHVnVkR2xqWVhScGIyNVRaWEoyYVdObElpd2lZbUZ6WlVGd2FVdGxlU0k2SW5GalZ6QmhOVVJrSzFWbFpIRm5SV054TXpVM2VUWjVWbkJIU2padFVWTlVZV0ppZGxsTFZTODJSSFZYYldvMlppSXNJbTkzYm1WeVNXUWlPaUkyTVRVNU1UazVNVEU1SWl3aVpYaHdJam94Tnpnd05ETTROVE15TENKcFlYUWlPakUzT0RBME16UTVNeklzSW01aVppSTZNVGM0TURRek5Ea3pNbjAuWHdiM2h0RzRNS2M4dkpia0tDVTk0aV9WWTRld1JVWUpoT0RRenNtRk0xY3hILUtfOHRtdWt6QVVyeTVVWWZKTWY2a2pmVklXOFNxSXNub0pIZzBrc1h5RVItaXozd082SDY2UFFSS2VDME5ZSzdqSm90aWpxeGRZb00xcF90cXpSVXVWelZtNkxwb1dWTmVuenFfN2dCampic0d2anM4YWN0SGxxcHdGY1lleC1WVUhsU1RTLUZITmUxdktpU0E5aTEwdXlpYWpDeEhZSnVYQV9GazVKcWdqSGo1M1FnaVpnX2Z6NTlyV1c4bWxHOFVmcEN3T1Mwak5LaUN4OWJocENvbW9ZWmVJNHVDcTRROURHWWlXWjVTZ3Zja2lpSE9xV1piai04UFpJUlZFeVgweUlLWWVZaWlxbldvUE5mY2diUGJtT051bG5VX1ZqaGtrTjFKcFBB";

const OPEN_CLOUD_BASE = "https://apis.roblox.com/cloud/v2";
const ROBLOX_USERS_API = "https://users.roblox.com/v1";

const HEADERS = {
    "x-api-key": API_KEY,
    "Accept": "application/json"
};

/* =========================
   SLEEP UTILITY
========================= */

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/* =========================
   GET USER ID FROM USERNAME
========================= */

export async function getUserIdFromUsername(username) {
    try {
        const response = await fetch(`${ROBLOX_USERS_API}/usernames/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                usernames: [username]
            })
        });

        if (!response.ok) {
            console.error("Username lookup failed:", response.status);
            return null;
        }

        const data = await response.json();
        
        if (!data.data || data.data.length === 0) {
            return null;
        }

        return {
            id: String(data.data[0].id),
            name: data.data[0].name,
            displayName: data.data[0].displayName
        };

    } catch (err) {
        console.error("Error looking up username:", err);
        return null;
    }
}

/* =========================
   GET USER PROFILE INFO
========================= */

export async function getUserProfile(username) {
    try {
        // Get user ID first
        const userInfo = await getUserIdFromUsername(username);
        
        if (!userInfo) {
            return null;
        }

        // Get detailed profile info
        const profileResponse = await fetch(`${ROBLOX_USERS_API}/users/${userInfo.id}`);
        
        if (!profileResponse.ok) {
            console.error("Profile fetch failed");
            return userInfo;
        }

        const profileData = await profileResponse.json();

        // Get avatar thumbnail
        const thumbnailResponse = await fetch(
            `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userInfo.id}&size=150x150&format=Png&isCircular=false`
        );

        let avatarUrl = "";
        if (thumbnailResponse.ok) {
            const thumbnailData = await thumbnailResponse.json();
            if (thumbnailData.data && thumbnailData.data.length > 0) {
                avatarUrl = thumbnailData.data[0].imageUrl;
            }
        }

        // Calculate account age
        const joinDate = new Date(profileData.created);
        const now = new Date();
        const accountAgeDays = Math.floor((now - joinDate) / (1000 * 60 * 60 * 24));

        return {
            id: userInfo.id,
            username: profileData.name,
            displayName: profileData.displayName,
            avatar: avatarUrl,
            joinDate: joinDate.toLocaleDateString(),
            joinDateRaw: profileData.created,
            accountAge: accountAgeDays,
            description: profileData.description || ""
        };

    } catch (err) {
        console.error("Error fetching user profile:", err);
        return null;
    }
}

/* =========================
   FETCH ALL BADGES
========================= */

export async function fetchAllBadges(userId) {
    const url = `${OPEN_CLOUD_BASE}/users/${userId}/inventory-items`;
    const params = new URLSearchParams({
        filter: "badges=true",
        maxPageSize: "100"
    });

    const badges = [];
    let pageToken = null;
    let fetchCount = 0;

    try {
        while (true) {
            if (pageToken) {
                params.set("pageToken", pageToken);
            }

            const response = await fetch(`${url}?${params}`, {
                headers: HEADERS
            });

            // Handle rate limiting
            if (response.status === 429) {
                console.log("Rate limited. Waiting 5 seconds...");
                await sleep(5000);
                continue;
            }

            if (response.status === 403) {
                throw new Error("Cannot view inventory - profile may be private or API permissions insufficient");
            }

            if (response.status === 401) {
                throw new Error("Unauthorized - Invalid API key or insufficient permissions");
            }

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API Error ${response.status}: ${errorText}`);
            }

            const data = await response.json();

            if (data.inventoryItems) {
                badges.push(...data.inventoryItems);
                fetchCount += data.inventoryItems.length;
                console.log(`Fetched ${fetchCount} badges so far...`);
            }

            pageToken = data.nextPageToken;

            if (!pageToken) {
                break;
            }
        }

        console.log(`Total badges fetched: ${badges.length}`);
        return badges;

    } catch (err) {
        console.error("Error fetching badges:", err);
        throw err;
    }
}

/* =========================
   EXTRACT & PARSE DATES
========================= */

function convertDate(dateString) {
    // Handle fractional seconds
    let normalized = dateString;
    
    if (dateString.includes(".")) {
        const parts = dateString.replace("Z", "").split(".");
        const base = parts[0];
        const frac = (parts[1] + "000").substring(0, 3);
        normalized = `${base}.${frac}Z`;
    } else {
        normalized = dateString.replace("Z", "") + ".000Z";
    }

    return new Date(normalized);
}

function extractDates(badges) {
    return badges
        .filter(badge => badge.addTime)
        .map(badge => convertDate(badge.addTime))
        .sort((a, b) => a - b);
}

/* =========================
   CALCULATE STATISTICS
========================= */

function calculateStats(dates, accountAgeDays) {
    if (dates.length === 0) {
        return {
            badgeCount: 0,
            activityScore: 0,
            badgeVelocity: 0,
            largestGap: 0,
            gaps: [],
            badgeHistory: []
        };
    }

    const GAP_THRESHOLD_DAYS = 60;
    const gaps = [];

    // Calculate gaps
    for (let i = 1; i < dates.length; i++) {
        const gapDays = Math.floor((dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24));
        if (gapDays >= GAP_THRESHOLD_DAYS) {
            gaps.push({
                start: dates[i - 1].toLocaleDateString(),
                end: dates[i].toLocaleDateString(),
                days: gapDays
            });
        }
    }

    const largestGap = gaps.length > 0 ? Math.max(...gaps.map(g => g.days)) : 0;

    // Badge velocity (badges per month)
    const badgeVelocity = accountAgeDays > 0 
        ? ((dates.length / accountAgeDays) * 30).toFixed(1)
        : 0;

    // Activity score (0-100)
    let activityScore = 0;
    if (accountAgeDays > 0) {
        const expectedBadges = accountAgeDays * 0.5; // Assume 0.5 badges/day is "good"
        activityScore = Math.min(100, Math.round((dates.length / expectedBadges) * 100));
    }

    // Badge history for chart (cumulative)
    const badgeHistory = dates.map((_, index) => index + 1);

    return {
        badgeCount: dates.length,
        activityScore,
        badgeVelocity,
        largestGap,
        gaps: gaps.slice(0, 10), // Top 10 gaps
        badgeHistory,
        dates
    };
}

/* =========================
   GENERATE HEATMAP DATA
========================= */

function generateHeatmap(dates) {
    if (dates.length === 0) {
        return Array(12).fill(0);
    }

    // Count badges per month for the last year
    const monthCounts = Array(12).fill(0);
    const now = new Date();

    dates.forEach(date => {
        const monthDiff = (now.getFullYear() - date.getFullYear()) * 12 + 
                         (now.getMonth() - date.getMonth());
        
        if (monthDiff >= 0 && monthDiff < 12) {
            monthCounts[11 - monthDiff]++;
        }
    });

    // Convert to heat levels (0-4)
    const maxCount = Math.max(...monthCounts);
    
    if (maxCount === 0) {
        return monthCounts.map(() => 0);
    }

    return monthCounts.map(count => {
        if (count === 0) return 0;
        const percent = (count / maxCount) * 100;
        if (percent < 20) return 1;
        if (percent < 40) return 2;
        if (percent < 70) return 3;
        return 4;
    });
}

/* =========================
   GET USER STATS
========================= */

export async function getUserStats(username) {
    try {
        const profile = await getUserProfile(username);
        
        if (!profile) {
            return null;
        }

        console.log("Fetching badges...");
        const badges = await fetchAllBadges(profile.id);
        
        const dates = extractDates(badges);
        const stats = calculateStats(dates, profile.accountAge);
        const heatmap = generateHeatmap(dates);

        return {
            ...stats,
            heatmap,
            rawBadges: badges
        };

    } catch (err) {
        console.error("Error getting user stats:", err);
        throw err;
    }
}

/* =========================
   GET USER TIMELINE
========================= */

export async function getUserTimeline(username) {
    try {
        const stats = await getUserStats(username);
        
        if (!stats || !stats.dates) {
            return [];
        }

        // Generate timeline events from badge dates
        const timeline = [];
        const dates = stats.dates;

        // First badge
        if (dates.length > 0) {
            timeline.push({
                title: "🏆 First Badge Earned",
                date: dates[0].toLocaleDateString(),
                description: "Started badge collection journey"
            });
        }

        // Milestone badges (every 100)
        for (let i = 100; i <= dates.length; i += 100) {
            if (i <= dates.length) {
                timeline.push({
                    title: `🎯 ${i} Badge Milestone`,
                    date: dates[i - 1].toLocaleDateString(),
                    description: `Reached ${i} total badges`
                });
            }
        }

        // Latest badge
        if (dates.length > 1) {
            timeline.push({
                title: "⭐ Latest Badge",
                date: dates[dates.length - 1].toLocaleDateString(),
                description: `Most recent badge earned`
            });
        }

        return timeline.slice(0, 10); // Return top 10 events

    } catch (err) {
        console.error("Error generating timeline:", err);
        return [];
    }
}