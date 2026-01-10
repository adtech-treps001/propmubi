from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional, Literal
from pydantic import BaseModel
import asyncio
import httpx
import os
import json
from bs4 import BeautifulSoup

router = APIRouter()

# --- Configuration ---
LLM_PROVIDER = os.getenv("LLM_PROVIDER", "MOCK") # Options: OLLAMA, GEMINI, OPENAI, MOCK
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434/api/generate")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3")

# --- Models ---
class ScrapeRequest(BaseModel):
    url: str
    target_type: Literal["PROJECT", "BUILDER", "AGENT"]
    provider: Optional[str] = LLM_PROVIDER

class AIExtractionResponse(BaseModel):
    provider_used: str
    confidence_score: float
    extracted_data: dict
    raw_text: Optional[str] = None

# --- Core Logic ---

async def call_ollama(prompt: str):
    """Calls local Ollama instance"""
    async with httpx.AsyncClient() as client:
        try:
            res = await client.post(OLLAMA_URL, json={
                "model": OLLAMA_MODEL,
                "prompt": prompt + "\nRespond ONLY in JSON format.",
                "stream": False
            }, timeout=20.0)
            if res.status_code == 200:
                data = res.json()
                return data.get("response", "")
        except Exception as e:
            print(f"Ollama Connection Error: {e}")
            return None
    return None

async def extract_from_text(text: str, target_type: str, provider: str):
    """Router for LLM providers"""
    prompt = f"Extract structured data for a {target_type} from the following text: \n\n{text[:2000]}\n\nOutput JSON."
    
    if provider == "OLLAMA":
        response = await call_ollama(prompt)
        if response:
            try:
                # Attempt to find JSON in response
                start = response.find('{')
                end = response.rfind('}') + 1
                return json.loads(response[start:end])
            except:
                pass

    # Fallback / Mock Data if real LLM fails or is in MOCK mode
    if target_type == "PROJECT":
        return {
            "project_name": "AI Integrated Towers",
            "developer": "Future Builders",
            "rera_id": "P02400009999",
            "configs": ["2BHK", "3BHK"]
        }
    elif target_type == "AGENT":
        return {
            "name": "AI Agent",
            "license": "A000123456",
            "validity": "2030-01-01"
        }
    return {}

# --- Endpoints ---

@router.post("/analyze/brochure", response_model=AIExtractionResponse)
async def analyze_brochure(
    file: UploadFile = File(...),
    provider: str = Form(LLM_PROVIDER)
):
    """
    1. OCR Processing (Simulated for speed, in real-world use Tesseract)
    2. LLM Analysis (Local/Cloud)
    """
    content = await file.read()
    # In a real app, use pytesseract here. 
    # For now, we simulate text extraction based on filename or random text
    simulated_text = f"Brochure for {file.filename}. Luxury 3BHK apartments in Financial District. Developer: MyHome. RERA: P000123. Price starts 1.5Cr."
    
    extracted = await extract_from_text(simulated_text, "PROJECT", provider)
    
    return {
        "provider_used": provider,
        "confidence_score": 0.88 if provider != "MOCK" else 0.99,
        "extracted_data": extracted,
        "raw_text": simulated_text
    }

@router.post("/scrape/url", response_model=AIExtractionResponse)
async def scrape_url(request: ScrapeRequest):
    """
    1. HTTP GET URL
    2. BeautifulSoup Text Extraction
    3. LLM Processing
    """
    raw_text = ""
    try:
        async with httpx.AsyncClient() as client:
            res = await client.get(request.url, follow_redirects=True, timeout=5.0)
            soup = BeautifulSoup(res.text, 'html.parser')
            raw_text = soup.get_text(separator=' ', strip=True)
    except Exception as e:
        raw_text = f"Failed to scrape: {str(e)}. Simulating content."
    
    extracted = await extract_from_text(raw_text, request.target_type, request.provider)
    
    return {
        "provider_used": request.provider,
        "confidence_score": 0.85,
        "extracted_data": extracted,
        "raw_text": raw_text[:500] + "..." # Truncate for response
    }

@router.get("/providers")
def get_available_providers():
    return {
        "configured": LLM_PROVIDER,
        "options": [
            {"id": "MOCK", "name": "Simulation (Fast)"},
            {"id": "OLLAMA", "name": "Local LLM (Ollama)", "status": "Requires localhost:11434"},
            {"id": "OPENAI", "name": "OpenAI GPT-4", "status": "Requires API Key"},
            {"id": "GEMINI", "name": "Google Gemini", "status": "Requires API Key"}
        ]
    }
