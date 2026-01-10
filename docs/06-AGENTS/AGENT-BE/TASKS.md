# AGENT-BE TASKS

## 📋 Task Priority

### P0 - Critical: Core Trust Infrastructure (Week 1)
**Focus**: Auth, Database Setup, and Basic Property Feed.

#### BE-001: Auth Service & User Consents ⏳
**Ref**: `docs/04-IMPLEMENTATION/SERVICE_CATALOG.md#1-auth-service-port-3001`
- [ ] Implement `users` table with Roles (BUYER, AGENT, BUILDER).
- [ ] Implement `user_consents` table for tracing AA/Bureau permissions.
- [ ] API: `POST /auth/login` (OTP based).

#### BE-002: Property Service & PostGIS ⏳
**Ref**: `docs/04-IMPLEMENTATION/SERVICE_CATALOG.md#2-property-service-port-3002`
- [ ] Implement `projects` and `units` tables with PostGIS configuration.
- [ ] API: `GET /projects/feed` (Geo-spatial query using `ST_DWithin`).

---

### P1 - High Priority: Financial Trust Engine (Week 2)
**Focus**: The "Financial Confidence" logic without raw data storage.

#### BE-003: Financial Profile Service ⏳
**Ref**: `docs/04-IMPLEMENTATION/SERVICE_CATALOG.md#3-financial-trust-service-port-3006`
- [ ] Implement `financial_profiles` and `declared_assets` tables.
- [ ] Service Logic: `calculate_confidence_score(income_band, credit_score, asset_value)`.
- [ ] Integration: Mock Account Aggregator response handler.

#### BE-004: Builder Reputation Logic ⏳
**Ref**: `docs/04-IMPLEMENTATION/SERVICE_CATALOG.md#5-builder-reputation-service-port-3012`
- [ ] Implement `builder_scores` calculation.
- [ ] Ingest mock Legal Case data for risk assessment.

---

### P2 - Medium Priority: Legal & Quality (Week 3)

#### BE-005: Legal Verification Workflow
**Ref**: `docs/04-IMPLEMENTATION/SERVICE_CATALOG.md#4-legal--compliance-service-port-3007`
- [ ] Implement `document_verifications` state machine (PENDING -> REVIEW -> VERIFIED).

#### BE-006: Inspection & Snagging
**Ref**: `docs/04-IMPLEMENTATION/SERVICE_CATALOG.md#6-tools-quality--inspection-service-port-3013`
- [ ] Implement `snags` CRUD for mobile app uploads.

---

### P2.5 - CRITICAL: Legal Certificate Infrastructure (Week 3) 🆕

