from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, UniqueConstraint, func
from sqlalchemy.orm import relationship
from app.core.database import Base

class UserWallet(Base):
    __tablename__ = "user_wallet"
    __table_args__ = (
        UniqueConstraint("user_id", "card_id", name="uq_user_card"),
    )

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    card_id = Column(String(100), ForeignKey("cards.card_id"), nullable=False)
    added_at = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String(50), default="active", nullable=True)

    user = relationship("User", back_populates="wallet_cards")
    card = relationship("Card")
