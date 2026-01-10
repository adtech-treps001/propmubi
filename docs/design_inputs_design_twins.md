Excellent — now we’re at the **core spatial truth layer**:
**floor types repeat**, **flat stacks repeat**, **towers map to GeoJSON**, and **2D plans must become a navigable 3D digital twin (Matterport-like)**.

Below is a **complete, end-to-end workflow** that is **tool-agnostic**, **LLM-compatible**, and **production-ready** — from brochure → floor types → unit stacks → GeoJSON → 3D twin.

This is the **authoritative pipeline** you can hand to engineering + AI teams.

---

# 🧠 MASTER WORKFLOW

## Brochure → Floor Types → Towers → GeoJSON → 3D Digital Twin

---

## 🧩 CONCEPTUAL FOUNDATION (IMPORTANT)

> **Buildings are not collections of flats.
> They are repetitions of patterns.**

So the system must model:

* **FloorType** (repeating layout)
* **FlatType / StackType** (vertical repetition)
* **TowerInstance** (placement + rotation)
* **GeoTruth** (exact footprint & orientation)

---

# 1️⃣ FLOOR TYPE & FLAT TYPE NORMALIZATION

### 🎯 Goal

Avoid duplicating data for every floor and flat.

---

## A. Detect FLOOR TYPES (LLM + Vision)

### Input

* Floor plan images (from brochure or CAD)
* Typical “Floor Plan” pages

### LLM Vision Task

```text
Identify unique floor layouts.
Group floors that have identical room topology, dimensions, and circulation.
Assign a FLOOR_TYPE_ID.
```

### Output

```json
{
  "floorTypeId": "FT_A",
  "layoutSignature": "2BHK-915-2LIFT",
  "repeatsOnFloors": [1,2,3,4,5,6,7,8,9,10]
}
```

📌 **Rule**

* If plumbing shafts, wall positions, or balcony shapes differ → new FloorType

---

## B. Detect FLAT / STACK TYPES (Vertical Logic)

A **FlatType** = same unit position repeated vertically.

```json
{
  "flatTypeId": "STK_01",
  "position": "North-East Corner",
  "facing": "East",
  "floorType": "FT_A",
  "repeatsOnFloors": [3..22]
}
```

📌 This enables:

* Stack comparison
* View analysis
* Light / wind modeling

---

# 2️⃣ PAN IMAGE → DIMENSION EXTRACTION (2D SURVEY)

This is the **most critical step**.

---

## A. TOOLS (PRACTICAL & REAL)

### Option 1: Semi-Automated (Recommended)

* **OpenCV + Line Detection**
* **LLM Vision (GPT-Vision / Gemini Vision)**
* **Human correction**

### Option 2: Professional Grade

* AutoCAD / Revit import (if available)
* Surveyor CAD overlay

---

## B. WORKFLOW

### Step 1: Detect Scale

```text
Find scale text: “1 cm = 1 m” or dimension markers (e.g., 12'-6")
If missing → mark scale UNKNOWN and require human input
```

---

### Step 2: Wall & Boundary Detection

* Detect thick lines → walls
* Thin lines → doors/windows
* Dashed → balconies / utility

---

### Step 3: Dimension Extraction

```json
{
  "room": "Bedroom1",
  "length_ft": 12.5,
  "width_ft": 10.0,
  "area_sqft": 125
}
```

Mapped to:
📄 `ROOM_SURVEY_SCHEMA.toon`

---

### Step 4: Validate Against Area Statement

```text
Sum(room areas) ≈ Carpet Area ± tolerance (3–5%)
If mismatch → flag for review
```

---

# 3️⃣ GEOJSON: ALL TOWERS MAPPING (SITE TRUTH)

---

## A. INPUT

* Master layout image
* Satellite image
* Optional: CAD / Survey sketch

---

## B. PROCESS

### Step 1: Site Boundary Polygon

```json
Feature(type="SITE")
```

### Step 2: Tower Footprints (CRITICAL)

Each tower is a polygon with:

* Rotation
* Orientation
* Offset

```json
{
  "type": "Feature",
  "properties": {
    "towerId": "T3",
    "rotationDeg": 15,
    "floors": 22
  },
  "geometry": {
    "type": "Polygon",
    "coordinates": [...]
  }
}
```

📄 Uses: `GEOJSON_SCHEMA.toon`

---

### Step 3: Tower → Floor → Flat Binding

```json
{
  "towerId": "T3",
  "usesFloorTypes": ["FT_A", "FT_B"],
  "stackMap": ["STK_01", "STK_02", "STK_03"]
}
```

This is how **Geo + Floor logic merge**.

---

# 4️⃣ 3D DIGITAL TWIN (MATTERPORT-LIKE)

> You are NOT rebuilding Matterport.
> You are building a **truth-first architectural twin**.

---

## A. GEOMETRY GENERATION

### Input

* FloorType layouts
* Room dimensions
* Wall thickness
* GeoJSON tower footprint

### Output

* Parametric 3D mesh (Three.js / Babylon.js)

---

## B. LOD (Level of Detail)

| Level | Use                 |
| ----- | ------------------- |
| LOD0  | Site + towers       |
| LOD1  | Floor slabs         |
| LOD2  | Walls + rooms       |
| LOD3  | Doors/windows       |
| LOD4  | Finishes (optional) |

---

## C. TEXTURE STRATEGY

* Use **finish schemas** (tiles, paint)
* Generic textures (not marketing renders)
* Tag as *“Representative”*

---

## D. NAVIGATION (Matterport-like)

* Fly view (site)
* Enter tower
* Select floor
* Enter flat
* Walk room-to-room

---

## E. DATA-DRIVEN OVERLAYS

* Light simulation
* Ventilation arrows
* Noise heatmap
* Vastu compass
* Structural x-ray

All driven by:

* Orientation
* GeoJSON
* StackType

---

# 5️⃣ RE-SURVEY & VERIFICATION LOOP (VERY IMPORTANT)

> Brochure ≠ Reality

---

## A. On-Site Survey Upload

* Mobile LiDAR (iPhone / Android)
* Manual measurement
* Photos

---

## B. SCHEMA DIFFING

```json
{
  "brochureCarpet": 915,
  "surveyCarpet": 902,
  "difference": -13,
  "status": "MINOR_VARIATION"
}
```

Shown in UX as:

> “Measured carpet area is 1.4% lower than brochure.”

---

# 6️⃣ FINAL DATA MODEL (AUTHORITATIVE)

```
Property
 ├── GeoJSON (Site + Towers)
 ├── FloorTypes
 │    ├── RoomGeometry
 │    ├── Plumbing
 │    ├── Electrical
 ├── FlatTypes (Stacks)
 │    ├── Orientation
 │    ├── Views
 ├── Towers
 │    ├── Rotation
 │    ├── Floor Mapping
 ├── Inventory (Units)
 ├── Survey Reports
 └── Digital Twin (3D)
```

---

# 7️⃣ HOW UX USES THIS (NO OVERLOAD)

* User sees **one flat**
* System knows:

  * Stack quality
  * Floor repetition
  * View future impact
* User never sees raw complexity

---

# 🧠 KEY PRINCIPLES (DO NOT BREAK)

1. FloorType ≠ Floor
2. FlatType ≠ Flat
3. GeoJSON is the anchor
4. 3D is derived, not designed
5. Survey beats brochure
6. Everything schema-bound

---

# 🔜 NEXT LEVEL (OPTIONAL BUT POWERFUL)

1. **Automated sunlight & wind simulation**
2. **Construction progress overlay**
3. **LiDAR + BIM merge**
4. **Time-travel twin (before/after infra)**
5. **Regulatory digital audit**

If you want, next I can:

* Provide **exact API contracts**
* Define **3D engine stack**
* Create **LLM vision prompts**
* Design **survey mobile app UX**

Say the next step — you now have a full Digital Twin backbone.



Perfect. This is a **pure systems + geometry + physics workflow**.
Below is a **complete, implementable pipeline** to do **automated sunlight + wind simulation** using **GeoJSON + floor/flat data + window/balcony positions** — no guesswork, no BIM dependency.

This is how you do it **at scale for Indian real estate**.

---

# 🌞🌬 AUTOMATED SUNLIGHT & WIND SIMULATION

## From GeoJSON → FloorType → FlatType → Room

---

## 🎯 DESIGN GOALS

1. **No manual setup per project**
2. **Purely data-driven**
3. **Explains results to buyers (not engineers)**
4. **Works for apartments, villas, plots**
5. **Fast enough for real-time UX**

---

# 🧠 INPUT DATA (NON-NEGOTIABLE)

You already have these — that’s why this works.

---

## 1️⃣ GEOJSON (SITE + TOWERS)

```json
{
  "towerId": "T3",
  "geometry": { "type": "Polygon", "coordinates": [...] },
  "rotationDeg": 15,
  "heightMeters": 72
}
```

Used for:

* Shadow casting
* Wind obstruction
* Orientation

---

## 2️⃣ FLOOR TYPE & FLAT TYPE

```json
{
  "flatTypeId": "STK_01",
  "facing": "East",
  "floorRange": [3,22],
  "floorType": "FT_A"
}
```

Used for:

* Repetition logic
* Vertical airflow
* Light consistency

---

## 3️⃣ ROOM + OPENINGS (CRITICAL)

```json
{
  "room": "Living",
  "windows": [
    {
      "wall": "East",
      "width": 6,
      "height": 4,
      "sillHeight": 3
    }
  ],
  "balcony": {
    "direction": "East",
    "depth": 5
  }
}
```

Used for:

* Direct light
* Cross ventilation
* Heat gain

---

# 🌞 PART A: SUNLIGHT SIMULATION (AUTOMATED)

---

## A1️⃣ SOLAR POSITION ENGINE

Use **astronomical math**, not APIs.

### Inputs

* Latitude / Longitude (from GeoJSON)
* Date
* Time (hourly resolution)

### Compute

* Solar azimuth
* Solar altitude

👉 Standard NOAA / SPA equations
(Implement once, reuse everywhere)

---

## A2️⃣ RAY CASTING (CORE LOGIC)

For each **tower + floor + flat**:

1. Generate sun rays from azimuth + altitude
2. Ray intersects:

   * Other towers
   * Same tower slabs
   * Balcony projections
3. If blocked → shade
4. If hits window plane → light entry

```text
Sun → Tower obstruction → Window → Room
```

---

## A3️⃣ ROOM-LEVEL LIGHT SCORE

For each room:

```json
{
  "room": "Living",
  "directSunlightHours": 2.5,
  "indirectLight": "High",
  "morningSun": true,
  "afternoonHeat": false
}
```

---

## A4️⃣ BUYER-FRIENDLY OUTPUT

Convert physics → human language:

> “Living room receives morning sunlight between 8:30–11:00 AM.
> Bedrooms remain shaded in the afternoon, reducing heat.”

---

## A5️⃣ VISUAL OVERLAY (UX)

* Sun path arc
* Brightness gradient on rooms
* Shadow movement animation (optional)

---

# 🌬 PART B: WIND FLOW SIMULATION (AUTOMATED)

