"""Booking business logic — validate, create, confirm, cancel."""

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.availability import AvailabilitySlot
from app.models.booking import Booking
from app.models.tutor import TutorProfile
from app.models.user import User
from app.services.calendar import create_calendar_event, delete_calendar_event


def create_booking(
    db: Session,
    student_id: str,
    tutor_id: str,
    subject: str,
    slot_id: str,
) -> Booking:
    """Validate inputs and create a new PENDING booking."""
    # Validate tutor exists
    tutor = db.query(TutorProfile).filter(TutorProfile.id == tutor_id).first()
    if not tutor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tutor not found")

    # Validate slot exists and is available
    slot = db.query(AvailabilitySlot).filter(AvailabilitySlot.id == slot_id).first()
    if not slot:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Slot not found")
    if slot.status != "AVAILABLE":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Slot is not available")
    if slot.tutor_id != tutor_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Slot does not belong to this tutor")

    # Create booking
    booking = Booking(
        student_id=student_id,
        tutor_id=tutor_id,
        subject=subject,
        slot_id=slot_id,
        status="PENDING",
    )
    db.add(booking)

    # Mark slot as booked
    slot.status = "BOOKED"

    db.commit()
    db.refresh(booking)
    return booking


def confirm_booking(db: Session, booking_id: str, user: User) -> Booking:
    """Confirm a pending booking and create a Google Calendar event."""
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")
    if booking.status != "PENDING":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Booking is not pending")

    # Load related data for calendar event
    student = db.query(User).filter(User.id == booking.student_id).first()
    tutor = db.query(TutorProfile).filter(TutorProfile.id == booking.tutor_id).first()
    tutor_user = db.query(User).filter(User.id == tutor.user_id).first() if tutor else None
    slot = db.query(AvailabilitySlot).filter(AvailabilitySlot.id == booking.slot_id).first()

    # Create Google Calendar event
    attendee_emails = []
    if student:
        attendee_emails.append(student.email)
    if tutor_user:
        attendee_emails.append(tutor_user.email)

    event_id, meet_link = create_calendar_event(
        summary=f"Tutoring Session: {booking.subject}",
        description=f"Tutoring session between {student.name if student else 'Student'} and {tutor_user.name if tutor_user else 'Tutor'}",
        start_time=slot.start_time.isoformat() if slot else "",
        end_time=slot.end_time.isoformat() if slot else "",
        attendee_emails=attendee_emails,
    )

    booking.status = "CONFIRMED"
    booking.calendar_event_id = event_id
    booking.meet_link = meet_link

    db.commit()
    db.refresh(booking)
    return booking


def cancel_booking(db: Session, booking_id: str, user: User) -> Booking:
    """Cancel a booking and delete the Google Calendar event if it exists."""
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")
    if booking.status == "CANCELLED":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Booking is already cancelled")

    # Delete calendar event if it exists
    if booking.calendar_event_id:
        delete_calendar_event(booking.calendar_event_id)

    booking.status = "CANCELLED"

    # Free the slot
    slot = db.query(AvailabilitySlot).filter(AvailabilitySlot.id == booking.slot_id).first()
    if slot:
        slot.status = "AVAILABLE"

    db.commit()
    db.refresh(booking)
    return booking
