"""Booking routes — create, confirm, cancel, list."""

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, require_student, require_tutor
from app.db.session import get_db
from app.models.user import User
from app.models.tutor import TutorProfile
from app.models.availability import AvailabilitySlot
from app.models.booking import Booking
from app.schemas.booking import BookingCreate, BookingOut
from app.services.booking_service import create_booking, confirm_booking, cancel_booking

router = APIRouter(prefix="/bookings", tags=["Bookings"])


def _booking_to_out(b: Booking, db: Session) -> BookingOut:
    """Helper to convert a Booking ORM object to BookingOut with denormalized fields."""
    student = db.query(User).filter(User.id == b.student_id).first()
    tutor_profile = db.query(TutorProfile).filter(TutorProfile.id == b.tutor_id).first()
    tutor_user = db.query(User).filter(User.id == tutor_profile.user_id).first() if tutor_profile else None
    slot = db.query(AvailabilitySlot).filter(AvailabilitySlot.id == b.slot_id).first()

    return BookingOut(
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
        tutor_name=tutor_user.name if tutor_user else None,
        slot_start=slot.start_time if slot else None,
        slot_end=slot.end_time if slot else None,
    )


@router.post("/", response_model=BookingOut, status_code=status.HTTP_201_CREATED)
def create_new_booking(
    payload: BookingCreate,
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db),
):
    """Student creates a booking for a tutor slot."""
    booking = create_booking(
        db=db,
        student_id=current_user.id,
        tutor_id=payload.tutor_id,
        subject=payload.subject,
        slot_id=payload.slot_id,
    )
    return _booking_to_out(booking, db)


@router.post("/{booking_id}/confirm", response_model=BookingOut)
def confirm_existing_booking(
    booking_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Confirm a pending booking (tutor or student)."""
    booking = confirm_booking(db=db, booking_id=booking_id, user=current_user)
    return _booking_to_out(booking, db)


@router.post("/{booking_id}/cancel", response_model=BookingOut)
def cancel_existing_booking(
    booking_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Cancel a booking (tutor or student)."""
    booking = cancel_booking(db=db, booking_id=booking_id, user=current_user)
    return _booking_to_out(booking, db)


@router.get("/student", response_model=List[BookingOut])
def list_student_bookings(
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db),
):
    """List all bookings for the current student."""
    bookings = db.query(Booking).filter(Booking.student_id == current_user.id).all()
    return [_booking_to_out(b, db) for b in bookings]


@router.get("/tutor", response_model=List[BookingOut])
def list_tutor_bookings_from_booking_route(
    current_user: User = Depends(require_tutor),
    db: Session = Depends(get_db),
):
    """List all bookings for the current tutor (alternative route)."""
    profile = db.query(TutorProfile).filter(TutorProfile.user_id == current_user.id).first()
    if not profile:
        return []
    bookings = db.query(Booking).filter(Booking.tutor_id == profile.id).all()
    return [_booking_to_out(b, db) for b in bookings]
