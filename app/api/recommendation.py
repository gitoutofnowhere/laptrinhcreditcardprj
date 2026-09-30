from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.user_dep import get_current_user
from app.models.user import User
from app.schemas.recommendation import RecommendationRequest, RecommendationResponse
from app.services.recommendation_engine import recommend_cards

router = APIRouter(prefix="/recommendation", tags=["Recommendation Engine"])

@router.post("", response_model=RecommendationResponse)
def get_card_recommendation(
    req: RecommendationRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        res = recommend_cards(req=req, user_id=current_user.id, db=db)
        return res
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation engine error: {str(e)}")
