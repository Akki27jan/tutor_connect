"""Booking schemas."""

from datetime import datetime, timezone
from typing import Optional
from pydantic import BaseModel, field_validator


class BookingCreate(BaseModel):
    tutor_id: str
    subject: str
    slot_id: str


class BookingOut(BaseModel):
    id: str
    student_id: str
    tutor_id: str
    subject: str
    slot_id: str
    status: str
    calendar_event_id: Optional[str] = None
    meet_link: Optional[str] = None
    created_at: datetime
    # Denormalized fields for frontend convenience
    student_name: Optional[str] = None
    student_email: Optional[str] = None
    tutor_name: Optional[str] = None
    slot_start: Optional[datetime] = None
    slot_end: Optional[datetime] = None

    model_config = {"from_attributes": True}

    @field_validator("created_at", "slot_start", "slot_end", mode="after")
    @classmethod
    def force_utc(cls, v: Optional[datetime]) -> Optional[datetime]:
        if v is not None and v.tzinfo is None:
            return v.replace(tzinfo=timezone.utc)
        return v
