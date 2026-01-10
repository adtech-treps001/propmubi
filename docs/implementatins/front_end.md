LAYER 0: DESIGN TOKENS (Foundation)                         │
│ • Colors, spacing, typography, shadows, radii               │
│ • Decision rules for LLM selection                           │
│ • Usage examples                                              │
└──────────────────────────────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────────┐
│ LAYER 1: PRIMITIVES (Imported, not generated)               │
│ • Shadcn/Radix components                                    │
│ • Catalog with usage docs                                    │
│ • Examples for LLM reference                                 │
└──────────────────────────────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────────┐
│ LAYER 2: DOMAIN COMPONENTS (Generated)                      │
│ • PropertyCard, TransactionTimeline, UserProfile            │
│ • Business logic encapsulation                               │
│ • Props interface, usage examples                            │
└──────────────────────────────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────────┐
│ LAYER 3: PATTERNS (Generated with slots)                    │
│ • MasterDetail, Wizard, CardGrid, DataTable                 │
│ • Composition logic                                           │
│ • Decision rules (when to use)                               │
└──────────────────────────────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────────┐
│ LAYER 4: SCREEN BLUEPRINTS (Templates)                      │
│ • Pattern composition                                         │
│ • Data schema                                                 │
│ • State management strategy                                   │
│ • Generation template                                         │
└──────────────────────────────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────────┐
│ LAYER 5: SCREENS (Final generated code)                     │
│ • Assembled from blueprint                                    │
│ • Stateless UI first                                          │
│ • API integration points marked                               │
└──────────────────────────────────────────────────────────────┘

# Architecture Review: Atomic vs Pattern-Based vs Blueprint-First

## **1. THREE APPROACHES COMPARISON**

```
ATOMIC DESIGN (Brad Frost)
═══════════════════════════════════════════════════════════════
Atoms → Molecules → Organisms → Templates → Pages

PROBLEMS FOR LLM:
❌ Too many layers (5 levels)
❌ Unclear boundaries (Is UserCard a molecule or organism?)
❌ LLM generates inconsistent classifications
❌ Too much composition overhead
❌ Hard to maintain hierarchy

EXAMPLE CONFUSION:
PropertyCard with image, title, price, badges, button
  → Is it a Molecule? (has multiple atoms)
  → Is it an Organism? (self-contained feature)
  → LLM can't decide consistently
```

```
PATTERN-BASED (v0/Lovable style)
═══════════════════════════════════════════════════════════════
Primitives → Patterns → Screens

STRUCTURE:
Primitives: Button, Input, Badge (from Shadcn)
Patterns: MasterDetail, CardGrid, Wizard (reusable compositions)
Screens: Composed from patterns + domain components

BENEFITS FOR LLM:
✓ Only 3 layers
✓ Clear boundaries
✓ Pattern = Reusable template with slots
✓ LLM picks pattern by use case

EXAMPLE:
"Show property listings"
  → LLM picks: CardGrid pattern
  → Renders: PropertyCard in each slot
  → Result: Consistent structure
```

```
BLUEPRINT-FIRST (Your suggestion)
═══════════════════════════════════════════════════════════════
Intent → Blueprint JSON → Pattern Resolution → Code

STRUCTURE:
1. LLM generates declarative JSON (no code)
2. Engine resolves patterns deterministically
3. Code generator produces final output

BENEFITS:
✓ Separation of concerns (what vs how)
✓ Blueprint is cacheable/reusable
✓ Version control friendly
✓ Can generate for React/RN/Vue from same blueprint
✓ Easier to debug (inspect JSON, not code)

EXAMPLE:
Input: "Property listing for buyers with filters"
  ↓
Blueprint: { patterns: ["FilterBar", "CardGrid"], data: [...] }
  ↓
Output: React Native components
```

---

## **2. HYBRID RECOMMENDATION: Pattern-Based + Blueprint Layer**

```
LAYER 0: DESIGN TOKENS
├─ Colors, spacing, typography
├─ Decision rules for LLM
└─ Platform-agnostic (works for web + mobile)

LAYER 1: PRIMITIVES (Not Generated)
├─ Button, Input, Card, Badge
├─ From UI library (Shadcn/NativeWind)
└─ Catalogued for LLM reference

LAYER 2: DOMAIN COMPONENTS (Generated)
├─ PropertyCard, TransactionTimeline
├─ Business logic embedded
└─ Reusable across screens

LAYER 3: PATTERNS (Generated with Slots)
├─ MasterDetail, Wizard, CardGrid
├─ Composition logic
└─ Accept domain components as children

LAYER 4: BLUEPRINTS (Declarative JSON)
├─ Screen intent + structure
├─ Pattern selection
├─ Data requirements
└─ NO CODE - pure declaration

LAYER 5: SCREENS (Generated from Blueprint)
├─ Assembled by code generator
├─ Uses patterns + domain components
└─ Platform-specific (React vs RN)
```

