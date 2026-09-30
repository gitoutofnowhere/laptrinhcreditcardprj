from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.card import Card
from app.models.benefit import CardBenefit
from app.models.merchant import CardMerchant, Merchant

def find_best_card_benefit_for_merchant(
    card: Card,
    merchant_id: str,
    db: Session
) -> Optional[CardMerchant]:
    """Retrieves direct merchant offer if present for the card."""
    return db.query(CardMerchant).filter(
        CardMerchant.card_id == card.card_id,
        CardMerchant.merchant_id == merchant_id,
        CardMerchant.status == "current"
    ).first()

def find_best_card_benefit_for_category(
    card: Card,
    category: str,
    db: Session
) -> Optional[CardBenefit]:
    """Retrieves category benefit for the card."""
    return db.query(CardBenefit).filter(
        CardBenefit.card_id == card.card_id,
        CardBenefit.category.ilike(category),
        CardBenefit.status == "current"
    ).first()
