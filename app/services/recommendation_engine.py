from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.card import Card
from app.models.benefit import CardBenefit
from app.models.merchant import CardMerchant, Merchant
from app.models.bank import Bank
from app.models.wallet import UserWallet
from app.schemas.recommendation import RecommendationRequest, RecommendationMode
from app.services.reward_calculator import calculate_transaction_reward

# Configurable Weights dictionary by primary preference
WEIGHT_PROFILES = {
    "cashback": {
        "reward_match": 0.45,
        "merchant_match": 0.25,
        "category_match": 0.15,
        "fee_value": 0.10,
        "tier_other": 0.05
    },
    "points": {
        "reward_match": 0.45,
        "merchant_match": 0.20,
        "category_match": 0.20,
        "fee_value": 0.10,
        "tier_other": 0.05
    },
    "travel": {
        "category_match": 0.40,  # Travel category
        "merchant_match": 0.25,  # Agoda, Klook, etc.
        "reward_match": 0.15,
        "fee_value": 0.10,
        "tier_other": 0.10
    },
    "low_fee": {
        "fee_value": 0.50,
        "reward_match": 0.25,
        "merchant_match": 0.15,
        "category_match": 0.05,
        "tier_other": 0.05
    },
    "merchant_benefits": {
        "merchant_match": 0.50,
        "category_match": 0.20,
        "reward_match": 0.15,
        "fee_value": 0.10,
        "tier_other": 0.05
    }
}

def apply_hard_filters(
    candidate_cards: List[Card],
    req: RecommendationRequest,
    wallet_card_ids: List[str]
) -> List[Card]:
    """Applies strict hard filters based on income, fee, status, and mode."""
    filtered = []

    for card in candidate_cards:
        if card.status and card.status != "active":
            continue

        if req.mode == RecommendationMode.USE_EXISTING_CARD:
            if card.card_id not in wallet_card_ids:
                continue
        elif req.mode == RecommendationMode.FIND_CARD_TO_OPEN:
            # Exclude already owned cards unless requested
            if card.card_id in wallet_card_ids:
                continue

            # Income eligibility filter: apply ONLY if minimum_income is known
            if req.monthly_income is not None and card.minimum_income is not None:
                if card.minimum_income > req.monthly_income:
                    continue

            # Fee filter: apply ONLY if annual_fee is known
            if req.max_annual_fee is not None and card.annual_fee is not None:
                if card.annual_fee > req.max_annual_fee:
                    continue

        filtered.append(card)

    return filtered

