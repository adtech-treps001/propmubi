# Master Blueprint Implementation Plan
## Propmubi - Real Estate Operating System

**Version:** 4.0
**Date:** November 28, 2024
**Status:** Implementation Roadmap

---

## 🎯 Strategic Alignment

This document bridges the **Master Project Blueprint** with the existing codebase to create a unified implementation strategy.

---

## 1. Architecture Migration Plan

### Current State → Target State

| Component | Current (v3.0) | Target (v4.0 Blueprint) | Action Required |
|-----------|---------------|------------------------|-----------------|
| **Frontend** | React Native + Tamagui | React Native (Expo) + NativeWind | ✅ Align on NativeWind |
| **3D Visuals** | Matterport integration only | Unity Embedded (10% Core) | 🔨 Build Unity module |
| **Backend** | Express.js + MongoDB | NestJS + PostGIS | 🔄 Gradual migration |
| **Workflows** | Service Orchestrator | Temporal.io | 🔄 Implement Temporal |
| **Scrapers** | Puppeteer (basic) | Python Playwright + Kafka | 🔨 Build ingestion engine |

---

## 2. The "90/10" Hybrid Implementation

### 2.1 The Shell (90%) - React Native

**Already Built:**
- ✅ Property listings
- ✅ Search & filters
- ✅ User authentication
- ✅ Service booking flows

**To Build:**
- 🔨 Builder OS dashboard
- 🔨 Unified Marketing interface
- 🔨 Apex Home+ subscription portal
- 🔨 NativeWind styling migration

### 2.2 The Core (10%) - Unity/Native

**Status:** Not yet implemented

**Required Modules:**

#### Module 1: Gate-to-Key Navigator
```typescript
// Native Module: UnityGateToKeyModule.ts

interface UnityNavigatorProps {
  projectId: string;
  mode: 'GATE_VIEW' | 'LOBBY_WALK' | 'UNIT_TOUR';
  targetUnit?: string;
}

export class UnityGateToKeyNavigator {
  // Embeds Unity WebGL in React Native
  async loadProject(projectId: string): Promise<void> {
    // Load 3D model from CDN
    // Initialize Unity runtime
  }

  async navigateToUnit(unitId: string): Promise<void> {
    // Animate fly-through from gate → lobby → lift → corridor → unit
    // Physics-based camera movement
  }

  async toggleXRayMode(enabled: boolean): Promise<void> {
    // Show Available (Green) vs Sold (Red) units through walls
  }
}
```

#### Module 2: Sunlight Simulator
```swift
// iOS Native Module: SunlightSimulator.swift

import ARKit
import SceneKit

class SunlightSimulator {
    func calculateSunPath(location: CLLocation, date: Date) -> [SCNVector3] {
        // Calculate sun position using astronomical algorithms
        // Generate sun path for the day
    }

    func renderShadows(for time: Date, in unit: SCNNode) -> SCNScene {
        // Physics-based shadow rendering
        // Real-time lighting based on time of day
    }
}
```

#### Module 3: Balcony View 360
```kotlin
// Android Native Module: BalconyView360.kt

class BalconyView360Module(reactContext: ReactApplicationContext) {
    fun loadPanorama(floorNumber: Int, direction: String): Promise {
        // Fetch drone-captured 360° image
        // Stitch to exact floor height
        // Enable gyroscope-based navigation
    }

    fun overlayPOIs(lat: Double, lng: Double): List<POI> {
        // Overlay nearby landmarks
        // Distance calculations
        // AR markers for schools, hospitals, etc.
    }
}
```

**Implementation Timeline:**
- Week 1-2: Unity project setup + Basic 3D navigation
- Week 3-4: Sunlight simulator (physics engine)
- Week 5-6: Balcony View 360 (AR integration)
- Week 7-8: Polish + performance optimization

---

## 3. Builder OS - New B2B Product

### 3.1 Core Features

