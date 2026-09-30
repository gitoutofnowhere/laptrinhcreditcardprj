from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Merchant(Base):
    __tablename__ = "merchants"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    merchant_id = Column(String(100), unique=True, index=True, nullable=False)
    merchant_name = Column(String(255), nullable=False)
    normalized_name = Column(String(255), nullable=True)
    category = Column(String(100), nullable=True)
    logo_url = Column(Text, nullable=True)
    website = Column(Text, nullable=True)
    status = Column(String(50), default="active", nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    card_merchants = relationship("CardMerchant", back_populates="merchant", cascade="all, delete-orphan")

class CardMerchant(Base):
    __tablename__ = "card_merchants"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    card_id = Column(String(100), ForeignKey("cards.card_id"), nullable=False)
    merchant_id = Column(String(100), ForeignKey("merchants.merchant_id"), nullable=False)
    relationship_type = Column(String(50), nullable=True)
    benefit_type = Column(String(50), nullable=True)
    benefit_value = Column(Float, nullable=True)
    benefit_unit = Column(String(50), nullable=True)
    maximum_benefit = Column(Float, nullable=True)
    minimum_spend = Column(Float, default=0, nullable=True)
    conditions = Column(Text, nullable=True)
    status = Column(String(50), default="current", nullable=True)
    valid_from = Column(DateTime(timezone=True), nullable=True)
    valid_to = Column(DateTime(timezone=True), nullable=True)
    source_url = Column(Text, nullable=True)
    last_verified_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    card = relationship("Card", back_populates="merchants")
    merchant = relationship("Merchant", back_populates="card_merchants")
