from sqlalchemy import Column, Integer, String, BigInteger, DateTime, ForeignKey, UniqueConstraint, func
from sqlalchemy.orm import relationship
from app.core.database import Base

class SpendingProfile(Base):
    __tablename__ = "spending_profiles"
    __table_args__ = (
        UniqueConstraint("user_id", "category", name="uq_user_category_spending"),
    )

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    category = Column(String(100), nullable=False)
    monthly_amount = Column(BigInteger, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="spending_profile")
