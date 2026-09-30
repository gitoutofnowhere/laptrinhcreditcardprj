from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.merchant import Merchant
from app.models.benefit import CardBenefit
from app.schemas.merchant import MerchantOut

router = APIRouter(prefix="/merchants", tags=["Merchants"])

@router.get("", response_model=List[MerchantOut])
def get_merchants(
    category: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Merchant)
    if category:
        query = query.filter(Merchant.category.ilike(category))
    if search:
        query = query.filter(
            (Merchant.merchant_name.ilike(f"%{search}%")) |
            (Merchant.merchant_id.ilike(f"%{search}%"))
        )
    return query.all()

@router.get("/categories", tags=["Categories"])
def get_categories(db: Session = Depends(get_db)):
    benefit_cats = db.query(CardBenefit.category).distinct().all()
    merchant_cats = db.query(Merchant.category).distinct().all()

    all_cats = set()
    for row in benefit_cats:
        if row[0]:
            all_cats.add(row[0])
    for row in merchant_cats:
        if row[0]:
            all_cats.add(row[0])

    return {"categories": sorted(list(all_cats))}
