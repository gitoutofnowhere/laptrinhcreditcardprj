from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from datetime import datetime

class BankOut(BaseModel):
    id: int
    bank_id: str
    name: str
    website: Optional[str] = None
    logo_url: Optional[str] = None
    status: Optional[str] = "active"

    model_config = ConfigDict(from_attributes=True)

class CardBenefitOut(BaseModel):
    id: int
    card_id: str
    category: str
    benefit_type: str
    benefit_value: float
    benefit_unit: str
    maximum_benefit: Optional[float] = None
    minimum_spend: Optional[float] = 0
    frequency: Optional[str] = None
    conditions: Optional[str] = None
    status: Optional[str] = "current"

    model_config = ConfigDict(from_attributes=True)

class CardMerchantOut(BaseModel):
    id: int
    card_id: str
    merchant_id: str
    merchant_name: Optional[str] = None
    relationship_type: Optional[str] = None
    benefit_type: Optional[str] = None
    benefit_value: Optional[float] = None
    benefit_unit: Optional[str] = None
    maximum_benefit: Optional[float] = None
    minimum_spend: Optional[float] = 0
    conditions: Optional[str] = None
    status: Optional[str] = "current"

    model_config = ConfigDict(from_attributes=True)

class CardOut(BaseModel):
    id: int
    card_id: str
    bank_id: str
    name: str
    network: Optional[str] = None
    card_tier: Optional[str] = None
    card_type: Optional[str] = None
    annual_fee: Optional[int] = None
    annual_fee_waiver_condition: Optional[str] = None
    minimum_income: Optional[int] = None
    application_url: Optional[str] = None
    image_url: Optional[str] = None
    status: Optional[str] = "active"

    model_config = ConfigDict(from_attributes=True)

class CardDetailOut(CardOut):
    bank: Optional[BankOut] = None
    benefits: List[CardBenefitOut] = []
    merchants: List[CardMerchantOut] = []