> This is **not CFD** — it’s **practical airflow modeling** suitable for real estate decisions.

---

## B1️⃣ WIND SOURCE DATA (INDIA)

Use **directional wind roses** (seasonal averages):

* Summer (SW → NE)
* Monsoon (SW strong)
* Winter (NE → SW)

Store as **monthly vectors** per city.

```json
{
  "month": "May",
  "prevailingWind": {
    "direction": "SW",
    "speed": "Moderate"
  }
}
```

---

## B2️⃣ SITE OBSTRUCTION MODEL

From GeoJSON:

* Towers = solid blocks
* Open areas = low resistance
* Roads = wind corridors

Each polygon gets a **drag coefficient**.

---

## B3️⃣ FLAT-LEVEL AIRFLOW LOGIC

For each flat:

1. Identify wind-facing openings
2. Identify opposite openings (cross ventilation)
3. Check obstruction in wind direction
4. Compute airflow potential

```json
{
  "crossVentilation": true,
  "windEntry": "Living Balcony",
  "exit": "Bedroom Window",
  "efficiency": "High"
}
```

---

## B4️⃣ STACK EFFECT (VERTICAL)

Higher floors:

* More wind speed
* Less obstruction
* Better airflow

Apply **floor height multiplier**.

---

## B5️⃣ ROOM-LEVEL OUTPUT

```json
{
  "room": "Bedroom",
  "airflow": "Moderate",
  "stagnationRisk": false
}
```

---

## B6️⃣ BUYER LANGUAGE OUTPUT

> “Cross ventilation is effective during summer winds.
> Bedrooms receive continuous airflow from balcony-facing living area.”

---

# 🧭 PART C: COMPASS + BALCONY + WINDOW LOGIC

---

## C1️⃣ TRUE NORTH CALCULATION

* Use GeoJSON orientation
* Apply tower rotation
* Normalize all rooms to compass directions

```json
{
  "windowFacing": "East-North-East"
}
```

---

## C2️⃣ BALCONY IMPACT

Balcony depth:

* Reduces direct sun
* Increases airflow buffer
* Acts as thermal shield

This modifies:

* Sun penetration
* Wind velocity

---

# 🧮 PART D: SCORING ENGINE (FAST & UX-FRIENDLY)

Each flat gets:

```json
{
  "sunlightScore": 82,
  "ventilationScore": 76,
  "heatComfort": "Good",
  "daylightQuality": "High"
}
```

Scores are **relative within project**, not absolute.

---

# 🧠 PART E: UX INTEGRATION (NO OVERLOAD)

### Toggle Layers

* ☀️ Sunlight
* 🌬 Wind
* 🧭 Direction

### Progressive Detail

* Default: Simple explanation
* Tap → Hour-by-hour view
* Tap → Room-level details

---

# ⚙️ PERFORMANCE STRATEGY (IMPORTANT)

* Precompute:

  * Sun paths per project
  * Wind vectors per season
* Cache by:

  * FloorType
  * StackType
* Apply deltas per floor

This allows:

* Instant UX
* Mobile-friendly

---

# 🧪 VALIDATION (REALITY CHECK)

### Compare with:

* Site videos
* Resident feedback
* Surveyor notes

Store confidence level:

```json
"confidence": "SIMULATED | VERIFIED"
```

---

# 🧠 FINAL SYSTEM ARCHITECTURE

```
GeoJSON
  ↓
Orientation Engine
  ↓
Sun & Wind Engines
  ↓
Room-level Scores
  ↓
Human Language Layer
  ↓
UX Overlays
```

---

# 🚫 WHAT WE ARE NOT DOING (BY DESIGN)

* ❌ Full CFD (too slow, overkill)
* ❌ Marketing claims
* ❌ Generic “East-facing good” rules
* ❌ Static screenshots

---

# 🏁 WHAT YOU NOW HAVE

You now own:
✅ Automated sunlight modeling
✅ Automated wind modeling
✅ Room-level comfort insights
✅ Scalable across thousands of units
✅ Explainable to Indian buyers

This is **rare**, **defensible**, and **very hard to copy**.

---

## 🔜 NEXT OPTIONS (PICK ONE)

1. **Code-level math & algorithms**
2. **3D engine (Three.js/Babylon) wiring**
3. **UX animation patterns**
4. **Mobile performance optimization**
5. **Resident feedback calibration loop**

Say the next step — we’re deep into *digital twin territory* now.


Great — this is the **micro-geometry layer** that turns a flat from *“rooms”* into *“usable life zones”*.
Below is a **complete, deterministic workflow** to **mark every wall and sub-area** (TV wall, wardrobe bay, kitchen counter wall, pooja niche, study wall, utility, etc.) and carry it cleanly from **2D plan → 3D digital twin → UX**.

This fits **exactly** into everything you’ve already built.

---

# 🧠 WALL & AREA MARKING SYSTEM

## Room → Wall → Functional Zones (India-First)

---

## 🎯 CORE PRINCIPLE

> **Rooms are too coarse.
> Walls and edges decide how people actually live.**

So the system must model:

* Walls as **first-class objects**
* Areas as **functional zones**
* Markings as **repeatable, comparable, and explorable**

---

# 1️⃣ CANONICAL HIERARCHY (DO NOT BREAK)

```
Property
 └── Tower
     └── FloorType
         └── FlatType
             └── Room
                 └── Wall
                     └── FunctionalArea
```

Walls belong to rooms.
Functional areas belong to walls or floor patches.

---

# 2️⃣ WALL IDENTIFICATION (AUTOMATED + ASSISTED)

## A. WALL EXTRACTION (FROM PLAN IMAGE)

### Input

* Floor plan image (PNG/JPG/PDF)
* Scale known or calibrated

### Process

* Detect wall centerlines (OpenCV + Vision)
* Convert to wall segments with:

  * Start point
  * End point
  * Thickness
  * Orientation (N/E/S/W)

### Output

```json
{
  "wallId": "W_LIV_01",
  "room": "Living",
  "orientation": "North",
  "length_ft": 14.2,
  "thickness_mm": 200
}
```

Mapped into:
📄 `ROOM_SURVEY_SCHEMA.toon` (extended)

---

## B. WALL NORMALIZATION

Every room gets **named walls**, not arbitrary IDs:

| Room    | Wall Naming Rule            |
| ------- | --------------------------- |
| Living  | North / South / East / West |
| Bedroom | Entry Wall / Window Wall    |
| Kitchen | Counter Wall / Utility Wall |
| Bath    | Wet Wall / Dry Wall         |

---

# 3️⃣ FUNCTIONAL AREA TAXONOMY (INDIA-REAL)

> **This list is finite and reusable** — crucial for UX + AI.

---

## 🧱 WALL-BASED FUNCTIONAL AREAS

### Living / Dining

* Entertainment / TV wall
* Sofa back wall
* Display / crockery wall
* Pooja niche wall
* Accent wall

### Bedroom

* Wardrobe wall
* Bed headboard wall
* Study / work wall
* Mirror / dresser wall

### Kitchen

* Cooking counter wall
* Hob & chimney wall
* Sink wall
* Refrigerator bay
* Tall unit wall

### Utility / Balcony

* Washing machine bay
* Drying area wall
* Storage niche

---

## 🧱 FLOOR-BASED AREAS

* Dining table zone
* Sofa seating zone
* Bed clearance zone
* Circulation zone
* Play area
* Work desk zone

---

# 4️⃣ FUNCTIONAL AREA MARKING (HOW IT’S DONE)

## A. AUTOMATED SUGGESTION (LLM + RULES)

Example prompt:

```text
Given a living room with dimensions 16x12 ft,
window on East wall,
entry from South wall,
suggest likely TV wall, sofa wall, and circulation.
```

Output:

```json
{
  "entertainmentWall": "West",
  "sofaWall": "East",
  "circulationClearance": "South"
}
```

---

## B. HUMAN CONFIRMATION (IMPORTANT)

UX:

* Click wall → Suggested use
* Drag / resize area
* Accept / override

This prevents hallucination.

---

# 5️⃣ FUNCTIONAL AREA SCHEMA (KEY)

📄 **New Schema (Recommended): `FUNCTIONAL_AREA_SCHEMA`**

```json
{
  "areaId": "FA_LIV_TV",
  "room": "Living",
  "wallId": "W_LIV_WEST",
  "type": "ENTERTAINMENT_WALL",
  "width_ft": 6,
  "height_ft": 8,
  "supports": ["TV", "Soundbar"],
  "notes": "No direct sunlight glare"
}
```

---

## CLOTH BAY / WARDROBE EXAMPLE

```json
{
  "areaId": "FA_BED_WRD_01",
  "room": "MasterBedroom",
  "wallId": "W_MB_NORTH",
  "type": "WARDROBE_BAY",
  "width_ft": 7,
  "depth_ft": 2,
  "slidingDoorClearance": true
}
```

---

# 6️⃣ RULE VALIDATION ENGINE (CRITICAL)

Each functional area passes through rules:

### Example: TV Wall

* ❌ Window behind TV
* ❌ Direct west sun glare
* ✅ Power outlet proximity
* ✅ Wall width ≥ TV + clearance

### Example: Wardrobe

* Depth ≥ 2 ft
* Door swing clearance
* No structural beam conflict

Failures are **shown, not hidden**.

---

# 7️⃣ 3D DIGITAL TWIN MAPPING

Every wall becomes a **mesh plane**.

Functional areas become **overlay regions**:

* Semi-transparent panels
* Icon-based labels
* Toggle ON/OFF

Example:

* 🎬 Entertainment wall highlighted
* 👚 Wardrobe bay highlighted

---

# 8️⃣ UX EXPERIENCE (NO CLUTTER)

### Default View

* Room only

### Tap → “Use This Space”

* Shows functional overlays

### Tap → “Customize”

* Interior service suggestions
* Modular sizing

---

# 9️⃣ COMPARISON & STACK LOGIC

Because wall marking is tied to **FlatType**, you can now:

* Compare **same stack** across floors
* Compare **2BHK vs 3BHK usability**
* Answer:

  > “Which flat has the best TV wall?”

This is **impossible** in normal listings.

---

# 🔁 RE-SURVEY & REALITY CHECK

On-site survey:

* Confirms wall lengths
* Confirms beam drops
* Updates wall schema

Differences flagged:

```json
{
  "area": "WARDROBE_BAY",
  "brochureWidth": 7,
  "surveyWidth": 6.5,
  "impact": "Minor"
}
```

---

# 🧠 HOW THIS FEEDS OTHER SYSTEMS

| System             | Benefit              |
| ------------------ | -------------------- |
| Interior services  | Exact scope          |
| AR furniture       | Precise placement    |
| Buyer confidence   | “Will my sofa fit?”  |
| Rental readiness   | Furnishability score |
| AI recommendations | Context-aware        |

---

# 🏁 FINAL MENTAL MODEL

```
Wall = Constraint
Area = Possibility
Rules = Reality
UX = Confidence
```

---

## 🔜 NEXT (HIGH-VALUE EXTENSIONS)

1. **Furniture auto-placement**
2. **AR view from phone**
3. **Interior cost estimation**
4. **Tenant readiness scoring**
5. **Accessibility & elderly suitability**

