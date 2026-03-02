"""Availability routes — CRUD for tutor availability slots."""

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import require_tutor
from app.db.session import get_db
from app.models.tutor import TutorProfile
from app.models.availability import AvailabilitySlot
from app.models.user import User
from app.schemas.availability import AvailabilitySlotCreate, AvailabilitySlotOut

router = APIRouter(prefix="/availability", tags=["Availability"])


@router.post("/", response_model=AvailabilitySlotOut, status_code=status.HTTP_201_CREATED)
def create_availability_slot(
    payload: AvailabilitySlotCreate,
    current_user: User = Depends(require_tutor),
    db: Session = Depends(get_db),
):
    """Create a new availability slot for the current tutor."""
    profile = db.query(TutorProfile).filter(TutorProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Create a tutor profile first",
        )

    if payload.start_time >= payload.end_time:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="start_time must be before end_time",
        )

    slot = AvailabilitySlot(
        tutor_id=profile.id,
        start_time=payload.start_time,
        end_time=payload.end_time,
        status="AVAILABLE",
    )
    db.add(slot)
    db.commit()
    db.refresh(slot)
    return slot


@router.get("/tutor", response_model=List[AvailabilitySlotOut])
def list_tutor_availability(
    tutor_id: str | None = None,
    current_user: User = Depends(require_tutor),
    db: Session = Depends(get_db),
):
    """List availability slots. Defaults to the current tutor if no tutor_id is given."""
    if tutor_id:
        target_id = tutor_id
    else:
        profile = db.query(TutorProfile).filter(TutorProfile.user_id == current_user.id).first()
        if not profile:
            return []
        target_id = profile.id

    slots = (
        db.query(AvailabilitySlot)
        .filter(AvailabilitySlot.tutor_id == target_id)
        .order_by(AvailabilitySlot.start_time)
        .all()
    )
    return slots


@router.get("/{tutor_id}", response_model=List[AvailabilitySlotOut])
def get_tutor_availability_public(tutor_id: str, db: Session = Depends(get_db)):
    """Public endpoint — get available slots for a specific tutor."""
    slots = (
        db.query(AvailabilitySlot)
        .filter(
            AvailabilitySlot.tutor_id == tutor_id,
            AvailabilitySlot.status == "AVAILABLE",
        )
        .order_by(AvailabilitySlot.start_time)
        .all()
    )
    return slots


@router.delete("/{slot_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_availability_slot(
    slot_id: str,
    current_user: User = Depends(require_tutor),
    db: Session = Depends(get_db),
):
    """Delete an availability slot (only if it's still AVAILABLE)."""
    profile = db.query(TutorProfile).filter(TutorProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found")

    slot = (
        db.query(AvailabilitySlot)
        .filter(AvailabilitySlot.id == slot_id, AvailabilitySlot.tutor_id == profile.id)
        .first()
    )
    if not slot:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Slot not found")

    if slot.status == "BOOKED":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete a booked slot",
        )

    db.delete(slot)
    db.commit()
