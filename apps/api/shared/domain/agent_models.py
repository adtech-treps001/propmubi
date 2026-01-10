from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Integer, JSONB
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from apps.api.database import Base

class Agent(Base):
    __tablename__ = "agents"
    
    id = Column(UUID(as_uuid=True), ForeignKey("users.id"), primary_key=True)
    license_number = Column(String(100), nullable=True)
    territory = Column(String(100), nullable=True)
    credibility_score = Column(Integer, default=50)
    performance_metrics = Column(JSONB, nullable=True)
    is_authorized = Column(Boolean, default=False)
    
    listings = relationship("AgentListing", back_populates="agent")
    microsites = relationship("AgentMicrosite", back_populates="agent")

class AgentListing(Base):
    __tablename__ = "agent_listings"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    agent_id = Column(UUID(as_uuid=True), ForeignKey("agents.id"))
    property_details = Column(JSONB)
    status = Column(String(20), default='SOCIAL_SIGNAL') # SOCIAL_SIGNAL, VERIFIED, EXPIRED
    verification_artifacts = Column(JSONB)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    agent = relationship("Agent", back_populates="listings")

class AgentMicrosite(Base):
    __tablename__ = "agent_microsites"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    agent_id = Column(UUID(as_uuid=True), ForeignKey("agents.id"))
    subdomain = Column(String(100), unique=True)
    config = Column(JSONB)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    agent = relationship("Agent", back_populates="microsites")
