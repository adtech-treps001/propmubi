"""
Builder CRM System
Comprehensive CRM for builders to manage profiles, projects, inventory, agents, and leads
"""

from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel, EmailStr
from typing import List, Dict, Any, Optional
from datetime import datetime
import json
import os
import uuid

router = APIRouter()

# ==================== MODELS ====================

class BuilderProfile(BaseModel):
    builder_id: str
    company_name: str
    rera_number: str
    contact_email: EmailStr
    contact_phone: str
    established_year: int
    headquarters: str
    website: Optional[str] = None
    logo: Optional[str] = None
    total_projects: int = 0
    completed_projects: int = 0
    ongoing_projects: int = 0
    reputation_score: int = 0
    verification_status: str = "pending"  # pending, verified, rejected
    documents: List[Dict[str, str]] = []  # [{"type": "RERA", "url": "...", "status": "verified"}]

class ProjectCreate(BaseModel):
    name: str
    location: str
    rera_number: str
    project_type: str  # apartment, villa, plot, commercial
    total_units: int
    price_range: str
    launch_date: str
    possession_date: str
    amenities: List[str]
    description: str

class Project(BaseModel):
    project_id: str
    builder_id: str
    name: str
    location: str
    rera_number: str
    project_type: str
    total_units: int
    price_range: str
    launch_date: str
    possession_date: str
    amenities: List[str]
    description: str
    descriptions_by_persona: Dict[str, str] = {}  # AI-generated persona-based descriptions
    documents: List[Dict[str, Any]] = []  # Brochures, floor plans, legal docs
    status: str = "active"  # active, completed, on-hold
    created_at: str = datetime.now().isoformat()

class UnitInventory(BaseModel):
    unit_id: str
    project_id: str
    tower: str
    floor: int
    unit_number: str
    bhk_type: str
    carpet_area: int
    price: float
    status: str  # available, blocked, booked, sold
    blocked_by: Optional[str] = None  # agent_id or buyer_id
    blocked_until: Optional[str] = None
    booking_date: Optional[str] = None
    buyer_id: Optional[str] = None

class AgentOnboarding(BaseModel):
    agent_id: str
    builder_id: str
    full_name: str
    email: EmailStr
    phone: str
    rera_number: Optional[str] = None
    experience_years: int
    languages: List[str]
    specialization_areas: List[str]  # ["Gachibowli", "Financial District"]
    assigned_projects: List[str] = []
    status: str = "active"  # active, inactive, suspended
    onboarded_at: str = datetime.now().isoformat()

class Lead(BaseModel):
    lead_id: str
    builder_id: str
    project_id: str
    source: str  # website, whatsapp, listing_portal, social_media, cold_call
    buyer_name: str
    buyer_phone: str
    buyer_email: Optional[EmailStr] = None
    interested_bhk: List[str]
    budget_range: str
    financial_profile: Optional[Dict[str, Any]] = None  # eKYC data
    qualification_score: int = 0  # 0-100
    assigned_agent_id: Optional[str] = None
    status: str = "new"  # new, qualified, contacted, site_visit, negotiation, closed, lost
    created_at: str = datetime.now().isoformat()
    last_contacted: Optional[str] = None

class WebhookConfig(BaseModel):
    webhook_id: str
    builder_id: str
    event_type: str  # lead_created, unit_booked, payment_received
    url: str
    method: str = "POST"
    headers: Dict[str, str] = {}
    is_active: bool = True

class ContentTemplate(BaseModel):
    template_id: str
    builder_id: str
    project_id: str
    content_type: str  # description, brochure, social_post, email
    persona: str  # family, investor, nri, first_time_buyer
    content: str
    generated_by_ai: bool = False
    created_at: str = datetime.now().isoformat()

# ==================== IN-MEMORY STORAGE (Replace with DB) ====================

BUILDERS = {}
PROJECTS = {}
INVENTORY = {}
AGENTS = {}
LEADS = {}
WEBHOOKS = {}
CONTENT_TEMPLATES = {}

# ==================== BUILDER PROFILE MANAGEMENT ====================

