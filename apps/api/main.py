from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from apps.api.routers import auth, projects, legal, inspections, agent, crm, ingest, content
from pydantic import BaseModel

app = FastAPI(title="PropMubi Trust OS API")

# Enable CORS for Web/Mobile
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Shared State (In-Memory for Demo)
GLOBAL_STATS = {
    "verified_leads": 142,
    "unverified_leads": 45,
    "trust_score": 92
}

class LeadSchema(BaseModel):
    propertyId: str
    userId: str

@app.get("/dashboard/stats")
def get_stats():
    return GLOBAL_STATS

@app.post("/leads")
def create_demo_lead(lead: LeadSchema):
    # Simulate Logic: If user is 'verified', increment verified count
    GLOBAL_STATS["verified_leads"] += 1
    return {"status": "success", "new_count": GLOBAL_STATS["verified_leads"]}

# Register All Routers
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(projects.router, prefix="/projects", tags=["Projects"])
app.include_router(legal.router, prefix="/legal", tags=["Legal"])
app.include_router(inspections.router, prefix="/inspections", tags=["Inspections"])
app.include_router(agent.router, prefix="/agent", tags=["Agent Network"])
app.include_router(crm.router, prefix="/crm", tags=["CRM Governance"])
app.include_router(ingest.router, prefix="/ingest", tags=["AI Magic"])
app.include_router(content.router, prefix="/content", tags=["Content Studio"])
