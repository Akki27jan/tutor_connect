"""User routes."""

from fastapi import APIRouter, Depends

from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.user import UserOut

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserOut)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """Return the currently authenticated user's profile."""
    return current_user
