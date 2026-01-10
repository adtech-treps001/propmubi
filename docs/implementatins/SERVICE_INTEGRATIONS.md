# Service Integrations - Complete Provider Mapping
# Propmubi Real Estate Super App

**Version:** 2.0
**Last Updated:** November 2024
**Status:** Production Ready

---

## Overview

This document maps all **33 external service providers** integrated into Propmubi, organized by domain. Each integration includes the provider name, integration type, data exchange pattern, and implementation status.

---

## 🔍 Land & Trust Services

### 1. Landeed
**Integration Type:** REST API
**Function:** Fast Doc Fetch - Instant download of EC (Encumbrance Certificate), RoR (Record of Rights), and Adangal by Survey Number

**Endpoint:**
```typescript
POST /api/integrations/landeed/fetch-documents
Request: {
  surveyNumber: string,
  district: string,
  state: string,
  documentTypes: ['EC', 'ROR', 'ADANGAL']
}
Response: {
  documents: {
    ec: { url: string, validUntil: string },
    ror: { url: string, updatedOn: string },
    adangal: { url: string, area: number }
  },
  processingTime: number, // milliseconds
  status: 'SUCCESS' | 'PARTIAL' | 'FAILED'
}
```

**Use Cases:**
- Due diligence report generation
- Land verification in Land & JV module
- Pre-purchase legal checks

---

### 2. TEAL (Terra Economics)
**Integration Type:** REST API
**Function:** Title Risk Score - Deep historical check of ownership disputes and court records

**Endpoint:**
```typescript
POST /api/integrations/teal/title-risk-assessment
Request: {
  propertyId: string,
  surveyNumber: string,
  ownerName: string,
  historicalDepth: number // years to check (default: 30)
}
Response: {
  riskScore: number, // 0-100 (0 = high risk, 100 = clean)
  disputes: Array<{
    caseNumber: string,
    court: string,
    status: 'PENDING' | 'RESOLVED',
    filedDate: string,
    severity: 'LOW' | 'MEDIUM' | 'HIGH'
  }>,
  ownershipChain: Array<{
    owner: string,
    period: { from: string, to: string },
    verified: boolean
  }>,
  recommendations: string[]
}
```

**Use Cases:**
- Critical component of due diligence score
- Risk assessment for bank loans
- Insurance underwriting

---

### 3. SurePass
**Integration Type:** REST API (Wrapper)
**Function:** Verification - Check RERA Project Status and verify Govt IDs (Aadhaar/PAN)

**Endpoints:**
```typescript
// RERA Verification
POST /api/integrations/surepass/verify-rera
Request: {
  reraNumber: string,
  state: string
}
Response: {
  isValid: boolean,
  projectName: string,
  builderName: string,
  status: 'REGISTERED' | 'EXPIRED' | 'CANCELLED',
  completionDate: string,
  sanctionedPlans: string[]
}

// Aadhaar Verification
POST /api/integrations/surepass/verify-aadhaar
Request: {
  aadhaarNumber: string, // masked
  otp: string
}
Response: {
  verified: boolean,
  name: string,
  dob: string,
  address: string
}

// PAN Verification
POST /api/integrations/surepass/verify-pan
Request: {
  panNumber: string,
  name: string
}
Response: {
  verified: boolean,
  name: string,
  match: boolean
}
```

**Use Cases:**
- Builder verification
- Tenant/buyer KYC
- RERA compliance checks

---

### 4. Dharani / Maa Bhoomi
**Integration Type:** Web Scraper (Puppeteer) / Direct Portal
**Function:** Source of Truth - Raw State Govt portals for land records (Telangana/AP)

**Scraping Workflow:**
```typescript
POST /api/integrations/dharani/scrape-land-records
Request: {
  surveyNumber: string,
  district: string,
  mandal: string,
  village: string,
  state: 'TELANGANA' | 'ANDHRA_PRADESH'
}
Response: {
  ownerName: string,
  extent: string, // acres/guntas
  passbook: {
    pattadarName: string,
    khataNumber: string,
    landClassification: 'AGRICULTURAL' | 'NON_AGRICULTURAL'
  },
  mutations: Array<{
    date: string,
    type: string,
    remarks: string
  }>,
  fetchedAt: string
}
```

**Technical Implementation:**
- Daily scraping at 2 AM IST
- Captcha solving via 2Captcha API
- Results cached for 24 hours (Redis)
- Fallback to manual verification if captcha fails 3 times

---

### 5. Sentinel Hub
**Integration Type:** REST API (Satellite Imagery)
**Function:** Satellite Monitor - Weekly change detection (Green-to-Grey) for construction progress

**Endpoint:**
```typescript
POST /api/integrations/sentinel/change-detection
Request: {
  propertyId: string,
  coordinates: { lat: number, lng: number },
  boundingBox: { neLat: number, neLng: number, swLat: number, swLng: number },
  startDate: string, // ISO 8601
  endDate: string,
  analysisType: 'CONSTRUCTION' | 'VEGETATION' | 'ENCROACHMENT'
}
Response: {
  changeDetected: boolean,
  changePercentage: number, // 0-100
  changeType: 'GREEN_TO_GREY' | 'GREY_TO_GREEN' | 'NO_CHANGE',
  images: {
    before: string, // URL
    after: string, // URL
    diff: string // Highlighted differences
  },
  ndvi: { before: number, after: number }, // Normalized Difference Vegetation Index
  confidence: number, // 0-1
  alertLevel: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH'
}
```

**ML Pipeline:**
- Image preprocessing: Cloud removal, atmospheric correction
- Change detection: NDVI calculation + CNN-based classification
- Alert threshold: 15% change triggers notification

---

## 💰 Finance & Identity Services

### 6. Setu / Anumati
**Integration Type:** Account Aggregator API (RBI-licensed)
**Function:** Fetch 12-month bank statements for instant loan eligibility

