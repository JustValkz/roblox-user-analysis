# Quick Start Guide 🚀

## Step 1: Understanding Your API Key

Your Roblox Open Cloud API key is already configured in the code (from your Python script). 

**Location**: `/js/api.js` - Line 7

```javascript
const API_KEY = "qcW0a5Dd+UedqgEcq357y6yVpGJ6mQST...";
```

## Step 2: Required API Permissions

Your API key needs these permissions:

### ✅ User Inventory Items (Read)
- **Scope**: `user.inventory-items:read`
- **Purpose**: Fetch badge data from user inventories
- **Required**: Yes

### How to verify/create proper permissions:

1. Go to: https://create.roblox.com/credentials
2. Click **Open Cloud** → **API Keys**
3. Find your API key or create a new one
4. Under **API System**, select:
   - **Inventory API** or **User Restrictions API**
5. Under **Access Permissions**:
   - ✅ Enable "Read User Inventory Items"
6. Optional but recommended:
   - Set IP restrictions for security
   - Set expiration date
7. Click **Save**

## Step 3: Running the Dashboard

### Method A: Simple (Direct File)

Just double-click `index.html` and open it in your browser.

⚠️ **Note**: Some browsers block API requests for security. If you get errors, use Method B.

### Method B: Local Web Server (Recommended)

#### Using Python:
```bash
# Navigate to the Code folder
cd "C:\Users\Yusuf Quadri\Downloads\Code"

# Start server (Python 3)
python -m http.server 8000
```

#### Using Node.js:
```bash
npx http-server -p 8000
```

#### Using PHP:
```bash
php -S localhost:8000
```

Then open your browser to: **http://localhost:8000**

## Step 4: Using the Dashboard

1. **Enter a Roblox Username**
   - Example: "Builderman", "Johnpork1234696969", or any username
   - Note: Use the actual username, not the display name

2. **Click "Analyze"**
   - The dashboard will fetch data (may take 10-60 seconds)
   - Loading animation shows progress

3. **View Results**
   - Profile information loads first
   - Badge statistics calculate and display
   - Chart renders with all badge data
   - Timeline, gaps, and heatmap populate

4. **Export Chart** (Optional)
   - Scroll to the chart
   - Click "Export PNG" button
   - Downloads as `roblox-badge-chart-[timestamp].png`

## What Each Section Shows

### 📊 Profile Card
- **Avatar**: User's Roblox avatar
- **Username**: Current username
- **Display Name**: User's display name
- **User ID**: Roblox user ID number
- **Join Date**: Account creation date
- **Account Age**: Days since account creation

### 📈 Statistics Cards
- **Total Badges**: Total number of badges earned
- **Activity Score**: 0-100% rating (based on badges/day vs account age)
- **Badge Velocity**: Average badges earned per month
- **Largest Gap**: Longest period without earning a badge

### 📉 Badge Growth Timeline (Chart)
- Interactive line chart showing cumulative badge growth
- **Scroll wheel**: Zoom in/out
- **Click & drag**: Pan left/right
- **Hover**: See exact date and badge count

### 🎯 Activity Timeline
- Key milestones in badge collection
- First badge, every 100 badges, latest badge

### 🔥 Monthly Heatmap
- Visual grid showing last 12 months
- Color intensity = badge activity level
- Darker = more badges that month

### ⏸️ Gap Analysis Cards
- Shows periods of inactivity (60+ days)
- Displays date range and duration
- Maximum 10 largest gaps shown

### 🤖 AI Style Analysis
- Intelligent commentary on activity patterns
- Color-coded insights:
  - 🟢 Green = Positive/High activity
  - 🟡 Yellow = Moderate/Warning
  - 🔴 Red = Low activity/Concern

## Common Issues & Solutions

### ❌ "User not found"
**Cause**: Username doesn't exist or is misspelled
**Solution**: 
- Double-check the spelling
- Try a different username to test
- Make sure it's the username, not display name

