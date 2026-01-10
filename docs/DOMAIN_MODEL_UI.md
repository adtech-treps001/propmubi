# Propmubi UI Domain Model
## Comprehensive Frontend Screen & Component Architecture

**Version:** 1.0
**Date:** December 2025
**Purpose:** LLM-friendly guide for generating frontend screens, components, and user interfaces

---

## Table of Contents
1. [Core Design Principles](#core-design-principles)
2. [Screen Catalog by Module](#screen-catalog-by-module)
3. [Reusable Component Library](#reusable-component-library)
4. [Data Visualization Components](#data-visualization-components)
5. [Form Components](#form-components)
6. [Navigation Patterns](#navigation-patterns)
7. [State Management Architecture](#state-management-architecture)

---

## Core Design Principles

### Universal Design System
- **Platform**: React Native (Mobile) + React Web (Browser)
- **Code Sharing**: 90% shared components via Tamagui
- **Styling**: NativeWind 2.0 (Tailwind CSS for React Native)
- **State**: Zustand (global) + TanStack Query (server state)
- **Forms**: React Hook Form with Zod validation

### Visual Design Guidelines

Design tokens include colors for primary (Blue - Trust, Professional), secondary (Green - Success, Growth), accent (Amber - Warning, Attention), danger (Red - Error, Critical), and neutral shades. Spacing uses a scale from extra small to extra large, and typography defines heading and body text sizes with appropriate weights.

---

## Screen Catalog by Module

### Module 1: Buy/Sell - Property Discovery & Due Diligence

#### Screen 1.1: Property Search & Listing
**File**: `screens/BuySell/PropertySearchScreen.tsx`

**Purpose**: Main property discovery interface with advanced filters

**Layout Structure**:
```
┌─────────────────────────────────────────┐
│ Header: "Find Your Dream Home"         │
│ [Back] [Filter] [Sort] [Map View]      │
├─────────────────────────────────────────┤
│ SearchBar: "Location, Project, Builder"│
├─────────────────────────────────────────┤
│ QuickFilters (Chips):                   │
│ [2BHK] [3BHK] [₹50L-1Cr] [Ready]      │
├─────────────────────────────────────────┤
│ PropertyCard 1                          │
│ ┌───────────────────────────────────┐   │
│ │ [Image Carousel]                  │   │
│ │ My Home Sayuk - 3BHK              │   │
│ │ ₹1.85 Cr • 1,926 sqft             │   │
│ │ ⭐ RERA Verified • Trust Score 92 │   │
│ │ Tellapur, Hyderabad               │   │
│ │ [Shortlist ♥] [View Details →]   │   │
│ └───────────────────────────────────┘   │
│                                         │
│ PropertyCard 2 ...                      │
│ PropertyCard 3 ...                      │
├─────────────────────────────────────────┤
│ [Load More] or Infinite Scroll          │
└─────────────────────────────────────────┘
```

**Key Components**:
- `PropertyCard` - Shows property thumbnail with key details
- `FilterSheet` - Bottom sheet with 20+ filter options
- `MapView` - Interactive map showing property locations

**State Requirements**:

The search state includes filters for location (string array), price range (number tuple), bedrooms (number array), property type array, status array, and amenities array. It also includes sorting options (price ascending/descending, relevance, newest), view mode (list/grid/map), results array, and pagination with page number and hasMore boolean.

**API Integration**:
- `GET /api/properties/search` - Fetch properties with filters
- `POST /api/properties/{id}/shortlist` - Save to favorites

---

#### Screen 1.2: Property Details & Due Diligence
**File**: `screens/BuySell/PropertyDetailsScreen.tsx`

**Purpose**: Comprehensive property view with automated verification reports

**Layout Structure**:
```
┌─────────────────────────────────────────┐
│ [Back] Property Name          [Share]   │
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │ Image Gallery (Swipeable)           │ │
│ │ [1/12] 🖼️ Floor Plans 📐 3D Tour     │ │
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│ Price: ₹1.85 Cr • ₹9,620/sqft          │
│ 3 BHK • 1,926 sqft • East Facing        │
│                                         │
│ 🔒 Trust Score: 92/100 [View Report]    │
│ ✅ RERA Verified • ✅ Land Clear        │
├─────────────────────────────────────────┤
│ Tabs: [Overview] [Details] [Amenities] │
│       [Documents] [Location]            │
├─────────────────────────────────────────┤
│ Overview:                               │
│ • Builder: My Home Constructions        │
│   4.8⭐ (1,200 reviews)                 │
│ • Project: Sayuk (RERA: P02400005678)   │
│ • Possession: Dec 2025 (Ready)          │
│ • Parking: 2 Covered                    │
├─────────────────────────────────────────┤
│ Due Diligence Report (Auto-Generated):  │
│ ┌─────────────────────────────────────┐ │
│ │ 📄 RERA Verification: ✅ Valid       │ │
│ │ 📄 Land Title: ✅ Clear (Dharani)    │ │
│ │ 📄 Approvals: ✅ All Obtained        │ │
│ │ 📄 Market Value: ₹1.82Cr (Fair)      │ │
│ │ [Download Full Report PDF]           │ │
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│ Action Buttons:                         │
│ [Schedule Visit] [Pay Token ₹5,000]     │
│ [Contact Builder] [Calculate EMI]       │
└─────────────────────────────────────────┘
```

**Key Components**:
- `ImageGallery` - Swipeable photo viewer with zoom
- `TrustScoreBadge` - Visual trust indicator (0-100 score)
- `DueDiligenceCard` - Verification status summary
- `FloorPlanViewer` - Interactive floor plan with room details
- `3DTourEmbed` - Matterport integration

**State Requirements**:

The property details state includes the property object, due diligence report with overall score and individual checks (RERA, land title, market price), similar properties array, builder information, and active tab selector.

---

#### Screen 1.3: Token Payment & Booking
**File**: `screens/BuySell/TokenPaymentScreen.tsx`

**Purpose**: Lock property for 24 hours with token payment

**Layout Structure**:
```
┌─────────────────────────────────────────┐
│ Lock This Property                      │
│ [X Close]                               │
├─────────────────────────────────────────┤
│ Property: My Home Sayuk - A-1505        │
│ ₹1.85 Cr • 3 BHK • Tower A, 15th Floor  │
├─────────────────────────────────────────┤
│ 🔒 Token of Interest                    │
│                                         │
│ Pay ₹5,000 to:                          │
│ • Lock property for 24 hours            │
│ • Stop showing to other buyers          │
│ • 100% refundable if not proceeded      │
│                                         │
│ Timeline:                               │
│ ┌─────────────────────────────────────┐ │
│ │ Now → Pay Token                      │ │
│ │  ↓                                   │ │
│ │ Builder notified (2 min)             │ │
│ │  ↓                                   │ │
│ │ 24 hrs → Site visit scheduled        │ │
│ │  ↓                                   │ │
│ │ Negotiate → Booking confirmed        │ │
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│ Payment Method:                         │
│ ○ UPI (Recommended)                     │
│ ○ Credit/Debit Card                     │
│ ○ Net Banking                           │
├─────────────────────────────────────────┤
│ [Pay ₹5,000 & Lock Property]            │
│                                         │
│ Secured by Razorpay 🔐                  │
└─────────────────────────────────────────┘
```

**Key Components**:
- `TokenExplainerCard` - Visual explanation of token system
- `PaymentMethodSelector` - Radio buttons for payment options
- `RazorpayCheckout` - Payment gateway integration

---

### Module 2: Rental - CIBIL-Based Deposit & Inspection

#### Screen 2.1: Rental Deposit Calculator
**File**: `screens/Rental/DepositCalculatorScreen.tsx`

**Purpose**: Calculate rental deposit based on CIBIL score

**Layout Structure**:
```
┌─────────────────────────────────────────┐
│ Smart Deposit Calculator                │
│ Pay Less with Good Credit Score         │
├─────────────────────────────────────────┤
│ Property Details:                       │
│ Monthly Rent: ₹25,000                   │
│ Lease Period: 11 months                 │
├─────────────────────────────────────────┤
│ Your CIBIL Score:                       │
│ [Connect to Experian]  🔒 Secure        │
│                                         │
│ OR                                      │
│                                         │
│ Enter Score: [___] (650-900)            │
├─────────────────────────────────────────┤
│ Deposit Calculation:                    │
│                                         │
│ Traditional Deposit: ₹1,50,000 (6 mo)   │
│                                         │
│ Your CIBIL Score: 785 (Excellent)       │
│                                         │
│ Smart Deposit: ₹25,000 (1 month) ✅     │
│                                         │
│ 💰 You Save: ₹1,25,000!                 │
│                                         │
│ Breakdown:                              │
│ ┌─────────────────────────────────────┐ │
│ │ Score 750+: 1 month deposit          │ │
│ │ Score 650-750: 2 months deposit      │ │
│ │ Score <650: 6 months deposit         │ │
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│ Next Steps:                             │
│ 1. ✅ CIBIL verified                    │
│ 2. ⏳ Employment verification           │
│ 3. ⏳ Move-in inspection                │
│                                         │
│ [Proceed to Verification]               │
└─────────────────────────────────────────┘
```

**Key Components**:
- `CIBILScoreConnector` - Integration with Experian API
- `DepositComparisonCard` - Visual before/after comparison
- `ProgressStepper` - Step-by-step workflow indicator

---

#### Screen 2.2: AI Move-In Inspection
**File**: `screens/Rental/MoveInInspectionScreen.tsx`

**Purpose**: Document property condition using AI-powered camera

**Layout Structure**:
```
┌─────────────────────────────────────────┐
│ Move-In Inspection                      │
│ Step 2 of 4: Living Room               │
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │                                     │ │
│ │         📷 CAMERA VIEW              │ │
│ │                                     │ │
│ │  [AI Detection Active]              │ │
│ │  Room Type: Living Room ✅          │ │
│ │  Damage Detected: None ✅           │ │
│ │                                     │ │
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│ Instructions:                           │
│ • Scan all walls, floor, ceiling        │
│ • Capture any existing damage           │
│ • AI will auto-detect issues            │
├─────────────────────────────────────────┤
│ Detected Items:                         │
│ ✅ Walls: No cracks                     │
│ ✅ Floor: Tiles intact                  │
│ ⚠️ Window: Minor scratch (marked)       │
│ ✅ Ceiling: No damage                   │
├─────────────────────────────────────────┤
│ Rooms Completed: 2/6                    │
│ ○○●○○○                                  │
│                                         │
│ [Capture Photo] [Next Room →]          │
└─────────────────────────────────────────┘
```

**Key Components**:
- `AICamera` - Native camera module with ML detection
- `DamageMarker` - Overlay to mark damage locations
- `RoomProgressBar` - Visual progress through rooms
- `IPFSUploader` - Blockchain-backed immutable storage

---

### Module 3: Commercial - Footfall Analytics

#### Screen 3.1: Location Intelligence Dashboard
**File**: `screens/Commercial/LocationAnalysisScreen.tsx`

**Layout Structure**:
```
┌─────────────────────────────────────────┐
│ Commercial Location Analysis            │
│ HITEC City, Hyderabad                   │
├─────────────────────────────────────────┤
│ Location Score: 82/100 🟢 Excellent     │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 🗺️ Footfall Heatmap                 │ │
│ │ [Interactive Map with Color Zones]   │ │
│ │ Red = High Traffic                   │ │
│ │ Green = Low Traffic                  │ │
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│ Key Metrics:                            │
│                                         │
│ 👥 Daily Footfall: 15,000 people        │
│ 📈 Peak Hours: 12 PM - 2 PM, 6 PM - 9 PM│
│ 💼 Office Workers: 65%                  │
│ 🏠 Residents: 25%                       │
│ 🚗 Visitors: 10%                        │
├─────────────────────────────────────────┤
│ Demographics:                           │
│ Age: 25-40 (70%), 40-55 (20%)          │
│ Income: ₹8L-20L PA (Mid-High)          │
│ Occupation: IT, Finance, Consulting     │
├─────────────────────────────────────────┤
│ Delivery Density (Food):                │
│ Swiggy Orders/Day: 450                  │
│ Zomato Orders/Day: 380                  │
│ Trend: ↗️ +15% YoY                      │
├─────────────────────────────────────────┤
│ Recommendations for:                    │
│ ✅ Coffee Shop (High Potential)         │
│ ✅ Co-working Space (Excellent)         │
│ ⚠️ Fine Dining (Moderate)               │
│ ❌ Budget Retail (Low Potential)        │
├─────────────────────────────────────────┤
│ [Download Full Report ₹5,000]           │
└─────────────────────────────────────────┘
```

**Key Components**:
- `FootfallHeatmap` - Interactive map with traffic density
- `DemographicsChart` - Pie/bar charts for demographics
- `RecommendationCard` - AI-powered business suggestions

---

### Module 4: Auction - Bank Auctions

#### Screen 4.1: Auction Listings
**File**: `screens/Auction/AuctionListingsScreen.tsx`

**Layout Structure**:
```
┌─────────────────────────────────────────┐
│ Bank Auctions                           │
│ [Filter] [Sort: Discount %] [Alerts]    │
├─────────────────────────────────────────┤
│ Premium Feature 🌟                      │
│ Subscribe for ₹999/mo to access         │
│ [Subscribe Now] [Already Subscribed]    │
├─────────────────────────────────────────┤
│ AuctionCard 1                           │
│ ┌─────────────────────────────────────┐ │
│ │ 🏘️ Apartment, Banjara Hills          │ │
│ │ Market Value: ₹1.2 Cr                │ │
│ │ Reserve Price: ₹90 L (25% discount)  │ │
│ │ 📅 Auction Date: 15 Jan 2026         │ │
│ │ 🏦 Bank: SBI                         │ │
│ │ [View Details] [Set Alert]           │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ AuctionCard 2 ...                       │
├─────────────────────────────────────────┤
│ Filters:                                │
│ Discount: [20%+] [30%+] [40%+]         │
│ Bank: [SBI] [HDFC] [ICICI] [All]       │
│ Property Type: [Residential] [Land]     │
└─────────────────────────────────────────┘
```

**Key Components**:
- `AuctionCard` - Shows discount percentage prominently
- `AlertSetup` - Configure notifications for matching auctions
- `SubscriptionPaywall` - Premium feature gate

---

### Module 5: Lifecycle - NRI Property Monitoring

#### Screen 5.1: Satellite Monitoring Dashboard
**File**: `screens/Lifecycle/SatelliteMonitorScreen.tsx`

**Layout Structure**:
```
┌─────────────────────────────────────────┐
│ Property Watch                          │
│ Your Plot at Survey No. 125, Mokila     │
├─────────────────────────────────────────┤
│ Monitoring Status: 🟢 Active            │
│ Last Check: 2 days ago                  │
│ Next Check: In 5 days (Weekly)          │
├─────────────────────────────────────────┤
6. **Property Visualization**
   - **Satellite Review Mode (Digital Twin Lite)**:
     - Integration: Google Maps Javascript API (Satellite Mode).
     - **Features**:
       - *Polygon Overlays*: Exact property boundaries marked with verified coordinates (GeoJSON).
       - *Color Coding*:
         - Gold (#FFD700): Premium/Luxury.
         - Purple (#800080): Mixed Use/Township.
         - Green (#008000): Eco-friendly/Sustainable.
       - *Interactive Info Markers*: Clickable zones showing tower height, clubhouse location, and amenities.
       - *Contextual Graphics*: "YouTube Review" style overlays showing "X km to IT Park", "Y km to Metro".
     - **Schema**:
       ```typescript
       interface SatelliteData {
         coordinates: { lat: number, lng: number };
         boundary: Coordinate[]; // Verified plot markings
         overlays: {
           type: 'amenity' | 'transit' | 'landmark';
           label: string;
           position: Coordinate;
         }[];
         stats: {
           acres: string;
           density: string;
         }
       }
       ```

7. **Performance Monitoring**
   - Core Web Vitals targets: LCP < 2.5s, FID < 100ms, CLS < 0.1.
   - Route transition budget: < 300ms.
├─────────────────────────────────────────┤
│ Latest Satellite Image:                 │
│ ┌─────────────────────────────────────┐ │
│ │ [Satellite Image - Sentinel Hub]    │ │
│ │ Date: Dec 28, 2025                   │ │
│ │                                      │ │
│ │ Change Detection: 3.2% (Normal)      │ │
│ │ Status: ✅ No Alert                  │ │
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│ Change History:                         │
│ Dec 28: 3.2% (Vegetation growth)        │
│ Dec 21: 2.1% (Normal seasonal)          │
│ Dec 14: 15.8% ⚠️ Alert Generated        │
│   → Investigation: Legal construction   │
├─────────────────────────────────────────┤
│ Property Valuation Ticker:              │
│ Current Value: ₹85 L ↗️ +2.5% (30d)     │
│ Market Trend: Bullish                   │
├─────────────────────────────────────────┤
│ Documents Vault: 🔒 Encrypted           │
│ • Sale Deed (encrypted)                 │
│ • Property Tax Receipts                 │
│ • Survey Documents                      │
│                                         │
│ [Run Immediate Check] [View History]    │
└─────────────────────────────────────────┘
```

**Key Components**:
- `SatelliteImageViewer` - Display satellite imagery with change detection
- `ChangeDetectionAlert` - Visual indicator for significant changes
- `ValuationTicker` - Live property value updates
- `DocumentVault` - Encrypted document storage

---

### Module 6: Community - RWA Management

#### Screen 6.1: Digital Notice Board
**File**: `screens/Community/NoticeBoardScreen.tsx`

**Layout Structure**:
```
┌─────────────────────────────────────────┐
│ Community: My Home Sayuk                │
│ [Notices] [Voting] [Maintenance] [More] │
├─────────────────────────────────────────┤
│ Active Poll 🗳️                          │
│ ┌─────────────────────────────────────┐ │
│ │ Should we install solar panels?      │ │
│ │ Posted by: RWA President             │ │
│ │ Ends: Jan 5, 2026                    │ │
│ │                                      │ │
│ │ ○ Yes, install (₹50L investment)    │ │
│ │   65 votes (68%)                     │ │
│ │                                      │ │
│ │ ○ No, not needed                     │ │
│ │   30 votes (32%)                     │ │
│ │                                      │ │
│ │ Quorum: 95/150 units (63%) ✅        │ │
│ │                                      │ │
│ │ [Vote Now]                           │ │
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│ Recent Notices:                         │
│ • Water tank cleaning - Jan 2           │
│ • Guest parking slots - Dec 28          │
│ • New Year party - Dec 31               │
├─────────────────────────────────────────┤
│ Visitor Management:                     │
│ Expected Today: 2 visitors              │
│ • Amazon Delivery (OTP: 4523)           │
│ • Guest - Ramesh Kumar (OTP: 8912)      │
│                                         │
│ [Generate OTP for Visitor]              │
└─────────────────────────────────────────┘
```

**Key Components**:
- `PollCard` - Interactive voting interface
- `NoticeList` - Chronological community updates
- `VisitorOTPGenerator` - One-time password system

---

### Module 7: Land & JV - Joint Ventures

#### Screen 7.1: Land Verification & JV Matching
**File**: `screens/Land/LandVerificationScreen.tsx`

**Layout Structure**:
```
┌─────────────────────────────────────────┐
│ Land Title Verification                 │
│ [Back]                                  │
├─────────────────────────────────────────┤
│ Survey Number: [125/1A]                 │
│ Village: [Mokila]                       │
│ District: [Hyderabad]                   │
│ State: [Telangana]                      │
│                                         │
│ [Verify with Dharani]                   │
├─────────────────────────────────────────┤
│ Verification Result: ✅ Clear Title     │
│                                         │
│ Owner: Rajesh Kumar                     │
│ Area: 2.5 acres                         │
│ Land Use: Agricultural                  │
│ Encumbrances: None                      │
├─────────────────────────────────────────┤
│ Development Potential Calculator:       │
│                                         │
│ Input:                                  │
│ Land Area: 2.5 acres                    │
│ FSI Available: 1.75                     │
│ Setback Rules: Standard Residential     │
│                                         │
│ Output:                                 │
│ Buildable Area: 1.8L sqft               │
│ Potential Units: 90 apartments (2000sf) │
│ Market Value (Built): ₹150 Cr          │
├─────────────────────────────────────────┤
│ Joint Venture Matchmaking:              │
│                                         │
│ Top Matched Builders:                   │
│ 1. My Home (Trust: 4.8⭐)               │
│    Past JVs: 12 successful              │
│    [Send Proposal]                      │
│                                         │
│ 2. Prestige (Trust: 4.9⭐)              │
│    Past JVs: 25 successful              │
│    [Send Proposal]                      │
└─────────────────────────────────────────┘
```

**Key Components**:
- `DharaniConnector` - Integration with Telangana land records
- `DevelopmentCalculator` - FSI and buildable area calculator
- `BuilderMatchList` - Ranked list of verified builders

---

## Reusable Component Library

### 1. Property Components

#### PropertyCard

The PropertyCard component accepts a property object with details like id, title, price, area, bedrooms, bathrooms, images, location, trust score, and RERA verification status. It also takes onPress and onShortlist callbacks, and supports three variants: compact, detailed, and featured.

**Visual Design**:
- **Compact**: Single line with thumbnail (for lists)
- **Detailed**: Multi-line with carousel (for search results)
- **Featured**: Large hero card with gradient overlay

#### TrustScoreBadge

The TrustScoreBadge component displays a score from 0-100 in three sizes (small, medium, large) with optional label. The visual mapping uses colors: 90-100 shows green (Excellent), 70-89 shows yellow (Good), 50-69 shows orange (Fair), and 0-49 shows red (Poor).

---

### 2. Form Components

#### FilterSheet

The FilterSheet component provides a bottom sheet interface for applying search filters. It contains multi-select chips for property type and bedrooms, range sliders for price and area, dropdowns for city and locality, and toggle switches for RERA verified and ready to move options.

#### PaymentMethodSelector

The PaymentMethodSelector displays payment options including UPI, Cards, Net Banking, and Wallets. Each method has an id, name, icon, and recommended flag.

---

### 3. Data Visualization

#### FootfallHeatmap

The FootfallHeatmap component displays location data with latitude, longitude, and radius, along with data points showing intensity from 0-1. It uses Mapbox GL for rendering with color gradients from blue (low) through yellow to red (high) for different intensity levels.

#### PriceBreakdownChart

The PriceBreakdownChart renders a stacked bar or pie chart showing price components like base price, floor rise, parking, GST, etc. Each component includes name, amount, percentage, and GST applicability flag.

---

### 4. Navigation Components

#### BottomTabNavigator

The bottom tab navigator includes four tabs: Home, Search, Saved, and Profile, each with corresponding icons and screen names. It auto-hides on scroll down and shows on scroll up.

#### ModuleSelector

The main menu allows switching between seven modules: Buy/Sell, Rental, Commercial, Auction, Lifecycle, Community, and Land & JV, each with unique identifiers and icons.

---

## State Management Architecture

### Global State (Zustand)

The auth store manages user authentication state including user object, token, authentication status, and login/logout functions.

The property store handles saved properties, search filters, recent searches, and functions to save or remove properties.

The UI store tracks the active module, theme (light/dark), language (English/Hindi/Telugu), and module switching function.

### Server State (TanStack Query)

Custom hooks manage server data fetching and mutations. The useProperty hook fetches property data with a 5-minute stale time. The useDueDiligence mutation generates due diligence reports and caches the results.

---

## Responsive Design Breakpoints

The application uses three breakpoints: mobile (0-640px), tablet (640-1024px), and desktop (1024px+). Styles adapt based on device size, adjusting padding and layout direction accordingly.

---

## Accessibility Guidelines

1. **Color Contrast**: Minimum 4.5:1 for text
2. **Touch Targets**: Minimum 44x44 pixels
3. **Screen Reader**: All interactive elements have labels
4. **Keyboard Navigation**: Tab order logical on web
5. **Error Messages**: Clear, actionable, visible

---

## Performance Optimization

### Image Optimization
- Use WebP format with JPEG fallback
- Lazy load images below fold
- Blur-up placeholder technique
- Responsive image sizes (thumbnail, medium, full)

### Code Splitting

Heavy modules like the Commercial module and Satellite viewer are lazy loaded to improve initial load performance.

### Caching Strategy
- API responses: 5-15 minutes
- Static content: 24 hours
- User preferences: Persistent storage
- Search results: Session-based

---

**End of UI Domain Model**

This document serves as the complete reference for generating all frontend screens and components for the Propmubi application. Each screen is designed with user intent, visual hierarchy, and seamless data flow in mind.
