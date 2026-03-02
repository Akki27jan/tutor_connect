"""Topic and TutorTopic SQLAlchemy models."""

import uuid

from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base


class TutorTopic(Base):
    """Association table: which tutors teach which topics."""
    __tablename__ = "tutor_topics"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    tutor_id = Column(String, ForeignKey("tutor_profiles.id"), nullable=False)
    topic_id = Column(String, ForeignKey("topics.id"), nullable=False)

    # Relationships
    tutor = relationship("TutorProfile", backref="tutor_topics")
    topic = relationship("Topic", backref="tutor_topics")

    def __repr__(self) -> str:
        return f"<TutorTopic tutor={self.tutor_id} topic={self.topic_id}>"


class Topic(Base):
    __tablename__ = "topics"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    subject_id = Column(String, ForeignKey("subjects.id"), nullable=False)
    name = Column(String(100), nullable=False)
    difficulty = Column(String(20), default="Intermediate")  # Beginner | Intermediate | Advanced

    # Relationships
    subject = relationship("Subject", back_populates="topics")

    def __repr__(self) -> str:
        return f"<Topic {self.name}>"