@router.post("/builders/onboard", response_model=BuilderProfile)
async def onboard_builder(
    company_name: str = Form(...),
    rera_number: str = Form(...),
    contact_email: str = Form(...),
    contact_phone: str = Form(...),
    established_year: int = Form(...),
    headquarters: str = Form(...),
    website: Optional[str] = Form(None),
    rera_certificate: UploadFile = File(...)
):
    """
    Onboard a new builder with RERA verification
    """
    builder_id = str(uuid.uuid4())

    # Simulate document upload
    rera_doc_url = f"https://storage.propmubi.com/documents/{builder_id}/rera_certificate.pdf"

    builder = BuilderProfile(
        builder_id=builder_id,
        company_name=company_name,
        rera_number=rera_number,
        contact_email=contact_email,
        contact_phone=contact_phone,
        established_year=established_year,
        headquarters=headquarters,
        website=website,
        documents=[{
            "type": "RERA_CERTIFICATE",
            "url": rera_doc_url,
            "status": "pending_verification",
            "uploaded_at": datetime.now().isoformat()
        }]
    )

    BUILDERS[builder_id] = builder.dict()
    return builder

@router.get("/builders/{builder_id}", response_model=BuilderProfile)
async def get_builder_profile(builder_id: str):
    """Get builder profile"""
    if builder_id not in BUILDERS:
        raise HTTPException(status_code=404, detail="Builder not found")
    return BUILDERS[builder_id]

@router.put("/builders/{builder_id}/verify")
async def verify_builder(builder_id: str, status: str, notes: str = ""):
    """Admin: Verify builder RERA and approve profile"""
    if builder_id not in BUILDERS:
        raise HTTPException(status_code=404, detail="Builder not found")

    BUILDERS[builder_id]["verification_status"] = status
    BUILDERS[builder_id]["documents"][0]["status"] = "verified" if status == "verified" else "rejected"

    return {"status": "success", "message": f"Builder {status}", "notes": notes}

# ==================== PROJECT MANAGEMENT ====================

@router.post("/builders/{builder_id}/projects", response_model=Project)
async def create_project(
    builder_id: str,
    project: ProjectCreate,
    brochure: Optional[UploadFile] = File(None),
    floor_plans: Optional[List[UploadFile]] = File(None)
):
    """
    Create a new project with document uploads
    AI will summarize brochures and extract key information
    """
    if builder_id not in BUILDERS:
        raise HTTPException(status_code=404, detail="Builder not found")

    project_id = str(uuid.uuid4())

    # Simulate document uploads
    documents = []
    if brochure:
        documents.append({
            "type": "brochure",
            "url": f"https://storage.propmubi.com/projects/{project_id}/brochure.pdf",
            "ai_summary": "Luxury 3BHK apartments with world-class amenities in prime location",
            "uploaded_at": datetime.now().isoformat()
        })

    if floor_plans:
        for i, plan in enumerate(floor_plans):
            documents.append({
                "type": "floor_plan",
                "bhk_type": f"{i+2}BHK",
                "url": f"https://storage.propmubi.com/projects/{project_id}/floor_plan_{i+2}bhk.pdf",
                "uploaded_at": datetime.now().isoformat()
            })

    # Generate AI persona-based descriptions
    descriptions_by_persona = generate_persona_descriptions(project.name, project.description)

    new_project = Project(
        project_id=project_id,
        builder_id=builder_id,
        **project.dict(),
        descriptions_by_persona=descriptions_by_persona,
        documents=documents
    )

    PROJECTS[project_id] = new_project.dict()

    # Update builder stats
    BUILDERS[builder_id]["total_projects"] += 1
    BUILDERS[builder_id]["ongoing_projects"] += 1

    return new_project

@router.get("/builders/{builder_id}/projects")
async def get_builder_projects(builder_id: str):
    """Get all projects for a builder"""
    if builder_id not in BUILDERS:
        raise HTTPException(status_code=404, detail="Builder not found")

    projects = [p for p in PROJECTS.values() if p["builder_id"] == builder_id]
    return projects

@router.put("/projects/{project_id}/documents/summarize")
async def summarize_project_document(project_id: str, document_url: str):
    """
    AI-powered document summarization
    Extracts key information from brochures, floor plans, legal docs
    """
    if project_id not in PROJECTS:
        raise HTTPException(status_code=404, detail="Project not found")

    # Simulate AI summarization
    summary = {
        "key_highlights": [
            "Prime location with excellent connectivity",
            "World-class amenities including clubhouse and gym",
            "RERA approved with clear possession timeline",
            "Competitive pricing with flexible payment plans"
        ],
        "unit_types": ["2BHK: 1200 sq ft", "3BHK: 1650 sq ft", "4BHK: 2300 sq ft"],
        "price_insights": "Starting from ₹65 Lakhs, market competitive",
        "legal_status": "RERA approved, clear title, no encumbrances",
        "delivery_timeline": "36 months from booking",
        "confidence_score": 92
    }

    return summary