### ❌ "Cannot view inventory"
**Cause**: User's inventory is private
**Solution**: 
- Try a different user with public inventory
- No way around privacy settings - this is intentional

### ❌ "Unauthorized - 401"
**Cause**: API key is invalid, expired, or has wrong permissions
**Solution**:
1. Check API key is correctly copied (no extra spaces)
2. Verify key hasn't expired
3. Check permissions include "Read User Inventory Items"
4. Try regenerating the key

### ❌ "Access denied - 403"
**Cause**: Either privacy settings or insufficient API permissions
**Solution**:
1. Verify API key has inventory read permission
2. Try a different user
3. Check IP restrictions on API key

### ❌ Chart not displaying
**Cause**: JavaScript error or Chart.js not loading
**Solution**:
1. Open browser console (F12)
2. Look for error messages
3. Make sure internet connection is active (Chart.js loads from CDN)
4. Try hard refresh (Ctrl+F5)

### ❌ CORS errors in console
**Cause**: Browser security blocking API requests
**Solution**: Use a local web server (Method B above)

## Performance Notes

### Loading Times
- **Small accounts** (< 100 badges): 5-10 seconds
- **Medium accounts** (100-1000 badges): 10-30 seconds  
- **Large accounts** (1000+ badges): 30-60 seconds

### Why it takes time:
- API pagination (100 badges per request)
- Rate limiting (429 errors = 5 second delay)
- Multiple API calls (profile + thumbnails + badges)

### Progress tracking:
Open browser console (F12) to see:
```
Analyzing user: Johnpork1234696969
Profile loaded: {id: "615919119", username: "Johnpork1234696969", ...}
Fetched 100 badges so far...
Fetched 200 badges so far...
...
Total badges fetched: 847
Stats loaded: {badgeCount: 847, activityScore: 65, ...}
```

## Testing the Dashboard

### Test with known accounts:

1. **Builderman** - Roblox staff account (public)
2. **Johnpork1234696969** - From your Python example
3. Your own username (if inventory is public)

### Expected behavior:

✅ Profile loads in 2-3 seconds
✅ Badge count appears
✅ Chart displays with smooth animation
✅ All sections populate with data
✅ Export button works

## Advanced Tips

### 🔍 Inspecting Raw Data
Open browser console and check the `stats` object:
```javascript
// After analyzing a user, in console:
console.log("Check the stats object for raw data")
```

### 🎨 Customizing Colors
Edit `/css/style.css`:
```css
:root{
    --discord:#5865f2;  /* Change primary color */
    --success:#57f287;  /* Change success color */
    --danger:#ed4245;   /* Change danger color */
}
```

### 📊 Chart Customization
Edit `/js/charts.js` to modify:
- Colors
- Line thickness
- Point styles
- Axis labels

### 🔐 Using a Different API Key
Edit `/js/api.js` line 7:
```javascript
const API_KEY = "YOUR_NEW_KEY_HERE";
```

## Security Best Practices

### ✅ DO:
- Keep your API key secure
- Set IP restrictions on the API key
- Set expiration dates
- Use the minimum required permissions

### ❌ DON'T:
- Share your API key publicly
- Commit API keys to public repositories
- Use overly permissive API key settings
- Leave API keys without expiration

## Need Help?

1. Check browser console for errors (F12)
2. Review the full README.md
3. Verify API key permissions at https://create.roblox.com/credentials
4. Test with a different username

---

## Quick Reference Card

| Action | Result |
|--------|--------|
| Enter username + Analyze | Fetches complete profile & badge data |
| Click Export PNG | Downloads chart as image |
| Scroll wheel on chart | Zoom in/out |
| Click-drag on chart | Pan timeline |
| Hover chart points | See exact data |
| F12 | Open console for debug info |
| Ctrl+F5 | Hard refresh page |

**Enjoy analyzing Roblox badge collections! 🎮🏆**
