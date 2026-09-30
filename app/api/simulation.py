from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.user_dep import get_current_user
from app.models.user import User
from app.models.card import Card
from app.models.wallet import UserWallet
from app.models.spending import SpendingProfile
from app.schemas.simulation import SimulationRequest, SimulationResponse, ImprovedCategoryDetail
from app.services.reward_calculator import calculate_transaction_reward
from app.services.wallet_optimizer import optimize_user_wallet

router = APIRouter(prefix="/wallet", tags=["What-If Simulation"])

@router.post("/simulate", response_model=SimulationResponse)
def simulate_new_card(
    req: SimulationRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    candidate_card = db.query(Card).filter(Card.card_id == req.new_card_id).first()
    if not candidate_card:
        raise HTTPException(status_code=404, detail=f"Card '{req.new_card_id}' not found")

    # 1. Current Wallet Optimization Result
    current_opt = optimize_user_wallet(user_id=current_user.id, db=db)
    current_annual_reward = current_opt.get("total_annual_reward", 0.0)

    # 2. Prepare simulated wallet (Current Wallet + Candidate Card)
    wallet_entries = db.query(UserWallet).filter(
        UserWallet.user_id == current_user.id,
        UserWallet.status == "active"
    ).all()
    wallet_cards = [w.card for w in wallet_entries if w.card]

    # Include candidate_card if not already in wallet
    if candidate_card.card_id not in [c.card_id for c in wallet_cards]:
        wallet_cards.append(candidate_card)

    spending_items = db.query(SpendingProfile).filter(
        SpendingProfile.user_id == current_user.id
    ).all()

    simulated_annual_reward = 0.0
    improved_categories: List[ImprovedCategoryDetail] = []

    # Map previous category rewards
    prev_map = {rec["category"]: rec for rec in current_opt.get("category_recommendations", [])}

    for item in spending_items:
        category = item.category
        amount = float(item.monthly_amount)

        best_card = None
        max_monthly_reward = -1.0

        for card in wallet_cards:
            res = calculate_transaction_reward(
                card=card,
                amount=amount,
                category=category,
                db=db
            )
            monthly_reward = res["estimated_reward_value"]
            if monthly_reward > max_monthly_reward:
                max_monthly_reward = monthly_reward
                best_card = card

        sim_annual_category = max_monthly_reward * 12.0
        simulated_annual_reward += sim_annual_category

        prev_info = prev_map.get(category)
        prev_annual = prev_info["expected_annual_reward"] if prev_info else 0.0
        prev_card = prev_info["recommended_card_id"] if prev_info else None

        if sim_annual_category > prev_annual:
            improved_categories.append(
                ImprovedCategoryDetail(
                    category=category,
                    previous_card=prev_card,
                    previous_annual_reward=prev_annual,
                    new_card=best_card.card_id if best_card else req.new_card_id,
                    new_annual_reward=sim_annual_category,
                    annual_gain=sim_annual_category - prev_annual
                )
            )

    annual_diff = simulated_annual_reward - current_annual_reward

    return SimulationResponse(
        new_card_id=candidate_card.card_id,
        new_card_name=candidate_card.name,
        current_estimated_annual_reward=current_annual_reward,
        simulated_estimated_annual_reward=simulated_annual_reward,
        annual_difference=annual_diff,
        improved_categories=improved_categories
    )
