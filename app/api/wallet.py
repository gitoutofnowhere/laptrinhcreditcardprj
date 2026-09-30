from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.user_dep import get_current_user
from app.models.user import User
from app.models.card import Card
from app.models.wallet import UserWallet
from app.schemas.wallet import WalletAddIn, WalletCardOut
from app.services.wallet_optimizer import optimize_user_wallet

router = APIRouter(prefix="/wallet", tags=["User Wallet"])

@router.get("", response_model=List[WalletCardOut])
def get_user_wallet(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    wallet_cards = db.query(UserWallet).filter(
        UserWallet.user_id == current_user.id,
        UserWallet.status == "active"
    ).all()
    return wallet_cards

@router.post("/cards", response_model=WalletCardOut, status_code=status.HTTP_201_CREATED)
def add_card_to_wallet(
    body: WalletAddIn,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    card = db.query(Card).filter(Card.card_id == body.card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found in database")

    existing = db.query(UserWallet).filter(
        UserWallet.user_id == current_user.id,
        UserWallet.card_id == body.card_id
    ).first()

    if existing:
        if existing.status == "inactive":
            existing.status = "active"
            db.commit()
            db.refresh(existing)
            return existing
        raise HTTPException(status_code=400, detail="Card is already in your wallet")

    wallet_item = UserWallet(
        user_id=current_user.id,
        card_id=body.card_id,
        status="active"
    )
    db.add(wallet_item)
    db.commit()
    db.refresh(wallet_item)
    return wallet_item

@router.delete("/cards/{card_id}")
def remove_card_from_wallet(
    card_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    wallet_item = db.query(UserWallet).filter(
        UserWallet.user_id == current_user.id,
        UserWallet.card_id == card_id
    ).first()

    if not wallet_item:
        raise HTTPException(status_code=404, detail="Card not found in your wallet")

    db.delete(wallet_item)
    db.commit()
    return {"message": f"Card {card_id} removed from wallet successfully"}

@router.post("/optimize")
def optimize_wallet_endpoint(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    res = optimize_user_wallet(user_id=current_user.id, db=db)
    return res
