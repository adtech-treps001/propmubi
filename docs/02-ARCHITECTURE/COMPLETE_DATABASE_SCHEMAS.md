# 🗄️ COMPLETE DATABASE SCHEMAS - Trust OS

**Comprehensive schema coverage for all Trust OS domains**

---

## CORE PRINCIPLES

1. **Canonical Truth**: One property, one listing, one price, one lead
2. **Immutability**: Price history, legal events never deleted
3. **Auditability**: All changes logged with reason
4. **Privacy**: No raw financial data storage, only derived insights
5. **Explainability**: All scores must be traceable to sources

---

## 1. 🔐 IDENTITY & CONSENT

### users
```sql
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

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_persona ON users(persona_type);
```

### user_consents
```sql
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
    metadata JSONB, -- Stores additional consent details
    CONSTRAINT consent_expiry CHECK (valid_until > granted_at)
);

CREATE INDEX idx_consents_user_status ON user_consents(user_id, status);
CREATE INDEX idx_consents_type ON user_consents(consent_type);
```

---

## 2. 🏗️ CANONICAL PROPERTY STRUCTURE

### projects (Canonical Parent)
```sql
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    builder_id UUID REFERENCES users(id),
    canonical_name VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(255) UNIQUE NOT NULL,
    project_type VARCHAR(50) CHECK (project_type IN ('APARTMENT', 'VILLA', 'PLOT', 'COMMERCIAL')),

    -- Geo-spatial (PostGIS)
    location GEOGRAPHY(POINT, 4326) NOT NULL,
    boundary GEOGRAPHY(POLYGON, 4326),
    site_area_sqft DECIMAL(15, 2),

    -- Legal
    rera_id VARCHAR(100) UNIQUE,
    rera_status VARCHAR(50),
    rera_valid_until DATE,
    approval_authority VARCHAR(100),

    -- Status
    status VARCHAR(50) DEFAULT 'PRE_LAUNCH' CHECK (status IN (
        'PRE_LAUNCH', 'LAUNCHED', 'UNDER_CONSTRUCTION',
        'READY_TO_MOVE', 'COMPLETED', 'STALLED', 'CANCELLED'
    )),
    launch_date DATE,
    promised_possession_date DATE,
    actual_possession_date DATE,

    -- Configuration
    total_towers INT,
    total_units INT,
    total_floors INT,
    amenities JSONB, -- [{name, category, floor}]

    -- Orientation & Environmental
    true_north_angle DECIMAL(5, 2), -- Degrees from true north
    elevation_meters DECIMAL(10, 2),
    wind_pattern JSONB, -- {dominant_direction, speed_range}

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_projects_location ON projects USING GIST(location);
CREATE INDEX idx_projects_boundary ON projects USING GIST(boundary);
CREATE INDEX idx_projects_builder ON projects(builder_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_rera ON projects(rera_id);
```

### towers
```sql
CREATE TABLE towers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    tower_name VARCHAR(50) NOT NULL,
    tower_number INT,

    -- Geo-spatial
    footprint GEOGRAPHY(POLYGON, 4326) NOT NULL,
    centroid GEOGRAPHY(POINT, 4326) NOT NULL,

    -- Physical
    total_floors INT NOT NULL,
    floors_above_ground INT NOT NULL,
    floors_below_ground INT DEFAULT 0,
    height_meters DECIMAL(10, 2),
    orientation_degrees DECIMAL(5, 2), -- Angle from true north

    -- Floor types
    typical_floor_range INT[], -- [5, 15] means floors 5-15 are typical
    refuge_floors INT[],
    amenity_floors INT[],
    parking_floors INT[],

    -- Core facilities
    lift_count INT,
    staircase_count INT,
    core_position GEOGRAPHY(POINT, 4326),

    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(project_id, tower_name)
);

CREATE INDEX idx_towers_project ON towers(project_id);
CREATE INDEX idx_towers_footprint ON towers USING GIST(footprint);
```

### floor_types (India-specific optimization)
```sql
CREATE TABLE floor_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tower_id UUID REFERENCES towers(id) ON DELETE CASCADE,
    floor_type_name VARCHAR(100) NOT NULL, -- "Typical 2BHK Floor", "Penthouse Floor"

    -- Layout
    floor_plan_svg TEXT, -- SVG path data
    floor_plan_cad_url VARCHAR(500),
    total_area_sqft DECIMAL(10, 2),

    -- Metadata
    ceiling_height_feet DECIMAL(4, 2),
    structural_system VARCHAR(50), -- RCC, SHEAR_WALL

    -- Floor range this type applies to
    applicable_floors INT[] NOT NULL,

    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(tower_id, floor_type_name)
);
```

### units (Atomic Inventory)
```sql
CREATE TABLE units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id),
    tower_id UUID REFERENCES towers(id),
    floor_type_id UUID REFERENCES floor_types(id),

    -- Identification
    tower_name VARCHAR(50),
    floor_number INT NOT NULL,
    unit_number VARCHAR(20) NOT NULL,

    -- Classification
    unit_type VARCHAR(20) NOT NULL, -- 1BHK, 2BHK, 3BHK, 4BHK, PENTHOUSE, STUDIO
    carpet_area_sqft DECIMAL(10, 2) NOT NULL,
    builtup_area_sqft DECIMAL(10, 2),
    super_builtup_area_sqft DECIMAL(10, 2),

    -- Room details
    bedrooms INT,
    bathrooms INT,
    balconies INT,

    -- Position & View
    unit_centroid GEOGRAPHY(POINT, 4326),
    facing_direction VARCHAR(20), -- NORTH, SOUTH, EAST, WEST, NORTHEAST, etc.
    corner_unit BOOLEAN DEFAULT FALSE,

    -- View cones (what user can see)
    view_directions JSONB, -- [{direction: "NORTH", obstruction_distance_m: 500, view_quality: "OPEN"}]

    -- Environmental
    sunlight_hours_winter DECIMAL(4, 2),
    sunlight_hours_summer DECIMAL(4, 2),
    cross_ventilation BOOLEAN DEFAULT FALSE,
    wind_exposure VARCHAR(20), -- LOW, MEDIUM, HIGH
    noise_level VARCHAR(20), -- LOW, MEDIUM, HIGH

    -- Structural details
    ceiling_height_feet DECIMAL(4, 2),
    wall_material VARCHAR(50),
    flooring_material VARCHAR(50),
    door_window_material VARCHAR(50),

    -- Plumbing & Electrical
    plumbing_points JSONB, -- [{room: "kitchen", type: "sink", location}]
    electrical_points JSONB, -- [{room: "bedroom1", type: "switch", location}]

    -- Status
    status VARCHAR(20) DEFAULT 'AVAILABLE' CHECK (status IN (
        'AVAILABLE', 'BLOCKED', 'BOOKED', 'SOLD', 'NOT_FOR_SALE'
    )),
    availability_reason TEXT, -- For STAGE_LOCKED, PREMIUM_RESERVE, etc.

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(project_id, tower_name, floor_number, unit_number)
);

CREATE INDEX idx_units_project ON units(project_id);
CREATE INDEX idx_units_tower ON units(tower_id);
CREATE INDEX idx_units_status ON units(status);
CREATE INDEX idx_units_type ON units(unit_type);
CREATE INDEX idx_units_location ON units USING GIST(unit_centroid);
```

