# Propmubi - Master Domain Model & LLM Generation Guide
## Complete System Architecture for AI-Assisted Development

**Version:** 1.0
**Date:** December 2025
**Purpose:** Master reference document for LLM-based code generation across UI, Backend, and Database layers

---

## Table of Contents
1. [Overview](#overview)
2. [Document Structure](#document-structure)
3. [Quick Reference Guide](#quick-reference-guide)
4. [Domain Model Summary](#domain-model-summary)
5. [LLM Prompting Guidelines](#llm-prompting-guidelines)
6. [Implementation Roadmap](#implementation-roadmap)

---

## Overview

This master document consolidates the complete domain model for **Propmubi**, India's Real Estate Super App. It serves as the authoritative source for generating:
- **Frontend UI**: Screens, components, navigation
- **Backend APIs**: RESTful endpoints, GraphQL queries, microservices
- **Database Schemas**: PostgreSQL tables, MongoDB collections, Redis caching

### Project Scope
Propmubi is a comprehensive real estate platform with **7 core modules**:
1. **Buy/Sell**: Property discovery with automated due diligence
2. **Rental**: CIBIL-based deposit calculator & AI inspections
3. **Commercial**: Footfall analytics for business location selection
4. **Auction**: Bank auction property listings (premium)
5. **Lifecycle**: Satellite monitoring for NRI property owners
6. **Community**: RWA management with digital voting
7. **Land & JV**: Land verification & builder matchmaking

### Technology Stack

The technology stack includes React Native for mobile and React Web for browser with 90% shared code. The UI uses Tamagui (universal) and NativeWind (Tailwind for React Native). The backend runs on Node.js with Express.js/NestJS and GraphQL. The database layer uses PostgreSQL, MongoDB, Redis, and ClickHouse. Temporal.io handles long-running processes, Razorpay handles payments, and authentication uses JWT with RBAC.

---

## Document Structure

### Core Domain Model Documents
This master guide references three comprehensive domain model documents:

#### 1. [DOMAIN_MODEL_UI.md](DOMAIN_MODEL_UI.md)
**Purpose**: Complete UI/UX specifications for frontend development

**Contents**:
- 50+ screen layouts with wireframes
- Reusable component library (PropertyCard, TrustScoreBadge, etc.)
- State management patterns (Zustand + TanStack Query)
- Navigation hierarchy
- Form components with validation
- Data visualization (charts, heatmaps)
- Responsive design breakpoints
- Accessibility guidelines

**Use Case**: Generate React Native/Web screens, components, and UI logic

---

#### 2. [DOMAIN_MODEL_BACKEND_API.md](DOMAIN_MODEL_BACKEND_API.md)
**Purpose**: Complete API specifications for backend development

**Contents**:
- 100+ REST API endpoints across 7 modules
- Request/response schemas with TypeScript interfaces
- Authentication & authorization flows (JWT, RBAC)
- External service integrations (RERA, Dharani, Experian, Sentinel Hub)
- Workflow orchestration with Temporal
- Error handling & validation (Zod schemas)
- WebSocket events for real-time updates
- Caching strategy (Redis)
- Rate limiting rules

**Use Case**: Generate Express.js routes, controllers, services, and API integrations

---

#### 3. [DOMAIN_MODEL_DATABASE.md](DOMAIN_MODEL_DATABASE.md)
**Purpose**: Complete database schemas for data layer

**Contents**:
- 25+ PostgreSQL tables with relationships
- 10+ MongoDB collections with indexes
- Redis cache patterns
- Geospatial queries (PostGIS)
- Full-text search indexes
- Migration scripts (Prisma)
- Seed data examples
- Backup & recovery strategy

**Use Case**: Generate database migrations, models, queries, and data access layers

---

## Quick Reference Guide

### Module-to-Document Mapping

| Module | UI Screens | API Endpoints | Database Tables |
|--------|-----------|---------------|-----------------|
| **Buy/Sell** | PropertySearchScreen, PropertyDetailsScreen, TokenPaymentScreen | `/properties/search`, `/due-diligence`, `/properties/{id}/token` | properties (MongoDB), payments, due_diligence_reports |
| **Rental** | DepositCalculatorScreen, MoveInInspectionScreen | `/rental/calculate-deposit`, `/rental/cibil/fetch`, `/rental/inspection` | rental_agreements, rental_inspections |
| **Commercial** | LocationAnalysisScreen | `/commercial/footfall-analysis` | N/A (cached reports) |
| **Auction** | AuctionListingsScreen | `/auction/listings`, `/auction/alerts` | N/A (scraped data in MongoDB) |
| **Lifecycle** | SatelliteMonitorScreen | `/lifecycle/satellite/subscribe`, `/lifecycle/valuation` | satellite_subscriptions, satellite_images |
| **Community** | NoticeBoardScreen, VotingScreen | `/community/polls`, `/community/visitors` | communities, community_polls, community_votes |
| **Land & JV** | LandVerificationScreen | `/land/verify`, `/land/jv-match` | N/A (external API integration) |

---

### Key Data Entities

#### Primary Entities
1. **User**: Authentication, profile, KYC, subscription
2. **Property**: Listing with location, pricing, verification (MongoDB)
3. **Builder**: Company profile, reputation, RERA status
4. **Project**: Development with RERA, units, timeline
5. **Payment**: Razorpay integration, refunds, escrow
6. **DueDiligenceReport**: Automated verification with scores

#### Supporting Entities
7. **RentalAgreement**: Lease terms, CIBIL-based deposit
8. **SatelliteSubscription**: Monitoring frequency, alerts
9. **CommunityPoll**: Voting, quorum, results
10. **AuctionListing**: Bank properties with discounts

---

## Domain Model Summary

### Module 1: Buy/Sell - Property Discovery & Due Diligence

#### User Journey

Search Properties → View Details → Due Diligence Report → Pay Token (₹5K) → Site Visit → Booking

#### Key Features
- **Smart Search**: 20+ filters (location, price, bedrooms, RERA verified)
- **Trust Score**: 0-100 automated verification score
- **Due Diligence**: 12-second automated report checking RERA, land title, market price
- **Token System**: ₹5,000 locks property for 24 hours (100% refundable)

#### UI Components
- `PropertyCard`: Thumbnail with price, trust score, RERA badge
- `FilterSheet`: Bottom sheet with advanced filters
- `DueDiligenceCard`: Verification status summary
- `TrustScoreBadge`: Visual 0-100 score indicator

#### API Endpoints

- GET /api/properties/search - Search with filters
- GET /api/properties/:id - Property details
- POST /api/due-diligence - Generate report
- POST /api/properties/:id/token - Pay token
- POST /api/properties/:id/token/verify - Verify payment

#### Database Schema

MongoDB: properties collection
PostgreSQL: builders, projects, unit_instances, payments, due_diligence_reports

---

### Module 2: Rental - CIBIL-Based Deposit & AI Inspection

#### User Journey

Find Rental → Check CIBIL Score → Calculate Deposit → Move-In Inspection (AI) → Sign Agreement → Move-Out Inspection → Deposit Settlement

#### Key Features
- **Smart Deposit**: 1 month (CIBIL 750+), 2 months (650-750), 6 months (<650)
- **AI Inspection**: Camera-based damage detection with ML
- **IPFS Storage**: Immutable blockchain-backed inspection reports
- **Dispute-Free**: Automated settlement based on AI comparison

#### UI Components
- `CIBILScoreConnector`: Experian API integration
- `DepositComparisonCard`: Before/after savings visual
- `AICamera`: Native camera with ML damage detection
- `DamageMarker`: Overlay to mark issues on photos

#### API Endpoints

- POST /api/rental/calculate-deposit - CIBIL-based calculation
- POST /api/rental/cibil/fetch - Get CIBIL score
- POST /api/rental/inspection - Upload inspection images

#### Database Schema

PostgreSQL: rental_agreements, rental_inspections

---

### Module 3: Commercial - Footfall Analytics

#### User Journey

Select Location → View Footfall Heatmap → Demographics Analysis → Business Recommendation → Purchase Report (₹5K)

#### Key Features
- **Footfall Heatmap**: Live traffic density visualization
- **Demographics**: Age, income, occupation data
- **Delivery Density**: Swiggy/Zomato order counts
- **Business Recommendations**: AI-powered suggestions

#### UI Components
- `FootfallHeatmap`: Interactive map with color zones
- `DemographicsChart`: Pie/bar charts
- `RecommendationCard`: Business type suggestions

#### API Endpoints

- POST /api/commercial/footfall-analysis - Generate report

---

### Module 4: Auction - Bank Auctions

#### User Journey

Subscribe (₹999/mo) → View Auctions → Set Alerts → Apply for Auction → Due Diligence

#### Key Features
- **Premium Access**: Subscription-based feature
- **Daily Updates**: Automated bank auction scraping
- **Discount Alerts**: 20%+ discount notifications

#### UI Components
- `AuctionCard`: Shows market value vs reserve price
- `SubscriptionPaywall`: Premium gate

#### API Endpoints

- GET /api/auction/listings - List auctions
- POST /api/auction/alerts - Configure alerts

---

### Module 5: Lifecycle - NRI Property Monitoring

#### User Journey

Subscribe (₹499/mo) → Weekly Satellite Check → Change Detection Alert → Valuation Updates → Document Vault

#### Key Features
- **Satellite Monitoring**: Sentinel Hub weekly images
- **Change Detection**: AI-powered 15%+ change alerts
- **Valuation Ticker**: Live market value updates
- **Document Vault**: Encrypted storage

#### UI Components
- `SatelliteImageViewer`: Before/after comparison
- `ChangeDetectionAlert`: Visual warning system
- `ValuationTicker`: Real-time price updates

#### API Endpoints

- POST /api/lifecycle/satellite/subscribe - Start monitoring
- GET /api/lifecycle/satellite/:id/latest - Latest image
- GET /api/lifecycle/valuation/:propertyId - Current value

#### Database Schema

PostgreSQL: satellite_subscriptions, satellite_images

---

### Module 6: Community - RWA Management

#### User Journey

Join Community → View Notices → Vote on Polls → Generate Visitor OTP → Maintenance Tracking

#### Key Features
- **Digital Voting**: 50% quorum, real-time results
- **Visitor Management**: OTP-based gate entry
- **Notice Board**: Community announcements

#### UI Components
- `PollCard`: Interactive voting interface
- `VisitorOTPGenerator`: One-time password system

#### API Endpoints

- POST /api/community/polls - Create poll
- POST /api/community/polls/:id/vote - Cast vote
- POST /api/community/visitors/generate-otp - Generate OTP

#### Database Schema

PostgreSQL: communities, community_polls, community_votes

---

### Module 7: Land & JV - Joint Ventures

#### User Journey

Enter Survey Number → Verify via Dharani → Calculate Development Potential → Match with Builders → Digital JV Agreement

#### Key Features
- **Land Verification**: Dharani/MeeBhoomi API integration
- **JV Matchmaking**: Builder trust score ranking
- **Development Calculator**: FSI and buildable area

#### UI Components
- `DharaniConnector`: Land records API
- `DevelopmentCalculator`: FSI calculator
- `BuilderMatchList`: Ranked builder list

#### API Endpoints

- POST /api/land/verify - Verify land title
- POST /api/land/jv-match - Find builders

---

## LLM Prompting Guidelines

### Best Practices for Code Generation

#### 1. UI Component Generation

**Prompt Template**:

Generate a React Native screen for [Module Name] based on the specification in DOMAIN_MODEL_UI.md, Section [X.Y].

Requirements:
- Use Tamagui for UI components
- Implement state management with Zustand
- Follow the layout structure provided
- Include error handling and loading states
- Make it responsive for mobile and web

Reference Screen: [Screen Name from document]

**Example**:

Generate a React Native screen for Property Search based on DOMAIN_MODEL_UI.md, Section 1.1.

Requirements:
- Use Tamagui for UI components
- Implement PropertyCard component
- Add FilterSheet bottom sheet
- Connect to /api/properties/search endpoint
- Handle pagination with infinite scroll

Reference Screen: PropertySearchScreen.tsx

---

#### 2. API Endpoint Generation

**Prompt Template**:

Generate an Express.js API endpoint for [Feature Name] based on DOMAIN_MODEL_BACKEND_API.md, Section [X.Y].

Requirements:
- Use Zod for request validation
- Implement authentication middleware (JWT)
- Add error handling
- Include TypeScript types
- Add rate limiting if premium

Endpoint: [HTTP Method] [Route]

**Example**:

Generate an Express.js API endpoint for Due Diligence Report based on DOMAIN_MODEL_BACKEND_API.md, Section 1.3.

Requirements:
- Validate request with Zod schema
- Start Temporal workflow for async processing
- Return workflow ID immediately
- Integrate with RERA, Dharani APIs
- Calculate overall trust score

Endpoint: POST /api/due-diligence

---

#### 3. Database Schema Generation

**Prompt Template**:

Generate a Prisma migration for [Table Name] based on DOMAIN_MODEL_DATABASE.md, Section [X].

Requirements:
- Include all columns with proper types
- Add foreign key relationships
- Create indexes for frequently queried fields
- Add constraints (UNIQUE, CHECK)
- Include timestamps

Table: [table_name]

**Example**:

Generate a Prisma migration for payments table based on DOMAIN_MODEL_DATABASE.md, Section 2.

Requirements:
- UUID primary key
- Foreign keys to users, properties
- Razorpay gateway fields
- Payment status enum
- Refund tracking
- Indexes on user_id, status, created_at

Table: payments

---

#### 4. Integration Code Generation

**Prompt Template**:

Generate an integration service for [External Service] based on DOMAIN_MODEL_BACKEND_API.md, Section External Integrations.

Requirements:
- Implement API client with fetch/axios
- Add error handling with retries
- Cache responses in Redis
- Add request/response logging
- Include TypeScript interfaces

Service: [Service Name]

**Example**:

Generate an integration service for RERA API based on DOMAIN_MODEL_BACKEND_API.md, Section External Integrations.

Requirements:
- Support 13 state endpoints
- Implement fallback web scraping
- Cache results for 24 hours in Redis
- Parse response to standard format
- Handle API rate limits

Service: RERAService

---

### LLM Context Management

#### Providing Context

When prompting an LLM for code generation, provide:

1. **Reference Document**: Point to specific section of domain model
2. **Related Code**: Show existing patterns/components
3. **Dependencies**: List required libraries
4. **Constraints**: Performance, security requirements

#### Example Full Prompt

Generate a React Native component for displaying property cards in a search results list.

Context:
- Reference: DOMAIN_MODEL_UI.md, Section "PropertyCard Component"
- Uses: Tamagui for styling, React Native Reanimated for animations
- State: Property data from usePropertyStore (Zustand)
- Navigation: Uses React Navigation for navigation to details screen

Requirements:
1. Display property image carousel (react-native-snap-carousel)
2. Show title, price, area, bedrooms, bathrooms
3. Display trust score badge (0-100 with color coding)
4. Show RERA verified badge if applicable
5. Include shortlist button (heart icon)
6. Handle press event to navigate to PropertyDetailsScreen
7. Implement skeleton loading state
8. Make responsive for different screen sizes

Code Style:
- Use TypeScript
- Functional components with hooks
- Extract reusable logic to custom hooks
- Add JSDoc comments

Output:
Full component code in PropertyCard.tsx

---

## Implementation Roadmap

### Phase 1: Foundation (Weeks 1-4)

**Goal**: Setup core infrastructure

**Tasks**:

1. Database setup (PostgreSQL + MongoDB + Redis)
2. Authentication system (JWT + RBAC)
3. Payment gateway integration (Razorpay)
4. Basic UI component library
5. API gateway & routing

**Deliverables**:

- User registration & login working
- Database schemas migrated
- Payment flow tested
- 10 core UI components ready

---

### Phase 2: Module 1 - Buy/Sell (Weeks 5-8)

**Goal**: Complete property search & due diligence

**Tasks**:

1. Property search with filters
2. Property details screen
3. RERA API integration
4. Dharani land verification
5. Due diligence workflow (Temporal)
6. Token payment flow
7. Trust score calculation

**Deliverables**:

- Property search working end-to-end
- Due diligence reports generated in 12 seconds
- Token payment with Razorpay live

---

### Phase 3: Modules 2-3 (Weeks 9-12)

**Goal**: Rental & Commercial features

**Tasks**:

1. CIBIL score integration (Experian)
2. Deposit calculator
3. AI inspection with camera (TensorFlow Lite)
4. IPFS storage integration
5. Footfall heatmap (Mapbox)
6. Demographics data (Census API)

**Deliverables**:

- Rental deposit calculator live
- AI move-in inspection working
- Commercial footfall reports generated

---

### Phase 4: Modules 4-7 (Weeks 13-16)

**Goal**: Complete all modules

**Tasks**:

1. Auction scraper (Puppeteer)
2. Satellite monitoring (Sentinel Hub)
3. Community voting system
4. Land JV matchmaking
5. Premium subscription flows
6. Admin dashboard

**Deliverables**:

- All 7 modules functional
- Premium features gated
- Admin panel ready

---

### Phase 5: Testing & Launch (Weeks 17-20)

**Goal**: Production-ready application

**Tasks**:

1. E2E testing (Cypress)
2. Load testing (k6)
3. Security audit
4. Performance optimization
5. App store submission (iOS/Android)
6. Marketing website

**Deliverables**:

- Apps live on App Store & Play Store
- Production deployment on AWS/GCP
- Monitoring & alerts configured

---

## Appendix: Document Cross-References

### UI → API → Database Mapping

#### Example: Property Search Flow

1. **UI**: PropertySearchScreen.tsx (DOMAIN_MODEL_UI.md, Section 1.1)
   - User enters search criteria
   - Clicks "Search" button

2. **API**: GET /api/properties/search (DOMAIN_MODEL_BACKEND_API.md, Section 1.1)
   - Validates filters with Zod
   - Queries MongoDB with geospatial filters
   - Returns paginated results

3. **Database**: properties collection (DOMAIN_MODEL_DATABASE.md, MongoDB Section 1)
   - Uses 2dsphere index for location queries
   - Filters by price, bedrooms, status
   - Sorts by relevance/price

---

#### Example: Due Diligence Report

1. **UI**: PropertyDetailsScreen.tsx → "View Report" button
   - Shows loading state
   - Displays report when ready

2. **API**: POST /api/due-diligence (DOMAIN_MODEL_BACKEND_API.md, Section 1.3)
   - Starts Temporal workflow
   - Calls RERA, Dharani, market price APIs in parallel
   - Calculates overall score
   - Stores report in PostgreSQL

3. **Database**: due_diligence_reports table (DOMAIN_MODEL_DATABASE.md, PostgreSQL Section 6)
   - Stores workflow_id, scores, checks JSONB
   - Links to property_id and user_id
   - Sets 90-day expiry

---

## Conclusion

This master domain model provides a complete blueprint for building the Propmubi Real Estate Super App. By following the structured approach outlined here, developers and LLMs can generate production-ready code across all layers of the application.

### Key Takeaways

1. **Comprehensive Coverage**: 7 modules, 100+ screens, 100+ APIs, 25+ tables
2. **LLM-Friendly**: Detailed specifications with TypeScript types and examples
3. **Consistent Architecture**: Shared patterns across UI, API, and database layers
4. **Scalable Design**: Built for 1M+ users, 10M+ properties
5. **Production-Ready**: Security, performance, and monitoring built-in

### Next Steps

1. Review individual domain model documents for detailed specifications
2. Use LLM prompts from this guide to generate code
3. Follow the implementation roadmap for phased delivery
4. Reference this master document for cross-layer consistency

---

**Document Version**: 1.0
**Last Updated**: December 2025
**Maintained By**: Propmubi Architecture Team

**Related Documents**:
- [DOMAIN_MODEL_UI.md](DOMAIN_MODEL_UI.md) - Frontend specifications
- [DOMAIN_MODEL_BACKEND_API.md](DOMAIN_MODEL_BACKEND_API.md) - Backend specifications
- [DOMAIN_MODEL_DATABASE.md](DOMAIN_MODEL_DATABASE.md) - Database specifications
- [PRD.md](PRD.md) - Product requirements
- [DESIGN.md](DESIGN.md) - System design
- [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) - Business overview
