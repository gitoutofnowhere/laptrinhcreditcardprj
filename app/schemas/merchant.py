from typing import Optional
from pydantic import BaseModel, ConfigDict

class MerchantOut(BaseModel):
    id: int
    merchant_id: str
    merchant_name: str
    normalized_name: Optional[str] = None
    category: Optional[str] = None
    logo_url: Optional[str] = None
    website: Optional[str] = None
    status: Optional[str] = "active"

    model_config = ConfigDict(from_attributes=True)