#### A. Unified Marketing Dashboard
```typescript
// Feature: Unified Marketing Pool

interface MarketingCampaign {
  projectId: string;
  pooledBudget: number;
  contributors: Array<{
    agentId: string;
    contribution: number;
    leadShare: number; // percentage
  }>;
  channels: {
    facebook: FacebookCampaignConfig;
    google: GoogleAdsCampaign;
    instagram: InstagramCampaign;
  };
  analytics: {
    impressions: number;
    clicks: number;
    leads: number;
    costPerLead: number;
  };
}

// Backend Endpoint
POST /api/builder-os/marketing/create-campaign
Body: {
  projectId: "proj-123",
  pooledBudget: 500000, // ₹5L
  contributors: [
    { agentId: "agent-1", contribution: 250000 },
    { agentId: "agent-2", contribution: 250000 }
  ]
}

Response: {
  campaignId: "camp-456",
  projectedLeads: 150,
  costPerLead: 3333
}
```

#### B. Inventory Matrix (Live)
```typescript
// Feature: Real-Time Inventory Grid

interface InventoryMatrix {
  projectId: string;
  towers: Array<{
    towerId: string;
    name: string;
    floors: Array<{
      floorNumber: number;
      units: Array<{
        unitNumber: string;
        type: '2BHK' | '3BHK' | '4BHK';
        area: number;
        price: number;
        status: 'AVAILABLE' | 'BLOCKED' | 'SOLD' | 'REGISTERED';
        blockedBy?: string; // Agent ID
        blockedUntil?: Date;
        lastUpdated: Date;
      }>
    }>
  }>;
  realTimeSync: boolean; // WebSocket updates
}

// Frontend Component
const InventoryGrid = () => {
  const [matrix, setMatrix] = useState<InventoryMatrix>();

  useEffect(() => {
    // WebSocket connection for real-time updates
    const ws = new WebSocket('wss://api.propmubi.com/builder-os/inventory');

    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      // Update specific unit status
      updateUnitStatus(update.unitId, update.status);
    };
  }, []);

  return (
    <Grid>
      {matrix?.towers.map(tower => (
        <TowerView tower={tower} onUnitClick={handleUnitAction} />
      ))}
    </Grid>
  );
};
```

#### C. Auto-Pilot CRM
```typescript
// Feature: Intelligent Lead Routing

interface LeadScoringEngine {
  scoreProfile(lead: Lead): LeadScore;
  assignToAgent(lead: Lead, agents: Agent[]): string;
  scheduleFollowUp(lead: Lead): FollowUpTask;
}

class AutoPilotCRM {
  async processIncomingLead(lead: Lead): Promise<void> {
    // 1. Score lead quality (0-100)
    const score = this.scoreProfile(lead);

    // 2. Verify intent (OTP + Income check)
    if (score > 70) {
      await this.verifyIntent(lead);
    }

    // 3. Assign to best-fit agent
    const agentId = this.assignToAgent(lead);

    // 4. Auto-schedule site visit
    await this.scheduleFollowUp(lead);

    // 5. Send personalized content
    await this.sendPersonalizedBrochure(lead);
  }

  private scoreProfile(lead: Lead): number {
    let score = 0;

    // Budget match
    if (lead.budget >= project.minPrice) score += 30;

    // Location preference
    if (lead.preferredLocality === project.locality) score += 20;

    // Verification status
    if (lead.mobileVerified) score += 10;
    if (lead.incomeVerified) score += 20;

    // Engagement level
    if (lead.virtualTourViewed) score += 10;
    if (lead.siteVisitRequested) score += 10;

    return score;
  }
}
```

### 3.2 Revenue Model for Builder OS

| Feature | Pricing | Target Customers | Monthly Revenue Potential |
|---------|---------|------------------|--------------------------|
| **Basic CRM** | ₹10,000/mo | Small builders (5-10 projects) | ₹2L (20 customers) |
| **Inventory Matrix** | ₹25,000/mo | Mid-sized builders (10-20 projects) | ₹5L (20 customers) |
| **Unified Marketing** | 10% of ad spend | Large builders (pooled campaigns) | ₹10L (commission) |
| **Full Suite** | ₹50,000/mo | Enterprise builders (20+ projects) | ₹10L (20 customers) |

**Total Builder OS Revenue:** ₹27L/month at scale

---

## 4. Data Ingestion Pipeline

