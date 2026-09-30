from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.card import Card
from app.models.bank import Bank
from app.models.benefit import CardBenefit
from app.models.merchant import CardMerchant
from app.schemas.card import CardOut, CardDetailOut
from app.schemas.comparison import CardCompareRequest, CardCompareResponse, CardCompareItem

router = APIRouter(prefix="/cards", tags=["Cards"])

@router.get("", response_model=List[CardOut])
def get_cards(
    bank_id: Optional[str] = None,
    network: Optional[str] = None,
    card_tier: Optional[str] = None,
    category: Optional[str] = None,
    benefit_type: Optional[str] = None,
    merchant_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Card)

    if bank_id:
        query = query.filter(Card.bank_id == bank_id)
    if network:
        query = query.filter(Card.network.ilike(network))
    if card_tier:
        query = query.filter(Card.card_tier.ilike(card_tier))

    if category:
        query = query.join(CardBenefit).filter(CardBenefit.category.ilike(category))
    if benefit_type:
        query = query.join(CardBenefit).filter(CardBenefit.benefit_type == benefit_type)
    if merchant_id:
        query = query.join(CardMerchant).filter(CardMerchant.merchant_id == merchant_id)

    return query.distinct().all()

@router.get("/{card_id}", response_model=CardDetailOut)
def get_card_detail(
    card_id: str,
    db: Session = Depends(get_db)
):
    card = db.query(Card).filter(Card.card_id == card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")
    return card

@router.post("/compare", response_model=CardCompareResponse)
def compare_cards(
    body: CardCompareRequest,
    db: Session = Depends(get_db)
):
    if len(body.card_ids) > 3:
        raise HTTPException(status_code=400, detail="Maximum 3 cards can be compared at once")

    compared_items = []
    for c_id in body.card_ids:
        card = db.query(Card).filter(Card.card_id == c_id).first()
        if not card:
            continue

        bank = db.query(Bank).filter(Bank.bank_id == card.bank_id).first()
        benefits = db.query(CardBenefit).filter(CardBenefit.card_id == c_id).all()
        merchants_count = db.query(CardMerchant).filter(CardMerchant.card_id == c_id).count()

        top_benefits = [
            f"{b.category}: {b.benefit_value}{'%' if b.benefit_unit=='percent' else ' '+b.benefit_unit} {b.benefit_type}"
            for b in benefits
        ]

        compared_items.append(
            CardCompareItem(
                card_id=card.card_id,
                name=card.name,
                bank_name=bank.name if bank else card.bank_id,
                annual_fee=card.annual_fee,
                minimum_income=card.minimum_income,
                network=card.network,
                card_tier=card.card_tier,
                top_benefits=top_benefits,
                merchant_deals_count=merchants_count
            )
        )

    return CardCompareResponse(compared_cards=compared_items)
