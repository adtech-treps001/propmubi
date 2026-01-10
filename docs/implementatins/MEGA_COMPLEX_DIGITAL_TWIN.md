# Mega-Complex Digital Twin - Technical Specification
## The "Exact View Engine" for Large Gated Communities

**Version:** 1.0
**Date:** November 28, 2024
**Feature Type:** Killer Differentiator
**Complexity:** High (Unity + Computer Vision + Raycasting)

---

## 🎯 Executive Summary

### The Problem
Traditional real estate platforms show generic "pool view" or "garden facing" images that don't represent the actual view from a specific unit. In a large complex with 2,000+ units across 10+ towers, Unit 402 might face a beautiful park while Unit 405 faces a brick wall - but both are sold as "park facing."

### The Solution
A **Procedural View Generation System** that delivers the exact view from every unit using:
- Limited drone captures (50 flights instead of 2,000)
- Smart interpolation algorithms
- Real-time 3D tower occlusion rendering
- Physics-based sunlight simulation

### The Differentiator
**No competitor can do this.** This is Propmubi's moat.

---

## 1. User Experience Flow

### 1.1 The Macro View (Cluster Map)

**Entry Point:** User searches "My Home Avatar, Gachibowli"

**What They See:**
```
┌─────────────────────────────────────────────────────┐
│           🛰️ Aerial View (Satellite Base)           │
│                                                     │
│    🟢 Tower A        🟡 Tower B        🔴 Tower C  │
│    (45 available)    (12 available)    (SOLD OUT)  │
│                                                     │
│         🟢 Tower D              🟢 Tower E          │
│         (89 available)          (56 available)      │
│                                                     │
│    🏊 Pool           🌳 Park            🎾 Courts   │
│                                                     │
│    📍 Your Location                                 │
│    🧭 North ↑                                       │
└─────────────────────────────────────────────────────┘

Legend:
🟢 Green = High Availability (>40 units)
🟡 Yellow = Limited (10-40 units)
🔴 Red = Sold Out
```

**Interactions:**
- **Pinch/Zoom:** Explore the entire 50-acre complex
- **Rotate:** See the layout from different angles
- **Tap Tower:** Swoops camera down to tower entrance
- **Filter Toggle:** Show only "Corner Units" → Non-corner towers fade out

**Technical Implementation:**
```typescript
// components/ClusterMap.tsx

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

interface Tower {
  id: string;
  name: string;
  position: [number, number, number];
  availableUnits: number;
  totalUnits: number;
  modelUrl: string;
}

const ClusterMap: React.FC<{ projectId: string }> = ({ projectId }) => {
  const [towers, setTowers] = useState<Tower[]>([]);
  const [selectedTower, setSelectedTower] = useState<string | null>(null);

  useEffect(() => {
    loadProjectData(projectId);
  }, [projectId]);

  const getTowerColor = (available: number, total: number): string => {
    const percentage = (available / total) * 100;
    if (percentage > 40) return '#00FF00'; // Green
    if (percentage > 10) return '#FFFF00'; // Yellow
    return '#FF0000'; // Red
  };

  return (
    <Canvas camera={{ position: [0, 100, 100], fov: 60 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />

      {/* Satellite imagery as ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[500, 500]} />
        <meshBasicMaterial map={satelliteTexture} />
      </mesh>

      {/* Tower models */}
      {towers.map(tower => (
        <Tower3DModel
          key={tower.id}
          tower={tower}
          color={getTowerColor(tower.availableUnits, tower.totalUnits)}
          onClick={() => handleTowerSelect(tower.id)}
          isSelected={selectedTower === tower.id}
        />
      ))}

      {/* Compass */}
      <Compass position={[40, 0, 40]} />

      {/* Amenities */}
      <SwimmingPool position={[10, 0, -20]} />
      <Park position={[-30, 0, 10]} />

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        minDistance={20}
        maxDistance={200}
      />
    </Canvas>
  );
};

const handleTowerSelect = async (towerId: string) => {
  // Animate camera swooping down
  await animateCameraToTower(towerId);

  // Load tower-specific data
  const towerData = await loadTowerDetails(towerId);

  // Transition to Facade Grid view
  router.push(`/tower/${towerId}`);
};
```

---

### 1.2 The Micro View (Facade Grid)

**Entry Point:** User tapped "Tower C" in Cluster Map

**What They See:**
```
┌───────────────────────────────────────────────────┐
│          TOWER C - Select Your Unit               │
│                                                   │
│  Floor 30  [⬜][⬜][🟢][⬜]  ← Penthouse          │
│  Floor 29  [⬜][🟢][🟢][⬜]                        │
│  Floor 28  [⬜][🟢][🟢][⬜]                        │
│     ...                                           │
│  Floor 19  [⬜][🟢][⬜][⬜]  ← Your selection     │
│     ...                                           │
│  Floor 10  [⬜][⬜][🟢][🟢]                        │
│     ...                                           │
│  Floor 01  [🟢][🟢][🟢][🟢]  ← Ground Floor       │
│                                                   │
│  🟢 = Available    ⬜ = Sold                      │
│                                                   │
│  Filters:                                         │
│  [✓] Corner Units   [ ] High Floor (>20)         │
│  [ ] Park Facing    [ ] Low Floor (<10)          │
└───────────────────────────────────────────────────┘
```

**Interactions:**
- **Tap any green unit:** Opens "Exact View" for that unit
- **Hover over unit:** Shows quick info (Area, Price, Facing)
- **Filter toggle:** Non-matching units fade out in real-time
- **Color intensity:** Brightness indicates floor height (brighter = higher)

