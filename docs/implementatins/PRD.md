# Product Requirements Document (PRD)
# Propmubi - Real Estate Super App

**Version:** 1.0  
**Date:** November 2024  
**Owner:** Product Team  
**Status:** Active Development

---

## 1. Executive Summary

### 1.1 Vision
Transform Indian real estate from an opaque, inefficient market into a transparent, data-driven ecosystem where every transaction is fast, fraud-free, and financially optimized.

### 1.2 Mission
Reduce property transaction time from months to days, and due diligence from weeks to seconds through AI-powered automation and comprehensive data aggregation.

### 1.3 Core Philosophy
**"Pay to Play" = Intent Signal**  
Use micro-payments to filter serious buyers/sellers, eliminate time-wasters, and create a high-quality marketplace.

---

## 2. Target Users

### Primary Personas

**Persona 1: The Busy Investor (NRI/HNI)**
- **Demographics**: 30-50 years, IT professional, living abroad
- **Pain Points**: 
  - Cannot physically visit properties
  - Fear of encroachment
  - Unclear market valuations
  - Document management hassles
- **Goals**: Passive real estate income, capital appreciation
- **Quote**: "I own land in Hyderabad but live in California. Is someone building on my plot?"

**Persona 2: The First-Time Homebuyer**
- **Demographics**: 25-35 years, IT/corporate job, high CIBIL
- **Pain Points**:
  - Don't understand legal paperwork
  - Fear of buying disputed property
  - No time for multiple site visits
- **Goals**: Own a home, avoid fraud, get best deal
- **Quote**: "I want to buy a flat, but I don't trust brokers."

**Persona 3: The Small Builder/Developer**
- **Demographics**: 40-60 years, 5-20 projects completed
- **Pain Points**:
  - High CAC (Customer Acquisition Cost)
  - Manual sales operations
  - Difficult to prove credibility
- **Goals**: Sell inventory faster, build trust
- **Quote**: "I spend ₹50L on marketing but still rely on brokers."

**Persona 4: The Rental Tenant (Young Professional)**
- **Demographics**: 22-30 years, relocating for job
- **Pain Points**:
  - 6-month deposit requirement
  - Deposit disputes during move-out
  - Fraudulent landlords
- **Goals**: Low deposit, hassle-free rental
- **Quote**: "I have a CIBIL score of 800 but still need to pay 6 months deposit?"

**Persona 5: The RWA President (Community Leader)**
- **Demographics**: 35-60 years, gated community resident
- **Pain Points**:
  - Managing 200+ WhatsApp messages daily
  - Collecting maintenance fees
  - Organizing community voting
- **Goals**: Streamline operations, reduce conflicts
- **Quote**: "I spend 2 hours daily managing society WhatsApp groups."

---

## 3. Problem Statement

### 3.1 Current Market Problems

| Problem | Impact | Propmubi Solution |
|---------|--------|-------------------|
| **Opacity** | 60% of buyers fear fraud | RERA + Dharani verification (12s) |
| **Time Waste** | 3-6 months to close deal | Token system filters 90% junk leads |
| **Due Diligence** | Costs ₹50K, takes 3 weeks | Automated aggregation (Free, 12s) |
| **NRI Blindness** | Cannot monitor property | Satellite monitoring (₹499/mo) |
| **Deposit Lock-in** | ₹3L locked for tenants | Score-based deposit (CIBIL > 750 = 1 month) |
| **Broker Monopoly** | 2% commission on both sides | Owner-direct + verification = 0% |

### 3.2 Market Size

**India Real Estate Market:**
- **Total Size**: $180 billion (2024)
- **Residential**: $120 billion
- **Commercial**: $40 billion
- **Land**: $20 billion

**Propmubi TAM (Total Addressable Market):**
- **Primary**: Property transactions (₹10Cr/year revenue potential)
- **Secondary**: Lifecycle services for 5Cr existing homeowners (₹50Cr/year)
- **Tertiary**: Community management for 10L gated communities (₹120Cr/year)

---

## 4. Core Features & Requirements

### 4.1 Buy/Sell Module

#### Feature: Due Diligence Automation
**Priority**: P0 (Must Have)

**User Story:**  
*As a buyer, I want to verify a property's legal status in seconds so that I can avoid fraud.*

**Acceptance Criteria:**
- [ ] Aggregates data from RERA, Dharani, MeeBhoomi
- [ ] Completes verification in < 60 seconds
- [ ] Generates PDF report with score (0-100)
- [ ] Highlights red flags (litigation, encroachment)
- [ ] Costs ₹0 for first 3 reports, then ₹99 per report