Say which one you want next — this layer unlocks *huge* downstream value.


Perfect. This is a **global UX + system rule**, not a feature.
Below is a **clean, enforceable specification** you can plug directly into your **design system, frontend, backend, and LLM orchestration**.

I’ll structure it so it becomes:

* a **non-negotiable UI contract**
* an **LLM behavior rule**
* a **search + AI architecture blueprint**

---

# 🧠 GLOBAL UX RULE

## Universal Search + AI Intelligence Layer

> **Every view. Every page. Every mode.
> There is always one intelligent entry point at the top.**

---

# 1️⃣ GLOBAL TOP SEARCH BAR (ALWAYS PRESENT)

## 📌 POSITION & BEHAVIOR

* Fixed at top (safe area aware)
* Never hidden
* Same component across:

  * Listing
  * Digital Twin
  * Interior design
  * Documents
  * Comparison
  * Agent / services
* Context-aware, not page-aware

---

## 🧩 COMPONENT: `GlobalSmartSearch`

### Visual Structure

```
┌──────────────────────────────────────────┐
│ 🔍 Search properties, rooms, documents… │
│ [ Filters ] [ Ask AI ] [ Saved ]         │
└──────────────────────────────────────────┘
```

---

# 2️⃣ SEARCH INPUT MODES (AUTO-DETECTED)

### 🧠 MODE 1: KEYWORD / FILTER SEARCH (Elastic)

Triggered when:

* User types short phrases
* Uses filters

Examples:

* `3 BHK east facing`
* `Wardrobe width > 6 ft`
* `Flats with morning sunlight`

➡️ Routed to **ElasticSearch**

---

### 🧠 MODE 2: AI / CONVERSATIONAL SEARCH (RAG + LLM)

Triggered when:

* Full sentence
* Question
* “Explain / Compare / Suggest”

Examples:

* *“Which flat has best airflow for summers?”*
* *“Show me problems in this tower”*
* *“Design wardrobe for kids room”*

➡️ Routed to **RAG + LLM**

---

## 🧠 MODE SWITCHING (INVISIBLE TO USER)

```ts
if (query.length < N && no_question_mark) {
  mode = ELASTIC
} else {
  mode = AI
}
```

User never chooses mode explicitly.

---

# 3️⃣ SEARCH ARCHITECTURE (SYSTEM VIEW)

```
UI Search Bar
   ↓
Query Router
   ├── ElasticSearch (Structured)
   ├── Vector DB (Embeddings)
   ├── MCP Tools (Geo, Design, Docs)
   ↓
RAG Assembly
   ↓
LLM
   ↓
Structured + Conversational Response
```

---

# 4️⃣ ELASTIC SEARCH (STRUCTURED LISTING)

## Indexed Data (Examples)

* Properties
* Towers
* FloorTypes
* FlatTypes
* Rooms
* Walls
* Functional Areas
* Documents
* Services

### Result Output

* Fast
* Sortable
* Filterable
* Paginated

---

# 5️⃣ AI SEARCH (RAG + MCP + LLM)

## RAG SOURCES (STRICT)

* Structured schemas (truth)
* Extracted brochure data
* Survey reports
* Design decisions
* User selections
* Rules engine outputs

❌ Never web search
❌ Never hallucinate

---

## MCP TOOL LAYER (IMPORTANT)

LLM does **not reason blindly**.

It calls tools:

* `getSunlightScore(flatId)`
* `getVentilationScore(flatId)`
* `getWardrobeDesign(areaId)`
* `getDocumentSummary(docId)`
* `compareStacks(stackA, stackB)`

LLM = **Orchestrator**, not calculator.

---

# 6️⃣ RESPONSE PRESENTATION RULES

## 🔀 HORIZONTAL vs VERTICAL (STRICT)

### 📸 IMAGE-FIRST RESULTS → HORIZONTAL SCROLL

Use when:

* Properties
* Flats
* Towers
* Interior designs
* Floor plans

```
[ Card ][ Card ][ Card ] → →
```

---

### 🧾 TEXT / DATA-FIRST → VERTICAL LIST

Use when:

* Documents
* Issues
* Comparisons
* Explanations
* Logs

```
• Item
• Item
• Item
```

---

## 🧠 MIXED RESULTS (COMMON)

AI decides layout per section:

```
Answer Summary (text)

Recommended Flats (horizontal)

Why these work (text)

Documents to verify (vertical)
```

---

# 7️⃣ CONTEXT-AWARE SEARCH (CRITICAL)

Search always knows:

```json
{
  "currentProperty": "PROP123",
  "currentRoom": "MasterBedroom",
  "currentArea": "WardrobeBay",
  "persona": "Family",
  "tier": "ConfidentBuyer"
}
```

So:

* “design this” → wardrobe
* “compare” → nearby stacks
* “issues” → legal / survey flags

---

# 8️⃣ FILTERS (AI + MANUAL HYBRID)

### Manual Filters

* Price
* Facing
* Floor
* Tower
* Availability

### AI Filters (Suggested)

* Best for kids
* Low heat
* High rental yield
* Easy furnishing

AI explains filters:

> “Filtered for flats with morning sunlight and cross ventilation.”

---

# 9️⃣ CONVERSATION CONTINUITY (VERY IMPORTANT)

Search is **stateful**.

User can say:

* “Why?”
* “Show alternatives”
* “What about higher floor?”
* “Design it”

Without repeating context.

---

# 🔒 NON-NEGOTIABLE RULES

1. Search bar always visible
2. One search system, many answers
3. Elastic for facts, LLM for meaning
4. MCP tools before reasoning
5. Horizontal = visual, Vertical = textual
6. No hallucinated data
7. Explain before recommend

---

# 🧠 LLM SYSTEM PROMPT (SEARCH AGENT)

```text
You are the global search and reasoning agent.

Rules:
- Always respect current context.
- Use tools before reasoning.
- Prefer structured data over language.
- Present visual results horizontally.
- Present explanations vertically.
- If unsure, ask a clarifying question.
```

---

# 🏁 WHAT THIS GIVES YOU

* One mental model for users
* One search muscle memory
* Infinite extensibility
* Zero UI inconsistency
* True conversational UX

This is **exactly how modern AI-native products should feel**.

---

## 🔜 NEXT (HIGH IMPACT OPTIONS)

1. **Search ranking logic**
2. **Vector schema design**
3. **MCP tool registry**
4. **Latency optimization**
5. **Offline / cache strategy**

Say the next one — this layer ties everything together.

Perfect. What you’re describing is **the correct AI behavior** for a serious decision system:

> ❌ Don’t ask everything
> ❌ Don’t load everything
> ✅ Ask **only what is needed, when it’s needed**

Below is a **precise, enforceable design** for **Persona-Aware AI Filters with Contextual Questioning** that plugs directly into your **Global Search + RAG + MCP system**.

This is not UX fluff — this is **control logic**.

---

# 🧠 PERSONA-AWARE AI FILTERING

## Progressive Context, Never All at Once

---

## 🔑 CORE RULE (NON-NEGOTIABLE)

> **AI must never apply a filter without understanding the user’s intent depth.**
>
> Filters are **activated by questions**, not assumptions.

---

# 1️⃣ PERSONA FILTER ENGINE (HIGH LEVEL)

### Inputs AI Always Has

```json
{
  "persona": "FAMILY | INVESTOR | SENIOR | SINGLE | OFFICE_GOER",
  "journeyStage": "DISCOVERY | EVALUATION | DECISION",
  "currentContext": {
    "propertyId": "PROP123",
    "room": "Living",
    "area": null
  }
}
```

### Inputs AI Does NOT Assume

* Beliefs (Vastu, Feng Shui)
* Budget sensitivity
* Cultural priorities
* Risk tolerance

These are **asked, not guessed**.

---

# 2️⃣ FILTER ACTIVATION IS QUESTION-DRIVEN

## ❌ BAD (What most apps do)

> “Showing Vastu-compliant flats”

## ✅ CORRECT (Your system)

> “Do you want to consider Vastu aspects for this property?”

Only after **explicit confirmation**, filters activate.

---

# 3️⃣ CONTEXTUAL QUESTIONING PATTERN (IMPORTANT)

> **Ask the smallest possible question that unlocks the next decision.**

---

## 🧭 EXAMPLE 1: VASTU FILTER (CORRECT FLOW)

### User types:

> “Show me Vastu-good flats”

### AI RESPONSE (STEP 1 – Clarify scope)

> “Sure. Which Vastu guidance would you like to follow?”

Options (chips, not text):

* ⬜ Traditional Vastu (directions & elements)
* ⬜ Entry & Kitchen focused
* ⬜ Bedroom & Sleep comfort
* ⬜ Just avoid major defects

⬜ *Skip Vastu*

---

### STEP 2 – Ask ONLY what matters next

If user selects **Traditional Vastu**:

> “Which areas should I prioritize?”

* ⬜ Main door
* ⬜ Kitchen
* ⬜ Master bedroom
* ⬜ Entire flat

---

### STEP 3 – APPLY FILTER

Now AI applies:

* Compass orientation
* Door/kitchen placement
* Excludes only violating units

And explains:

> “Filtered 6 flats that meet your selected Vastu preferences.”

---

## 🚫 WHAT AI MUST NOT DO

* Assume “East facing = good”
* Apply all Vastu rules blindly
* Exclude units silently

---

# 4️⃣ PERSONA-SPECIFIC QUESTION TEMPLATES

## 👨‍👩‍👧 FAMILY PERSONA

Trigger: *“Which flat is best for kids?”*

AI asks:

1. Age group?

   * ⬜ Toddlers
   * ⬜ School-going
   * ⬜ Teenagers

2. Priority?

   * ⬜ Safety
   * ⬜ Play area
   * ⬜ Schools nearby

👉 Stops after 2 questions.

---

## 💼 INVESTOR PERSONA

Trigger: *“Best ROI flats?”*

AI asks:

1. Goal?

   * ⬜ Rental yield
   * ⬜ Price appreciation
   * ⬜ Quick resale

2. Holding period?

   * ⬜ <3 years
   * ⬜ 3–7 years
   * ⬜ Long term

---

## 🧓 SENIOR PERSONA

Trigger: *“Comfortable flat”*

AI asks:

1. Mobility needs?

   * ⬜ Lift priority
   * ⬜ Minimal steps
   * ⬜ Close to medical

---

# 5️⃣ FILTER APPLICATION PIPELINE (STRICT)

```
User Intent
   ↓
Clarifying Question
   ↓
Explicit Selection
   ↓
Filter Activation
   ↓
Explain Applied Filters
```

No step can be skipped.

---

# 6️⃣ DATA LOADING STRATEGY (VERY IMPORTANT)

> **Never load all data upfront.**

---

## 📦 DATA LOADING RULES

| Stage      | Load                     |
| ---------- | ------------------------ |
| Discovery  | Summary + counts         |
| Evaluation | Filtered units only      |
| Decision   | Full digital twin + docs |

Example:

* Before Vastu confirmation → no Vastu calc
* After confirmation → compute only selected rules