### unit_rooms (Detailed geometry)
```sql
CREATE TABLE unit_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
    room_name VARCHAR(50) NOT NULL, -- BEDROOM1, LIVING, KITCHEN, BATHROOM1
    room_type VARCHAR(50) NOT NULL, -- BEDROOM, LIVING, DINING, KITCHEN, BATHROOM, BALCONY

    -- Dimensions
    length_feet DECIMAL(5, 2),
    width_feet DECIMAL(5, 2),
    area_sqft DECIMAL(8, 2),

    -- Geometry (for interior design)
    polygon_coordinates JSONB, -- [[x1,y1], [x2,y2], ...] relative to unit origin

    -- Features
    window_count INT,
    window_positions JSONB,
    door_count INT,
    door_positions JSONB,

    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 3. 💰 PRICING & INVENTORY (Immutable History)

### price_versions
```sql
CREATE TABLE price_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unit_id UUID REFERENCES units(id) ON DELETE CASCADE,

    -- Pricing
    base_price DECIMAL(15, 2) NOT NULL,
    government_charges DECIMAL(15, 2),
    amenity_charges DECIMAL(15, 2),
    parking_charges DECIMAL(15, 2),
    total_price DECIMAL(15, 2) NOT NULL,

    -- Metadata
    changed_by UUID REFERENCES users(id),
    change_reason TEXT NOT NULL,
    pricing_strategy VARCHAR(50), -- LAUNCH_OFFER, PREMIUM_RELEASE, DISTRESS, MARKET_RATE

    -- Validity
    valid_from TIMESTAMP DEFAULT NOW(),
    valid_until TIMESTAMP,
    is_current BOOLEAN DEFAULT TRUE,

    -- Market context
    market_benchmark_min DECIMAL(15, 2),
    market_benchmark_max DECIMAL(15, 2),

    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT price_validity CHECK (valid_until IS NULL OR valid_until > valid_from)
);

CREATE INDEX idx_price_unit ON price_versions(unit_id);
CREATE INDEX idx_price_current ON price_versions(unit_id, is_current) WHERE is_current = TRUE;
CREATE INDEX idx_price_timeline ON price_versions(unit_id, valid_from);
```

### inventory_staging
```sql
CREATE TABLE inventory_staging (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unit_id UUID REFERENCES units(id),

    -- Staging strategy
    stage_name VARCHAR(100) NOT NULL, -- PUBLIC, STAGE_LOCKED, PREMIUM_RESERVE, VALUE_OPTIMIZED, CLOSED_RELEASE_POOL
    stage_reason TEXT NOT NULL, -- Must be explainable

    -- Visibility
    visible_to_public BOOLEAN DEFAULT TRUE,
    visible_to_agents JSONB, -- [agent_id1, agent_id2] or "ALL"
    visible_to_personas JSONB, -- ["INVESTOR", "NRI"]

    -- Timing
    staged_at TIMESTAMP DEFAULT NOW(),
    release_at TIMESTAMP, -- Scheduled release

    created_by UUID REFERENCES users(id),

    CONSTRAINT staging_explainability CHECK (stage_reason IS NOT NULL AND LENGTH(stage_reason) > 10)
);
```

---

## 4. 📍 GEO-SPATIAL & POINTS OF INTEREST

### points_of_interest
```sql
CREATE TABLE points_of_interest (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Identity
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL, -- SCHOOL, HOSPITAL, MALL, OFFICE, METRO, AIRPORT
    sub_category VARCHAR(50), -- PRIMARY_SCHOOL, MULTI_SPECIALTY_HOSPITAL

    -- Location
    location GEOGRAPHY(POINT, 4326) NOT NULL,
    address TEXT,

    -- Persona relevance
    relevant_personas VARCHAR(50)[], -- [FAMILY, OFFICE_COMMUTER, SENIOR]

    -- Quality/Rating
    rating DECIMAL(2, 1),
    rating_source VARCHAR(50), -- GOOGLE, GOVT, VERIFIED

    -- Future infrastructure
    is_future BOOLEAN DEFAULT FALSE,
    expected_completion_date DATE,
    authority_source VARCHAR(255),

    -- Metadata
    metadata JSONB, -- {distance_to_road, connectivity_score, etc.}

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_poi_location ON points_of_interest USING GIST(location);
CREATE INDEX idx_poi_category ON points_of_interest(category);
CREATE INDEX idx_poi_personas ON points_of_interest USING GIN(relevant_personas);
```

### project_poi_distances
```sql
CREATE TABLE project_poi_distances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    poi_id UUID REFERENCES points_of_interest(id) ON DELETE CASCADE,

    -- Distance metrics
    straight_line_distance_km DECIMAL(6, 3),
    road_distance_km DECIMAL(6, 3),
    travel_time_minutes INT,

    -- Journey
    route_geometry GEOGRAPHY(LINESTRING, 4326),

    computed_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(project_id, poi_id)
);
```

---

## 5. 🌍 ENVIRONMENTAL SIMULATION

### sunlight_simulations
```sql
CREATE TABLE sunlight_simulations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unit_id UUID REFERENCES units(id) ON DELETE CASCADE,

    -- Seasonal data
    season VARCHAR(20) NOT NULL, -- WINTER, SUMMER, MONSOON
    month INT NOT NULL CHECK (month BETWEEN 1 AND 12),

    -- Hourly sunlight (24-hour array)
    hourly_sunlight_intensity INT[], -- [0-100] for each hour
    total_daylight_hours DECIMAL(4, 2),

    -- Peak periods
    morning_sun_hours DECIMAL(3, 1), -- 6am-10am
    afternoon_sun_hours DECIMAL(3, 1), -- 12pm-4pm
    evening_sun_hours DECIMAL(3, 1), -- 4pm-7pm

    -- Shadow impact
    shadow_from_towers UUID[], -- Tower IDs causing shadow
    shadow_duration_minutes INT,

    computed_at TIMESTAMP DEFAULT NOW(),
    computation_method VARCHAR(50), -- GEOMETRY_BASED, SATELLITE_VERIFIED

    UNIQUE(unit_id, season, month)
);
```

### wind_analysis
```sql
CREATE TABLE wind_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unit_id UUID REFERENCES units(id),

    -- Wind data
    dominant_wind_direction VARCHAR(20), -- NORTHEAST, SOUTHWEST, etc.
    average_wind_speed_kmh DECIMAL(5, 2),
    seasonal_variation JSONB, -- {winter: {direction, speed}, summer: {...}}

    -- Obstructions
    windward_obstructions JSONB, -- [{tower_id, distance_m, height_m}]
    leeward_obstructions JSONB,

    -- Cross-ventilation
    cross_ventilation_score INT CHECK (cross_ventilation_score BETWEEN 0 AND 100),
    ventilation_quality VARCHAR(20), -- EXCELLENT, GOOD, MODERATE, POOR

    computed_at TIMESTAMP DEFAULT NOW()
);
```

### noise_privacy_analysis
```sql
CREATE TABLE noise_privacy_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unit_id UUID REFERENCES units(id),

    -- Noise sources
    road_distance_meters DECIMAL(8, 2),
    road_type VARCHAR(50), -- HIGHWAY, MAIN_ROAD, INTERNAL
    estimated_noise_db INT,

    -- Privacy factors
    adjacent_to_lift BOOLEAN,
    adjacent_to_staircase BOOLEAN,
    adjacent_construction_distance_meters DECIMAL(8, 2),

    -- Scores
    noise_score INT CHECK (noise_score BETWEEN 0 AND 100),
    privacy_score INT CHECK (privacy_score BETWEEN 0 AND 100),

    computed_at TIMESTAMP DEFAULT NOW()
);
```

---

## 6. ⚖️ LEGAL & COMPLIANCE

### legal_documents
```sql
CREATE TABLE legal_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(50) NOT NULL, -- PROJECT, BUILDER, UNIT, PLOT
    entity_id UUID NOT NULL,

    -- Document classification
    document_type VARCHAR(100) NOT NULL, -- RERA_CERTIFICATE, APPROVAL, EC, SALE_DEED, COURT_ORDER
    document_name VARCHAR(255) NOT NULL,

    -- Storage
    document_url VARCHAR(500) NOT NULL,
    document_hash VARCHAR(64), -- SHA-256 for integrity

    -- OCR & Extraction
    ocr_text TEXT,
    extracted_data JSONB, -- Schema-bound extraction

    -- Metadata
    issue_date DATE,
    expiry_date DATE,
    issuing_authority VARCHAR(255),
    document_number VARCHAR(100),

    -- Verification
    verification_status VARCHAR(20) DEFAULT 'PENDING' CHECK (verification_status IN (
        'PENDING', 'IN_REVIEW', 'VERIFIED', 'REJECTED', 'EXPIRED'
    )),
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMP,
    verification_notes TEXT,

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_legal_docs_entity ON legal_documents(entity_type, entity_id);
CREATE INDEX idx_legal_docs_type ON legal_documents(document_type);
CREATE INDEX idx_legal_docs_status ON legal_documents(verification_status);
```

### court_cases
```sql
CREATE TABLE court_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Linkage
    builder_id UUID REFERENCES users(id),
    project_id UUID REFERENCES projects(id),

    -- Case details
    case_number VARCHAR(100) UNIQUE NOT NULL,
    case_type VARCHAR(100), -- CIVIL, CRIMINAL, CONSUMER, RERA
    court_name VARCHAR(255) NOT NULL,
    court_location VARCHAR(100),

    -- Status
    filing_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE', -- ACTIVE, DISPOSED, WITHDRAWN, SETTLED
    current_stage VARCHAR(100),
    next_hearing_date DATE,

    -- Parties
    plaintiff TEXT,
    defendant TEXT,

    -- Summary
    case_summary TEXT,
    allegations JSONB, -- [{allegation, severity}]

    -- Risk assessment
    risk_level VARCHAR(20) CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    risk_reason TEXT,

    -- Outcomes
    judgement_date DATE,
    judgement_summary TEXT,
    financial_impact DECIMAL(15, 2),

    -- Sources
    data_source VARCHAR(100), -- ECOURTS, MANUAL, NEWS
    source_url VARCHAR(500),
    last_updated TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_cases_builder ON court_cases(builder_id);