**Technical Requirements:**
- API integrations: RERA (13 states), Dharani (Telangana), MeeBhoomi (AP)
- Scraping frequency: Daily for RERA updates
- Report storage: S3 with 5-year retention
- Performance: < 15s for 95th percentile

**Success Metrics:**
- 10,000 reports generated/month
- 4.5+ star rating on "Trust Score" accuracy
- 90% reduction in due diligence time

---

#### Feature: Token of Interest
**Priority**: P0 (Must Have)

**User Story:**  
*As a buyer, I want to lock a property for 24 hours by paying ₹5,000 so that the seller stops showing it to others.*

**Acceptance Criteria:**
- [ ] Payment via Razorpay (UPI, Cards, Netbanking)
- [ ] Property hidden from search for 24 hours
- [ ] Seller notified immediately
- [ ] 100% refundable if not sold within 24h
- [ ] Non-refundable if buyer backs out after acceptance

**Technical Requirements:**
- Payment gateway: Razorpay
- Refund automation: Cron job checks status at 24h mark
- Notification: Push + SMS + Email
- Database: Transaction log with audit trail

**Success Metrics:**
- 500 tokens paid/month
- 70% conversion to site visit
- 40% conversion to final sale

---

### 4.2 Rental Module

#### Feature: Score-Based Deposit
**Priority**: P1 (Should Have)

**User Story:**  
*As a tenant with CIBIL 800+, I want to pay only 1 month deposit instead of 6 months so that I can save cash.*

**Acceptance Criteria:**
- [ ] Integrates with Experian for CIBIL score
- [ ] Requires user consent (AA Framework)
- [ ] CIBIL > 750 = 1 month deposit
- [ ] CIBIL 650-750 = 2 months deposit
- [ ] CIBIL < 650 = 6 months deposit (standard)
- [ ] Employment verification via LinkedIn API or Work Email

**Technical Requirements:**
- API: Experian Credit Score API
- Verification: LinkedIn OAuth + Email domain lookup
- Guarantee: Propmubi holds escrow for low-deposit cases
- Insurance: Partner with Bajaj Allianz for default coverage

**Success Metrics:**
- 5,000 tenants save ₹10L collectively/month
- < 2% default rate
- 4.8+ NPS from tenants

---

#### Feature: AI Move-In/Out Inspection
**Priority**: P1 (Should Have)

**User Story:**  
*As a tenant, I want to document the flat's condition on move-in day so that I get 100% deposit back on move-out.*

**Acceptance Criteria:**
- [ ] Camera integration (React Native Vision Camera)
- [ ] AI detects room type automatically
- [ ] AI detects damage (cracks, stains, dents)
- [ ] Report stored on IPFS (immutable)
- [ ] Move-out comparison shows new damage only
- [ ] Generates settlement amount automatically

**Technical Requirements:**
- ML Model: TensorFlow Lite (on-device)
- Vision API: Google Cloud Vision (backup)
- Storage: IPFS for tamper-proof reports
- Native Module: Camera processing (Kotlin/Swift)

**Success Metrics:**
- 0 deposit disputes (target)
- 95% accuracy in damage detection
- 3-minute inspection time

---

### 4.3 Commercial Module

#### Feature: Footfall Heatmap
**Priority**: P2 (Nice to Have)

**User Story:**  
*As a franchise owner, I want to see which street has the highest footfall so that I can choose the best location.*

**Acceptance Criteria:**
- [ ] Aggregates Swiggy/Zomato order data
- [ ] Shows demographics (age, income, occupation)
- [ ] Generates heat map visualization
- [ ] Provides location score (0-100)
- [ ] Recommendations (e.g., "Great for coffee shop")

**Technical Requirements:**
- APIs: Swiggy Partner API, Zomato Partner API
- Census: Census India API
- Visualization: Mapbox heatmap layer
- Caching: Redis (24h TTL)

**Success Metrics:**
- 200 reports sold/month at ₹5,000 each
- 80% client satisfaction
- 50% clients proceed to lease

---

### 4.4 Land & JV Module

#### Feature: Joint Venture Matchmaking
**Priority**: P1 (Should Have)

**User Story:**  
*As a landowner, I want to find a verified builder for JV so that I can develop my land without upfront capital.*

**Acceptance Criteria:**
- [ ] Land title verification via Dharani
- [ ] Builder trust score (based on past projects)
- [ ] Bidding system for builders
- [ ] Standard digital JV agreement
- [ ] Milestone-based escrow

**Technical Requirements:**
- Land verification: Dharani API
- Builder verification: RERA project history scraper
- Contract: DocuSign integration
- Escrow: Smart contract (Polygon blockchain)

