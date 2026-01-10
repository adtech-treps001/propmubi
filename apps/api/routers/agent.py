from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID, uuid4
from datetime import datetime

router = APIRouter()

# Schemas
class AgentOnboard(BaseModel):
    user_id: UUID
    license_number: str
    territory: str

class SoftSupplyListing(BaseModel):
    property_name: str
    location: str
    price: float
    description: str

class AgentListingOut(BaseModel):
    id: UUID
    agent_id: UUID
    status: str
    property_details: dict
    created_at: datetime

# Mock DB for Demo
AGENTS = {}
LISTINGS = []

@router.post("/onboard")
async def onboard_agent(data: AgentOnboard):
    """Register an agent with a license and territory."""
    AGENTS[data.user_id] = {
        **data.dict(),
        "credibility_score": 50,
        "is_authorized": True
    }
    return {"status": "success", "agent": AGENTS[data.user_id]}

@router.post("/ingest/whatsapp")
async def ingest_whatsapp_listing(agent_id: UUID, listing: SoftSupplyListing):
    """Simulate WhatsApp bot ingestion of soft supply."""
    if agent_id not in AGENTS:
        raise HTTPException(status_code=403, detail="Unauthorized agent")
    
    new_listing = {
        "id": uuid4(),
        "agent_id": agent_id,
        "status": "SOCIAL_SIGNAL",
        "property_details": listing.dict(),
        "created_at": datetime.now()
    }
    LISTINGS.append(new_listing)
    return {"status": "success", "listing_id": new_listing["id"]}

@router.get("/listings", response_model=List[AgentListingOut])
async def get_agent_listings(agent_id: Optional[UUID] = None):
    """List all agent-sourced properties."""
    if agent_id:
        return [l for l in LISTINGS if l["agent_id"] == agent_id]
    return LISTINGS

@router.post("/listings/{listing_id}/verify")
async def verify_listing(listing_id: UUID):
    """Promote a Social Signal listing to Verified."""
    for l in LISTINGS:
        if l["id"] == listing_id:
            l["status"] = "VERIFIED"
            # Logic: Increase agent credibility
            agent_id = l["agent_id"]
            if agent_id in AGENTS:
                AGENTS[agent_id]["credibility_score"] += 5
            return {"status": "success", "new_status": "VERIFIED"}
    raise HTTPException(status_code=404, detail="Listing not found")
