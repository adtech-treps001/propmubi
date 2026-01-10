# 🔗 TRUST OS INTEGRATION ARCHITECTURE

**Purpose**: Connect external truth sources to build canonical buyer/property profiles  
**Principle**: Never store raw sensitive data, only derived assertions and consent logs

---

## 1. IDENTITY VERIFICATION INTEGRATIONS

### 1.1 Aadhaar (UIDAI)
**Provider**: Aadhaar e-KYC API  
**Use Case**: Verify buyer/agent identity  
**Data Captured**:
- Name
- Date of Birth
- Address
- Photo (hashed reference)

**Flow**:
1. User enters Aadhaar number
2. OTP sent to registered mobile
3. Consent captured
4. Data retrieved via e-KYC XML
5. Store: `identity_verified: true` (not the raw data)

**Compliance**: UIDAI regulations, consent mandatory

---

### 1.2 PAN Verification
**Provider**: Income Tax e-Filing API / NSDL  
**Use Case**: Validate PAN for property transactions  
**Data Captured**:
- PAN Number
- Name (match with Aadhaar)
- Status (Active/Inactive)

**Flow**:
1. User inputs PAN
2. API validates format + status
3. Store: `pan_verified: true`, `pan_hash`

---

### 1.3 Voter ID / Driving License (Optional)
**Provider**: DigiLocker API  
**Use Case**: Additional identity proof  
**Integration**: Fetch via DigiLocker with user consent

---

## 2. FINANCIAL PROFILE INTEGRATIONS

### 2.1 CIBIL / Credit Score
**Provider**: TransUnion CIBIL API  
**Use Case**: Assess loan eligibility  
**Data Captured**:
- Credit Score (Score only, not full report unless paid tier)
- Outstanding Loans (count, not details)

**Flow**:
1. User consents to credit check
2. PropMubi calls CIBIL API with PAN
3. Response: `{"score": 750, "category": "GOOD"}`
4. Store: `credit_score`, `last_checked_date`

**Privacy**: Full report only shown to user, not stored

**Cost**: ₹50-100 per check (pass cost to Tier 2+ buyers)

---

### 2.2 Account Aggregator (Salary Verification)
**Provider**: Sahamati AA Framework (PhonePe, CAMS, Finvu)  
**Use Case**: Verify monthly income/salary  
**Data Captured**:
- Average Monthly Credit (last 6 months)
- Employer Name (if salary account detected)

**Flow**:
1. User links bank account via AA
2. Consent for 6-month statement read
3. PropMubi computes: `monthly_surplus_band` (e.g., "20k-40k")
4. Store: Band only, never raw transactions

**Compliance**: RBI AA guidelines, consent expires in 90 days

---

### 2.3 Mutual Fund Holdings
**Provider**: CAMS / Karvy API  
**Use Case**: Asset verification for down payment  
**Data Captured**:
- Total MF Holdings Value
- Liquid Funds (available for withdrawal)

**Flow**:
1. User provides PAN + consent
2. Fetch folio data from registrar
3. Store: `liquid_assets_band` (e.g., "10L-25L")

---

### 2.4 Existing Property Holdings
**Provider**: Sub-Registrar Office APIs (State-wise)  
**Use Case**: Verify existing property ownership  
**Data Captured**:
- Property count
- Locations (city-level, not exact address)

**Flow**:
1. User provides PAN
2. Query land records portal
3. Store: `existing_properties_count`, `cities`

**Limitation**: Not all states have open APIs (manual fallback)

---

### 2.5 Buying Power Calculation
**Logic**:
```python
buying_power = (
    (monthly_surplus * 60) +  # 5 years of savings
    (liquid_assets * 0.8) +   # 80% of MF/stocks
    (existing_property_value * 0.5)  # Hypothetical loan against property
) * loan_multiplier(credit_score)

def loan_multiplier(score):
    if score > 750: return 3.5  # 3.5x EMI capacity
    elif score > 650: return 2.5
    else: return 1.5
```

**Output**: `buying_power_range` (e.g., "80L-1.2Cr")  
**Privacy**: Only ranges shown to builder, exact value to buyer

---

## 3. LEGAL & PROPERTY INTEGRATIONS

### 3.1 RERA Portal Scrapers
**Target States**: Telangana, Karnataka, Maharashtra, Delhi NCR  
**Scraping Method**: Playwright + Scheduled Jobs  
**Data Extracted**:
- Project Registration Number
- Builder Name
- Approval Date
- Carpet Area vs Saleable Area
- Completion Timeline
- Complaints Filed

**Storage**: Indexed in ElasticSearch for fast search

**Update Frequency**: Weekly (RERA data rarely changes mid-project)

---

### 3.2 Land Records / EC (Encumbrance Certificate)
**Provider**: State Registration Department APIs  
**Use Case**: Verify land title for projects  
**Data Extracted**:
- Ownership Chain (last 13 years for EC)
- Mortgages/Liens
- Court Cases (if linked)

**Manual Fallback**: If API unavailable, upload PDF → OCR extraction

---

### 3.3 Court Case Database
**Provider**: eCourts Services (National Judicial Data Grid)  
**Use Case**: Check litigation against builder/project  
**Data Extracted**:
- Case Number
- Parties Involved
- Case Status (Pending/Disposed)
- Case Type (Consumer Dispute, Breach of Contract, etc.)

**Linkage Logic**:
```python
if builder_name in case_parties or project_name in case_title:
    flag_case()
```

**Output**: Legal Risk Score deduction