**Success Metrics:**
- 50 JV matches/year
- 2% success fee = ₹50L/year revenue
- 0 fraud cases

---

### 4.5 Auction Module

#### Feature: Bank Auction Scraper
**Priority**: P2 (Nice to Have)

**User Story:**  
*As an investor, I want alerts for properties being auctioned below market price so that I can flip them.*

**Acceptance Criteria:**
- [ ] Scrapes IBAPI, SBI, HDFC, DRT
- [ ] Daily updates
- [ ] Push notifications for 20%+ discount properties
- [ ] Due diligence report included
- [ ] Premium subscription (₹999/mo)

**Technical Requirements:**
- Scraping: Puppeteer (headless Chrome)
- Frequency: Daily at 6 AM
- Storage: MongoDB (auctions collection)
- Notifications: Firebase Cloud Messaging

**Success Metrics:**
- 1,000 premium subscribers
- ₹10L MRR
- 30% of users close deals

---

### 4.6 Lifecycle Module

#### Feature: Satellite Monitoring
**Priority**: P1 (Should Have)

**User Story:**  
*As an NRI, I want weekly satellite images of my plot so that I know if someone encroached it.*

**Acceptance Criteria:**
- [ ] Weekly satellite image from Sentinel Hub
- [ ] AI detects changes (construction, digging)
- [ ] Alert if > 15% change detected
- [ ] Monthly report with valuation update
- [ ] Subscription: ₹499/mo

**Technical Requirements:**
- Satellite API: Sentinel Hub
- ML Model: Change detection (TensorFlow)
- Native Module: Image processing (Kotlin/Swift)
- Storage: S3 (historical images)

**Success Metrics:**
- 5,000 NRI subscribers
- ₹25L MRR
- 10 encroachment cases prevented/year

---

### 4.7 Community Module

#### Feature: Digital Notice Board & Voting
**Priority**: P2 (Nice to Have)

**User Story:**  
*As an RWA president, I want digital voting for community decisions so that I don't have to organize physical meetings.*

**Acceptance Criteria:**
- [ ] Create polls with multiple options
- [ ] One vote per unit (verified)
- [ ] Real-time results
- [ ] 50% quorum requirement
- [ ] Auto-close after deadline

**Technical Requirements:**
- Database: MongoDB (polls, votes)
- Real-time: Socket.io
- Verification: Unit number + phone OTP
- Notifications: Push to all residents

**Success Metrics:**
- 500 communities onboarded
- ₹50L MRR (₹99/unit/mo)
- 80% voting participation

---

## 5. Non-Functional Requirements

### 5.1 Performance
- **API Response Time**: < 500ms (95th percentile)
- **Search Results**: < 2s for 10,000+ properties
- **Due Diligence**: < 60s end-to-end
- **Satellite Analysis**: < 30s
- **Mobile App Load**: < 3s on 4G

### 5.2 Security
- **Data Encryption**: AES-256 at rest, TLS 1.3 in transit
- **Payment**: PCI DSS compliant (via Razorpay)
- **Authentication**: JWT with 2FA for sensitive operations
- **API Rate Limiting**: 100 requests/min per user
- **GDPR/CCPA**: Right to delete, data portability

### 5.3 Scalability
- **Users**: Support 1M concurrent users
- **Properties**: 10M+ listings
- **Transactions**: 10,000 simultaneous payments
- **Database**: Horizontal sharding (MongoDB)
- **CDN**: Cloudflare for static assets

### 5.4 Availability
- **Uptime**: 99.9% SLA
- **Disaster Recovery**: RPO < 1 hour, RTO < 4 hours
- **Backups**: Hourly incremental, daily full

### 5.5 Compliance
- **RERA**: All properties must have RERA registration
- **RBI**: Account Aggregator Framework compliance
- **IT Act**: Data localization (India servers)
- **Consumer Protection**: Refund policy clearly stated

---

## 6. Success Metrics (KPIs)

### 6.1 Business Metrics

| Metric | Q1 Target | Q2 Target | Q4 Target |
|--------|-----------|-----------|-----------|
| Monthly Active Users | 50,000 | 200,000 | 1M |
| Gross Merchandise Value | ₹10Cr | ₹50Cr | ₹500Cr |
| Revenue | ₹50L | ₹2Cr | ₹10Cr |
| Transaction Volume | 1,000 | 5,000 | 20,000 |
| Customer Acquisition Cost | ₹500 | ₹300 | ₹150 |
| Lifetime Value | ₹5,000 | ₹10,000 | ₹25,000 |

### 6.2 Product Metrics

