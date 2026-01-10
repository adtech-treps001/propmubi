from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import json
import os

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

@router.get("/feed", response_model=List[ProjectCard])
async def get_project_feed():
    """
    Returns list of Trending Projects (Scraped Data).
    """
    data_path = os.path.join("apps", "api", "trending_data.json")
    try:
        with open(data_path, "r") as f:
            data = json.load(f)
            # Map scraped data to schema
            return [
                ProjectCard(
                    id=p["id"],
                    name=p["name"],
                    developer=p["developer"],
                    location=p["location"],
                    price_range=p["price_range"],
                    image=p["image"],
                    trust_score=p.get("sentiment_score", 92),
                    coordinates=p.get("coordinates"),
                    type=p.get("type")
                ) for p in data
            ]
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
