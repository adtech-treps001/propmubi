from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from typing import Optional
from uuid import UUID

router = APIRouter()

# --- Pydantic Models ---
class LoginRequest(BaseModel):
    mobile: str
    otp: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    role: str

class ConsentRequest(BaseModel):
    consent_type: str
    valid_until: str # ISO format

# --- Endpoints ---

@router.post("/login", response_model=TokenResponse)
async def login(req: LoginRequest):
    """
    Exchanges OTP for JWT Access Token.
    Note: In dev, OTP '0000' is hardcoded validity.
    """
    if req.otp != "0000":
        raise HTTPException(status_code=401, detail="Invalid OTP")
    
    # Mock Token Generation
    return {
        "access_token": "mock_jwt_token_ey...",
        "token_type": "bearer",
        "role": "BUYER"
    }

@router.post("/consent/request")
async def request_aa_consent(req: ConsentRequest):
    """
    Initiates an Account Aggregator consent flow.
    """
    # Logic to call Setu/Anumati API would go here
    return {
        "status": "INITIATED",
        "consent_handle": "uuid-consent-handle",
        "redirect_url": "https://anumati.in/approve?handle=..."
    }