CREATE INDEX idx_cases_project ON court_cases(project_id);
CREATE INDEX idx_cases_risk ON court_cases(risk_level);
CREATE INDEX idx_cases_status ON court_cases(status);
```

### rera_complaints
```sql
CREATE TABLE rera_complaints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Linkage
    builder_id UUID REFERENCES users(id),
    project_id UUID REFERENCES projects(id),
    rera_id VARCHAR(100),

    -- Complaint details
    complaint_number VARCHAR(100) UNIQUE NOT NULL,
    complaint_category VARCHAR(100), -- DELAY, QUALITY, REFUND, MISREPRESENTATION
    complaint_date DATE NOT NULL,

    -- Status
    status VARCHAR(50) DEFAULT 'PENDING',
    resolution_date DATE,
    resolution_summary TEXT,

    -- Penalty
    penalty_imposed DECIMAL(15, 2),
    penalty_paid BOOLEAN DEFAULT FALSE,

    -- Impact
    severity VARCHAR(20) CHECK (severity IN ('MINOR', 'MODERATE', 'MAJOR', 'CRITICAL')),

    data_source VARCHAR(100),
    source_url VARCHAR(500),
    last_updated TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_rera_builder ON rera_complaints(builder_id);
CREATE INDEX idx_rera_project ON rera_complaints(project_id);
```

---

## 7. 🏗️ BUILDER REPUTATION & TRUST

### builders (Extended user profile)
```sql
CREATE TABLE builder_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id),

    -- Identity
    company_name VARCHAR(255) NOT NULL,
    company_registration_number VARCHAR(100),
    gstin VARCHAR(15),
    pan VARCHAR(10),

    -- Experience
    established_year INT,
    total_projects_completed INT,
    total_units_delivered INT,
    cities_operated VARCHAR(100)[],

    -- Certifications
    iso_certified BOOLEAN DEFAULT FALSE,
    green_building_certified BOOLEAN DEFAULT FALSE,
    certifications JSONB,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### builder_trust_scores
```sql
CREATE TABLE builder_trust_scores (
    builder_id UUID PRIMARY KEY REFERENCES users(id),

    -- Multi-dimensional scores (0-100)
    execution_reliability_score INT CHECK (execution_reliability_score BETWEEN 0 AND 100),
    legal_compliance_score INT CHECK (legal_compliance_score BETWEEN 0 AND 100),
    customer_experience_score INT CHECK (customer_experience_score BETWEEN 0 AND 100),
    bank_confidence_score INT CHECK (bank_confidence_score BETWEEN 0 AND 100),
    market_integrity_score INT CHECK (market_integrity_score BETWEEN 0 AND 100),

    -- Overall
    overall_trust_index INT CHECK (overall_trust_index BETWEEN 0 AND 100),

    -- Explanation
    score_breakdown JSONB NOT NULL, -- Detailed breakdown with sources

    -- Temporal
    computed_at TIMESTAMP DEFAULT NOW(),
    next_update_at TIMESTAMP,

    CONSTRAINT score_explainability CHECK (score_breakdown IS NOT NULL)
);
```

### project_milestones
```sql
CREATE TABLE project_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,

    -- Milestone definition
    milestone_name VARCHAR(100) NOT NULL, -- FOUNDATION, STRUCTURE_COMPLETE, HANDOVER
    milestone_category VARCHAR(50), -- CONSTRUCTION, APPROVAL, HANDOVER

    -- Timeline
    promised_date DATE NOT NULL,
    actual_date DATE,
    delay_days INT GENERATED ALWAYS AS (
        CASE WHEN actual_date IS NOT NULL
        THEN EXTRACT(DAY FROM (actual_date - promised_date))
        ELSE NULL END
    ) STORED,

    -- Status
    status VARCHAR(20) DEFAULT 'SCHEDULED' CHECK (status IN (
        'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'DELAYED', 'CANCELLED'
    )),

    -- Evidence
    completion_evidence_url VARCHAR(500),
    verified_by VARCHAR(100), -- BUILDER, THIRD_PARTY, GOVT

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_milestones_project ON project_milestones(project_id);
CREATE INDEX idx_milestones_status ON project_milestones(status);
```