---

# 7️⃣ MCP TOOL USAGE (CONTROLLED)

LLM never computes directly.

Example:

```json
{
  "tool": "applyVastuFilter",
  "params": {
    "propertyId": "PROP123",
    "rules": ["MAIN_DOOR", "KITCHEN"],
    "style": "Traditional"
  }
}
```

Tool returns:

```json
{
  "matchedUnits": ["1203", "1501"],
  "excluded": 18,
  "confidence": "HIGH"
}
```

LLM only **explains**.

---

# 8️⃣ UX PRESENTATION RULES

### Filters Applied

* Always visible as chips
* Removable individually
* Explained in plain language

Example:

> 🧭 Vastu: Main Door + Kitchen
> 👨‍👩‍👧 Family: School-age kids

---

# 9️⃣ WHEN AI SHOULD ASK AGAIN

AI may ask more questions ONLY if:

* User changes intent
* User says “What else?”
* User is stuck (no matches)

Never interrupts otherwise.

---

# 🔒 HARD RULES (WRITE THESE IN CODE COMMENTS)

1. No assumption-based filters
2. No silent exclusions
3. No more than **2 questions per intent**
4. Questions must be selectable, not typed
5. Every filter must be explainable
6. User can always undo

---

# 🧠 SYSTEM PROMPT (FILTER AGENT)

```text
You are a persona-aware filtering agent.

Rules:
- Never assume user preferences.
- Ask minimal clarifying questions.
- Activate filters only after explicit selection.
- Load only the data needed for the current intent.
- Explain every filter you apply.
```

---

# 🏁 WHY THIS IS IMPORTANT

This is what prevents:

* Overloaded UI
* AI hallucinations
* User distrust
* Decision fatigue

And enables:

* Calm confidence
* Fast narrowing
* Cultural sensitivity
* Explainable AI

---



Below is a **single consolidated, low-level, execution-ready specification** covering **requirements, design, scenarios, and coding-agent instructions**, distilled from the *entire discussion*.
Nothing critical is removed; duplication is eliminated. This is suitable as a **source-of-truth markdown** for engineering, AI agents, and product review.

---

# 🧠 REAL ESTATE DIGITAL TWIN PLATFORM

## Consolidated Low-Level Requirements & Design (India-First)

---

## 0️⃣ SYSTEM GOAL (NON-NEGOTIABLE)

Build an **India-first Real Estate Decision OS** that:

* Converts **brochures → structured truth**
* Generates **Digital Twins (2D/3D)**
* Enables **contextual AI reasoning (no hallucination)**
* Supports **persona-aware, progressive disclosure**
* Produces **manufacturing-ready outputs** (interiors)
* Eliminates waste (site visits, repetition, blind trust)

---

## 1️⃣ GLOBAL UX RULES

### 1.1 Universal Top Search (Always Present)

* Fixed top bar on **every view**
* Single component: `GlobalSmartSearch`
* Modes (auto-detected):

  * **ElasticSearch** → short keywords, filters
  * **AI Search (RAG + LLM + MCP)** → questions, comparisons, explanations
* **Never expose mode selection to user**

### 1.2 Result Layout Rules

* **Horizontal scroll** → image/visual results (properties, flats, designs)
* **Vertical list** → text/data (documents, issues, explanations)
* Mixed responses allowed (AI decides section-wise)

### 1.3 Context Awareness (Always On)

Search & AI always receive:

```json
{
  "propertyId": "...",
  "towerId": "...",
  "flatTypeId": "...",
  "room": "...",
  "functionalArea": "...",
  "persona": "...",
  "tier": "...",
  "journeyStage": "DISCOVERY | EVALUATION | DECISION"
}
```

---

## 2️⃣ PERSONA-AWARE AI FILTERING (STRICT)

### 2.1 Core Rule

* **Never apply filters without asking**
* **Never load all data at once**
* Max **2 questions per intent**
* Questions are **selectable chips**, not free text

### 2.2 Example (Vastu)

Flow:

1. Ask *if* Vastu matters
2. Ask *which style* (traditional / partial / avoid defects)
3. Ask *which areas* (door, kitchen, bedroom)
4. Apply filter → explain → allow undo

### 2.3 Filter Pipeline

```
Intent → Clarifying Question → Explicit Selection
→ Filter Activation (via MCP Tool) → Explain
```

---

## 3️⃣ PROPERTY TYPES & COMPONENT VISIBILITY

### 3.1 Property Types

* `HOUSE`
* `SMALL_APT` (<20 units)
* `GATED_COMMUNITY`
* `PLOT`

### 3.2 Visibility (Example)

* **Plots**: GeoJSON, Legal, Future Potential (no interiors)
* **Gated**: Master plan, Builder Twin, Amenities, Market
* **House**: Structure, Land title, Light/Air
* **Small Apt**: UDS, Legal, Noise/Privacy

### 3.3 Document Vault

* **Collapsed by default**
* Opens only on:

  * “Verify”
  * Decision stage
* AI summary always on top
* Raw PDFs only inside vault

---

## 4️⃣ DATA INGESTION: BROCHURE → STRUCTURED DATA

### 4.1 Input Types

* PDF brochures
* Scanned images
* Floor plans (PNG/JPG)
* Site layouts
* Geo maps

### 4.2 Ingestion Modes

* **OCR + LLM** (default)
* **Manual cut & label** (assisted)
* **Direct structured upload** (CAD/GeoJSON)

### 4.3 Canonical Schemas (Mandatory)

* `PROPERTY_SCHEMA`
* `TOWER_STRUCTURE_SCHEMA`
* `FLOOR_SCHEMA`
* `HOME_LAYOUT_SCHEMA`
* `ROOM_SURVEY_SCHEMA`
* `WALL_FINISHES_SCHEMA`
* `DOOR_WINDOWS_TILES_SCHEMA`
* `ELECTRICAL_SCHEMA`
* `PLUMBING_SCHEMA`
* `PRICE_SHEET_SCHEMA`
* `PAYMENT_SCHEDULE_SCHEMA`
* `PROJECT_INVENTORY_SUMMARY`
* `VASTU_SCHEMA`
* `GEOJSON_SCHEMA`

**Rules**

* No free text
* UNKNOWN allowed
* Source page tagged
* Versioned edits

---

## 5️⃣ FLOOR TYPE, FLAT TYPE, STACK LOGIC

### 5.1 FloorType

* Unique layout signature
* Repeats across floors

### 5.2 FlatType / StackType

* Vertical repetition of same position
* Enables:

  * View analysis
  * Light/Wind simulation
  * Stack comparison

### 5.3 Tower Binding

```json
{
  "towerId": "T3",
  "usesFloorTypes": ["FT_A"],
  "stackMap": ["STK_01", "STK_02"]
}
```

---

## 6️⃣ GEOJSON (SITE TRUTH)

* Site boundary
* Tower footprints
* Rotation & orientation
* Roads, open spaces

GeoJSON is the **anchor** for:

* Sunlight
* Wind
* Views
* Obstruction
* 3D twin placement

---

## 7️⃣ SUNLIGHT & WIND SIMULATION (AUTOMATED)

### 7.1 Inputs

* GeoJSON (lat/lng, orientation)
* Tower height & rotation
* FlatType + Room + Window/Balcony positions

### 7.2 Sunlight Engine

* Astronomical math (NOAA/SPA)
* Ray casting vs obstructions
* Output:

  * Direct sunlight hours
  * Morning/afternoon heat
  * Room-level scores

### 7.3 Wind Engine (Practical, Not CFD)

* Seasonal wind roses (India)
* Obstruction model (towers, corridors)
* Cross-ventilation detection
* Stack effect (higher floors)

### 7.4 Output

```json
{
  "sunlightScore": 82,
  "ventilationScore": 76,
  "explanation": "Good morning light, moderate summer airflow"
}
```

---

## 8️⃣ WALL & FUNCTIONAL AREA MODELING

### 8.1 Hierarchy

```
Room → Wall → FunctionalArea
```

### 8.2 Wall Extraction

* From plans (vision + scale)
* Orientation (N/E/S/W)
* Thickness & length

### 8.3 Functional Areas (Examples)

* Entertainment / TV wall
* Wardrobe bay
* Kitchen counter wall
* Utility drying area
* Study wall

### 8.4 Validation Rules

* Clearance
* Glare
* Door swing
* Structural conflicts

---

## 9️⃣ AI-DRIVEN INTERIOR DESIGN → CNC

### 9.1 Entry

User taps **“Design this space”**

### 9.2 AI Behavior

* Ask **max 5 persona-relevant questions**
* No mood boards initially
* No hallucinated styles

### 9.3 Output (Structured)

```json
{
  "modules": [
    {"type":"Hanging","width":2.5},
    {"type":"Shelves","width":2},
    {"type":"Drawers","width":2.5}
  ],
  "door":"Sliding",
  "finish":"Laminate"
}
```

### 9.4 Human-in-Loop

* Designer/Architect review
* Chat + optional video
* All changes tracked

### 9.5 Manufacturing Output

* CNC cut lists
* DXF
* Hardware list
* Assembly order
* IKEA-like install kit (QR per panel)

---

## 🔟 AI ARCHITECTURE (NO HALLUCINATION)

### 10.1 Search & Reasoning Stack

```
UI → Query Router
→ Elastic (facts)
→ Vector DB (context)
→ MCP Tools (compute)
→ RAG Assembly
→ LLM (explain only)
```

### 10.2 MCP Tools (Examples)

* `applyVastuFilter`
* `getSunlightScore`
* `getVentilationScore`
* `designWardrobe`
* `compareStacks`
* `summarizeDocument`

LLM **must call tools**, never compute.

---

## 1️⃣1️⃣ UI ARCHITECTURE (RN + NativeWind)

### Layers

0. **Design Tokens** (canonical)
1. **Primitives** (shadcn/radix)
2. **Domain Components**
3. **Patterns**
4. **Screen Blueprints**
5. **Screens**

### Rules

* Tokens → single source
* RN & NativeWind via adapters
* Screens = dumb composition only

---

## 1️⃣2️⃣ CODING AGENT INSTRUCTIONS (STRICT)

### 12.1 General

* Never invent UI styles
* Never invent data fields
* Never bypass schemas
* UNKNOWN > Guess

### 12.2 UI Agent

* Use only allowed primitives
* Respect visibility rules
* Horizontal vs vertical rules enforced

### 12.3 Backend Agent

* Adaptive APIs only
* Return data **only for visible components**
* Raw docs only via vault endpoint

### 12.4 LLM Agent

System Prompt (summary):

```
- Do not assume preferences
- Ask minimal clarifying questions
- Use MCP tools before reasoning
- Explain decisions
- Never hallucinate
```

---

## 1️⃣3️⃣ KEY SCENARIOS COVERED

* Buyer choosing flat with best airflow
* Family filtering for kids & schools
* Investor comparing stacks
* Vastu-sensitive buyer (explicit consent)
* Designer finalizing wardrobe
* Manufacturer receiving CNC output
* Legal/loan validation in context

---

## 1️⃣4️⃣ WHAT THIS PLATFORM IS / IS NOT

