"""Booking SQLAlchemy model."""

import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    student_id = Column(String, ForeignKey("users.id"), nullable=False)
    tutor_id = Column(String, ForeignKey("tutor_profiles.id"), nullable=False)
    subject = Column(String(255), nullable=False)
    slot_id = Column(String, ForeignKey("availability_slots.id"), nullable=False)
    status = Column(String(20), default="PENDING", nullable=False)  # PENDING | CONFIRMED | CANCELLED
    calendar_event_id = Column(String(255), nullable=True)
    meet_link = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    student = relationship("User", backref="bookings", foreign_keys=[student_id])
    tutor = relationship("TutorProfile", backref="bookings")
    slot = relationship("AvailabilitySlot", backref="booking")

    def __repr__(self) -> str:
        return f"<Booking {self.id[:8]}... ({self.status})>"