---

## 8. 💵 FINANCIAL TRUST (NO RAW DATA)

### financial_profiles
```sql
CREATE TABLE financial_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id),

    -- Derived insights ONLY (no raw data)
    monthly_surplus_band VARCHAR(50), -- "50K-75K", "75K-1L", "1L-2L", "2L+"
    annual_income_band VARCHAR(50), -- "5L-10L", "10L-20L", "20L-50L", "50L+"
    credit_score_band VARCHAR(20), -- "300-549", "550-649", "650-749", "750+"

    -- Asset confidence
    declared_assets_count INT DEFAULT 0,
    verified_assets_count INT DEFAULT 0,
    total_asset_value_band VARCHAR(50), -- "10L-50L", "50L-1Cr", "1Cr-5Cr", "5Cr+"

    -- Loan eligibility (computed)
    estimated_loan_eligibility_band VARCHAR(50), -- "10L-25L", "25L-50L", etc.
    loan_to_value_ratio DECIMAL(3, 2), -- 0.80 = 80%

    -- Buying power score
    buying_power_score INT CHECK (buying_power_score BETWEEN 0 AND 100),
    confidence_level VARCHAR(20), -- LOW, MEDIUM, HIGH, VERY_HIGH

    -- Meta
    last_updated TIMESTAMP DEFAULT NOW(),
    data_sources VARCHAR(100)[], -- [AA, CIBIL, DECLARED]

    CONSTRAINT no_raw_financial_data CHECK (
        monthly_surplus_band IS NOT NULL OR
        annual_income_band IS NOT NULL
    )
);
```

### declared_assets
```sql
CREATE TABLE declared_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),

    -- Asset classification
    asset_type VARCHAR(50) NOT NULL CHECK (asset_type IN (
        'RESIDENTIAL_PROPERTY', 'COMMERCIAL_PROPERTY', 'PLOT',
        'MUTUAL_FUND', 'STOCKS', 'FIXED_DEPOSIT', 'GOLD', 'OTHER'
    )),

    -- Property-specific
    property_address TEXT,
    survey_number VARCHAR(100),
    city VARCHAR(100),
    state VARCHAR(100),
    area_sqft DECIMAL(10, 2),

    -- Valuation
    declared_value_band VARCHAR(50) NOT NULL, -- Never exact amounts
    market_value_band VARCHAR(50),
    valuation_date DATE,

    -- Verification
    verification_status VARCHAR(20) DEFAULT 'PENDING' CHECK (verification_status IN (
        'PENDING', 'DOCUMENT_UPLOADED', 'VERIFIED', 'REJECTED'
    )),
    verification_source VARCHAR(50), -- SALE_DEED, TAX_RECEIPT, BANK_STATEMENT
    verification_document_id UUID REFERENCES legal_documents(id),

    -- Confidence
    asset_confidence_score INT CHECK (asset_confidence_score BETWEEN 0 AND 100),

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_assets_user ON declared_assets(user_id);
CREATE INDEX idx_assets_type ON declared_assets(asset_type);
CREATE INDEX idx_assets_status ON declared_assets(verification_status);
```

### bank_loan_offers
```sql
CREATE TABLE bank_loan_offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Bank
    bank_name VARCHAR(100) NOT NULL,
    bank_code VARCHAR(20),

    -- Eligibility criteria
    min_credit_score INT NOT NULL,
    min_annual_income DECIMAL(15, 2) NOT NULL,
    min_age INT DEFAULT 21,
    max_age INT DEFAULT 65,
    employment_types VARCHAR(50)[], -- [SALARIED, SELF_EMPLOYED, PROFESSIONAL]

    -- Offer details
    interest_rate_min DECIMAL(5, 2) NOT NULL,
    interest_rate_max DECIMAL(5, 2) NOT NULL,
    max_loan_to_value DECIMAL(3, 2) DEFAULT 0.80, -- 80%
    max_tenure_years INT DEFAULT 30,
    processing_fee_percent DECIMAL(4, 2),

    -- Special offers
    offer_type VARCHAR(50), -- STANDARD, PROMOTIONAL, PRIORITY
    special_conditions TEXT,

    -- Validity
    valid_from DATE DEFAULT CURRENT_DATE,
    valid_until DATE,
    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_loan_offers_active ON bank_loan_offers(is_active);
CREATE INDEX idx_loan_offers_bank ON bank_loan_offers(bank_name);
```

---

## 9. 🎨 INTERIOR DESIGN & MANUFACTURING

### interior_designs
```sql
CREATE TABLE interior_designs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unit_id UUID REFERENCES units(id),
    user_id UUID REFERENCES users(id),

    -- Design metadata
    design_name VARCHAR(255),
    style VARCHAR(50), -- MODERN, TRADITIONAL, MINIMALIST, INDUSTRIAL
    persona VARCHAR(50), -- FAMILY, BACHELOR, RENTAL

    -- Budget
    estimated_budget_band VARCHAR(50) NOT NULL, -- "5L-10L", "10L-20L"
    actual_cost_band VARCHAR(50),

    -- Design data (CNC-ready)
    design_svg TEXT,
    design_3d_url VARCHAR(500),
    material_specifications JSONB,
    cut_lists JSONB, -- For manufacturing
    assembly_instructions JSONB,

    -- Collaboration
    architect_id UUID REFERENCES users(id),
    approval_status VARCHAR(20) DEFAULT 'DRAFT',

    -- Lifecycle
    design_version INT DEFAULT 1,
    parent_design_id UUID REFERENCES interior_designs(id),

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_interiors_unit ON interior_designs(unit_id);
CREATE INDEX idx_interiors_user ON interior_designs(user_id);
```

