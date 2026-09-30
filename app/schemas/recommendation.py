from typing import Optional, List
from enum import Enum
from pydantic import BaseModel, ConfigDict

class RecommendationMode(str, Enum):
    USE_EXISTING_CARD = "USE_EXISTING_CARD"
    FIND_CARD_TO_OPEN = "FIND_CARD_TO_OPEN"

class RecommendationRequest(BaseModel):
    mode: RecommendationMode = RecommendationMode.FIND_CARD_TO_OPEN
    
    # Inputs for USE_EXISTING_CARD or specific transaction context
    merchant_id: Optional[str] = None
    category: Optional[str] = None
    amount: Optional[float] = None

    # Inputs for FIND_CARD_TO_OPEN
    monthly_income: Optional[float] = None
    favorite_merchants: Optional[List[str]] = []
    favorite_categories: Optional[List[str]] = []
    primary_preference: str = "cashback"  # cashback, points, discount, travel, low_fee, merchant_benefits
    secondary_preferences: Optional[List[str]] = []
    max_annual_fee: Optional[float] = None

class RecommendedCard(BaseModel):
    card_id: str
    name: str
    bank_name: Optional[str] = None
    score: float
    estimated_value: Optional[float] = None
    reasons: List[str]

class AlternativeCard(BaseModel):
    rank: int
    card_id: str
    name: str
    bank_name: Optional[str] = None
    score: float
    best_for: str

class RecommendationResponse(BaseModel):
    mode: RecommendationMode
    recommended_card: RecommendedCard
    alternatives: List[AlternativeCard]