def generate_persona_descriptions(project_name: str, base_description: str) -> Dict[str, str]:
    """Generate AI-powered persona-based descriptions"""
    return {
        "family": f"{project_name} offers spacious family homes with excellent schools nearby, safe playgrounds, and a vibrant community. Perfect for growing families seeking quality lifestyle.",
        "investor": f"{project_name} presents a solid investment opportunity with 12-15% appreciation potential. Prime location ensures strong rental yields and capital appreciation.",
        "nri": f"{project_name} provides hassle-free investment for NRIs with transparent processes, digital documentation, and trusted builder reputation. Easy repatriation and rental management available.",
        "first_time_buyer": f"{project_name} welcomes first-time homebuyers with affordable pricing, flexible payment plans, and end-to-end assistance. Your dream home journey starts here."
    }

# ==================== INVENTORY MANAGEMENT ====================

@router.post("/projects/{project_id}/inventory", response_model=UnitInventory)
async def add_unit_to_inventory(project_id: str, unit: UnitInventory):
    """Add a unit to project inventory"""
    if project_id not in PROJECTS:
        raise HTTPException(status_code=404, detail="Project not found")

    unit_id = str(uuid.uuid4())
    unit.unit_id = unit_id
    unit.project_id = project_id

    INVENTORY[unit_id] = unit.dict()
    return unit

@router.get("/projects/{project_id}/inventory")
async def get_project_inventory(project_id: str, status: Optional[str] = None):
    """
    Get inventory for a project with optional status filter
    Status: available, blocked, booked, sold
    """
    if project_id not in PROJECTS:
        raise HTTPException(status_code=404, detail="Project not found")

    units = [u for u in INVENTORY.values() if u["project_id"] == project_id]

    if status:
        units = [u for u in units if u["status"] == status]

    # Group by status for dashboard
    stats = {
        "available": len([u for u in units if u["status"] == "available"]),
        "blocked": len([u for u in units if u["status"] == "blocked"]),
        "booked": len([u for u in units if u["status"] == "booked"]),
        "sold": len([u for u in units if u["status"] == "sold"]),
        "total": len(units)
    }

    return {"units": units, "stats": stats}

@router.put("/inventory/{unit_id}/status")
async def update_unit_status(
    unit_id: str,
    status: str,
    blocked_by: Optional[str] = None,
    blocked_until: Optional[str] = None,
    buyer_id: Optional[str] = None
):
    """
    Update unit status: available → blocked → booked → sold
    """
    if unit_id not in INVENTORY:
        raise HTTPException(status_code=404, detail="Unit not found")

    unit = INVENTORY[unit_id]

    # Validate status transitions
    valid_transitions = {
        "available": ["blocked"],
        "blocked": ["available", "booked"],
        "booked": ["sold", "available"],
        "sold": []
    }

    if status not in valid_transitions.get(unit["status"], []):
        raise HTTPException(
            status_code=400,
            detail=f"Invalid transition from {unit['status']} to {status}"
        )

    unit["status"] = status

    if status == "blocked":
        unit["blocked_by"] = blocked_by
        unit["blocked_until"] = blocked_until
    elif status == "booked":
        unit["booking_date"] = datetime.now().isoformat()
        unit["buyer_id"] = buyer_id

    return {"status": "success", "unit": unit}

# ==================== AGENT/EMPLOYEE ONBOARDING ====================

@router.post("/builders/{builder_id}/agents/onboard", response_model=AgentOnboarding)
async def onboard_agent(builder_id: str, agent: AgentOnboarding):
    """
    Onboard a new agent/employee for the builder
    Captures RERA details, experience, languages, specialization areas
    """
    if builder_id not in BUILDERS:
        raise HTTPException(status_code=404, detail="Builder not found")

    agent_id = str(uuid.uuid4())
    agent.agent_id = agent_id
    agent.builder_id = builder_id

    AGENTS[agent_id] = agent.dict()

    return agent

