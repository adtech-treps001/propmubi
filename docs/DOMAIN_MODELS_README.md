# Propmubi Domain Models - Complete Documentation

## Overview

This directory contains comprehensive domain models for the Propmubi Real Estate Super App. These documents are designed to be LLM-friendly, enabling AI-assisted code generation for frontend screens, backend APIs, and database schemas.

---

## 📚 Document Catalog

### 🎯 Master Guide
**[DOMAIN_MODEL_MASTER.md](DOMAIN_MODEL_MASTER.md)** - Start here!
- Complete system overview
- Cross-layer reference guide
- LLM prompting best practices
- Implementation roadmap
- Module-by-module summaries

---

### 🎨 Frontend Domain Model
**[DOMAIN_MODEL_UI.md](DOMAIN_MODEL_UI.md)** - UI/UX Specifications
- **50+ Screen Layouts** with wireframes and navigation flows
- **Reusable Component Library**: PropertyCard, TrustScoreBadge, FilterSheet, etc.
- **State Management**: Zustand stores + TanStack Query patterns
- **Form Components**: Search filters, payment forms, inspection camera
- **Data Visualization**: Heatmaps, charts, trust score badges
- **Design System**: Colors, typography, spacing, breakpoints
- **Accessibility**: WCAG compliance guidelines

**Module Coverage**:
- Buy/Sell: Search, Details, Token Payment
- Rental: Deposit Calculator, AI Inspection
- Commercial: Footfall Analytics, Location Intelligence
- Auction: Listings, Alerts
- Lifecycle: Satellite Monitoring, Valuation Ticker
- Community: Notice Board, Voting, Visitor Management
- Land & JV: Verification, Matchmaking

---

### ⚙️ Backend API Domain Model
**[DOMAIN_MODEL_BACKEND_API.md](DOMAIN_MODEL_BACKEND_API.md)** - API Specifications
- **100+ REST Endpoints** across 7 modules
- **TypeScript Interfaces** for requests/responses
- **Authentication**: JWT with role-based access control
- **External Integrations**:
  - RERA APIs (13 states)
  - Dharani/MeeBhoomi (land records)
  - Experian (CIBIL scores)
  - Razorpay (payments)
  - Sentinel Hub (satellite imagery)
  - Swiggy/Zomato (delivery density)
- **Workflow Orchestration**: Temporal.io patterns
- **Error Handling**: Standard error codes and formats
- **Caching Strategy**: Redis TTLs for different data types
- **WebSocket Events**: Real-time property updates

**API Examples**:
```
GET  /api/properties/search          - Property search with filters
POST /api/due-diligence               - Generate verification report
POST /api/rental/calculate-deposit   - CIBIL-based deposit calculator
POST /api/commercial/footfall-analysis - Location analytics
GET  /api/auction/listings            - Bank auction properties
POST /api/lifecycle/satellite/subscribe - Start satellite monitoring
POST /api/community/polls             - Create community poll
POST /api/land/verify                 - Verify land title
```

---

### 💾 Database Schema Domain Model
**[DOMAIN_MODEL_DATABASE.md](DOMAIN_MODEL_DATABASE.md)** - Data Layer
- **PostgreSQL Schema**: 25+ tables with relationships
  - Users, Payments, Transactions
  - Builders, Projects, Unit Instances
  - Rental Agreements, Inspections
  - Community Polls, Votes
  - Satellite Subscriptions, Images
- **MongoDB Collections**: 10+ document schemas
  - Properties (with geospatial indexes)
  - Searches (user search history)
  - Audit Logs (with TTL auto-deletion)
  - Notifications
- **Redis Cache Patterns**:
  - Session management
  - API response caching
  - Rate limiting
  - CIBIL score caching
- **Indexing Strategy**:
  - B-Tree indexes for standard queries
  - GiST indexes for geospatial (PostGIS)
  - 2dsphere indexes for MongoDB geo-queries
  - Full-text search indexes
