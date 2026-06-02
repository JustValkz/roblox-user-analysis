# ⚡ Quick Start Guide

## 🎯 3 Steps to Get Running

### Step 1: Test API Key (30 seconds)
```
1. Open: test-api.html (double-click)
2. Click all 3 "Run Test" buttons
3. Verify tests pass (green checkmarks)
```

### Step 2: Start Server (30 seconds)
```bash
cd "C:\Users\Yusuf Quadri\Downloads\Code"
python -m http.server 8000
```

### Step 3: Use Dashboard (1 minute)
```
1. Open: http://localhost:8000
2. Enter username: Builderman
3. Click: Analyze
4. Wait 10-30 seconds for results
```

---

## 📁 File Structure

```
Code/
├── index.html          ← Main dashboard (open this!)
├── test-api.html       ← Test API key first
│
├── css/
│   └── style.css       ← Modern styling
│
├── js/
│   ├── api.js          ← API key configured here ✅
│   ├── charts.js       ← Chart visualization
│   └── script.js       ← Main logic
│
└── Documentation/
    ├── README.md       ← Full documentation
    ├── USAGE.md        ← Usage guide
    ├── SUMMARY.md      ← Project summary
    └── QUICKSTART.md   ← This file
```

---

## 🔑 API Key Location

Your API key is already set in: **`js/api.js`** (Line 7)

```javascript
const API_KEY = "qcW0a5Dd+UedqgEcq357y6yVpGJ6mQST...";
```

---

## ✅ Required Permissions

Your Roblox Open Cloud API key needs:

**Permission:** `user.inventory-items:read`

### To Check/Set:
1. Go to: https://create.roblox.com/credentials
2. Select **Open Cloud** → **API Keys**
3. Find your key
4. Ensure "Read User Inventory Items" is enabled

---

## 🎮 Example Usernames to Try

1. **Builderman** - Roblox staff (thousands of badges)
2. **Johnpork1234696969** - Your Python example (~847 badges)
3. Any public Roblox username

---

## ⚠️ Troubleshooting

### Problem: "User not found"
→ Check spelling, try different username

### Problem: "Unauthorized (401)"
→ API key invalid/expired
→ Check permissions at Roblox console

### Problem: "Cannot view inventory (403)"
→ User's inventory is private
→ Try different user

### Problem: CORS errors in console
→ Use local server (don't open file directly)

---

## 📊 What You'll See

### Profile Card
- Avatar image
- Username & Display Name
- User ID
- Join Date
- Account Age

### Stats Cards (4 metrics)
- Total Badges
- Activity Score (0-100%)
- Badge Velocity (badges/month)
- Largest Gap (days)

### Interactive Chart
- Badge growth over time
- Zoom: Scroll wheel
- Pan: Click & drag

### Activity Timeline
- First badge milestone
- Every 100 badges
- Latest badge

### Gap Analysis
- Cards showing inactivity periods
- 60+ day gaps
- Date ranges

### Monthly Heatmap
- 12-month grid
- Color intensity = activity level

### AI Analysis
- Smart insights about activity
- Color-coded (green/yellow/red)

---

## 🚀 Running Without Server

If you want to skip the server (not recommended):

1. Open `index.html` directly in browser
2. If you get CORS errors, enable this Chrome flag:
   ```
   chrome://flags/#allow-insecure-localhost
   ```
3. Or use: `--disable-web-security --user-data-dir="c:/temp"`

**Note:** Using a server is much simpler and safer!

---

## 💾 Export Chart

1. Analyze any user
2. Scroll to chart
3. Click "Export PNG" button
4. Image saves as: `roblox-badge-chart-[timestamp].png`

---

## 📱 Mobile/Tablet

Works on all devices!
- Responsive layout
- Touch-friendly
- Optimized for small screens

---

## 🔧 Customization

### Change Colors
Edit `css/style.css`:
```css
:root {
    --discord: #5865f2;     /* Primary color */
    --success: #57f287;     /* Success color */
    --danger: #ed4245;      /* Danger color */
}
```

### Change Gap Threshold
Edit `js/api.js` (line ~147):
```javascript
const GAP_THRESHOLD_DAYS = 60; // Change to any value
```

### Change Activity Formula
Edit `js/api.js` (line ~160):
```javascript
const expectedBadges = accountAgeDays * 0.5; // Adjust multiplier
```

---

## 📚 Need More Help?

- **Detailed Guide:** Read `USAGE.md`
- **Full Docs:** Read `README.md`
- **Project Overview:** Read `SUMMARY.md`
- **Test API:** Open `test-api.html`

---

## ✨ Features vs Python

| Feature | Python | Web Dashboard |
|---------|--------|---------------|
| **Interface** | Terminal | Beautiful Web UI |
| **Chart** | Static | Interactive (zoom/pan) |
| **Export** | Auto-saves | Click button |
| **Loading** | Text progress | Animated spinner |
| **Analysis** | Basic text | AI-style insights |
| **Heatmap** | ❌ | ✅ 12-month grid |
| **Timeline** | ❌ | ✅ Milestone events |
| **Mobile** | ❌ | ✅ Fully responsive |

---

## 🎉 You're Ready!

Your dashboard is **100% configured** and ready to use!

**Quick Command:**
```bash
cd "C:\Users\Yusuf Quadri\Downloads\Code" && python -m http.server 8000
```

Then open: http://localhost:8000

**That's it! Enjoy! 🏆**