@router.get("/builders/{builder_id}/agents")
async def get_builder_agents(builder_id: str, status: Optional[str] = None):
    """Get all agents for a builder"""
    if builder_id not in BUILDERS:
        raise HTTPException(status_code=404, detail="Builder not found")

    agents = [a for a in AGENTS.values() if a["builder_id"] == builder_id]

    if status:
        agents = [a for a in agents if a["status"] == status]

    return agents

@router.put("/agents/{agent_id}/assign-projects")
async def assign_projects_to_agent(agent_id: str, project_ids: List[str]):
    """Assign projects to an agent"""
    if agent_id not in AGENTS:
        raise HTTPException(status_code=404, detail="Agent not found")

    AGENTS[agent_id]["assigned_projects"] = project_ids

    return {"status": "success", "assigned_projects": project_ids}

# ==================== CRM API & WEBHOOK INTEGRATION ====================

@router.post("/builders/{builder_id}/webhooks", response_model=WebhookConfig)
async def configure_webhook(builder_id: str, webhook: WebhookConfig):
    """
    Configure webhook for external CRM integration
    Events: lead_created, unit_booked, payment_received, site_visit_scheduled
    """
    if builder_id not in BUILDERS:
        raise HTTPException(status_code=404, detail="Builder not found")

    webhook_id = str(uuid.uuid4())
    webhook.webhook_id = webhook_id
    webhook.builder_id = builder_id

    WEBHOOKS[webhook_id] = webhook.dict()

    return webhook

@router.get("/builders/{builder_id}/webhooks")
async def get_webhooks(builder_id: str):
    """Get all webhooks for a builder"""
    if builder_id not in BUILDERS:
        raise HTTPException(status_code=404, detail="Builder not found")

    webhooks = [w for w in WEBHOOKS.values() if w["builder_id"] == builder_id]
    return webhooks

@router.post("/api/external/lead")
async def receive_external_lead(
    builder_id: str,
    api_key: str,
    lead_data: Dict[str, Any]
):
    """
    API endpoint for external CRM systems to push leads
    Requires API key authentication
    """
    # Validate API key (simplified)
    if not api_key or api_key != "demo_api_key_12345":
        raise HTTPException(status_code=401, detail="Invalid API key")

    if builder_id not in BUILDERS:
        raise HTTPException(status_code=404, detail="Builder not found")

    # Create lead from external data
    lead_id = str(uuid.uuid4())
    lead = Lead(
        lead_id=lead_id,
        builder_id=builder_id,
        project_id=lead_data.get("project_id", ""),
        source="external_crm",
        buyer_name=lead_data["name"],
        buyer_phone=lead_data["phone"],
        buyer_email=lead_data.get("email"),
        interested_bhk=lead_data.get("bhk_preference", []),
        budget_range=lead_data.get("budget", ""),
        status="new"
    )

    LEADS[lead_id] = lead.dict()

    # Trigger webhook notification
    await trigger_webhook(builder_id, "lead_created", lead.dict())

    return {"status": "success", "lead_id": lead_id}

async def trigger_webhook(builder_id: str, event_type: str, data: Dict[str, Any]):
    """Trigger webhook notification (async)"""
    webhooks = [w for w in WEBHOOKS.values()
                if w["builder_id"] == builder_id and w["event_type"] == event_type and w["is_active"]]

    for webhook in webhooks:
        # In production, use httpx.AsyncClient to POST to webhook URL
        print(f"Triggering webhook: {webhook['url']} with event: {event_type}")
        # await httpx.post(webhook["url"], json=data, headers=webhook["headers"])

# ==================== CONTENT MANAGEMENT ====================