### 4.1 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Ingestion Triggers                     │
│  • Builder uploads PDF                                   │
│  • RERA scraper (daily cron)                            │
│  • Social media monitor (hourly)                         │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│                  Message Queue (Kafka)                   │
│  Topic: property.new                                     │
│  Topic: rera.updates                                     │
│  Topic: social.leads                                     │
└──────────────────────┬──────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
┌───────▼──────┐ ┌────▼─────┐ ┌─────▼────────┐
│ Worker A     │ │ Worker B │ │ Worker C     │
│ (Scraper)    │ │ (Parser) │ │ (Verifier)   │
│              │ │          │ │              │
│ Playwright   │ │ GPT-4    │ │ Landeed API  │
│ Fetches RERA │ │ Extracts │ │ Verifies EC  │
└───────┬──────┘ └────┬─────┘ └─────┬────────┘
        │              │              │
        └──────────────┼──────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│            Data Validator & Aggregator                   │
│  • Deduplicate                                          │
│  • Cross-verify (RERA ID vs Survey No)                 │
│  • Calculate Trust Score                                │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│                 PostGIS Database                         │
│  Table: verified_properties                             │
│  Columns: geom, trust_score, rera_status, etc.         │
└──────────────────────────────────────────────────────────┘
```

### 4.2 Implementation

#### Worker A: RERA Scraper
```python
# scrapers/rera_scraper.py

import asyncio
from playwright.async_api import async_playwright
import logging

class RERAScraper:
    def __init__(self, state: str):
        self.base_url = self.get_rera_url(state)
        self.state = state

    async def scrape_project(self, rera_id: str) -> dict:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()

            try:
                # Navigate to RERA portal
                await page.goto(f"{self.base_url}/projects/{rera_id}")

                # Wait for data load
                await page.wait_for_selector('.project-details')

                # Extract data
                project_data = await page.evaluate('''() => {
                    return {
                        name: document.querySelector('.project-name').textContent,
                        builder: document.querySelector('.builder-name').textContent,
                        status: document.querySelector('.rera-status').textContent,
                        completion_date: document.querySelector('.completion-date').textContent,
                        sanctioned_plans: Array.from(
                            document.querySelectorAll('.plan-link')
                        ).map(link => link.href)
                    }
                }''')

                # Verify litigation status
                await page.click('#litigation-tab')
                await page.wait_for_selector('.litigation-status')

                litigation = await page.evaluate('''() => {
                    return {
                        active_cases: document.querySelector('.active-cases').textContent,
                        case_types: Array.from(
                            document.querySelectorAll('.case-type')
                        ).map(el => el.textContent)
                    }
                }''')

                project_data['litigation'] = litigation

                # Calculate trust score
                trust_score = self.calculate_trust_score(project_data)
                project_data['trust_score'] = trust_score

                # Publish to Kafka
                await self.publish_to_kafka('property.verified', project_data)

                return project_data

            except Exception as e:
                logging.error(f"Scraping failed for {rera_id}: {str(e)}")
                raise
            finally:
                await browser.close()

    def calculate_trust_score(self, data: dict) -> int:
        score = 100

        # Deduct for litigation
        if data['litigation']['active_cases'] > 0:
            score -= 20

        # Deduct if delayed
        if self.is_delayed(data['completion_date']):
            score -= 15

        # Deduct if status not "Registered"
        if data['status'] != 'Registered':
            score -= 30

        return max(score, 0)

    async def publish_to_kafka(self, topic: str, data: dict):
        # Publish to Kafka for downstream processing
        pass
```

#### Worker B: PDF Parser (GPT-4 Vision)
```python
# parsers/brochure_parser.py

import openai
import base64
from typing import Dict