---

### 3.4 Legal Document Mind Map
**Purpose**: Visualize document dependency chains  
**Example**:
```
Land Title Deed
├── Sale Deed (Seller → Builder)
│   └── EC (No encumbrance)
├── Conversion Certificate (Agri → Non-Agri)
├── Layout Approval (DTCP/BDA)
└── RERA Certificate
    ├── Builder PAN
    ├── Architect License
    └── Completion Timeline
```

**UI**: Interactive D3.js graph showing document linkages  
**Color Coding**:
- Green: Verified
- Yellow: Pending
- Red: Missing/Expired

---

### 3.5 Legal RAG (Retrieval-Augmented Generation)
**Use Case**: Answer buyer questions about legal documents  
**Example Query**: "Is the EC clear for this project?"  
**Response**: "Yes. The Encumbrance Certificate dated 2023-11-15 shows no mortgages or liens for the last 13 years. Source: [EC_Link]"

**Architecture**:
1. **Vector DB**: Store embeddings of all legal docs
2. **Sarvam LLM**: Generate explainable answers
3. **Citation Enforcement**: Every answer must link source

**Critical Rule**: If doc is missing → "I don't have this document. Request from builder."

---

## 4. SOCIAL & REPUTATION INTEGRATIONS

### 4.1 Google Reviews Scraper
**Target**: Builder's Google My Business pages  
**Extraction**:
- Star Rating
- Review Count
- Recent Themes (via GPT summarization)

**Storage**: Aggregated sentiment, not individual reviews

---

### 4.2 Forum Monitoring (Read-Only)
**Targets**: Reddit (r/india, r/bangalore), Twitter, SkyscraperCity  
**Method**: Keyword alerts for builder/project names  
**Output**: Theme-based summary (e.g., "15 mentions of delivery delay")

**No Auto-Posting**: Platform remains read-only observer

---

## 5. INFRASTRUCTURE & FUTURE DEVELOPMENT

### 5.1 Satellite Data (ISRO Bhuvan / Google Earth Engine)
**Use Case**: Monitor construction progress  
**Data**:
- Project boundary polygon
- Monthly satellite snapshots
- Change detection (new towers appearing)

**Output**: "Construction Progress: 65% Complete (based on roof area)"

---

### 5.2 Master Plan APIs
**Provider**: State Urban Development Authorities  
**Data**:
- Proposed Metro Lines
- SEZ boundaries
- Flyover timelines

**Visualization**: Overlay on map with "Expected by 2028" labels

---

## 6. INTEGRATION SECURITY & COMPLIANCE

### 6.1 Consent Management
- Every integration requires explicit user consent
- Consent stored with:
  - Timestamp
  - Purpose (e.g., "Loan eligibility check")
  - Expiry (90 days default)
- User can revoke consent anytime

### 6.2 Data Minimization
**Rule**: Store **assertions**, not raw data

**Examples**:
- ❌ Store: Bank statement PDF
- ✅ Store: `monthly_surplus_band: "30k-50k"`

- ❌ Store: CIBIL full report
- ✅ Store: `credit_score: 760`, `last_checked: 2026-01-09`

### 6.3 API Rate Limits & Costs

| Integration | Cost/Call | Rate Limit | Monthly Budget |
|-------------|-----------|------------|----------------|
| Aadhaar e-KYC | ₹5 | 1000/day | ₹150k |
| CIBIL | ₹75 | 500/day | ₹37.5k |
| Account Aggregator | Free (user pays bank) | N/A | - |
| PAN Verification | ₹2 | Unlimited | ₹20k |
| RERA Scraping | Free | Self-hosted | - |
| eCourts | Free | 100/min | - |

**Strategy**: Pass CIBIL cost to Tier 2+ buyers (₹100 fee for "Confidence Report")

---

## 7. IMPLEMENTATION PHASES

### Phase 1 (Month 1): Identity
- ✅ Aadhaar e-KYC
- ✅ PAN Verification
- ✅ DigiLocker (DL/Voter ID)

### Phase 2 (Month 2): Financial
- ✅ CIBIL Integration
- ✅ Account Aggregator (Sahamati)
- Mock MF/Property APIs

### Phase 3 (Month 3): Legal
- ✅ RERA Scrapers (3 states)
- ✅ eCourts API
- Legal Mind Map UI

### Phase 4 (Month 4): Advanced
- Satellite Change Detection
- Master Plan Overlay
- Social Sentiment Engine

---

## 8. UI/UX FOR INTEGRATIONS

### Buyer Financial Profile Page (`/profile/financial`)
```
┌────────────────────────────────────────┐
│ 🏦 Financial Confidence Score: 82/100 │
├────────────────────────────────────────┤
│ ✅ Identity Verified (Aadhaar + PAN)  │
│ ✅ Credit Score: 760 (Excellent)       │
│ ✅ Monthly Surplus: ₹40k-60k          │
│ ✅ Liquid Assets: ₹15L-25L            │
│ ⚠️ Existing Loans: 1 (Car Loan)       │
├────────────────────────────────────────┤
│ 💰 Buying Power: ₹80L - ₹1.2Cr       │
│ 🏠 Recommended Budget: ₹90L - ₹1Cr    │
└────────────────────────────────────────┘
```

### Legal Mind Map (`/projects/[id]/legal/mindmap`)
- D3.js interactive graph
- Click node to view document
- Hover to see status/date

---

**Next Steps**: Implement Phase 1 (Identity) in Week 1 of Phase 4.
