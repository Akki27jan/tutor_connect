"""FastAPI dependency functions for auth and database sessions."""

from fastapi import Depends, HTTPException, status, Request
from sqlalchemy.orm import Session

from app.core.security import decode_access_token
from app.db.session import get_db
from app.models.user import User


def get_token_from_cookie(request: Request) -> str:
    """Extract the JWT from the HTTP-only cookie."""
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )
    return token


def get_current_user(
    token: str = Depends(get_token_from_cookie),
    db: Session = Depends(get_db),
) -> User:
    """Decode the JWT and return the corresponding User record."""
    payload = decode_access_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )
    user_id: str | None = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    return user


def require_student(current_user: User = Depends(get_current_user)) -> User:
    """Ensure the current user has the STUDENT role."""
    if current_user.role != "STUDENT":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Students only",
        )
    return current_user


def require_tutor(current_user: User = Depends(get_current_user)) -> User:
    """Ensure the current user has the TUTOR role."""
    if current_user.role != "TUTOR":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tutors only",
        )
    return current_user