- **Migration Scripts**: Prisma examples
- **Backup Strategy**: Automated daily backups

---

## 🚀 Quick Start Guide

### For Developers

#### 1. Understanding the Architecture
Start with **[DOMAIN_MODEL_MASTER.md](DOMAIN_MODEL_MASTER.md)** to understand:
- System overview and module breakdown
- Technology stack decisions
- How UI, API, and Database layers connect

#### 2. Building Frontend Screens
Use **[DOMAIN_MODEL_UI.md](DOMAIN_MODEL_UI.md)** to:
- Find screen specifications for your module
- Copy component patterns
- Implement state management
- Follow design system guidelines

**Example**: To build Property Search screen:
```
1. Read Section 1.1 in DOMAIN_MODEL_UI.md
2. Copy PropertyCard component pattern
3. Implement FilterSheet bottom sheet
4. Connect to usePropertyStore (Zustand)
5. Call /api/properties/search endpoint
```

#### 3. Creating Backend APIs
Use **[DOMAIN_MODEL_BACKEND_API.md](DOMAIN_MODEL_BACKEND_API.md)** to:
- Find endpoint specifications
- Copy request/response TypeScript interfaces
- Implement validation with Zod
- Add authentication middleware
- Integrate external services

**Example**: To build Due Diligence API:
```
1. Read Section 1.3 in DOMAIN_MODEL_BACKEND_API.md
2. Copy DueDiligenceRequest/Response interfaces
3. Implement Temporal workflow
4. Integrate RERA, Dharani APIs
5. Calculate trust score algorithm
```

#### 4. Designing Database Tables
Use **[DOMAIN_MODEL_DATABASE.md](DOMAIN_MODEL_DATABASE.md)** to:
- Find table schemas with SQL DDL
- Understand relationships (foreign keys)
- Create indexes for query optimization
- Write Prisma migrations

**Example**: To create payments table:
```
1. Read Section 2 in DOMAIN_MODEL_DATABASE.md
2. Copy SQL CREATE TABLE statement
3. Add indexes on user_id, status, created_at
4. Create Prisma migration
5. Generate Prisma client
```

---

### For LLM-Assisted Development

#### Prompting Patterns

**UI Component Generation**:
```
Generate [ComponentName] based on DOMAIN_MODEL_UI.md Section [X.Y].

Use Tamagui for styling.
Implement with React Native hooks.
Connect to [API endpoint] from DOMAIN_MODEL_BACKEND_API.md.

Include:
- TypeScript types
- Error handling
- Loading states
- Responsive design
```

**API Endpoint Generation**:
```
Generate Express.js endpoint [METHOD] [route] based on DOMAIN_MODEL_BACKEND_API.md Section [X.Y].

Include:
- Zod validation
- JWT authentication
- Error handling
- TypeScript types
- Integration with [external service]

Connect to database table [table_name] from DOMAIN_MODEL_DATABASE.md.
```

**Database Migration**:
```
Generate Prisma migration for [table_name] based on DOMAIN_MODEL_DATABASE.md Section [X].

Include:
- All columns with types
- Foreign keys
- Indexes
- Constraints
- Timestamps
```

---

## 📊 Module Overview

### Module 1: Buy/Sell
**Goal**: Property discovery with automated due diligence

**Key Features**:
- Smart search with 20+ filters
- Trust score (0-100)
- 12-second due diligence reports
- Token payment (₹5,000 locks property for 24h)

**Documents**:
- UI: Sections 1.1-1.3 in DOMAIN_MODEL_UI.md
- API: Sections 1.1-1.4 in DOMAIN_MODEL_BACKEND_API.md
- DB: properties (MongoDB), due_diligence_reports (PostgreSQL)

---

### Module 2: Rental
**Goal**: CIBIL-based deposit reduction & AI inspections

**Key Features**:
- 1 month deposit for CIBIL 750+ (vs 6 months traditional)
- AI camera damage detection
- IPFS immutable storage
- Automated settlement