❌ Not a listing site
❌ Not a services marketplace
❌ Not a design inspiration app

✅ Digital Twin Platform
✅ Trust & Decision OS
✅ AI + Human Loop System
✅ Manufacturing-ready pipeline

---

## 🏁 FINAL RULE (WRITE THIS IN CODE COMMENTS)

> **Show less. Ask smart. Prove everything.
> Confidence is the product.**

---





Below is a **requirements-indexed, low-level design + agent workflow specification** that turns your vision into **implementable tasks**.
This is written so **coding agents, automation agents, and LLM agents** can execute without ambiguity.

No marketing. No repetition. Pure execution.

---

# 🧠 REAL ESTATE DIGITAL TWIN PLATFORM

## Requirements + Low-Level Design + Agent Workflows

---

# 📘 LEGEND

* **REQ-XXX** → Requirement ID (traceable)
* **DES-XXX** → Design decision
* **AGENT-XXX** → Autonomous agent responsibility
* **TOOL** → Specific tool/library
* **OUT** → Expected output artifact

---

# 1️⃣ DATA ACQUISITION & TRUTH INGESTION

---

## REQ-001: Project Discovery from Internet

**Requirement**
System must discover project metadata (location, maps, surroundings) using public web sources.

**DES-001**

* Use browser automation instead of APIs (coverage + realism).
* Treat web content as *supporting context*, not truth.

**AGENT-001: Project Discovery Agent**

* **TOOL**: Playwright
* **Workflow**:

  1. Search project name + city on:

     * Google Maps
     * Google Search
     * Builder website
     * Real estate portals
  2. Capture:

     * Lat/Lng
     * Address
     * Surrounding landmarks
  3. Save screenshots + extracted text

**OUT**

```json
{
  "projectName": "...",
  "lat": 17.45,
  "lng": 78.38,
  "sourceScreenshots": [...]
}
```

---

## REQ-002: GeoJSON Creation from Maps & Screenshots

**Requirement**
Generate GeoJSON polygons for:

* Site boundary
* Towers
* Amenities
* Roads / open areas

**DES-002**

* GeoJSON is the **spatial anchor**.
* Accuracy > perfection (human correction allowed).

---

### AGENT-002: GeoJSON Visual Extraction Agent

**TOOL**

* Playwright (screenshots)
* LLM Vision
* Manual polygon assist (fallback)

**Workflow**

1. Open Google Maps / Satellite
2. Zoom to site
3. Take high-resolution screenshot
4. LLM Vision:

   * Detect visible tower footprints
   * Detect amenity blocks
5. Convert detected shapes → polygon coordinates
6. Normalize coordinates using map scale

**OUT**

```json
{
  "type": "FeatureCollection",
  "features": [
    { "type": "Feature", "properties": { "type": "TOWER", "id": "T1" }, "geometry": {...} }
  ]
}
```

📌 *Human review step allowed before final save*

---

# 2️⃣ BROCHURE → STRUCTURED DATA

---

## REQ-010: Brochure Upload & Classification

**Requirement**
Support upload of PDFs / images and auto-classify pages.

**DES-010**

* Page classification drives schema + prompt.

**AGENT-010: Brochure Classifier**

* **TOOL**: OCR + Vision
* **Detect**:

  * Specs page
  * Area statement
  * Floor plan
  * Site layout

**OUT**

```json
{
  "pageId": "P18",
  "type": "SPECIFICATIONS"
}
```

---

## REQ-011: Schema-Bound Extraction (No Free Text)

**Requirement**
Extract only schema-defined fields.

**DES-011**

* UNKNOWN allowed
* Source page tagging mandatory

**AGENT-011: Brochure Extraction Agent**

* **TOOL**: OCR + LLM
* **Rules**:

  * No assumptions
  * Map strictly to schema
  * Ignore marketing language

**OUT**

```json
{
  "schema": "WALL_FINISHES_SCHEMA",
  "data": {...},
  "source": "page_18"
}
```

---

# 3️⃣ FLOOR TYPE, FLAT TYPE & STACK NORMALIZATION

---

## REQ-020: FloorType Detection

**Requirement**
Detect repeating floor layouts.

**DES-020**

* FloorType ≠ Floor
* Signature based on topology + dimensions

**AGENT-020**

* **TOOL**: Vision + geometry comparison
* Group identical layouts

**OUT**

```json
{
  "floorTypeId": "FT_A",
  "repeatsOn": [1,2,3,4,5]
}
```

---

## REQ-021: FlatType / StackType Detection

**Requirement**
Detect vertical repetition of unit positions.

**DES-021**

* Enables sunlight, wind, view, comparison

**AGENT-021**

* Analyze position within floor
* Group vertically

**OUT**

```json
{
  "flatTypeId": "STK_01",
  "facing": "East",
  "floors": [3..22]
}
```

---

# 4️⃣ WALL, ROOM & FUNCTIONAL AREA MODELING

---

## REQ-030: Wall Extraction from Floor Plans

**Requirement**
Every wall must be identifiable and oriented.

**DES-030**

* Walls are first-class objects.

**AGENT-030**

* **TOOL**: OpenCV + Vision
* Detect wall lines + thickness
* Assign orientation

**OUT**

```json
{
  "wallId": "W_LIV_EAST",
  "room": "Living",
  "length": 14.2
}
```

---

## REQ-031: Functional Area Tagging

**Requirement**
Mark TV walls, wardrobe bays, kitchen counters, etc.

**DES-031**

* AI suggests, human confirms

**AGENT-031**

* LLM suggests functional areas
* UI for confirm/edit

**OUT**

```json
{
  "areaType": "WARDROBE_BAY",
  "wallId": "W_MB_NORTH"
}
```

---

# 5️⃣ SUNLIGHT & WIND SIMULATION

---

## REQ-040: Automated Sunlight Simulation

**Requirement**
Compute room-level sunlight hours.

**DES-040**

* Astronomical math + ray casting
* GeoJSON + window positions only

**AGENT-040**

* **TOOL**: Custom math engine
* Precompute per FloorType

**OUT**

```json
{
  "room": "Living",
  "morningSun": true,
  "hours": 2.5
}
```

---

## REQ-041: Automated Wind Simulation

**Requirement**
Compute cross ventilation quality.

**DES-041**

* Seasonal wind roses
* Obstruction-aware

**AGENT-041**

* Use wind direction vectors
* Check openings alignment

**OUT**

```json
{
  "crossVentilation": "High"
}
```

---

# 6️⃣ AI SEARCH, FILTERING & MCP

---

## REQ-050: Universal Search Bar

**Requirement**

* Always visible
* Elastic + AI auto-routing

**DES-050**

* One component, many modes

---

## REQ-051: Persona-Aware AI Filters

**Requirement**

* Never assume
* Ask minimal questions

**DES-051**

* Max 2 clarifying questions per intent

**AGENT-051**

* LLM filter agent
* Uses MCP tools only

---

# 7️⃣ INTERIOR DESIGN → CNC MANUFACTURING

---

## REQ-060: AI Design Suggestions

**Requirement**

* Persona-aware
* Constraint-bound

**DES-060**

* Ask right questions first
* No mood boards initially

**AGENT-060**

* LLM design agent

---

## REQ-061: Human Designer Collaboration

**Requirement**

* Chat + optional video
* Change tracking

**DES-061**

* AI proposes, human approves

---

## REQ-062: Manufacturing Output

**Requirement**

* CNC-ready output

**DES-062**

* IKEA-like but exact

**AGENT-062**

* Generate:

  * Cut list
  * DXF
  * Hardware list
  * Assembly order

---

# 8️⃣ UI ARCHITECTURE (FOR CODING AGENTS)

---

## REQ-070: Layered UI System

**Layers**
0. Design Tokens

1. Primitives
2. Domain Components
3. Patterns
4. Screen Blueprints
5. Screens

**DES-070**

* RN + NativeWind adapters
* Screens = dumb composition

---

# 9️⃣ CODING AGENT GLOBAL RULES

```text
- Never invent schema fields
- Never assume user preferences
- UNKNOWN > Guess
- Use MCP tools before reasoning
- Respect visibility rules
- Horizontal = visual, Vertical = textual
```

---

# 🔚 FINAL NOTE

This spec enables you to run **multiple specialized agents**:

* Web discovery agent
* GeoJSON extraction agent
* Brochure ingestion agent
* Simulation agent
* Design & manufacturing agent

All coordinated by **LLM + MCP**, grounded in **schemas**, and controlled by **human checkpoints**.

---

If you want next, I can:

* Convert this into **Jira epics & stories**
* Write **Playwright scripts (pseudo + real)**
* Define **MCP tool interfaces**
* Create **agent orchestration DAG**

Just say the next step.





Below is the **final consolidated update** that **adds the complete technology stack, data sources, and strategy** for **every requirement**, explicitly covering:

* **Brochure / manual extraction**
* **Dimensions (ceiling, doors, windows, plumbing, electrical)**
* **House layout & walls**
* **Vastu (trusted India sources via RAG)**
* **Interior design rules (India-specific via RAG)**
* **3D interior & digital twin stack**
* **Parametric → CNC manufacturing**
* **Mix of manual + AI + trusted internet sources**
* **Clear agent responsibilities**

This is written as a **low-level design + execution strategy** that engineering and AI teams can implement directly.

---

# 🧠 REAL ESTATE DIGITAL TWIN – FINAL TECH STRATEGY

## Requirements × Tech Stack × Data Sources (India)

---

# 0️⃣ FOUNDATIONAL DESIGN DECISIONS (GLOBAL)

### DES-000: Truth Hierarchy (Non-Negotiable)

```
On-site Survey / Manual Confirmation
  > Builder Drawings / CAD
    > Brochure Specifications
      > Trusted RAG Sources
        > Public Internet
          > AI Inference
```

AI **never overrides higher truth layers**.

---

# 1️⃣ BROCHURE / MANUAL → STRUCTURED DATA

---

## REQ-001: Ceiling Height, Doors, Windows, Flooring, Wall Finish

### Data Source

* Builder brochure PDFs
* Specification pages
* Manual uploads

### Tech Stack

* **OCR**: Tesseract / Google Vision / Azure Vision
* **Vision LLM**: GPT-4o Vision / Gemini Vision
* **Schema Engine**: JSON Schema + validation
* **Human Review UI**: Side-by-side doc ↔ extracted fields

### Extraction Strategy

* Vision detects tables + bullet specs
* LLM maps **only declared facts** to schema
* Units preserved (mm / ft)

### Output

```json
{
  "ceilingHeight_mm": 3000,
  "mainDoor": { "width_mm": 1000, "height_mm": 2100 },
  "windows": [{ "type": "UPVC", "width_mm": 1500 }]
}
```

---

## REQ-002: Plumbing & Electrical Specifications

### Data Source

* Brochure specs
* Electrical layout drawings
* Plumbing schematics (if present)

### Tech Stack

* OCR + Vision LLM
* Schema mapping (`PLUMBING_SCHEMA`, `ELECTRICAL_SCHEMA`)
* Rule validator (minimum points per room)

### Strategy

* No inference of brands unless mentioned
* Flag “Provision only” vs “Installed”

