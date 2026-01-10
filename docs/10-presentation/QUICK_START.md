# PropMubi Demo - Quick Start Guide

## 🚀 **RESTART COMMANDS** (Run These Now)

### Step 1: Clear Cache & Restart Frontend
```powershell
# In Terminal 1 (or restart your existing npm terminal)
cd c:\projects\propmubi\apps\web
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
npm run dev
```

**Wait for**: `✓ Ready on http://localhost:3005`

### Step 2: Verify Backend is Running
```powershell
# Check if port 8000 is listening
Test-NetConnection localhost -Port 8000
```

If backend is NOT running, start it:
```powershell
# In Terminal 2
cd c:\projects\propmubi
python -m uvicorn apps.api.main:app --reload --port 8000 --host 0.0.0.0
```

---

## ✅ **AFTER RESTART - VERIFY THESE 2 PAGES**

### Page 1: Agent Service Hub
1. Open browser: `http://localhost:3005/agent`
2. Page should load with "Advisor Command Center" header
3. Click "🧩 Service Hub" tab
4. Scroll down to see "📈 Market Intelligence" card
5. Verify partners shown: Knight Frank, JLL, Anarock, PropEquity, Liases Foras

**If working**: ✅ Page 1 READY

### Page 2: Project Trust & Audit  
1. Open browser: `http://localhost:3005/projects/100`
2. Page should load with "My Home Sayuk" title
3. Click "🛡️ Trust & Audit" tab
4. Verify sections visible: Vastu, Legal, RERA

**If working**: ✅ Page 2 READY

---

## 🎬 **YOUR 10-MINUTE DEMO SCRIPT**

### **INTRO (30 seconds)**
> "PropMubi is building the Trust OS for India's $1 Trillion real estate market. We're creating a Network Effect by bringing all professionals and digital tools into one canonical system."

### **PART 1: Agent Service Hub (3 minutes)**

**Navigate to**: `http://localhost:3005/agent`

**Show**:
1. Click "Service Hub" tab
2. Point to service categories:
   - Communication & Bots (Gupshup, MSG91)
   - Identity & Consent (Signzy, Persona)
   - Payment & FinTech (Razorpay, Stripe)
   - Tax & Compliance (Stripe Tax, Avalara)
   - Legal & Trust (Leegality, DocuSign)
   - Inspection & Quality

3. **Highlight Market Intelligence**:
   > "Most importantly, we've partnered with **Knight Frank, JLL, and Anarock** - the top research firms in India. This gives advisors access to verified micro-market intelligence, not just listings."

**Key Point**:
> "Agents become trust orchestrators, not just lead generators. One Lead · One Advisor · One Price · One Truth."

---

### **PART 2: Project Trust & Audit (4 minutes)**

**Navigate to**: `http://localhost:3005/projects/100`

**Show**:
1. Click "Trust & Audit" tab
2. Expand Vastu section:
   > "We provide room-by-room Vastu compliance analysis with directional energy mapping"

3. Show Legal Audit:
   > "Title search verification - buyers know the property is legally clear before booking"

4. Show RERA Compliance:
   > "Real-time RERA registration status - complete transparency"

5. Click "Tech Specs" tab:
   > "We go down to electrical and plumbing schemas - showing branded components like Legrand switches and Kohler fixtures"

**Key Point**:
> "This level of transparency doesn't exist anywhere else. Buyers normally spend 6 months doing individual due diligence. We give them verified trust in **48 hours**."

---

### **PART 3: Business Model (2 minutes)**

**State Key Stats**:
- **Market Size**: $1 Trillion by 2030 (Knight Frank India)
- **CAC**: ₹8,500 per verified buyer
- **LTV**: ₹1,85,000 per buyer (3-year horizon)
- **LTV:CAC Ratio**: **21.7x** (best-in-class for PropTech)
- **Payback**: 4.2 months (vs. 18 months for listing portals)

**Revenue Streams**:
1. 0.5-1% commission on bookings via "Confidence Mode"
2. 15-25% revenue share from service partners (Signzy, Razorpay, etc.)
3. Builder SaaS subscriptions (₹50K-2L monthly)
4. Premium market intelligence data to PE funds

> "This multi-sided revenue model gives us 78% gross margins and a capital-efficient growth path to $100M ARR by Year 5."

---

### **PART 4: VC Q&A (30 seconds)**

**Q: How do you compete with 99acres?**
> "We own the **Transaction Intent**, they own the Search Query. Our buyers are 10x more qualified because they've already verified all trust artifacts."

**Q: What's your data moat?**
> "Our **Artifact Database**. Each property requires 40+ hours of schema mapping. Generic portals can't replicate this."

**Q: Builder adoption strategy?**
> "We position as the **System of Record** for premium builders. They use us to justify premium pricing to HNI and institutional buyers."

---

## 📊 **STATS CHEAT SHEET** (Print This)

| Metric | Value |
|--------|-------|
| **Market (TAM)** | $1 Trillion by 2030 |
| **SAM** | $120 Billion (Tier 1/2 cities) |
| **SOM (Year 5)** | $2.4 Billion |
| **CAC** | ₹8,500 |
| **LTV** | ₹1,85,000 |
| **LTV:CAC** | **21.7x** |
| **Payback** | 4.2 months |
| **Gross Margin** | 78% |
| **Time-to-Trust** | 48 hours |
| **Year 3 ARR** | $24M |
| **Year 5 ARR** | $100M |

---

## 🎯 **DEMO DAY CHECKLIST**

**Before Demo**:
- [ ] Both terminals running (frontend port 3005, backend port 8000)
- [ ] `.next` cache cleared
- [ ] Test both pages load properly
- [ ] Have this script open in second monitor
- [ ] Browser bookmarks ready:
  - `http://localhost:3005/agent`
  - `http://localhost:3005/projects/100`

**During Demo**:
- [ ] Start with Agent Service Hub (your newest feature)
- [ ] Highlight Market Intelligence integration
- [ ] Show Trust & Audit tab on Project Details
- [ ] State the 21.7x LTV:CAC ratio
- [ ] Answer questions confidently

**Backup Plan**:
- [ ] If pages freeze, have `docs/10-presentation/pitch_deck.md` open
- [ ] If internet/demo fails, show API Swagger docs at `http://localhost:8000/docs`
- [ ] Reference schema files in `docs/schemas/`

---

**🎉 YOU'RE READY TO DEMO!**

*PropMubi: The Trust OS for India's $1 Trillion Real Estate Market*