class BrochureParser:
    def __init__(self):
        self.client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

    async def parse_brochure(self, pdf_url: str) -> Dict:
        """Extract structured data from property brochure using GPT-4 Vision"""

        # Convert PDF to images (first 5 pages)
        images = await self.pdf_to_images(pdf_url, max_pages=5)

        # Prepare prompt
        prompt = """
        Extract the following information from this real estate brochure:

        1. Project Name
        2. Builder/Developer Name
        3. Location (Address, Locality, City)
        4. Unit Types (e.g., 2BHK, 3BHK with areas)
        5. Price Range
        6. Amenities (list all)
        7. Possession Date
        8. RERA Number (if visible)
        9. Contact Details

        Return ONLY valid JSON in this format:
        {
          "project_name": "...",
          "builder": "...",
          "location": {...},
          "units": [...],
          "price_range": {...},
          "amenities": [...],
          "possession_date": "...",
          "rera_number": "...",
          "contact": {...}
        }
        """

        # Call GPT-4 Vision
        response = self.client.chat.completions.create(
            model="gpt-4-vision-preview",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        *[{"type": "image_url", "image_url": {"url": img}}
                          for img in images]
                    ]
                }
            ],
            max_tokens=1500
        )

        # Parse JSON response
        extracted_data = json.loads(response.choices[0].message.content)

        # Validate and enrich
        validated_data = await self.validate_extracted_data(extracted_data)

        return validated_data

    async def validate_extracted_data(self, data: Dict) -> Dict:
        """Cross-verify extracted data with external sources"""

        # Verify RERA number via SurePass API
        if data.get('rera_number'):
            rera_valid = await self.verify_rera(data['rera_number'])
            data['rera_verified'] = rera_valid

        # Geocode address
        if data.get('location', {}).get('address'):
            coords = await self.geocode_address(data['location']['address'])
            data['location']['coordinates'] = coords

        return data
```

#### Worker C: Trust Verifier
```python
# verifiers/trust_verifier.py

class TrustVerifier:
    def __init__(self):
        self.landeed_client = LandeedClient()
        self.teal_client = TEALClient()
        self.court_scraper = CourtRecordScraper()

    async def verify_project(self, project_data: Dict) -> Dict:
        """Comprehensive trust verification"""

        verification_results = {
            'project_id': project_data['id'],
            'checks': {},
            'overall_score': 0
        }

        # Check 1: Land Title (Landeed)
        if project_data.get('survey_number'):
            ec_result = await self.landeed_client.fetch_ec(
                survey_number=project_data['survey_number'],
                district=project_data['district']
            )
            verification_results['checks']['land_title'] = {
                'status': ec_result['status'],
                'encumbrance_free': ec_result['encumbrance_free'],
                'score': 100 if ec_result['encumbrance_free'] else 50
            }

        # Check 2: Litigation History (TEAL)
        builder_name = project_data['builder']
        litigation = await self.teal_client.check_litigation(builder_name)
        verification_results['checks']['litigation'] = {
            'active_cases': litigation['active_cases'],
            'severity': litigation['severity'],
            'score': 100 - (litigation['active_cases'] * 10)
        }

        # Check 3: Court Records
        court_cases = await self.court_scraper.search(builder_name)
        verification_results['checks']['court_records'] = {
            'total_cases': len(court_cases),
            'pending_cases': len([c for c in court_cases if c['status'] == 'pending']),
            'score': 100 if len(court_cases) == 0 else 70
        }

        # Calculate overall score
        scores = [check['score'] for check in verification_results['checks'].values()]
        verification_results['overall_score'] = sum(scores) / len(scores)

        # Determine trust level
        if verification_results['overall_score'] >= 90:
            verification_results['trust_level'] = 'HIGH'
            verification_results['badge_color'] = 'GREEN'
        elif verification_results['overall_score'] >= 70:
            verification_results['trust_level'] = 'MEDIUM'
            verification_results['badge_color'] = 'YELLOW'
        else:
            verification_results['trust_level'] = 'LOW'
            verification_results['badge_color'] = 'RED'

        return verification_results
```

### 4.3 Temporal Workflow Orchestration

```typescript
// workflows/project-onboarding.workflow.ts

import { proxyActivities } from '@temporalio/workflow';

const activities = proxyActivities({
  startToCloseTimeout: '10 minutes'
});

