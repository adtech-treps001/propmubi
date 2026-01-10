from sqlalchemy import Column, String, DateTime, ForeignKey, Numeric, JSONB, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from apps.api.database import Base

class Lead(Base):
    __tablename__ = "leads"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    buyer_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"))
    advisor_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True) # Assigned Agent/Sales
    status = Column(String(20), default='NEW')
    consent_id = Column(UUID(as_uuid=True), ForeignKey("user_consents.id"), nullable=True)
    interaction_history = Column(JSONB)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    __table_args__ = (UniqueConstraint('buyer_id', 'project_id', name='_buyer_project_uc'),)

class TransactionMilestone(Base):
    __tablename__ = "transaction_milestones"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    lead_id = Column(UUID(as_uuid=True), ForeignKey("leads.id"))
    milestone_type = Column(String(50))
    status = Column(String(20), default='PENDING')
    artifacts = Column(JSONB)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class CommissionRecord(Base):
    __tablename__ = "commission_records"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    lead_id = Column(UUID(as_uuid=True), ForeignKey("leads.id"))
    agent_id = Column(UUID(as_uuid=True), ForeignKey("agents.id"))
    amount = Column(Numeric(15, 2))
    status = Column(String(20), default='PENDING')
    audit_trail = Column(JSONB)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
