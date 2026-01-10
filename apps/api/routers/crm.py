from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID, uuid4
from datetime import datetime

router = APIRouter()

# Schemas
class LeadCreate(BaseModel):
    buyer_id: UUID
    project_id: UUID
    consent_id: UUID

class LeadOut(BaseModel):
    id: UUID
    buyer_id: UUID
    project_id: UUID
    advisor_id: Optional[UUID]
    status: str
    created_at: datetime

# Mock DB for Demo
LEADS = []

@router.post("/leads", response_model=LeadOut)
async def create_lead(data: LeadCreate):
    """Register a new lead with mandatory consent."""
    # Logic: Verify one buyer per project rule
    for lead in LEADS:
        if lead["buyer_id"] == data.buyer_id and lead["project_id"] == data.project_id:
            raise HTTPException(status_code=400, detail="Lead already exists for this project")
    
    new_lead = {
        "id": uuid4(),
        **data.dict(),
        "advisor_id": None,
        "status": "NEW",
        "created_at": datetime.now()
    }
    LEADS.append(new_lead)
    return new_lead

@router.get("/leads/queue/{advisor_id}", response_model=List[LeadOut])
async def get_advisor_queue(advisor_id: UUID):
    """Get all leads assigned to a specific advisor/agent."""
    return [l for l in LEADS if l["advisor_id"] == advisor_id or l["advisor_id"] is None]

@router.post("/leads/{lead_id}/assign")
async def assign_lead(lead_id: UUID, advisor_id: UUID):
    """Assign an agent to a lead."""
    for lead in LEADS:
        if lead["id"] == lead_id:
            lead["advisor_id"] = advisor_id
            lead["status"] = "ACTIVE"
            return {"status": "success", "advisor_id": advisor_id}
    raise HTTPException(status_code=404, detail="Lead not found")

@router.get("/commissions/{agent_id}")
async def get_commissions(agent_id: UUID):
    """Calculate pending commissions for an agent."""
    # Dummy calculation logic
    active_leads = len([l for l in LEADS if l["advisor_id"] == agent_id and l["status"] == "ACTIVE"])
    return {
        "agent_id": agent_id,
        "pending_amount": active_leads * 50000, # Mock 50k per active lead
        "currency": "INR"
    }
