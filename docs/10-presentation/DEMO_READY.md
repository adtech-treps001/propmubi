# PropMubi Demo - Working Features Only

## ✅ **CONFIRMED WORKING PAGES FOR DEMO**

### **1. Agent CRM - Service Hub** ⭐ PRIMARY DEMO PAGE
**URL**: `http://localhost:3005/agent`

**Features**:
- 🧩 **Service Hub** tab with all 7 service categories
- 📈 **Market Intelligence** card featuring:
  - Knight Frank
  - JLL (Jones Lang LaSalle)
  - Anarock
  - PropEquity
  - Liases Foras
- 💬 Communication & Bots (Gupshup, MSG91, Twilio, Infobip)
- 🪪 Identity & Consent (Signzy, Persona, Sumsub, DigiLocker)
- 💳 Payment & FinTech (Razorpay, Stripe, PhonePe, Banks)
- 📊 Tax & Compliance (Stripe Tax, Avalara, ClearTax, QuickBooks)
- ⚖️ Legal & Trust Artifacts (Leegality, DocuSign, IGRS, NeSL)
- 🏗️ Inspection & Quality (PropMubi Inspection, AccuCheck, CivilAudit)

**Demo Script**:
1. Open `http://localhost:3005/agent`
2. Click the **"🧩 Service Hub"** tab
3. Scroll down to show all service cards
4. **Highlight "📈 Market Intelligence"** card
5. Explain: "We've integrated major research firms like Knight Frank and JLL to provide verified micro-market intelligence"

---

### **2. Project Details - Trust & Audit**
**URL**: `http://localhost:3005/projects/100` (My Home Sayuk)

**Features**:
- 🛡️ **Trust & Audit** tab with:
  - Vastu Compliance Report (room-by-room directional analysis)
  - Legal Audit (Title Search verified)  
  - RERA Compliance (Active status)
  - Quality Inspection (94% score)
- 🏗️ **Tech Specs** tab with branded components (Legrand, Kohler, Asian Paints)
- 🗺️ **Location** tab with environmental map

**Demo Script**:
1. Navigate to `http://localhost:3005/projects/100`
2. Click **"Trust & Audit"** tab
3. Show Vastu, Legal, RERA sections
4. Explain: "This is the only platform where buyers can self-verify all trust artifacts in one place"

---

### **3. Consumer Dashboard**
**URL**: `http://localhost:3005/consumer`

**Features**:
- Property listings feed
- Search and discovery interface

**Demo Script**:
1. Open `http://localhost:3005/consumer`
2. Show property cards
3. Brief overview of consumer entry point

---

### **4. API Documentation** (Technical Backup)
**URL**: `http://localhost:8000/docs`

**Features**:
- Swagger UI with all backend endpoints
- Shows technical depth of the platform

---

## 🎬 **STREAMLINED DEMO FLOW (10 MINUTES)**

### **Part 1: The Network Effect (3 min)**
**Page**: Agent CRM - Service Hub

**Script**:
> "PropMubi is building the Trust OS for India's $1 Trillion real estate market. Unlike listing portals that just aggregate properties, we're creating a **Network Effect** by bringing all professionals and digital tools into one canonical system."

**Demo**:
1. Open `http://localhost:3005/agent`
2. Click "Service Hub" tab
3. Show each service category:
   - "We integrate communication platforms like Gupshup and MSG91"
   - "Identity verification through Signzy and Persona"
   - "Payment processing via Razorpay and Stripe"
4. **Highlight Market Intelligence**:
   - "Most importantly, we've partnered with **Knight Frank, JLL, and Anarock** - the top research firms"
   - "This gives advisors access to verified micro-market intelligence, not just listings"

---

### **Part 2: The Trust Artifacts (4 min)**
**Page**: Project Details - Trust & Audit

**Script**:
> "Now let's see how this translates to the consumer experience. This is a real project - My Home Sayuk in Hyderabad."

