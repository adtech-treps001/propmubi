# 🚀 Propmubi Quick Start Guide

## Get Running in 5 Minutes

This guide will get you up and running with the complete Propmubi demo.

---

## Prerequisites

- **Node.js 18+** (check with `node -v`)
- **npm 9+** (check with `npm -v`)
- **Web browser** (Chrome, Firefox, Safari, Edge)

Don't have Node.js? Download from https://nodejs.org

---

## Option 1: Super Quick Demo (Recommended)

**Step 1:** Install backend dependencies

```bash
cd backend
npm install
```

**Step 2:** Start the backend server

```bash
npm start
```

You should see:
```
🚀 Propmubi Mock Backend running on http://localhost:3001
```

**Step 3:** Open the demo

Simply open `demo.html` in your web browser:
- **macOS**: `open demo.html`
- **Windows**: Double-click `demo.html`
- **Linux**: `xdg-open demo.html`

**That's it!** 🎉 You now have a fully working demo with all 7 modules.

---

## Option 2: Full Development Setup

If you want to modify the code or build the full React Native app:

**Step 1:** Install all dependencies

```bash
npm install
```

**Step 2:** Start everything

```bash
npm run dev
```

This starts both backend and frontend (if you've set up the React app).

---

## What You Get

### Demo Features

The `demo.html` file includes complete working demos of:

1. **Buy/Sell Module** ✅
   - Property search
   - Due diligence automation (12-second reports)
   - Token of interest payment simulation
   - RERA verification
   - Land legality checks

2. **Rental Module** ✅
   - CIBIL score-based deposit calculator
   - AI move-in/move-out inspection simulation
   - Deposit dispute prevention

3. **Commercial Module** ✅
   - Footfall heatmap analysis
   - Demographics data
   - Location scoring for businesses

4. **Auction Module** ✅
   - Bank auction listings
   - Below-market deal alerts
   - Discount percentage display

5. **Lifecycle Module** ✅
   - Satellite monitoring simulation
   - Encroachment detection
   - Live property valuation ticker

6. **Community Module** ✅
   - Digital polling/voting
   - Bulk buy system
   - Visitor management

7. **Land & JV Module** ✅
   - Land title verification (Dharani)
   - Development potential calculation
   - JV matchmaking system

---

## Testing the Features

### Test Scenario 1: Property Search & Due Diligence

1. Go to **Buy/Sell** tab
2. Search is pre-filled with "Hyderabad"
3. Click "Search" button
4. Click on any property card
5. Wait 2 seconds for due diligence report
6. See 92/100 score with detailed breakdown

### Test Scenario 2: Rental Deposit Calculator

1. Go to **Rental** tab
2. Enter monthly rent: `35000`
3. Click "Calculate Deposit"
4. See CIBIL score (785) and reduced deposit (1 month vs 6 months)
5. See savings: ₹1.75L

### Test Scenario 3: Commercial Footfall Analysis

1. Go to **Commercial** tab
2. Location is pre-filled: "HITEC City"
3. Click "Analyze Location"
4. See footfall score (82/100)
5. View demographics (45K population, 42% IT professionals)
6. Read recommendations

### Test Scenario 4: Satellite Monitoring

1. Go to **Lifecycle** tab
2. Click "Run Satellite Check"
3. Wait 3 seconds for analysis
4. See change detection (3.2% - within normal limits)
5. No encroachment alert

---

## Architecture Overview

```
┌─────────────────┐
│   demo.html     │  ← Frontend (Open in browser)
│   (JavaScript)  │
└────────┬────────┘
         │ HTTP Requests
         ↓
┌─────────────────┐
│ backend/server  │  ← Simulated backend (Node.js)
│   (Port 3001)   │
└─────────────────┘
         │
         ↓
┌─────────────────┐
│   Mock Data     │  ← In-memory (no real DB needed)
│   Mock APIs     │
└─────────────────┘
```

---

## Mock API Endpoints

All these endpoints are working in the simulated backend:

```
GET  /api/properties                    # Search properties
GET  /api/properties/:id                # Get property details
POST /api/properties/:id/due-diligence  # Run due diligence
POST /api/properties/:id/token          # Pay token

POST /api/rental/calculate-deposit      # Calculate deposit based on CIBIL
POST /api/rental/:id/move-in-report     # Generate move-in report

POST /api/commercial/footfall           # Get footfall analysis

GET  /api/auctions                      # Get auction listings

POST /api/lifecycle/:id/satellite-check # Run satellite check
GET  /api/lifecycle/:id/valuation       # Get property valuation

GET  /api/community/:id                 # Get community details
POST /api/community/polls/:id/vote      # Vote on poll
POST /api/community/bulk-orders/:id/join # Join bulk order

POST /api/land/verify                   # Verify land title
```

---

## Simulated Data

The backend uses realistic mock data:

- **3 Properties** in Hyderabad (Jubilee Hills, Gachibowli, HITEC City)
- **2 Bank Auctions** with 25-27% discounts
- **1 Community** (My Home Avatar) with active polls and bulk orders
- **Mock CIBIL score**: 785
- **Mock RERA verification**: Real RERA numbers (format correct)
- **Mock satellite images**: Unsplash placeholder images

---

## Customizing the Demo

### Change Mock Data

Edit `backend/src/server.js`:

```javascript
// Add more properties
const MOCK_PROPERTIES = [
  {
    id: 'prop-4',
    title: 'Your Property',
    price: 10000000,
    // ... more fields
  }
];
```

### Change API Port

Edit `backend/src/server.js`:

```javascript
const PORT = 3001; // Change to 3002, 4000, etc.
```

Then update `demo.html`:

```javascript
const API_BASE = 'http://localhost:3001/api'; // Change port here too
```

### Add New Endpoints

In `backend/src/server.js`:

```javascript
app.get('/api/your-endpoint', (req, res) => {
  res.json({ message: 'Your data' });
});
```

---

## Troubleshooting

### Backend won't start

**Error:** `Cannot find module 'express'`

**Fix:**
```bash
cd backend
npm install
```

### Demo shows "Error loading properties"

**Issue:** Backend is not running

**Fix:**
1. Check if backend is running: `curl http://localhost:3001/api/health`
2. If not, start it: `cd backend && npm start`

### Port 3001 already in use

**Fix:**
```bash
# macOS/Linux
lsof -ti:3001 | xargs kill -9

# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

---

## Next Steps

1. **Explore Code:**
   - `demo.html` - Frontend code (HTML/JS)
   - `backend/src/server.js` - Backend API code

2. **Read Documentation:**
   - `README.md` - Complete overview
   - `PRD.md` - Product requirements
   - `DESIGN.md` - Architecture details
   - `USER_GUIDE.md` - End-user guide

3. **Build Mobile App:**
   - Follow `README.md` for React Native setup
   - 90% of code is already shared with web

4. **Add Real Integrations:**
   - Replace mock APIs with real ones:
     - RERA: State-wise APIs
     - Dharani: Telangana govt API
     - 99acres: Scraping or partner API
     - Setu: Account Aggregator
     - Experian: CIBIL API

---

## Support

**Found a bug?** Create an issue on GitHub

**Have questions?** Email: support@propmubi.com

**Want to contribute?** See CONTRIBUTING.md

---

## File Structure

```
propmubi-app/
├── demo.html              ← Open this in browser
├── backend/
│   ├── src/
│   │   └── server.js     ← Backend API code
│   ├── package.json
│   └── README.md
├── docs/
│   ├── README.md         ← You are here
│   ├── PRD.md
│   ├── DESIGN.md
│   └── USER_GUIDE.md
├── package.json
├── setup.sh
└── QUICKSTART.md         ← This file
```

---

**Ready?** Let's go! 🚀

```bash
cd backend && npm install && npm start
# Then open demo.html in your browser
```

Enjoy exploring Propmubi! 🏠