#### BE-009: Legal Certificate Service
**Ref**: `docs/04-IMPLEMENTATION/SERVICE_CATALOG.md#7-legal-certificate-service-legal-certificate-service`
**Schema Ref**: [COMPLETE_DATABASE_SCHEMAS.md](../../02-ARCHITECTURE/COMPLETE_DATABASE_SCHEMAS.md#15-legal-certificates--authorized-documents-india)
**API Ref**: [API_OVERVIEW.md](../../04-IMPLEMENTATION/API_OVERVIEW.md#10-legal-certificate-service-port-3011)

**Priority Tasks**:
- [ ] Implement `legal_certificates` table with 20 certificate types
- [ ] API: `POST /api/v1/legal/certificates` (Upload certificate with file)
- [ ] API: `GET /api/v1/legal/certificates` (Filter by project, type, status)
- [ ] API: `PUT /api/v1/legal/certificates/:id/verify` (Verification workflow)
- [ ] Document hash validation (SHA-256)
- [ ] AI summary generation (extract key rights/obligations from PDF)
- [ ] Portal URL validation (check certificate on govt portal)

**Trust OS Rules**:
- **Rule 1**: Every certificate MUST have `document_hash` (SHA-256)
- **Rule 2**: Verification MUST log to `certificate_verification_log`
- **Rule 3**: NO certificate deletion - use `status = 'SUPERSEDED'`

#### BE-010: Missing Certificate Alert Engine
**Ref**: [COMPLETE_DATABASE_SCHEMAS.md](../../02-ARCHITECTURE/COMPLETE_DATABASE_SCHEMAS.md#missing_certificate_alerts)
- [ ] Implement `missing_certificate_alerts` auto-generation
- [ ] Logic: Check required certificates per project stage (PRE_LAUNCH, CONSTRUCTION, HANDOVER)
- [ ] API: `GET /api/v1/legal/missing-certificates/:project_id`
- [ ] Severity calculation: CRITICAL (blocks handover) > HIGH > MEDIUM > LOW
- [ ] Auto-resolve when certificate is uploaded

**Stage-Based Requirements**:
```python
STAGE_REQUIREMENTS = {
    "PRE_LAUNCH": ["RERA_REGISTRATION", "LAND_CONVERSION_ORDER"],
    "CONSTRUCTION": ["BUILDING_PLAN_APPROVAL", "COMMENCEMENT_CERTIFICATE"],
    "HANDOVER": ["OCCUPANCY_CERTIFICATE", "COMPLETION_CERTIFICATE", "FIRE_NOC"]
}
```

#### BE-011: Authority Follow-Up Service
**Ref**: [COMPLETE_DATABASE_SCHEMAS.md](../../02-ARCHITECTURE/COMPLETE_DATABASE_SCHEMAS.md#16-authority-interaction--tracking)
- [ ] Implement `authority_follow_ups` CRUD
- [ ] Auto-reminder logic (send reminder X days before `next_follow_up_date`)
- [ ] API: `POST /api/v1/legal/authority-followups/:id/communicate` (Log communication)
- [ ] Implement `authority_communication_log` for full audit trail
- [ ] Renewal reminder workflow (90 days, 30 days, 7 days before expiry)

**Auto-Reminder Logic**:
- [ ] Cron job: Check `next_follow_up_date` daily
- [ ] Send notification to `assigned_to` user
- [ ] Update `last_reminder_sent` timestamp

#### BE-012: Transaction Legal Pack Generator
**Ref**: [COMPLETE_DATABASE_SCHEMAS.md](../../02-ARCHITECTURE/COMPLETE_DATABASE_SCHEMAS.md#17-transaction-ready-legal-pack)
- [ ] API: `POST /api/v1/legal/transaction-packs` (Generate pack for lead)
- [ ] Logic: Collect all certificates for `unit_id` → generate checklist
- [ ] Risk assessment algorithm (missing critical certs = HIGH risk)
- [ ] Generate consolidated PDF (all certificates + summary)
- [ ] Digital vault URL (secure S3 link with expiry)
- [ ] Share pack API with multi-role access (BANK, LAWYER, BUYER)

**Pack Generation Logic**:
```python
def generate_legal_pack(lead_id, unit_id):
    required_docs = get_required_documents_for_stage(pack_type)
    available_docs = get_certificates_for_unit(unit_id)
    missing_docs = required_docs - available_docs
    risk_flags = assess_risks(missing_docs)
    completion = (len(available_docs) / len(required_docs)) * 100
    return LegalPack(...)
```

#### BE-013: Certificate Timeline & Analytics
**Ref**: [COMPLETE_DATABASE_SCHEMAS.md](../../02-ARCHITECTURE/COMPLETE_DATABASE_SCHEMAS.md#18-certificate-analytics--visualization)
- [ ] API: `GET /api/v1/legal/certificate-timeline/:project_id`
- [ ] Generate Gantt chart data (milestones, dependencies)
- [ ] Critical path calculation (which certs block handover)
- [ ] Delay tracking (expected vs actual dates)
- [ ] SVG timeline generation for frontend visualization

---

### P3 - Growth: Agent & Marketing (Week 4)

#### BE-007: Agent Service & Governance
- [ ] Implement `agents` table with License/Territory fields.
- [ ] Implement `commissions` logic (locked on Consent).

#### BE-008: Marketing Automation Engine
- [ ] Implement `content_templates` for Project Updates.
- [ ] API: `POST /marketing/generate-reel` (Mock video gen).



### P3.1 - Innovation: AI Ingestion (Week 5)

#### BE-011: AI Ingestion Service (New)
- [ ] Implement `ingest.py` with mock OCR logic.
- [ ] Endpoint: `POST /analyze/brochure` (Extract configs/amenities).
- [ ] Endpoint: `POST /scrape/url` (Extract builder profile).

#### BE-012: Document Classifier
- [ ] Logic to distinguish RERA Card vs Aadhaar vs Sale Deed.

- Use `SERVICE_CATALOG.md` for EXACT Table definitions.
- **Rule**: Do NOT store raw bank statements. Only store `monthly_surplus_band`.

---

### P4 - Trust OS 2.0: Manifesto Expansion (Week 6+)

#### BE-013: Vastu RAG Service
- [ ] Implement `vastu_rules` knowledge graph (Traditional vs Modern).
- [ ] Logic: `analyze_floorplan(unit_id, vastu_profile)` -> returns Explainable Score.
- [ ] **Invariant**: Must apply *only* on explicit user Opt-In.

#### BE-014: Social Sentiment Engine
- [ ] Scraper: Ingest from Twitter/Reddit/SkyscraperCity targeting Project Keywords.
- [ ] Logic: Theme summarization (not raw comment dump).
- [ ] API: `GET /projects/{id}/sentiment` (Aggregated).

#### BE-015: Agent Credibility Score
- [ ] Metric: `accuracy_score` (Listings Verified / Total Listings).
- [ ] Metric: `closure_rate` (Transactions / Leads).
- [ ] Logic: De-rank agents below threshold.

#### BE-016: Persona-Based Comparison Engine
- [ ] Algorithm: Weighted scoring based on Persona (Investor = Yield * 0.8 + Appreciation * 0.2).
- [ ] API: `POST /compare/projects` (Input: 2 IDs + Persona).

#### BE-017: Village Agent Network (Supply Sensors)
- [ ] Schema: `social_listings` table (separate from canonical `listings`).
- [ ] Ingest: WhatsApp Webhook handler for text/image parsing.
- [ ] Logic: Flag as "Social Signal" until Agent verification.
