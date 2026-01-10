from sqlalchemy import Column, String, ForeignKey, Integer, Numeric
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from geoalchemy2 import Geometry
import uuid
from apps.api.database import Base

class Project(Base):
    __tablename__ = "projects"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    builder_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    name = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, nullable=False)
    status = Column(String(50), default='PRE_LAUNCH')
    location = Column(Geometry('POINT', srid=4326))
    boundary = Column(Geometry('POLYGON', srid=4326))
    rera_id = Column(String(100))
    config = Column(JSONB) # Amenities, towers count
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    units = relationship("Unit", back_populates="project")

class Unit(Base):
    __tablename__ = "units"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"))
    tower_name = Column(String(50))
    floor_number = Column(Integer)
    unit_number = Column(String(20))
    type = Column(String(20)) # 2BHK, 3BHK
    area_sqft = Column(Integer)
    base_price = Column(Numeric(15, 2))
    status = Column(String(20), default='AVAILABLE')
    
    project = relationship("Project", back_populates="units")