@router.post("/projects/{project_id}/content/generate")
async def generate_content(
    project_id: str,
    content_type: str,
    persona: str,
    tone: str = "professional"
):
    """
    AI-powered content generation for different personas and channels
    Content types: description, social_post, email_campaign, brochure_text
    Personas: family, investor, nri, first_time_buyer
    """
    if project_id not in PROJECTS:
        raise HTTPException(status_code=404, detail="Project not found")

    project = PROJECTS[project_id]

    # Simulate AI content generation
    content_templates = {
        "description": {
            "family": f"🏡 Welcome to {project['name']}! Spacious {project['project_type']}s designed for modern families. Located in {project['location']} with top schools, parks, and shopping centers nearby.",
            "investor": f"💰 {project['name']} - Prime investment opportunity in {project['location']}. Expected 15% appreciation with strong rental yields. {project['total_units']} units, RERA approved.",
            "nri": f"🌍 NRI-friendly investment at {project['name']}. Hassle-free documentation, trusted builder, and professional property management. Easy repatriation and rental income.",
        },
        "social_post": f"✨ Introducing {project['name']}! Your dream home awaits in {project['location']}. {project['price_range']} | {project['amenities'][:3]} and more! Book your site visit today! 📞"
    }

    content = content_templates.get(content_type, {}).get(persona, "Content not available")

    template_id = str(uuid.uuid4())
    template = ContentTemplate(
        template_id=template_id,
        builder_id=project["builder_id"],
        project_id=project_id,
        content_type=content_type,
        persona=persona,
        content=content,
        generated_by_ai=True
    )

    CONTENT_TEMPLATES[template_id] = template.dict()

    return template

@router.get("/projects/{project_id}/content")
async def get_project_content(project_id: str, persona: Optional[str] = None):
    """Get all content templates for a project"""
    if project_id not in PROJECTS:
        raise HTTPException(status_code=404, detail="Project not found")

    templates = [t for t in CONTENT_TEMPLATES.values() if t["project_id"] == project_id]

    if persona:
        templates = [t for t in templates if t["persona"] == persona]

    return templates

# ==================== BUILDER WEBSITE & AGENT MICROSITE ====================

@router.get("/builders/{builder_id}/website")
async def get_builder_website_config(builder_id: str):
    """
    Generate builder website configuration
    Returns HTML template config, theme, and content
    """
    if builder_id not in BUILDERS:
        raise HTTPException(status_code=404, detail="Builder not found")

    builder = BUILDERS[builder_id]
    projects = [p for p in PROJECTS.values() if p["builder_id"] == builder_id]

    website_config = {
        "builder_id": builder_id,
        "company_name": builder["company_name"],
        "logo": builder.get("logo", "https://via.placeholder.com/150"),
        "theme": {
            "primary_color": "#1e40af",
            "secondary_color": "#f59e0b",
            "font": "Inter"
        },
        "sections": {
            "hero": {
                "title": f"Welcome to {builder['company_name']}",
                "subtitle": f"Building Dreams Since {builder['established_year']}",
                "cta": "Explore Projects"
            },
            "projects": projects,
            "about": {
                "experience": f"{2024 - builder['established_year']}+ years",
                "completed_projects": builder["completed_projects"],
                "happy_customers": builder["completed_projects"] * 50
            },
            "contact": {
                "email": builder["contact_email"],
                "phone": builder["contact_phone"],
                "headquarters": builder["headquarters"]
            }
        },
        "url": f"https://{builder['company_name'].lower().replace(' ', '-')}.propmubi.com"
    }

    return website_config

@router.get("/agents/{agent_id}/microsite")
async def get_agent_microsite_config(agent_id: str):
    """
    Generate agent microsite configuration
    Personal landing page for agents to share with buyers
    """
    if agent_id not in AGENTS:
        raise HTTPException(status_code=404, detail="Agent not found")

    agent = AGENTS[agent_id]
    assigned_projects = [PROJECTS[pid] for pid in agent["assigned_projects"] if pid in PROJECTS]

    microsite_config = {
        "agent_id": agent_id,
        "name": agent["full_name"],
        "photo": "https://via.placeholder.com/200",
        "designation": "Real Estate Consultant",
        "experience": f"{agent['experience_years']}+ years",
        "languages": ", ".join(agent["languages"]),
        "specialization": ", ".join(agent["specialization_areas"]),
        "contact": {
            "phone": agent["phone"],
            "email": agent["email"],
            "whatsapp": f"https://wa.me/{agent['phone'].replace('+', '')}"
        },
        "projects": assigned_projects,
        "testimonials": [
            {"name": "Rajesh K.", "rating": 5, "text": "Excellent service and guidance!"},
            {"name": "Priya M.", "rating": 5, "text": "Found my dream home with their help!"}
        ],
        "url": f"https://agents.propmubi.com/{agent_id}"
    }

    return microsite_config

# ==================== HEALTH CHECK ====================

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "builders": len(BUILDERS),
        "projects": len(PROJECTS),
        "inventory_units": len(INVENTORY),
        "agents": len(AGENTS),
        "leads": len(LEADS),
        "webhooks": len(WEBHOOKS)
    }
