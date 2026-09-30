from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.user_dep import get_current_user
from app.models.user import User
from app.models.spending import SpendingProfile
from app.schemas.spending import SpendingProfileUpdate, SpendingProfileOut, SpendingProfileItemOut

router = APIRouter(prefix="/spending-profile", tags=["Spending Profile"])

@router.get("", response_model=SpendingProfileOut)
def get_spending_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    items = db.query(SpendingProfile).filter(
        SpendingProfile.user_id == current_user.id
    ).all()

    total_amount = sum(item.monthly_amount for item in items)
    out_items = [
        SpendingProfileItemOut(
            id=item.id,
            user_id=item.user_id,
            category=item.category,
            monthly_amount=item.monthly_amount
        ) for item in items
    ]

    return SpendingProfileOut(
        user_id=current_user.id,
        items=out_items,
        total_monthly_spending=total_amount
    )

@router.put("", response_model=SpendingProfileOut)
def update_spending_profile(
    body: SpendingProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Upsert spending categories
    for item in body.items:
        existing = db.query(SpendingProfile).filter(
            SpendingProfile.user_id == current_user.id,
            SpendingProfile.category.ilike(item.category)
        ).first()

        if existing:
            existing.monthly_amount = item.monthly_amount
        else:
            new_item = SpendingProfile(
                user_id=current_user.id,
                category=item.category,
                monthly_amount=item.monthly_amount
            )
            db.add(new_item)

    db.commit()

    # Refresh full profile
    items = db.query(SpendingProfile).filter(
        SpendingProfile.user_id == current_user.id
    ).all()

    total_amount = sum(i.monthly_amount for i in items)
    out_items = [
        SpendingProfileItemOut(
            id=i.id,
            user_id=i.user_id,
            category=i.category,
            monthly_amount=i.monthly_amount
        ) for i in items
    ]

    return SpendingProfileOut(
        user_id=current_user.id,
        items=out_items,
        total_monthly_spending=total_amount
    )