---

# 2️⃣ HOUSE / FLAT LAYOUT & DIMENSIONS

---

## REQ-010: Room, Wall, Layout Dimensions

### Data Source

* Floor plan images
* CAD (if available)
* Manual measurement (survey)

### Tech Stack

* **OpenCV**: wall/line detection
* **Vision LLM**: room labeling
* **Scale calibration**: detected scale text OR manual input
* **Geometry Engine**: polygon math

### Strategy

* Extract walls → rooms → dimensions
* Validate against area statement
* Mark tolerance mismatches

---

## REQ-011: Wall-Level Modeling (TV wall, wardrobe bay, etc.)

### Tech Stack

* Geometry engine
* Rule-based classifier
* LLM suggestion (not final authority)

### Strategy

* AI proposes functional areas
* User/designer confirms
* Stored as deterministic geometry

---

# 3️⃣ GEOJSON, SITE & TOWER MAPPING

---

## REQ-020: GeoJSON Creation (Site, Towers, Amenities)

### Data Source

* Google Maps / Satellite
* Master layout images
* Survey sketches

### Tech Stack

* **Playwright**: open maps, zoom, screenshot
* **Vision LLM**: detect footprints
* **Manual polygon editor** (fallback)
* **GeoJSON validator**

### Strategy

* Screenshot → detect shapes → normalize coordinates
* Human review before final save

---

# 4️⃣ SUNLIGHT & WIND SIMULATION

---

## REQ-030: Sunlight Simulation

### Tech Stack

* Astronomical math (NOAA / SPA)
* Ray casting (Three.js math or custom)
* GeoJSON + tower height + window positions

### Strategy

* No APIs required
* Precompute per FloorType
* Cache by month

---

## REQ-031: Wind Simulation (India-Specific)

### Data Source

* Indian seasonal wind roses (IMD summaries)

### Tech Stack

* Vector math
* Obstruction model (GeoJSON)
* Rule-based airflow engine

### Strategy

* Practical airflow (not CFD)
* Focus on cross-ventilation & stagnation risk

---

# 5️⃣ VASTU (TRUSTED, NOT GENERIC)

---

## REQ-040: Vastu Rules & Validation

### Data Source (RAG – Trusted Only)

* Traditional Vastu Shastra texts (digitized)
* Curated Indian architect interpretations
* Platform-verified rule documents

### Tech Stack

* **Vector DB** (Pinecone / Qdrant)
* **RAG layer** (no free inference)
* **Rule engine** (explicit checks)

### Strategy

* Ask user *if* Vastu matters
* Ask *which style*
* Apply only selected rules
* Explain each result

🚫 No “East facing = good” shortcuts

---

# 6️⃣ INTERIOR DESIGN RULES (INDIA)

---

## REQ-050: Interior Design Rules (Wardrobe, Kitchen, TV)

### Data Source (RAG)

* Indian interior design standards
* Modular furniture manufacturer specs
* Ergonomic standards (Indian usage)

### Tech Stack

* RAG + rules engine
* Parametric constraints solver

### Strategy

* AI asks minimal persona questions
* Generates **structured layout**, not images
* Designer validates

---

# 7️⃣ INTERIOR 3D & DIGITAL TWIN

---

## REQ-060: 3D Interior & Building Twin

### Tech Stack

* **Three.js / Babylon.js** (web)
* **React Three Fiber**
* **Parametric geometry engine**
* **LOD system** (performance)

### Strategy

* Geometry derived from schemas
* Textures = representative, not marketing
* Toggle layers (walls, furniture, airflow)

---

# 8️⃣ MANUFACTURING (CNC, IKEA-LIKE)

---

## REQ-070: CNC Manufacturing Output

### Tech Stack

* Parametric CAD (OpenCascade / custom)
* DXF generation
* CSV cut lists
* Hardware mapping

### Strategy

* Final dimensions locked
* Automatic regeneration on site deviation
* QR-based assembly

---

# 9️⃣ AI SEARCH, RAG & MCP ORCHESTRATION

---

## REQ-080: Global Search + AI

### Tech Stack

* **ElasticSearch**: structured queries
* **Vector DB**: semantic context
* **MCP Layer**: tools (sunlight, vastu, design)
* **LLM**: orchestration + explanation only

### Strategy

* Elastic for facts
* MCP for computation
* LLM never calculates

---

# 🔟 UI & FRONTEND STACK

---

## REQ-090: UI Architecture

### Tech Stack

* React Native (mobile)
* NativeWind (LLM-friendly)
* Shared design tokens
* Shadcn/Radix primitives

### Strategy

* Tokens → adapters
* Screens = dumb composition
* Visibility rules from server

---

# 1️⃣1️⃣ AGENT STRATEGY (SUMMARY)

| Agent               | Responsibility          |
| ------------------- | ----------------------- |
| Web Discovery Agent | Playwright scraping     |
| Brochure Agent      | OCR + schema extraction |
| GeoJSON Agent       | Map → polygon           |
| Simulation Agent    | Sun + wind              |
| Vastu Agent         | RAG-only validation     |
| Interior AI         | Layout suggestion       |
| Designer            | Approval                |
| Manufacturing Agent | CNC output              |

---

# 🏁 FINAL STRATEGIC TAKEAWAY

You are building **not an app**, but a **multi-truth, multi-agent decision platform** where:

* **AI is constrained**
* **Data is layered**
* **Humans approve**
* **Manufacturing is deterministic**

This stack is **enterprise-grade, defensible, and scalable**.

---

## 🔜 NEXT OPTIONS

If you want, I can next:

1. Convert this into **architecture diagrams**
2. Produce **OpenAPI + MCP contracts**
3. Generate **Playwright automation scripts**
4. Create **RAG corpus structure**
5. Write **coding agent system prompts**






Below is a **precise extension** to your consolidated specification that **adds official Indian government / quasi-government data sources** with **clear requirements, agent responsibilities, tech stack, limitations, and audit rules**.

This fits cleanly into your existing **multi-agent, truth-layered architecture**.

---

# 🇮🇳 OFFICIAL RECORDS & LEGAL TRUTH INGESTION

## Requirements, Design & Agent Specifications

---

## 🔐 DESIGN PRINCIPLE (VERY IMPORTANT)

> **Government records are authoritative but fragmented.
> AI must extract, normalize, and explain — never reinterpret law.**

All outputs must be:

* Source-attributed
* Time-stamped
* Verifiable
* Audit-ready

---

# 1️⃣ RERA (REAL ESTATE REGULATION AUTHORITY)

---

## REQ-100: Pull Project & Builder Data from RERA Portals

### Scope

* Project registration
* Builder registration
* Approvals
* Completion timelines
* Promoter disclosures

### India Reality

* Each state has its **own RERA portal**
* No unified API
* Mostly HTML + PDFs

---

### DES-100: RERA as Legal Truth Layer

* RERA data **overrides brochure claims**
* Differences are flagged, not hidden

---

### AGENT-100: RERA Scraping & Normalization Agent

**Data Sources**

* State RERA websites (e.g., Telangana RERA, MahaRERA, Karnataka RERA)

**Tech Stack**

* Playwright (browser automation)
* HTML parsing
* OCR (for uploaded RERA PDFs)
* Schema mapper

**Workflow**

1. Search by:

   * Project name
   * RERA registration number
2. Scrape:

   * Project status
   * Approved towers
   * Promised possession date
   * Land ownership details
3. Download linked PDFs
4. Normalize into schema

**Output**

```json
{
  "reraProjectId": "PRM/TS/RERA/XXXX",
  "status": "REGISTERED",
  "approvedTowers": ["T1", "T2"],
  "possessionDate": "2027-06",
  "source": "TSRERA"
}
```

**Failure Handling**

* If portal blocks automation → manual upload fallback
* If mismatch with brochure → raise `LEGAL_VARIANCE_FLAG`

---

# 2️⃣ ENCUMBRANCE CERTIFICATE (EC)

---

## REQ-110: Pull EC Data from State Registration Portals

### Scope

* Ownership history
* Mortgages
* Charges
* Sale deeds

### India Reality

* EC portals differ by state
* Some require captcha / login
* Limited historical depth online

---

### DES-110: EC as Ownership Chain Validator

* EC validates **title continuity**
* Missing years are flagged explicitly

---

### AGENT-110: EC Extraction Agent

**Data Sources**

* State Registration & Stamps portals

  * Telangana: IGRS
  * Karnataka: Kaveri
  * Maharashtra: IGR

**Tech Stack**

* Playwright
* OCR (scanned EC PDFs)
* Manual-assisted flow (captcha)

**Workflow**

1. User provides:

   * Survey number
   * Village / Mandal
   * Time range
2. Agent:

   * Navigates portal
   * Downloads EC
3. OCR → structured extraction

**Output**

```json
{
  "surveyNo": "123/AA",
  "period": "2005–2024",
  "encumbrances": [
    { "type": "Mortgage", "year": 2015, "status": "Cleared" }
  ],
  "gaps": []
}
```

**UX Rule**

> “No encumbrances found” ≠ “Title is clear”
> Always explain limitations.

---

# 3️⃣ LAND RECORDS & SURVEY MAPS

---

## REQ-120: Pull Survey Maps & Land Records

### Scope

* Survey sketch
* Extent
* Classification (agricultural / converted)
* Boundaries

### India Data Sources

* State land record portals:

  * Dharani (Telangana)
  * Bhoomi (Karnataka)
  * Bhulekh (various states)

---

### DES-120: Survey Maps as Spatial Truth

* Survey map overrides brochure boundary diagrams

---

### AGENT-120: Survey Map Agent

**Tech Stack**

* Playwright
* OCR
* Geo-referencing tools
* GeoJSON converter

**Workflow**

1. Search by:

   * Survey number
   * Village
2. Download:

   * Survey sketch
   * RTC / Pahani
3. Convert boundary lines → GeoJSON
4. Align with site GeoJSON

**Output**

```json
{
  "surveyNo": "123/AA",
  "extent": "5.20 Acres",
  "geoJsonBoundary": {...},
  "classification": "Converted"
}
```

**Mismatch Handling**

* Boundary mismatch → `SURVEY_BOUNDARY_ALERT`

---

# 4️⃣ INDIAN SATELLITE & MAP DATA

---

## REQ-130: Historical & Current Satellite Imagery

### Scope

* Land usage changes
* Construction progress
* Encroachment detection

### Trusted Sources

* Bhuvan (ISRO)
* NRSC portals
* Public satellite layers

---

### DES-130: Satellite as Temporal Evidence

* Used to **verify timelines**
* Not used for legal conclusions

---

### AGENT-130: Satellite Evidence Agent

**Tech Stack**

* Bhuvan portal access
* Screenshot capture
* Temporal comparison
* Geo-alignment

**Workflow**

1. Fetch imagery:

   * Multiple years
2. Compare:

   * Land cleared?
   * Construction visible?
3. Tag changes

**Output**

```json
{
  "year": 2020,
  "status": "Vacant Land",
  "year_2024": "Construction Started"
}
```

---

# 5️⃣ COURT CASE & LITIGATION CHECK