**Documents**:
- UI: Sections 2.1-2.2 in DOMAIN_MODEL_UI.md
- API: Sections 2.1-2.3 in DOMAIN_MODEL_BACKEND_API.md
- DB: rental_agreements, rental_inspections

---

### Module 3: Commercial
**Goal**: Footfall analytics for business location selection

**Key Features**:
- Interactive footfall heatmap
- Demographics (age, income, occupation)
- Delivery density (Swiggy/Zomato)
- Business recommendations

**Documents**:
- UI: Section 3.1 in DOMAIN_MODEL_UI.md
- API: Section 3.1 in DOMAIN_MODEL_BACKEND_API.md
- DB: Cached reports in Redis

---

### Module 4: Auction
**Goal**: Bank auction property listings (premium)

**Key Features**:
- Daily scraped listings from banks
- Discount percentage highlighting
- Automated alerts
- Premium subscription (₹999/mo)

**Documents**:
- UI: Section 4.1 in DOMAIN_MODEL_UI.md
- API: Section 4.1 in DOMAIN_MODEL_BACKEND_API.md
- DB: MongoDB collection with scraper data

---

### Module 5: Lifecycle
**Goal**: NRI property monitoring via satellite

**Key Features**:
- Weekly satellite images (Sentinel Hub)
- AI change detection (15%+ alert)
- Live property valuation
- Encrypted document vault

**Documents**:
- UI: Section 5.1 in DOMAIN_MODEL_UI.md
- API: Sections 5.1-5.2 in DOMAIN_MODEL_BACKEND_API.md
- DB: satellite_subscriptions, satellite_images

---

### Module 6: Community
**Goal**: RWA management with digital voting

**Key Features**:
- Digital polls with 50% quorum
- Visitor OTP management
- Notice board
- Maintenance tracking

**Documents**:
- UI: Section 6.1 in DOMAIN_MODEL_UI.md
- API: Sections 6.1-6.2 in DOMAIN_MODEL_BACKEND_API.md
- DB: communities, community_polls, community_votes

---

### Module 7: Land & JV
**Goal**: Land verification & builder matchmaking

**Key Features**:
- Dharani/MeeBhoomi integration
- Development potential calculator
- Builder trust score ranking
- Digital JV agreements

**Documents**:
- UI: Section 7.1 in DOMAIN_MODEL_UI.md
- API: Sections 7.1-7.2 in DOMAIN_MODEL_BACKEND_API.md
- DB: External API integrations

---

## 🎯 Use Cases

### Scenario 1: Building Property Search from Scratch
1. Read **PropertySearchScreen** spec (DOMAIN_MODEL_UI.md, 1.1)
2. Create screen layout with PropertyCard components
3. Implement search API endpoint (DOMAIN_MODEL_BACKEND_API.md, 1.1)
4. Query properties collection (DOMAIN_MODEL_DATABASE.md, MongoDB 1)
5. Add filters, pagination, sorting

**Estimated Time**: 2-3 days with LLM assistance

---

### Scenario 2: Adding Due Diligence Feature
1. Read **DueDiligence** spec (DOMAIN_MODEL_BACKEND_API.md, 1.3)
2. Implement Temporal workflow for async processing
3. Integrate RERA, Dharani APIs
4. Calculate trust score (0-100)
5. Store report in PostgreSQL (due_diligence_reports table)
6. Display in PropertyDetailsScreen

**Estimated Time**: 4-5 days with external API integrations

---

### Scenario 3: Creating Rental Module End-to-End
1. Build DepositCalculatorScreen (DOMAIN_MODEL_UI.md, 2.1)
2. Integrate Experian CIBIL API (DOMAIN_MODEL_BACKEND_API.md, 2.2)
3. Create rental_agreements table (DOMAIN_MODEL_DATABASE.md, Section 5)
4. Build AI inspection flow (camera + ML + IPFS)
5. Implement move-in/move-out comparison

**Estimated Time**: 1-2 weeks full module

