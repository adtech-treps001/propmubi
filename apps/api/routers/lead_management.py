"""
Lead Management & Financial Qualification System
eKYC integration, lead scoring, WhatsApp communication, and listing portal integration
"""

from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel, EmailStr
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import json
import uuid
import random

router = APIRouter()

# ==================== MODELS ====================

class FinancialProfile(BaseModel):
    buyer_id: str
    monthly_income: float
    employment_type: str  # salaried, self_employed, business
    company_name: Optional[str] = None
    credit_score: Optional[int] = None  # CIBIL score
    existing_loans: float = 0
    liquid_assets: float = 0
    property_ownership: int = 0  # number of properties owned
    pan_number: Optional[str] = None
    aadhar_number: Optional[str] = None
    kyc_status: str = "pending"  # pending, completed, failed
    kyc_documents: List[Dict[str, str]] = []

class LeadQualification(BaseModel):
    lead_id: str
    financial_score: int  # 0-100
    intent_score: int  # 0-100
    engagement_score: int  # 0-100
    overall_score: int  # 0-100
    tier: str  # hot, warm, cold
    qualification_reasons: List[str]
    recommended_actions: List[str]

class WhatsAppMessage(BaseModel):
    message_id: str
    to: str  # phone number
    from_: str  # builder/agent number
    message_type: str  # text, image, document, template
    content: str
    template_name: Optional[str] = None
    status: str  # sent, delivered, read, failed
    sent_at: str = datetime.now().isoformat()

class ListingPortalIntegration(BaseModel):
    integration_id: str
    builder_id: str
    portal_name: str  # magicbricks, 99acres, housing.com, nobroker
    api_key: str
    account_id: str
    auto_sync: bool = True
    sync_frequency: str = "hourly"  # hourly, daily, manual
    is_active: bool = True

class SocialMediaPost(BaseModel):
    post_id: str
    builder_id: str
    project_id: str
    platform: str  # youtube, instagram, linkedin, facebook, reddit
    content_type: str  # video, image, text, reel
    content_url: Optional[str] = None
    caption: str
    hashtags: List[str]
    scheduled_at: Optional[str] = None
    posted_at: Optional[str] = None
    status: str  # draft, scheduled, published
    engagement_stats: Dict[str, int] = {"views": 0, "likes": 0, "shares": 0, "comments": 0}

class ColdCallConfig(BaseModel):
    campaign_id: str
    builder_id: str
    project_id: str
    target_audience: Dict[str, Any]  # demographics, location, budget
    script_template: str
    ai_voice: str  # male, female, multilingual
    call_hours: str  # 10AM-6PM
    max_calls_per_day: int = 100
    is_active: bool = True

# ==================== STORAGE ====================

FINANCIAL_PROFILES = {}
LEAD_QUALIFICATIONS = {}
WHATSAPP_MESSAGES = {}
LISTING_INTEGRATIONS = {}
SOCIAL_MEDIA_POSTS = {}
COLD_CALL_CAMPAIGNS = {}
LEADS = {}  # From builder_crm.py

# ==================== LEAD MANAGEMENT ====================

@router.post("/leads/create")
async def create_lead(
    builder_id: str,
    project_id: str,
    source: str,
    buyer_name: str,
    buyer_phone: str,
    buyer_email: Optional[str] = None,
    interested_bhk: List[str] = [],
    budget_range: str = "",
    utm_source: Optional[str] = None,
    utm_medium: Optional[str] = None
):
    """
    Create a new lead from any source
    Sources: website, whatsapp, listing_portal, social_media, cold_call, referral
    """
    lead_id = str(uuid.uuid4())

    lead = {
        "lead_id": lead_id,
        "builder_id": builder_id,
        "project_id": project_id,
        "source": source,
        "buyer_name": buyer_name,
        "buyer_phone": buyer_phone,
        "buyer_email": buyer_email,
        "interested_bhk": interested_bhk,
        "budget_range": budget_range,
        "status": "new",
        "utm_source": utm_source,
        "utm_medium": utm_medium,
        "created_at": datetime.now().isoformat(),
        "last_contacted": None,
        "assigned_agent_id": None,
        "qualification_score": 0
    }

    LEADS[lead_id] = lead

    # Auto-assign to agent based on area specialization
    await auto_assign_agent(lead_id)

    # Send WhatsApp welcome message
    await send_whatsapp_welcome(buyer_phone, builder_id, project_id)

    return {"status": "success", "lead_id": lead_id, "lead": lead}