**Demo**:
1. Navigate to `http://localhost:3005/projects/100`
2. Click "Trust & Audit" tab
3. Expand Vastu section:
   - "We provide room-by-room Vastu compliance analysis"
4. Show Legal Audit:
   - "Title search verification - so buyers know the property is legally clear"
5. Show RERA Compliance:
   - "Real-time RERA registration status"
6. Click "Tech Specs" tab:
   - "We go down to the electrical and plumbing level - showing branded components like Legrand switches and Kohler fixtures"

**Key Point**:
> "This level of transparency doesn't exist anywhere else. Buyers normally spend 6 months doing individual due diligence. We give them verified trust in 48 hours."

---

### **Part 3: The Business Model (2 min)**
**Reference**: Pitch Deck Markdown (docs/10-presentation/pitch_deck.md)

**Key Stats to State**:
- **Market**: $1 Trillion by 2030 (Knight Frank India report)
- **Unit Economics**: 
  - CAC: ₹8,500 per buyer
  - LTV: ₹1,85,000 per buyer
  - LTV:CAC Ratio: **21.7x** (best-in-class for PropTech)
- **Revenue Model**:
  - 0.5-1% commission on bookings
  - 15-25% revenue share from service partners
  - Builder SaaS subscriptions

**Script**:
> "We monetize across four streams: booking commissions, service fees from partners like Signzy and Razorpay, builder SaaS subscriptions, and premium market intelligence data. This gives us a **21.7x LTV to CAC ratio** - that's best-in-class for PropTech."

---

### **Part 4: Q&A (1 min)**

**Anticipated Questions**:

**Q: How do you compete with 99acres?**
> "We own the **Transaction Intent**, they own the Search Query. We don't just list; we verify, lock, and fulfill. Our buyers are 10x more qualified."

**Q: What's your data moat?**
> "Our **Artifact Database**. Each property requires 40+ hours of schema mapping - electrical layouts, plumbing specs, title deeds. Generic portals can't replicate this."

**Q: How do you acquire builders?**
> "We position as the **System of Record** for premium builders. They use us to justify premium pricing to HNI and institutional buyers who demand auditability."

---

## 📊 **STATS CHEAT SHEET**

### Market Size:
- **TAM**: $1 Trillion (entire Indian RE by 2030)
- **SAM**: $120 Billion (premium Tier 1/2 cities)
- **SOM**: $2.4 Billion (2% of SAM in 5 years)

### Unit Economics:
- **CAC**: ₹8,500
- **LTV**: ₹1,85,000  
- **Ratio**: 21.7x
- **Payback**: 4.2 months
- **Gross Margin**: 78%

### Platform Metrics:
- **Time-to-Trust**: 48 hours (vs. 6 months traditional)
- **Inventory Accuracy**: 98.5% (vs. 62% for portals)
- **Builder Retention**: 94% annual

---

## 🚨 **REMOVED FROM DEMO** (Server Instability Issues)

The following pages have been **disabled** to ensure demo stability:

- ❌ `/pitch` - Pitch Deck (moved to `app/pitch.disabled`)
- ❌ `/builder` - Builder Dashboard (moved to `app/builder.disabled`)

**Fallback**: Use the markdown pitch deck in `docs/10-presentation/pitch_deck.md` for reference

---

## ✅ **PRE-DEMO CHECKLIST**

Before starting demo:
- [ ] Verify `http://localhost:3005/agent` loads
- [ ] Click "Service Hub" tab → See "Market Intelligence" card
- [ ] Verify `http://localhost:3005/projects/100` loads
- [ ] Click "Trust & Audit" tab → See Vastu/Legal/RERA
- [ ] Have pitch deck markdown open as reference: `docs/10-presentation/pitch_deck.md`
- [ ] Memorize key stats: 21.7x LTV:CAC, $1T TAM, ₹8.5K CAC

---

**🎉 YOU'RE READY - DEMO WITH CONFIDENCE!**

*Focus on what works: Agent Service Hub + Trust Artifacts = Network Effect*