### interior_modules
```sql
CREATE TABLE interior_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Module identity
    module_name VARCHAR(100) NOT NULL,
    module_category VARCHAR(50), -- KITCHEN, WARDROBE, BEDROOM_SET, LIVING_UNIT

    -- Specifications
    dimensions_json JSONB NOT NULL, -- {width, height, depth}
    materials JSONB, -- [{part: "door", material: "plywood", finish: "laminate"}]

    -- Manufacturing
    is_modular BOOLEAN DEFAULT TRUE,
    assembly_time_hours DECIMAL(4, 1),
    delivery_time_days INT,

    -- Pricing
    base_cost_band VARCHAR(50) NOT NULL,

    -- 3D/CAD
    model_url VARCHAR(500),
    dxf_url VARCHAR(500),

    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 10. 🔍 QUALITY & INSPECTION

### inspections
```sql
CREATE TABLE inspections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unit_id UUID REFERENCES units(id),
    inspection_type VARCHAR(50) NOT NULL, -- PRE_HANDOVER, POST_HANDOVER, PERIODIC, COMPLAINT

    -- Inspector
    inspector_id UUID REFERENCES users(id),
    inspector_type VARCHAR(50), -- BUILDER, THIRD_PARTY, GOVT

    -- Scheduling
    scheduled_date DATE NOT NULL,
    actual_date DATE,

    -- Status
    status VARCHAR(20) DEFAULT 'SCHEDULED' CHECK (status IN (
        'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'
    )),

    -- Results
    overall_rating INT CHECK (overall_rating BETWEEN 1 AND 5),
    report_url VARCHAR(500),
    photos_urls TEXT[],

    -- Checklist
    checklist_completed JSONB, -- {electrical: true, plumbing: true, ...}

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_inspections_unit ON inspections(unit_id);
CREATE INDEX idx_inspections_status ON inspections(status);
```

### snags
```sql
CREATE TABLE snags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inspection_id UUID REFERENCES inspections(id) ON DELETE CASCADE,
    unit_id UUID REFERENCES units(id),

    -- Snag classification
    category VARCHAR(50) NOT NULL, -- ELECTRICAL, PLUMBING, CIVIL, FINISHING, HVAC
    sub_category VARCHAR(100),
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('MINOR', 'MAJOR', 'CRITICAL')),

    -- Description
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location_in_unit VARCHAR(100), -- "Bedroom 1 - South wall"

    -- Evidence
    photo_urls TEXT[] NOT NULL,
    video_url VARCHAR(500),

    -- Resolution
    status VARCHAR(20) DEFAULT 'OPEN' CHECK (status IN (
        'OPEN', 'ACKNOWLEDGED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'DISPUTED'
    )),
    assigned_to UUID REFERENCES users(id),
    resolution_notes TEXT,
    resolution_date DATE,
    resolution_photo_urls TEXT[],

    -- Timeline
    reported_at TIMESTAMP DEFAULT NOW(),
    expected_resolution_date DATE,

    CONSTRAINT snag_evidence CHECK (array_length(photo_urls, 1) > 0)
);

CREATE INDEX idx_snags_inspection ON snags(inspection_id);
CREATE INDEX idx_snags_unit ON snags(unit_id);
CREATE INDEX idx_snags_status ON snags(status);
CREATE INDEX idx_snags_severity ON snags(severity);
```

---

## 11. 📊 LEADS & CRM (Consent-Driven)

### leads
```sql
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Buyer (deduplicated)
    buyer_phone_hash VARCHAR(64) NOT NULL, -- SHA-256 of phone
    buyer_name VARCHAR(100),
    buyer_email VARCHAR(255),
    buyer_id UUID REFERENCES users(id), -- If registered

    -- Property interest
    project_id UUID REFERENCES projects(id),
    unit_id UUID REFERENCES units(id),
    interested_unit_types VARCHAR(20)[],
    budget_min DECIMAL(15, 2),
    budget_max DECIMAL(15, 2),

    -- Lead origin
    source VARCHAR(50) NOT NULL, -- WEBSITE, BUILDER_SITE, AGENT, WALK_IN, REFERRAL
    source_details JSONB,

    -- Consent & Assignment
    consent_status VARCHAR(20) DEFAULT 'PENDING' CHECK (consent_status IN (
        'PENDING', 'CONSENTED', 'DECLINED'
    )),
    consent_timestamp TIMESTAMP,
    consent_method VARCHAR(50), -- WHATSAPP, EMAIL, SMS

    assigned_advisor_id UUID REFERENCES users(id),
    advisor_assignment_locked_at TIMESTAMP,

    -- Status
    lead_status VARCHAR(20) DEFAULT 'NEW' CHECK (lead_status IN (
        'NEW', 'CONTACTED', 'QUALIFIED', 'SITE_VISIT',
        'NEGOTIATION', 'CONVERTED', 'LOST', 'DUPLICATE'
    )),

    -- Confidence mode
    in_confidence_mode BOOLEAN DEFAULT FALSE,
    confidence_mode_price DECIMAL(15, 2),
    confidence_mode_expiry TIMESTAMP,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_leads_buyer_hash ON leads(buyer_phone_hash);
CREATE INDEX idx_leads_advisor ON leads(assigned_advisor_id);
CREATE INDEX idx_leads_status ON leads(lead_status);
CREATE INDEX idx_leads_consent ON leads(consent_status);
CREATE UNIQUE INDEX idx_leads_dedup ON leads(buyer_phone_hash, project_id)
    WHERE lead_status NOT IN ('LOST', 'DUPLICATE');
```

### lead_activities
```sql
CREATE TABLE lead_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,

    -- Activity
    activity_type VARCHAR(50) NOT NULL, -- CALL, EMAIL, WHATSAPP, SITE_VISIT, NEGOTIATION
    activity_summary TEXT NOT NULL,

    -- Actor
    performed_by UUID REFERENCES users(id),

    -- Outcome
    outcome VARCHAR(50), -- INTERESTED, NOT_INTERESTED, FOLLOW_UP, CONVERTED
    next_follow_up_date DATE,

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_activities_lead ON lead_activities(lead_id);
CREATE INDEX idx_activities_date ON lead_activities(created_at);
```

---

## 12. 📱 WHATSAPP & COMMUNICATION

### whatsapp_groups
```sql
CREATE TABLE whatsapp_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Group identity
    group_type VARCHAR(50) NOT NULL, -- BUYER, AGENT, BUILDER, PROJECT_UPDATES
    group_name VARCHAR(255) NOT NULL,

    -- Linkage
    project_id UUID REFERENCES projects(id),
    created_by UUID REFERENCES users(id),

    -- WhatsApp metadata
    whatsapp_group_id VARCHAR(255) UNIQUE,
    invite_link VARCHAR(500),

    -- Status
    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT NOW()
);
```

### communication_logs
```sql
CREATE TABLE communication_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Participants
    sender_id UUID REFERENCES users(id),
    recipient_id UUID REFERENCES users(id),

    -- Communication
    channel VARCHAR(50) NOT NULL, -- WHATSAPP, EMAIL, SMS, IN_APP
    message_type VARCHAR(50), -- TEXT, IMAGE, VIDEO, DOCUMENT, VIEW_SHARE
    message_content TEXT,

    -- Linkage
    lead_id UUID REFERENCES leads(id),
    project_id UUID REFERENCES projects(id),
    unit_id UUID REFERENCES units(id),

    -- Delivery status
    sent_at TIMESTAMP DEFAULT NOW(),
    delivered_at TIMESTAMP,
    read_at TIMESTAMP,

    -- Audit
    is_auditable BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_comms_sender ON communication_logs(sender_id);
