# 🌐 PROPMUBI TRUST OS - ACCESS URLS

**Single Port Deployment**: Port 3005  
**Last Updated**: 2026-01-09 11:30 IST

---

## 📍 UNIFIED WEB APPLICATION

**Base URL**: `http://localhost:3005`

All frontend views are accessible through a single Next.js application with unified navigation.

---

## 🏗️ BUILDER PORTAL

**URL**: `http://localhost:3005/builder`

### Features:
- ✅ Real-Time Trust Score (92/100)
- ✅ Verified Leads Counter (Live polling)
- ✅ Active Projects Overview
- ✅ Delivery Performance Analytics
- ✅ Legal Compliance Tracking
- ✅ 4 Interactive Charts (Bar, Line, Doughnut, Activity Feed)

### User Role: **BUILDER**

---

## 🤝 AGENT CRM

**URL**: `http://localhost:3005/agent`

### Features:
- ✅ Lead Governance Queue
- ✅ Commission Pipeline Tracker
- ✅ Supply Sensors Panel (WhatsApp Ingestion)
- ✅ One-Click Verification Workflow
- ✅ Real-Time Stats (5s polling)

### User Role: **AGENT**

---

## 🏠 CONSUMER VIEW

**URL**: `http://localhost:3005/consumer`

### Features:
- ✅ Property Feed (Mobile Mock)
- ✅ Trust Score Badges
- ✅ "Book Site Visit" CTA
- ✅ Responsive Mobile Layout

**Deep Link**: `http://localhost:3005/projects/100` (Details Page)

### User Role: **BUYER**

---

## ✨ MAGIC ONBOARDING (AI)

**URL**: `http://localhost:3005/onboard`

### Features:
- ✅ Drag & Drop RERA Card Scan
- ✅ URL Scraping for Builders
- ✅ Live Analysis Logs

---

## 🌐 AGENT MICROSITES

**URL Pattern**: `http://localhost:3005/microsite/{subdomain}`

### Example:
`http://localhost:3005/microsite/demo`  
`http://localhost:3005/microsite/ramesh-financial-district`

### Features:
- ✅ Personalized Agent Branding
- ✅ "PropMubi Verified Agent" Badge
- ✅ Verified Listings Showcase
- ✅ WhatsApp CTA Integration
- ✅ No Navigation (Standalone Landing Page)

### User Role: **PUBLIC** (Shared by Agents)

---

## 🔌 BACKEND API

**URL**: `http://localhost:8000`

### API Documentation:
**Swagger UI**: `http://localhost:8000/docs`  
**ReDoc**: `http://localhost:8000/redoc`

### Available Endpoints:

#### Auth Service
- `POST /auth/login` - OTP-based authentication

#### Property Service
- `GET /projects/feed` - Property discovery
- `GET /projects/{id}` - Property details
- `GET /projects/map` - GeoJSON data

#### Agent Service
- `POST /agent/onboard` - Agent registration
- `POST /agent/ingest/whatsapp` - Soft supply ingestion
- `GET /agent/listings` - View agent listings
- `POST /agent/listings/{id}/verify` - Verify listing

#### CRM Service
- `POST /crm/leads` - Create lead
- `GET /crm/leads/queue/{advisor_id}` - Agent queue
- `POST /crm/leads/{id}/assign` - Assign agent
- `GET /crm/commissions/{agent_id}` - Calculate commissions

#### Legal Service
- `POST /legal/verify/upload` - Upload document
- `GET /legal/verify/status/{doc_id}` - Check status

#### Inspection Service
- `POST /inspections/snags` - Report snag
- `GET /inspections/snags/{unit_id}` - Get snags

#### Dashboard Service
- `GET /dashboard/stats` - Real-time stats
- `POST /leads` - Demo lead creation

---

## 📱 MOBILE APPLICATION

**Expo Dev Server**: `http://localhost:8081`

### Access Methods:
1. **Web Browser**: `http://localhost:8081`
2. **Expo Go App**: Scan QR code
3. **Android Emulator**: `exp://localhost:8081`

### Screens:
- `/login` - OTP Login
- `/(tabs)/feed` - Property Feed
- `/(tabs)/map` - Map View
- `/property/[id]` - Property Details
- `/loans/eligibility` - Loan Wizard

---

## 📊 PROJECT DASHBOARD

**URL**: `file:///c:/projects/propmubi/docs/DASHBOARD/index.html`

### Features:
- Project progress tracking
- Task status (Gantt-style)
- Team metrics
- 75% completion indicator

---

## 🔐 AUTHENTICATION

### Current Status:
**Single Deployment**: All routes are publicly accessible for demo purposes.

### Production Setup (Future):
- Role-based access control
- JWT authentication
- `/builder` → BUILDER role only
- `/agent` → AGENT role only
- `/consumer` → PUBLIC
- `/microsite/*` → PUBLIC

---

## 🚀 QUICK START

### Start All Services:
```bash
# Terminal 1: Backend API
cd apps/api
docker-compose up

# Terminal 2: Web Frontend (Single Port)
cd apps/web
npm run dev

# Terminal 3: Mobile App (Optional)
cd apps/mobile
npm run web
```

### Access Points:
1. Open browser: `http://localhost:3005`
2. Default redirect: `/builder`
3. Use navigation bar to switch views

---

## 🎯 NAVIGATION STRUCTURE

```
PropMubi Trust OS (Port 3005)
├── / (Home - Auto-redirect to /builder)
├── /builder (Builder Dashboard)
├── /agent (Agent CRM)
├── /consumer (Consumer Feed)
└── /microsite/[subdomain] (Agent Landing Pages)
```

**Navigation Bar**: Visible on all pages except microsites

---

## 📱 MOBILE RESPONSIVE

All web views are responsive:
- Desktop: Full feature set
- Tablet: Optimized layouts
- Mobile: Touch-friendly interfaces

---

## 🔗 EXTERNAL INTEGRATIONS (Future)

### WhatsApp Business API
- Campaign Manager
- Bot Integration
- Message Templates

### Google Maps Platform
- Satellite View
- 3D Buildings
- Route Planning

### Payment Gateways
- Razorpay
- Stripe

### Bank APIs
- ICICI Loan API
- HDFC Pre-approval

---

## 🆘 TROUBLESHOOTING

### Port 3005 Already in Use?
```bash
# Find process
netstat -ano | findstr :3005

# Kill process
taskkill /PID <PID> /F

# Restart
npm run dev
```

### Backend Not Responding?
```bash
# Check Docker containers
docker-compose ps

# Restart API
docker-compose restart api
```

### Navigation Not Working?
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R)
3. Check `components/Navigation.tsx

` exists

---

## ✅ VERIFICATION CHECKLIST

Before sharing URLs:
- [ ] Backend running on Port 8000
- [ ] Frontend running on Port 3005
- [ ] Navigation bar visible
- [ ] All sub-pages accessible
- [ ] Charts rendering correctly
- [ ] Real-time polling working

---

**Documentation Maintained By**: Platform Team  
**Support**: docs@propmubi.com  
**GitHub**: github.com/propmubi/trust-os
