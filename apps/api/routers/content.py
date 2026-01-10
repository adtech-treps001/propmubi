from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import asyncio
import random
from uuid import uuid4
from datetime import datetime

router = APIRouter()

# --- Models ---

class ReelRequest(BaseModel):
    listing_id: str
    template_id: str = "modern_fast" # modern_fast, luxury_slow, minimal
    music_mood: str = "upbeat"      # upbeat, chill, cinematic
    duration_seconds: int = 15

class ReelResponse(BaseModel):
    reel_id: str
    status: str
    video_url: str
    thumbnail_url: str
    generated_at: str
    metadata: dict

# --- Simulated Content Logic ---

COVERS = [
    "https://images.unsplash.com/photo-1600596542815-e328701102b9?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80"
]

@router.post("/generate/reel", response_model=ReelResponse)
async def generate_reel(request: ReelRequest):
    """
    Simulates AI Video Generation.
    1. Fetches Property Data (Mocked here, normally redundant DB fetch)
    2. Composes 'Scenes' based on template.
    3. Renders MP4 (Simulated delay).
    """
    
    # 1. Simulate AI Processing Time (Rendering is heavy!)
    delay = random.uniform(3.0, 5.0) 
    await asyncio.sleep(delay)
    
    # 2. Mock Logic based on inputs
    reel_id = f"reel_{uuid4().hex[:8]}"
    
    # In a real system, this would call FFMPEG or an External API (D-ID/HeyGen)
    
    return {
        "reel_id": reel_id,
        "status": "COMPLETED",
        "video_url": f"https://mock-cdn.propmubi.com/reels/{reel_id}.mp4",
        "thumbnail_url": random.choice(COVERS),
        "generated_at": datetime.now().isoformat(),
        "metadata": {
            "template": request.template_id,
            "scenes": 5,
            "audio_track": f"royalty_free_{request.music_mood}.mp3"
        }
    }

@router.get("/templates")
def get_templates():
    return [
        {"id": "modern_fast", "name": "⚡ Modern Fast Cut", "ideal_for": "Affordable Housing"},
        {"id": "luxury_slow", "name": "💎 Luxury Cinematic", "ideal_for": "Premium Villas"},
        {"id": "minimal", "name": "✨ Minimalist Info", "ideal_for": "Plots & Land"}
    ]