CREATE INDEX idx_comms_recipient ON communication_logs(recipient_id);
CREATE INDEX idx_comms_lead ON communication_logs(lead_id);
```

---

## 13. 🎯 VASTU (Opt-in Only)

### vastu_preferences
```sql
CREATE TABLE vastu_preferences (
    user_id UUID PRIMARY KEY REFERENCES users(id),

    -- Opt-in
    vastu_enabled BOOLEAN DEFAULT FALSE,
    vastu_style VARCHAR(50), -- TRADITIONAL, PARTIAL, MODERN

    -- Selected rules
    enabled_rules VARCHAR(100)[], -- [MAIN_DOOR, KITCHEN, BEDROOM_DIRECTION]

    -- Strictness
    strictness_level VARCHAR(20), -- STRICT, MODERATE, RELAXED

    updated_at TIMESTAMP DEFAULT NOW()
);
```

### vastu_analysis
```sql
CREATE TABLE vastu_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unit_id UUID REFERENCES units(id),
    user_id UUID REFERENCES users(id),

    -- Rule-by-rule analysis
    rule_results JSONB NOT NULL, -- [{rule: "main_door_east", result: "PASS", explanation: "..."}]

    -- Overall
    overall_compliance_score INT CHECK (overall_compliance_score BETWEEN 0 AND 100),
    compliance_level VARCHAR(20), -- EXCELLENT, GOOD, MODERATE, POOR

    -- Sources
    source_corpus VARCHAR(100), -- TRUSTED_VASTU_RAG

    computed_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT vastu_explainability CHECK (rule_results IS NOT NULL)
);
```

---

## 14. 🎫 SUBSCRIPTIONS & REVENUE

### subscriptions
```sql
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),

    -- Tier
    tier_name VARCHAR(50) NOT NULL, -- FREE, SMART_BUYER, CONFIDENT_BUYER, GUARDED, LIFETIME
    tier_level INT NOT NULL, -- 0, 1, 2, 3, 4

    -- Pricing
    base_price DECIMAL(10, 2) NOT NULL,
    discount_applied DECIMAL(10, 2) DEFAULT 0,
    final_price DECIMAL(10, 2) NOT NULL,

    -- Validity
    started_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP,
    is_lifetime BOOLEAN DEFAULT FALSE,

    -- Status
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN (
        'ACTIVE', 'EXPIRED', 'CANCELLED', 'SUSPENDED'
    )),

    -- Payment
    payment_method VARCHAR(50),
    payment_transaction_id VARCHAR(255),

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_subs_user ON subscriptions(user_id);
CREATE INDEX idx_subs_status ON subscriptions(status);
```

---

## 15. 📜 LEGAL CERTIFICATES & AUTHORIZED DOCUMENTS (INDIA)

### legal_certificates
```sql
CREATE TABLE legal_certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Linkage
    entity_type VARCHAR(50) NOT NULL CHECK (entity_type IN ('PROJECT', 'TOWER', 'PHASE', 'UNIT')),
    entity_id UUID NOT NULL,
    project_id UUID REFERENCES projects(id), -- Always linked to project

    -- Certificate classification
    certificate_type VARCHAR(100) NOT NULL CHECK (certificate_type IN (
        'RERA_REGISTRATION',
        'BUILDING_PLAN_APPROVAL',
        'COMMENCEMENT_CERTIFICATE',
        'OCCUPANCY_CERTIFICATE',
        'COMPLETION_CERTIFICATE',
        'FIRE_NOC',
        'ENVIRONMENTAL_CLEARANCE',
        'AIRPORT_AUTHORITY_NOC',
        'ENCUMBRANCE_CERTIFICATE',
        'SALE_DEED',
        'LINK_DOCUMENT',
        'LAND_CONVERSION_ORDER',
        'SURVEY_SKETCH',
        'LOCAL_BODY_PERMISSION',
        'WATER_CONNECTION_NOC',
        'ELECTRICITY_CONNECTION_NOC',
        'TITLE_DEED',
        'MUTATION_ORDER',
        'TAX_CLEARANCE',
        'COURT_ORDER'
    )),

    certificate_name VARCHAR(255) NOT NULL,
    certificate_number VARCHAR(100),

    -- Issuing authority
    issuing_authority VARCHAR(255) NOT NULL, -- "BBMP", "RERA Karnataka", "Fire Department"
    authority_type VARCHAR(50), -- GOVT, STATUTORY, LOCAL_BODY
    authority_website VARCHAR(500),
    authority_contact VARCHAR(100),

    -- Validity
    issue_date DATE NOT NULL,
    expiry_date DATE,
    is_perpetual BOOLEAN DEFAULT FALSE,

    -- Status tracking
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN (
        'PENDING', 'APPLIED', 'APPROVED', 'ISSUED', 'EXPIRED',
        'REVOKED', 'SUPERSEDED', 'REJECTED'
    )),

    -- Document storage
    document_url VARCHAR(500) NOT NULL,
    document_hash VARCHAR(64) NOT NULL, -- SHA-256 for integrity
    document_format VARCHAR(20), -- PDF, IMAGE, SCANNED
    document_size_bytes BIGINT,

    -- Verification
    verification_method VARCHAR(50) CHECK (verification_method IN (
        'PORTAL_CROSSCHECK', 'DIGITAL_SIGNATURE', 'HASH_VERIFICATION',
        'MANUAL_LEGAL_REVIEW', 'AUTHORITY_CONFIRMATION'
    )),
    verification_status VARCHAR(20) DEFAULT 'PENDING' CHECK (verification_status IN (
        'PENDING', 'IN_REVIEW', 'VERIFIED', 'FAILED', 'EXPIRED'
    )),
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMP,
    verification_notes TEXT,

    -- Portal tracking
    portal_url VARCHAR(500), -- URL to check status on govt portal
    portal_reference_number VARCHAR(100),
    portal_last_checked TIMESTAMP,
    portal_status VARCHAR(50),

    -- AI summary
    ai_summary TEXT, -- Plain-language summary
    key_rights JSONB, -- [{right: "Approved for 500 units", source: "page 2"}]
    key_obligations JSONB, -- [{obligation: "Complete by 2027", source: "clause 5"}]
    validity_period_description TEXT, -- "Valid for 3 years from issue date"

    -- Dependencies
    depends_on_certificate_ids UUID[], -- Certificates this depends on
    blocks_certificate_ids UUID[], -- Certificates blocked by this
    supersedes_certificate_id UUID REFERENCES legal_certificates(id),

    -- Metadata
    uploaded_by UUID REFERENCES users(id),
    upload_source VARCHAR(50), -- BUILDER, LAWYER, GOVT_PORTAL, BUYER

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_certificates_entity ON legal_certificates(entity_type, entity_id);
CREATE INDEX idx_certificates_project ON legal_certificates(project_id);
CREATE INDEX idx_certificates_type ON legal_certificates(certificate_type);
CREATE INDEX idx_certificates_status ON legal_certificates(status);
CREATE INDEX idx_certificates_verification ON legal_certificates(verification_status);
CREATE INDEX idx_certificates_expiry ON legal_certificates(expiry_date) WHERE expiry_date IS NOT NULL;
```

### certificate_verification_log
```sql
CREATE TABLE certificate_verification_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    certificate_id UUID REFERENCES legal_certificates(id) ON DELETE CASCADE,

    -- Verification attempt
    verification_method VARCHAR(50) NOT NULL,
    verifier_id UUID REFERENCES users(id),
    verifier_type VARCHAR(50), -- LAWYER, SYSTEM, AUTHORITY, AUDITOR

    -- Results
    verification_result VARCHAR(20) CHECK (verification_result IN (
        'PASS', 'FAIL', 'PARTIAL', 'UNABLE_TO_VERIFY'
    )),
    findings JSONB, -- Detailed findings
    discrepancies TEXT,
    confidence_score INT CHECK (confidence_score BETWEEN 0 AND 100),

    -- Evidence
    evidence_urls TEXT[],
    portal_screenshot_url VARCHAR(500),

    verified_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_cert_verification_cert ON certificate_verification_log(certificate_id);
