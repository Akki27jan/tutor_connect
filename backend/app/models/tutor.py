"""TutorProfile SQLAlchemy model."""

import uuid

from sqlalchemy import Column, String, Text, Boolean, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base


class TutorProfile(Base):
    __tablename__ = "tutor_profiles"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), unique=True, nullable=False)
    bio = Column(Text, default="")
    qualifications = Column(Text, default="")
    subjects = Column(String, default="")  # comma-separated list of subjects
    is_verified = Column(Boolean, default=False)
    rating = Column(Float, default=0.0)

    # Relationships
    user = relationship("User", backref="tutor_profile", lazy="joined")

    def __repr__(self) -> str:
        return f"<TutorProfile user_id={self.user_id}>"
