# 🎨 UX MVP PLAN - PROPMUBI TRUST OS

**Goal**: Deliver a "Demo-Ready" experience with Real Content and Premium Aesthetics.
**Standard**: Follows "Optimal UX Agent Instructions" (Aura/shadcn inspired).

---

## 1. CONSUMER APP (Mobile Web / PWA)

### A. Immersive Feed (`/consumer`)
**Data Source**: Scraped Trending Projects (My Home, Aparna, etc.)
**UX Pattern**: Vertical Scroll (TikTok Style)
- **Visuals**: Full-screen Hero Image (Scraped Logic).
- **Overlays**: Bottom-aligned gradient for readability.
- **Micro-Interactions**: Double-tap to "Like/Shortlist".
- **Primary CTA**: "Book Verified Visit" (Floating Glassmorphic Button).
- **Trust Elements**: "PropMubi Score: 94" Badge (Green/Gold).

### B. Interactive Map (`/consumer/map`)
**Data Source**: GeoJSON (Trending + Seeded)
**UX Pattern**: Mapbox/Google Maps Style
- **Markers**: Price Bubbles (e.g., "₹ 1.2 Cr") that expand on hover.
- **Layers**: Toggle for "Satellite", "Trust Heatmap", "Price Heatmap".
- **Drawer**: Bottom sheet summary when a marker is clicked.

---

## 2. AGENT PLATFORM (Desktop/Tablet)

### A. Agent Command Center (`/agent`)
**Data Source**: CRM Service + Mock Leads
**UX Pattern**: Bento Grid Dashboard
- **Metric Cards**: Glancing headers for Active Leads, Commission Pipeline.
- **Lead Queue**: Interactive Table with "Status Pills" (New, Contacted, Closing).
- **Supply Sensors**: Real-time feed of "Soft Supply" (WhatsApp ingestion).
- **Action**: "Verify" button triggers a confetti animation on success.

### B. Content Studio (`/agent/studio`) - *Phase 3 Focus*
**Data Source**: Content Generation Service
**UX Pattern**: Split Screen Creator
- **Left**: Asset Picker (Verified Listings).
- **Center**: Video Preview (16:9 or 9:16 toggle).
- **Right**: Template Controls ("Modern", "Luxury").
- **Output**: "Generate Reel" button with progress ring.

### C. Magic Onboarding (`/onboard`)
**Data Source**: Ingest Service (AI)
**UX Pattern**: File Drop / Wizard
- **Drop Zone**: Large, dashed area with "Drag RERA Card Here".
- **Feedback**: Terminal-style log output ("OCR Scanning... Success").
- **Result**: Form auto-fills in real-time. "Wow" moment.

---

## 3. BUILDER PORTAL (Desktop)

### A. Trust Analytics (`/builder`)
**Data Source**: Dashboard Service (Polling)
**UX Pattern**: High-Density Dashboard
- **Charts**: Interactive Chart.js widgets (Line, Doughnut).
- **Real-Time**: Blinking "Live" indicator.
- **Trust Score**: Central gauge visualization.

---

## 4. AGENTS MICROSITE (Public Web)

### A. Agent Portfolio (`/microsite/[subdomain]`)
**Data Source**: Agent Service
**UX Pattern**: Link-in-Bio / Landing Page
- **Header**: High-res Agent Avatar + "Verified" Checkmark.
- **Gallery**: Grid of verified listing cards.
- **Contact**: Sticky "WhatsApp Me" button (Brand Green).

---

## 🚀 EXECUTION ORDER

1.  **Refine `/consumer`**: Wire up `GET /projects/feed` (Real Scraped Data).
2.  **Polish `/onboard`**: Ensure drag-drop animation is smooth.
3.  **Launch `/agent/studio`**: Build the UI for reel generation.
4.  **Final Polish**: Check Global CSS (Fonts, Gradients) across all pages.

---

## 5. MANIFESTO UX ENHANCEMENTS (Trust OS 2.0)

### A. Global Context Switcher
- **UI Element**: Pill-toggle in Nav Bar (e.g., "Family Mode" vs "Investor Mode").
- **Effect**: Re-ranks feeds, changes highlighted tags ("Schools" vs "Yield").

### B. Vastu & Digital Twin
- **Location**: Deep inside `/projects/[id]/twin`.
- **Toggle**: "Vastu Mode" (Explicit Opt-In).
- **Visualization**: 3D Sunlight & Wind simulation layers.

### C. Persona-Based Comparison
- **Route**: `/compare?ids=101,102`.
- **UX**: Split screen "Head-to-Head".
- **Logic**: Highlights "Why A > B" based on active Persona.
