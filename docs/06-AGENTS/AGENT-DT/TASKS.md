# AGENT-DT TASKS (Digital Twin)

## CURRENT: Satellite & 3D Integration (Week 1-2)

### DT-001: Satellite Tile Enhancement ⏳
**Context**: We need high-res satellite imagery overlays.
- [ ] Source tiles from Mapbox Satellite.
- [ ] Create a "Masking" layer to highlight Project Boundaries.

### DT-002: 3D Model Optimization ⏳
**Tool**: Blender / glTF Pipeline
- [ ] Compress "Mangala Towers" `.glb` file to < 5MB.
- [ ] Bake lighting into textures (Mobile devices can't handle real-time shadows well).

### DT-003: Interactive Points of Interest (POI) ⏳
**File**: `apps/web/public/twins/mangala/poi.json`
- [ ] Define JSON schema for "Amenities" (Pool, Gym).
- [ ] Map 3D coordinates (x,y,z) to these POIs.
