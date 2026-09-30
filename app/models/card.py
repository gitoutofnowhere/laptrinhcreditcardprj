from sqlalchemy import Column, Integer, String, Text, BigInteger, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Card(Base):
    __tablename__ = "cards"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    card_id = Column(String(100), unique=True, index=True, nullable=False)
    bank_id = Column(String(50), ForeignKey("banks.bank_id"), nullable=False)
    name = Column(String(255), nullable=False)
    network = Column(String(50), nullable=True)
    card_tier = Column(String(50), nullable=True)
    card_type = Column(String(50), nullable=True)
    annual_fee = Column(BigInteger, nullable=True)
    annual_fee_waiver_condition = Column(Text, nullable=True)
    minimum_income = Column(BigInteger, nullable=True)
    application_url = Column(Text, nullable=True)
    image_url = Column(Text, nullable=True)
    status = Column(String(50), default="active", nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    bank = relationship("Bank", back_populates="cards")
    benefits = relationship("CardBenefit", back_populates="card", cascade="all, delete-orphan")
    merchants = relationship("CardMerchant", back_populates="card", cascade="all, delete-orphan")
