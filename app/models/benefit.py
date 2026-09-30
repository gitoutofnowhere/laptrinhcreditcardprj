from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.core.database import Base

class CardBenefit(Base):
    __tablename__ = "card_benefits"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    card_id = Column(String(100), ForeignKey("cards.card_id"), nullable=False)
    category = Column(String(100), nullable=False)
    benefit_type = Column(String(50), nullable=False)
    benefit_value = Column(Float, nullable=False)
    benefit_unit = Column(String(50), nullable=False)
    maximum_benefit = Column(Float, nullable=True)
    minimum_spend = Column(Float, default=0, nullable=True)
    frequency = Column(String(50), nullable=True)
    conditions = Column(Text, nullable=True)
    status = Column(String(50), default="current", nullable=True)
    valid_from = Column(DateTime(timezone=True), nullable=True)
    valid_to = Column(DateTime(timezone=True), nullable=True)
    source_url = Column(Text, nullable=True)
    last_verified_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    card = relationship("Card", back_populates="benefits")