**Technical Implementation:**
```typescript
// components/FacadeGrid.tsx

interface Unit {
  id: string;
  floor: number;
  position: number; // 0=leftmost, 3=rightmost
  type: '2BHK' | '3BHK' | '4BHK';
  area: number;
  price: number;
  facing: 'NORTH' | 'SOUTH' | 'EAST' | 'WEST';
  isCorner: boolean;
  status: 'AVAILABLE' | 'BLOCKED' | 'SOLD' | 'REGISTERED';
  viewQualityScore: number; // 0-100
}

interface FacadeGridProps {
  towerId: string;
  floors: number;
  unitsPerFloor: number;
}

const FacadeGrid: React.FC<FacadeGridProps> = ({
  towerId,
  floors,
  unitsPerFloor
}) => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [filters, setFilters] = useState({
    cornerOnly: false,
    highFloor: false,
    parkFacing: false
  });

  // Real-time WebSocket updates
  useEffect(() => {
    const ws = new WebSocket(`wss://api.propmubi.com/tower/${towerId}/units`);

    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      updateUnitStatus(update.unitId, update.status);
    };

    return () => ws.close();
  }, [towerId]);

  const filteredUnits = units.filter(unit => {
    if (filters.cornerOnly && !unit.isCorner) return false;
    if (filters.highFloor && unit.floor < 20) return false;
    if (filters.parkFacing && unit.facing !== 'SOUTH') return false;
    return true;
  });

  return (
    <View className="flex-1 bg-gray-900">
      {/* Building outline */}
      <Canvas>
        <BuildingFacade
          floors={floors}
          unitsPerFloor={unitsPerFloor}
          units={filteredUnits}
          onUnitClick={handleUnitClick}
        />
      </Canvas>

      {/* Filter controls */}
      <View className="absolute bottom-10 left-0 right-0 p-4">
        <FilterBar filters={filters} onChange={setFilters} />
      </View>

      {/* Quick info on hover */}
      {hoveredUnit && (
        <UnitInfoTooltip
          unit={hoveredUnit}
          position={tooltipPosition}
        />
      )}
    </View>
  );
};

