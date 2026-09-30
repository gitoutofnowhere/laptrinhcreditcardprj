from sqlalchemy import Column, Integer, String, Text, DateTime, func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Bank(Base):
    __tablename__ = "banks"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    bank_id = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    logo_url = Column(Text, nullable=True)
    website = Column(Text, nullable=True)
    status = Column(String(50), default="active", nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    cards = relationship("Card", back_populates="bank", cascade="all, delete-orphan")