export async function projectOnboardingWorkflow(input: {
  brochureUrl: string;
  uploadedBy: string;
}): Promise<ProjectOnboardingResult> {

  console.log('[Workflow] Starting project onboarding');

  // Step 1: Parse brochure (Worker B)
  const extractedData = await activities.parseBrochure(input.brochureUrl);

  // Step 2: Verify RERA (Worker A)
  let reraData = null;
  if (extractedData.rera_number) {
    reraData = await activities.scrapeRERA(extractedData.rera_number);
  }

  // Step 3: Trust verification (Worker C)
  const trustResults = await activities.verifyTrust({
    ...extractedData,
    rera_data: reraData
  });

  // Step 4: Geocoding
  const coordinates = await activities.geocodeAddress(
    extractedData.location.address
  );

  // Step 5: Fetch satellite imagery
  const satelliteImage = await activities.fetchSatelliteImage(coordinates);

  // Step 6: Store in PostGIS
  const projectId = await activities.storeProject({
    ...extractedData,
    rera_data: reraData,
    trust_results: trustResults,
    coordinates,
    satellite_image: satelliteImage,
    status: 'VERIFIED',
    uploaded_by: input.uploadedBy
  });

  // Step 7: Generate digital twin assets
  await activities.generateDigitalTwin(projectId);

  console.log('[Workflow] Project onboarding completed:', projectId);

  return {
    project_id: projectId,
    trust_score: trustResults.overall_score,
    status: 'SUCCESS'
  };
}
```

---

## 5. Apex Home+ Subscription

### 5.1 Features

| Feature | Description | Value Prop |
|---------|-------------|------------|
| **Progress Tracker** | Weekly satellite images with "Green-to-Grey" change detection | NRI peace of mind |
| **Digital Fence** | Encroachment alerts if unauthorized construction detected | Asset protection |
| **Live Valuation** | Monthly market value updates based on registration data | Investment tracking |
| **Document Vault** | Encrypted storage for Sale Deed, Loan Papers, etc. | Secure access |
| **Transaction Radar** | Notifications when neighbors sell (price discovery) | Market intelligence |

### 5.2 Implementation

```typescript
// services/apex-home-plus.service.ts

interface ApexHomeSubscription {
  userId: string;
  propertyId: string;
  plan: 'MONTHLY' | 'YEARLY';
  features: {
    satelliteMonitoring: boolean;
    documentVault: boolean;
    valuationTracking: boolean;
    transactionRadar: boolean;
  };
  status: 'ACTIVE' | 'PAUSED' | 'CANCELLED';
  nextBillingDate: Date;
}

class ApexHomePlusService {
  // Weekly satellite check (automated cron job)
  async performWeeklySatelliteCheck(subscription: ApexHomeSubscription): Promise<void> {
    const property = await this.getProperty(subscription.propertyId);

    // Fetch latest satellite image
    const latestImage = await sentinelHub.fetchImage({
      coordinates: property.coordinates,
      date: new Date()
    });

    // Compare with baseline (property handover date image)
    const baseline = property.satellite_baseline;
    const changeDetection = await this.detectChanges(baseline, latestImage);

    // If significant change detected
    if (changeDetection.changePercentage > 15) {
      // Send alert
      await this.sendAlert(subscription.userId, {
        type: 'ENCROACHMENT_RISK',
        severity: 'HIGH',
        message: `${changeDetection.changePercentage}% change detected at your property`,
        images: {
          before: baseline,
          after: latestImage,
          diff: changeDetection.diffImage
        },
        action: 'VERIFY_ON_GROUND'
      });
    }

    // Store report
    await this.storeProgressReport({
      subscriptionId: subscription.id,
      date: new Date(),
      changePercentage: changeDetection.changePercentage,
      images: [latestImage],
      status: changeDetection.changePercentage > 15 ? 'ALERT' : 'NORMAL'
    });
  }

