from typing import Optional
from pydantic import BaseModel, ConfigDict

class RewardCalcRequest(BaseModel):
    card_id: str
    merchant_id: Optional[str] = None
    category: Optional[str] = None
    amount: float

class RewardCalcResponse(BaseModel):
    card_id: str
    card_name: str
    category: Optional[str] = None
    merchant_id: Optional[str] = None
    benefit_type: Optional[str] = None
    benefit_value: Optional[float] = None
    benefit_unit: Optional[str] = None
    estimated_reward_value: float
    conditions_note: Optional[str] = None