@router.get("/leads/{lead_id}")
async def get_lead(lead_id: str):
    """Get lead details with financial profile and qualification"""
    if lead_id not in LEADS:
        raise HTTPException(status_code=404, detail="Lead not found")

    lead = LEADS[lead_id]

    # Get financial profile if exists
    financial_profile = next(
        (fp for fp in FINANCIAL_PROFILES.values() if fp.get("buyer_id") == lead_id),
        None
    )

    # Get qualification
    qualification = LEAD_QUALIFICATIONS.get(lead_id)

    return {
        "lead": lead,
        "financial_profile": financial_profile,
        "qualification": qualification
    }

@router.put("/leads/{lead_id}/status")
async def update_lead_status(lead_id: str, status: str, notes: str = ""):
    """
    Update lead status
    Statuses: new → qualified → contacted → site_visit → negotiation → closed/lost
    """
    if lead_id not in LEADS:
        raise HTTPException(status_code=404, detail="Lead not found")

    LEADS[lead_id]["status"] = status
    LEADS[lead_id]["last_updated"] = datetime.now().isoformat()

    # Log activity
    if "activity_log" not in LEADS[lead_id]:
        LEADS[lead_id]["activity_log"] = []

    LEADS[lead_id]["activity_log"].append({
        "timestamp": datetime.now().isoformat(),
        "action": f"Status changed to {status}",
        "notes": notes
    })

    return {"status": "success", "lead": LEADS[lead_id]}

async def auto_assign_agent(lead_id: str):
    """Auto-assign lead to agent based on area specialization and workload"""
    # Simplified auto-assignment logic
    # In production: match agent specialization areas with project location
    lead = LEADS[lead_id]

    # Find available agents (mock)
    available_agent_id = "agent-" + str(random.randint(1000, 9999))
    lead["assigned_agent_id"] = available_agent_id

    return available_agent_id

# ==================== FINANCIAL eKYC & QUALIFICATION ====================

@router.post("/leads/{lead_id}/financial-profile")
async def create_financial_profile(lead_id: str, profile: FinancialProfile):
    """
    Create financial profile for lead qualification
    Integrates with account aggregators for income verification
    """
    if lead_id not in LEADS:
        raise HTTPException(status_code=404, detail="Lead not found")

    profile.buyer_id = lead_id
    FINANCIAL_PROFILES[lead_id] = profile.dict()

    # Trigger lead qualification
    qualification = await qualify_lead(lead_id)

    return {"status": "success", "profile": profile, "qualification": qualification}

@router.post("/leads/{lead_id}/kyc/initiate")
async def initiate_ekyc(lead_id: str, pan_number: str, aadhar_number: str):
    """
    Initiate eKYC process
    - PAN verification via NSDL
    - Aadhar verification via UIDAI
    - Credit score via CIBIL
    """
    if lead_id not in LEADS:
        raise HTTPException(status_code=404, detail="Lead not found")

    # Simulate eKYC verification (in production, call actual APIs)
    kyc_result = {
        "pan_verified": True,
        "aadhar_verified": True,
        "credit_score": random.randint(650, 850),
        "name_match": True,
        "address_verified": True,
        "verification_timestamp": datetime.now().isoformat()
    }

    if lead_id not in FINANCIAL_PROFILES:
        FINANCIAL_PROFILES[lead_id] = {
            "buyer_id": lead_id,
            "kyc_status": "completed",
            "credit_score": kyc_result["credit_score"]
        }
    else:
        FINANCIAL_PROFILES[lead_id]["kyc_status"] = "completed"
        FINANCIAL_PROFILES[lead_id]["credit_score"] = kyc_result["credit_score"]

    return {"status": "success", "kyc_result": kyc_result}

