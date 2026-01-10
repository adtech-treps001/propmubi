# PROPMUBI TRUST OS MANIFEST
> "We didn’t digitize real estate. We removed ambiguity from it."

## 1. PRODUCT VISION & CORE INVARIANTS
* **Definition**: Real Estate Decision & Transaction Operating System.
* **Purpose**: Replace brochures and fragmented workflows with **360° verifiable truth**.
* **Core Invariants** (Immutable rules):
    * One property = One canonical listing
    * One buyer = One lead
    * One advisor = One owner of relationship
    * One price = No manipulation
* **AI Role**: Explanatory only. Never authoritative. Refuses if data is missing.

## 2. LISTING PLATFORM (BROCHURE-LESS)
* **Scope**: Apartments, gated communities, villas, plots.
* **Mechanism**: No duplicates. Canonical `project_id`, `tower_id`, `unit_id`.
* **Experience**: Listings are living profiles, not static ads. "Project Truth View" replaces PDF brochures.

## 3. GEO-SPATIAL & LOCATION TRUTH
* **Experience**: Google Earth-like embedded web view.
* **Tech**: GeoJSON, GIS DB, Cesium/MapLibre.
* **Modeling**: All towers mapped with true north, shadow impact, and obstruction modeling.

## 4. PERSONA-BASED POINTS OF INTEREST (POI)
* **Personas**: Family, Investor, Rental, NRI, Senior, Commuter.
* **Data**: Schools, Hospitals, Transit, Infra (Metro/Roads).
* **Visualization**: Layered and filterable by persona needs.

## 5. DIGITAL TWIN — PROJECT LEVEL
* **Mapping**: Tower height, orientation, spacing via GeoJSON.
* **Classification**: Typical floors, Refuge, Amenities, Parking.
* **Journey**: Site Entry -> Lobby -> Lift -> Corridor -> Unit Door.

## 6. ENVIRONMENTAL SIMULATION
* **Sunlight**: Seasonal, hour-by-hour (Geometry based).
* **Wind**: Area patterns, obstructions, cross-ventilation scoring.
* **Noise/Privacy**: Road proximity, lift shaft impact, neighbor visibility.

## 7. HOUSE / UNIT LEVEL STRUCTURAL TRUTH
* **Sources**: CAD, Floor plans, Manual surveys.
* **Data**: Dimensions, Wall positions, Electrical/Plumbing points.
* **Specs**: RCC structure, Flooring, Finishes.

## 8. VASTU (EXPLICIT OPT-IN)
* **Rule**: Never apply silently.
* **Logic**: Ask user preference (Traditional/Modern). Explain outcomes specifically.

## 9. INTERIOR DESIGN → MANUFACTURING
* **Input**: Persona-based (Family/Rental).
* **Constraints**: Geometry, Materials, Ergonomics.
* **Output**: CNC-ready cut lists, DXF, IKEA-like assembly instructions.

## 10. PLOTS — SPECIALIZED HANDLING
* **features**: Exact survey boundaries, Encroachment monitoring (Satellite), Zoning risks.

## 11. LEGAL & REGULATORY INTELLIGENCE (INDIA)
* **Sources**: RERA, EC, Courts, ISRO/Bhuvan.
* **Output**: Ownership chain, Legal mind maps, Case linkage.
* **Constraint**: No legal advice, only explainable score.

## 12. BUILDER PROFILE & RATING
* **Trust Index**: Execution, Legal, Experience, Bank Confidence.
* **Sentiment**: Controlled ingestion from Reviews/Social.
* **Feature**: Canonical Builder Profile covering all projects history.

## 13. PRICING & NEGOTIATION
* **Truth**: Immutable price versions. Canonical inventory.
* **Intelligence**: Negotiation ranges, tier-based insider context.

## 14. BUILDER PLATFORM (B2B)
* **Features**: White-label site, Inventory CRM, Marketing orchestration.

## 15. WHATSAPP-FIRST OPERATIONS
* **Channels**: Buyer args, Agent groups, Builder updates.
* **Audit**: All comms logged.

## 16. BUYER FINANCIAL ENGINE
* **Features**: Buying power assertion, Loan eligibility, Bank matching.

## 17. INSPECTION & QUALITY
* **Features**: Progress tracking, Defect audits, Snagging.

## 18. POST-PURCHASE LIFECYCLE
* **Features**: Rental management, Resale monitoring, Infra alerts.

## 19. AI ARCHITECTURE & GOVERNANCE
* **Stack**: ElasticSearch (Facts), Vector DB (RAG), LLM (Explanation).
* **Rules**: No hallucination. Sources mandatory.

## 20-21. REVENUE MODELS
* **Buyer**: Subscription tiers (Discovery -> Lifetime Pass).
* **Builder/Bank**: SaaS, Success fees, Commissions.

## 22-23. ECONOMICS & DEFENSIBILITY
* **Moat**: Canonical truth layer, Legal/Spatial graph, High switching costs.

## 26. CRM SERVICES (GOVERNANCE ENGINE)
* **Philosophy**: Governance over Contact Dump.
* **Core**: One Buyer = One Lead (Deduplicated via Phone/Email).
* **Consent**: Mandatory, scoped (Advisor/Builder), auditable.
* **Lifecycle**: New -> Consent -> Active -> Booking -> Post-Sale.

## 27-28. AGENT SERVICES (REGULATED)
* **Role**: Agents are licensed, verified participants.
* **Ops**: Assigned territory/projects. Microsites for marketing.
* **Governance**: Performance tracking (Conversion, Compliance).
* **Revenue**: Protected commissions, no lead resale.

## 31-47. MARKETING AUTOMATION (TRUTH AMPLIFICATION)
* **Principle**: Marketing is a byproduct of Trust OS data.
* **Inputs**: Canonical data, Digital Twin, Legal summaries.
* **Outputs**: Social posts, Reels, WhatsApp cards, Microsites.
* **Governance**: Source-linked, Builder-approved, No AI invention.
* **Channels**: WhatsApp (India-First), Instagram, LinkedIn.

## 48-51. PERSONA-BASED COMPARISON & SELECTION
* **Concept**: Comparison is persona-driven (Investor vs Family).
* **Micro-Market**: Selected by connectivity/employment.
* **Selection**: Bottom-up (Tower -> Floor -> Unit -> Plot).

## 52. AGENT LISTING NETWORK (SUPPLY SENSORS)
* **Model**: Agents as local supply sensors (Village/Soft-supply).
* **Rules**: No anonymous listings. "Social-Only" listings flagged until verified.
* **Score**: Agent Credibility Score based on accuracy.

## 53-54. COMPLETION
* **Summary**: Platform scales from Metro Apartments to Village Plots without breaking truth invariants.