CREATE INDEX idx_cert_verification_result ON certificate_verification_log(verification_result);
```

### certificate_dependencies
```sql
CREATE TABLE certificate_dependencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    certificate_id UUID REFERENCES legal_certificates(id) ON DELETE CASCADE,
    depends_on_certificate_id UUID REFERENCES legal_certificates(id) ON DELETE CASCADE,

    -- Dependency type
    dependency_type VARCHAR(50) CHECK (dependency_type IN (
        'PREREQUISITE', 'BLOCKS', 'SUPERSEDES', 'RELATED', 'EXTENDS'
    )),
    dependency_reason TEXT NOT NULL,

    -- Validation
    is_satisfied BOOLEAN DEFAULT FALSE,
    satisfaction_checked_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(certificate_id, depends_on_certificate_id)
);

CREATE INDEX idx_cert_deps_cert ON certificate_dependencies(certificate_id);
CREATE INDEX idx_cert_deps_depends ON certificate_dependencies(depends_on_certificate_id);
```

### missing_certificate_alerts
```sql
CREATE TABLE missing_certificate_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,

    -- Missing certificate
    missing_certificate_type VARCHAR(100) NOT NULL,
    required_for_stage VARCHAR(50), -- PRE_LAUNCH, CONSTRUCTION, HANDOVER
    severity VARCHAR(20) CHECK (severity IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW')),

    -- Alert details
    alert_message TEXT NOT NULL,
    regulatory_implication TEXT, -- What this missing cert means legally
    buyer_risk_level VARCHAR(20),

    -- Resolution tracking
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'ACKNOWLEDGED', 'RESOLVED')),
    expected_resolution_date DATE,
    resolved_at TIMESTAMP,
    resolution_certificate_id UUID REFERENCES legal_certificates(id),

    -- Notifications
    builder_notified BOOLEAN DEFAULT FALSE,
    buyer_visible BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_missing_certs_project ON missing_certificate_alerts(project_id);
CREATE INDEX idx_missing_certs_status ON missing_certificate_alerts(status);
CREATE INDEX idx_missing_certs_severity ON missing_certificate_alerts(severity);
```

---

## 16. 🏛️ AUTHORITY INTERACTION & TRACKING

### authority_follow_ups
```sql
CREATE TABLE authority_follow_ups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Linkage
    certificate_id UUID REFERENCES legal_certificates(id),
    project_id UUID REFERENCES projects(id),

    -- Authority details
    authority_name VARCHAR(255) NOT NULL,
    authority_department VARCHAR(255),
    authority_contact_person VARCHAR(100),
    authority_contact_phone VARCHAR(20),
    authority_contact_email VARCHAR(255),

    -- Application/Request details
    application_number VARCHAR(100),
    application_date DATE NOT NULL,
    application_type VARCHAR(100), -- NEW_APPLICATION, RENEWAL, AMENDMENT, APPEAL

    -- Status tracking
    current_status VARCHAR(50) NOT NULL,
    last_status_update TIMESTAMP DEFAULT NOW(),
    expected_completion_date DATE,

    -- Follow-up actions
    next_follow_up_date DATE,
    follow_up_frequency_days INT DEFAULT 7,
    auto_follow_up_enabled BOOLEAN DEFAULT TRUE,

    -- Communication log
    last_contacted_date DATE,
    last_contacted_by UUID REFERENCES users(id),
    last_contact_method VARCHAR(50), -- EMAIL, PHONE, PORTAL, VISIT

    -- Workflow
    assigned_to UUID REFERENCES users(id), -- Lawyer/consultant managing this
    priority VARCHAR(20) DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),

    -- Notes
    internal_notes TEXT,
    authority_remarks TEXT,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_authority_followups_cert ON authority_follow_ups(certificate_id);
CREATE INDEX idx_authority_followups_project ON authority_follow_ups(project_id);
CREATE INDEX idx_authority_followups_next_date ON authority_follow_ups(next_follow_up_date);
CREATE INDEX idx_authority_followups_assigned ON authority_follow_ups(assigned_to);
```

### authority_communication_log
```sql
CREATE TABLE authority_communication_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follow_up_id UUID REFERENCES authority_follow_ups(id) ON DELETE CASCADE,

    -- Communication details
    communication_type VARCHAR(50) CHECK (communication_type IN (
        'EMAIL_SENT', 'EMAIL_RECEIVED', 'PHONE_CALL', 'PORTAL_SUBMISSION',
        'IN_PERSON_VISIT', 'LETTER_SENT', 'LETTER_RECEIVED'
    )),
    communication_date TIMESTAMP DEFAULT NOW(),

    -- Parties
    from_party VARCHAR(100), -- Trust OS, Builder, Lawyer
    to_party VARCHAR(100), -- Authority name
    contact_person VARCHAR(100),

    -- Content
    subject VARCHAR(255),
    message_summary TEXT,
    full_message TEXT,

    -- Attachments
    attachment_urls TEXT[],

    -- Response
    response_received BOOLEAN DEFAULT FALSE,
    response_date TIMESTAMP,
    response_summary TEXT,

    -- Outcome
    action_items JSONB, -- [{action: "Submit revised plan", deadline: "2026-02-15"}]
    status_change VARCHAR(100),

    logged_by UUID REFERENCES users(id),

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_authority_comms_followup ON authority_communication_log(follow_up_id);
CREATE INDEX idx_authority_comms_date ON authority_communication_log(communication_date);
```

### authority_renewal_reminders
```sql
CREATE TABLE authority_renewal_reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    certificate_id UUID REFERENCES legal_certificates(id) ON DELETE CASCADE,

    -- Renewal details
    renewal_due_date DATE NOT NULL,
    renewal_window_start DATE, -- When renewal can be applied for
    renewal_submitted BOOLEAN DEFAULT FALSE,
    renewal_application_date DATE,

    -- Reminders
    reminder_schedule JSONB NOT NULL, -- [{days_before: 90, sent: true}, {days_before: 30, sent: false}]
    last_reminder_sent TIMESTAMP,

    -- Consequences
    consequence_if_missed TEXT, -- "Project will be deemed illegal"
    risk_level VARCHAR(20) CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),

    -- Workflow
    assigned_to UUID REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN (
        'PENDING', 'REMINDER_SENT', 'RENEWAL_IN_PROGRESS', 'RENEWED', 'EXPIRED'
    )),

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_renewals_cert ON authority_renewal_reminders(certificate_id);
CREATE INDEX idx_renewals_due_date ON authority_renewal_reminders(renewal_due_date);
CREATE INDEX idx_renewals_status ON authority_renewal_reminders(status);
```

---

## 17. 📋 TRANSACTION-READY LEGAL PACK

### transaction_legal_packs
```sql
CREATE TABLE transaction_legal_packs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Transaction linkage
    lead_id UUID REFERENCES leads(id),
    unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
    buyer_id UUID REFERENCES users(id),

    -- Pack metadata
    pack_type VARCHAR(50) DEFAULT 'BOOKING' CHECK (pack_type IN (
        'ENQUIRY', 'BOOKING', 'PRE_SALE', 'SALE', 'HANDOVER', 'RESALE'
    )),
    pack_status VARCHAR(20) DEFAULT 'DRAFT' CHECK (pack_status IN (
        'DRAFT', 'READY', 'SHARED', 'ACKNOWLEDGED', 'ARCHIVED'
    )),

    -- Document checklist
    required_documents JSONB NOT NULL, -- [{doc_type: "RERA", required: true, status: "AVAILABLE"}]
    available_documents JSONB, -- [{doc_type: "RERA", certificate_id: "uuid"}]
    completion_percentage INT CHECK (completion_percentage BETWEEN 0 AND 100),

    -- Risk assessment
    risk_flags JSONB, -- [{risk: "OC pending", severity: "MEDIUM", impact: "Handover delayed"}]
    overall_risk_level VARCHAR(20) CHECK (overall_risk_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    risk_summary TEXT,

    -- Certificate summary
    certificates_summary JSONB, -- [{type: "RERA", status: "VERIFIED", expiry: "2028-01-01"}]
    missing_certificates JSONB, -- [{type: "OC", impact: "Cannot take possession"}]

    -- Pack outputs
    digital_vault_url VARCHAR(500), -- Secure online vault
    pdf_download_url VARCHAR(500), -- Single consolidated PDF
    pack_hash VARCHAR(64), -- For integrity verification
    pack_version INT DEFAULT 1,

    -- Sharing & Access
    shared_with JSONB, -- [{user_id: "uuid", role: "BANK", shared_at: "timestamp"}]
    access_expiry TIMESTAMP,

    -- Timestamps
    generated_at TIMESTAMP DEFAULT NOW(),
    last_updated TIMESTAMP DEFAULT NOW(),
    shared_at TIMESTAMP
);