@router.get("/leads/{lead_id}/financial-insights")
async def get_financial_insights(lead_id: str):
    """
    AI-powered financial insights and recommendations
    - Affordability analysis
    - Loan eligibility
    - Recommended projects based on budget
    """
    if lead_id not in LEADS:
        raise HTTPException(status_code=404, detail="Lead not found")

    if lead_id not in FINANCIAL_PROFILES:
        raise HTTPException(status_code=404, detail="Financial profile not found")

    profile = FINANCIAL_PROFILES[lead_id]

    # Calculate affordability
    monthly_income = profile.get("monthly_income", 0)
    max_emi = monthly_income * 0.4  # 40% of income for EMI
    loan_amount = max_emi * 240  # 20-year loan

    insights = {
        "max_affordable_property": loan_amount + profile.get("liquid_assets", 0),
        "max_monthly_emi": max_emi,
        "recommended_down_payment": profile.get("liquid_assets", 0) * 0.3,
        "loan_eligibility": {
            "amount": loan_amount,
            "tenure": "20 years",
            "estimated_interest": "8.5%",
            "eligibility_confidence": 85 if profile.get("credit_score", 0) > 750 else 60
        },
        "risk_assessment": "Low Risk" if profile.get("credit_score", 0) > 750 else "Medium Risk",
        "recommendations": [
            "Consider projects in ₹60L-80L range for comfortable EMI",
            "Your credit score qualifies for preferential interest rates",
            "Liquid assets support 30% down payment requirement"
        ]
    }

    return insights

async def qualify_lead(lead_id: str) -> LeadQualification:
    """
    AI-powered lead qualification based on financial profile and engagement
    Returns qualification tier: hot, warm, cold
    """
    lead = LEADS[lead_id]
    financial_profile = FINANCIAL_PROFILES.get(lead_id, {})

    # Financial score (0-100)
    monthly_income = financial_profile.get("monthly_income", 0)
    credit_score = financial_profile.get("credit_score", 0)
    liquid_assets = financial_profile.get("liquid_assets", 0)

    financial_score = min(100, (
        (monthly_income / 200000 * 40) +  # Income weightage: 40%
        (credit_score / 900 * 40) +       # Credit weightage: 40%
        (liquid_assets / 5000000 * 20)    # Assets weightage: 20%
    ))

    # Intent score (based on actions)
    intent_score = 50  # Base score
    if lead.get("site_visit_scheduled"):
        intent_score += 30
    if lead.get("brochure_downloaded"):
        intent_score += 10
    if lead.get("callback_requested"):
        intent_score += 10

    # Engagement score
    engagement_score = 40  # Base score
    if lead.get("last_contacted"):
        days_since_contact = (datetime.now() - datetime.fromisoformat(lead["last_contacted"])).days
        engagement_score += max(0, 60 - days_since_contact * 5)

    # Overall score
    overall_score = int((financial_score * 0.5) + (intent_score * 0.3) + (engagement_score * 0.2))

    # Determine tier
    if overall_score >= 75:
        tier = "hot"
    elif overall_score >= 50:
        tier = "warm"
    else:
        tier = "cold"

    qualification = LeadQualification(
        lead_id=lead_id,
        financial_score=int(financial_score),
        intent_score=int(intent_score),
        engagement_score=int(engagement_score),
        overall_score=overall_score,
        tier=tier,
        qualification_reasons=[
            f"Financial capacity: {int(financial_score)}/100",
            f"Buying intent: {int(intent_score)}/100",
            f"Engagement level: {int(engagement_score)}/100"
        ],
        recommended_actions=[
            "Schedule site visit within 48 hours" if tier == "hot" else "Nurture with targeted content",
            "Offer pre-approval assistance" if financial_score > 70 else "Share financing options",
            "Assign senior sales consultant" if tier == "hot" else "Add to email campaign"
        ]
    )

    LEAD_QUALIFICATIONS[lead_id] = qualification.dict()
    LEADS[lead_id]["qualification_score"] = overall_score

    return qualification

# ==================== WHATSAPP COMMUNICATION ====================

async def send_whatsapp_welcome(phone: str, builder_id: str, project_id: str):
    """Send WhatsApp welcome message to new lead"""
    message_id = str(uuid.uuid4())

    message = WhatsAppMessage(
        message_id=message_id,
        to=phone,
        from_="+919876543210",  # Builder's WhatsApp Business number
        message_type="template",
        template_name="welcome_message",
        content=f"Welcome! Thank you for your interest. Our agent will contact you shortly. Reply 'INFO' for project details.",
        status="sent"
    )

    WHATSAPP_MESSAGES[message_id] = message.dict()
    return message

