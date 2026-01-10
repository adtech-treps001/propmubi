# 🔌 PROPMUBI PORT CONFIGURATION

## Current Setup (CORRECT)

### Frontend Web Application
**Port**: `3005`  
**Command**: `npm run dev` (from `apps/web`)  
**Access URLs**:
- Consumer: `http://localhost:3005/consumer`
- Agent CRM: `http://localhost:3005/agent`
- Builder: `http://localhost:3005/builder`
- Digital Twin: `http://localhost:3005/projects/100/twin`
- Compare: `http://localhost:3005/compare`
- Magic Onboard: `http://localhost:3005/onboard`

### Backend API
**Port**: `8000`  
**Command**: `python -m uvicorn apps.api.main:app --reload --port 8000`  
**Access URLs**:
- API Docs: `http://localhost:8000/docs`
- All endpoints: `http://localhost:8000/*`

## How It Works
1. **User opens browser** → `http://localhost:3005/agent`
2. **Frontend (Next.js)** serves the page from port 3005
3. **Page makes API calls** → `http://localhost:8000/crm/leads/...`
4. **Backend (FastAPI)** responds from port 8000
5. **Frontend displays** the data

## ✅ Status
All ports are configured correctly. No changes needed.
- Frontend: **3005** (user-facing)
- Backend: **8000** (API only)

---
**Last Updated**: Jan 9, 2026 22:25 IST
