# Propmubi Database Schema Domain Model
## Comprehensive Database Architecture & Design

**Version:** 1.0
**Date:** December 2025
**Purpose:** LLM-friendly guide for generating database schemas, migrations, and data models

---

## Table of Contents
1. [Database Architecture Overview](#database-architecture-overview)
2. [PostgreSQL Schema (Relational Data)](#postgresql-schema-relational-data)
3. [MongoDB Schema (Document Data)](#mongodb-schema-document-data)
4. [Redis Cache Schema](#redis-cache-schema)
5. [Indexing Strategy](#indexing-strategy)
6. [Data Relationships](#data-relationships)
7. [Migration & Seeding](#migration--seeding)
8. [Backup & Recovery](#backup--recovery)

---

## Database Architecture Overview

### Multi-Database Strategy
```
┌──────────────────────────────────────────┐
│ Application Layer                        │
└──────────────┬──────────────┬────────────┘
               │              │
       ┌───────▼──────┐  ┌───▼────────┐
       │ PostgreSQL   │  │  MongoDB   │
       │ (Primary)    │  │(Documents) │
       └───────┬──────┘  └───┬────────┘
               │              │
       ┌───────▼──────────────▼────────┐
       │         Redis (Cache)          │
       └────────────────────────────────┘
```

### Database Selection Criteria
| Data Type | Database | Reason |
|-----------|----------|--------|
| Users, Payments, Transactions | PostgreSQL | ACID compliance, complex joins |
| Properties, Searches | MongoDB | Flexible schema, geo-queries |
| Sessions, Cache | Redis | In-memory, fast access |
| Analytics | ClickHouse | Time-series, aggregations |
| Search | Elasticsearch | Full-text search |

---

## PostgreSQL Schema (Relational Data)

### 1. Users & Authentication

#### users table

The users table stores core user information with the following fields:
- id: UUID primary key with random generation
- email: VARCHAR(255), not null, unique
- phone: VARCHAR(20), not null, unique
- password_hash: VARCHAR(255), not null
- name: VARCHAR(255)

Authentication fields:
- email_verified: BOOLEAN default false
- phone_verified: BOOLEAN default false
- email_verified_at: TIMESTAMP
- phone_verified_at: TIMESTAMP
- last_login_at: TIMESTAMP

Profile fields:
- role: VARCHAR(50), not null, constrained to BUYER, SELLER, AGENT, BUILDER, TENANT, LANDLORD, ADMIN
- kyc_status: VARCHAR(50), default PENDING, constrained to PENDING, VERIFIED, REJECTED

Financial fields:
- cibil_score: INTEGER, constrained between 300 and 900
- cibil_last_checked: TIMESTAMP

Subscription fields:
- subscription_plan: VARCHAR(50), default FREE, constrained to FREE, BASIC, PREMIUM, ENTERPRISE
- subscription_valid_until: TIMESTAMP

Timestamps:
- created_at: TIMESTAMP default now
- updated_at: TIMESTAMP default now
- deleted_at: TIMESTAMP

Indexes on email, phone, role, and created_at.

---

#### user_kyc table

The user_kyc table tracks KYC document verification:
- id: UUID primary key
- user_id: UUID, not null, references users with cascade delete

Document details:
- document_type: VARCHAR(50), not null, constrained to AADHAAR, PAN, PASSPORT, DRIVING_LICENSE, VOTER_ID
- document_number: VARCHAR(100), not null
- document_url: TEXT for S3 URL

Verification fields:
- verification_status: VARCHAR(50), default PENDING, constrained to PENDING, APPROVED, REJECTED
- verified_by: UUID referencing users
- verified_at: TIMESTAMP
- rejection_reason: TEXT

Metadata:
- created_at: TIMESTAMP default now
- updated_at: TIMESTAMP default now

Unique constraint on user_id and document_type combination.

---

### 2. Payments & Transactions

#### payments table

The payments table records all payment transactions:
- id: UUID primary key
- user_id: UUID, not null, references users
- property_id: UUID, can be null for subscriptions

Payment details:
- type: VARCHAR(50), not null, constrained to TOKEN, BOOKING, INSTALLMENT, SUBSCRIPTION, DUE_DILIGENCE, FOOTFALL_REPORT, AUCTION_PREMIUM
- amount: DECIMAL(12,2), not null, must be positive
- currency: VARCHAR(3), default INR

Status:
- status: VARCHAR(20), not null, constrained to PENDING, SUCCESS, FAILED, REFUNDED, EXPIRED

Payment gateway (Razorpay):
- gateway: VARCHAR(20), default RAZORPAY
- gateway_order_id: VARCHAR(100), unique
- gateway_payment_id: VARCHAR(100)
- gateway_signature: VARCHAR(255)

Refund details:
- refundable: BOOLEAN default false
- refunded_at: TIMESTAMP
- refund_amount: DECIMAL(12,2)
- refund_reason: TEXT

Expiry for tokens:
- expires_at: TIMESTAMP

Metadata:
- metadata: JSONB for additional payment-specific data
- created_at: TIMESTAMP default now
- updated_at: TIMESTAMP default now

Indexes on user_id, property_id, status, created_at, and gateway_order_id.

---

#### transactions table (Double-entry bookkeeping)

The transactions table implements double-entry accounting:
- id: UUID primary key
- payment_id: UUID referencing payments

Transaction details:
- type: VARCHAR(50), not null, constrained to CREDIT or DEBIT
- amount: DECIMAL(12,2), not null

Balance tracking:
- balance_before: DECIMAL(12,2)
- balance_after: DECIMAL(12,2)

Description:
- description: TEXT
- metadata: JSONB

Timestamp:
- created_at: TIMESTAMP default now

Indexes on payment_id and created_at.

---

### 3. Builder & Project Management

#### builders table

The builders table stores builder/developer information:
- id: UUID primary key
- name: VARCHAR(255), not null
- slug: VARCHAR(255), unique, not null

Company details:
- company_type: VARCHAR(100)
- registration_number: VARCHAR(100)
- established_year: INTEGER

Contact information:
- email: VARCHAR(255)
- phone: VARCHAR(20)
- website: TEXT
- address: TEXT

Reputation metrics:
- reputation_score: DECIMAL(3,2), constrained between 0 and 5
- total_reviews: INTEGER, default 0
- total_projects: INTEGER, default 0
- completed_projects: INTEGER, default 0

Verification:
- rera_verified: BOOLEAN, default false
- verified_at: TIMESTAMP

Metadata:
- logo_url: TEXT
- description: TEXT
- created_at: TIMESTAMP default now
- updated_at: TIMESTAMP default now

Indexes on slug and reputation_score.

---

#### projects table

The projects table stores real estate project information:
- id: UUID primary key
- builder_id: UUID, not null, references builders

Basic info:
- name: VARCHAR(255), not null
- slug: VARCHAR(255), unique, not null
- type: VARCHAR(50), constrained to APARTMENT_COMPLEX, VILLA_PROJECT, PLOTTED_DEVELOPMENT, COMMERCIAL_COMPLEX, MIXED_USE

Status:
- status: VARCHAR(50), not null, constrained to UPCOMING, UNDER_CONSTRUCTION, READY, COMPLETED

RERA:
- rera_id: VARCHAR(100), unique
- rera_status: VARCHAR(50), constrained to VERIFIED, PENDING, EXPIRED, NOT_FOUND
- rera_expiry_date: DATE

Location:
- address: TEXT
- city: VARCHAR(100)
- state: VARCHAR(50)
- pincode: VARCHAR(10)
- latitude: DECIMAL(10,8)
- longitude: DECIMAL(11,8)

Project details:
- total_acres: DECIMAL(10,2)
- total_units: INTEGER
- available_units: INTEGER
- sold_units: INTEGER

Timeline:
- launch_date: DATE
- expected_completion_date: DATE
- actual_completion_date: DATE
- possession_date: DATE

Approvals:
- approvals: JSONB to store all approval documents

Media:
- images: TEXT array for image URLs
- brochure_url: TEXT
- master_plan_url: TEXT

Timestamps:
- created_at: TIMESTAMP default now
- updated_at: TIMESTAMP default now

Indexes on builder_id, slug, city, status, and rera_id.

PostGIS extension enables geospatial queries with geography column for location (POINT, 4326 SRID). Location is populated from latitude/longitude coordinates. Spatial index created using GIST on location column.

---

### 4. Property Units (Inventory)

#### unit_templates table

The unit_templates table defines property unit types:
- id: UUID primary key
- project_id: UUID, not null, references projects

Template details:
- code: VARCHAR(50), not null (e.g., "3BHK-E-TypeA")
- type: VARCHAR(50), constrained to APARTMENT, VILLA, PLOT, SHOP, OFFICE

Specifications:
- bedrooms: INTEGER
- bathrooms: INTEGER
- facing: VARCHAR(10), constrained to NORTH, SOUTH, EAST, WEST, NE, NW, SE, SW

Area in sqft:
- carpet_area: INTEGER
- built_up_area: INTEGER
- super_built_up_area: INTEGER

Floor plan:
- floor_plan_url: TEXT
- room_layout: JSONB for detailed room dimensions

Pricing:
- base_price_per_sqft: DECIMAL(10,2)

Timestamps:
- created_at: TIMESTAMP default now
- updated_at: TIMESTAMP default now

Unique constraint on project_id and code combination.

---

#### unit_instances table

The unit_instances table tracks individual property units:
- id: UUID primary key
- template_id: UUID, not null, references unit_templates
- project_id: UUID, not null, references projects

Unit identification:
- unit_number: VARCHAR(50), not null (e.g., "A-101", "Tower-B-1505")
- floor_number: INTEGER
- tower: VARCHAR(50)

Status:
- status: VARCHAR(50), not null, default AVAILABLE, constrained to AVAILABLE, LOCKED, BOOKED, SOLD, BLOCKED

Locking (Token payment):
- locked_by: UUID referencing users
- locked_until: TIMESTAMP
- lock_payment_id: UUID referencing payments

Booking:
- booked_by: UUID referencing users
- booked_at: TIMESTAMP

Pricing:
- total_price: DECIMAL(12,2), not null
- price_breakdown: JSONB for detailed cost breakdown

Discount:
- discount_code: VARCHAR(50)
- discount_amount: DECIMAL(12,2), default 0

Timestamps:
- created_at: TIMESTAMP default now
- updated_at: TIMESTAMP default now

Indexes on template_id, project_id, status, and unit_number. Unique constraint on project_id and unit_number combination.

---

### 5. Rental Management

#### rental_agreements table

The rental_agreements table stores lease agreements:
- id: UUID primary key
- property_id: UUID, not null (can reference MongoDB property)

Parties:
- landlord_id: UUID, not null, references users
- tenant_id: UUID, not null, references users

Agreement details:
- monthly_rent: DECIMAL(10,2), not null
- security_deposit: DECIMAL(10,2), not null
- deposit_months: INTEGER, not null (1, 2, or 6)

CIBIL-based deposit:
- tenant_cibil_score: INTEGER
- cibil_verified_at: TIMESTAMP
- deposit_discount_applied: DECIMAL(10,2), default 0

Duration:
- start_date: DATE, not null
- end_date: DATE, not null
- lease_period_months: INTEGER, not null

Status:
- status: VARCHAR(50), constrained to DRAFT, ACTIVE, EXPIRED, TERMINATED, RENEWED

Inspection:
- move_in_inspection_id: UUID
- move_out_inspection_id: UUID

Documents:
- agreement_document_url: TEXT
- signed_at: TIMESTAMP

Timestamps:
- created_at: TIMESTAMP default now
- updated_at: TIMESTAMP default now

Indexes on landlord_id, tenant_id, and status.

---

#### rental_inspections table

The rental_inspections table records property condition inspections:
- id: UUID primary key
- agreement_id: UUID, not null, references rental_agreements

Inspection type:
- type: VARCHAR(50), constrained to MOVE_IN or MOVE_OUT

Inspector:
- inspector_id: UUID referencing users
- inspection_date: TIMESTAMP, not null

AI analysis:
- ai_analysis: JSONB for room-wise damage detection
- images: JSONB for array of images with metadata

IPFS (immutable storage):
- ipfs_hash: VARCHAR(255)

Report:
- report_url: TEXT
- overall_condition: VARCHAR(50), constrained to EXCELLENT, GOOD, FAIR, POOR

Deposit settlement (for move-out):
- deposit_deductions: JSONB
- deposit_refund_amount: DECIMAL(10,2)

Timestamp:
- created_at: TIMESTAMP default now

Index on agreement_id.

---

### 6. Due Diligence & Reports

#### due_diligence_reports table

The due_diligence_reports table stores verification reports:
- id: UUID primary key
- property_id: UUID, not null
- requested_by: UUID, not null, references users

Workflow tracking:
- workflow_id: VARCHAR(255) for Temporal workflow ID
- status: VARCHAR(50), constrained to PROCESSING, COMPLETED, FAILED

Scores:
- overall_score: INTEGER, constrained between 0 and 100

Individual checks:
- rera_check: JSONB
- land_title_check: JSONB
- market_price_check: JSONB
- legal_check: JSONB

Recommendations:
- recommendations: TEXT array
- red_flags: TEXT array

Report:
- report_url: TEXT
- report_generated_at: TIMESTAMP
- report_expires_at: TIMESTAMP (90 days validity)

Payment:
- payment_id: UUID referencing payments
- amount_charged: DECIMAL(10,2)

Timestamps:
- created_at: TIMESTAMP default now
- updated_at: TIMESTAMP default now

Indexes on property_id, requested_by, and status.

---

### 7. Community Management

#### communities table

The communities table stores RWA/community information:
- id: UUID primary key
- project_id: UUID referencing projects

Community details:
- name: VARCHAR(255), not null
- type: VARCHAR(50), constrained to GATED_COMMUNITY, APARTMENT_COMPLEX, VILLA_COMMUNITY

Administration:
- rwa_president_id: UUID referencing users
- rwa_contact_email: VARCHAR(255)
- rwa_contact_phone: VARCHAR(20)

Units:
- total_units: INTEGER
- occupied_units: INTEGER

Subscription:
- subscription_plan: VARCHAR(50)
- subscription_amount_per_unit: DECIMAL(10,2)

Timestamps:
- created_at: TIMESTAMP default now
- updated_at: TIMESTAMP default now

---

#### community_polls table

The community_polls table manages community voting:
- id: UUID primary key
- community_id: UUID, not null, references communities

Poll details:
- question: TEXT, not null
- description: TEXT
- options: JSONB, not null, array of option objects

Created by:
- created_by: UUID, not null, references users

Voting rules:
- quorum_required: INTEGER (percentage of units)
- restrict_to_owners: BOOLEAN, default false

Timeline:
- starts_at: TIMESTAMP, default now
- ends_at: TIMESTAMP, not null

Status:
- status: VARCHAR(50), default ACTIVE, constrained to DRAFT, ACTIVE, CLOSED, CANCELLED

Results:
- total_votes: INTEGER, default 0
- quorum_met: BOOLEAN, default false
- winning_option_id: UUID

Timestamps:
- created_at: TIMESTAMP default now
- updated_at: TIMESTAMP default now

Indexes on community_id and status.

---

#### community_votes table

The community_votes table records individual votes:
- id: UUID primary key
- poll_id: UUID, not null, references community_polls
- user_id: UUID, not null, references users

Vote details:
- option_id: UUID, not null
- unit_number: VARCHAR(50)

Verification:
- vote_verified: BOOLEAN, default true

Timestamp:
- voted_at: TIMESTAMP default now

Unique constraint on poll_id, user_id, and unit_number combination. Index on poll_id.

---

### 8. Satellite Monitoring (Lifecycle)

#### satellite_subscriptions table

The satellite_subscriptions table manages property monitoring:
- id: UUID primary key
- user_id: UUID, not null, references users

Property details:
- property_id: UUID
- survey_number: VARCHAR(100)
- location: GEOGRAPHY (POINT, 4326), not null

Subscription:
- frequency: VARCHAR(50), constrained to WEEKLY, BIWEEKLY, MONTHLY
- amount: DECIMAL(10,2) (₹499/month)

Status:
- status: VARCHAR(50), default ACTIVE, constrained to ACTIVE, PAUSED, CANCELLED

Monitoring:
- last_check_date: TIMESTAMP
- next_check_date: TIMESTAMP

Timestamps:
- created_at: TIMESTAMP default now
- updated_at: TIMESTAMP default now

Indexes on user_id and next_check_date.

---

#### satellite_images table

The satellite_images table stores satellite imagery data:
- id: UUID primary key
- subscription_id: UUID, not null, references satellite_subscriptions

Image details:
- image_url: TEXT, not null (Sentinel Hub URL)
- capture_date: TIMESTAMP, not null
- satellite_source: VARCHAR(50) (e.g., 'Sentinel-2', 'Landsat-8')

Change detection:
- change_percentage: DECIMAL(5,2)
- change_type: VARCHAR(50), constrained to CONSTRUCTION, VEGETATION, EXCAVATION, NORMAL
- alert_triggered: BOOLEAN, default false

Analysis:
- ai_analysis: JSONB

Timestamp:
- created_at: TIMESTAMP default now

Indexes on subscription_id and capture_date.

---

## MongoDB Schema (Document Data)

### 1. Properties Collection

The properties collection stores property listings with flexible schema including:

Basic info: _id (ObjectId), id string, title, description, type (APARTMENT)

Location with GeoJSON:
- address, city, state, pincode
- coordinates object with lat/lng
- geoLocation with type "Point" and coordinates array (lng, lat order for MongoDB)

Area details: carpet, builtUp, superBuiltUp sqft, unit

Property details: bedrooms, bathrooms, balconies, facing, floorNumber, totalFloors

Pricing: price, pricePerSqft, priceBreakdown object with basePrice, floorRiseCharge, parkingCharge, clubMembership, gst

Verification: reraNumber, reraStatus, landTitleStatus, trustScore, lastVerified (ISODate)

Media: images array (URLs), videos array, tour3D URL, floorPlan URL

Ownership: ownerId, ownerType, builderId, projectId

Status: status, lockedBy, lockedUntil

Amenities: array of amenity names

Nearby facilities: schools, hospitals, malls with name, distance, unit

Analytics: views, saves, inquiries counts

Timestamps: createdAt, updatedAt (ISODate)

Indexes:
- 2dsphere on location.geoLocation
- Compound on price and area.builtUp
- Single field on verification.reraNumber
- Compound on status and createdAt (descending)
- Compound on location.city and type
- Single field on builderId and projectId

---

### 2. Searches Collection (User search history)

The searches collection tracks user searches with userId, filters object (city, priceRange, bedrooms, propertyType, status, reraVerified, minTrustScore), sortBy preference, resultCount, saved flag, alertsEnabled flag, searchedAt timestamp, and lastAlertSent timestamp.

Indexes on userId with searchedAt (descending), and userId with saved flag.

---

### 3. Audit Logs Collection

The audit_logs collection records system events with _id, event name, entity type, entityId, userId, userRole, ipAddress, userAgent, before/after state objects, metadata object, and timestamp (ISODate).

Indexes on userId and timestamp (descending), event and timestamp (descending), and entityId.

TTL index on timestamp with expireAfterSeconds set to 63072000 (2 years) for auto-deletion.

---

### 4. Notifications Collection

The notifications collection manages user notifications with _id, userId, type, title, message, data object, channels array (IN_APP, EMAIL, PUSH), sentChannels array, read flag, readAt timestamp, priority level, and createdAt timestamp.

Indexes on userId with createdAt (descending), and userId with read flag.

TTL index on createdAt with expireAfterSeconds set to 7776000 (90 days) for auto-deletion.

---

## Redis Cache Schema

### 1. Session Management

Key format: session:{token}
Value: JSON string with userId, email, role, expiresAt
TTL: 7 days (604800 seconds)

Example SETEX command stores session data with automatic expiration.

---

### 2. Property Cache

Key format: property:{id}
Value: JSON string with complete property object
TTL: 5 minutes (300 seconds)

Example SETEX command caches property data.

---

### 3. Search Results Cache

Key format: search:{hash}
Value: JSON string with properties array, total count, facets
TTL: 2 minutes (120 seconds)

Hash is generated from search filters. SETEX command stores cached results.

---

### 4. Rate Limiting

Key format: ratelimit:{userId}:{endpoint}
Value: Request count
TTL: 15 minutes (900 seconds)

INCR increments counter, EXPIRE sets TTL.

---

### 5. CIBIL Score Cache

Key format: cibil:{userId}
Value: JSON string with score, scoreRange, reportDate
TTL: 30 days (2592000 seconds)

SETEX caches CIBIL scores for extended period.

---

### 6. RERA Verification Cache

Key format: rera:{reraNumber}
Value: JSON string with status, projectName, builderName, expiryDate
TTL: 24 hours (86400 seconds)

SETEX caches RERA verification results.

---

## Indexing Strategy

### PostgreSQL Indexes

#### B-Tree Indexes (Default)

Primary keys are indexed automatically. Foreign key indexes created on user_id, property_id. Frequently queried columns like email, city indexed. Composite indexes for common query patterns like city and status combination.

---

#### GiST Indexes (Geospatial)

For PostGIS geography columns, GIST indexes enable spatial queries. Example query finds projects within 5km radius using ST_DWithin function with geography type.

---

#### Partial Indexes

Indexes only specific subsets like active properties (where status = 'AVAILABLE') or verified builders (where rera_verified = TRUE).

---

### MongoDB Indexes

#### Single Field Indexes

Created on status, price, createdAt (descending) for simple queries.

---

#### Compound Indexes

Created for common query combinations like location.city with type, and price with area.builtUp.

---

#### Geospatial Indexes (2dsphere)

Created on location.geoLocation for proximity queries. Example query uses $near operator with $geometry and $maxDistance (5km).

---

#### Text Indexes (Full-text search)

Created on title, description, and location.address fields. Example search query uses $text with $search operator.

---

## Data Relationships

### Entity Relationship Diagram
```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   Users     │───────│  Payments   │───────│  Properties │
│             │ 1   * │             │ *   1 │  (MongoDB)  │
│ - id        │       │ - user_id   │       │ - id        │
│ - email     │       │ - property_id│      │ - title     │
│ - role      │       │ - amount    │       │ - price     │
└─────────────┘       └─────────────┘       └─────────────┘
      │                                            │
      │ 1                                          │ *
      │                                            │
      ▼ *                                          ▼ 1
┌─────────────┐                             ┌─────────────┐
│  User KYC   │                             │  Projects   │
│             │                             │             │
│ - user_id   │                             │ - id        │
│ - doc_type  │                             │ - builder_id│
└─────────────┘                             └─────────────┘
                                                  │
                                                  │ 1
                                                  │
                                                  ▼ *
                                            ┌─────────────┐
                                            │  Builders   │
                                            │             │
                                            │ - id        │
                                            │ - name      │
                                            └─────────────┘
```

---

## Migration & Seeding

### Prisma Migration Example

The Prisma schema defines the database structure with generator client for JavaScript/TypeScript, datasource using PostgreSQL, and models for User and Payment entities. User model includes id (UUID), email (unique string), passwordHash, role, createdAt timestamp, and payments relation. Payment model includes id, userId, amount (Decimal), status, createdAt, and user relation. Indexes are defined on email, role for users, and userId, status for payments.

---

### Seed Data Script

The seed script uses PrismaClient to populate initial data. It creates sample builders with name, slug, established year, reputation score, and project counts. Then creates projects linked to builders with name, slug, type, status, RERA ID, city, and total units. The script handles errors and ensures proper disconnection.

---

## Backup & Recovery

### Automated Backup Strategy

Scheduled backup jobs:
- PostgreSQL: Daily at 2 AM using pg_dump, output to dated file
- MongoDB: Daily at 3 AM using mongodump, output to dated directory
- Redis: Every 6 hours using BGSAVE for snapshots

Retention policy: 7 daily backups, 4 weekly backups, 12 monthly backups

---

### Point-in-Time Recovery

PostgreSQL PITR requires WAL archiving enabled. Restore command uses pg_restore with --create and --dbname flags, specifying target timestamp for point-in-time recovery to specific moment.

---

**End of Database Domain Model**

This comprehensive database schema serves as the foundation for all data storage, retrieval, and analytics needs of the Propmubi platform. Each table and collection is designed with scalability, performance, and data integrity in mind.
