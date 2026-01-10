# 📚 SERVICE CATALOG & DATABASE SCHEMAS

**Source of Truth for all Microservices and Data Models**

> **CRITICAL**: This file references the comprehensive schemas in `docs/02-ARCHITECTURE/COMPLETE_DATABASE_SCHEMAS.md`. Always use those schemas for implementation.

---

## 1. 🔐 Auth Service (`auth-service`)
**Port**: 3001
**Responsibility**: Identity, JWT, OAuth, Role Management, Consent Management.

### Database Schema (PostgreSQL)

**Schema Location**: [COMPLETE_DATABASE_SCHEMAS.md](../02-ARCHITECTURE/COMPLETE_DATABASE_SCHEMAS.md#1-identity--consent)

```sql
-- users table
-- Full schema: docs/02-ARCHITECTURE/COMPLETE_DATABASE_SCHEMAS.md#users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mobile VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    full_name VARCHAR(100),
    role VARCHAR(20) CHECK (role IN ('BUYER', 'AGENT', 'BUILDER', 'ADMIN')),
    persona_type VARCHAR(50), -- FAMILY, INVESTOR, RENTAL, NRI, SENIOR, COMMUTER
    is_verified BOOLEAN DEFAULT FALSE,
    kyc_status VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- user_consents table
-- Full schema: docs/02-ARCHITECTURE/COMPLETE_DATABASE_SCHEMAS.md#user_consents
CREATE TABLE user_consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    consent_type VARCHAR(50) NOT NULL, -- FINANCIAL_AA, CIBIL, CAMS, LEGAL_DOCS
    purpose TEXT NOT NULL, -- "Loan eligibility check for property X"
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'REVOKED', 'EXPIRED')),
    granted_at TIMESTAMP DEFAULT NOW(),
    valid_until TIMESTAMP NOT NULL,
    revoked_at TIMESTAMP,
    consent_artifact_id VARCHAR(255), -- External AA/Bureau ID
    metadata JSONB,
    CONSTRAINT consent_expiry CHECK (valid_until > granted_at)
);
```

---

## 2. 🏠 Property Service (`property-service`)
**Port**: 3002
**Responsibility**: Inventory, Projects, Units, Towers, Pricing (Immutable History).

### Database Schema (PostGIS)

**Schema Location**: [COMPLETE_DATABASE_SCHEMAS.md](../02-ARCHITECTURE/COMPLETE_DATABASE_SCHEMAS.md#2-canonical-property-structure)

**Key Tables**:
- `projects` - Canonical project structure with geo-spatial data
- `towers` - Tower-level geometry and configuration
- `floor_types` - Reusable floor configurations
- `units` - Atomic inventory with environmental data
- `unit_rooms` - Room-level geometry
- `price_versions` - **Immutable** price history (NEVER delete)
- `inventory_staging` - Unit visibility governance

```sql
-- See COMPLETE_DATABASE_SCHEMAS.md for full schemas
-- Critical: Use price_versions for immutable price history
CREATE TABLE price_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
    base_price DECIMAL(15, 2) NOT NULL,
    government_charges DECIMAL(15, 2),
    amenity_charges DECIMAL(15, 2),
    parking_charges DECIMAL(15, 2),
    total_price DECIMAL(15, 2) NOT NULL,
    changed_by UUID REFERENCES users(id),
    change_reason TEXT NOT NULL,
    pricing_strategy VARCHAR(50),
    valid_from TIMESTAMP DEFAULT NOW(),
    valid_until TIMESTAMP,
    is_current BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 3. 💰 Financial Trust Service (`trust-service`)
**Port**: 3006
**Responsibility**: Financial Confidence Profile, Digital Aggregator logic.

### Database Schema

```sql
-- NO RAW DATA STORAGE. DERIVED INSIGHTS ONLY.

CREATE TABLE financial_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id),
    monthly_surplus_band VARCHAR(50) COMMENT 'e.g., "1L-2L"',
    credit_score_band VARCHAR(20) COMMENT 'e.g., "750+"',
    loan_eligibility_limit DECIMAL(15, 2),
    asset_confidence_score INT CHECK (asset_confidence_score BETWEEN 0 AND 100),
    last_updated TIMESTAMP
);

