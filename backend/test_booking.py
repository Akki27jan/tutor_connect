import sys
print("starting", file=sys.stderr)
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
print("imported sqla", file=sys.stderr)
from app.models.tutor import TutorProfile
from app.models.availability import AvailabilitySlot
from app.models.user import User
from app.models.booking import Booking
print("imported models", file=sys.stderr)

try:
    engine = create_engine("sqlite:///./tutoring.db")
    SessionLocal = sessionmaker(bind=engine)
    db = SessionLocal()
    print("db connected", file=sys.stderr)
    
    users = db.query(User).all()
    print(f"users: {len(users)}", file=sys.stderr)

    slots = db.query(AvailabilitySlot).filter().all()
    print(f"slots: {len(slots)}", file=sys.stderr)

except Exception as e:
    print(e, file=sys.stderr)

print("done", file=sys.stderr)
