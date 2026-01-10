# Propmubi Backend API Domain Model
## Comprehensive REST API Architecture & Endpoints

**Version:** 1.0
**Date:** December 2025
**Purpose:** LLM-friendly guide for generating backend APIs, services, and integrations

---

## Table of Contents
1. [API Architecture Overview](#api-architecture-overview)
2. [Authentication & Authorization](#authentication--authorization)
3. [Core API Endpoints by Module](#core-api-endpoints-by-module)
4. [External Service Integrations](#external-service-integrations)
5. [Data Models & Schemas](#data-models--schemas)
6. [Workflow Orchestration](#workflow-orchestration)
7. [Error Handling & Validation](#error-handling--validation)
8. [Performance & Caching](#performance--caching)

---

## API Architecture Overview

### Technology Stack

The system runs on Node.js 20 LTS using Express.js 4.18 with a planned migration to NestJS. The API follows RESTful principles with GraphQL federation support. Validation uses Zod 3.22, data access through Prisma 5.6 for PostgreSQL and Mongoose for MongoDB. Workflow orchestration uses Temporal.io 1.20, real-time features via Socket.io 4.6, and documentation via OpenAPI 3.0 Swagger.

### Base URL Structure
```
Production:  https://api.propmubi.com/v1
Staging:     https://api-staging.propmubi.com/v1
Development: http://localhost:3001/api
```

### API Versioning
- **Current**: v1 (all endpoints)
- **Strategy**: URL-based versioning (`/v1/`, `/v2/`)
- **Deprecation**: 6-month notice period

---

## Authentication & Authorization

### JWT Authentication Flow

**POST /auth/register**
Accepts email, phone, password, name, and role (BUYER, SELLER, AGENT, BUILDER, TENANT, LANDLORD). Returns user object, token, and expiration time (7 days).

**POST /auth/login**
Accepts email and password. Returns user object, token, and refresh token.

**POST /auth/refresh**
Accepts refresh token to obtain a new access token.

**POST /auth/logout**
Invalidates the token by adding it to a Redis blacklist.

### Role-Based Access Control (RBAC)

Permissions are organized into categories:
- Property permissions: create, read, update, delete
- Due diligence permissions: run, view
- Payment permissions: create, refund
- Admin permissions: user management, builder verification

Role-permission mapping assigns specific permissions to each role:
- BUYER: property read, due diligence run, payment create
- BUILDER: property create, update, read
- ADMIN: all permissions

---

## Core API Endpoints by Module

### Module 1: Buy/Sell APIs

#### 1.1 Property Search & Discovery

**GET /api/v1/properties/search**
Access: Public

Search properties with advanced filters including location (city, locality, pincode arrays), property details (type, bedrooms, area, price ranges), status filters (availability, possession), verification filters (RERA verified, minimum trust score), and sorting/pagination options (sort by price/relevance/newest, page number, limit).

The response includes an array of properties, pagination metadata (page, limit, total, hasMore), and facets showing price ranges, localities, and bedroom distribution with counts.

Example response structure includes property objects with id, title, type, price, price per sqft, area details (carpet, built-up, unit), bedrooms, bathrooms, facing, location with coordinates, images array, verification details (RERA number and status, trust score, last verified date), builder and project information, status, and timestamps.

---

#### 1.2 Property Details

**GET /api/v1/properties/:id**
Access: Public

Returns comprehensive property information including the property object, builder details, project information, amenities list, floor plan with room details, optional 3D tour URL, similar properties, and price history showing date and price pairs.

---

#### 1.3 Due Diligence Automation

**POST /api/v1/due-diligence**
Access: Authenticated
Premium: First 3 free, then ₹99/report

Initiates automated due diligence check for a property. Accepts property ID, user ID, and optional checks array (RERA, land title, market price, legal).

Returns workflow ID, status (PROCESSING, COMPLETED, FAILED), estimated time in seconds, and optional result object.

**GET /api/v1/due-diligence/:workflowId**

Gets the due diligence report status and results. The report includes overall score (0-100), individual checks for RERA (status, project/builder names, RERA number, expiry date, score), land title (status, source like Dharani/MeeBhoomi, encumbrances, score), market price (estimated value, asked price, deviation percentage, reasonableness flag, comparables with address/price/area/date, score), and optional legal check (litigation status, court cases, score). Also includes recommendations, red flags, report PDF URL, generation timestamp, and expiration date (90 days validity).

The workflow implementation runs parallel API calls for RERA, land title, and market price checks (approximately 12 seconds), calculates the overall score, generates a PDF report, and notifies the user.

---

#### 1.4 Token of Interest Payment

**POST /api/v1/properties/:id/token**
Access: Authenticated
Amount: ₹5,000

Pay token to lock property for 24 hours. Accepts property ID, user ID, amount (5000), and payment method (UPI, CARD, NETBANKING).

Returns payment ID, Razorpay order ID, amount, currency (INR), status (PENDING, SUCCESS, FAILED), lock expiration timestamp (24 hours), and Razorpay options object with key, order ID, amount, name, and description.

**POST /api/v1/properties/:id/token/verify**

Verifies payment and locks the property. Accepts payment ID, Razorpay payment ID, order ID, and signature.

Returns verification status (boolean), updated property object with status LOCKED, locked by user ID, locked until timestamp, and notification details (seller notified flag, notification sent timestamp).

---

### Module 2: Rental APIs

#### 2.1 CIBIL-Based Deposit Calculator

**POST /api/v1/rental/calculate-deposit**
Access: Authenticated

Calculates rental deposit based on CIBIL score. Accepts property ID, user ID, monthly rent, and optional CIBIL score (fetched from Experian if not provided).

Returns monthly rent, CIBIL score, score source (USER_PROVIDED or EXPERIAN_API), traditional deposit (amount and 6 months), smart deposit (amount, months based on score, savings amount), deposit rules (750+ gets 1 month, 650-750 gets 2 months, below 650 gets 6 months), and employment verification requirement flag.

Example response shows monthly rent of ₹25,000, CIBIL score 785 from Experian API, traditional deposit ₹1,50,000 (6 months), smart deposit ₹25,000 (1 month), savings of ₹1,25,000, and employment verification required.

---

#### 2.2 CIBIL Score Integration

**POST /api/v1/rental/cibil/fetch**
Access: Authenticated
Requires: User consent

Fetches CIBIL score via Experian API using Account Aggregator. Accepts user ID, consent flag, and AA provider (Anumati_AA, OneMoney_AA, or Setu_AA).

Returns CIBIL score, score range (EXCELLENT, GOOD, FAIR, POOR), report date, factor scores (payment history, credit utilization, credit age, credit mix), and cache expiration (valid for 30 days).

---

#### 2.3 AI Move-In/Out Inspection

**POST /api/v1/rental/inspection**
Access: Authenticated

Uploads inspection images with AI analysis. Accepts property ID, user ID, inspection type (MOVE_IN or MOVE_OUT), and rooms array containing room type (LIVING, BEDROOM, KITCHEN, BATHROOM) and images (Base64 or URLs).

Returns inspection ID, status (PROCESSING or COMPLETED), AI analysis with room type and detected items (item name like wall/floor/ceiling/window, condition as GOOD/MINOR_DAMAGE/MAJOR_DAMAGE, confidence score, optional damage description, optional location coordinates), IPFS hash for blockchain-backed immutable storage, and report URL.

---

### Module 3: Commercial APIs

#### 3.1 Footfall Analysis

**POST /api/v1/commercial/footfall-analysis**
Access: Authenticated
Premium: ₹5,000 per report

Gets footfall heatmap for commercial location. Accepts location (latitude, longitude, radius in meters) and report type (QUICK or DETAILED).

Returns location score (0-100), daily footfall count, peak hours array with hour and count, demographics (age groups, income levels, occupation percentages), delivery density (Swiggy/Zomato daily orders, trend UP/DOWN/STABLE), heatmap data array with coordinates and intensity (0-1), business recommendations with type/potential/reason, and report PDF URL.

---

### Module 4: Auction APIs

#### 4.1 Bank Auction Listings

**GET /api/v1/auction/listings**
Access: Premium subscribers only

Gets bank auction properties. Accepts optional filters (bank array like SBI/HDFC/ICICI, minimum discount percentage, property type array, city array) and sort option (discount descending or auction date ascending).

Returns auctions array with id, property type, location, market value, reserve price, discount percentage, auction date, bank, status (UPCOMING, LIVE, CONCLUDED), and optional due diligence score.

**POST /api/v1/auction/alerts**

Sets alerts for auction criteria. Accepts criteria (minimum discount, cities array, maximum price) and notification channels array (EMAIL, SMS, PUSH).

---

### Module 5: Lifecycle APIs

#### 5.1 Satellite Monitoring

**POST /api/v1/lifecycle/satellite/subscribe**
Access: Authenticated
Premium: ₹499/month

Subscribes to satellite monitoring for a property. Accepts property ID, survey number, coordinates (latitude, longitude), and frequency (WEEKLY, BIWEEKLY, MONTHLY).

Returns subscription ID, start date, next check date, and cost.

**GET /api/v1/lifecycle/satellite/:subscriptionId/latest**

Gets latest satellite image and change detection. Returns image URL (Sentinel Hub), capture date, change detection (percentage, status NORMAL/ALERT, description, optional change type like CONSTRUCTION/VEGETATION/EXCAVATION), and history array with date, change percentage, and image URL.

---

#### 5.2 Property Valuation Ticker

**GET /api/v1/lifecycle/valuation/:propertyId**

Gets live property valuation. Returns current value, last updated timestamp, trend object (7-day, 30-day, 90-day, 1-year percentage changes), market status (BULLISH, BEARISH, STABLE), and factors array showing factor name and impact (positive or negative percentage).

---

### Module 6: Community APIs

#### 6.1 RWA Voting & Polls

**POST /api/v1/community/polls**
Access: RWA Admin only

Creates a community poll. Accepts community ID, question, description, options array (label and optional description), created by user ID, quorum required percentage, restrict to owners flag, start timestamp, and end timestamp.

Returns poll ID, status (ACTIVE), end timestamp, total eligible voters count, and quorum threshold number.

**POST /api/v1/community/polls/:pollId/vote**

Casts a vote. Accepts user ID, unit number, and option ID.

**GET /api/v1/community/polls/:pollId/results**

Gets poll results. Returns question, options array with label/votes/percentage, total votes, quorum met flag, status (ACTIVE or CLOSED), and optional winning option ID.

---

#### 6.2 Visitor Management

**POST /api/v1/community/visitors/generate-otp**

Generates OTP for visitor. Accepts unit number, visitor name, visitor phone, and valid until timestamp.

Returns OTP string, valid until timestamp, and Base64 QR code image.

**POST /api/v1/community/visitors/verify-otp**

Verifies visitor OTP at gate. Accepts OTP and gate ID.

Returns validity boolean, visitor name, unit number, and entry time.

---

### Module 7: Land & JV APIs

#### 7.1 Land Title Verification (Dharani)

**POST /api/v1/land/verify**

Verifies land title via Dharani/MeeBhoomi API. Accepts survey number, village, district, and state (TELANGANA or ANDHRA_PRADESH).

Returns verification status (boolean), owner name, area (value and unit as ACRES/GUNTAS), land use (AGRICULTURAL, NON_AGRICULTURAL, RESIDENTIAL), encumbrances array with type (MORTGAGE/LOAN/LIEN), amount, and institution, last mutation details (date and previous owner), and status (CLEAR, ENCUMBERED, DISPUTED).

---

#### 7.2 JV Matchmaking

**POST /api/v1/land/jv-match**

Finds builders for joint venture. Accepts land area in acres, location, land value, and preferred share percentage.

Returns builders array with id, name, trust score, past JV count, successful JV count, average completion time in months, preferred split (landowner and builder percentages), and estimated project value.

---

## External Service Integrations

### 1. RERA APIs (13 States)

The RERA service checks registration status and gets builder project history. Integration endpoints vary by state including Maharashtra, Telangana, Karnataka, and 10 more states. Falls back to web scraping if API unavailable.

---

### 2. Land Record Systems

Integrations include:
- **Dharani (Telangana)**: Get Adangal, ROR (Record of Rights), and check encumbrances
- **MeeBhoomi (Andhra Pradesh)**: Get 1B record and Adangal

---

### 3. Financial Services

Integrations include:
- **Experian**: Get credit score with PAN and consent
- **Account Aggregator (Setu)**: Fetch bank statements and income details
- **Razorpay**: Create orders, verify payments, initiate refunds

---

### 4. Satellite Imagery

**Sentinel Hub integration**: Get latest images for coordinates and dates, detect changes between two images

---

## Data Models & Schemas

### Core Entities

#### Property

The Property entity includes:
- Basic info: id, title, description, type (APARTMENT, VILLA, PLOT, COMMERCIAL)
- Location: address, city, state, pincode, coordinates (latitude, longitude)
- Details: area (carpet, built-up, super built-up, unit), bedrooms, bathrooms, facing direction
- Pricing: price, price per sqft
- Verification: RERA number and status, land title status, trust score (0-100), last verified date
- Media: images, videos, 3D tour, floor plan URLs
- Ownership: owner ID, owner type, builder ID, project ID
- Status: availability, locked by user, locked until timestamp
- Metadata: views, saves, inquiries, timestamps

#### User

The User entity includes:
- Basic info: id, email, phone, name
- Auth: password hash, email verified flag, phone verified flag
- Profile: role (BUYER, SELLER, AGENT, BUILDER, TENANT, LANDLORD), KYC status
- Financial: CIBIL score, CIBIL last checked date
- Subscription: plan (FREE, BASIC, PREMIUM, ENTERPRISE), valid until date, features array
- Preferences: saved properties, saved searches
- Timestamps: created at, updated at

---

## Workflow Orchestration (Temporal)

### Due Diligence Workflow

The long-running workflow can pause for days waiting for external responses without consuming server resources. Steps include:

1. Fast parallel checks (12 seconds) for RERA, land legality, and market price
2. If land is clear, order title report and wait for completion (workflow pauses here)
3. Calculate overall score from all checks
4. Generate PDF report
5. Notify user with report URL

---

## Error Handling & Validation

### Standard Error Response

API errors return a standardized format with error object (code, message, optional details, stack trace in development only), timestamp, request path, and request ID.

Error codes include:
- **Authentication**: UNAUTHORIZED, FORBIDDEN, TOKEN_EXPIRED
- **Validation**: VALIDATION_ERROR, INVALID_INPUT
- **Business logic**: PROPERTY_NOT_FOUND, PROPERTY_ALREADY_LOCKED, INSUFFICIENT_BALANCE, PAYMENT_FAILED
- **External services**: RERA_API_UNAVAILABLE, DHARANI_TIMEOUT
- **Server errors**: INTERNAL_SERVER_ERROR, SERVICE_UNAVAILABLE

### Request Validation with Zod

Zod schemas validate request parameters including optional city array, price range, bedrooms array, RERA verified flag, page number (minimum 1, default 1), and limit (minimum 1, maximum 100, default 20). Controllers parse and validate request data before processing.

---

## Performance & Caching

### Caching Strategy

Cache configuration with TTL values:
- Property data: 5 minutes (300 seconds)
- Search results: 2 minutes (120 seconds)
- RERA data: 24 hours (86400 seconds)
- User session: 7 days (604800 seconds)
- Due diligence report: 90 days (7776000 seconds)

The cache service provides get, set (with optional TTL), and invalidate (by pattern) methods.

### Rate Limiting

Rate limits by access level:
- **Public endpoints**: 100 requests per 15 minutes
- **Authenticated**: 500 requests per 15 minutes
- **Payment endpoints**: 10 requests per hour
- **Premium**: 1000 requests per 15 minutes

---

## WebSocket Events (Real-time)

### Property Updates

Server emits events for property locked (with property ID, locked by user, locked until timestamp), property unlocked, property price updated, and due diligence completed. Clients listen to these events to update the UI accordingly.

---

**End of Backend API Domain Model**

This document provides a complete reference for generating all backend APIs, integrations, and workflows for the Propmubi platform. Each endpoint is designed with scalability, security, and developer experience in mind.