CREATE TABLE declared_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    asset_type VARCHAR(50) COMMENT 'LAND, APARTMENT, COMMERCIAL',
    location_details JSONB COMMENT 'Survey No, City, Zone',
    verification_status VARCHAR(20) DEFAULT 'PENDING' COMMENT 'VERIFIED, REJECTED',
    verification_source VARCHAR(50) COMMENT 'TAX_RECEIPT, SALE_DEED',
    estimated_value_band VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE bank_offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bank_name VARCHAR(100),
    min_credit_score INT,
    min_income DECIMAL(15, 2),
    offer_details JSONB,
    active BOOLEAN DEFAULT TRUE
);
```

---

## 4. ⚖️ Legal & Compliance Service (`legal-service`)
**Port**: 3007
**Responsibility**: Document Verification, Contract Generation.

### Database Schema

```sql
CREATE TABLE document_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID REFERENCES declared_assets(id),
    doc_type VARCHAR(50),
    ocr_data JSONB,
    verification_result JSONB,
    lawyer_id UUID REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'IN_PROGRESS',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE legal_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id),
    case_number VARCHAR(100),
    court_name VARCHAR(100),
    status VARCHAR(50),
    risk_level VARCHAR(20) COMMENT 'LOW, MEDIUM, HIGH',
    summary TEXT
);
```

---

## 5. 🏗️ Builder Reputation Service (`reputation-service`)
**Port**: 3012
**Responsibility**: Scoring Builders based on Delivery, Legal, Quality.

### Database Schema

```sql
CREATE TABLE builder_scores (
    builder_id UUID PRIMARY KEY REFERENCES users(id),
    delivery_score INT,
    quality_score INT,
    legal_score INT,
    overall_trust_score INT,
    updated_at TIMESTAMP
);

CREATE TABLE project_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id),
    milestone_name VARCHAR(100),
    promised_date DATE,
    actual_date DATE,
    delay_days INT GENERATED ALWAYS AS (actual_date - promised_date) STORED
);
```

---

## 6. 🛠️ Quality & Inspection Service (`inspection-service`)
**Port**: 3013
**Responsibility**: Site inspections, Snagging.

### Database Schema

```sql
CREATE TABLE inspections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unit_id UUID REFERENCES units(id),
    inspector_id UUID REFERENCES users(id),
    inspection_date DATE,
    status VARCHAR(20) DEFAULT 'SCHEDULED',
    report_url VARCHAR(255),
    overall_rating INT
);

CREATE TABLE snags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inspection_id UUID REFERENCES inspections(id),
    category VARCHAR(50) COMMENT 'ELECTRICAL, PLUMBING, FINISHING',
    severity VARCHAR(20) COMMENT 'MINOR, MAJOR, CRITICAL',
    description TEXT,
    photo_evidence_urls TEXT[],
    status VARCHAR(20) DEFAULT 'OPEN'
);
```

---

---

## 7. ⚖️ Legal Certificate Service (`legal-certificate-service`)
**Port**: 3011
**Responsibility**: Certificate tracking, Authority interaction, Transaction legal packs, Certificate analytics.

### Database Schema

**Schema Location**: [COMPLETE_DATABASE_SCHEMAS.md](../02-ARCHITECTURE/COMPLETE_DATABASE_SCHEMAS.md#15-legal-certificates--authorized-documents-india)

**Key Tables**:
- `legal_certificates` - 20 certificate types (RERA, OC, CC, Fire NOC, etc.)
- `certificate_verification_log` - Audit trail for all verification attempts
- `certificate_dependencies` - Certificate prerequisite graph
- `missing_certificate_alerts` - Critical gap tracking
- `authority_follow_ups` - Application tracking with auto-reminders
- `authority_communication_log` - Complete communication audit
- `authority_renewal_reminders` - Automated renewal workflows
- `transaction_legal_packs` - Transaction-ready document bundles
- `legal_pack_reviews` - Multi-stakeholder review workflow
- `legal_pack_access_log` - Access audit trail
- `certificate_timelines` - Visual timeline for approvals
- `certificate_checklists` - Stage-based completion tracking

```sql
-- legal_certificates: 20 certificate types with verification workflow
CREATE TABLE legal_certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(50) NOT NULL CHECK (entity_type IN ('PROJECT', 'TOWER', 'PHASE', 'UNIT')),
    entity_id UUID NOT NULL,
    project_id UUID REFERENCES projects(id),
    certificate_type VARCHAR(100) NOT NULL CHECK (certificate_type IN (
        'RERA_REGISTRATION', 'BUILDING_PLAN_APPROVAL',
        'COMMENCEMENT_CERTIFICATE', 'OCCUPANCY_CERTIFICATE',
        'COMPLETION_CERTIFICATE', 'FIRE_NOC',
        'ENVIRONMENTAL_CLEARANCE', 'ENCUMBRANCE_CERTIFICATE',
        'SALE_DEED', 'TITLE_DEED', 'COURT_ORDER'
        -- ... +9 more types
    )),
    certificate_name VARCHAR(255) NOT NULL,
    certificate_number VARCHAR(100),
    issuing_authority VARCHAR(255) NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE,
    status VARCHAR(20) DEFAULT 'PENDING',
    verification_status VARCHAR(20) DEFAULT 'PENDING',
    document_url VARCHAR(500) NOT NULL,
    document_hash VARCHAR(64) NOT NULL, -- SHA-256 for integrity
    ai_summary TEXT,
    key_rights JSONB,
    key_obligations JSONB,
    portal_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- transaction_legal_packs: Transaction-ready legal bundles