| Metric | Target |
|--------|--------|
| Time to Close Deal | < 30 days (from 90 days) |
| Due Diligence Time | < 60s (from 21 days) |
| Fraud Cases | 0 |
| Deposit Disputes | < 5% (from 40%) |
| NPS Score | > 50 |
| Churn Rate | < 5% monthly |

---

## 7. Release Plan

### Phase 1: MVP (Q1 2025)
**Goal:** Validate core hypothesis - "Pay to Play" works

**Features:**
- ✅ Buy/Sell: Property search, RERA verification, Token system
- ✅ Basic due diligence (3 data sources)
- ✅ Payment integration (Razorpay)
- ✅ Mobile app (Android only)
- ✅ Web app (basic)

**Success Criteria:**
- 1,000 registered users
- 100 paid tokens
- 10 successful transactions

---

### Phase 2: Growth (Q2 2025)
**Goal:** Add differentiation through automation

**Features:**
- ✅ Rental module (CIBIL integration, AI inspection)
- ✅ Commercial module (footfall heatmap)
- ✅ iOS app launch
- ✅ 11 data source integrations
- ✅ Satellite monitoring

**Success Criteria:**
- 50,000 users
- ₹2Cr GMV
- 4.5+ app rating

---

### Phase 3: Scale (Q3 2025)
**Goal:** Expand to all property lifecycle stages

**Features:**
- ✅ Land & JV module
- ✅ Auction module
- ✅ Community module
- ✅ Financial marketplace (loan aggregator)
- ✅ International (NRI focus)

**Success Criteria:**
- 200,000 users
- ₹10Cr GMV
- Profitability

---

### Phase 4: Platform (Q4 2025)
**Goal:** Become India's real estate operating system

**Features:**
- ✅ AI recommendations
- ✅ VR property tours
- ✅ Blockchain land registry
- ✅ API platform (B2B)
- ✅ White-label solutions

**Success Criteria:**
- 1M users
- ₹50Cr GMV
- Series A funding

---

## 8. Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **RERA API shutdown** | High | Medium | Multiple fallbacks (web scraping, manual) |
| **Payment fraud** | High | Low | Razorpay fraud detection, manual review > ₹50K |
| **Low adoption** | High | Medium | Aggressive marketing, referral program |
| **Regulatory changes** | Medium | Medium | Legal counsel, compliance team |
| **Competition** | Medium | High | Focus on automation moat, network effects |
| **Technical debt** | Medium | High | 20% time for refactoring, code reviews |

---

## 9. Dependencies

### 9.1 External APIs
- **Critical**: Razorpay, RERA (at least 3 states)
- **Important**: Experian, Dharani, Sentinel Hub
- **Nice to have**: Swiggy, Zomato, LinkedIn

### 9.2 Partnerships
- **Legal**: LegalKart (title reports)
- **Finance**: Setu (account aggregator)
- **Services**: Urban Company (bulk orders)
- **Visuals**: Matterport (3D tours)

### 9.3 Team
- **Engineering**: 5 full-stack, 2 mobile, 2 ML, 1 DevOps
- **Product**: 1 PM, 1 Designer
- **Operations**: 2 customer support, 1 legal
- **Marketing**: 1 growth lead

---

## 10. Open Questions

1. **Pricing**: Should token be ₹5K or ₹10K? (A/B test)
2. **Refunds**: Full refund or 90% (to cover payment gateway fees)?
3. **Verification**: Manual review for > ₹1Cr properties?
4. **Expansion**: Which state after Telangana/AP? (Maharashtra vs Karnataka)
5. **B2B**: Launch API platform in Phase 2 or 3?

---

## Appendix

### A. Competitive Analysis
| Competitor | Strengths | Weaknesses | Our Edge |
|------------|-----------|------------|----------|
| 99acres | Large inventory | No verification | Automated due diligence |
| NoBroker | Zero brokerage | Low trust | Token system filters junk |
| Housing | Good UX | No lifecycle | Full lifecycle management |
| MagicBricks | Brand | No tech innovation | AI + Automation |

### B. User Testimonials (Target)
*"Propmubi saved me ₹5L in brokerage and 2 months of running around for documents."*  
— Raj, Hyderabad

*"As an NRI, I finally have peace of mind. I get weekly satellite images of my land."*  
— Priya, USA

*"We reduced deposit from 6 months to 1 month thanks to our CIBIL score."*  
— Amit & Neha, Bangalore

---

**Document Version Control:**
- v1.0 - Nov 2024 - Initial PRD (Current)
- v0.9 - Oct 2024 - Draft for review
- v0.5 - Sep 2024 - Concept document
