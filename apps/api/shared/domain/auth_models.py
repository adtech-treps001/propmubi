from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Text, Integer, Numeric
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from apps.api.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    mobile = Column(String(15), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=True)
    password_hash = Column(String(255), nullable=True)
    full_name = Column(String(100), nullable=True)
    role = Column(String(20), nullable=False) # BUYER, AGENT, BUILDER, ADMIN
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    consents = relationship("UserConsent", back_populates="user")
    declared_assets = relationship("DeclaredAsset", back_populates="user")

class UserConsent(Base):
    __tablename__ = "user_consents"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    consent_type = Column(String(50), nullable=False) # FINANCIAL_AA, CIBIL, CAMS
    status = Column(String(20), default='ACTIVE')
    valid_until = Column(DateTime(timezone=True))
    metadata_json = Column(JSONB, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", back_populates="consents")

class DeclaredAsset(Base):
    __tablename__ = "declared_assets"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    asset_type = Column(String(50)) # LAND, APARTMENT, COMMERCIAL
    location_details = Column(JSONB)
    verification_status = Column(String(20), default='PENDING')
    verification_source = Column(String(50))
    estimated_value_band = Column(String(50))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", back_populates="declared_assets")