  // Monthly valuation update
  async updateValuation(subscription: ApexHomeSubscription): Promise<void> {
    const property = await this.getProperty(subscription.propertyId);

    // Fetch recent transactions in the area
    const recentSales = await zapkey.getRegistrationData({
      location: property.location,
      radius: 1000, // 1 km
      dateRange: { from: subtractMonths(new Date(), 1), to: new Date() }
    });

    // Calculate new valuation
    const newValuation = this.calculateValuation(property, recentSales);

    // Calculate appreciation
    const oldValuation = property.lastValuation || property.purchasePrice;
    const appreciation = ((newValuation - oldValuation) / oldValuation) * 100;

    // Store and notify
    await this.updatePropertyValuation(property.id, newValuation);

    await this.sendNotification(subscription.userId, {
      type: 'VALUATION_UPDATE',
      message: `Your property value: ₹${newValuation.toLocaleString('en-IN')}`,
      change: appreciation,
      trend: appreciation > 0 ? 'UP' : 'DOWN'
    });
  }
}
```

### 5.3 Revenue Model

**Pricing:** ₹499/month or ₹4,999/year (17% discount)

**Target Market:**
- NRIs (primary): 500,000 potential customers
- Domestic investors with multiple properties: 200,000

**Projected Revenue:**
- Year 1: 5,000 subscribers = ₹25L/month
- Year 2: 20,000 subscribers = ₹1Cr/month
- Year 3: 50,000 subscribers = ₹2.5Cr/month

---

## 6. Integration with Master System Prompt

### 6.1 AI Development Guidelines

Based on your Master System Prompt, here's the implementation checklist for AI assistants:

#### Directive 1: 90/10 Rule Implementation

```typescript
// Decision Tree for AI Coding Assistant

function determineImplementationApproach(feature: string): TechStack {
  // UI-related features → React Native
  if (feature.includes('form') ||
      feature.includes('list') ||
      feature.includes('dashboard') ||
      feature.includes('search')) {
    return {
      framework: 'React Native (Expo)',
      styling: 'NativeWind',
      stateManagement: 'Zustand',
      navigation: 'Expo Router'
    };
  }

  // Visual/3D features → Native Modules
  if (feature.includes('3D') ||
      feature.includes('AR') ||
      feature.includes('camera') ||
      feature.includes('sensor') ||
      feature.includes('sunlight')) {
    return {
      iOS: 'Swift + Unity',
      Android: 'Kotlin + Unity',
      bridge: 'JSI/Turbo Modules'
    };
  }

  // Backend logic → NestJS
  if (feature.includes('API') ||
      feature.includes('workflow') ||
      feature.includes('integration')) {
    return {
      framework: 'NestJS',
      database: 'PostGIS',
      queue: 'Kafka',
      workflow: 'Temporal.io'
    };
  }
}
```

#### Directive 2: Data-Forwarding Pattern

```typescript
// ✅ CORRECT: Data Forwarding Pattern

// DO: Forward user data to service partner
async function applyForLoan(userId: string, propertyId: string): Promise<LoanApplication> {
  // Step 1: Fetch user's bank statements via AA
  const financialData = await setu.fetchBankStatements(userId);

  // Step 2: Forward to bank API
  const loanApplication = await bankAPI.submitApplication({
    user_id: userId,
    property_id: propertyId,
    financial_data: financialData,
    requested_amount: calculateLoanAmount(propertyId)
  });

  // Step 3: Return reference ID
  return {
    application_id: loanApplication.id,
    status: 'SUBMITTED',
    estimated_approval: '24 hours'
  };
}

// ❌ INCORRECT: Building business logic ourselves

// DON'T: Calculate EMI ourselves
function calculateEMI(principal: number, rate: number, tenure: number): number {
  // This is bank's responsibility, not ours!
  const monthlyRate = rate / 12 / 100;
  const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, tenure) /
              (Math.pow(1 + monthlyRate, tenure) - 1);
  return emi;
}
```

#### Directive 3: Trust Signals in UI

```tsx
// ✅ CORRECT: Trust Signal Component

interface TrustBadgeProps {
  source: string;
  verified: boolean;
  lastChecked: Date;
  trustScore?: number;
}

const TrustBadge: React.FC<TrustBadgeProps> = ({
  source,
  verified,
  lastChecked,
  trustScore
}) => {
  const badgeColor = verified ? 'bg-green-500' : 'bg-red-500';

  return (
    <View className={`flex-row items-center p-2 rounded ${badgeColor}`}>
      <Text className="text-white font-bold">
        {verified ? '✓' : '✗'} Verified
      </Text>
      <Text className="text-white text-xs ml-2">
        Source: {source}
      </Text>
      {trustScore && (
        <Text className="text-white text-xs ml-2">
          Score: {trustScore}/100
        </Text>
      )}
      <Text className="text-white text-xs ml-2">
        Last checked: {formatRelativeTime(lastChecked)}
      </Text>
    </View>
  );
};

