"""Subject SQLAlchemy model."""

import uuid

from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from app.db.base import Base


class Subject(Base):
    __tablename__ = "subjects"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False)
    exam_board = Column(String(50), default="")

    # Relationships
    topics = relationship("Topic", back_populates="subject", lazy="selectin")

    def __repr__(self) -> str:
        return f"<Subject {self.name}>"
