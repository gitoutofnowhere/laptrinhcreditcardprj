from typing import List
from pydantic import BaseModel, ConfigDict, Field

class SpendingCategoryItem(BaseModel):
    category: str
    monthly_amount: int = Field(..., ge=0, description="Monthly spending amount in VND")

class SpendingProfileUpdate(BaseModel):
    items: List[SpendingCategoryItem]

class SpendingProfileItemOut(BaseModel):
    id: int
    user_id: int
    category: str
    monthly_amount: int

    model_config = ConfigDict(from_attributes=True)

class SpendingProfileOut(BaseModel):
    user_id: int
    items: List[SpendingProfileItemOut]
    total_monthly_spending: int
