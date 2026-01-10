# PropMubi Demo Guide - Complete Walkthrough
## All Services Running on localhost:3005

---

## 🚀 **SERVICE STATUS**
✅ **Frontend**: http://localhost:3005 (Next.js - Port 3005)  
✅ **Backend API**: http://localhost:8000 (FastAPI)  
✅ **API Docs**: http://localhost:8000/docs (Swagger UI)  

---

## 📋 **DEMO FLOW - 5 KEY PAGES**

### **1. INVESTOR PITCH DECK** 
**URL**: `http://localhost:3005/pitch`

**What to Show**:
- ✨ 12 Premium slides with Framer Motion transitions
- 📊 Market size: $1 Trillion by 2030
- 💰 Unit Economics: CAC ₹8.5K, LTV ₹1.85L, 21.7x ratio
- 🎯 Market Sizing: TAM $1T, SAM $120B, SOM $2.4B
- 🔥 VC Grill: "We own Transaction Intent, not Search Query"

**Demo Script**:
1. Start on hero slide: "PropMubi: The Trust OS"
2. Click "Next Slide" → Show market fragmentation problems
3. Click "Next Slide" → Show trust crisis (43% abandonment rate)
4. Click "Next Slide" → Show PropMubi network solution
5. Click "Next Slide" → Show Unit Economics slide (highlight 21.7x LTV:CAC)
6. Click "Next Slide" → Show Market Sizing (TAM/SAM/SOM)

**Key Talking Points**:
- "We're building the canonical System of Truth for India's $1T real estate market"
- "21.7x LTV:CAC ratio - best-in-class for PropTech"
- "Path to $100M ARR by Year 5"

---

### **2. CONSUMER DASHBOARD**
**URL**: `http://localhost:3005/consumer`

**What to Show**:
- 🏘️ Property feed with premium listings
- 🔍 Search and discovery interface
- 📍 Location-based browsing

**Demo Script**:
1. Open consumer page
2. Show property cards with verified badges
3. Explain: "This is the entry point for buyers to discover verified properties"

**Key Talking Points**:
- "Consumer-first discovery experience"
- "Only verified listings with Trust Artifacts"

---

### **3. PROJECT DETAILS - "TRUST & AUDIT CENTER"**
**URL**: `http://localhost:3005/projects/100` (My Home Sayuk)

**What to Show**:
- 🛡️ **Trust & Audit Tab**: The killer feature
  - ✅ Vastu Compliance Report (room-by-room analysis)
  - ⚖️ Legal Audit (Title Search verified)
  - 🏛️ RERA Compliance (Active status)
  - 🏗️ Quality Inspection (94% score)
- 🔒 **Confidence Mode**: Price lock toggle
- 🏗️ **Tech Specs**: Electrical (Legrand), Plumbing (Kohler), Finishes
- 🗺️ **Location Intelligence**: Environmental map with POIs

**Demo Script**:
1. Navigate to project page
2. **Click "Trust & Audit" tab** (critical moment!)
3. Expand Vastu section → Show directional analysis
4. Show Legal Audit → Point to "Title Search VERIFIED"
5. Show RERA Compliance → "ACTIVE - REG/2023/..."
6. **Toggle "Confidence Mode"** → Watch UI shift to dark/locked state
7. Click "Tech Specs" → Show branded components (Legrand, Kohler)
8. Click "Location" → Show interactive map

**Key Talking Points**:
- "This is the ONLY platform where buyers can self-verify all trust artifacts in one place"
- "Confidence Mode locks the price and moves the buyer into a priority allocation queue"
- "We integrate every technical schema - from electrical layouts to wall finishes"

---

### **4. BUILDER DASHBOARD - "INVENTORY STAGING"**
**URL**: `http://localhost:3005/builder`

**What to Show**:
- 📊 **Inventory Grid**: Visual grid of all units
- 🎯 **Canonical States**: PUBLIC, PREMIUM_RESERVE, STAGE_LOCKED
- 🏷️ **Audit ID Tracking**: Every unit has an AUD-ID
- 📈 **Activity Feed**: Real-time updates
- 🔄 **Truth Sync**: Project update controls

**Demo Script**:
1. Open builder dashboard
2. Show inventory grid with color-coded units
3. Click on a unit → Show "Detail Inspector" panel
4. Point to "Audit ID: AUD-992-PX"
5. Change unit status to "PREMIUM_RESERVE"
6. Explain: "This immediately syncs to all consumer views"

