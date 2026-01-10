from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from uuid import UUID, uuid4

router = APIRouter()

class Snag(BaseModel):
    id: UUID
    unit_id: UUID
    category: str # ELECTRICAL, PLUMBING
    description: str
    severity: str # MINOR, MAJOR
    status: str = "OPEN"
    photos: List[str] = []

SNAGS = []

@router.post("/snags", response_model=Snag)
async def report_snag(unit_id: UUID, category: str, description: str, severity: str):
    """
    Reports a new snag (defect) during inspection.
    """
    snag = Snag(
        id=uuid4(),
        unit_id=unit_id,
        category=category,
        description=description,
        severity=severity
    )
    SNAGS.append(snag)
    return snag

@router.get("/snags/{unit_id}", response_model=List[Snag])
async def get_unit_snags(unit_id: UUID):
    """
    Returns all snags for a specific unit.
    """
    return [s for s in SNAGS if s.unit_id == unit_id]