---

## **3. WHY BLUEPRINT LAYER IS CRUCIAL**

### **Problem Without Blueprints:**
```
USER: "Create property listing screen for buyers"
  ↓
LLM: Generates full React code directly
  ↓
ISSUES:
- Different output each time
- Hard to modify specific parts
- Can't reuse structure
- No separation between "what" and "how"
```

### **Solution With Blueprints:**
```
USER: "Create property listing screen for buyers"
  ↓
LLM: Generates Blueprint JSON (declarative)
  ↓
BENEFITS:
- Same blueprint = Same output
- Can modify JSON without re-prompting
- Reuse blueprint for "seller view" with changes
- Blueprint works for React AND React Native
```

---

## **4. BLUEPRINT STRUCTURE - SIMPLIFIED**

```json
BLUEPRINT ANATOMY:
═══════════════════════════════════════════════════════════════

{
  "screen": "PropertyListing",
  "persona": "buyer",
  
  "data": {
    "fetch": ["properties", "savedSearches"],
    "actions": ["toggleFavorite", "saveSearch"]
  },
  
  "layout": {
    "type": "FullPage",
    "regions": ["header", "filters", "content", "pagination"]
  },
  
  "patterns": [
    {
      "pattern": "FilterBar",
      "region": "filters",
      "fields": ["location", "price", "bhk", "amenities"]
    },
    {
      "pattern": "CardGrid",
      "region": "content",
      "component": "PropertyCard",
      "columns": {"mobile": 1, "tablet": 2, "desktop": 3}
    }
  ],
  
  "states": ["loading", "empty", "error", "success"]
}
```

**Key Point:** Blueprint is **pure data** - no JSX, no styles, no logic

---

## **5. SCREEN ENGINE - THREE-STAGE PROCESS**

```
STAGE 1: BLUEPRINT GENERATION (LLM)
═══════════════════════════════════════════════════════════════
INPUT:
- "Show property listings with filters for buyers"
- Domain: Real estate
- Persona: Buyer
- Available patterns: FilterBar, CardGrid, MasterDetail...

OUTPUT:
- Blueprint JSON (declarative)
- Pattern selection decisions
- Data requirements

LLM PROMPT:
"Given user request and available patterns, generate blueprint JSON.
Select patterns based on use case. Do NOT generate code."
```

```
STAGE 2: PATTERN RESOLUTION (Deterministic Engine)
═══════════════════════════════════════════════════════════════
INPUT:
- Blueprint JSON

PROCESS:
1. Load pattern definitions
2. Validate pattern combinations
3. Resolve data dependencies
4. Build component tree (abstract)

OUTPUT:
- Component tree structure
- Props mapping
- State management plan
- NO CODE YET - still abstract

This stage is NOT AI - it's deterministic rules
```

```
STAGE 3: CODE GENERATION (LLM or Templates)
═══════════════════════════════════════════════════════════════
INPUT:
- Component tree from Stage 2
- Target platform (React vs React Native)

PROCESS:
- Use pattern templates
- Generate imports
- Generate JSX structure
- Generate state hooks
- Generate event handlers

OUTPUT:
- Actual React/RN code
- Ready to run

Can use templates OR LLM for this stage
```

---

## **6. PATTERN DEFINITION - KEY CONCEPT**

```
PATTERN = TEMPLATE WITH SLOTS
═══════════════════════════════════════════════════════════════

Pattern: CardGrid
├─ Structure: Responsive grid layout
├─ Slots:
│  ├─ card (rendered per item)
│  ├─ empty (when no items)
│  └─ error (when fetch fails)
├─ Props:
│  ├─ items (array)
│  ├─ columns (responsive)
│  ├─ gap (spacing)
│  └─ onLoadMore (pagination)
└─ States: loading, empty, error, success

USAGE IN BLUEPRINT:
{
  "pattern": "CardGrid",
  "slot": {
    "card": "PropertyCard"  ← Domain component
  },
  "props": {
    "items": "data.properties",
    "columns": {"mobile": 1, "tablet": 2, "desktop": 3}
  }
}

CODE GENERATION RESULT:
<CardGrid
  items={data.properties}
  columns={{mobile: 1, tablet: 2, desktop: 3}}
  renderCard={(property) => <PropertyCard property={property} />}
/>
```

