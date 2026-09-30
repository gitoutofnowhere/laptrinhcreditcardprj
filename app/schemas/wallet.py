from typing import Optional
from pydantic import BaseModel, ConfigDict
from datetime import datetime
from app.schemas.card import CardOut

class WalletAddIn(BaseModel):
    card_id: str

class WalletCardOut(BaseModel):
    id: int
    user_id: int
    card_id: str
    added_at: datetime
    status: Optional[str] = "active"
    card: Optional[CardOut] = None

    model_config = ConfigDict(from_attributes=True)