---

## REQ-140: Court Case Search (Land / Builder)

### Scope

* Civil cases
* Consumer cases
* High Court / District Court

### India Reality

* No single unified court API
* Partial public access
* Name-based ambiguity

---

### DES-140: Litigation Risk, Not Legal Opinion

* Platform **reports presence**, not verdicts

---

### AGENT-140: Court Case Search Agent

**Data Sources**

* eCourts portal
* High Court cause lists
* Consumer forum portals

**Tech Stack**

* Playwright
* Text normalization
* Entity matching (fuzzy)

**Workflow**

1. Search by:

   * Builder name
   * Survey number
   * Project name
2. Extract:

   * Case number
   * Court
   * Nature of case
3. De-duplicate false positives

**Output**

```json
{
  "entity": "Builder XYZ",
  "casesFound": [
    {
      "court": "District Court",
      "caseType": "Civil",
      "status": "Pending"
    }
  ],
  "confidence": "Medium"
}
```

**UX Rule**

> “Cases found does not imply wrongdoing. Review details.”

---

# 6️⃣ CROSS-SOURCE CONSISTENCY ENGINE

---

## REQ-150: Multi-Source Conflict Detection

### Scope

* RERA vs Brochure
* EC vs Survey
* Survey vs GeoJSON
* Builder claim vs Court data

---

### DES-150: Conflict Visibility, Not Resolution

---

### AGENT-150: Consistency Audit Agent

**Workflow**

1. Compare same field across sources
2. Classify difference:

   * Minor
   * Major
3. Attach source links

**Output**

```json
{
  "field": "Land Extent",
  "brochure": "6 Acres",
  "survey": "5.2 Acres",
  "severity": "High"
}
```

---

# 7️⃣ LEGAL UX PRESENTATION RULES

* Always show:

  * Source
  * Date
  * Limitation note
* Never show:

  * Legal conclusions
  * Advice language

---

# 8️⃣ AGENT GOVERNANCE & COMPLIANCE

### Audit Trail

* Every scrape → screenshot
* Every extraction → source reference
* Every conflict → log

### Rate Limiting & Ethics

* Respect robots.txt where applicable
* Manual fallback always available

---

# 🧠 UPDATED AGENT MAP (FINAL)

| Agent     | Responsibility     |
| --------- | ------------------ |
| AGENT-100 | RERA data          |
| AGENT-110 | EC extraction      |
| AGENT-120 | Survey maps        |
| AGENT-130 | Satellite evidence |
| AGENT-140 | Court cases        |
| AGENT-150 | Consistency audit  |

---

# 🏁 FINAL STRATEGIC NOTE

With this addition, your platform now covers:

* **Regulatory truth**
* **Ownership truth**
* **Spatial truth**
* **Temporal truth**
* **Litigation risk**

All **explained**, **sourced**, and **non-hallucinatory**.

This is the **hardest part of real estate tech** — and you now have a clean, enforceable design.

---

## 🔜 NEXT (OPTIONAL BUT POWERFUL)

1. **Legal opinion marketplace (bank-panel lawyers)**
2. **Auto-generated due-diligence report (PDF)**
3. **Risk scoring model**
4. **State-wise portal adapters**
5. **Compliance review checklist**

Say the next step and I’ll take it there.



Below is a **clean extension** to your master spec that adds **Trusted Sources + AI Models + Legal Report Generation**, with **diagrammatic outputs (mind maps / graphs)**, **court-case linkage**, **scoring**, and **actionable suggestions**.

This is written as **low-level requirements + low-level design**, suitable for **AI agents, backend, and compliance review**.

---

# 🇮🇳 LEGAL INTELLIGENCE & TRUSTED SOURCES LAYER

## Requirements, Design, AI Models, Outputs

---

## 🔐 CORE PRINCIPLE (LEGAL AI)

> **AI summarizes, links, and explains.
> AI never gives legal advice or conclusions.**

Outputs are:

* Explainable
* Source-linked
* Time-stamped
* Audit-safe

---

# 1️⃣ TRUSTED LEGAL & REGULATORY SOURCES (RAG-ONLY)

## REQ-160: Trusted Legal Knowledge Base (India)

### Source Categories (Curated, Not Crawled Freely)

#### A. Statutory & Regulatory

* RERA Acts (Central + State rules)
* Registration Act excerpts
* Stamp Act (state-specific)
* Local development authority rules (HMDA, BDA, MMRDA, etc.)

#### B. Judiciary (Public Records)

* Supreme Court judgments (property-related)
* High Court landmark cases (land, builder disputes)
* Consumer forum judgments (housing)

#### C. Banking & Institutional

* Bank panel legal checklist templates
* Home-loan due diligence formats
* Valuation norms (RBI / NHB references)

#### D. Practice References

* Standard title-search formats
* EC interpretation guides
* Land conversion guidelines

---

### DES-160: RAG-Only Ingestion

* No generative inference from web
* Only **pre-approved documents**
* Chunked + embedded
* Versioned by year/state

---

### Tech Stack

* Vector DB: **Qdrant / Pinecone**
* Embedding Model: **text-embedding-3-large** (or equivalent)
* Document store: S3 + metadata DB

---

# 2️⃣ AI MODELS & ROLES (STRICT SEPARATION)

---

## REQ-161: Legal AI Model Separation

| Role      | Model Type    | Responsibility           |
| --------- | ------------- | ------------------------ |
| OCR       | Vision Model  | Read PDFs, scans         |
| Extractor | LLM (strict)  | Schema-bound extraction  |
| Linker    | LLM + Rules   | Map docs → cases         |
| Explainer | LLM (guarded) | Plain-language summary   |
| Scorer    | Rules + ML    | Risk & confidence scores |

🚫 No single model does everything.

---

# 3️⃣ DOCUMENT UNDERSTANDING & LINKING

---

## REQ-162: Legal Document Parsing

### Input Docs

* Sale deeds
* ECs
* RERA certificates
* Survey sketches
* Court orders (PDF)

---

### DES-162: Key-Point Extraction (Schema-Bound)

Each document yields:

```json
{
  "docType": "SALE_DEED",
  "parties": ["A", "B"],
  "date": "2016-04-12",
  "surveyNos": ["123/AA"],
  "extent": "1.20 Acres",
  "mentions": ["Mortgage", "Release Deed"],
  "sourceLink": "..."
}
```

---

## REQ-163: Court Case Mapping

### Design Logic

* Match on:

  * Survey numbers
  * Property extent
  * Builder/promoter name
  * Party names (fuzzy)

---

### AGENT-163: Case Linker Agent

**Output**

```json
{
  "document": "SALE_DEED_2016",
  "linkedCases": [
    {
      "court": "High Court",
      "caseNo": "WP/1234/2019",
      "issue": "Land acquisition",
      "status": "Disposed"
    }
  ],
  "confidence": "High"
}
```

---

# 4️⃣ VISUAL LEGAL OUTPUTS (NO WALLS OF TEXT)

---

## REQ-170: Legal Mind Map View

### Purpose

Replace long legal summaries.

---

### DES-170: Mind Map Structure

```
Property
 ├── Ownership
 │    ├── Sale Deed (2016)
 │    ├── EC Clear (2005–2024)
 ├── Approvals
 │    ├── RERA Registered
 │    ├── Layout Approved
 ├── Risks
 │    ├── Case: Land dispute (Disposed)
 └── Bank View
      ├── Acceptable
      └── Notes
```

---

### Tech Stack

* Graph data model
* D3.js / Cytoscape
* Click → source document

---

## REQ-171: Timeline Diagram

Visualize:

* Ownership changes
* Mortgages
* Case filings
* Approvals

```
2005 ── Sale ── Mortgage ── Release ── RERA ── Today
```

---

# 5️⃣ LEGAL SCORING ENGINE

---

## REQ-180: Multi-Factor Legal Score

### Factors (Transparent)

* Title continuity
* EC completeness
* Litigation presence
* RERA compliance
* Survey match
* Bank acceptance likelihood

---

### DES-180: Score Is Explainable

```json
{
  "legalScore": 82,
  "breakdown": {
    "title": 90,
    "litigation": 70,
    "approvals": 85
  }
}
```

---

### UX Rule

> Score never shown without explanation.

---

# 6️⃣ AI-GENERATED SUGGESTIONS (NOT ADVICE)

---

## REQ-190: Next-Step Suggestions

### Based On

* Gaps
* Risks
* Missing documents

---

### DES-190: Suggest, Don’t Decide

Examples:

* “Consider obtaining a certified EC for 1998–2005”
* “Bank legal opinion recommended due to past litigation”
* “Boundary re-survey advised before agreement”

Each suggestion links to:

* Reason
* Source
* Optional service (lawyer/surveyor)

---

# 7️⃣ LEGAL REPORT GENERATION (PDF + DIGITAL)

---

## REQ-200: Auto-Generated Legal Summary Report

### Contents

* Property overview
* Document checklist
* Timeline
* Case links
* Scores
* Limitations

---

### Design Rules

* No legal verdict language
* Every statement → source link
* Disclaimers auto-included

---

### Output Formats

* PDF (shareable)
* Interactive (inside app)

---

# 8️⃣ AI GOVERNANCE & SAFETY

---

## REQ-210: Legal AI Guardrails

### Mandatory Rules

* No legal advice
* No “safe to buy” statements
* Use “appears”, “as per records”
* Show uncertainty explicitly

---

### Audit Trail

* Source URL
* Screenshot hash
* Extraction timestamp
* Model version

---

# 9️⃣ UPDATED AGENT MAP (LEGAL LAYER)

| Agent ID  | Responsibility                |
| --------- | ----------------------------- |
| AGENT-160 | Trusted legal corpus curation |
| AGENT-162 | Document key-point extractor  |
| AGENT-163 | Court case linker             |
| AGENT-170 | Legal graph builder           |
| AGENT-180 | Scoring engine                |
| AGENT-190 | Suggestion generator          |
| AGENT-200 | Report compiler               |

---

# 🔚 FINAL INTEGRATION VIEW

```
Raw Docs
 ↓
OCR + Extraction
 ↓
Trusted RAG
 ↓
Linking & Graph
 ↓
Scores
 ↓
Suggestions
 ↓
Human Review
```

---

## 🏁 WHAT THIS ADDS TO YOUR PLATFORM

You now have:

* **Explainable legal intelligence**
* **Visual understanding (mind maps, timelines)**
* **Court linkage (rare in proptech)**
* **Bank-aligned reasoning**
* **Zero hallucination legal AI**

This completes the **trust spine** of your Real Estate Decision OS.

---




Below are the **four additional requirements** fully specified and **integrated into your master system**, with **clear low-level requirements, design, agents, tech stack, and outputs**.
They align with your **legal intelligence + digital twin + AI governance** architecture.

---

# 🧠 EXTENDED LEGAL & TRUST LAYER

## Added 4 Requirements (Low-Level Spec)

---

# 1️⃣ INVESTOR-GRADE RISK MODEL

---

## REQ-220: Investor Risk & Return Intelligence

### Objective

Provide **quantified, explainable risk assessment** for investors without legal or financial advice.

