from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from app.models.card import Card
from app.models.benefit import CardBenefit
from app.models.merchant import CardMerchant, Merchant

def calculate_transaction_reward(
    card: Card,
    amount: float,
    merchant_id: Optional[str] = None,
    category: Optional[str] = None,
    db: Optional[Session] = None
) -> Dict[str, Any]:
    """
    Calculates estimated reward for a specific transaction on a card.
    Considers CardMerchant specific deals first, then CardBenefit category rules.
    Honors minimum_spend and maximum_benefit caps.
    """
    matched_cm: Optional[CardMerchant] = None
    matched_cb: Optional[CardBenefit] = None

    if db and merchant_id:
        # Search for direct card-merchant promotion
        matched_cm = db.query(CardMerchant).filter(
            CardMerchant.card_id == card.card_id,
            CardMerchant.merchant_id == merchant_id,
            CardMerchant.status == "current"
        ).first()

    if not matched_cm and db and category:
        # Search for category benefit
        matched_cb = db.query(CardBenefit).filter(
            CardBenefit.card_id == card.card_id,
            CardBenefit.category.ilike(category),
            CardBenefit.status == "current"
        ).first()

    # Fallback to General benefit if category didn't match
    if not matched_cm and not matched_cb and db:
        matched_cb = db.query(CardBenefit).filter(
            CardBenefit.card_id == card.card_id,
            CardBenefit.category.ilike("General"),
            CardBenefit.status == "current"
        ).first()

    reward_val = 0.0
    b_type = None
    b_unit = None
    b_val = None
    conditions = None

    if matched_cm:
        b_type = matched_cm.benefit_type
        b_unit = matched_cm.benefit_unit
        b_val = matched_cm.benefit_value
        conditions = matched_cm.conditions
        min_spend = matched_cm.minimum_spend or 0

        if amount >= min_spend:
            if b_unit == "percent" and b_val is not None:
                reward_val = (b_val / 100.0) * amount
            elif b_unit == "vnd" and b_val is not None:
                reward_val = b_val
            elif b_unit == "item":
                # Nominal estimated value for free item/voucher if not specified
                reward_val = b_val if b_val is not None else 30000.0

            # Apply cap if present
            if matched_cm.maximum_benefit is not None and reward_val > matched_cm.maximum_benefit:
                reward_val = matched_cm.maximum_benefit

    elif matched_cb:
        b_type = matched_cb.benefit_type
        b_unit = matched_cb.benefit_unit
        b_val = matched_cb.benefit_value
        conditions = matched_cb.conditions
        min_spend = matched_cb.minimum_spend or 0

        if amount >= min_spend:
            if b_unit == "percent" and b_val is not None:
                reward_val = (b_val / 100.0) * amount
            elif b_unit == "vnd" and b_val is not None:
                reward_val = b_val

            # Apply cap if present
            if matched_cb.maximum_benefit is not None and reward_val > matched_cb.maximum_benefit:
                reward_val = matched_cb.maximum_benefit

    return {
        "card_id": card.card_id,
        "card_name": card.name,
        "category": category,
        "merchant_id": merchant_id,
        "benefit_type": b_type,
        "benefit_value": b_val,
        "benefit_unit": b_unit,
        "estimated_reward_value": float(reward_val),
        "conditions_note": conditions
    }
