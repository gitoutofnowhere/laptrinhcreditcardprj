from typing import List, Optional
from pydantic import BaseModel

class CardCompareRequest(BaseModel):
    card_ids: List[str]

class CardCompareItem(BaseModel):
    card_id: str
    name: str
    bank_name: Optional[str] = None
    annual_fee: Optional[int] = None
    minimum_income: Optional[int] = None
    network: Optional[str] = None
    card_tier: Optional[str] = None
    top_benefits: List[str] = []
    merchant_deals_count: int = 0

class CardCompareResponse(BaseModel):
    compared_cards: List[CardCompareItem]