def score_card(
    card: Card,
    req: RecommendationRequest,
    db: Session
) -> Dict[str, Any]:
    """Scores a candidate card against user preferences and context."""
    pref = req.primary_preference.lower()
    weights = WEIGHT_PROFILES.get(pref, WEIGHT_PROFILES["cashback"])

    reasons = []

    # 1. Merchant Match Score (0 - 100)
    merchant_score = 0.0
    target_merchants = []
    if req.merchant_id:
        target_merchants.append(req.merchant_id)
    if req.favorite_merchants:
        target_merchants.extend(req.favorite_merchants)

    matched_merchant_names = []
    if target_merchants:
        for m_id in set(target_merchants):
            cm = db.query(CardMerchant).filter(
                CardMerchant.card_id == card.card_id,
                CardMerchant.merchant_id == m_id,
                CardMerchant.status == "current"
            ).first()
            if cm:
                merchant_score += 50.0
                m_obj = db.query(Merchant).filter(Merchant.merchant_id == m_id).first()
                m_name = m_obj.merchant_name if m_obj else m_id
                matched_merchant_names.append(m_name)

        merchant_score = min(100.0, merchant_score)

    # 2. Category Match Score (0 - 100)
    category_score = 0.0
    target_categories = []
    if req.category:
        target_categories.append(req.category)
    if req.favorite_categories:
        target_categories.extend(req.favorite_categories)

    matched_categories = []
    if target_categories:
        for cat in set(target_categories):
            cb = db.query(CardBenefit).filter(
                CardBenefit.card_id == card.card_id,
                CardBenefit.category.ilike(cat),
                CardBenefit.status == "current"
            ).first()
            if cb:
                category_score += 50.0
                matched_categories.append(cb.category)

        category_score = min(100.0, category_score)
    else:
        # General card category score based on total benefit count
        benefit_count = db.query(CardBenefit).filter(CardBenefit.card_id == card.card_id).count()
        category_score = min(100.0, benefit_count * 25.0)

    # 3. Reward Match Score (0 - 100) & Estimated Transaction Value
    reward_score = 50.0
    estimated_value = None

    if req.amount and req.amount > 0:
        res = calculate_transaction_reward(
            card=card,
            amount=req.amount,
            merchant_id=req.merchant_id,
            category=req.category,
            db=db
        )
        estimated_value = res["estimated_reward_value"]
        # Score proportional to reward percentage
        reward_score = min(100.0, (estimated_value / req.amount) * 1000.0)
    else:
        # Evaluate top percentage benefit in card_benefits
        top_cb = db.query(CardBenefit).filter(
            CardBenefit.card_id == card.card_id,
            CardBenefit.benefit_type == pref if pref in ['cashback', 'points'] else CardBenefit.benefit_type != None
        ).order_by(CardBenefit.benefit_value.desc()).first()

        if top_cb and top_cb.benefit_value:
            reward_score = min(100.0, top_cb.benefit_value * 6.0)

    # 4. Fee Value Score (0 - 100)
    fee_score = 50.0
    if card.annual_fee is not None:
        if card.annual_fee == 0:
            fee_score = 100.0
        elif card.annual_fee <= 200000:
            fee_score = 85.0
        elif card.annual_fee <= 500000:
            fee_score = 70.0
        else:
            fee_score = 50.0

    # 5. Tier / Other Score (0 - 100)
    tier_score = 50.0
    if card.card_tier in ["Platinum", "Gold"]:
        tier_score = 80.0

    # Calculate Total Score
    total_score = (
        reward_score * weights.get("reward_match", 0.2) +
        merchant_score * weights.get("merchant_match", 0.2) +
        category_score * weights.get("category_match", 0.2) +
        fee_score * weights.get("fee_value", 0.2) +
        tier_score * weights.get("tier_other", 0.2)
    )

    # Generate Factual Reasons
    reasons.append(f"Matches your primary preference for '{pref}'")
    
    if matched_merchant_names:
        reasons.append(f"Includes specific merchant deals for {', '.join(matched_merchant_names)}")
    
    if matched_categories:
        reasons.append(f"Provides strong category benefits for {', '.join(matched_categories)}")

    if card.annual_fee == 0:
        reasons.append("Free annual fee (0 VND)")
    elif card.annual_fee is not None:
        reasons.append(f"Annual fee is {card.annual_fee:,} VND")

    if estimated_value and estimated_value > 0:
        reasons.append(f"Estimated reward value: {estimated_value:,.0f} VND for this spending")

    bank = db.query(Bank).filter(Bank.bank_id == card.bank_id).first()

    return {
        "card_id": card.card_id,
        "name": card.name,
        "bank_name": bank.name if bank else card.bank_id,
        "score": round(total_score, 1),
        "estimated_value": estimated_value,
        "reasons": reasons,
        "annual_fee": card.annual_fee,
        "merchant_score": merchant_score,
        "category_score": category_score
    }

def recommend_cards(
    req: RecommendationRequest,
    user_id: int,
    db: Session
) -> Dict[str, Any]:
    """Core recommendation pipeline."""
    # Get user wallet cards
    wallet_entries = db.query(UserWallet).filter(
        UserWallet.user_id == user_id,
        UserWallet.status == "active"
    ).all()
    wallet_card_ids = [w.card_id for w in wallet_entries]

    # Query all candidate cards
    all_cards = db.query(Card).all()

    # Step 1: Hard Filters
    candidates = apply_hard_filters(all_cards, req, wallet_card_ids)

    if not candidates:
        # Fallback if hard filters eliminate everything in FIND_CARD_TO_OPEN
        if req.mode == RecommendationMode.USE_EXISTING_CARD:
            raise ValueError("No active cards found in your wallet matching the criteria.")
        candidates = all_cards

    # Step 2: Benefit Matching & Weighted Scoring
    scored_results = []
    for card in candidates:
        s_res = score_card(card, req, db)
        scored_results.append(s_res)

    # Step 3: Sort by Total Score descending
    scored_results.sort(key=lambda x: x["score"], reverse=True)

    top_choice = scored_results[0]
    alternatives_data = scored_results[1:4]

    # Contextual tags for alternatives
    alternatives = []
    for rank, alt in enumerate(alternatives_data, start=2):
        best_for_tag = "Alternative option"
        if alt.get("annual_fee") == 0:
            best_for_tag = "Best for zero annual fee"
        elif alt.get("merchant_score", 0) > 40:
            best_for_tag = "Best for merchant-specific benefits"
        elif alt.get("category_score", 0) > 40:
            best_for_tag = "Best for category rewards"

        alternatives.append({
            "rank": rank,
            "card_id": alt["card_id"],
            "name": alt["name"],
            "bank_name": alt["bank_name"],
            "score": alt["score"],
            "best_for": best_for_tag
        })

    return {
        "mode": req.mode,
        "recommended_card": {
            "card_id": top_choice["card_id"],
            "name": top_choice["name"],
            "bank_name": top_choice["bank_name"],
            "score": top_choice["score"],
            "estimated_value": top_choice["estimated_value"],
            "reasons": top_choice["reasons"]
        },
        "alternatives": alternatives
    }