@router.post("/whatsapp/send")
async def send_whatsapp_message(
    to: str,
    message: str,
    builder_id: str,
    message_type: str = "text",
    media_url: Optional[str] = None
):
    """
    Send WhatsApp message to buyer
    Supports text, images, documents, and templates
    """
    message_id = str(uuid.uuid4())

    whatsapp_msg = WhatsAppMessage(
        message_id=message_id,
        to=to,
        from_="+919876543210",
        message_type=message_type,
        content=message,
        status="sent"
    )

    WHATSAPP_MESSAGES[message_id] = whatsapp_msg.dict()

    # In production: Use WhatsApp Business API
    # await send_via_whatsapp_api(to, message, media_url)

    return {"status": "success", "message_id": message_id}

@router.post("/whatsapp/webhook")
async def whatsapp_webhook(data: Dict[str, Any]):
    """
    Webhook to receive incoming WhatsApp messages
    Auto-assigns to agent and triggers appropriate responses
    """
    # Parse WhatsApp webhook payload
    from_number = data.get("from")
    message_text = data.get("text", "").lower()

    # Find lead by phone number
    lead = next((l for l in LEADS.values() if l["buyer_phone"] == from_number), None)

    if not lead:
        # Create new lead from WhatsApp inquiry
        lead_id = await create_lead(
            builder_id="builder-123",  # Detect from incoming number
            project_id="project-456",
            source="whatsapp",
            buyer_name="WhatsApp User",
            buyer_phone=from_number
        )
        lead = LEADS[lead_id["lead_id"]]

    # Process message intent
    if "info" in message_text or "details" in message_text:
        await send_project_details_via_whatsapp(from_number, lead["project_id"])
    elif "visit" in message_text or "site" in message_text:
        await schedule_site_visit_via_whatsapp(from_number, lead["lead_id"])
    elif "price" in message_text or "cost" in message_text:
        await send_pricing_via_whatsapp(from_number, lead["project_id"])
    else:
        # Forward to assigned agent
        await notify_agent_new_whatsapp_message(lead["assigned_agent_id"], from_number, message_text)

    return {"status": "success"}

async def send_project_details_via_whatsapp(phone: str, project_id: str):
    """Send project details via WhatsApp"""
    details = f"📍 Project: Mangala Heights\n💰 Price: ₹1.2 Cr - 3.5 Cr\n🏠 Types: 2/3/4 BHK\n📞 Call: +91-9876543210"
    await send_whatsapp_message(phone, details, "builder-123")

async def schedule_site_visit_via_whatsapp(phone: str, lead_id: str):
    """Schedule site visit via WhatsApp"""
    message = "Great! When would you like to visit? Reply with:\n1️⃣ This weekend\n2️⃣ Next week\n3️⃣ Custom date"
    await send_whatsapp_message(phone, message, "builder-123")

async def send_pricing_via_whatsapp(phone: str, project_id: str):
    """Send pricing details via WhatsApp"""
    message = "💰 Pricing:\n2 BHK: ₹1.2 Cr\n3 BHK: ₹2.0 Cr\n4 BHK: ₹3.5 Cr\n\n📄 Download brochure: https://propmubi.com/brochure.pdf"
    await send_whatsapp_message(phone, message, "builder-123")

async def notify_agent_new_whatsapp_message(agent_id: str, buyer_phone: str, message: str):
    """Notify agent about new WhatsApp message from buyer"""
    # Send push notification to agent's mobile app
    print(f"Agent {agent_id}: New WhatsApp from {buyer_phone}: {message}")

# ==================== LISTING PORTAL INTEGRATION ====================

@router.post("/listing-portals/integrate")
async def integrate_listing_portal(integration: ListingPortalIntegration):
    """
    Integrate with listing portals (MagicBricks, 99acres, Housing.com, NoBroker)
    Auto-sync leads from these portals
    """
    integration_id = str(uuid.uuid4())
    integration.integration_id = integration_id

    LISTING_INTEGRATIONS[integration_id] = integration.dict()

    return {"status": "success", "integration_id": integration_id}