**Endpoint:**
```typescript
POST /api/integrations/setu/initiate-aa-consent
Request: {
  userId: string,
  mobileNumber: string,
  purpose: 'LOAN_ELIGIBILITY' | 'INCOME_VERIFICATION',
  dataRange: { from: string, to: string }
}
Response: {
  consentId: string,
  consentUrl: string, // User redirected here
  expiresAt: string
}

GET /api/integrations/setu/fetch-financial-data/:consentId
Response: {
  accounts: Array<{
    accountNumber: string, // masked
    type: 'SAVINGS' | 'CURRENT' | 'CREDIT_CARD',
    bank: string,
    balance: number,
    transactions: Array<{
      date: string,
      amount: number,
      type: 'CREDIT' | 'DEBIT',
      narration: string
    }>
  }>,
  analysis: {
    averageMonthlyIncome: number,
    averageMonthlyExpense: number,
    loanEligibility: number,
    emiCapacity: number,
    riskScore: number
  }
}
```

**Use Cases:**
- Instant loan pre-approval
- Rental deposit calculation
- Income verification for tenants

---

### 7. DigiLocker
**Integration Type:** REST API (Govt)
**Function:** KYC Vault - Fetch verified Aadhaar/PAN directly from Govt database

**Endpoint:**
```typescript
POST /api/integrations/digilocker/fetch-documents
Request: {
  aadhaarNumber: string,
  otp: string,
  documentTypes: ['AADHAAR', 'PAN', 'DRIVING_LICENSE']
}
Response: {
  documents: Array<{
    type: string,
    url: string, // Digitally signed PDF
    issuedBy: string,
    issuedDate: string,
    verified: boolean
  }>,
  holderDetails: {
    name: string,
    dob: string,
    address: string
  }
}
```

---

### 8. Experian / CRIF
**Integration Type:** REST API
**Function:** Credit Check - Instant credit score fetch before sending leads to banks

**Endpoint:**
```typescript
POST /api/integrations/experian/fetch-credit-score
Request: {
  panNumber: string,
  name: string,
  dob: string,
  purpose: 'LOAN' | 'RENTAL_DEPOSIT'
}
Response: {
  creditScore: number, // 300-900
  scoreCategory: 'POOR' | 'FAIR' | 'GOOD' | 'EXCELLENT',
  reportDate: string,
  factors: {
    paymentHistory: number,
    creditUtilization: number,
    lengthOfCreditHistory: number,
    newCredit: number,
    creditMix: number
  },
  accounts: Array<{
    type: 'LOAN' | 'CREDIT_CARD',
    bank: string,
    status: 'ACTIVE' | 'CLOSED',
    outstandingAmount: number,
    dpd: number // Days Past Due
  }>,
  recommendations: string[]
}
```

**Pricing:** ₹50 per credit pull (passed to user as ₹99)

---

### 9. Razorpay / Cashfree
**Integration Type:** SDK
**Function:** Payments - Collection of Booking Tokens, Subscription Fees, Service Commissions

**Endpoints:**
```typescript
// Create Payment Order
POST /api/integrations/razorpay/create-order
Request: {
  amount: number,
  currency: 'INR',
  receipt: string,
  notes: {
    propertyId: string,
    userId: string,
    type: 'TOKEN' | 'SUBSCRIPTION' | 'SERVICE_FEE'
  }
}
Response: {
  orderId: string,
  amount: number,
  currency: string,
  status: 'CREATED'
}

// Verify Payment
POST /api/integrations/razorpay/verify-payment
Request: {
  orderId: string,
  paymentId: string,
  signature: string
}
Response: {
  verified: boolean,
  status: 'SUCCESS' | 'FAILED'
}

// Refund
POST /api/integrations/razorpay/initiate-refund
Request: {
  paymentId: string,
  amount: number, // partial or full
  reason: string
}
Response: {
  refundId: string,
  status: 'PROCESSING',
  estimatedTime: string // e.g., "5-7 business days"
}
```

**Payment Gateway Split:**
- Razorpay: 70% (cards, UPI, wallets)
- Cashfree: 30% (net banking, bulk payouts)

---

## ⚖️ Legal & Tax Services

### 10. LegalKart / VakilSearch
**Integration Type:** Partner API
**Function:** Lawyer-as-a-Service - Forward "Property ID" + "Docs"; receive "Title Search Report" (PDF)

**Endpoint:**
```typescript
POST /api/integrations/legalkart/request-title-search
Request: {
  propertyId: string,
  documents: Array<{
    type: 'EC' | 'ROR' | 'SALE_DEED' | 'ADANGAL',
    url: string
  }>,
  urgency: 'STANDARD' | 'EXPRESS', // Express = 24h, Standard = 72h
  scope: 'BASIC' | 'COMPREHENSIVE'
}
Response: {
  requestId: string,
  estimatedDelivery: string,
  cost: number,
  assignedLawyer: {
    name: string,
    barCouncilId: string,
    experience: number
  }
}

GET /api/integrations/legalkart/report/:requestId
Response: {
  status: 'PENDING' | 'IN_REVIEW' | 'COMPLETED',
  report: {
    url: string, // PDF download
    summary: string,
    redFlags: Array<{
      type: 'ENCUMBRANCE' | 'DISPUTE' | 'DOCUMENTATION_GAP',
      severity: 'LOW' | 'MEDIUM' | 'HIGH',
      description: string,
      recommendation: string
    }>,
    clearanceScore: number // 0-100
  }
}
```

**SLA:** 72 hours for standard, 24 hours for express
**Pricing:** ₹2,500 (standard), ₹5,000 (express)

---

### 11. ClearTax / Quicko
**Integration Type:** REST API
**Function:** Tax Engine - Calculate Capital Gains tax liability and saving opportunities

