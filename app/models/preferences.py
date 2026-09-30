from sqlalchemy import Column, Integer, String, BigInteger, JSON, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.core.database import Base

class UserPreferences(Base):
    __tablename__ = "user_preferences"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    primary_preference = Column(String(50), nullable=False)
    secondary_preferences = Column(JSON, nullable=True)
    monthly_income = Column(BigInteger, nullable=True)
    max_annual_fee = Column(BigInteger, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="preferences")
