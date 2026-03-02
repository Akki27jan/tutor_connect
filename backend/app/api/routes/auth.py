"""Auth routes — signup, login, logout, me."""

from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session

from app.core.security import hash_password, verify_password, create_access_token
from app.core.dependencies import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import SignupRequest, LoginRequest, MessageResponse
from app.schemas.user import UserOut

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/signup", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def signup(payload: SignupRequest, response: Response, db: Session = Depends(get_db)):
    """Register a new student or tutor account."""
    # Validate role
    if payload.role not in ("STUDENT", "TUTOR"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Role must be STUDENT or TUTOR",
        )

    # Check duplicate email
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    user = User(
        name=payload.name,
        email=payload.email,
        password_hash=hash_password(payload.password),
        role=payload.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Issue JWT in HTTP-only cookie
    token = create_access_token(data={"sub": user.id, "role": user.role})
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        samesite="lax",
        max_age=3600,
        path="/",
    )

    return user


@router.post("/login", response_model=UserOut)
def login(payload: LoginRequest, response: Response, db: Session = Depends(get_db)):
    """Authenticate and issue a JWT cookie."""
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = create_access_token(data={"sub": user.id, "role": user.role})
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        samesite="lax",
        max_age=3600,
        path="/",
    )

    return user


@router.post("/logout", response_model=MessageResponse)
def logout(response: Response):
    """Clear the JWT cookie."""
    response.delete_cookie(key="access_token", path="/")
    return {"message": "Logged out successfully"}


@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    """Return the currently authenticated user."""
    return current_user
