from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import json
import os
import random

router = APIRouter()

# Schema for Map Response (GeoJSON)
class GeoJSONResponse(BaseModel):
    type: str = "FeatureCollection"
    features: List[Dict[str, Any]]

class ProjectCard(BaseModel):
    id: str
    name: str
    developer: str
    location: str
    price_range: str
    image: str
    trust_score: int = 92
    coordinates: Optional[List[float]] = None
    type: Optional[str] = None
    gallery: Optional[List[str]] = None
    has_3d_layout: Optional[bool] = False
    bhk_types: Optional[List[str]] = None

class FloorPlan3D(BaseModel):
    project_id: str
    bhk_type: str
    carpet_area: int  # sq ft
    layout_url: str  # 3D model URL
    thumbnail: str  # Preview image
    rooms: Dict[str, int]  # room_type: count
    features: List[str]

@router.get("/feed")
async def get_project_feed():
    """
    Returns list of Trending Projects with real images and 3D layout info.
    """
    data_path = os.path.join("apps", "api", "trending_data.json")
    try:
        with open(data_path, "r") as f:
            data = json.load(f)
            # Return full data including gallery, 3d layout info, etc.
            return data
    except FileNotFoundError:
        return []

@router.get("/map", response_model=GeoJSONResponse)
async def get_project_map(lat: float = 0, long: float = 0, radius: int = 5000):
    """
    Returns Project Locations as GeoJSON.
    Allows mixing Static Seed Data (Mangala) with Dynamic Trending Data.
    """
    features = []
    
    # 1. Load Static Seed (Detailed Boundaries)
    seed_path = os.path.join("apps", "api", "seeds", "mangala.geojson")
    if os.path.exists(seed_path):
        with open(seed_path, "r") as f:
            static_data = json.load(f)
            features.extend(static_data.get("features", []))

    # 2. Ingest Trending Data (Point Markers)
    data_path = os.path.join("apps", "api", "trending_data.json")
    if os.path.exists(data_path):
        with open(data_path, "r") as f:
            trending = json.load(f)
            for p in trending:
                features.append({
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [p["coordinates"][1], p["coordinates"][0]] # GeoJSON is [Lon, Lat]
                    },
                    "properties": {
                        "id": p["id"],
                        "name": p["name"],
                        "price": p["price_range"],
                        "type": "project_marker"
                    }
                })

    return {"type": "FeatureCollection", "features": features}

@router.get("/{project_id}/3d-layouts", response_model=List[FloorPlan3D])
async def get_3d_layouts(project_id: str):
    """
    Generate 3D floor plan layouts for a project.
    Uses procedural generation to create realistic apartment layouts.
    """
    # Load project data
    data_path = os.path.join("apps", "api", "trending_data.json")
    try:
        with open(data_path, "r") as f:
            projects = json.load(f)
            project = next((p for p in projects if p["id"] == project_id), None)

            if not project:
                raise HTTPException(status_code=404, detail="Project not found")

            if not project.get("has_3d_layout", False):
                raise HTTPException(status_code=404, detail="3D layouts not available for this project")

            # Generate 3D layouts for each BHK type
            layouts = []
            bhk_types = project.get("bhk_types", [])

            for bhk in bhk_types:
                layout = generate_3d_layout(project_id, project["name"], bhk)
                layouts.append(layout)

            return layouts
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Project data not found")

def generate_3d_layout(project_id: str, project_name: str, bhk_type: str) -> FloorPlan3D:
    """
    Generate a procedural 3D floor plan layout.
    Simulates AI-generated layouts with realistic dimensions.
    """
    # Extract BHK number
    bhk_num = int(bhk_type.replace("BHK", "").replace("Penthouse", "4").replace("Duplex", "5").replace("Villa", "3"))

    # Calculate carpet area based on BHK
    base_area = 600  # sq ft per bedroom
    carpet_area = base_area + (bhk_num * 400) + random.randint(-100, 200)

    # Define rooms based on BHK
    rooms = {
        "bedrooms": bhk_num,
        "bathrooms": bhk_num + 1 if bhk_num >= 3 else bhk_num,
        "living_room": 1,
        "kitchen": 1,
        "balconies": 2 if bhk_num >= 3 else 1
    }

    # Add features based on BHK type
    features = ["Modular Kitchen", "Vitrified Flooring", "False Ceiling"]
    if bhk_num >= 3:
        features.extend(["Master Bedroom with Attached Bath", "Servant Room", "Utility Area"])
    if "Penthouse" in bhk_type:
        features.extend(["Private Terrace", "Home Automation", "Premium Fixtures"])
    if "Duplex" in bhk_type:
        features.extend(["Internal Staircase", "Double Height Living", "Sky Terrace"])
    if "Villa" in bhk_type:
        features.extend(["Private Garden", "Car Porch", "Compound Wall"])

    # Generate 3D model URL (using placeholder 3D models from web)
    # In production, this would call a real 3D generation service
    layout_variations = [
        "https://threejs.org/examples/models/gltf/LittlestTokyo.glb",
        "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Box/glTF/Box.gltf",
        "https://modelviewer.dev/shared-assets/models/Astronaut.glb"
    ]

    # Thumbnail images (floor plan sketches)
    thumbnail_urls = [
        f"https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&q=80",
        f"https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&q=80",
        f"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80",
        f"https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&q=80"
    ]

    return FloorPlan3D(
        project_id=project_id,
        bhk_type=bhk_type,
        carpet_area=carpet_area,
        layout_url=random.choice(layout_variations),
        thumbnail=random.choice(thumbnail_urls),
        rooms=rooms,
        features=features
    )
