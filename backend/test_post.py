from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.tutor import TutorProfile
from app.models.availability import AvailabilitySlot
from app.models.user import User
from app.services.booking_service import create_booking

db = SessionLocal()
# Pick a student
student = db.query(User).filter(User.role == "STUDENT").first()
# Pick an available slot
slot = db.query(AvailabilitySlot).filter(AvailabilitySlot.status == "AVAILABLE").first()

if not student or not slot:
    print("Missing data")
else:
    tutor_id = slot.tutor_id
    subject = "Math"
    print(f"Booking {slot.id} for {student.id} with {tutor_id}")
    try:
        booking = create_booking(db, student.id, tutor_id, subject, slot.id)
        from app.api.routes.bookings import _booking_to_out
        out = _booking_to_out(booking, db)
        print("Success!", out)
    except Exception as e:
        print("Error!", repr(e))
db.close()
