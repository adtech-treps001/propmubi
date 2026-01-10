-- Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";  -- For geospatial searches
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- For text search

-- 1. BUILDERS & PROVIDERS
CREATE TABLE builders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    logo_url VARCHAR(255),
    website VARCHAR(255),
    rating DECIMAL(3, 2) DEFAULT 0,
    review_count INT DEFAULT 0,
    established_year INT,
    total_projects INT DEFAULT 0,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    external_ids JSONB DEFAULT '{}', -- { "99acres": "id_1", "magicbricks": "id_2" }
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. PROJECTS (RERA Core)
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    builder_id UUID REFERENCES builders(id),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    rera_id VARCHAR(50) UNIQUE,
    rera_status VARCHAR(50), -- REGISTERED, EXPIRED, REVOKED
    status VARCHAR(50), -- PRE_LAUNCH, UNDER_CONSTRUCTION, READY
    project_type VARCHAR(50), -- APARTMENT, VILLA, PLOT
    
    -- Location
    address TEXT,
    city VARCHAR(100) NOT NULL,
    locality VARCHAR(100) NOT NULL,
    pincode VARCHAR(10),
    lat DECIMAL(10, 8),
    lng DECIMAL(11, 8),
    location GEOGRAPHY(POINT, 4326),
    
    -- Specs
    total_area_acres DECIMAL(10, 2),
    total_towers INT,
    total_units INT,
    possession_date DATE,
    launch_date DATE,
    
    -- Media & Metadata
    description TEXT,
    amenities JSONB DEFAULT '[]', -- ["pool", "gym", "clubhouse"]
    images JSONB DEFAULT '[]',
    brochure_url VARCHAR(255),
    
    -- Sync Meta
    last_synced_at TIMESTAMP WITH TIME ZONE,
    source_metadata JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_projects_location ON projects USING GIST (location);
CREATE INDEX idx_projects_rera ON projects(rera_id);
CREATE INDEX idx_projects_city_locality ON projects(city, locality);

-- 3. TOWERS & STRUCTURE
CREATE TABLE towers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL, -- "Tower A", "Block 1"
    total_floors INT,
    units_per_floor INT,
    rera_completion_date DATE,
    current_status_percentage INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. INVENTORY TEMPLATES (Floor Plans)
CREATE TABLE floor_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(100), -- "3BHK Type A"
    bhk_type VARCHAR(20), -- "1BHK", "2BHK", "3BHK", "4BHK+"
    carpet_area_sqft INT,
    built_up_area_sqft INT,
    super_built_up_area_sqft INT,
    base_price DECIMAL(15, 2),
    image_url VARCHAR(255),
    facing VARCHAR(50), -- "East", "West", etc.
    features JSONB, -- ["Study Room", "Servant Room"]
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. UNITS INVENTORY (The actual stock)
CREATE TABLE units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id),
    tower_id UUID REFERENCES towers(id),
    floor_plan_id UUID REFERENCES floor_plans(id),
    
    unit_number VARCHAR(20) NOT NULL, -- "A-1201"
    floor_number INT,
    
    -- Pricing (Specific to unit)
    total_price DECIMAL(15, 2),
    price_per_sqft DECIMAL(10, 2),
    plc_charges DECIMAL(12, 2) DEFAULT 0, -- Preferential Location Charges
    
    -- Status Management
    status VARCHAR(50) DEFAULT 'AVAILABLE', -- AVAILABLE, BLOCKED, SOLD, RESERVED
    visibility VARCHAR(50) DEFAULT 'PUBLIC', -- PUBLIC, AGENT_ONLY, HIDDEN
    
    -- Sync info
    builder_crm_id VARCHAR(100),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT unique_unit_per_project UNIQUE (project_id, unit_number)
);

CREATE INDEX idx_units_status ON units(status);
CREATE INDEX idx_units_price ON units(total_price);

-- 6. BUYERS & PERSONAS
CREATE TABLE buyers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(100) UNIQUE, -- External Auth ID (Firebase/Auth0)
    full_name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    is_phone_verified BOOLEAN DEFAULT FALSE,
    
    -- Persona (AI Classified)
    persona VARCHAR(50), -- 'end_user_family', 'investor_yield', etc.
    persona_confidence DECIMAL(3, 2),
    persona_metadata JSONB, -- { "risk_tolerance": "low", "timeline": "immediate" }
    
    -- Financials (Encrypted/Tokenized ideally)
    budget_min DECIMAL(15, 2),
    budget_max DECIMAL(15, 2),
    cibil_score INT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. AGENTS
CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    rera_reg_no VARCHAR(50),
    
    -- Performance
    rating DECIMAL(3, 2),
    total_deals INT DEFAULT 0,
    total_revenue DECIMAL(15, 2) DEFAULT 0,
    
    -- Microsite
    microsite_subdomain VARCHAR(100) UNIQUE,
    microsite_config JSONB,
    
    status VARCHAR(20) DEFAULT 'ACTIVE', -- ACTIVE, PENDING, SUSPENDED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. LEADS (The Core Transactional Entity)
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id UUID REFERENCES buyers(id),
    project_id UUID REFERENCES projects(id),
    unit_id UUID REFERENCES units(id), -- Optional, if specific unit selected
    assigned_agent_id UUID REFERENCES agents(id),
    
    -- Lead State
    status VARCHAR(50) DEFAULT 'NEW', -- NEW, QUALIFIED, VISITED, NEGOTIATION, BOOKED, LOST
    qualification_score INT, -- 0-100 (AI Generated)
    
    -- Source & Intent
    source VARCHAR(50), -- WEBSITE, REFERRAL, WHATSAPP
    intent_level VARCHAR(20), -- HIGH, MEDIUM, LOW
    
    -- AI Context
    ai_summary TEXT, -- "Buyer looking for 3BHK, urgent move-in"
    next_action VARCHAR(255),
    next_action_due TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_leads_agent_status ON leads(assigned_agent_id, status);

-- 9. LEAD INTERACTION LOGS
CREATE TABLE lead_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id),
    actor_id UUID, -- Agent or System
    interaction_type VARCHAR(50), -- CALL, WHATSAPP, EMAIL, SITE_VISIT
    content TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. CONSENT & PRIVACY (GDPR/DPDP Compliance)
CREATE TABLE consents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id UUID REFERENCES buyers(id),
    purpose VARCHAR(100), -- "share_details_with_builder"
    entity_id UUID, -- Builder/Agent ID
    status VARCHAR(20), -- GRANTED, REVOKED
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    revoked_at TIMESTAMP WITH TIME ZONE,
    ip_address VARCHAR(45)
);

-- 11. AI GENERATED CONTENT
CREATE TABLE content_generated (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(50), -- PROJECT, EMAIL, WHATSAPP
    entity_id UUID,
    target_persona VARCHAR(50),
    content_type VARCHAR(50), -- BROCHURE, TEMPLATE
    content_body TEXT,
    ai_model VARCHAR(50), -- "claude-3-5-sonnet"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. PROVIDER SYNC LOGS
CREATE TABLE provider_sync_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_name VARCHAR(50), -- 99acres, rera_telangana
    status VARCHAR(20), -- SUCCESS, FAILED
    records_processed INT,
    error_log TEXT,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);
