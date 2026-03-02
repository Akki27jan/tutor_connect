# **Technical Design Documentation – Topic-Based Tutoring Platform (MVP)**
1\. Objective\
This document defines a production-ready technical design for a topic-based tutoring platform MVP built using a Python FastAPI backend. The platform supports student and tutor accounts, topic-based discovery, slot-based scheduling, and automatic Google Meet scheduling using a platform-owned Google Calendar. No real payment processing is included.

2\. Technology Stack\
\
Frontend:\
\- Next.js (React, App Router)\
\- Tailwind CSS\
\- React Query\
\
Backend:\
\- Python 3.11+\
\- FastAPI\
\- SQLAlchemy ORM\
\- Pydantic\
\- JWT Authentication (OAuth2 Password Flow)\
\
Database:\
\- PostgreSQL\
\
External Services:\
\- Google Calendar API (Google Meet)

3\. Production-Ready Backend Folder Structure\
\
backend/\
├── app/\
│   ├── main.py\
│   ├── core/\
│   │   ├── config.py\
│   │   ├── security.py\
│   │   └── dependencies.py\
│   ├── db/\
│   │   ├── base.py\
│   │   ├── session.py\
│   │   └── init\_db.py\
│   ├── models/\
│   │   ├── user.py\
│   │   ├── tutor.py\
│   │   ├── subject.py\
│   │   ├── topic.py\
│   │   ├── availability.py\
│   │   └── booking.py\
│   ├── schemas/\
│   │   ├── auth.py\
│   │   ├── user.py\
│   │   ├── tutor.py\
│   │   ├── subject.py\
│   │   ├── booking.py\
│   │   └── availability.py\
│   ├── api/\
│   │   ├── routes/\
│   │   │   ├── auth.py\
│   │   │   ├── users.py\
│   │   │   ├── tutors.py\
│   │   │   ├── subjects.py\
│   │   │   ├── bookings.py\
│   │   │   └── availability.py\
│   │   └── router.py\
│   ├── services/\
│   │   ├── calendar.py\
│   │   └── booking\_service.py\
│   └── utils/\
│       └── time.py\
├── alembic/\
├── requirements.txt\
└── .env

4\. Authentication & Authorization\
\
\- OAuth2 Password Flow using JWT\
\- Passwords hashed with bcrypt\
\- Role-based access control using FastAPI dependencies\
\
Roles:\
\- STUDENT\
\- TUTOR

5\. Database Schema\
\
User\
\- id (UUID, PK)\
\- name\
\- email (unique)\
\- password\_hash\
\- role\
\- created\_at\
\
TutorProfile\
\- id\
\- user\_id (FK → User.id)\
\- bio\
\- qualifications\
\- is\_verified\
\- rating\
\
Subject\
\- id\
\- name\
\- exam\_board\
\
Topic\
\- id\
\- subject\_id (FK)\
\- name\
\- difficulty\
\
TutorTopic\
\- tutor\_id\
\- topic\_id\
\
AvailabilitySlot\
\- id\
\- tutor\_id\
\- start\_time\
\- end\_time\
\- status (AVAILABLE | BOOKED)\
\
Booking\
\- id\
\- student\_id\
\- tutor\_id\
\- topic\_id\
\- slot\_id\
\- status (PENDING | CONFIRMED | CANCELLED)\
\- calendar\_event\_id\
\- meet\_link\
\- created\_at

6\. API Routes\
\
Auth:\
POST   /auth/signup\
POST   /auth/login\
POST   /auth/logout\
GET    /auth/me\
\
User:\
GET    /users/me\
\
Tutor:\
POST   /tutors/profile\
GET    /tutors/profile\
POST   /tutors/topics\
GET    /tutors/bookings\
\
Availability:\
POST   /availability\
GET    /availability/tutor\
DELETE /availability/{slot\_id}\
\
Discovery:\
GET    /subjects\
GET    /subjects/{id}/topics\
GET    /topics/{id}/tutors\
\
Booking:\
POST   /bookings\
POST   /bookings/{id}/confirm\
POST   /bookings/{id}/cancel\
GET    /bookings/student\
GET    /bookings/tutor

7\. Booking & Google Calendar Flow\
\
1\. Student selects topic, tutor, and slot\
2\. Backend validates availability\
3\. Booking created with PENDING status\
4\. Google Calendar event created using service account\
5\. Google Meet link generated\
6\. Booking marked CONFIRMED and slot BOOKED

8\. Frontend Authentication Flow\
\
\- User logs in\
\- JWT stored in HTTP-only cookie\
\- Frontend validates session using /auth/me\
\- Role-based dashboard rendering

9\. Deployment (EC2)\
\
\- Ubuntu EC2 instance\
\- Gunicorn + Uvicorn workers\
\- Nginx reverse proxy\
\- Environment variables via .env\
\- PostgreSQL via managed service or EC2
