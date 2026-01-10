from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from uuid import UUID, uuid4

router = APIRouter()

class DocumentVerification(BaseModel):
    id: UUID
    asset_id: UUID
    doc_type: str # SALE_DEED, TAX_RECEIPT
    status: str = "PENDING"
    lawyer_notes: Optional[str] = None
    verified_at: Optional[datetime] = None

# Mock DB
VERIFICATIONS = []

@router.post("/verify/upload", response_model=DocumentVerification)
async def upload_document(asset_id: UUID, doc_type: str):
    """
    Uploads a document for verification.
    """
    doc = DocumentVerification(
        id=uuid4(),
        asset_id=asset_id,
        doc_type=doc_type,
        status="PENDING"
    )
    VERIFICATIONS.append(doc)
    return doc

@router.get("/verify/status/{doc_id}", response_model=DocumentVerification)
async def check_status(doc_id: UUID):
    """
    Checks the status of a verification request.
    """
    for doc in VERIFICATIONS:
        if doc.id == doc_id:
            # Simulate Lawyer Action
            if len(VERIFICATIONS) > 1: # Just a dummy logic to simulate toggle
                doc.status = "VERIFIED"
                doc.verified_at = datetime.now()
            return doc
    raise HTTPException(status_code=404, detail="Document not found")
