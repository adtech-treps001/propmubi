# 👾 AGENTIC DEVELOPMENT GUIDE (PropMubi)

## 1. 🧠 Project Philosophy: "Visual First"
Unlike typical CRUD apps, PropMubi is about **Spatial Context**.
*   **Rule**: If it has an address, it MUST have a Lat/Long.
*   **Rule**: All UI must overlay on Maps or Video (Transparent layers).

## 2. 🤖 Agent Protocols

### Mobile Agent (AGENT-MOB)
*   **Performance**: Frame drops are unacceptable on the Feed. Use `memo` and optimized Lists.
*   **Platform**: Test boundaries on iOS (Safe Area) vs Android (Back button).

### Digital Twin Agent (AGENT-DT)
*   **Format**: Use `glTF` (binary) for all 3D models.
*   **Coordinate System**: All 3D models must anchor to real-world Lat/Long via `Mapbox Mercator`.

### Backend Agent (AGENT-BE)
*   **Async**: All Geo-queries must be Async IO.
*   **Caching**: aggressive caching for the Feed (User location buckets).

## 3. 🔄 Change Management
(Standard "Feedback -> Decision -> Task" flow applies)