@router.post("/listing-portals/{integration_id}/sync")
async def sync_listing_portal_leads(integration_id: str):
    """
    Sync leads from listing portal
    Called manually or via cron job
    """
    if integration_id not in LISTING_INTEGRATIONS:
        raise HTTPException(status_code=404, detail="Integration not found")

    integration = LISTING_INTEGRATIONS[integration_id]

    # Simulate fetching leads from portal API
    portal_leads = [
        {"name": "Amit Sharma", "phone": "+919876543210", "project": "Mangala Heights", "source": integration["portal_name"]},
        {"name": "Priya Reddy", "phone": "+919876543211", "project": "Aparna Zenon", "source": integration["portal_name"]}
    ]

    synced_leads = []
    for pl in portal_leads:
        lead_id = await create_lead(
            builder_id=integration["builder_id"],
            project_id="project-123",
            source=pl["source"],
            buyer_name=pl["name"],
            buyer_phone=pl["phone"]
        )
        synced_leads.append(lead_id)

    return {"status": "success", "synced_count": len(synced_leads), "leads": synced_leads}

# ==================== SOCIAL MEDIA MANAGEMENT ====================

@router.post("/social-media/post")
async def create_social_media_post(post: SocialMediaPost):
    """
    Create social media post for project promotion
    Platforms: YouTube, Instagram, LinkedIn, Facebook, Reddit
    """
    post_id = str(uuid.uuid4())
    post.post_id = post_id

    SOCIAL_MEDIA_POSTS[post_id] = post.dict()

    return {"status": "success", "post_id": post_id, "post": post}

@router.post("/social-media/schedule")
async def schedule_social_media_posts(
    builder_id: str,
    project_id: str,
    platforms: List[str],
    content_type: str = "reel"
):
    """
    AI-powered social media content calendar
    Auto-generates and schedules posts across platforms
    """
    scheduled_posts = []

    for platform in platforms:
        # Generate AI content for each platform
        if platform == "instagram":
            caption = "🏡 Your Dream Home Awaits! Luxury 3BHK apartments starting at ₹1.2 Cr. Limited units available! 📞 Book site visit now! #DreamHome #RealEstate #LuxuryLiving"
            hashtags = ["DreamHome", "RealEstate", "LuxuryLiving", "HyderabadHomes"]
        elif platform == "linkedin":
            caption = "Announcing the launch of Mangala Heights - Premium residential project in Tellapur, Hyderabad. RERA approved with world-class amenities. Schedule a site visit today."
            hashtags = ["RealEstate", "Investment", "Hyderabad"]
        elif platform == "youtube":
            caption = "Virtual Tour: Mangala Heights | 3BHK Luxury Apartments | Hyderabad Real Estate"
            hashtags = ["RealEstate", "PropertyTour", "Hyderabad"]

        post = SocialMediaPost(
            post_id=str(uuid.uuid4()),
            builder_id=builder_id,
            project_id=project_id,
            platform=platform,
            content_type=content_type,
            caption=caption,
            hashtags=hashtags,
            status="scheduled",
            scheduled_at=(datetime.now() + timedelta(hours=random.randint(1, 24))).isoformat()
        )

        SOCIAL_MEDIA_POSTS[post.post_id] = post.dict()
        scheduled_posts.append(post)

    return {"status": "success", "scheduled_posts": scheduled_posts}

# ==================== AI VOICE COLD CALLING ====================

@router.post("/cold-calling/campaign")
async def create_cold_call_campaign(campaign: ColdCallConfig):
    """
    Create AI-powered cold calling campaign
    AI voice calls potential buyers with personalized script
    """
    campaign_id = str(uuid.uuid4())
    campaign.campaign_id = campaign_id

    COLD_CALL_CAMPAIGNS[campaign_id] = campaign.dict()

    return {"status": "success", "campaign_id": campaign_id}

