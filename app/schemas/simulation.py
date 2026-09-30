from typing import List, Optional
from pydantic import BaseModel

class SimulationRequest(BaseModel):
    new_card_id: str

class ImprovedCategoryDetail(BaseModel):
    category: str
    previous_card: Optional[str] = None
    previous_annual_reward: float
    new_card: str
    new_annual_reward: float
    annual_gain: float

class SimulationResponse(BaseModel):
    new_card_id: str
    new_card_name: str
    current_estimated_annual_reward: float
    simulated_estimated_annual_reward: float
    annual_difference: float
    improved_categories: List[ImprovedCategoryDetail]