CREATE TABLE transaction_legal_packs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES leads(id),
    unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
    buyer_id UUID REFERENCES users(id),
    pack_type VARCHAR(50) DEFAULT 'BOOKING',
    pack_status VARCHAR(20) DEFAULT 'DRAFT',
    required_documents JSONB NOT NULL,
    available_documents JSONB,
    completion_percentage INT CHECK (completion_percentage BETWEEN 0 AND 100),
    risk_flags JSONB,
    overall_risk_level VARCHAR(20),
    digital_vault_url VARCHAR(500),
    pdf_download_url VARCHAR(500),
    pack_hash VARCHAR(64),
    generated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 8. 📣 Marketing Automation Service (`marketing-service`)
**Port**: 3014
**Responsibility**: Truth-based content generation, Campaign orchestration.

### Database Schema
```sql
CREATE TABLE content_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(50) COMMENT 'PROJECT_UPDATE, LEGAL_MILESTONE, MARKET_INSIGHT',
    persona VARCHAR(20) COMMENT 'FAMILY, INVESTOR, NRI',
    content_structure JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE generated_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id),
    template_id UUID REFERENCES content_templates(id),
    content_data JSONB,
    status VARCHAR(20) DEFAULT 'DRAFT' COMMENT 'DRAFT, APPROVED, PUBLISHED',
    approval_history JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE campaign_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID REFERENCES generated_content(id),
    channel VARCHAR(20) COMMENT 'WHATSAPP, INSTAGRAM, LINKEDIN',
    stats JSONB COMMENT 'Views, Clicks, Conversions',
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 8. 🤝 Agent & Listing Network Service (`agent-service`)
**Port**: 3015
**Responsibility**: Agent onboarding, Listing verification, Performance tracking.

### Database Schema
```sql
CREATE TABLE agents (
    id UUID PRIMARY KEY REFERENCES users(id),
    license_number VARCHAR(100),
    territory VARCHAR(100),
    credibility_score INT DEFAULT 50,
    performance_metrics JSONB,
    is_authorized BOOLEAN DEFAULT FALSE
);

CREATE TABLE agent_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES agents(id),
    property_details JSONB,
    status VARCHAR(20) DEFAULT 'SOCIAL_SIGNAL' COMMENT 'SOCIAL_SIGNAL, VERIFIED, EXPIRED',
    verification_artifacts JSONB COMMENT 'Photos, Location Pin, Documents',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE agent_microsites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES agents(id),
    subdomain VARCHAR(100) UNIQUE,
    config JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 9. 📊 CRM & Governance Service (`crm-service`)
**Port**: 3016
**Responsibility**: Unified Lead management, Consent auditing, Transaction lifecycle.

### Database Schema
```sql
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id UUID REFERENCES users(id),
    project_id UUID REFERENCES projects(id),
    advisor_id UUID REFERENCES users(id) COMMENT 'Assigned Agent/Sales',
    status VARCHAR(20) DEFAULT 'NEW',
    consent_id UUID REFERENCES user_consents(id),
    interaction_history JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(buyer_id, project_id)
);

CREATE TABLE transaction_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES leads(id),
    milestone_type VARCHAR(50),
    status VARCHAR(20) DEFAULT 'PENDING',
    artifacts JSONB COMMENT 'Payments, Agreements',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE commission_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES leads(id),
    agent_id UUID REFERENCES agents(id),
    amount DECIMAL(15, 2),
    status VARCHAR(20) DEFAULT 'PENDING',
    audit_trail JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🌐 API Integrations (External)

### Financial Aggregators
*   **Account Aggregator (Setu/Anumati)**: `POST /v1/consent/request`
*   **Credit Bureau (Experian/CIBIL)**: `POST /v1/bureau/fetch`
*   **RTA (CAMS/KFintech)**: `POST /v1/investments/summary`

### Legal & Govt
*   **eCourts API**: Case search.
*   **RERA API**: Project validation.
*   **ISRO/Bhuvan**: Satellite monitoring.

### Scrapers & Social
*   **Playwright Engine**: Builder site ingestion.
*   **Meta Business API**: WhatsApp & Instagram automation.
