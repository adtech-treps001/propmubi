# Design Document
# Propmubi - Real Estate Super App

**Version:** 1.0  
**Date:** November 2024  
**Author:** Technical Architecture Team

---

## 1. System Architecture

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Client Layer                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Web App    │  │  iOS App     │  │  Android App │         │
│  │  (Next.js)   │  │  (RN + Swift)│  │  (RN + Kotlin│         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
└─────────┼──────────────────┼──────────────────┼────────────────┘
          │                  │                  │
          └──────────────────┼──────────────────┘
                             │
          ┌──────────────────▼──────────────────┐
          │         API Gateway (BFF)           │
          │    GraphQL Federation / tRPC        │
          │  - Authentication (JWT)             │
          │  - Rate Limiting                    │
          │  - Request Validation               │
          └──────────────────┬──────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼────────┐  ┌───────▼────────┐  ┌───────▼────────┐
│  Service Mesh  │  │   Workflow     │  │  Integration   │
│  (Microservices│  │  Orchestrator  │  │     Hub        │
│   Layer)       │  │  (Temporal)    │  │                │
└───────┬────────┘  └───────┬────────┘  └───────┬────────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
        ┌────────────────────▼────────────────────┐
        │         Data Layer                      │
        │  ┌────────────┐  ┌──────────────┐     │
        │  │ PostgreSQL │  │   MongoDB    │     │
        │  │ (Relational│  │  (Documents) │     │
        │  └────────────┘  └──────────────┘     │
        │  ┌────────────┐  ┌──────────────┐     │
        │  │   Redis    │  │  ClickHouse  │     │
        │  │  (Cache)   │  │  (Analytics) │     │
        │  └────────────┘  └──────────────┘     │
        └─────────────────────────────────────────┘
                             │
        ┌────────────────────▼────────────────────┐
        │       External Services                 │
        │  - RERA APIs (13 states)                │
        │  - Dharani / MeeBhoomi                  │
        │  - 99acres / MagicBricks / NoBroker     │
        │  - Setu (Finance) / Experian (CIBIL)   │
        │  - Sentinel Hub (Satellite)             │
        └──────────────────────────────────────────┘
```

### 1.2 Technology Stack

#### Frontend
```typescript
// Universal (90% code sharing)
{
  "framework": "React Native 0.73",
  "ui": "Tamagui 1.8",
  "state": {
    "global": "Zustand 4.4",
    "server": "TanStack Query 5.0",
    "forms": "React Hook Form 7.4"
  },
  "navigation": {
    "mobile": "React Navigation 6",
    "web": "Next.js App Router"
  },
  "styling": "NativeWind 2.0 (Tailwind for RN)"
}

// Native Modules (Performance layer)
{
  "ios": "Swift 5.9 + CoreML + ARKit",
  "android": "Kotlin 1.9 + TFLite + ARCore",
  "bridge": "JSI / Turbo Modules"
}
```

#### Backend
```typescript
{
  "runtime": "Node.js 20 LTS",
  "framework": "Express.js 4.18",
  "api": "GraphQL (Apollo Server 4)",
  "validation": "Zod 3.22",
  "orm": "Prisma 5.6",
  "workflow": "Temporal.io 1.20",
  "websockets": "Socket.io 4.6"
}
```

#### Database
```typescript
{
  "primary": "MongoDB 7.0 (sharded)",
  "relational": "PostgreSQL 16 (payments, users)",
  "cache": "Redis 7.2 (session, rate-limit)",
  "analytics": "ClickHouse 23.8",
  "search": "Elasticsearch 8.11",
  "storage": "AWS S3 / Cloudflare R2"
}
```

#### Infrastructure
```typescript
{
  "hosting": {
    "web": "Vercel Edge Network",
    "api": "AWS ECS Fargate",
    "mobile": "Firebase App Distribution"
  },
  "cdn": "Cloudflare",
  "monitoring": {
    "apm": "New Relic",
    "logs": "DataDog",
    "errors": "Sentry"
  },
  "ci_cd": "GitHub Actions"
}
```

---

## 2. Component Architecture

### 2.1 Frontend Architecture

#### Directory Structure
```
apps/
├── mobile/                     # React Native (iOS + Android)
│   ├── android/               # Native Android code
│   │   └── app/src/main/java/com/propmubi/
│   │       ├── CameraModule.kt
│   │       ├── MLModule.kt
│   │       └── SatelliteModule.kt
│   ├── ios/                   # Native iOS code
│   │   └── Propmubi/
│   │       ├── CameraModule.swift
│   │       ├── MLModule.swift
│   │       └── SatelliteModule.swift
│   └── src/
│       ├── screens/           # Feature screens
│       │   ├── BuySell/
│       │   ├── Rental/
│       │   ├── Commercial/
│       │   ├── Land/
│       │   ├── Auction/
│       │   ├── Lifecycle/
│       │   └── Community/
│       ├── navigation/        # Navigation config
│       └── App.tsx           # Root component
│
└── web/                       # Next.js (Web)
    ├── app/                   # App router
    │   ├── (auth)/           # Auth layouts
    │   ├── buy-sell/
    │   ├── rental/
    │   └── ...
    ├── public/               # Static assets
    └── next.config.js

packages/
├── shared-components/         # 90% reusable
│   ├── property/
│   │   ├── PropertyCard.tsx
│   │   ├── PropertyList.tsx
│   │   └── PropertyDetails.tsx
│   ├── forms/
│   │   ├── SearchForm.tsx
│   │   └── BookingForm.tsx
│   └── ui/                   # Base components
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       └── Modal.tsx
│
├── shared-logic/             # 100% shared
│   ├── stores/               # Zustand stores
│   │   ├── authStore.ts
│   │   ├── propertyStore.ts
│   │   ├── rentalStore.ts
│   │   └── ...
│   ├── hooks/               # Custom hooks
│   │   ├── useProperty.ts
│   │   ├── useDueDiligence.ts
│   │   └── usePayment.ts
│   ├── services/            # API clients
│   │   ├── api.ts
│   │   └── websocket.ts
│   └── utils/               # Utilities
│       ├── formatting.ts
│       └── validation.ts
│
└── native-modules/          # Performance critical
    ├── camera/
    ├── ml/
    └── satellite/
```

#### Component Communication Pattern

```typescript
// 1. Container Pattern (Smart Components)
export const PropertyDetailsContainer = ({ propertyId }: Props) => {
  // Server state
  const { data: property, isLoading } = useProperty(propertyId);
  
  // Global state
  const saveProperty = usePropertyStore(state => state.saveProperty);
  
  // Local state
  const [showModal, setShowModal] = useState(false);
  
  // Callbacks
  const handleSave = () => {
    saveProperty(property);
    showToast('Property saved!');
  };
  
  return (
    <PropertyDetailsView
      property={property}
      isLoading={isLoading}
      onSave={handleSave}
      onShowModal={() => setShowModal(true)}
    />
  );
};

// 2. Presentation Pattern (Dumb Components)
export const PropertyDetailsView = ({
  property,
  isLoading,
  onSave,
  onShowModal
}: ViewProps) => {
  if (isLoading) return <LoadingSpinner />;
  
  return (
    <ScrollView>
      <PropertyCard property={property} />
      <Button onPress={onSave}>Save Property</Button>
      <Button onPress={onShowModal}>View 3D Tour</Button>
    </ScrollView>
  );
};
```

### 2.2 State Management Architecture

```typescript
// stores/propertyStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PropertyState {
  // State
  savedProperties: Property[];
  searchFilters: SearchFilters;
  currentProperty: Property | null;
  
  // Actions
  saveProperty: (property: Property) => void;
  unsaveProperty: (propertyId: string) => void;
  setSearchFilters: (filters: SearchFilters) => void;
  setCurrentProperty: (property: Property | null) => void;
}

export const usePropertyStore = create<PropertyState>()(
  persist(
    (set, get) => ({
      // Initial state
      savedProperties: [],
      searchFilters: {},
      currentProperty: null,
      
      // Actions
      saveProperty: (property) =>
        set((state) => ({
          savedProperties: [...state.savedProperties, property]
        })),
        
      unsaveProperty: (propertyId) =>
        set((state) => ({
          savedProperties: state.savedProperties.filter(
            p => p.id !== propertyId
          )
        })),
        
      setSearchFilters: (filters) =>
        set({ searchFilters: filters }),
        
      setCurrentProperty: (property) =>
        set({ currentProperty: property }),
    }),
    {
      name: 'property-storage', // localStorage key
      partialize: (state) => ({
        // Only persist these fields
        savedProperties: state.savedProperties,
        searchFilters: state.searchFilters,
      }),
    }
  )
);

// Usage in components (same on web + mobile)
const savedProperties = usePropertyStore(state => state.savedProperties);
const saveProperty = usePropertyStore(state => state.saveProperty);
```

---

## 3. Backend Architecture

### 3.1 Microservices Design

```typescript
// services/buysell/src/index.ts
import { Router } from 'express';
import { z } from 'zod';

const router = Router();

// POST /api/buysell/due-diligence
router.post('/due-diligence', async (req, res) => {
  // 1. Validate input
  const schema = z.object({
    propertyId: z.string().uuid(),
    userId: z.string().uuid(),
  });
  
  const { propertyId, userId } = schema.parse(req.body);
  
  // 2. Start workflow (Temporal)
  const workflowId = await temporal.startWorkflow(
    'DueDiligenceWorkflow',
    { propertyId, userId }
  );
  
  // 3. Return immediately (async processing)
  res.json({
    workflowId,
    status: 'PROCESSING',
    estimatedTime: 60, // seconds
  });
});

// GET /api/buysell/due-diligence/:workflowId
router.get('/due-diligence/:workflowId', async (req, res) => {
  const workflow = await temporal.getWorkflowStatus(req.params.workflowId);
  
  res.json({
    status: workflow.status,
    result: workflow.result,
    progress: workflow.progress,
  });
});
```

### 3.2 Workflow Orchestration (Temporal)

```typescript
// workflows/DueDiligenceWorkflow.ts
import { proxyActivities } from '@temporalio/workflow';

const activities = proxyActivities<Activities>({
  startToCloseTimeout: '10 minutes',
  retry: {
    maximumAttempts: 3,
    initialInterval: '1 second',
  },
});

export async function DueDiligenceWorkflow(
  input: { propertyId: string; userId: string }
) {
  const report: DueDiligenceReport = {
    propertyId: input.propertyId,
    checks: {},
    overallScore: 0,
    timestamp: Date.now(),
  };
  
  try {
    // Step 1: Parallel data fetching (fast)
    const [rera, land, market] = await Promise.all([
      activities.checkRERA(input.propertyId),
      activities.checkLandLegality(input.propertyId),
      activities.checkMarketPrice(input.propertyId),
    ]);
    
    report.checks = { rera, land, market };
    
    // Step 2: If land is clear, order title report (slow, async)
    if (land.status === 'CLEAR') {
      await activities.orderTitleReport(input.propertyId);
      
      // This workflow will pause here without consuming resources
      // It will resume when lawyer uploads the report (can be days)
      await activities.waitForTitleReport(input.propertyId);
      
      report.checks.title = await activities.getTitleReport(input.propertyId);
    }
    
    // Step 3: Calculate score
    report.overallScore = calculateScore(report.checks);
    
    // Step 4: Notify user
    await activities.notifyUser(input.userId, report);
    
    return report;
    
  } catch (error) {
    // Temporal handles retries automatically
    throw error;
  }
}

function calculateScore(checks: Checks): number {
  let score = 100;
  
  if (checks.rera.status === 'NOT_FOUND') score -= 40;
  if (checks.land.hasEncumbrance) score -= 30;
  if (checks.market.overpriced) score -= 20;
  if (checks.title?.hasIssues) score -= 10;
  
  return Math.max(0, score);
}
```

### 3.3 Integration Layer

```typescript
// integrations/rera/RERAService.ts
import { CachedAPI } from '@/lib/cache';

export class RERAService extends CachedAPI {
  private states = {
    maharashtra: 'https://maharera.mahaonline.gov.in/api',
    telangana: 'https://rera.telangana.gov.in/api',
    karnataka: 'https://rera.karnataka.gov.in/api',
    // ... 10 more states
  };
  
  async checkProject(
    reraNumber: string,
    state: string
  ): Promise<RERAStatus> {
    // Check cache first (24h TTL)
    const cacheKey = `rera:${state}:${reraNumber}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;
    
    // Fetch from API
    const stateAPI = this.states[state];
    const response = await fetch(`${stateAPI}/projects/${reraNumber}`);
    
    if (!response.ok) {
      // Fallback to web scraping
      return this.scrapeRERA(reraNumber, state);
    }
    
    const data = await response.json();
    
    const result = {
      reraNumber,
      projectName: data.name,
      builderName: data.promoter,
      status: data.status,
      completionDate: data.proposedCompletionDate,
      verified: true,
      lastUpdated: new Date(),
    };
    
    // Cache result
    await this.cache.set(cacheKey, result, '24h');
    
    return result;
  }
  
  private async scrapeRERA(
    reraNumber: string,
    state: string
  ): Promise<RERAStatus> {
    // Puppeteer-based scraping as fallback
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    try {
      await page.goto(this.getScraperURL(state, reraNumber));
      
      const data = await page.evaluate(() => {
        return {
          projectName: document.querySelector('.project-name')?.textContent,
          builderName: document.querySelector('.promoter')?.textContent,
          status: document.querySelector('.status')?.textContent,
        };
      });
      
      return {
        reraNumber,
        ...data,
        verified: true,
        source: 'SCRAPED',
      };
      
    } finally {
      await browser.close();
    }
  }
}
```

---

## 4. Database Design

### 4.1 MongoDB Schema (Primary)

```typescript
// schemas/Property.ts
import { Schema, model } from 'mongoose';

const PropertySchema = new Schema({
  // Basic info
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: String,
  type: {
    type: String,
    enum: ['APARTMENT', 'VILLA', 'PLOT', 'COMMERCIAL'],
    required: true
  },
  
  // Location
  location: {
    address: String,
    city: String,
    state: String,
    pincode: String,
    coordinates: {
      lat: Number,
      lng: Number
    },
    // GeoJSON for geospatial queries
    geoLocation: {
      type: { type: String, default: 'Point' },
      coordinates: [Number] // [lng, lat]
    }
  },
  
  // Details
  size: Number, // sqft
  bedrooms: Number,
  bathrooms: Number,
  price: Number,
  pricePerSqft: Number,
  
  // Verification
  verification: {
    reraNumber: String,
    reraStatus: {
      type: String,
      enum: ['VERIFIED', 'PENDING', 'NOT_FOUND']
    },
    landTitle: {
      status: String,
      lastChecked: Date
    },
    dueDiligenceScore: Number
  },
  
  // Media
  images: [String],
  videos: [String],
  tour3D: String, // Matterport URL
  
  // Ownership
  ownerId: { type: String, required: true },
  ownerType: {
    type: String,
    enum: ['OWNER', 'BUILDER', 'AGENT']
  },
  
  // Status
  status: {
    type: String,
    enum: ['AVAILABLE', 'LOCKED', 'SOLD'],
    default: 'AVAILABLE'
  },
  lockedBy: String, // userId who paid token
  lockedUntil: Date,
  
  // Aggregation sources
  sources: [{
    name: String, // '99acres', 'MagicBricks'
    externalId: String,
    url: String,
    lastSync: Date
  }],
  
  // Analytics
  views: { type: Number, default: 0 },
  saves: { type: Number, default: 0 },
  inquiries: { type: Number, default: 0 },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes
PropertySchema.index({ 'location.geoLocation': '2dsphere' });
PropertySchema.index({ price: 1, size: 1 });
PropertySchema.index({ 'verification.reraNumber': 1 });
PropertySchema.index({ status: 1, createdAt: -1 });

export const Property = model('Property', PropertySchema);
```

```typescript
// schemas/User.ts
const UserSchema = new Schema({
  id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  name: String,
  
  // Auth
  passwordHash: String,
  emailVerified: Boolean,
  phoneVerified: Boolean,
  
  // Profile
  role: {
    type: String,
    enum: ['BUYER', 'SELLER', 'AGENT', 'BUILDER', 'TENANT', 'LANDLORD'],
    default: 'BUYER'
  },
  
  // Verification
  kycStatus: {
    type: String,
    enum: ['PENDING', 'VERIFIED', 'REJECTED']
  },
  kycDocuments: [{
    type: String,
    url: String,
    verifiedAt: Date
  }],
  
  // Financial
  cibilScore: Number,
  cibilLastChecked: Date,
  
  // Subscription
  subscription: {
    plan: {
      type: String,
      enum: ['FREE', 'BASIC', 'PREMIUM', 'ENTERPRISE']
    },
    validUntil: Date,
    features: [String]
  },
  
  // Preferences
  savedProperties: [String], // property IDs
  savedSearches: [{
    filters: Object,
    alerts: Boolean
  }],
  
  // Community
  communityId: String,
  unitNumber: String,
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const User = model('User', UserSchema);
```

### 4.2 PostgreSQL Schema (Transactional)

```sql
-- Payments table (ACID compliance)
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  property_id UUID,
  
  -- Payment details
  type VARCHAR(50) NOT NULL, -- TOKEN, VERIFICATION, SUBSCRIPTION
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  status VARCHAR(20) NOT NULL, -- PENDING, SUCCESS, FAILED, REFUNDED
  
  -- Payment gateway
  gateway VARCHAR(20) NOT NULL, -- RAZORPAY, STRIPE
  gateway_order_id VARCHAR(100) UNIQUE,
  gateway_payment_id VARCHAR(100),
  gateway_signature VARCHAR(255),
  
  -- Metadata
  refundable BOOLEAN DEFAULT FALSE,
  refunded_at TIMESTAMP,
  refund_amount DECIMAL(10, 2),
  expires_at TIMESTAMP,
  
  -- Audit
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_user_id (user_id),
  INDEX idx_property_id (property_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);

-- Transactions table (double-entry bookkeeping)
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID REFERENCES payments(id),
  
  -- Transaction details
  type VARCHAR(50) NOT NULL, -- CREDIT, DEBIT
  amount DECIMAL(10, 2) NOT NULL,
  balance_before DECIMAL(10, 2),
  balance_after DECIMAL(10, 2),
  
  -- Metadata
  description TEXT,
  metadata JSONB,
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_payment_id (payment_id),
  INDEX idx_created_at (created_at)
);
```

---

## 5. Security Architecture

### 5.1 Authentication Flow

```typescript
// services/auth/AuthService.ts
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export class AuthService {
  async register(data: RegisterData): Promise<AuthResponse> {
    // 1. Validate input
    const validated = registerSchema.parse(data);
    
    // 2. Check if user exists
    const existing = await User.findOne({ email: validated.email });
    if (existing) throw new Error('User already exists');
    
    // 3. Hash password
    const passwordHash = await bcrypt.hash(validated.password, 12);
    
    // 4. Create user
    const user = await User.create({
      ...validated,
      passwordHash,
      emailVerified: false,
    });
    
    // 5. Send verification email
    await this.sendVerificationEmail(user.email);
    
    // 6. Generate JWT
    const token = this.generateToken(user);
    
    return { user, token };
  }
  
  async login(email: string, password: string): Promise<AuthResponse> {
    // 1. Find user
    const user = await User.findOne({ email });
    if (!user) throw new Error('Invalid credentials');
    
    // 2. Verify password
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) throw new Error('Invalid credentials');
    
    // 3. Check if email verified
    if (!user.emailVerified) {
      throw new Error('Please verify your email');
    }
    
    // 4. Generate JWT
    const token = this.generateToken(user);
    
    // 5. Update last login
    user.lastLoginAt = new Date();
    await user.save();
    
    return { user, token };
  }
  
  private generateToken(user: User): string {
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );
  }
}
```

### 5.2 API Security

```typescript
// middleware/auth.ts
export const authenticateJWT = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// middleware/rateLimit.ts
import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
});

export const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 payment attempts per hour
  message: 'Too many payment attempts',
});
```

---

## 6. Performance Optimization

### 6.1 Caching Strategy

```typescript
// lib/cache.ts
import Redis from 'ioredis';

export class CacheService {
  private redis: Redis;
  
  constructor() {
    this.redis = new Redis(process.env.REDIS_URL);
  }
  
  async get<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);
    return value ? JSON.parse(value) : null;
  }
  
  async set(key: string, value: any, ttl: string): Promise<void> {
    const seconds = this.parseTTL(ttl);
    await this.redis.setex(key, seconds, JSON.stringify(value));
  }
  
  async invalidate(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }
  
  private parseTTL(ttl: string): number {
    const units = {
      's': 1,
      'm': 60,
      'h': 3600,
      'd': 86400,
    };
    
    const match = ttl.match(/^(\d+)([smhd])$/);
    if (!match) throw new Error('Invalid TTL format');
    
    const [, value, unit] = match;
    return parseInt(value) * units[unit];
  }
}

// Usage
const cache = new CacheService();

// Cache property details for 1 hour
await cache.set(`property:${propertyId}`, property, '1h');

// Cache RERA data for 24 hours
await cache.set(`rera:${reraNumber}`, reraData, '24h');

// Cache search results for 5 minutes
await cache.set(`search:${searchHash}`, results, '5m');
```

### 6.2 Database Optimization

```typescript
// Aggregation pipeline (MongoDB)
const topProperties = await Property.aggregate([
  // Stage 1: Match criteria
  {
    $match: {
      status: 'AVAILABLE',
      price: { $gte: minPrice, $lte: maxPrice },
      'location.city': city,
    }
  },
  
  // Stage 2: Add computed fields
  {
    $addFields: {
      popularityScore: {
        $add: [
          { $multiply: ['$views', 1] },
          { $multiply: ['$saves', 3] },
          { $multiply: ['$inquiries', 5] }
        ]
      }
    }
  },
  
  // Stage 3: Sort
  {
    $sort: { popularityScore: -1 }
  },
  
  // Stage 4: Limit
  {
    $limit: 20
  },
  
  // Stage 5: Lookup (join)
  {
    $lookup: {
      from: 'users',
      localField: 'ownerId',
      foreignField: 'id',
      as: 'owner'
    }
  },
  
  // Stage 6: Project (select fields)
  {
    $project: {
      title: 1,
      price: 1,
      images: 1,
      location: 1,
      popularityScore: 1,
      'owner.name': 1,
      'owner.kycStatus': 1
    }
  }
]);

// Geospatial query (nearby properties)
const nearbyProperties = await Property.find({
  'location.geoLocation': {
    $near: {
      $geometry: {
        type: 'Point',
        coordinates: [lng, lat] // [longitude, latitude]
      },
      $maxDistance: 5000 // 5 km
    }
  }
}).limit(10);
```

---

## 7. Monitoring & Observability

### 7.1 Logging Strategy

```typescript
// lib/logger.ts
import winston from 'winston';
import { LoggingWinston } from '@google-cloud/logging-winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: {
    service: 'propmubi-api',
    environment: process.env.NODE_ENV
  },
  transports: [
    new winston.transports.Console(),
    new LoggingWinston(), // Google Cloud Logging
  ],
});

// Usage
logger.info('Property viewed', {
  propertyId: '123',
  userId: 'abc',
  timestamp: Date.now()
});

logger.error('Payment failed', {
  paymentId: 'pay_123',
  error: error.message,
  stack: error.stack
});
```

### 7.2 Metrics & Alerts

```typescript
// lib/metrics.ts
import { Histogram, Counter } from 'prom-client';

// Response time histogram
export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

// Counter for failed payments
export const paymentFailures = new Counter({
  name: 'payment_failures_total',
  help: 'Total number of failed payments',
  labelNames: ['type', 'reason']
});

// Usage in middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration
      .labels(req.method, req.route.path, res.statusCode.toString())
      .observe(duration);
  });
  
  next();
});
```

---

## 8. Deployment Architecture

### 8.1 Container Strategy

```dockerfile
# Dockerfile (Backend)
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./package.json

USER nodejs

EXPOSE 3000

CMD ["node", "dist/index.js"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  api:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=redis://redis:6379
    depends_on:
      - mongodb
      - redis
    restart: unless-stopped
  
  mongodb:
    image: mongo:7.0
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    restart: unless-stopped
  
  redis:
    image: redis:7.2-alpine
    ports:
      - "6379:6379"
    restart: unless-stopped
  
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - api
    restart: unless-stopped

volumes:
  mongo-data:
```

---

## 9. Testing Strategy

### 9.1 Test Pyramid

```
        ┌─────────────┐
        │  E2E Tests  │  (10% - Slow, expensive)
        │     50      │
        └─────────────┘
      ┌─────────────────┐
      │ Integration Tests│  (20% - Medium speed)
      │        200       │
      └─────────────────┘
    ┌───────────────────────┐
    │    Unit Tests         │  (70% - Fast, cheap)
    │        1000           │
    └───────────────────────┘
```

```typescript
// Example unit test
import { calculateDueDiligenceScore } from './dueDiligence';

describe('calculateDueDiligenceScore', () => {
  it('should return 100 for perfect property', () => {
    const checks = {
      rera: { status: 'VERIFIED' },
      land: { status: 'CLEAR', hasEncumbrance: false },
      market: { overpriced: false },
      title: { hasIssues: false }
    };
    
    expect(calculateDueDiligenceScore(checks)).toBe(100);
  });
  
  it('should deduct 40 points for missing RERA', () => {
    const checks = {
      rera: { status: 'NOT_FOUND' },
      land: { status: 'CLEAR', hasEncumbrance: false },
      market: { overpriced: false }
    };
    
    expect(calculateDueDiligenceScore(checks)).toBe(60);
  });
});
```

---

## Appendix: Diagrams

### A. Data Flow Diagram

```
User Action
    ↓
Frontend (React Native / Web)
    ↓
API Gateway (Authentication, Rate Limiting)
    ↓
Service Router
    ├→ BuySell Service
    ├→ Rental Service
    ├→ Commercial Service
    └→ ... (other services)
        ↓
    Integration Hub
        ├→ RERA API
        ├→ Dharani API
        ├→ 99acres API
        └→ ... (external APIs)
            ↓
        Data Processing
            ↓
        Cache (Redis)
            ↓
        Database (MongoDB / PostgreSQL)
            ↓
        Response
            ↓
        Frontend Update
```

### B. Deployment Pipeline

```
Developer Push
    ↓
GitHub
    ↓
GitHub Actions (CI/CD)
    ├→ Run Tests
    ├→ Build Docker Image
    ├→ Security Scan
    └→ Deploy
        ├→ Staging Environment
        │   └→ Manual Approval
        └→ Production Environment
            ├→ Blue-Green Deployment
            └→ Health Checks
```

---

**Document Version:** 1.0  
**Last Updated:** November 2024  
**Next Review:** January 2025
