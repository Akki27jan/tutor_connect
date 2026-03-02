"""AvailabilitySlot SQLAlchemy model."""

import uuid

from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base


class AvailabilitySlot(Base):
    __tablename__ = "availability_slots"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    tutor_id = Column(String, ForeignKey("tutor_profiles.id"), nullable=False)
    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=False)
    status = Column(String(20), default="AVAILABLE", nullable=False)  # AVAILABLE | BOOKED

    # Relationships
    tutor = relationship("TutorProfile", backref="availability_slots")

    def __repr__(self) -> str:
        return f"<AvailabilitySlot {self.start_time} – {self.end_time} ({self.status})>"
