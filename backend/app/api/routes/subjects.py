"""Subject & Topic discovery routes."""

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.subject import Subject
from app.models.topic import Topic, TutorTopic
from app.models.tutor import TutorProfile
from app.models.user import User
from app.schemas.subject import SubjectOut, TopicOut
from app.schemas.tutor import TutorWithTopics

router = APIRouter(tags=["Discovery"])


@router.get("/subjects", response_model=List[SubjectOut])
def list_subjects(db: Session = Depends(get_db)):
    """List all subjects with their topics."""
    subjects = db.query(Subject).all()
    return subjects


@router.get("/subjects/{subject_id}/topics", response_model=List[TopicOut])
def list_topics_for_subject(subject_id: str, db: Session = Depends(get_db)):
    """List all topics under a given subject."""
    subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subject not found")
    topics = db.query(Topic).filter(Topic.subject_id == subject_id).all()
    return topics


@router.get("/topics/{topic_id}/tutors", response_model=List[TutorWithTopics])
def list_tutors_for_topic(topic_id: str, db: Session = Depends(get_db)):
    """List all tutors who teach a given topic."""
    topic = db.query(Topic).filter(Topic.id == topic_id).first()
    if not topic:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Topic not found")

    tutor_topic_links = db.query(TutorTopic).filter(TutorTopic.topic_id == topic_id).all()
    result = []
    for link in tutor_topic_links:
        profile = db.query(TutorProfile).filter(TutorProfile.id == link.tutor_id).first()
        if not profile:
            continue
        user = db.query(User).filter(User.id == profile.user_id).first()

        # Gather all topics this tutor teaches
        all_links = db.query(TutorTopic).filter(TutorTopic.tutor_id == profile.id).all()
        topic_names = []
        for tl in all_links:
            t = db.query(Topic).filter(Topic.id == tl.topic_id).first()
            if t:
                topic_names.append(t.name)

        result.append(TutorWithTopics(
            id=profile.id,
            user_id=profile.user_id,
            bio=profile.bio,
            qualifications=profile.qualifications,
            is_verified=profile.is_verified,
            rating=profile.rating,
            user_name=user.name if user else None,
            user_email=user.email if user else None,
            topics=topic_names,
        ))
    return result