**Key Talking Points**:
- "Builders get master control over inventory with canonical states"
- "Every unit is backed by a Trust Artifact with an Audit ID"
- "No more Excel spreadsheets - real-time truth for all stakeholders"

---

### **5. AGENT CRM - "SERVICE HUB"**
**URL**: `http://localhost:3005/agent`

**What to Show**:
- 🤝 **Protected Leads**: One Lead · One Advisor invariant
- 🧩 **Service Hub**: Categorized digital services
  - 💬 Communication & Bots (Gupshup, MSG91)
  - 🪪 Identity & Consent (Signzy, Persona)
  - 💳 Payment & FinTech (Razorpay, Stripe)
  - 📊 Tax & Compliance (Stripe Tax, Avalara)
  - ⚖️ Legal & Trust (Leegality, DocuSign)
  - 🏗️ Inspection & Quality (PropMubi Inspection)
  - 📈 **Market Intelligence** (Knight Frank, JLL, Anarock)
- 📊 **Metrics**: Commission invariant, Protected leads count

**Demo Script**:
1. Open agent CRM
2. Show "Quick Stats" → Protected Leads, Commission Invariant
3. **Click "🧩 Service Hub" tab**
4. Scroll through service categories
5. Point to "Market Intelligence" → "Knight Frank, JLL, Anarock, PropEquity"
6. Explain: "Agents become trust orchestrators, not just lead generators"

**Key Talking Points**:
- "One Lead · One Advisor · One Price - no lead overlap"
- "Agents can fulfill KYC, Legal, Tax services directly from the platform"
- "We integrated Market Intelligence from Knight Frank and JLL for micro-market insights"

---

## 🎬 **30-SECOND ELEVATOR PITCH**
> "PropMubi is the canonical System of Truth for India's $1 Trillion real estate market. We eliminate information asymmetry by digitizing every square foot, every artifact, and every transaction. Buyers get verified trust in 48 hours instead of 6 months. Builders get master control over inventory. Agents become trust orchestrators. We're building the infrastructure for informed consent in real estate."

---

## 🔑 **KEY STATS TO MEMORIZE**
- **Market**: $1T by 2030 (Knight Frank)
- **CAC**: ₹8,500 per buyer
- **LTV**: ₹1,85,000 per buyer
- **LTV:CAC**: 21.7x (best-in-class)
- **Payback**: 4.2 months
- **Gross Margin**: 78%
- **TAM**: $1 Trillion
- **SAM**: $120 Billion
- **SOM**: $2.4 Billion (Year 5)
- **Time-to-Trust**: 48 hours (vs. 6 months traditional)
- **Inventory Accuracy**: 98.5% (vs. 62% for portals)

---

## ⚡ **QUICK NAVIGATION CHECKLIST**

Before your demo, verify these URLs work:

- [ ] http://localhost:3005/pitch ← Investor pitch deck
- [ ] http://localhost:3005/consumer ← Consumer dashboard
- [ ] http://localhost:3005/projects/100 ← Project with Trust & Audit
- [ ] http://localhost:3005/builder ← Builder inventory staging
- [ ] http://localhost:3005/agent ← Agent CRM & Service Hub
- [ ] http://localhost:8000/docs ← API documentation (optional)

---

## 🎯 **DEMO TIMING (15 minutes)**
1. **Pitch Deck** (3 min) - Set the context, show TAM/SAM/CAC/LTV
2. **Consumer Trust & Audit** (4 min) - The differentiator, show Confidence Mode
3. **Builder Inventory Staging** (3 min) - Show master control & Audit IDs
4. **Agent Service Hub** (3 min) - Show Market Intelligence integration
5. **Q&A** (2 min) - VC Grill responses

---

## 🚨 **POTENTIAL QUESTIONS & ANSWERS**

**Q: How do you compete with 99acres?**  
A: We own the **Transaction Intent**, they own the **Search Query**. We don't just list; we verify, lock, and fulfill. Our buyers are 10x more qualified.

**Q: What's your data moat?**  
A: Our **Artifact Database** of verified specs (electrical, plumbing, title deeds) is uncopiable. Each property requires 40+ hours of schema mapping.

**Q: How do you scale builder adoption?**  
A: We position as the **System of Record** for premium builders. They adopt us to justify premium pricing to HNI/institutional buyers.

---

**🎉 YOU'RE READY FOR YOUR DEMO!**

*PropMubi: Building the Future of Truth in Real Estate*