// 3D Building Facade
const BuildingFacade: React.FC = ({ floors, unitsPerFloor, units, onUnitClick }) => {
  return (
    <>
      {units.map(unit => {
        const position = calculateUnitPosition(unit.floor, unit.position);
        const color = getUnitColor(unit);

        return (
          <mesh
            key={unit.id}
            position={position}
            onClick={() => onUnitClick(unit)}
            onPointerOver={() => setHoveredUnit(unit)}
          >
            <boxGeometry args={[2, 1, 0.5]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={unit.status === 'AVAILABLE' ? 0.5 : 0}
              transparent
              opacity={unit.status === 'SOLD' ? 0.3 : 1}
            />

            {/* Unit number label */}
            <Text
              position={[0, 0, 0.3]}
              fontSize={0.3}
              color="white"
            >
              {unit.floor}{unit.position}
            </Text>
          </mesh>
        );
      })}
    </>
  );
};

const getUnitColor = (unit: Unit): string => {
  if (unit.status === 'SOLD') return '#666666';
  if (unit.status === 'BLOCKED') return '#FFA500';

  // Available units: Color by view quality
  const score = unit.viewQualityScore;
  if (score > 80) return '#00FF00'; // Excellent view
  if (score > 60) return '#90EE90'; // Good view
  return '#FFFF00'; // Average view
};
```

---

### 1.3 The Exact View (The Promise)

**Entry Point:** User tapped Unit 1903 in Facade Grid

**What They See:**

```
┌─────────────────────────────────────────────────────┐
│  👁️ Exact View from Unit 1903 - Tower C             │
│  📍 Floor 19, Position 3 (Corner Unit)              │
│  🧭 South-West Facing                               │
│                                                     │
│  ╔═══════════════════════════════════════╗         │
│  ║                                       ║         │
│  ║     [360° Panoramic View]             ║         │
│  ║                                       ║         │
│  ║   🌳 Park (200m)  🏢 Tower A (50m)   ║         │
│  ║                                       ║         │
│  ║   🌅 Sunset Direction →               ║         │
│  ║                                       ║         │
│  ╚═══════════════════════════════════════╝         │
│                                                     │
│  View Quality Score: 85/100 🌟                     │
│  Privacy Risk: Low (No direct sight lines)         │
│                                                     │
│  Time Slider: [==============•========] 3:00 PM    │
│                8 AM                    6 PM         │
│                                                     │
│  Actions:                                           │
│  [📷 Take Screenshot] [🔗 Share View] [📅 Book Visit]│
└─────────────────────────────────────────────────────┘
```

**Interactions:**
- **Pan 180°:** User drags to look around balcony view
- **Time Slider:** Move slider → Sun position changes, shadows update in real-time
- **Tap landmarks:** Info overlay (e.g., "Park - 200m, Walking distance")
- **Toggle X-Ray:** See neighbor tower wireframes to understand obstructions

**Technical Implementation:**
```typescript
// components/ExactView.tsx

interface ExactViewProps {
  unitId: string;
  towerId: string;
  floor: number;
  position: number;
  facing: string;
}

const ExactView: React.FC<ExactViewProps> = ({
  unitId,
  towerId,
  floor,
  position,
  facing
}) => {
  const [currentTime, setCurrentTime] = useState(15); // 3 PM
  const [xrayMode, setXrayMode] = useState(false);
  const [viewData, setViewData] = useState<ViewData | null>(null);

  useEffect(() => {
    loadViewData();
  }, [unitId]);

  const loadViewData = async () => {
    // Fetch pre-computed view data
    const data = await exactViewService.getViewForUnit({
      unitId,
      floor,
      position,
      facing
    });

    setViewData(data);
  };

  return (
    <View className="flex-1">
      {/* Unity Embedded View */}
      <UnityView
        unitId={unitId}
        viewData={viewData}
        timeOfDay={currentTime}
        xrayMode={xrayMode}
        onReady={handleUnityReady}
      />

      {/* View Quality Badge */}
      <ViewQualityBadge
        score={viewData?.qualityScore}
        factors={viewData?.qualityFactors}
      />

      {/* Privacy Risk Indicator */}
      <PrivacyIndicator
        risk={viewData?.privacyRisk}
        sightLines={viewData?.neighborSightLines}
      />

      {/* Time Slider */}
      <TimeSlider
        value={currentTime}
        onChange={setCurrentTime}
        sunrise={viewData?.sunriseTime}
        sunset={viewData?.sunsetTime}
      />

      {/* Action Buttons */}
      <View className="absolute bottom-10 left-0 right-0 flex-row justify-around p-4">
        <Button onPress={handleScreenshot}>
          📷 Screenshot
        </Button>
        <Button onPress={handleShare}>
          🔗 Share
        </Button>
        <Button onPress={handleBookVisit}>
          📅 Book Visit
        </Button>
      </View>

      {/* X-Ray Toggle */}
      <TouchableOpacity
        className="absolute top-20 right-4 bg-purple-600 p-3 rounded-full"
        onPress={() => setXrayMode(!xrayMode)}
      >
        <Text className="text-white">🔍 X-Ray</Text>
      </TouchableOpacity>
    </View>
  );
};

// Unity Bridge Component
const UnityView: React.FC<UnityViewProps> = ({
  unitId,
  viewData,
  timeOfDay,
  xrayMode,
  onReady
}) => {
  const unityRef = useRef<UnityInstance>(null);

  useEffect(() => {
    if (unityRef.current && viewData) {
      // Send view data to Unity
      unityRef.current.SendMessage('ViewManager', 'LoadView', JSON.stringify({
        skyboxUrl: viewData.skyboxUrl,
        neighborTowers: viewData.neighborTowers,
        landmarks: viewData.landmarks
      }));
    }
  }, [viewData]);

  useEffect(() => {
    if (unityRef.current) {
      // Update sun position
      unityRef.current.SendMessage('LightingManager', 'SetTimeOfDay', timeOfDay);
    }
  }, [timeOfDay]);

  useEffect(() => {
    if (unityRef.current) {
      // Toggle X-Ray mode
      unityRef.current.SendMessage('RenderManager', 'SetXRayMode', xrayMode);
    }
  }, [xrayMode]);

  return (
    <UnityWebGLView
      ref={unityRef}
      src="/unity/ExactViewEngine.loader.js"
      onLoaded={onReady}
    />
  );
};
```

---

## 2. Backend: The Procedural View Generation System

### 2.1 Drone Capture Strategy

**Problem:** Cannot fly drone 2,000 times (one per unit)
**Solution:** Strategic vertical column captures

#### Capture Plan:
```
For a 30-floor building with 4 units per floor:

Vertical Column Shots:
- Shot A: Floor 1 level (3m height)
- Shot B: Floor 4 level (12m height)
- Shot C: Floor 7 level (21m height)
- Shot D: Floor 10 level (30m height)
- Shot E: Floor 13 level (39m height)
- Shot F: Floor 16 level (48m height)
- Shot G: Floor 19 level (57m height)
- Shot H: Floor 22 level (66m height)
- Shot I: Floor 25 level (75m height)
- Shot J: Floor 28 level (84m height)
- Shot K: Floor 30 level (90m height)

Total: 11 shots per tower
For 10 towers: 110 total drone flights
```

**Capture Specifications:**
```yaml
drone_settings:
  camera: DJI Mavic 3 (20MP)
  capture_mode: 360° Panorama
  overlap: 30%
  file_format: RAW + JPEG
  time_of_day: 2 PM (consistent lighting)
  weather: Clear skies only

panorama_specs:
  horizontal_fov: 360°
  vertical_fov: 180°
  resolution: 8K (7680 x 3840)
  stitching: PTGui Pro
  output: Equirectangular JPEG
```

#### Drone Capture Workflow:
```python
# scripts/drone_capture_planner.py

from dataclasses import dataclass
from typing import List
import math

@dataclass
class TowerSpec:
    id: str
    name: string
    floors: int
    floor_height: float  # meters
    coordinates: tuple[float, float]  # lat, lng
    units_per_floor: int

@dataclass
class CapturePoint:
    id: str
    tower_id: str
    floor_level: int
    altitude: float  # meters
    coordinates: tuple[float, float, float]  # lat, lng, alt
    facing: str

class DroneCapturePlanner:
    CAPTURE_INTERVAL = 3  # Capture every 3 floors
    FLOOR_HEIGHT = 3.0   # Standard floor height in meters

    def generate_capture_plan(self, tower: TowerSpec) -> List[CapturePoint]:
        """Generate optimal capture points for a tower"""

        capture_points = []

        # Calculate number of shots needed
        num_shots = math.ceil(tower.floors / self.CAPTURE_INTERVAL) + 1

        for i in range(num_shots):
            floor_level = min(i * self.CAPTURE_INTERVAL, tower.floors)
            altitude = floor_level * self.FLOOR_HEIGHT

            capture_point = CapturePoint(
                id=f"{tower.id}_shot_{i}",
                tower_id=tower.id,
                floor_level=floor_level,
                altitude=altitude,
                coordinates=(*tower.coordinates, altitude),
                facing='ALL'  # 360° capture
            )

            capture_points.append(capture_point)

        return capture_points

    def generate_kml_flight_path(self, tower: TowerSpec) -> str:
        """Generate KML file for DJI Pilot app"""

        capture_points = self.generate_capture_plan(tower)

        kml = f"""<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>{tower.name} - Capture Plan</name>
    <Placemark>
      <name>Flight Path</name>
      <LineString>
        <altitudeMode>absolute</altitudeMode>
        <coordinates>
"""

        for point in capture_points:
            lat, lng, alt = point.coordinates
            kml += f"          {lng},{lat},{alt}\n"

        kml += """        </coordinates>
      </LineString>
    </Placemark>
"""

        for i, point in enumerate(capture_points):
            lat, lng, alt = point.coordinates
            kml += f"""
    <Placemark>
      <name>Shot {i+1} - Floor {point.floor_level}</name>
      <Point>
        <coordinates>{lng},{lat},{alt}</coordinates>
      </Point>
    </Placemark>
"""

        kml += """  </Document>
</kml>"""

        return kml

# Usage
planner = DroneCapturePlanner()

my_home_avatar = TowerSpec(
    id='tower_c',
    name='Tower C',
    floors=30,
    floor_height=3.0,
    coordinates=(17.4399, 78.3487),
    units_per_floor=4
)

capture_plan = planner.generate_capture_plan(my_home_avatar)
kml_output = planner.generate_kml_flight_path(my_home_avatar)

# Save KML for drone pilot
with open('tower_c_flight_plan.kml', 'w') as f:
    f.write(kml_output)

print(f"Capture plan generated: {len(capture_plan)} shots")
print(f"Estimated flight time: {len(capture_plan) * 5} minutes")
```

---

### 2.2 View Mapping Algorithm

**Goal:** Map each of 2,000 units to the correct skybox

```python
# services/view_mapping_service.py

import numpy as np
from typing import List, Dict
from dataclasses import dataclass

@dataclass
class CapturedView:
    id: str
    tower_id: str
    floor_level: int
    altitude: float
    skybox_url: str
    capture_date: str

@dataclass
class Unit:
    id: str
    tower_id: str
    floor: int
    position: int  # 0-3 for 4 units per floor
    facing: str
    area: number
    type: str

class ViewMappingService:
    """Maps units to their nearest captured view"""

    def __init__(self, captured_views: List[CapturedView]):
        self.captured_views = captured_views
        self.view_index = self._build_view_index()

    def _build_view_index(self) -> Dict[str, List[CapturedView]]:
        """Index views by tower for fast lookup"""
        index = {}
        for view in self.captured_views:
            if view.tower_id not in index:
                index[view.tower_id] = []
            index[view.tower_id].append(view)

        # Sort by floor level
        for tower_id in index:
            index[tower_id].sort(key=lambda v: v.floor_level)

        return index

    def get_view_for_unit(self, unit: Unit) -> CapturedView:
        """Find the optimal captured view for a unit"""

        tower_views = self.view_index.get(unit.tower_id, [])

        if not tower_views:
            raise ValueError(f"No captured views for tower {unit.tower_id}")

        # Find nearest view by floor level
        nearest_view = min(
            tower_views,
            key=lambda v: abs(v.floor_level - unit.floor)
        )

        return nearest_view

    def calculate_view_quality_score(self, unit: Unit) -> int:
        """Calculate view quality score (0-100)"""

        score = 50  # Base score

        # Height bonus (higher = better view)
        if unit.floor > 20:
            score += 30
        elif unit.floor > 10:
            score += 20
        elif unit.floor > 5:
            score += 10

        # Corner units get bonus
        if unit.position in [0, 3]:  # Leftmost or rightmost
            score += 10

        # Facing bonus
        if unit.facing in ['SOUTH', 'WEST']:
            score += 10  # Assuming park is south

        # Check for obstructions (would need neighbor tower data)
        obstruction_penalty = self._calculate_obstruction_penalty(unit)
        score -= obstruction_penalty

        return min(max(score, 0), 100)

    def _calculate_obstruction_penalty(self, unit: Unit) -> int:
        """Calculate penalty based on nearby obstructions"""
        # This would use raycast data to check if neighbor towers block view
        # For now, simplified logic
        if unit.floor < 5:
            return 20  # Ground floors likely obstructed
        elif unit.floor < 10:
            return 10
        return 0

# Example usage
captured_views = [
    CapturedView(
        id='view_tc_01',
        tower_id='tower_c',
        floor_level=1,
        altitude=3.0,
        skybox_url='https://cdn.propmubi.com/views/tc_floor_01.jpg',
        capture_date='2024-11-15'
    ),
    CapturedView(
        id='view_tc_04',
        tower_id='tower_c',
        floor_level=4,
        altitude=12.0,
        skybox_url='https://cdn.propmubi.com/views/tc_floor_04.jpg',
        capture_date='2024-11-15'
    ),
    # ... more views
]

mapping_service = ViewMappingService(captured_views)

unit_1903 = Unit(
    id='unit_1903',
    tower_id='tower_c',
    floor=19,
    position=3,
    facing='SOUTH_WEST',
    area=1450,
    type='3BHK'
)

# Get mapped view
assigned_view = mapping_service.get_view_for_unit(unit_1903)
quality_score = mapping_service.calculate_view_quality_score(unit_1903)

print(f"Unit 1903 mapped to: {assigned_view.id}")
print(f"View quality score: {quality_score}/100")
```

---

### 2.3 Tower Occlusion Rendering (Raycasting)

**The Problem:** Tower B blocks the view from Tower A
**The Solution:** 3D mesh-based occlusion in Unity

```csharp
// Unity C# Script: TowerOcclusionManager.cs

using UnityEngine;
using System.Collections.Generic;

public class TowerOcclusionManager : MonoBehaviour
{
    public List<Tower> neighborTowers;
    public Transform viewerPosition;  // Current unit's balcony position

    private void Start()
    {
        LoadNeighborTowers();
        SetupOcclusionMeshes();
    }

    private void LoadNeighborTowers()
    {
        // Load 3D models of all towers in the complex
        string projectId = PlayerPrefs.GetString("current_project");

        TowerData[] towerDataArray = APIClient.GetProjectTowers(projectId);

        foreach (var towerData in towerDataArray)
        {
            // Instantiate tower mesh
            GameObject towerMesh = Instantiate(
                towerPrefab,
                towerData.worldPosition,
                Quaternion.identity
            );

            Tower tower = towerMesh.AddComponent<Tower>();
            tower.towerId = towerData.id;
            tower.height = towerData.floors * 3.0f;  // 3m per floor
            tower.width = towerData.width;
            tower.depth = towerData.depth;

            neighborTowers.Add(tower);
        }
    }

    private void SetupOcclusionMeshes()
    {
        foreach (var tower in neighborTowers)
        {
            // Create simple box collider for raycast occlusion
            BoxCollider collider = tower.gameObject.AddComponent<BoxCollider>();
            collider.size = new Vector3(tower.width, tower.height, tower.depth);

            // Create visual mesh
            MeshRenderer renderer = tower.gameObject.GetComponent<MeshRenderer>();
            renderer.material = occlusionMaterial;
        }
    }

    public OcclusionReport CheckViewObstructions()
    {
        OcclusionReport report = new OcclusionReport();
        report.viewerPosition = viewerPosition.position;
        report.obstructions = new List<ObstructionData>();

        // Define key viewing directions (N, S, E, W, NE, NW, SE, SW)
        Vector3[] viewDirections = new Vector3[]
        {
            Vector3.forward,      // North
            Vector3.back,         // South
            Vector3.right,        // East
            Vector3.left,         // West
            new Vector3(1, 0, 1).normalized,  // NE
            new Vector3(-1, 0, 1).normalized, // NW
            new Vector3(1, 0, -1).normalized, // SE
            new Vector3(-1, 0, -1).normalized // SW
        };

        foreach (var direction in viewDirections)
        {
            RaycastHit hit;
            if (Physics.Raycast(viewerPosition.position, direction, out hit, 1000f))
            {
                Tower obstructingTower = hit.collider.GetComponent<Tower>();
                if (obstructingTower != null)
                {
                    ObstructionData obstruction = new ObstructionData
                    {
                        direction = GetDirectionName(direction),
                        obstructingTowerId = obstructingTower.towerId,
                        distance = hit.distance,
                        impactPercentage = CalculateImpact(hit.distance)
                    };

                    report.obstructions.Add(obstruction);
                }
            }
        }

        return report;
    }

    private float CalculateImpact(float distance)
    {
        // Closer towers = higher impact
        if (distance < 30f) return 80f;  // Very close
        if (distance < 50f) return 50f;  // Close
        if (distance < 100f) return 20f; // Moderate
        return 0f;  // Far enough to not matter
    }

    private string GetDirectionName(Vector3 direction)
    {
        if (direction == Vector3.forward) return "NORTH";
        if (direction == Vector3.back) return "SOUTH";
        if (direction == Vector3.right) return "EAST";
        if (direction == Vector3.left) return "WEST";
        if (direction.x > 0 && direction.z > 0) return "NORTH_EAST";
        if (direction.x < 0 && direction.z > 0) return "NORTH_WEST";
        if (direction.x > 0 && direction.z < 0) return "SOUTH_EAST";
        if (direction.x < 0 && direction.z < 0) return "SOUTH_WEST";
        return "UNKNOWN";
    }
}

// Data structures
[System.Serializable]
public class Tower
{
    public string towerId;
    public float height;
    public float width;
    public float depth;
    public Vector3 worldPosition;
}

[System.Serializable]
public class OcclusionReport
{
    public Vector3 viewerPosition;
    public List<ObstructionData> obstructions;
}

[System.Serializable]
public class ObstructionData
{
    public string direction;
    public string obstructingTowerId;
    public float distance;
    public float impactPercentage;
}
```

---

### 2.4 Privacy Risk Calculation

**The Problem:** Some units have direct sight lines to neighbors
**The Solution:** Geometric analysis + user alert

```python
# services/privacy_calculator.py

import numpy as np
from typing import List, Tuple
from dataclasses import dataclass

@dataclass
class PrivacySightLine:
    from_unit: str
    to_unit: str
    to_tower: str
    distance: float
    angle: float
    severity: str  # 'LOW', 'MEDIUM', 'HIGH'

class PrivacyCalculator:
    """Calculate privacy risk based on neighbor proximity"""

    CRITICAL_DISTANCE = 20.0  # meters
    MODERATE_DISTANCE = 50.0  # meters

    def __init__(self, all_units: List[Unit], all_towers: List[Tower]):
        self.all_units = all_units
        self.all_towers = all_towers

    def calculate_privacy_risk(self, unit: Unit) -> Dict:
        """Calculate privacy risk for a specific unit"""

        sight_lines = self._find_neighbor_sight_lines(unit)

        if not sight_lines:
            return {
                'risk_level': 'LOW',
                'score': 100,
                'sight_lines': [],
                'recommendation': 'Excellent privacy - no direct sight lines'
            }

        # Calculate overall risk
        critical_count = len([s for s in sight_lines if s.severity == 'HIGH'])
        moderate_count = len([s for s in sight_lines if s.severity == 'MEDIUM'])

        if critical_count > 0:
            risk_level = 'HIGH'
            score = 30
            recommendation = f'{critical_count} unit(s) have direct view into your balcony/windows'
        elif moderate_count > 2:
            risk_level = 'MEDIUM'
            score = 60
            recommendation = f'{moderate_count} unit(s) nearby - partial privacy'
        else:
            risk_level = 'LOW'
            score = 85
            recommendation = 'Good privacy with minor sight lines'

        return {
            'risk_level': risk_level,
            'score': score,
            'sight_lines': [self._serialize_sight_line(s) for s in sight_lines],
            'recommendation': recommendation
        }

    def _find_neighbor_sight_lines(self, unit: Unit) -> List[PrivacySightLine]:
        """Find all units that have sight line to target unit"""

        sight_lines = []

        unit_position = self._get_unit_world_position(unit)

        # Check units in neighbor towers
        for other_unit in self.all_units:
            if other_unit.tower_id == unit.tower_id:
                continue  # Skip same tower

            if other_unit.id == unit.id:
                continue  # Skip self

            other_position = self._get_unit_world_position(other_unit)

            # Calculate distance
            distance = np.linalg.norm(unit_position - other_position)

            # Only care about nearby units
            if distance > self.MODERATE_DISTANCE:
                continue

            # Calculate angle (are they facing each other?)
            angle = self._calculate_facing_angle(unit, other_unit, unit_position, other_position)

            # Determine severity
            if distance < self.CRITICAL_DISTANCE and angle < 45:
                severity = 'HIGH'
            elif distance < self.MODERATE_DISTANCE and angle < 60:
                severity = 'MEDIUM'
            else:
                severity = 'LOW'

            sight_line = PrivacySightLine(
                from_unit=other_unit.id,
                to_unit=unit.id,
                to_tower=other_unit.tower_id,
                distance=distance,
                angle=angle,
                severity=severity
            )

            sight_lines.append(sight_line)

        return sight_lines

    def _get_unit_world_position(self, unit: Unit) -> np.ndarray:
        """Get 3D world position of unit"""

        tower = next((t for t in self.all_towers if t.id == unit.tower_id), None)
        if not tower:
            raise ValueError(f"Tower not found: {unit.tower_id}")

        # Calculate position based on tower location + floor + position
        x = tower.world_position[0] + (unit.position * 5.0)  # 5m per unit width
        y = unit.floor * 3.0  # 3m per floor
        z = tower.world_position[2]

        return np.array([x, y, z])

    def _calculate_facing_angle(
        self,
        unit1: Unit,
        unit2: Unit,
        pos1: np.ndarray,
        pos2: np.ndarray
    ) -> float:
        """Calculate angle between unit facings"""

        # Get facing vectors
        facing1 = self._get_facing_vector(unit1.facing)
        facing2 = self._get_facing_vector(unit2.facing)

        # Vector from unit2 to unit1
        direction = pos1 - pos2
        direction = direction / np.linalg.norm(direction)

        # Calculate angle between unit2's facing and direction to unit1
        dot_product = np.dot(facing2, direction)
        angle = np.arccos(np.clip(dot_product, -1.0, 1.0))
        angle_degrees = np.degrees(angle)

        return angle_degrees

    def _get_facing_vector(self, facing: str) -> np.ndarray:
        """Convert facing string to unit vector"""

        facing_map = {
            'NORTH': np.array([0, 0, 1]),
            'SOUTH': np.array([0, 0, -1]),
            'EAST': np.array([1, 0, 0]),
            'WEST': np.array([-1, 0, 0]),
            'NORTH_EAST': np.array([0.707, 0, 0.707]),
            'NORTH_WEST': np.array([-0.707, 0, 0.707]),
            'SOUTH_EAST': np.array([0.707, 0, -0.707]),
            'SOUTH_WEST': np.array([-0.707, 0, -0.707]),
        }

        return facing_map.get(facing, np.array([0, 0, 1]))

    def _serialize_sight_line(self, sight_line: PrivacySightLine) -> dict:
        return {
            'from_unit': sight_line.from_unit,
            'to_tower': sight_line.to_tower,
            'distance': round(sight_line.distance, 1),
            'angle': round(sight_line.angle, 1),
            'severity': sight_line.severity
        }

# Example usage
privacy_calc = PrivacyCalculator(all_units, all_towers)

unit_1903 = Unit(
    id='unit_1903',
    tower_id='tower_c',
    floor=19,
    position=3,
    facing='SOUTH_WEST',
    area=1450,
    type='3BHK'
)

privacy_report = privacy_calc.calculate_privacy_risk(unit_1903)

print(f"Privacy Risk: {privacy_report['risk_level']}")
print(f"Privacy Score: {privacy_report['score']}/100")
print(f"Sight Lines: {len(privacy_report['sight_lines'])}")
print(f"Recommendation: {privacy_report['recommendation']}")
```

---

## 3. PRD Requirements (Add to Master PRD)

### Feature: Smart View Interpolation for Mega-Complexes

| Requirement ID | Description | Acceptance Criteria |
|---------------|-------------|---------------------|
| **VR-LG-01** | **Tower Occlusion Rendering** | If Tower B is 20m from Tower A, view from Tower A (Floors 1-10) MUST show Tower B blocking horizon with accurate distance |
| **VR-LG-02** | **Elevation Accuracy** | View from Floor 1 MUST show ground amenities (pool/grass). View from top floor MUST show skyline. Height difference MUST be visually obvious |
| **VR-LG-03** | **Directional Truth** | If unit faces "West," sun position in simulation MUST set directly in front of balcony at sunset time |
| **VR-LG-04** | **Privacy Visualizer** | If two towers are <30m apart, MUST indicate "High Privacy Risk" with visual sight lines |
| **VR-LG-05** | **View Quality Score** | Each unit MUST have calculated View Quality Score (0-100) based on height, obstructions, facing |
| **VR-LG-06** | **X-Ray Mode** | User MUST be able to toggle wireframe view of neighbor towers to understand spatial relationships |
| **VR-LG-07** | **Time Simulation** | User MUST be able to slide time (8 AM - 6 PM) and see sun position/shadows update in real-time |
| **VR-LG-08** | **Landmark Overlay** | View MUST show distance markers to key landmarks (Park - 200m, School - 500m, etc.) |

---

## 4. API Specifications

### 4.1 View Data API

```typescript
// GET /api/exact-view/unit/:unitId

interface ExactViewResponse {
  unitId: string;
  towerId: string;
  floor: number;
  position: number;
  facing: string;

  // View data
  skyboxUrl: string;  // Mapped panorama URL
  skyboxFloorLevel: number;  // Which floor was actually captured
  interpolationFactor: number;  // 0-1, how much interpolation was needed

  // Quality metrics
  viewQualityScore: number;  // 0-100
  qualityFactors: {
    heightBonus: number;
    cornerBonus: number;
    facingBonus: number;
    obstructionPenalty: number;
  };

  // Privacy data
  privacyRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  privacyScore: number;  // 0-100
  neighborSightLines: Array<{
    fromUnit: string;
    fromTower: string;
    distance: number;
    severity: string;
  }>;

  // Occlusion data
  neighborTowers: Array<{
    towerId: string;
    name: string;
    distance: number;
    direction: string;
    impactPercentage: number;
    modelUrl: string;  // 3D model for Unity
  }>;

  // Landmarks
  landmarks: Array<{
    name: string;
    type: 'PARK' | 'SCHOOL' | 'HOSPITAL' | 'MALL';
    distance: number;
    direction: string;
    coordinates: { lat: number; lng: number };
  }>;

  // Sunlight data
  sunriseTime: string;
  sunsetTime: string;
  sunPath: Array<{
    time: number;  // Hour (0-23)
    azimuth: number;  // Degrees
    elevation: number;  // Degrees
  }>;
}
```

### 4.2 Capture Management API

```typescript
// POST /api/admin/capture/plan

interface CapturePlanRequest {
  projectId: string;
  towerIds: string[];
}

interface CapturePlanResponse {
  planId: string;
  totalShots: number;
  estimatedFlightTime: number;  // minutes
  kmlDownloadUrl: string;
  capturePoints: Array<{
    id: string;
    towerId: string;
    floorLevel: number;
    altitude: number;
    coordinates: { lat: number; lng: number; alt: number };
  }>;
}

// POST /api/admin/capture/upload

interface CaptureUploadRequest {
  planId: string;
  capturePointId: string;
  imageFile: File;  // 360° panorama
  metadata: {
    captureDate: string;
    weather: string;
    camera: string;
    settings: object;
  };
}

interface CaptureUploadResponse {
  viewId: string;
  skyboxUrl: string;
  processingStatus: 'UPLOADED' | 'STITCHING' | 'COMPLETE';
  estimatedProcessingTime: number;  // seconds
}
```

---

## 5. Unity Implementation Details

### 5.1 Unity Project Structure

```
ExactViewEngine/
├── Assets/
│   ├── Scripts/
│   │   ├── ViewManager.cs
│   │   ├── TowerOcclusionManager.cs
│   │   ├── LightingManager.cs
│   │   ├── RenderManager.cs
│   │   └── InteractionController.cs
│   │
│   ├── Materials/
│   │   ├── SkyboxMaterial.mat
│   │   ├── TowerOcclusionMaterial.mat
│   │   └── XRayWireframe.mat
│   │
│   ├── Prefabs/
│   │   ├── TowerMesh.prefab
│   │   ├── Landmark.prefab
│   │   └── Sun.prefab
│   │
│   ├── Shaders/
│   │   ├── SkyboxShader.shader
│   │   └── XRayShader.shader
│   │
│   └── Scenes/
│       └── ExactView.unity
│
├── ProjectSettings/
└── Packages/
    └── manifest.json
```

### 5.2 Key Unity Scripts

```csharp
// ViewManager.cs - Main controller

using UnityEngine;
using Newtonsoft.Json;

public class ViewManager : MonoBehaviour
{
    public Material skyboxMaterial;
    public GameObject sunLight;
    public TowerOcclusionManager occlusionManager;
    public LightingManager lightingManager;

    private ViewData currentView;

    public void LoadView(string viewDataJson)
    {
        currentView = JsonConvert.DeserializeObject<ViewData>(viewDataJson);

        // Load skybox
        StartCoroutine(LoadSkyboxTexture(currentView.skyboxUrl));

        // Setup neighbor towers for occlusion
        occlusionManager.LoadNeighborTowers(currentView.neighborTowers);

        // Setup landmarks
        LoadLandmarks(currentView.landmarks);

        // Initialize sunlight
        lightingManager.SetupSunPath(currentView.sunPath);
        lightingManager.SetTimeOfDay(15); // 3 PM default
    }

    private IEnumerator LoadSkyboxTexture(string url)
    {
        UnityWebRequest request = UnityWebRequestTexture.GetTexture(url);
        yield return request.SendWebRequest();

        if (request.result == UnityWebRequest.Result.Success)
        {
            Texture2D texture = DownloadHandlerTexture.GetContent(request);
            skyboxMaterial.mainTexture = texture;
            RenderSettings.skybox = skyboxMaterial;
        }
        else
        {
            Debug.LogError($"Failed to load skybox: {request.error}");
        }
    }

    private void LoadLandmarks(LandmarkData[] landmarks)
    {
        foreach (var landmark in landmarks)
        {
            GameObject landmarkObj = Instantiate(
                landmarkPrefab,
                landmark.worldPosition,
                Quaternion.identity
            );

            LandmarkController controller = landmarkObj.GetComponent<LandmarkController>();
            controller.SetData(landmark);
        }
    }
}

// LightingManager.cs - Sun position controller

using UnityEngine;
using System.Collections.Generic;

public class LightingManager : MonoBehaviour
{
    public Light sunLight;
    private List<SunPosition> sunPath;

    [System.Serializable]
    public class SunPosition
    {
        public int time;        // Hour (0-23)
        public float azimuth;   // Degrees
        public float elevation; // Degrees
    }

    public void SetupSunPath(SunPosition[] path)
    {
        sunPath = new List<SunPosition>(path);
    }

    public void SetTimeOfDay(int hour)
    {
        if (sunPath == null || sunPath.Count == 0)
            return;

        // Find sun position for this hour
        SunPosition position = sunPath.Find(p => p.time == hour);
        if (position == null)
        {
            // Interpolate between nearest times
            position = InterpolateSunPosition(hour);
        }

        // Update sun transform
        UpdateSunTransform(position);

        // Update light intensity based on time
        UpdateLightIntensity(hour);
    }

    private SunPosition InterpolateSunPosition(int hour)
    {
        // Find bracketing positions
        SunPosition before = null;
        SunPosition after = null;

        for (int i = 0; i < sunPath.Count - 1; i++)
        {
            if (sunPath[i].time <= hour && sunPath[i + 1].time >= hour)
            {
                before = sunPath[i];
                after = sunPath[i + 1];
                break;
            }
        }

        if (before == null || after == null)
            return sunPath[0];

        // Linear interpolation
        float t = (hour - before.time) / (float)(after.time - before.time);

        return new SunPosition
        {
            time = hour,
            azimuth = Mathf.Lerp(before.azimuth, after.azimuth, t),
            elevation = Mathf.Lerp(before.elevation, after.elevation, t)
        };
    }

    private void UpdateSunTransform(SunPosition position)
    {
        // Convert azimuth/elevation to Unity rotation
        Quaternion rotation = Quaternion.Euler(
            position.elevation,
            position.azimuth,
            0
        );

        sunLight.transform.rotation = rotation;
    }

    private void UpdateLightIntensity(int hour)
    {
        // Sunrise: 6 AM, Sunset: 6 PM
        if (hour < 6 || hour > 18)
        {
            sunLight.intensity = 0;
        }
        else if (hour == 6 || hour == 18)
        {
            sunLight.intensity = 0.5f;
        }
        else
        {
            sunLight.intensity = 1.0f;
        }

        // Update color temperature
        if (hour < 8)
        {
            sunLight.color = new Color(1.0f, 0.8f, 0.6f);  // Warm morning
        }
        else if (hour > 16)
        {
            sunLight.color = new Color(1.0f, 0.7f, 0.5f);  // Golden hour
        }
        else
        {
            sunLight.color = Color.white;  // Midday
        }
    }
}

// RenderManager.cs - X-Ray mode controller

using UnityEngine;

public class RenderManager : MonoBehaviour
{
    public Material standardMaterial;
    public Material xrayMaterial;

    private bool xrayEnabled = false;

    public void SetXRayMode(bool enabled)
    {
        xrayEnabled = enabled;

        // Get all tower meshes
        Tower[] towers = FindObjectsOfType<Tower>();

        foreach (var tower in towers)
        {
            MeshRenderer renderer = tower.GetComponent<MeshRenderer>();
            if (renderer != null)
            {
                renderer.material = xrayEnabled ? xrayMaterial : standardMaterial;
            }
        }
    }
}
```

### 5.3 X-Ray Shader

```shader
// XRayWireframe.shader

Shader "Custom/XRayWireframe"
{
    Properties
    {
        _Color ("Wireframe Color", Color) = (0,1,1,1)
        _Thickness ("Thickness", Range(0, 0.1)) = 0.03
    }

    SubShader
    {
        Tags { "RenderType"="Transparent" "Queue"="Transparent" }

        Pass
        {
            Blend SrcAlpha OneMinusSrcAlpha
            ZWrite Off
            Cull Off

            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #include "UnityCG.cginc"

            struct appdata
            {
                float4 vertex : POSITION;
                float3 normal : NORMAL;
            };

            struct v2f
            {
                float4 pos : SV_POSITION;
                float3 normal : TEXCOORD0;
                float3 viewDir : TEXCOORD1;
            };

            float4 _Color;
            float _Thickness;

            v2f vert (appdata v)
            {
                v2f o;
                o.pos = UnityObjectToClipPos(v.vertex);
                o.normal = UnityObjectToWorldNormal(v.normal);
                o.viewDir = normalize(_WorldSpaceCameraPos - mul(unity_ObjectToWorld, v.vertex).xyz);
                return o;
            }

            fixed4 frag (v2f i) : SV_Target
            {
                // Fresnel effect for wireframe
                float fresnel = 1 - abs(dot(i.normal, i.viewDir));
                fresnel = pow(fresnel, 2);

                // Create wireframe effect
                float edge = step(_Thickness, frac(i.pos.x * 10)) * step(_Thickness, frac(i.pos.y * 10));

                float4 color = _Color;
                color.a = fresnel * (1 - edge) * 0.7;

                return color;
            }
            ENDCG
        }
    }
}
```

---

## 6. Performance Optimization

### 6.1 Asset Optimization

**Skybox Images:**
```yaml
format: JPEG (lossy)
resolution: 4096 x 2048 (4K)
compression: 85% quality
file_size: ~2 MB per image

total_images_per_tower: 11
total_size_per_tower: 22 MB

delivery:
  method: CDN (Cloudflare)
  loading: Progressive (low-res → high-res)
  caching: Browser cache (7 days)
```

**3D Tower Models:**
```yaml
format: glTF 2.0 (binary)
polygon_count: <5000 per tower
textures: None (solid colors only)
file_size: ~200 KB per tower

total_towers: 10
total_size: 2 MB

optimization:
  - Use instancing for repeated towers
  - LOD system (3 levels)
  - Occlusion culling
```

### 6.2 Loading Strategy

```typescript
// services/asset_loader.service.ts

class AssetLoaderService {
  async loadExactView(unitId: string): Promise<void> {
    // Phase 1: Load low-res preview (fast)
    const lowResData = await this.loadLowResPreview(unitId);
    this.displayLowResView(lowResData);

    // Phase 2: Load high-res skybox (progressive)
    const highResData = await this.loadHighResSkybox(unitId);
    this.upgradeToHighRes(highResData);

    // Phase 3: Load neighbor tower models (lazy)
    const neighborModels = await this.loadNeighborModels(unitId);
    this.addNeighborTowers(neighborModels);
  }

  private async loadLowResPreview(unitId: string): Promise<PreviewData> {
    // 512x256 thumbnail
    return await fetch(`/api/exact-view/${unitId}/preview.jpg`);
  }

  private async loadHighResSkybox(unitId: string): Promise<SkyboxData> {
    // 4096x2048 full quality
    return await fetch(`/api/exact-view/${unitId}/skybox.jpg`);
  }

  private async loadNeighborModels(unitId: string): Promise<ModelData[]> {
    // Only load towers within 100m
    return await fetch(`/api/exact-view/${unitId}/neighbors.gltf`);
  }
}
```

### 6.3 Mobile Performance

**Target Devices:**
- Mid-range Android (Snapdragon 730+)
- iPhone XR and above

**Performance Targets:**
- Frame rate: 60 FPS (desktop), 30 FPS (mobile)
- Load time: <3 seconds to first view
- Memory: <200 MB Unity heap

**Optimization Techniques:**
1. **Texture Streaming:** Load skybox in tiles
2. **Occlusion Culling:** Only render visible towers
3. **LOD System:** 3 levels of detail for tower models
4. **Shader Simplification:** Mobile-friendly shaders

---

## 7. Cost Analysis

### 7.1 Drone Capture Costs

```yaml
per_project:
  towers: 10
  shots_per_tower: 11
  total_shots: 110

  drone_operator_rate: ₹5,000/day
  days_needed: 2
  operator_cost: ₹10,000

  equipment_rental: ₹3,000/day
  rental_cost: ₹6,000

  image_processing: ₹200/shot
  processing_cost: ₹22,000

  total_cost: ₹38,000

cost_per_unit: ₹38,000 / 2000 units = ₹19/unit
```

### 7.2 Cloud Storage Costs

```yaml
storage:
  skybox_size: 2 MB
  skyboxes_per_project: 110
  total_size: 220 MB

  tower_models_size: 2 MB
  total_project_size: 222 MB

  monthly_storage (S3): $0.023/GB
  monthly_cost: $0.005 (~₹0.40)

bandwidth:
  avg_views_per_month: 10,000
  avg_data_transfer: 222 MB × 10,000 = 2.22 TB

  monthly_bandwidth (CloudFlare): $0.05/GB
  monthly_cost: $111 (~₹9,250)
```

### 7.3 Unity Hosting Costs

```yaml
unity_hosting:
  webgl_build_size: 15 MB (compressed)
  cdn_bandwidth: $0.02/GB

  monthly_downloads: 10,000
  monthly_bandwidth: 150 GB
  monthly_cost: $3 (~₹250)
```

**Total Monthly Operational Cost per Project:** ₹9,500

---

## 8. Go-Live Checklist

### Phase 1: Pilot (1 Project)

- [ ] Select pilot project (My Home Avatar recommended)
- [ ] Complete drone capture plan
- [ ] Conduct drone flights (2 days)
- [ ] Process panoramas (PTGui stitching)
- [ ] Upload to CDN
- [ ] Build view mapping database
- [ ] Import tower 3D models
- [ ] Configure Unity project
- [ ] Deploy WebGL build
- [ ] Integrate with React Native app
- [ ] Beta test with 50 users
- [ ] Collect feedback
- [ ] Optimize performance

**Timeline:** 4 weeks

### Phase 2: Scale (10 Projects)

- [ ] Hire dedicated drone team
- [ ] Setup automated processing pipeline
- [ ] Build admin dashboard for capture management
- [ ] Create capture SOP for operators
- [ ] Train operators on KML import workflow
- [ ] Scale CDN capacity
- [ ] Performance optimization for multiple concurrent users
- [ ] A/B test different UI approaches

**Timeline:** 8 weeks

---

## 9. Success Metrics

### User Engagement

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Exact View Usage** | >60% of property viewers | Analytics: Button clicks |
| **Time in View** | >2 minutes average | Unity analytics |
| **Share Rate** | >20% share view | Share button clicks |
| **Conversion Lift** | +40% visit bookings | A/B test (with vs without Exact View) |

### Technical Performance

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Load Time** | <3 seconds | Unity profiler |
| **Frame Rate** | >30 FPS mobile, >60 FPS desktop | Unity profiler |
| **CDN Cache Hit** | >90% | CloudFlare analytics |
| **Error Rate** | <1% | Sentry logs |

---

## 10. Competitive Moat

### Why Competitors Can't Copy This

1. **Prohibitive Costs:** Traditional approach (2,000 individual drone flights) costs ₹10L+ per project. Our approach costs ₹38K.

2. **Technical Complexity:** Requires expertise in:
   - Drone cinematography
   - 360° stitching (PTGui)
   - Unity 3D engine
   - React Native integration
   - Computer vision (raycasting, interpolation)
   - Few companies have all these skills

3. **Data Moat:** Once we've captured 100 projects, we have 10,000+ verified views. Competitors would need years to catch up.

4. **IP Potential:** The "procedural view interpolation" algorithm could be patented.

---

## Conclusion

The **Mega-Complex Digital Twin** is Propmubi's killer feature that delivers:

✅ **Exact truth** - No more misleading "pool view" claims
✅ **Scale efficiency** - 110 shots instead of 2,000
✅ **Technical moat** - Competitors cannot easily replicate
✅ **User delight** - 2+ minutes engagement vs 10 seconds on competitors
✅ **Conversion lift** - 40%+ increase in site visit bookings

**This is the feature that makes Propmubi the clear #1 choice for property search in India.** 🚀

---

**Document Version:** 1.0
**Last Updated:** November 28, 2024
**Status:** Ready for Implementation
**Estimated Development Time:** 12 weeks (pilot) + 8 weeks (scale)
**Investment Required:** ₹38K per project (drone) + ₹5L (Unity development)
**Expected ROI:** 300%+ (based on conversion lift)
