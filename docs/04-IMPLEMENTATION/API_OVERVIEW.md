# 🌐 API Overview

**Complete REST API documentation for PropMubi Real Estate Platform**

---

## 📋 Table of Contents

1. [API Architecture](#api-architecture)
2. [Authentication](#authentication)
3. [Core Services](#core-services)
4. [API Endpoints](#api-endpoints)
5. [Request/Response Patterns](#requestresponse-patterns)
6. [Error Handling](#error-handling)
7. [Rate Limiting](#rate-limiting)

---

## API Architecture

### Service Communication Pattern

```
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway Architecture                   │
│                                                              │
│  Client (Web/Mobile)                                         │
│       ↓                                                      │
│  API Gateway (Kong/Traefik) :3000                           │
│       ├─→ Auth Service :3001                                │
│       ├─→ Property Service :3002                            │
│       ├─→ User Service :3003                                │
│       ├─→ Document Service :3004                            │
│       ├─→ Payment Service :3005                             │
│       ├─→ Loan Service :3006                                │
│       ├─→ CRM Service :3007                                 │
│       ├─→ Notification Service :3008                        │
│       ├─→ AI Orchestrator :3009                             │
│       └─→ Integration Service :3010                         │
│                                                              │
│  Internal Communication: Redis Streams (Event Bus)          │
└─────────────────────────────────────────────────────────────┘
```

### Base URLs

| Environment | URL | Description |
|-------------|-----|-------------|
| Development | `http://localhost:3000` | Local development |
| Staging | `https://api-staging.propmubi.com` | Staging environment |
| Production | `https://api.propmubi.com` | Production environment |

---

## Authentication

### JWT Token-Based Authentication

#### Authentication Flow

```typescript
// 1. Login/Register
POST /api/v1/auth/login
POST /api/v1/auth/register

// 2. Receive tokens
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "expires_in": 900  // 15 minutes
}

// 3. Use access token
Headers: {
  "Authorization": "Bearer eyJhbGc..."
}

// 4. Refresh when expired
POST /api/v1/auth/refresh
{
  "refresh_token": "eyJhbGc..."
}
```

### OAuth 2.1 Flow (External Providers)

```typescript
// Supported providers
POST /api/v1/auth/oauth/google
POST /api/v1/auth/oauth/facebook
POST /api/v1/auth/oauth/microsoft

// Callback
GET /api/v1/auth/oauth/callback/{provider}?code=...
```

---

## Core Services

### 1. Auth Service (Port 3001)

**Responsibility**: Authentication, authorization, user sessions

#### Endpoints

```typescript
// ============================================
// REGISTRATION & LOGIN
// ============================================

POST   /api/v1/auth/register
// Register new user
Request: {
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "full_name": "John Doe",
  "phone": "+919876543210",
  "user_type": "buyer"  // buyer | seller | agent | builder
}
Response: {
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "full_name": "John Doe",
    "user_type": "buyer"
  },
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "expires_in": 900
}

POST   /api/v1/auth/login
// Login existing user
Request: {
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
Response: {
  "user": { "id": "...", "email": "...", ... },
  "access_token": "...",
  "refresh_token": "...",
  "expires_in": 900
}

POST   /api/v1/auth/refresh
// Refresh access token
Request: {
  "refresh_token": "eyJhbGc..."
}
Response: {
  "access_token": "new-token",
  "expires_in": 900
}

POST   /api/v1/auth/logout
// Logout user (invalidate tokens)
Headers: { "Authorization": "Bearer ..." }
Response: { "message": "Logged out successfully" }

// ============================================
// PASSWORD MANAGEMENT
// ============================================

POST   /api/v1/auth/forgot-password
Request: { "email": "user@example.com" }
Response: { "message": "Reset link sent to email" }

POST   /api/v1/auth/reset-password
Request: {
  "token": "reset-token",
  "new_password": "NewPassword123!"
}
Response: { "message": "Password reset successful" }

POST   /api/v1/auth/change-password
Headers: { "Authorization": "Bearer ..." }
Request: {
  "current_password": "OldPassword123!",
  "new_password": "NewPassword123!"
}
Response: { "message": "Password changed successfully" }

// ============================================
// OAUTH
// ============================================

POST   /api/v1/auth/oauth/google
POST   /api/v1/auth/oauth/facebook
POST   /api/v1/auth/oauth/microsoft

GET    /api/v1/auth/oauth/callback/{provider}
// OAuth callback endpoint

// ============================================
// USER PROFILE
// ============================================

GET    /api/v1/auth/me
// Get current user profile
Headers: { "Authorization": "Bearer ..." }
Response: {
  "id": "uuid",
  "email": "user@example.com",
  "full_name": "John Doe",
  "phone": "+919876543210",
  "user_type": "buyer",
  "is_active": true,
  "created_at": "2026-01-08T00:00:00Z"
}

PUT    /api/v1/auth/me
// Update user profile
Headers: { "Authorization": "Bearer ..." }
Request: {
  "full_name": "John Updated Doe",
  "phone": "+919876543211"
}
```

---

### 2. Property Service (Port 3002)

**Responsibility**: Property listings, search, filtering

#### Endpoints

```typescript
// ============================================
// PROPERTY SEARCH & LISTING
// ============================================

GET    /api/v1/properties
// Search properties with filters
Query Params: {
  "city": "Bangalore",
  "bhk": "3BHK",
  "min_price": 5000000,
  "max_price": 15000000,
  "min_area": 1000,
  "max_area": 2000,
  "amenities": "pool,gym,parking",
  "status": "available",
  "page": 1,
  "limit": 20,
  "sort": "price_asc"  // price_asc | price_desc | area_asc | area_desc
}
Response: {
  "properties": [
    {
      "id": "prop-uuid",
      "name": "Luxury Villa in Whitefield",
      "price": 10000000,
      "bhk": "3BHK",
      "area_sqft": 1500,
      "location": {
        "city": "Bangalore",
        "locality": "Whitefield",
        "lat": 12.9698,
        "lng": 77.7500
      },
      "amenities": ["pool", "gym", "parking"],
      "images": ["url1", "url2"],
      "status": "available"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "total_pages": 8
  }
}

GET    /api/v1/properties/:id
// Get property details
Response: {
  "id": "prop-uuid",
  "name": "Luxury Villa in Whitefield",
  "description": "Beautiful 3BHK villa...",
  "price": 10000000,
  "bhk": "3BHK",
  "area_sqft": 1500,
  "location": { ... },
  "amenities": [ ... ],
  "images": [ ... ],
  "floor_plan": "url",
  "builder": {
    "id": "builder-uuid",
    "name": "Prestige Builders",
    "contact": "+919876543210"
  },
  "status": "available",
  "possession_date": "2026-12-31",
  "rera_number": "PRM/KA/RERA/1251/446/PR/171220/002508"
}

POST   /api/v1/properties/geo-search
// Geospatial search (find properties near location)
Request: {
  "lat": 12.9716,
  "lng": 77.5946,
  "radius_km": 5,
  "filters": {
    "bhk": "3BHK",
    "max_price": 15000000
  }
}
Response: {
  "properties": [ ... ],
  "map_bounds": {
    "north": 12.9816,
    "south": 12.9616,
    "east": 77.6046,
    "west": 77.5846
  }
}

// ============================================
// PROPERTY MANAGEMENT (Builder Only)
// ============================================

POST   /api/v1/properties
// Create new property listing
Headers: { "Authorization": "Bearer ..." }
Request: {
  "name": "New Villa Project",
  "description": "...",
  "price": 12000000,
  "bhk": "4BHK",
  "area_sqft": 2000,
  "location": {
    "address": "123 Main St",
    "city": "Bangalore",
    "locality": "Koramangala",
    "lat": 12.9352,
    "lng": 77.6245
  },
  "amenities": ["pool", "gym"],
  "rera_number": "PRM/KA/..."
}

PUT    /api/v1/properties/:id
// Update property
Headers: { "Authorization": "Bearer ..." }
Request: { ... }

DELETE /api/v1/properties/:id
// Delete property
Headers: { "Authorization": "Bearer ..." }

// ============================================
// PROPERTY FAVORITES
// ============================================

POST   /api/v1/properties/:id/favorite
// Add to favorites
Headers: { "Authorization": "Bearer ..." }

DELETE /api/v1/properties/:id/favorite
// Remove from favorites

GET    /api/v1/properties/favorites
// Get user favorites
Headers: { "Authorization": "Bearer ..." }
```

---

### 3. User Service (Port 3003)

**Responsibility**: User profiles, preferences, saved searches

#### Endpoints

```typescript
// ============================================
// USER PROFILE MANAGEMENT
// ============================================

GET    /api/v1/users/:id
// Get user profile
Headers: { "Authorization": "Bearer ..." }

PUT    /api/v1/users/:id
// Update user profile
Headers: { "Authorization": "Bearer ..." }
Request: {
  "full_name": "Updated Name",
  "avatar_url": "https://...",
  "bio": "Real estate enthusiast"
}

// ============================================
// USER PREFERENCES
// ============================================

GET    /api/v1/users/:id/preferences
// Get user preferences
Response: {
  "search_preferences": {
    "preferred_cities": ["Bangalore", "Hyderabad"],
    "preferred_bhk": ["2BHK", "3BHK"],
    "budget_min": 5000000,
    "budget_max": 15000000
  },
  "notification_preferences": {
    "email": true,
    "sms": false,
    "push": true
  }
}

PUT    /api/v1/users/:id/preferences
// Update preferences
Request: { ... }

// ============================================
// SAVED SEARCHES
// ============================================

GET    /api/v1/users/:id/saved-searches
POST   /api/v1/users/:id/saved-searches
DELETE /api/v1/users/:id/saved-searches/:search_id
```

---

### 4. Document Service (Port 3004)

**Responsibility**: Document upload, verification, storage

#### Endpoints

```typescript
// ============================================
// DOCUMENT UPLOAD
// ============================================

POST   /api/v1/documents/upload
// Upload document
Headers: {
  "Authorization": "Bearer ...",
  "Content-Type": "multipart/form-data"
}
Request: FormData {
  "file": File,
  "document_type": "aadhaar | pan | income_proof | property_doc",
  "entity_type": "user | property",
  "entity_id": "uuid"
}
Response: {
  "document": {
    "id": "doc-uuid",
    "filename": "aadhaar.pdf",
    "document_type": "aadhaar",
    "file_url": "https://s3.../doc.pdf",
    "uploaded_at": "2026-01-08T00:00:00Z",
    "status": "pending_verification"
  }
}

GET    /api/v1/documents/:id
// Get document details

DELETE /api/v1/documents/:id
// Delete document

// ============================================
// DOCUMENT VERIFICATION
// ============================================

POST   /api/v1/documents/:id/verify
// Verify document (admin/system)
Headers: { "Authorization": "Bearer ..." }
Request: {
  "status": "verified | rejected",
  "notes": "Document verified successfully"
}

GET    /api/v1/documents/entity/:entity_type/:entity_id
// Get all documents for entity
Query Params: {
  "entity_type": "user",
  "entity_id": "user-uuid"
}
```

---

### 5. Payment Service (Port 3005)

**Responsibility**: Payment processing, EMI, transactions

#### Endpoints

```typescript
// ============================================
// PAYMENT INITIATION
// ============================================

POST   /api/v1/payments/create-order
// Create payment order
Headers: { "Authorization": "Bearer ..." }
Request: {
  "amount": 500000,  // Token amount in paisa
  "currency": "INR",
  "property_id": "prop-uuid",
  "payment_type": "token | booking | emi",
  "payment_method": "razorpay | stripe | bank_transfer"
}
Response: {
  "order_id": "order-uuid",
  "payment_gateway_order_id": "razorpay_order_id",
  "amount": 500000,
  "currency": "INR",
  "status": "created"
}

POST   /api/v1/payments/verify
// Verify payment
Request: {
  "order_id": "order-uuid",
  "payment_id": "razorpay_payment_id",
  "signature": "razorpay_signature"
}
Response: {
  "status": "success | failed",
  "transaction_id": "txn-uuid",
  "message": "Payment verified successfully"
}

// ============================================
// PAYMENT HISTORY
// ============================================

GET    /api/v1/payments/transactions
// Get payment history
Headers: { "Authorization": "Bearer ..." }
Query Params: {
  "user_id": "uuid",
  "property_id": "uuid",
  "status": "success | pending | failed",
  "page": 1,
  "limit": 20
}

GET    /api/v1/payments/transactions/:id
// Get transaction details

// ============================================
// EMI CALCULATOR
// ============================================

POST   /api/v1/payments/calculate-emi
// Calculate EMI
Request: {
  "principal": 10000000,
  "interest_rate": 8.5,
  "tenure_months": 240
}
Response: {
  "emi": 86782,  // Monthly EMI
  "total_interest": 10827680,
  "total_amount": 20827680,
  "breakdown": [
    {
      "month": 1,
      "principal": 16782,
      "interest": 70000,
      "balance": 9983218
    },
    // ... more months
  ]
}
```

---

### 6. Loan Service (Port 3006)

**Responsibility**: Loan eligibility, applications, bank integrations

#### Endpoints

```typescript
// ============================================
// LOAN ELIGIBILITY
// ============================================

POST   /api/v1/loans/check-eligibility
// Check loan eligibility
Headers: { "Authorization": "Bearer ..." }
Request: {
  "user_id": "uuid",
  "monthly_income": 150000,
  "existing_emi": 20000,
  "credit_score": 750,
  "employment_type": "salaried | self_employed",
  "property_value": 10000000
}
Response: {
  "eligible": true,
  "max_loan_amount": 8500000,
  "estimated_emi": 73464,
  "interest_rate_range": {
    "min": 8.5,
    "max": 9.5
  },
  "recommended_banks": [
    {
      "bank_name": "HDFC Bank",
      "interest_rate": 8.65,
      "processing_fee": 0.5
    }
  ]
}

// ============================================
// LOAN APPLICATION
// ============================================

POST   /api/v1/loans/apply
// Apply for loan
Headers: { "Authorization": "Bearer ..." }
Request: {
  "property_id": "prop-uuid",
  "loan_amount": 8000000,
  "tenure_months": 240,
  "preferred_bank": "HDFC Bank",
  "employment_details": { ... },
  "income_documents": ["doc-uuid-1", "doc-uuid-2"]
}
Response: {
  "application_id": "loan-app-uuid",
  "status": "submitted",
  "reference_number": "LN202601080001"
}

GET    /api/v1/loans/applications
// Get loan applications
Headers: { "Authorization": "Bearer ..." }

GET    /api/v1/loans/applications/:id
// Get application details

PUT    /api/v1/loans/applications/:id/status
// Update application status (bank/admin)
```

---

### 7. CRM Service (Port 3007)

**Responsibility**: Lead management, agent assignment, follow-ups

#### Endpoints

```typescript
// ============================================
// LEAD MANAGEMENT
// ============================================

POST   /api/v1/crm/leads
// Create new lead
Headers: { "Authorization": "Bearer ..." }
Request: {
  "property_id": "prop-uuid",
  "customer_name": "Ramesh Kumar",
  "customer_phone": "+919876543210",
  "customer_email": "ramesh@example.com",
  "source": "website | app | agent | walk-in",
  "message": "Interested in 3BHK apartment"
}
Response: {
  "lead_id": "lead-uuid",
  "status": "new",
  "assigned_agent": null
}

GET    /api/v1/crm/leads
// Get all leads
Headers: { "Authorization": "Bearer ..." }
Query Params: {
  "status": "new | contacted | qualified | converted | lost",
  "agent_id": "uuid",
  "property_id": "uuid",
  "page": 1,
  "limit": 20
}

GET    /api/v1/crm/leads/:id
// Get lead details

PUT    /api/v1/crm/leads/:id
// Update lead
Request: {
  "status": "contacted",
  "notes": "Spoke with customer, interested in site visit"
}

// ============================================
// AGENT ASSIGNMENT
// ============================================

POST   /api/v1/crm/leads/:id/assign
// Assign lead to agent
Request: {
  "agent_id": "agent-uuid"
}

// ============================================
// FOLLOW-UPS
// ============================================

POST   /api/v1/crm/leads/:id/follow-up
// Add follow-up
Request: {
  "scheduled_at": "2026-01-10T10:00:00Z",
  "type": "call | email | site_visit",
  "notes": "Schedule site visit"
}

GET    /api/v1/crm/leads/:id/follow-ups
// Get follow-ups for lead
```

---

### 8. Notification Service (Port 3008)

**Responsibility**: Email, SMS, push notifications

#### Endpoints

```typescript
// ============================================
// SEND NOTIFICATIONS
// ============================================

POST   /api/v1/notifications/send
// Send notification
Headers: { "Authorization": "Bearer ..." }
Request: {
  "user_id": "uuid",
  "type": "email | sms | push",
  "template": "property_inquiry | payment_success | loan_approved",
  "data": {
    "property_name": "Luxury Villa",
    "amount": 500000
  }
}

POST   /api/v1/notifications/bulk
// Send bulk notifications
Request: {
  "user_ids": ["uuid1", "uuid2"],
  "type": "email",
  "template": "new_property_alert",
  "data": { ... }
}

// ============================================
// NOTIFICATION HISTORY
// ============================================

GET    /api/v1/notifications/history
// Get notification history
Headers: { "Authorization": "Bearer ..." }
Query Params: {
  "user_id": "uuid",
  "type": "email | sms | push",
  "status": "sent | delivered | failed",
  "page": 1,
  "limit": 20
}
```

---

### 9. AI Orchestrator (Port 3009)

**Responsibility**: AI-powered search, recommendations, chatbot

#### Endpoints

```typescript
// ============================================
// AI SEARCH
// ============================================

POST   /api/v1/ai/search
// AI-powered property search
Headers: { "Authorization": "Bearer ..." }
Request: {
  "query": "Find me a 3BHK apartment in Bangalore near tech parks under 1.5 crore",
  "conversation_id": "conv-uuid",  // Optional, for context
  "filters": {
    "city": "Bangalore"
  }
}
Response: {
  "properties": [ ... ],
  "explanation": "I found 12 properties matching your criteria. These are located near Whitefield and ITPL tech parks...",
  "sources": ["property-1", "property-2"],
  "confidence": 0.89
}

// ============================================
// AI CHATBOT
// ============================================

POST   /api/v1/ai/chat
// Chat with AI assistant
Headers: { "Authorization": "Bearer ..." }
Request: {
  "message": "What are the loan options for this property?",
  "conversation_id": "conv-uuid",
  "context": {
    "property_id": "prop-uuid"
  }
}
Response: {
  "response": "Based on the property value of ₹1.2 Cr, you can get a home loan of up to ₹1 Cr at interest rates ranging from 8.5% to 9.5%. HDFC and SBI are offering the best rates...",
  "suggestions": [
    "Check loan eligibility",
    "Calculate EMI",
    "Apply for loan"
  ],
  "conversation_id": "conv-uuid"
}

// ============================================
// AI RECOMMENDATIONS
// ============================================

GET    /api/v1/ai/recommendations
// Get AI property recommendations
Headers: { "Authorization": "Bearer ..." }
Query Params: {
  "user_id": "uuid"
}
Response: {
  "recommendations": [
    {
      "property": { ... },
      "score": 0.92,
      "reason": "Matches your preference for 3BHK near tech parks"
    }
  ]
}
```

---

### 10. Legal Certificate Service (Port 3011)

**Responsibility**: Legal certificate tracking, authority interaction, transaction packs

#### Endpoints

```typescript
// ============================================
// CERTIFICATE MANAGEMENT
// ============================================

GET    /api/v1/legal/certificates
// Get all certificates for a project
Headers: { "Authorization": "Bearer ..." }
Query Params: {
  "project_id": "uuid",
  "entity_type": "PROJECT | TOWER | PHASE | UNIT",
  "certificate_type": "RERA_REGISTRATION | OCCUPANCY_CERTIFICATE | ...",
  "status": "PENDING | APPROVED | ISSUED | EXPIRED",
  "verification_status": "PENDING | VERIFIED | FAILED"
}
Response: {
  "certificates": [
    {
      "id": "cert-uuid",
      "certificate_type": "RERA_REGISTRATION",
      "certificate_name": "RERA Registration Certificate",
      "certificate_number": "PRM/KA/RERA/1251/446/PR/171220/002508",
      "issuing_authority": "Karnataka RERA",
      "issue_date": "2024-01-15",
      "expiry_date": "2027-01-15",
      "status": "ISSUED",
      "verification_status": "VERIFIED",
      "document_url": "https://...",
      "ai_summary": "RERA registration valid for 500 units across 3 towers...",
      "key_rights": [
        {"right": "Approved for 500 units", "source": "page 2"}
      ],
      "key_obligations": [
        {"obligation": "Complete by Dec 2027", "source": "clause 5"}
      ]
    }
  ]
}

POST   /api/v1/legal/certificates
// Upload new certificate
Headers: {
  "Authorization": "Bearer ...",
  "Content-Type": "multipart/form-data"
}
Request: FormData {
  "entity_type": "PROJECT",
  "entity_id": "project-uuid",
  "certificate_type": "RERA_REGISTRATION",
  "certificate_name": "RERA Registration",
  "certificate_number": "PRM/KA/...",
  "issuing_authority": "Karnataka RERA",
  "issue_date": "2024-01-15",
  "expiry_date": "2027-01-15",
  "document": File,
  "portal_url": "https://rera.karnataka.gov.in/..."
}
Response: {
  "certificate_id": "cert-uuid",
  "status": "PENDING",
  "verification_status": "PENDING",
  "document_hash": "sha256-hash"
}

GET    /api/v1/legal/certificates/:id
// Get certificate details

PUT    /api/v1/legal/certificates/:id/verify
// Verify certificate (lawyer/admin)
Request: {
  "verification_method": "PORTAL_CROSSCHECK | DIGITAL_SIGNATURE | MANUAL_LEGAL_REVIEW",
  "verification_status": "VERIFIED | FAILED",
  "verification_notes": "Verified on govt portal",
  "evidence_urls": ["screenshot-url"]
}

// ============================================
// MISSING CERTIFICATE ALERTS
// ============================================

GET    /api/v1/legal/missing-certificates/:project_id
// Get missing certificate alerts for project
Response: {
  "alerts": [
    {
      "id": "alert-uuid",
      "missing_certificate_type": "OCCUPANCY_CERTIFICATE",
      "required_for_stage": "HANDOVER",
      "severity": "CRITICAL",
      "alert_message": "Occupancy Certificate is mandatory before handover",
      "regulatory_implication": "Cannot legally hand over units without OC",
      "buyer_risk_level": "HIGH",
      "expected_resolution_date": "2026-06-30",
      "buyer_visible": true
    }
  ]
}

// ============================================
// AUTHORITY TRACKING
// ============================================

POST   /api/v1/legal/authority-followups
// Create authority follow-up
Headers: { "Authorization": "Bearer ..." }
Request: {
  "certificate_id": "cert-uuid",
  "project_id": "project-uuid",
  "authority_name": "BBMP",
  "authority_department": "Building Plan Approval",
  "application_number": "BPA/2026/001",
  "application_date": "2026-01-08",
  "application_type": "NEW_APPLICATION",
  "current_status": "Under Review",
  "expected_completion_date": "2026-03-08",
  "next_follow_up_date": "2026-01-15",
  "follow_up_frequency_days": 7,
  "auto_follow_up_enabled": true
}

GET    /api/v1/legal/authority-followups
// Get all follow-ups
Query Params: {
  "project_id": "uuid",
  "assigned_to": "user-uuid",
  "priority": "LOW | MEDIUM | HIGH | URGENT"
}

POST   /api/v1/legal/authority-followups/:id/communicate
// Log communication with authority
Request: {
  "communication_type": "EMAIL_SENT | PHONE_CALL | PORTAL_SUBMISSION | IN_PERSON_VISIT",
  "from_party": "Trust OS Legal Team",
  "to_party": "BBMP",
  "contact_person": "Mr. Sharma",
  "subject": "Follow-up on BPA/2026/001",
  "message_summary": "Requested status update",
  "attachment_urls": [],
  "action_items": [
    {"action": "Submit revised plan", "deadline": "2026-02-15"}
  ]
}

// ============================================
// TRANSACTION LEGAL PACKS
// ============================================

GET    /api/v1/legal/transaction-packs/:lead_id
// Get transaction legal pack for lead
Response: {
  "pack": {
    "id": "pack-uuid",
    "pack_type": "BOOKING",
    "pack_status": "READY",
    "completion_percentage": 85,
    "required_documents": [
      {"doc_type": "RERA", "required": true, "status": "AVAILABLE"},
      {"doc_type": "OC", "required": true, "status": "MISSING"},
      {"doc_type": "ENCUMBRANCE", "required": true, "status": "AVAILABLE"}
    ],
    "risk_flags": [
      {
        "risk": "OC pending",
        "severity": "MEDIUM",
        "impact": "Handover may be delayed by 3-6 months"
      }
    ],
    "overall_risk_level": "MEDIUM",
    "risk_summary": "1 medium risk: Occupancy Certificate pending",
    "digital_vault_url": "https://vault.propmubi.com/pack-uuid",
    "pdf_download_url": "https://...",
    "generated_at": "2026-01-08T10:00:00Z"
  }
}

POST   /api/v1/legal/transaction-packs
// Generate transaction legal pack
Request: {
  "lead_id": "lead-uuid",
  "unit_id": "unit-uuid",
  "buyer_id": "buyer-uuid",
  "pack_type": "BOOKING | PRE_SALE | SALE | HANDOVER"
}

POST   /api/v1/legal/transaction-packs/:pack_id/share
// Share legal pack with stakeholders
Request: {
  "share_with": [
    {"user_id": "bank-user-uuid", "role": "BANK"},
    {"user_id": "lawyer-uuid", "role": "LAWYER"}
  ],
  "access_expiry": "2026-02-08T00:00:00Z"
}

POST   /api/v1/legal/transaction-packs/:pack_id/review
// Submit pack review (buyer/bank/lawyer)
Request: {
  "reviewer_role": "BUYER | BANK | LAWYER",
  "review_status": "APPROVED | APPROVED_WITH_CONDITIONS | REJECTED | NEEDS_CLARIFICATION",
  "comments": "All documents verified",
  "concerns": [
    {"concern": "EC shows pending mortgage", "severity": "HIGH"}
  ],
  "questions": [
    {"question": "Is OC expected by March?", "answered": false}
  ],
  "recommendations": "Suggest waiting for OC before final payment"
}

// ============================================
// CERTIFICATE ANALYTICS
// ============================================

GET    /api/v1/legal/certificate-timeline/:project_id
// Get visual certificate timeline
Response: {
  "timeline": {
    "milestones": [
      {
        "cert_type": "RERA",
        "status": "APPROVED",
        "date": "2024-01-15",
        "is_completed": true
      },
      {
        "cert_type": "BUILDING_PLAN_APPROVAL",
        "status": "IN_PROGRESS",
        "date": null,
        "is_completed": false
      }
    ],
    "critical_path": [
      {
        "step": "Building Plan Approval",
        "blocking": true,
        "eta": "2026-03-01",
        "status": "IN_PROGRESS"
      }
    ],
    "delayed_milestones": [
      {
        "cert_type": "FIRE_NOC",
        "delay_days": 45,
        "impact": "HIGH"
      }
    ],
    "timeline_svg": "<svg>...</svg>",
    "gantt_chart_url": "https://..."
  }
}

GET    /api/v1/legal/certificate-checklist/:project_id
// Get stage-based certificate checklist
Query Params: {
  "stage": "PRE_LAUNCH | CONSTRUCTION | HANDOVER | POST_HANDOVER"
}
Response: {
  "checklist": {
    "stage": "HANDOVER",
    "checklist_items": [
      {
        "cert_type": "OCCUPANCY_CERTIFICATE",
        "required": true,
        "status": "MISSING",
        "impact": "Cannot legally hand over units"
      },
      {
        "cert_type": "COMPLETION_CERTIFICATE",
        "required": true,
        "status": "COMPLETE"
      }
    ],
    "completion_percentage": 75,
    "critical_gaps": [
      {
        "cert_type": "OCCUPANCY_CERTIFICATE",
        "impact": "Blocks handover"
      }
    ],
    "buyer_facing_summary": "Project is 75% ready for handover. Occupancy Certificate pending from BBMP.",
    "risk_indicator": "YELLOW"
  }
}
```

---

## Request/Response Patterns

### Standard Response Format

```typescript
// Success Response
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "timestamp": "2026-01-08T00:00:00Z"
}

// Error Response
{
  "success": false,
  "error": {
    "code": "PROPERTY_NOT_FOUND",
    "message": "Property with ID xyz not found",
    "details": { ... }
  },
  "timestamp": "2026-01-08T00:00:00Z"
}

// Paginated Response
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "total_pages": 8
  }
}
```

---

## Error Handling

### HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful request |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Missing/invalid authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 422 | Unprocessable Entity | Validation errors |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

### Error Codes

```typescript
enum ErrorCode {
  // Authentication
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  TOKEN_EXPIRED = "TOKEN_EXPIRED",
  UNAUTHORIZED = "UNAUTHORIZED",

  // Validation
  VALIDATION_ERROR = "VALIDATION_ERROR",
  MISSING_REQUIRED_FIELD = "MISSING_REQUIRED_FIELD",

  // Resource
  RESOURCE_NOT_FOUND = "RESOURCE_NOT_FOUND",
  DUPLICATE_RESOURCE = "DUPLICATE_RESOURCE",

  // Business Logic
  INSUFFICIENT_BALANCE = "INSUFFICIENT_BALANCE",
  PROPERTY_NOT_AVAILABLE = "PROPERTY_NOT_AVAILABLE",
  LOAN_ELIGIBILITY_FAILED = "LOAN_ELIGIBILITY_FAILED"
}
```

---

## Rate Limiting

### Rate Limits by Endpoint

| Endpoint Type | Rate Limit | Window |
|---------------|------------|--------|
| Authentication | 5 requests | 15 minutes |
| Read Operations | 100 requests | 1 minute |
| Write Operations | 20 requests | 1 minute |
| AI Services | 10 requests | 1 minute |
| File Upload | 5 uploads | 5 minutes |

### Rate Limit Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1641600000
```

---

**Last Updated**: January 8, 2026
**Status**: ✅ Complete
**Maintainer**: AGENT-BE