// Usage in Property Card
<PropertyCard>
  <PropertyImage />
  <PropertyDetails />

  {/* Trust signals always visible */}
  <TrustBadge
    source="MahaRERA"
    verified={property.rera_verified}
    lastChecked={property.rera_last_checked}
    trustScore={property.trust_score}
  />

  <TrustBadge
    source="Satellite (Sentinel Hub)"
    verified={property.satellite_monitored}
    lastChecked={property.last_satellite_check}
  />
</PropertyCard>
```

#### Directive 4: Adapter Pattern for Integrations

```typescript
// ✅ CORRECT: Adapter Pattern

// Base interface
interface DocumentVerificationProvider {
  fetchEC(surveyNumber: string, district: string): Promise<ECDocument>;
  fetchROR(surveyNumber: string, district: string): Promise<RORDocument>;
}

// Provider 1: Landeed
class LandeedAdapter implements DocumentVerificationProvider {
  async fetchEC(surveyNumber: string, district: string): Promise<ECDocument> {
    const response = await axios.post('https://api.landeed.com/v1/ec', {
      survey_number: surveyNumber,
      district: district
    });

    // Transform to our standard format
    return {
      survey_number: surveyNumber,
      status: response.data.status,
      encumbrances: response.data.encumbrances.map(this.transformEncumbrance),
      valid_until: response.data.validity_date,
      source: 'Landeed'
    };
  }

  async fetchROR(surveyNumber: string, district: string): Promise<RORDocument> {
    // Implementation
  }
}

// Provider 2: SurePass (fallback)
class SurePassAdapter implements DocumentVerificationProvider {
  async fetchEC(surveyNumber: string, district: string): Promise<ECDocument> {
    const response = await axios.get(`https://api.surepass.io/land/ec/${surveyNumber}`, {
      params: { district }
    });

    // Transform to our standard format
    return {
      survey_number: surveyNumber,
      status: response.data.verification_status,
      encumbrances: response.data.records.map(this.transformEncumbrance),
      valid_until: response.data.expiry,
      source: 'SurePass'
    };
  }

  async fetchROR(surveyNumber: string, district: string): Promise<RORDocument> {
    // Implementation
  }
}

// Service layer uses adapter
class DocumentVerificationService {
  private provider: DocumentVerificationProvider;

  constructor() {
    // Easy to switch providers
    this.provider = process.env.DOC_PROVIDER === 'landeed'
      ? new LandeedAdapter()
      : new SurePassAdapter();
  }

