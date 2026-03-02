"""Tutor routes — profile CRUD, topic assignment, bookings list."""

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import require_tutor, get_current_user
from app.db.session import get_db
from app.models.tutor import TutorProfile
from app.models.booking import Booking
from app.models.user import User
from app.schemas.tutor import TutorProfileCreate, TutorProfileOut, TutorSubjectsUpdate
from app.schemas.booking import BookingOut

router = APIRouter(prefix="/tutors", tags=["Tutors"])


@router.post("/profile", response_model=TutorProfileOut, status_code=status.HTTP_201_CREATED)
def create_tutor_profile(
    payload: TutorProfileCreate,
    current_user: User = Depends(require_tutor),
    db: Session = Depends(get_db),
):
    """Create a tutor profile for the current user."""
    existing = db.query(TutorProfile).filter(TutorProfile.user_id == current_user.id).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Tutor profile already exists",
        )

    profile = TutorProfile(
        user_id=current_user.id,
        bio=payload.bio,
        qualifications=payload.qualifications,
    )
    db.add(profile)
    db.commit()
    db.refresh(profile)

    return TutorProfileOut(
        id=profile.id,
        user_id=profile.user_id,
        bio=profile.bio,
        qualifications=profile.qualifications,
        is_verified=profile.is_verified,
        rating=profile.rating,
        user_name=current_user.name,
        user_email=current_user.email,
        subjects=profile.subjects,
    )


@router.get("/profile", response_model=TutorProfileOut)
def get_tutor_profile(
    current_user: User = Depends(require_tutor),
    db: Session = Depends(get_db),
):
    """Get the current tutor's profile."""
    profile = db.query(TutorProfile).filter(TutorProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found")

    return TutorProfileOut(
        id=profile.id,
        user_id=profile.user_id,
        bio=profile.bio,
        qualifications=profile.qualifications,
        is_verified=profile.is_verified,
        rating=profile.rating,
        user_name=current_user.name,
        user_email=current_user.email,
        subjects=profile.subjects,
    )


@router.post("/subjects", response_model=dict)
def assign_subjects(
    payload: TutorSubjectsUpdate,
    current_user: User = Depends(require_tutor),
    db: Session = Depends(get_db),
):
    """Assign custom subjects to the current tutor's profile."""
    profile = db.query(TutorProfile).filter(TutorProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Create a profile first")

    # Save comma-separated string
    profile.subjects = ",".join(s.strip() for s in payload.subjects if s.strip())
    db.commit()

    return {"message": f"{len(payload.subjects)} subjects assigned"}


@router.get("/bookings", response_model=List[BookingOut])
def get_tutor_bookings(
    current_user: User = Depends(require_tutor),
    db: Session = Depends(get_db),
):
    """List all bookings for the current tutor."""
    profile = db.query(TutorProfile).filter(TutorProfile.user_id == current_user.id).first()
    if not profile:
        return []

    bookings = db.query(Booking).filter(Booking.tutor_id == profile.id).all()
    result = []
    for b in bookings:
        student = db.query(User).filter(User.id == b.student_id).first()
        result.append(BookingOut(
            id=b.id,
            student_id=b.student_id,
            tutor_id=b.tutor_id,
            subject=b.subject,
            slot_id=b.slot_id,
            status=b.status,
            calendar_event_id=b.calendar_event_id,
            meet_link=b.meet_link,
            created_at=b.created_at,
            student_name=student.name if student else None,
            student_email=student.email if student else None,
            tutor_name=current_user.name,
            slot_start=b.slot.start_time if b.slot else None,
            slot_end=b.slot.end_time if b.slot else None,
        ))
    return result


@router.get("/search", response_model=List[TutorProfileOut])
def search_tutors(
    q: str = "",
    db: Session = Depends(get_db)
):
    """Search for tutors by subject text dynamically."""
    query = db.query(TutorProfile).join(User)

    if q.strip():
        # SQLite simple LIKE query for substring matches on the subjects comma separated string
        search_term = f"%{q.strip()}%"
        query = query.filter(TutorProfile.subjects.ilike(search_term))

    profiles = query.all()

    result = []
    for profile in profiles:
        user = db.query(User).filter(User.id == profile.user_id).first()
        result.append(TutorProfileOut(
            id=profile.id,
            user_id=profile.user_id,
            bio=profile.bio,
            qualifications=profile.qualifications,
            is_verified=profile.is_verified,
            rating=profile.rating,
            user_name=user.name if user else None,
            user_email=user.email if user else None,
            subjects=profile.subjects,
        ))
    
    return result
