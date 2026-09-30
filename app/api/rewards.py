from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.card import Card
from app.schemas.rewards import RewardCalcRequest, RewardCalcResponse
from app.services.reward_calculator import calculate_transaction_reward

router = APIRouter(prefix="/rewards", tags=["Reward Calculator"])

@router.post("/calculate", response_model=RewardCalcResponse)
def calculate_reward_endpoint(
    req: RewardCalcRequest,
    db: Session = Depends(get_db)
):
    card = db.query(Card).filter(Card.card_id == req.card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail=f"Card '{req.card_id}' not found")

    res = calculate_transaction_reward(
        card=card,
        amount=req.amount,
        merchant_id=req.merchant_id,
        category=req.category,
        db=db
    )

    return RewardCalcResponse(
        card_id=res["card_id"],
        card_name=res["card_name"],
        category=res["category"],
        merchant_id=res["merchant_id"],
        benefit_type=res["benefit_type"],
        benefit_value=res["benefit_value"],
        benefit_unit=res["benefit_unit"],
        estimated_reward_value=res["estimated_reward_value"],
        conditions_note=res["conditions_note"]
    )
