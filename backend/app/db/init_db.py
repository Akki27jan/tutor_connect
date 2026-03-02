"""Database initialization — create tables and seed data."""

from sqlalchemy.orm import Session

from app.db.base import Base  # noqa: F401 — ensures all models are imported
from app.db.session import engine, SessionLocal
from app.models.user import User
from app.models.subject import Subject
from app.models.topic import Topic, TutorTopic
from app.models.tutor import TutorProfile
from app.models.availability import AvailabilitySlot
from app.models.booking import Booking


def init_db() -> None:
    """Create all tables and insert seed data if the DB is empty."""
    Base.metadata.create_all(bind=engine)
    _seed_data()


def _seed_data() -> None:
    """Insert starter subjects and topics if none exist."""
    db: Session = SessionLocal()
    try:
        if db.query(Subject).count() > 0:
            return  # Already seeded

        subjects_data = [
            {
                "name": "Mathematics",
                "exam_board": "CBSE",
                "topics": [
                    {"name": "Algebra", "difficulty": "Intermediate"},
                    {"name": "Calculus", "difficulty": "Advanced"},
                    {"name": "Geometry", "difficulty": "Beginner"},
                    {"name": "Trigonometry", "difficulty": "Intermediate"},
                    {"name": "Statistics", "difficulty": "Intermediate"},
                ],
            },
            {
                "name": "Physics",
                "exam_board": "CBSE",
                "topics": [
                    {"name": "Mechanics", "difficulty": "Intermediate"},
                    {"name": "Thermodynamics", "difficulty": "Advanced"},
                    {"name": "Optics", "difficulty": "Beginner"},
                    {"name": "Electromagnetism", "difficulty": "Advanced"},
                ],
            },
            {
                "name": "Chemistry",
                "exam_board": "CBSE",
                "topics": [
                    {"name": "Organic Chemistry", "difficulty": "Advanced"},
                    {"name": "Inorganic Chemistry", "difficulty": "Intermediate"},
                    {"name": "Physical Chemistry", "difficulty": "Intermediate"},
                ],
            },
            {
                "name": "Biology",
                "exam_board": "CBSE",
                "topics": [
                    {"name": "Cell Biology", "difficulty": "Beginner"},
                    {"name": "Genetics", "difficulty": "Advanced"},
                    {"name": "Ecology", "difficulty": "Intermediate"},
                ],
            },
            {
                "name": "Computer Science",
                "exam_board": "CBSE",
                "topics": [
                    {"name": "Data Structures", "difficulty": "Intermediate"},
                    {"name": "Algorithms", "difficulty": "Advanced"},
                    {"name": "Python Programming", "difficulty": "Beginner"},
                    {"name": "Web Development", "difficulty": "Intermediate"},
                ],
            },
        ]

        for subj_data in subjects_data:
            subject = Subject(name=subj_data["name"], exam_board=subj_data["exam_board"])
            db.add(subject)
            db.flush()  # get the id

            for topic_data in subj_data["topics"]:
                topic = Topic(
                    subject_id=subject.id,
                    name=topic_data["name"],
                    difficulty=topic_data["difficulty"],
                )
                db.add(topic)

        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