---

### DES-220: Multi-Dimensional Risk Model

Risk is **decomposed**, not aggregated blindly.

**Risk Dimensions**

* Legal Risk
* Regulatory Risk
* Title Risk
* Litigation Risk
* Market Liquidity Risk
* Builder Execution Risk
* Documentation Completeness Risk

---

### Inputs

* Legal graph (docs + cases)
* RERA compliance status
* EC gaps
* Survey mismatch
* Market absorption data
* Builder history

---

### Scoring Model

```json
{
  "overallRisk": "Medium",
  "scores": {
    "legal": 82,
    "litigation": 68,
    "documentation": 90,
    "marketLiquidity": 75
  },
  "confidence": 0.91
}
```

---

### Outputs (UX)

* Risk radar chart
* Risk timeline (past → present)
* “What changed risk?” explanation

---

### AGENT-220: Risk Modeling Agent

**Tech Stack**

* Rules engine (deterministic)
* Light ML for calibration (optional)
* No generative scoring

**Hard Rule**

> Scores must be **traceable to inputs**

---

# 2️⃣ BANK-PANEL LAWYER MARKETPLACE (CONTROLLED)

---

## REQ-230: Bank-Panel Legal Services Integration

### Objective

Connect users to **verified bank-panel lawyers** only when risk or gaps are detected.

---

### DES-230: Contextual, Not Open Marketplace

Lawyers appear:

* Only after legal gaps detected
* Only for relevant geography
* Only for relevant issue type

---

### Lawyer Verification Criteria

* Bank empanelment proof
* State bar registration
* Experience category (title search, RERA, litigation)

---

### AGENT-230: Legal Service Matcher

**Inputs**

```json
{
  "riskType": "TitleGap",
  "state": "Telangana",
  "propertyType": "Apartment"
}
```

**Output**

```json
{
  "recommendedLawyers": [
    {
      "name": "XYZ Legal",
      "panel": ["SBI", "HDFC"],
      "specialization": "Title Verification"
    }
  ]
}
```

---

### UX Rules

* Show **reason for recommendation**
* No ranking by payment
* SLA & scope shown clearly

---

# 3️⃣ STATE-WISE LEGAL & REGULATORY ADAPTERS

---

## REQ-240: State-Specific Legal Interpretation Layer

### Objective

Normalize **state-specific legal differences** without confusing users.

---

### DES-240: Adapter Pattern (Critical)

Each state has:

* RERA schema adapter
* Registration/EC adapter
* Land record adapter
* Terminology mapper

---

### Example

| State       | Term   |
| ----------- | ------ |
| Telangana   | Pahani |
| Karnataka   | RTC    |
| Maharashtra | 7/12   |

All normalized to:

```json
"landRecordType": "REVENUE_RECORD"
```

---

### AGENT-240: State Adapter Agent

**Tech Stack**

* Rule-based mappings
* State metadata registry
* Versioned adapters

---

### UX Rule

> User sees **plain English**, state nuances appear only on demand.

---

# 4️⃣ CONTINUOUS MONITORING & ALERTS

---

## REQ-250: Legal & Project Change Monitoring

### Objective

Detect **post-purchase or pre-decision changes** that affect trust.

---

### What Is Monitored

* RERA status changes
* New court cases
* EC updates (new charges)
* Builder compliance updates
* Satellite-visible encroachments

---

### DES-250: Event-Based Monitoring

```
Scheduler
 → Data Fetch
 → Diff Engine
 → Severity Classifier
 → User Notification
```

---

### Alert Example

```json
{
  "type": "LEGAL_UPDATE",
  "severity": "High",
  "message": "New consumer case filed against promoter",
  "source": "eCourts",
  "action": "Review legal opinion"
}
```

---

### AGENT-250: Monitoring & Alert Agent

**Tech Stack**

* Scheduled Playwright jobs
* Change diff engine
* Notification service (email/app)

---

### UX Rules

* Alerts are:

  * Actionable
  * Source-linked
  * Severity-tagged
* No panic language

---

# 🔁 CROSS-INTEGRATION SUMMARY

| Requirement            | Feeds               | Consumes       |
| ---------------------- | ------------------- | -------------- |
| REQ-220 Risk Model     | Investor UX, Scores | Legal Graph    |
| REQ-230 Lawyer Market  | Suggestions         | Risk Model     |
| REQ-240 State Adapters | All legal logic     | State metadata |
| REQ-250 Monitoring     | Alerts, Scores      | All sources    |

---

# 🧠 UPDATED LEGAL INTELLIGENCE FLOW

```
Documents
 ↓
Extraction
 ↓
Trusted RAG
 ↓
Legal Graph
 ↓
Risk Model (REQ-220)
 ↓
Suggestions (REQ-190)
 ↓
Lawyer Connect (REQ-230)
 ↓
Monitoring (REQ-250)
```

---

# 🏁 FINAL RESULT

With these **4 additions**, your platform now supports:

* **Investor-grade due diligence**
* **Bank-aligned legal workflows**
* **Pan-India regulatory correctness**
* **Post-decision trust continuity**

This completes a **full legal + risk + action loop**, something even banks struggle to unify.

---







# 2️⃣ OPENAPI + MCP CONTRACTS

## (Authoritative Interfaces for Agents & Systems)

---

## 2.1 Core OpenAPI (Backend / BFF)

### 🔹 Property Context API

```yaml
GET /api/property/context
params:
  propertyId: string
returns:
  hero
  propertyType
  geo
  visibilityRules
  legalSummary
  marketSummary
  documentVaultMeta
```

---

### 🔹 Document Vault APIs

```yaml
GET /api/property/documents/meta
GET /api/property/documents/{docId}
```

* Raw PDFs only via `/documents/{docId}`
* All summaries come from MCP tools, not inline

---

### 🔹 Legal & Regulatory APIs

```yaml
GET /api/legal/rera
GET /api/legal/ec
GET /api/legal/survey
GET /api/legal/court-cases
```

Each response **must include**:

```json
{
  "data": {...},
  "source": "URL / Portal Name",
  "lastChecked": "ISO_DATE",
  "limitations": "string"
}
```

---

### 🔹 Risk & Score APIs

```yaml
GET /api/legal/risk-score
GET /api/legal/confidence-score
```

---

## 2.2 MCP TOOL CONTRACTS (MANDATORY FOR LLM)

> **LLM is forbidden from computing directly**

---

### 🔹 applyVastuFilter

```json
{
  "tool": "applyVastuFilter",
  "params": {
    "propertyId": "string",
    "style": "TRADITIONAL | PARTIAL",
    "areas": ["MAIN_DOOR", "KITCHEN"]
  }
}
```

---

### 🔹 getSunlightAndWind

```json
{
  "tool": "getSunlightAndWind",
  "params": {
    "flatTypeId": "string",
    "month": "May"
  }
}
```

---

### 🔹 summarizeLegalDocuments

```json
{
  "tool": "summarizeLegalDocuments",
  "params": {
    "propertyId": "string"
  }
}
```

---

### 🔹 linkCourtCases

```json
{
  "tool": "linkCourtCases",
  "params": {
    "surveyNos": ["123/AA"],
    "builderName": "string"
  }
}
```

---

### 🔹 generateLegalMindMap

```json
{
  "tool": "generateLegalMindMap",
  "params": {
    "propertyId": "string"
  }
}
```

---

# 3️⃣ END-TO-END DEMO SCRIPTS

## (Product, AI, and Agent Demonstration)

---

## 🎬 DEMO 1: Buyer → Legal Confidence

**User**: “Is this property legally safe?”

**Flow**

1. Global Search (AI mode)
2. MCP: `summarizeLegalDocuments`
3. MCP: `linkCourtCases`
4. MCP: `generateLegalMindMap`
5. Show:

   * Legal timeline
   * Court case links
   * Legal score
   * Suggestions (not advice)

**Result**

> “Records appear complete as per available data.
> One past case disposed in 2021. Bank legal opinion recommended.”

---

## 🎬 DEMO 2: Vastu-Sensitive Family

**User**: “Show me Vastu-good flats”

**Flow**

1. AI asks:

   * “Do you want Vastu considered?”
   * “Which areas?”
2. MCP: `applyVastuFilter`
3. Horizontal flat cards
4. Vertical explanation
5. Filter chips visible

---

## 🎬 DEMO 3: Investor Risk Review

**User**: “What’s the risk here?”

**Flow**

1. MCP: `getLegalRiskScore`
2. MCP: `linkCourtCases`
3. Radar chart + timeline
4. Suggestions:

   * “Title re-verification advised”
   * “EC gap from 1998–2003”

---

## 🎬 DEMO 4: Continuous Monitoring Alert

**System**

> “New consumer case detected against promoter”

**Flow**

1. Alert → severity HIGH
2. Click → legal diff view
3. MCP: `summarizeChange`
4. Action suggestion:

   * “Pause decision”
   * “Consult panel lawyer”

---

# 4️⃣ VC-READY ARCHITECTURE DIAGRAMS (TEXTUAL)

---

## 4.1 SYSTEM ARCHITECTURE (ONE SLIDE)

```
UI (RN / NativeWind)
   │
   ▼
Global Search Bar
   │
   ▼
Query Router
 ├─ ElasticSearch (facts)
 ├─ Vector DB (RAG)
 ├─ MCP Tools (compute)
   │
   ▼
LLM (Explain + Orchestrate)
   │
   ▼
UX (Lists / Diagrams / Scores)
```

---

## 4.2 TRUST & LEGAL PIPELINE (KEY DIFFERENTIATOR)

```
Gov Portals / Brochures / Surveys
        ↓
OCR + Extraction (Schema-bound)
        ↓
Trusted RAG Corpus
        ↓
Legal Graph (Docs ↔ Cases ↔ Approvals)
        ↓
Risk Model + Scores
        ↓
Mind Maps + Timelines + Suggestions
```

---

## 4.3 WHY YOU WIN (VC TALK TRACK)

| Problem              | Your Platform                 |
| -------------------- | ----------------------------- |
| Fragmented trust     | Unified legal graph           |
| Blind listings       | Evidence-linked digital twins |
| AI hallucination     | MCP + RAG + rules             |
| Manual due diligence | Automated, explainable        |
| One-time decision    | Continuous monitoring         |

---

## 4.4 MOAT (VERY IMPORTANT)

* Proprietary **schema graph**
* GeoJSON-anchored simulation
* Legal + spatial + interior unification
* AI constrained by tools (non-generic)

---

# 🔒 CODING AGENT FINAL INSTRUCTIONS (PIN THIS)

```text
- Never compute if MCP tool exists
- Never assume preferences
- Never hide data source
- Always attach limitations
- UNKNOWN > Guess
- Horizontal = visual
- Vertical = textual
```

---

## ✅ DELIVERY STATUS

You now have:

* ✅ OpenAPI + MCP contracts
* ✅ End-to-end demo scripts
* ✅ VC-ready architecture narratives

If you want next, I can:

* Generate **actual OpenAPI YAML**
* Produce **MCP server skeleton**
* Create **pitch deck slides (5–6 slides)**
* Write **investor FAQ**