  async verifyLandDocuments(surveyNumber: string, district: string) {
    const ec = await this.provider.fetchEC(surveyNumber, district);
    const ror = await this.provider.fetchROR(surveyNumber, district);

    return {
      ec,
      ror,
      verified: ec.encumbrances.length === 0
    };
  }
}
```

---

## 7. Implementation Timeline

### Phase 1: Foundation (Months 1-3)

**Week 1-4: Architecture Migration**
- [ ] Setup NestJS backend
- [ ] Migrate Express routes to NestJS controllers
- [ ] Setup Temporal.io for workflow orchestration
- [ ] Setup Kafka for message queuing

**Week 5-8: Ingestion Pipeline**
- [ ] Build Python scrapers (RERA, Social)
- [ ] Implement GPT-4 Vision PDF parser
- [ ] Build trust verifier (Landeed, TEAL, Courts)
- [ ] Setup PostGIS database

**Week 9-12: React Native Shell**
- [ ] Migrate to NativeWind styling
- [ ] Build property listing with trust badges
- [ ] Implement search with filters
- [ ] Add service booking flows

**Deliverable:** Working MVP with verified data and service bookings

---

### Phase 2: Visual Core (Months 4-6)

**Week 13-16: Unity Integration**
- [ ] Setup Unity project for 3D navigation
- [ ] Build Gate-to-Key navigator
- [ ] Implement X-Ray mode (Available/Sold visualization)
- [ ] Embed Unity in React Native

**Week 17-20: AR/Native Modules**
- [ ] Build Sunlight Simulator (iOS/Android)
- [ ] Implement Balcony View 360
- [ ] AR plot finder
- [ ] Performance optimization

**Week 21-24: Builder OS**
- [ ] Build Unified Marketing dashboard
- [ ] Implement Inventory Matrix (real-time WebSocket)
- [ ] Create Auto-Pilot CRM
- [ ] Launch beta with 5 builders

**Deliverable:** "No Brochure" experience + Builder OS beta

---

### Phase 3: Ecosystem (Months 7-9)

**Week 25-28: Apex Home+**
- [ ] Build subscription management
- [ ] Implement weekly satellite checks
- [ ] Create document vault
- [ ] Build valuation tracker
- [ ] Transaction radar alerts

**Week 29-32: Service Marketplace**
- [ ] Integrate remaining services (Infurnia, SmartPuja)
- [ ] Build "Factory Link" for interiors
- [ ] Implement one-click service booking
- [ ] Create service provider dashboard

**Week 33-36: Scale & Polish**
- [ ] Performance optimization
- [ ] Load testing (10,000 concurrent users)
- [ ] Security audit
- [ ] Launch marketing campaign

**Deliverable:** Full ecosystem launch

---

## 8. Success Metrics

### Business KPIs

| Metric | Month 3 | Month 6 | Month 9 |
|--------|---------|---------|---------|
| **Verified Projects** | 100 | 500 | 2,000 |
| **Active Users** | 10,000 | 50,000 | 200,000 |
| **Builder OS Customers** | 5 | 20 | 50 |
| **Apex Home+ Subscribers** | 500 | 2,000 | 5,000 |
| **Monthly Revenue** | ₹10L | ₹50L | ₹2Cr |

### Technical KPIs

| Metric | Target |
|--------|--------|
| **API Response Time** | < 500ms (95th percentile) |
| **Unity Frame Rate** | > 60 FPS |
| **Scraper Success Rate** | > 95% |
| **Data Accuracy** | > 98% |
| **System Uptime** | > 99.9% |

---

## 9. Risk Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **RERA site changes break scrapers** | High | Medium | Adapter pattern + manual fallback |
| **Unity performance on low-end phones** | Medium | High | Progressive loading + LOD system |
| **GPT-4 Vision API costs too high** | Medium | Medium | Batch processing + caching |
| **Builders resist new platform** | High | Medium | Free pilot + revenue share model |
| **Regulatory challenges** | High | Low | Legal counsel + compliance team |

---

## 10. Next Immediate Actions

### This Week

1. **Review & Approve** this implementation plan
2. **Setup development environment**
   - NestJS backend skeleton
   - Temporal.io local instance
   - Kafka local cluster
   - Unity project initialization

3. **Start Phase 1, Week 1:**
   - Migrate 3 core API endpoints to NestJS
   - Setup first Temporal workflow
   - Begin RERA scraper for one state (Telangana)

### Resources Needed

**Team:**
- 2 Backend developers (NestJS, Python)
- 2 Frontend developers (React Native)
- 1 Unity developer (3D/AR)
- 1 DevOps engineer
- 1 QA engineer

**Infrastructure:**
- AWS account (ECS, S3, RDS)
- Temporal Cloud subscription
- Kafka managed service (Confluent)
- OpenAI API credits (GPT-4 Vision)
- Sentinel Hub API subscription

---

## Conclusion

This implementation plan bridges your Master Blueprint vision with practical execution steps. The "90/10" architecture is clear, the data-forwarding pattern is defined, and the phased roadmap ensures incremental value delivery.

**Key Differentiators:**
1. ✅ Visual Core (Unity) - No competitor has this
2. ✅ Trust Engine (11+ sources) - Unique verification
3. ✅ Builder OS - New B2B revenue stream
4. ✅ Apex Home+ - Recurring subscription model

**Ready to start implementation!** 🚀

---

**Document Version:** 1.0
**Last Updated:** November 28, 2024
**Status:** Awaiting Approval