---

## 📈 Implementation Roadmap

### Phase 1: Foundation (Weeks 1-4)
- Setup databases (PostgreSQL + MongoDB + Redis)
- Authentication (JWT + RBAC)
- Payment gateway (Razorpay)
- Core UI components

### Phase 2: Module 1 (Weeks 5-8)
- Property search & filters
- Due diligence workflow
- Token payment flow

### Phase 3: Modules 2-3 (Weeks 9-12)
- Rental deposit calculator
- AI inspection
- Footfall analytics

### Phase 4: Modules 4-7 (Weeks 13-16)
- Auction listings
- Satellite monitoring
- Community voting
- Land JV matchmaking

### Phase 5: Launch (Weeks 17-20)
- Testing & QA
- Performance optimization
- App store submission
- Production deployment

---

## 🔗 Related Documentation

### Project Documentation
- [PRD.md](PRD.md) - Product requirements document
- [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) - Business overview
- [DESIGN.md](DESIGN.md) - System architecture
- [USER_GUIDE.md](USER_GUIDE.md) - End-user documentation

### Technical Documentation
- [INTEGRATION_QUICKSTART.md](INTEGRATION_QUICKSTART.md) - API integration guide
- [INTEGRATION_SUMMARY.md](INTEGRATION_SUMMARY.md) - Service integrations
- [MASTER_BLUEPRINT_IMPLEMENTATION.md](MASTER_BLUEPRINT_IMPLEMENTATION.md) - Implementation plan

### Schema Documentation
- [schemas/PROPERTY_SCHEMA.toon](schemas/PROPERTY_SCHEMA.toon) - Property data structure
- [schemas/PRICE_SHEET_SCHEMA.toon](schemas/PRICE_SHEET_SCHEMA.toon) - Pricing breakdown
- [schemas/PAYMENT_SCHEDULE_SCHEMA.toon](schemas/PAYMENT_SCHEDULE_SCHEMA.toon) - Payment milestones
- [schemas/services/](schemas/services/) - Service-specific schemas

---

## ✅ Checklist for New Developers

Before starting development:
- [ ] Read DOMAIN_MODEL_MASTER.md for system overview
- [ ] Understand module breakdown and technology stack
- [ ] Review UI design patterns in DOMAIN_MODEL_UI.md
- [ ] Study API patterns in DOMAIN_MODEL_BACKEND_API.md
- [ ] Understand database architecture in DOMAIN_MODEL_DATABASE.md
- [ ] Setup development environment (Node.js, PostgreSQL, MongoDB, Redis)
- [ ] Clone repository and install dependencies
- [ ] Review existing code to understand patterns
- [ ] Pick a module to start with (recommend: Buy/Sell for beginners)

---

## 🤝 Contributing

When adding new features:
1. Update relevant domain model document
2. Follow existing patterns and conventions
3. Add TypeScript types
4. Include error handling
5. Write tests
6. Update this README if adding new modules

---

## 📞 Support

For questions or clarifications:
- Review master document first: [DOMAIN_MODEL_MASTER.md](DOMAIN_MODEL_MASTER.md)
- Check specific domain model for details
- Consult PRD for business requirements
- Check DESIGN.md for architecture decisions

---

**Last Updated**: December 2025
**Version**: 1.0
**Status**: Complete - Ready for Development

---

## Summary

This comprehensive domain model documentation provides everything needed to build the Propmubi Real Estate Super App:

✅ **UI Specifications**: 50+ screens, reusable components, state management
✅ **API Specifications**: 100+ endpoints, integrations, workflows
✅ **Database Schemas**: 25+ tables, MongoDB collections, Redis caching
✅ **LLM-Friendly**: Detailed specs for AI-assisted code generation
✅ **Production-Ready**: Security, performance, scalability built-in

Start with [DOMAIN_MODEL_MASTER.md](DOMAIN_MODEL_MASTER.md) and dive into specific documents as needed. Happy coding! 🚀