**Endpoint:**
```typescript
POST /api/integrations/cleartax/calculate-capital-gains
Request: {
  propertyType: 'RESIDENTIAL' | 'COMMERCIAL' | 'LAND',
  purchasePrice: number,
  purchaseDate: string,
  salePrice: number,
  saleDate: string,
  improvements: Array<{
    date: string,
    amount: number,
    type: string
  }>,
  sellerType: 'INDIVIDUAL' | 'NRI' | 'COMPANY'
}
Response: {
  holdingPeriod: number, // years
  gainType: 'SHORT_TERM' | 'LONG_TERM',
  indexedCost: number,
  capitalGain: number,
  taxLiability: {
    beforeExemptions: number,
    exemptions: Array<{
      section: '54' | '54F' | '54EC',
      amount: number,
      description: string,
      deadline: string
    }>,
    afterExemptions: number
  },
  savingRecommendations: string[],
  calculationBreakdown: object
}
```

**Use Cases:**
- Seller tax planning
- Investment optimization
- Compliance reporting

---

### 12. Leegality / DocuSign
**Integration Type:** REST API
**Function:** E-Sign - Aadhaar-based OTP signing for Sale Agreements and Rental Deeds

**Endpoint:**
```typescript
POST /api/integrations/leegality/initiate-esign
Request: {
  documentType: 'SALE_AGREEMENT' | 'RENTAL_DEED' | 'JV_AGREEMENT',
  documentUrl: string, // PDF to be signed
  signatories: Array<{
    name: string,
    email: string,
    mobile: string,
    aadhaarNumber: string, // masked
    role: 'BUYER' | 'SELLER' | 'TENANT' | 'LANDLORD'
  }>,
  validUntil: string
}
Response: {
  transactionId: string,
  signingUrls: Array<{
    signatory: string,
    url: string,
    expiresAt: string
  }>,
  status: 'PENDING_SIGNATURES'
}

GET /api/integrations/leegality/status/:transactionId
Response: {
  status: 'PENDING' | 'PARTIALLY_SIGNED' | 'FULLY_SIGNED' | 'EXPIRED',
  signatures: Array<{
    signatory: string,
    signedAt: string,
    ipAddress: string,
    verified: boolean
  }>,
  signedDocumentUrl: string // Available when fully signed
}
```

**Legal Validity:** Compliant with IT Act 2000, admissible in court

---

### 13. Doorkeys / e-Sahayak
**Integration Type:** REST API
**Function:** Drafting - Auto-generate state-specific Rental Agreements on Stamp Paper

**Endpoint:**
```typescript
POST /api/integrations/doorkeys/generate-rental-agreement
Request: {
  state: string,
  city: string,
  landlord: {
    name: string,
    address: string,
    pan: string
  },
  tenant: {
    name: string,
    permanentAddress: string,
    pan: string
  },
  property: {
    address: string,
    type: '1BHK' | '2BHK' | '3BHK',
    rentAmount: number,
    depositAmount: number,
    maintenanceCharges: number
  },
  terms: {
    leasePeriod: number, // months
    noticePeriod: number, // days
    lockInPeriod: number, // months
    escalationClause: string
  },
  stampDuty: {
    paymentMethod: 'E_STAMP' | 'PHYSICAL',
    payerType: 'LANDLORD' | 'TENANT' | 'SPLIT'
  }
}
Response: {
  agreementId: string,
  documentUrl: string, // PDF
  stampPaperSerial: string,
  stampDutyAmount: number,
  registrationRequired: boolean,
  registrationFee: number,
  status: 'DRAFT' | 'STAMPED' | 'REGISTERED'
}
```

**Pricing:** ₹499 (includes stamp duty calculation)

---

## 📊 Market Intelligence Services

### 14. Zapkey
**Integration Type:** REST API
**Function:** Price Truth - Fetch actual Registration Data (Sold Price) for specific buildings/areas

**Endpoint:**
```typescript
POST /api/integrations/zapkey/fetch-registration-data
Request: {
  location: {
    address: string,
    city: string,
    pincode: string
  },
  filters: {
    propertyType: 'APARTMENT' | 'VILLA' | 'PLOT',
    dateRange: { from: string, to: string },
    minArea: number,
    maxArea: number
  }
}
Response: {
  transactions: Array<{
    registrationNumber: string,
    registrationDate: string,
    propertyDetails: {
      type: string,
      area: number,
      floor: number,
      age: number
    },
    salePrice: number,
    pricePerSqft: number,
    stampDuty: number,
    registrationFee: number,
    buyerName: string, // public record
    sellerName: string // public record
  }>,
  statistics: {
    averagePrice: number,
    averagePricePerSqft: number,
    medianPrice: number,
    priceRange: { min: number, max: number },
    transactionVolume: number
  },
  priceAppreciation: {
    yoy: number, // Year-over-year %
    qoq: number // Quarter-over-quarter %
  }
}
```

**Use Cases:**
- Accurate property valuation
- Market trend analysis
- Overpricing detection

---

### 15. GeoIQ
**Integration Type:** REST API
**Function:** Location Intel - Demographics, income levels, retail density heatmaps for commercial buyers

**Endpoint:**
```typescript
POST /api/integrations/geoiq/location-analysis
Request: {
  coordinates: { lat: number, lng: number },
  radius: number, // meters (500, 1000, 2000)
  analysisType: ['DEMOGRAPHICS', 'INCOME', 'RETAIL', 'TRANSPORT', 'EDUCATION']
}
Response: {
  demographics: {
    totalPopulation: number,
    populationDensity: number,
    ageDistribution: object,
    householdSize: number,
    literacyRate: number
  },
  income: {
    averageHouseholdIncome: number,
    incomeDistribution: {
      low: number, // percentage
      middle: number,
      upper: number
    },
    purchasingPower: number
  },
  retail: {
    shopsCount: number,
    mallsCount: number,
    averageFootfall: number,
    topCategories: string[],
    competition: Array<{
      name: string,
      category: string,
      distance: number
    }>
  },
  transport: {
    metroStations: Array<{ name: string, distance: number }>,
    busStops: number,
    walkabilityScore: number,
    trafficDensity: 'LOW' | 'MEDIUM' | 'HIGH'
  },
  locationScore: number, // 0-100
  recommendations: string[]
}
```