@router.post("/cold-calling/campaign/{campaign_id}/start")
async def start_cold_call_campaign(campaign_id: str, background_tasks: BackgroundTasks):
    """
    Start cold calling campaign
    AI makes calls during specified hours
    """
    if campaign_id not in COLD_CALL_CAMPAIGNS:
        raise HTTPException(status_code=404, detail="Campaign not found")

    campaign = COLD_CALL_CAMPAIGNS[campaign_id]

    # Add to background task queue
    background_tasks.add_task(execute_cold_calls, campaign_id)

    return {"status": "started", "campaign_id": campaign_id}

async def execute_cold_calls(campaign_id: str):
    """Execute cold calls in background"""
    campaign = COLD_CALL_CAMPAIGNS[campaign_id]

    # Simulate AI calling (in production, integrate with Twilio/Exotel)
    target_numbers = ["+919876543210", "+919876543211"]  # From target audience

    for number in target_numbers:
        # Make AI voice call
        call_result = await make_ai_call(number, campaign["script_template"], campaign["ai_voice"])

        # If interested, create lead
        if call_result["interested"]:
            await create_lead(
                builder_id=campaign["builder_id"],
                project_id=campaign["project_id"],
                source="cold_call",
                buyer_name=call_result["name"],
                buyer_phone=number
            )

async def make_ai_call(number: str, script: str, voice: str):
    """Make AI voice call (mock)"""
    return {
        "call_id": str(uuid.uuid4()),
        "number": number,
        "duration": random.randint(30, 180),
        "interested": random.choice([True, False]),
        "name": "Potential Buyer",
        "notes": "Expressed interest in 3BHK units"
    }

# ==================== AI SEARCH TOOLS ====================

@router.post("/ai-tools/search-buyer-info")
async def search_buyer_information(phone: str, email: Optional[str] = None):
    """
    AI-powered buyer information search
    Searches public databases, social media, professional networks
    """
    # Simulate searching online for buyer information
    buyer_info = {
        "phone": phone,
        "email": email,
        "social_profiles": {
            "linkedin": f"https://linkedin.com/in/{phone[-4:]}",
            "facebook": f"https://facebook.com/{phone[-4:]}"
        },
        "employment": {
            "company": "Tech Corp India",
            "designation": "Senior Software Engineer",
            "estimated_income": "₹15-20 LPA",
            "confidence": 75
        },
        "interests": ["Real Estate Investment", "Technology", "Fitness"],
        "property_search_history": [
            {"location": "Gachibowli", "budget": "₹1.5-2 Cr", "bhk": "3BHK"},
            {"location": "Hitech City", "budget": "₹1-1.5 Cr", "bhk": "2BHK"}
        ],
        "digital_footprint": {
            "active_on": ["LinkedIn", "Instagram", "Twitter"],
            "engagement_level": "High",
            "recent_searches": ["apartments in gachibowli", "best builders hyderabad"]
        }
    }

    return buyer_info

@router.get("/ai-tools/market-insights")
async def get_market_insights(location: str):
    """
    AI-powered market insights
    Price trends, demand-supply, competitor analysis
    """
    insights = {
        "location": location,
        "average_price_per_sqft": "₹5,800",
        "price_trend": "+8% YoY",
        "demand_supply_ratio": 1.3,
        "market_sentiment": "Bullish",
        "top_competitors": [
            {"name": "Prestige Group", "avg_price": "₹6,200/sqft", "projects": 3},
            {"name": "My Home", "avg_price": "₹5,500/sqft", "projects": 5}
        ],
        "buyer_demographics": {
            "age_group": "30-45 years",
            "income_bracket": "₹15-30 LPA",
            "primary_buyers": "IT Professionals, Business Owners"
        },
        "recommendations": [
            "Price your units competitively at ₹5,500-6,000/sqft",
            "Target IT professionals in 30-40 age group",
            "Highlight tech-enabled amenities and smart home features"
        ]
    }

    return insights

# ==================== HEALTH CHECK ====================

@router.get("/health")
async def health_check():
    """Health check for lead management system"""
    return {
        "status": "healthy",
        "leads": len(LEADS),
        "financial_profiles": len(FINANCIAL_PROFILES),
        "whatsapp_messages": len(WHATSAPP_MESSAGES),
        "listing_integrations": len(LISTING_INTEGRATIONS),
        "social_posts": len(SOCIAL_MEDIA_POSTS),
        "cold_call_campaigns": len(COLD_CALL_CAMPAIGNS)
    }