CREATE INDEX idx_legal_packs_lead ON transaction_legal_packs(lead_id);
CREATE INDEX idx_legal_packs_unit ON transaction_legal_packs(unit_id);
CREATE INDEX idx_legal_packs_buyer ON transaction_legal_packs(buyer_id);
CREATE INDEX idx_legal_packs_status ON transaction_legal_packs(pack_status);
```

### legal_pack_reviews
```sql
CREATE TABLE legal_pack_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pack_id UUID REFERENCES transaction_legal_packs(id) ON DELETE CASCADE,

    -- Reviewer
    reviewer_id UUID REFERENCES users(id),
    reviewer_role VARCHAR(50), -- BUYER, BANK, LAWYER, FAMILY, CONSULTANT

    -- Review details
    reviewed_at TIMESTAMP DEFAULT NOW(),
    review_status VARCHAR(20) CHECK (review_status IN (
        'APPROVED', 'APPROVED_WITH_CONDITIONS', 'REJECTED', 'NEEDS_CLARIFICATION'
    )),

    -- Findings
    comments TEXT,
    concerns JSONB, -- [{concern: "EC shows mortgage", severity: "HIGH"}]
    questions JSONB, -- [{question: "Is OC expected by March?", answered: false}]

    -- Recommendations
    recommendations TEXT,
    additional_documents_requested JSONB,

    -- Sign-off
    digital_signature_url VARCHAR(500),
    acknowledged BOOLEAN DEFAULT FALSE,
    acknowledged_at TIMESTAMP
);

CREATE INDEX idx_pack_reviews_pack ON legal_pack_reviews(pack_id);
CREATE INDEX idx_pack_reviews_reviewer ON legal_pack_reviews(reviewer_id);
CREATE INDEX idx_pack_reviews_status ON legal_pack_reviews(review_status);
```

### legal_pack_access_log
```sql
CREATE TABLE legal_pack_access_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pack_id UUID REFERENCES transaction_legal_packs(id) ON DELETE CASCADE,

    -- Access details
    accessed_by UUID REFERENCES users(id),
    access_type VARCHAR(50) CHECK (access_type IN (
        'VIEW', 'DOWNLOAD', 'SHARE', 'UPDATE', 'REVIEW'
    )),
    accessed_at TIMESTAMP DEFAULT NOW(),

    -- Context
    ip_address INET,
    user_agent TEXT,
    access_source VARCHAR(50), -- WEB, MOBILE, API

    -- Audit
    is_authorized BOOLEAN DEFAULT TRUE,
    authorization_token VARCHAR(255)
);

CREATE INDEX idx_pack_access_pack ON legal_pack_access_log(pack_id);
CREATE INDEX idx_pack_access_user ON legal_pack_access_log(accessed_by);
CREATE INDEX idx_pack_access_time ON legal_pack_access_log(accessed_at);
```

---

## 18. 📊 CERTIFICATE ANALYTICS & VISUALIZATION

### certificate_timelines
```sql
CREATE TABLE certificate_timelines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,

    -- Timeline data
    timeline_type VARCHAR(50) DEFAULT 'APPROVAL_SEQUENCE',

    -- Milestones
    milestones JSONB NOT NULL, -- [{cert_type: "RERA", status: "APPROVED", date: "2024-01-15"}]

    -- Dependencies visualization
    dependency_graph JSONB, -- Graph structure for visualization

    -- Critical path
    critical_path JSONB, -- [{step: "Building Plan", blocking: true, eta: "2026-03-01"}]

    -- Delays
    delayed_milestones JSONB, -- [{cert_type: "OC", delay_days: 45, impact: "HIGH"}]

    -- Generated visualization
    timeline_svg TEXT, -- SVG for visualization
    gantt_chart_url VARCHAR(500),

    computed_at TIMESTAMP DEFAULT NOW(),
    next_update_at TIMESTAMP
);

CREATE INDEX idx_cert_timelines_project ON certificate_timelines(project_id);
```

### certificate_checklists
```sql
CREATE TABLE certificate_checklists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    stage VARCHAR(50) NOT NULL, -- PRE_LAUNCH, CONSTRUCTION, HANDOVER, POST_HANDOVER

    -- Checklist
    checklist_items JSONB NOT NULL, -- [{cert_type: "RERA", required: true, status: "COMPLETE"}]
    completion_percentage INT CHECK (completion_percentage BETWEEN 0 AND 100),

    -- Critical gaps
    critical_gaps JSONB, -- [{cert_type: "Fire NOC", impact: "Cannot handover"}]

    -- Buyer visibility
    buyer_facing_summary TEXT, -- Plain language summary
    risk_indicator VARCHAR(20), -- GREEN, YELLOW, RED

    last_updated TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_cert_checklists_project ON certificate_checklists(project_id);
CREATE INDEX idx_cert_checklists_stage ON certificate_checklists(stage);
```

---

**LAST UPDATED**: January 9, 2026
**STATUS**: ✅ Complete Trust OS Schema Coverage with Legal Infrastructure
**MAINTAINER**: AGENT-ARCH