**Pricing:** ₹5,000 per report

---

### 16. PhantomBuster
**Integration Type:** Web Scraper (Cloud-based)
**Function:** Social Lead Gen - Scrape Instagram/FB hashtags (#NarsingiFlat) for Owner-Direct listings

**Workflow:**
```typescript
POST /api/integrations/phantombuster/scrape-social-posts
Request: {
  platform: 'INSTAGRAM' | 'FACEBOOK',
  hashtags: string[], // e.g., ['NarsingiFlat', 'HyderabadRealEstate']
  locations: string[],
  filters: {
    minFollowers: number,
    accountType: 'PERSONAL' | 'BUSINESS' | 'ALL',
    dateRange: { from: string, to: string }
  }
}
Response: {
  posts: Array<{
    postId: string,
    platform: string,
    author: {
      username: string,
      name: string,
      accountType: string,
      followers: number,
      verified: boolean
    },
    content: string,
    images: string[],
    hashtags: string[],
    mentions: string[],
    engagement: {
      likes: number,
      comments: number,
      shares: number
    },
    extractedDetails: {
      propertyType: string,
      location: string,
      price: number,
      contactNumber: string,
      ownerDirect: boolean
    },
    postedAt: string
  }>,
  totalScraped: number
}
```

**ML Pipeline:**
- NLP extraction of price, location, BHK from captions
- Phone number extraction with validation
- Duplicate detection across platforms
- Lead scoring based on engagement

**Daily Automation:** Runs every 6 hours for configured hashtags

---

### 17. 99acres / MagicBricks / NoBroker
**Integration Type:** Web Scraper
**Function:** Inventory Aggregation - Scrape competitor listings to build the "Master Feed"

**Scraping Architecture:**
```typescript
POST /api/integrations/aggregator/scrape-listings
Request: {
  source: '99ACRES' | 'MAGICBRICKS' | 'NOBROKER',
  location: {
    city: string,
    localities: string[]
  },
  filters: {
    propertyType: string,
    minPrice: number,
    maxPrice: number,
    bhk: number[]
  },
  limit: number
}
Response: {
  listings: Array<{
    externalId: string,
    source: string,
    title: string,
    description: string,
    price: number,
    location: string,
    size: number,
    bedrooms: number,
    bathrooms: number,
    images: string[],
    ownerType: 'OWNER' | 'BUILDER' | 'DEALER',
    contactNumber: string,
    postedDate: string,
    lastUpdated: string,
    url: string
  }>,
  totalScraped: number,
  duplicatesRemoved: number
}
```

**Anti-Detection:**
- Rotating proxies (Bright Data)
- User-agent rotation
- Rate limiting: 1 request per 2 seconds
- Session management with cookies
- Fallback to Selenium for JS-heavy sites

**Data Enrichment:**
- Phone number normalization
- Deduplication by address + price
- Auto-categorization by ML
- Lead quality scoring

---

## 👓 Visuals & Design (Digital Twins)

### 18. Matterport
**Integration Type:** SDK (Web + Mobile)
**Function:** 3D Reality - Display "As-Built" digital twins for resale/old properties

**Endpoints:**
```typescript
// Upload 360° images for processing
POST /api/integrations/matterport/create-scan
Request: {
  propertyId: string,
  images: Array<{
    url: string,
    sequence: number,
    capturedAt: string
  }>,
  metadata: {
    propertyType: string,
    area: number,
    floor: number
  }
}
Response: {
  scanId: string,
  status: 'PROCESSING',
  estimatedCompletionTime: string
}

// Get 3D tour embed link
GET /api/integrations/matterport/tour/:scanId
Response: {
  status: 'READY' | 'PROCESSING' | 'FAILED',
  embedUrl: string, // iframe URL
  shareUrl: string, // Public link
  thumbnailUrl: string,
  measurements: {
    totalArea: number,
    roomWise: Array<{
      name: string,
      area: number,
      dimensions: { length: number, width: number, height: number }
    }>
  },
  features: {
    virtualTour: boolean,
    dollhouseView: boolean,
    floorplan: boolean,
    measurements: boolean
  }
}
```

**Pricing Model:**
- Processing: ₹2,000 per property
- Hosting: ₹500/month per active tour
- Commission from photographer network: 20%

---

### 19. Superbolter
**Integration Type:** REST API
**Function:** Virtual Staging - AI-based furnishing of empty flat photos

**Endpoint:**
```typescript
POST /api/integrations/superbolter/stage-room
Request: {
  imageUrl: string,
  roomType: 'LIVING' | 'BEDROOM' | 'KITCHEN' | 'BATHROOM',
  style: 'MODERN' | 'TRADITIONAL' | 'MINIMALIST' | 'LUXURY',
  targetAudience: 'BACHELOR' | 'FAMILY' | 'PREMIUM_BUYER',
  removeExisting: boolean // Remove existing furniture first
}
Response: {
  stagedImageUrl: string,
  alternativeStyles: Array<{
    style: string,
    imageUrl: string
  }>,
  furnitureItems: Array<{
    name: string,
    estimatedCost: number,
    purchaseLink: string // Affiliate link
  }>,
  processingTime: number
}
```

**Use Cases:**
- Empty flat listings (increase conversion by 40%)
- Comparison: Furnished vs Empty
- Style preference testing

**Pricing:** ₹200 per image, ₹1,500 for full flat (5 images)

---

### 20. Infurnia
**Integration Type:** REST API
**Function:** Design-to-Factory - Forward .DWG/.CAD files to generate Cut-Lists for manufacturing

**Endpoint:**
```typescript
POST /api/integrations/infurnia/design-to-order
Request: {
  propertyId: string,
  floorPlan: {
    dwgUrl: string, // CAD file
    area: number
  },
  designPreferences: {
    style: string,
    budget: number,
    rooms: Array<{
      type: string,
      furnitureNeeded: string[]
    }>
  },
  deliveryAddress: string,
  timeline: string
}
Response: {
  designId: string,
  preview3DUrl: string,
  cutList: Array<{
    component: string,
    material: string,
    dimensions: { length: number, width: number, thickness: number },
    quantity: number,
    cost: number
  }>,
  totalCost: {
    materials: number,
    labor: number,
    delivery: number,
    total: number
  },
  manufacturingTime: number, // days
  installationTime: number // days
}
```

**Revenue Model:**
- Commission: 15% on total order value
- Premium design consultation: ₹5,000

---

### 21. SofaBrain
**Integration Type:** REST API
**Function:** AI Redesign - User uploads a photo → AI renders a new interior design style

**Endpoint:**
```typescript
POST /api/integrations/sofabrain/ai-redesign
Request: {
  imageUrl: string,
  targetStyle: 'SCANDINAVIAN' | 'INDUSTRIAL' | 'BOHEMIAN' | 'JAPANESE' | 'MID_CENTURY',
  preserveStructure: boolean, // Keep walls, windows, doors
  colorPalette: 'NEUTRAL' | 'VIBRANT' | 'PASTEL' | 'DARK'
}
Response: {
  redesignedImageUrl: string,
  alternativeDesigns: Array<{
    style: string,
    imageUrl: string,
    estimatedCost: number
  }>,
  shoppingList: Array<{
    item: string,
    estimatedPrice: number,
    similarProducts: Array<{
      name: string,
      price: number,
      vendor: string,
      url: string
    }>
  }>,
  diyInstructions: string
}
```

**Use Cases:**
- Tenant customization preview
- Renovation planning
- Design inspiration

**Pricing:** ₹100 per redesign (upsell to full design service)

---

### 22. Unity
**Integration Type:** Native Library (Mobile SDK)
**Function:** Interactive View - Renders "Balcony View" and "Sunlight Simulator" on phone

**Native Module Implementation:**

**iOS (Swift):**
```swift
import UnityFramework

class BalconyViewRenderer {
    func renderView(coordinates: Coordinates, floor: Int, direction: String) -> UIView {
        let unityView = UnityBridge.getInstance().renderBalconyView(
            lat: coordinates.lat,
            lng: coordinates.lng,
            floor: floor,
            direction: direction,
            timeOfDay: Date()
        )
        return unityView
    }
}
```

**Android (Kotlin):**
```kotlin
import com.unity3d.player.UnityPlayer

class BalconyViewRenderer {
    fun renderView(coordinates: Coordinates, floor: Int, direction: String): View {
        val unityPlayer = UnityPlayer(context)
        unityPlayer.renderBalconyView(
            lat = coordinates.lat,
            lng = coordinates.lng,
            floor = floor,
            direction = direction,
            timeOfDay = System.currentTimeMillis()
        )
        return unityPlayer.view
    }
}
```

**React Native Bridge:**
```typescript
import { NativeModules } from 'react-native';

const { BalconyViewModule } = NativeModules;

export const renderBalconyView = async (
  propertyId: string,
  coordinates: { lat: number; lng: number },
  floor: number,
  direction: 'NORTH' | 'SOUTH' | 'EAST' | 'WEST'
) => {
  return await BalconyViewModule.render({
    propertyId,
    coordinates,
    floor,
    direction
  });
};

export const renderSunlightSimulator = async (
  propertyId: string,
  timeOfDay: Date
) => {
  return await BalconyViewModule.simulateSunlight({
    propertyId,
    timestamp: timeOfDay.getTime()
  });
};
```

**Features:**
- Real-time 3D rendering of balcony view using Google Maps 3D data
- Sunlight simulation by time of day (shadows, brightness)
- Seasonal variation (summer vs winter sun angles)
- Noise pollution overlay (traffic sound heatmap)

---

## 🛠️ Lifecycle Services

### 23. PropCheck / Nemmadi
**Integration Type:** Webhook
**Function:** Snagging - Pre-Handover Inspection based on Unit Specs

**Endpoint:**
```typescript
POST /api/integrations/propcheck/schedule-inspection
Request: {
  propertyId: string,
  unitSpecs: {
    carpetArea: number,
    flooringType: 'MARBLE' | 'TILES' | 'WOOD' | 'VITRIFIED',
    paintType: 'EMULSION' | 'DISTEMPER' | 'TEXTURE',
    fixtures: Array<{
      type: 'KITCHEN' | 'BATHROOM' | 'ELECTRICAL',
      brand: string,
      model: string
    }>
  },
  preferredDate: string,
  contactPerson: {
    name: string,
    mobile: string
  }
}
Response: {
  inspectionId: string,
  scheduledDate: string,
  inspector: {
    name: string,
    experience: number,
    rating: number
  },
  checklist: Array<{
    category: string,
    items: string[],
    totalPoints: number
  }>,
  cost: number
}

// Webhook callback (sent after inspection)
POST /webhooks/propcheck/inspection-complete
Payload: {
  inspectionId: string,
  propertyId: string,
  completedAt: string,
  report: {
    overallScore: number, // 0-100
    issues: Array<{
      category: string,
      severity: 'MINOR' | 'MAJOR' | 'CRITICAL',
      description: string,
      photosUrls: string[],
      estimatedFixCost: number,
      recommendedAction: string
    }>,
    passStatus: 'PASS' | 'PASS_WITH_MINOR_ISSUES' | 'FAIL',
    reportUrl: string // PDF
  }
}
```

**Use Cases:**
- Pre-possession inspection
- Quality assurance for builders
- Buyer protection

---

### 24. Urban Company
**Integration Type:** Partner API
**Function:** Deep Cleaning - Forward "Surface Inventory" for correct chemical usage

**Endpoint:**
```typescript
POST /api/integrations/urbancompany/book-service
Request: {
  propertyId: string,
  serviceType: 'DEEP_CLEANING' | 'PEST_CONTROL' | 'PAINTING' | 'PLUMBING',
  surfaceInventory: {
    marble: number, // sqft
    wood: number,
    tiles: number,
    fabric: number, // sofas, curtains
    glass: number
  },
  specialRequirements: string[],
  preferredDate: string,
  contactDetails: {
    name: string,
    mobile: string,
    address: string
  }
}
Response: {
  bookingId: string,
  serviceProvider: {
    name: string,
    rating: number,
    experience: number,
    photoUrl: string
  },
  estimatedCost: {
    materials: number,
    labor: number,
    total: number,
    discount: number // bulk discount if via community
  },
  scheduledTime: string,
  estimatedDuration: number, // hours
  gatePass: {
    code: string, // For MyGate integration
    validFrom: string,
    validUntil: string
  }
}
```

**Community Bulk Discount:**
- 20% discount if 10+ units book together
- 30% discount if 50+ units
- Auto-notification to RWA group

---

### 25. SmartPuja / VedaFactory
**Integration Type:** REST API
**Function:** Culture - Match User Astrology + Property Vastu to book Pandits & Muhurthams

**Endpoints:**
```typescript
// Vastu Analysis
POST /api/integrations/smartpuja/vastu-analysis
Request: {
  propertyId: string,
  floorPlan: {
    imageUrl: string, // Floor plan image
    facingDirection: 'NORTH' | 'SOUTH' | 'EAST' | 'WEST',
    mainEntranceDirection: string
  },
  propertyType: 'RESIDENTIAL' | 'COMMERCIAL'
}
Response: {
  vastuScore: number, // 0-100
  doshas: Array<{
    type: string,
    severity: 'LOW' | 'MEDIUM' | 'HIGH',
    location: string,
    description: string,
    remedy: string,
    remedyCost: number
  }>,
  favorableRooms: Array<{
    room: string,
    direction: string,
    purpose: string
  }>,
  recommendations: string[],
  consultationUrl: string // Video call with Vastu expert
}

// Book Griha Pravesh Puja
POST /api/integrations/smartpuja/book-puja
Request: {
  pujaType: 'GRIHA_PRAVESH' | 'VASTU_SHANTI' | 'BHOOMI_PUJA',
  userDetails: {
    name: string,
    dob: string,
    birthTime: string,
    birthPlace: string
  },
  propertyAddress: string,
  preferredDates: string[]
}
Response: {
  bookingId: string,
  auspiciousMuhurtham: Array<{
    date: string,
    time: string,
    nakshatra: string,
    rating: number // Auspiciousness score
  }>,
  pandit: {
    name: string,
    specialization: string,
    experience: number,
    language: string[],
    rating: number
  },
  pujaKit: {
    items: string[],
    cost: number,
    deliveryDate: string
  },
  totalCost: number,
  includes: string[]
}
```

**Use Cases:**
- New home possession
- Pre-construction land puja
- Vastu-compliant design planning

**Pricing:** ₹5,000 - ₹15,000 (commission: 25%)

---

### 26. Porter / Agarwal Packers
**Integration Type:** REST API
**Function:** Relocation - Auto-book trucks based on Flat Size

**Endpoint:**
```typescript
POST /api/integrations/porter/book-relocation
Request: {
  propertyType: '1BHK' | '2BHK' | '3BHK' | '4BHK' | 'VILLA',
  estimatedVolume: number, // cubic feet (auto-calculated)
  pickup: {
    address: string,
    floor: number,
    liftAvailable: boolean,
    parkingDistance: number // meters
  },
  dropoff: {
    address: string,
    floor: number,
    liftAvailable: boolean,
    parkingDistance: number
  },
  movingDate: string,
  specialItems: Array<{
    item: 'PIANO' | 'FRIDGE' | 'WASHING_MACHINE' | 'BED' | 'SOFA',
    quantity: number
  }>,
  packingRequired: boolean,
  insuranceRequired: boolean
}
Response: {
  bookingId: string,
  vehicleType: 'MINI_TRUCK' | 'PICKUP_8FT' | 'TATA_ACE' | 'FULL_TRUCK',
  estimatedCost: {
    transport: number,
    packing: number,
    loading: number,
    unloading: number,
    insurance: number,
    total: number
  },
  estimatedTime: {
    packing: number, // hours
    transit: number,
    unloading: number
  },
  driver: {
    name: string,
    mobile: string,
    vehicleNumber: string,
    rating: number
  },
  liveTracking: {
    enabled: boolean,
    trackingUrl: string
  }
}
```

**Auto-calculation Logic:**
- 1BHK: 200-300 cubic feet → Mini Truck
- 2BHK: 400-600 cubic feet → Pickup 8ft
- 3BHK: 700-1000 cubic feet → Tata Ace
- 4BHK+: 1200+ cubic feet → Full Truck

---

## 🏘️ Management Services

### 27. MyGate / NoBrokerHood
**Integration Type:** Webhook (Bidirectional)
**Function:** Access Control - Sync "Service Bookings" to Gate Pass

**Endpoints:**
```typescript
// Send service booking to MyGate
POST /api/integrations/mygate/create-gate-pass
Request: {
  communityId: string,
  unitNumber: string,
  visitor: {
    name: string,
    mobile: string,
    purpose: 'DELIVERY' | 'SERVICE' | 'GUEST',
    serviceProvider: string, // e.g., "Urban Company"
  },
  validFrom: string,
  validUntil: string,
  recurring: {
    enabled: boolean,
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY',
    endDate: string
  }
}
Response: {
  passId: string,
  qrCode: string, // QR code for gate entry
  otp: string, // Backup entry code
  status: 'ACTIVE',
  shareUrl: string // Visitor can view pass details
}

// Webhook: Entry logged
POST /webhooks/mygate/entry-logged
Payload: {
  passId: string,
  communityId: string,
  unitNumber: string,
  visitor: {
    name: string,
    mobile: string
  },
  entryTime: string,
  exitTime: string | null,
  guardName: string,
  photo: string // Optional photo capture
}
```

**Use Cases:**
- Service provider access (cleaners, plumbers)
- Delivery personnel
- Pre-approved guest list
- Audit trail for security

---

### 28. BBPS (Bharat BillPay)
**Integration Type:** REST API
**Function:** Utilities - Auto-fetch and pay Electricity/Water bills

**Endpoints:**
```typescript
// Fetch Bill Details
POST /api/integrations/bbps/fetch-bill
Request: {
  propertyId: string,
  billerCategory: 'ELECTRICITY' | 'WATER' | 'GAS' | 'BROADBAND',
  consumerNumber: string,
  billerId: string // e.g., TSSPDCL for Telangana electricity
}
Response: {
  bill: {
    billNumber: string,
    billDate: string,
    dueDate: string,
    billAmount: number,
    billPeriod: { from: string, to: string },
    consumption: {
      units: number,
      rate: number
    },
    lateFee: number,
    previousDue: number,
    totalAmount: number
  },
  autopayEnabled: boolean
}

// Pay Bill
POST /api/integrations/bbps/pay-bill
Request: {
  billNumber: string,
  consumerNumber: string,
  amount: number,
  paymentMethod: 'UPI' | 'CARD' | 'NET_BANKING'
}
Response: {
  transactionId: string,
  status: 'SUCCESS' | 'PENDING' | 'FAILED',
  receiptUrl: string,
  paidAt: string
}

// Setup Autopay
POST /api/integrations/bbps/setup-autopay
Request: {
  propertyId: string,
  billerDetails: Array<{
    category: string,
    consumerNumber: string,
    billerId: string
  }>,
  paymentMethod: {
    type: 'UPI' | 'CARD',
    mandateAmount: number, // Max amount per transaction
    frequency: 'MONTHLY'
  }
}
```

**Use Cases:**
- Automated bill payment for NRI landlords
- Community-wide bulk payments
- Rental property management

---

### 29. IDfy / Sheriff
**Integration Type:** REST API
**Function:** Tenant Check - Police & Court Record background verification

**Endpoint:**
```typescript
POST /api/integrations/idfy/background-verification
Request: {
  applicantDetails: {
    name: string,
    fatherName: string,
    dob: string,
    aadhaarNumber: string,
    panNumber: string,
    currentAddress: string,
    permanentAddress: string
  },
  verificationType: ['POLICE_RECORDS', 'COURT_RECORDS', 'CREDIT_CHECK', 'EMPLOYMENT'],
  purpose: 'TENANT_VERIFICATION',
  consentUrl: string // User consent document
}
Response: {
  verificationId: string,
  status: 'PROCESSING' | 'COMPLETED',
  estimatedTime: string, // e.g., "48 hours"
}

GET /api/integrations/idfy/verification/:verificationId
Response: {
  status: 'COMPLETED',
  overallRisk: 'LOW' | 'MEDIUM' | 'HIGH',
  checks: {
    policeRecords: {
      status: 'CLEAR' | 'RECORDS_FOUND',
      details: string,
      cases: Array<{
        fir: string,
        station: string,
        date: string,
        status: 'OPEN' | 'CLOSED'
      }>
    },
    courtRecords: {
      status: 'CLEAR' | 'CASES_FOUND',
      civilCases: number,
      criminalCases: number,
      details: string
    },
    creditCheck: {
      score: number,
      status: 'GOOD' | 'FAIR' | 'POOR',
      defaultRecords: number
    },
    employment: {
      verified: boolean,
      company: string,
      designation: string,
      salary: number
    }
  },
  recommendation: 'APPROVE' | 'APPROVE_WITH_CAUTION' | 'REJECT',
  reportUrl: string
}
```

**Pricing:** ₹500 per verification (passed to landlord as ₹999)

---

## ☀️ Sustainability Services

### 30. SolarSquare / Tata Power
**Integration Type:** Lead API
**Function:** Roof Monetization - Forward "Roof Area" + "Sunlight Data" for Solar quotes

**Endpoint:**
```typescript
POST /api/integrations/solarsquare/calculate-roi
Request: {
  propertyId: string,
  roofArea: number, // sqft
  location: { lat: number, lng: number },
  roofOrientation: 'NORTH' | 'SOUTH' | 'EAST' | 'WEST',
  shadingFactor: number, // 0-1 (0 = fully shaded, 1 = no shade)
  electricityBill: {
    averageMonthly: number,
    averageUnits: number,
    tariffRate: number
  },
  installationType: 'ON_GRID' | 'OFF_GRID' | 'HYBRID'
}
Response: {
  solarPotential: {
    usableArea: number, // sqft (accounting for obstacles)
    systemCapacity: number, // kW
    estimatedGeneration: {
      daily: number, // kWh
      monthly: number,
      yearly: number
    },
    sunlightHours: number // average daily
  },
  financials: {
    installationCost: number,
    subsidy: {
      central: number,
      state: number,
      total: number
    },
    netCost: number,
    monthlySavings: number,
    yearlySavings: number,
    paybackPeriod: number, // years
    roi25Years: number, // percentage
    totalSavings25Years: number
  },
  carbonImpact: {
    co2ReductionYearly: number, // kg
    treesEquivalent: number
  },
  recommendations: string[],
  nextSteps: {
    siteVisitRequired: boolean,
    contactPerson: {
      name: string,
      mobile: string,
      company: string
    }
  }
}
```

**Commission:** 5% on installation cost

---

### 31. DrinkPrime
**Integration Type:** IoT Data API
**Function:** Water Quality - Show live TDS / Water Hardness in neighborhood

**Endpoint:**
```typescript
GET /api/integrations/drinkprime/water-quality/:pincode
Response: {
  location: {
    pincode: string,
    locality: string,
    city: string
  },
  waterQuality: {
    tds: number, // Total Dissolved Solids (ppm)
    hardness: number, // mg/L
    ph: number,
    chlorine: number, // mg/L
    fluoride: number, // mg/L
    iron: number // mg/L
  },
  classification: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR',
  recommendations: Array<{
    issue: string,
    solution: string,
    productRecommendation: {
      name: string,
      type: 'RO' | 'UV' | 'UF' | 'WATER_SOFTENER',
      cost: number,
      affiliateLink: string
    }
  }>,
  nearbySources: Array<{
    type: 'BOREWELL' | 'MUNICIPAL' | 'TANKER',
    distance: number, // meters
    quality: string
  }>,
  historicalData: Array<{
    date: string,
    tds: number,
    hardness: number
  }>,
  lastUpdated: string
}
```

**Use Cases:**
- Water quality disclosure in listings
- RO system recommendations
- Community-wide water testing

---

## Integration Dashboard

### Centralized Configuration
```typescript
// config/integrations.ts
export const INTEGRATION_CONFIG = {
  landeed: {
    enabled: true,
    apiKey: process.env.LANDEED_API_KEY,
    baseUrl: 'https://api.landeed.com/v1',
    timeout: 30000,
    retries: 3
  },
  teal: {
    enabled: true,
    apiKey: process.env.TEAL_API_KEY,
    baseUrl: 'https://api.teal.com/v2',
    timeout: 60000,
    retries: 2
  },
  // ... 31 more integrations
};
```

### Integration Health Monitoring
```typescript
// Monitor all integrations in real-time
GET /api/admin/integrations/health
Response: {
  integrations: Array<{
    name: string,
    status: 'OPERATIONAL' | 'DEGRADED' | 'DOWN',
    uptime: number, // percentage
    avgResponseTime: number, // ms
    errorRate: number, // percentage
    lastChecked: string,
    quotaUsage: {
      used: number,
      limit: number,
      resetDate: string
    }
  }>
}
```

---

## Revenue Impact

### Service Commission Matrix

| Service | Cost to User | Our Cost | Commission | Monthly Volume (Est) | Monthly Revenue |
|---------|-------------|----------|------------|---------------------|----------------|
| Landeed | ₹99 | ₹50 | ₹49 | 1,000 | ₹49,000 |
| TEAL | ₹199 | ₹100 | ₹99 | 500 | ₹49,500 |
| LegalKart | ₹2,500 | ₹2,000 | ₹500 | 200 | ₹1,00,000 |
| Matterport | ₹2,000 | ₹1,200 | ₹800 | 100 | ₹80,000 |
| Setu AA | Free | ₹20 | ₹0 | 2,000 | ₹0 (Lead gen) |
| Experian | ₹99 | ₹50 | ₹49 | 1,500 | ₹73,500 |
| Sentinel Hub | ₹499/mo | ₹300/mo | ₹199/mo | 500 | ₹99,500 |
| Urban Company | Variable | N/A | 15% | 300 | ₹1,50,000 |
| SmartPuja | ₹10,000 | ₹7,500 | ₹2,500 | 50 | ₹1,25,000 |
| SolarSquare | N/A | N/A | 5% avg ₹15K | 20 | ₹3,00,000 |

**Total Monthly Revenue from Integrations:** ₹12,26,500

---

## Implementation Priority

### Phase 1: Critical (Week 1-2)
- ✅ Landeed, TEAL, SurePass (Land verification)
- ✅ Razorpay/Cashfree (Payments)
- ✅ Setu/Experian (Finance)

### Phase 2: High Value (Week 3-4)
- ✅ Matterport (Digital twins)
- ✅ Sentinel Hub (Satellite)
- ✅ LegalKart (Legal reports)
- ✅ Zapkey (Market data)

### Phase 3: Enhancement (Month 2)
- ⏳ Urban Company, Porter (Services)
- ⏳ MyGate, BBPS (Management)
- ⏳ SmartPuja (Cultural)

### Phase 4: Advanced (Month 3)
- ⏳ Unity, Superbolter (Visuals)
- ⏳ PhantomBuster (Lead gen)
- ⏳ DrinkPrime, SolarSquare (Sustainability)

---

## Security & Compliance

### API Key Management
```typescript
// Using AWS Secrets Manager
import { SecretsManager } from 'aws-sdk';

const getApiKey = async (serviceName: string) => {
  const secretsManager = new SecretsManager();
  const secret = await secretsManager.getSecretValue({
    SecretId: `propmubi/integrations/${serviceName}`
  }).promise();

  return JSON.parse(secret.SecretString).apiKey;
};
```

### Data Privacy
- All PII encrypted at rest (AES-256)
- User consent required for Aadhaar, PAN, Bank data
- GDPR-compliant data deletion
- Audit logs for all sensitive operations

### Rate Limiting
```typescript
// Integration-specific rate limits
const RATE_LIMITS = {
  landeed: { requests: 100, window: '1m' },
  teal: { requests: 50, window: '1m' },
  dharani: { requests: 10, window: '1m' }, // Scraper
  // ...
};
```

---

## Support & Documentation

**API Docs:** [docs.propmubi.com/integrations](https://docs.propmubi.com/integrations)
**Status Page:** [status.propmubi.com](https://status.propmubi.com)
**Integration Support:** integrations@propmubi.com

---

**Last Updated:** November 28, 2024
**Next Review:** December 15, 2024