---

## **7. DOMAIN SCHEMA INTEGRATION**

```
DOMAIN SCHEMA → INFORMS BLUEPRINT
═══════════════════════════════════════════════════════════════

Property Schema:
├─ id, title, price, location
├─ images[], amenities[]
├─ specifications {bedrooms, area, ...}
└─ legal {reraApproved, ...}

LLM USES SCHEMA TO:
1. Select appropriate fields for filters
2. Decide which data to show in cards
3. Generate validation rules
4. Pick UI components (price → currency input)

EXAMPLE:
User: "Filter by price and location"
Schema: Has `price` (number) and `location` (object)
Blueprint: 
{
  "pattern": "FilterBar",
  "fields": [
    {"field": "location", "type": "LocationPicker"},
    {"field": "price", "type": "RangeSlider", "format": "INR"}
  ]
}
```

---

## **8. PERSONA-SPECIFIC BLUEPRINTS**

```
SAME SCREEN, DIFFERENT PERSONAS
═══════════════════════════════════════════════════════════════

Property Listing Screen:

BUYER VIEW:
├─ Filters: Location, Price, BHK, Amenities
├─ Sort: Price, Area, Recent
├─ Actions: Save, Compare, Contact Owner
└─ Shows: Legal status, Price history

SELLER VIEW:
├─ Different filters: Status, Inquiries, Views
├─ Sort: Most viewed, Most inquired
├─ Actions: Edit, Promote, Mark Sold
└─ Shows: Performance metrics, Inquiry count

AGENT VIEW:
├─ Filters: Owner type, Commission, Exclusive
├─ Sort: Commission %, Listing age
├─ Actions: Share with client, Schedule visit
└─ Shows: Owner contact, Commission amount

IMPLEMENTATION:
Base Blueprint + Persona Overrides
{
  "base": "property-listing",
  "persona": "buyer",
  "overrides": {
    "filters": ["location", "price", "bhk"],
    "actions": ["save", "compare", "contact"]
  }
}
```

---

## **9. REACT vs REACT NATIVE - SAME BLUEPRINT**

```
BLUEPRINT (Platform-Agnostic):
═══════════════════════════════════════════════════════════════
{
  "pattern": "CardGrid",
  "component": "PropertyCard",
  "columns": {"mobile": 1, "tablet": 2, "desktop": 3}
}

GENERATES FOR REACT (Web):
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => <PropertyCard key={item.id} {...item} />)}
</div>

GENERATES FOR REACT NATIVE (Mobile):
<FlatList
  data={items}
  numColumns={isTablet ? 2 : 1}
  renderItem={({item}) => <PropertyCard {...item} />}
  columnWrapperStyle={{gap: 16}}
/>

Same blueprint, different output based on platform
```

---

## **10. FORBIDDEN IN BLUEPRINTS (Critical)**

```
BLUEPRINTS MUST NOT CONTAIN:
═══════════════════════════════════════════════════════════════

❌ JSX code
❌ CSS/style objects
❌ Event handler implementations
❌ API endpoints
❌ Business logic
❌ Platform-specific code

BLUEPRINTS ONLY CONTAIN:
═══════════════════════════════════════════════════════════════

✓ Pattern selections
✓ Data requirements (what, not how)
✓ Component references (names only)
✓ Layout structure (declarative)
✓ State definitions (types only)
✓ Conditional rules (high-level)

WHY?
- Blueprint = "WHAT" to build
- Code Generator = "HOW" to build it
- Separation enables reusability & consistency
```

---

## **11. DECISION FRAMEWORK**

```
WHEN TO USE WHICH APPROACH:
═══════════════════════════════════════════════════════════════

Use ATOMIC DESIGN when:
❌ Never (too complex for LLM)

Use PATTERN-BASED when:
✓ Building single screen
✓ Need quick iteration
✓ Don't need multi-platform
✓ Simple apps (5-10 screens)

Use BLUEPRINT-FIRST when:
✓ Building entire app (50+ screens)
✓ Need multi-platform (web + mobile)
✓ Multiple personas with variants
✓ Need blueprint reusability
✓ Team collaboration (designers create blueprints)
✓ Want version control for UI structure
```

---

## **12. FINAL RECOMMENDATION FOR PROPMUBI**

