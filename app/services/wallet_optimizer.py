from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models.card import Card
from app.models.spending import SpendingProfile
from app.models.wallet import UserWallet
from app.services.reward_calculator import calculate_transaction_reward

def optimize_user_wallet(
    user_id: int,
    db: Session
) -> Dict[str, Any]:
    """
    Optimizes card selection for each spending category in user's wallet.
    Identifies weak / uncovered categories.
    """
    # Fetch user wallet cards
    wallet_entries = db.query(UserWallet).filter(
        UserWallet.user_id == user_id,
        UserWallet.status == "active"
    ).all()
    
    if not wallet_entries:
        return {
            "user_id": user_id,
            "total_monthly_spending": 0,
            "total_annual_reward": 0.0,
            "category_recommendations": [],
            "weak_categories": [],
            "message": "User wallet is empty. Please add cards to your wallet."
        }

    wallet_cards = [entry.card for entry in wallet_entries if entry.card]

    # Fetch spending profile
    spending_items = db.query(SpendingProfile).filter(
        SpendingProfile.user_id == user_id
    ).all()

    if not spending_items:
        return {
            "user_id": user_id,
            "total_monthly_spending": 0,
            "total_annual_reward": 0.0,
            "category_recommendations": [],
            "weak_categories": [],
            "message": "User spending profile is empty. Please enter your monthly spending."
        }

    category_recommendations = []
    weak_categories = []
    total_annual_reward = 0.0
    total_monthly_spending = 0

    for item in spending_items:
        category = item.category
        amount = float(item.monthly_amount)
        total_monthly_spending += item.monthly_amount

        best_card = None
        max_monthly_reward = -1.0
        best_reward_details = None

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
                best_reward_details = res

        annual_reward = max_monthly_reward * 12.0
        
        # Check if coverage is weak (e.g. reward is 0 or less than 1% of spending)
        is_weak = max_monthly_reward <= 0 or (max_monthly_reward / amount < 0.01 if amount > 0 else True)

        if is_weak:
            weak_categories.append({
                "category": category,
                "monthly_amount": amount,
                "current_best_reward": max_monthly_reward,
                "reason": "Current wallet lacks strong reward rates for this category"
            })

        if best_card and best_reward_details:
            b_val = best_reward_details.get("benefit_value")
            b_unit = best_reward_details.get("benefit_unit") or ""
            b_type = best_reward_details.get("benefit_type") or "reward"
            reason_str = f"Strongest {b_type} ({b_val}{'%' if b_unit=='percent' else ' '+b_unit}) for {category} among your cards"
            
            category_recommendations.append({
                "category": category,
                "monthly_spending": amount,
                "recommended_card_id": best_card.card_id,
                "recommended_card_name": best_card.name,
                "expected_monthly_reward": max_monthly_reward,
                "expected_annual_reward": annual_reward,
                "reason": reason_str
            })
            total_annual_reward += annual_reward

    return {
        "user_id": user_id,
        "total_monthly_spending": total_monthly_spending,
        "total_annual_reward": total_annual_reward,
        "category_recommendations": category_recommendations,
        "weak_categories": weak_categories
    }