```
ARCHITECTURE: Pattern-Based + Blueprint Layer
═══════════════════════════════════════════════════════════════

LAYER STACK:
0. Design Tokens (colors, spacing, etc.)
1. Primitives (Button, Input - from NativeWind)
2. Domain Components (PropertyCard, TransactionCard)
3. Patterns (CardGrid, MasterDetail, Wizard)
4. Blueprints (JSON definitions per persona)
5. Generated Screens (from blueprints)



PRIMITIVES: Use NativeWind + React Native
   → Don't build from scratch
   → Use proven libraries

2. PATTERNS: Build 5 custom patterns
   → CardGrid, MasterDetail, Wizard, FilterBar, FormLayout
   → Enough to cover 80% of screens

3. BLUEPRINTS: Simple JSON format
   → Screen name, persona, sections
   → No complex nesting

4. GENERATION: 3-step process
   → Blueprint → Pattern mapping → Code
   → Keep it simple

5. ITERATION: Start with 1 persona
   → Buyer persona first
   → 5 screens
   → Then expand to others

DON'T OVERCOMPLICATE:
✗ Don't build your own component library
✗ Don't create 50 patterns
✗ Don't make complex blueprint schema
✗ Don't try to support every use case
✓ Start simple, add complexity only when needed

TURBO MODULE = Native code exposed to JavaScript
═══════════════════════════════════════════════════════════════

Purpose: Call native Swift/Kotlin from React hooks

Example Use Cases:
├─ Camera access
├─ Biometric authentication
├─ File system operations
├─ Bluetooth/NFC
├─ Native animations
├─ Background tasks
└─ Device APIs (battery, sensors, etc.)

3. REACT HOOKS → NATIVE BINDING PATTERN
Architecture:
REACT COMPONENT (UI)
    ↓ uses hook
CUSTOM REACT HOOK (useCamera, useBiometrics)
    ↓ calls
TURBO MODULE (NativeCameraModule)
    ↓ invokes
NATIVE CODE (Swift/Kotlin)
    ↓ returns
REACT HOOK (updates state)
    ↓ triggers
REACT COMPONENT (re-renders)


PROPMUBI NATIVE MODULES:
═══════════════════════════════════════════════════════════════

1. useCamera()
   ├─ Take property photos
   ├─ Document scanning
   └─ Video tours

2. useLocation()
   ├─ Get current location
   ├─ Track site visit routes
   └─ Geofencing alerts

3. useBiometrics()
   ├─ Fingerprint login
   ├─ Face ID authentication
   └─ Transaction authorization

4. useDocumentScanner()
   ├─ Scan legal documents
   ├─ Extract text (OCR)
   └─ Detect document boundaries

5. useFileSystem()
   ├─ Download property documents
   ├─ Cache images
   └─ Manage offline data

6. useContacts()
   ├─ Import buyer/seller contacts
   ├─ Share property listings
   └─ Schedule appointments

7. useCalendar()
   ├─ Schedule site visits
   ├─ Booking reminders
   └─ Transaction deadlines

8. usePayments()
   ├─ UPI integration
   ├─ Payment gateway
   └─ EMI calculator

9. useMap()
   ├─ Render property locations
   ├─ Satellite imagery
   └─ Navigation integration

10. useNotifications()
    ├─ Push notifications
    ├─ Local reminders
    └─ Background updates
```

---

## **6. EXISTING LIBRARIES (DON'T BUILD FROM SCRATCH)**
```
USE THESE INSTEAD OF CUSTOM TURBO MODULES:
═══════════════════════════════════════════════════════════════

1. CAMERA
   └─ react-native-vision-camera (recommended)
   └─ Turbo Module enabled, modern API

2. LOCATION
   └─ @react-native-community/geolocation
   └─ react-native-geolocation-service

3. BIOMETRICS
   └─ react-native-biometrics
   └─ expo-local-authentication

4. FILE SYSTEM
   └─ react-native-fs
   └─ expo-file-system

5. CAMERA + DOCUMENT SCANNING
   └─ react-native-document-scanner-plugin
   └─ react-native-vision-camera + ML Kit

6. PAYMENTS
   └─ react-native-razorpay (India)
   └─ @razorpay/react-native-customui

7. MAPS
   └─ react-native-maps
   └─ @rnmapbox/maps (Mapbox)

8. CONTACTS
   └─ react-native-contacts

9. CALENDAR
   └─ react-native-calendar-events

10. NOTIFICATIONS
    └─ @notifee/react-native
    └─ @react-native-firebase/messaging
```
EXPO MODULES = Simplified Turbo Modules
═══════════════════════════════════════════════════════════════

BENEFITS:
✓ Easier to write than raw Turbo Modules
✓ TypeScript first
✓ Better developer experience
✓ Works with Expo + bare React Native
✓ Automatic codegen