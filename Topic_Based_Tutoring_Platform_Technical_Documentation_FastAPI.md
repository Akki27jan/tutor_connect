**Technical Design Documentation\
Topic-Based Tutoring Platform (MVP)**
=====================================

Objective

Build a functional tutoring marketplace MVP with topic-based discovery, student and tutor accounts, slot-based scheduling, and automatic Google Meet + Calendar integration using a platform-owned Google account. No real payments are included.

Core Features

\- Student & Tutor authentication

\- Subject → Topic → Tutor discovery

\- Tutor availability slot management

\- Slot-based booking

\- Automatic Google Meet creation

\- Calendar invites sent to both users

\- Student and Tutor dashboards

System Architecture

Frontend:

\- Next.js (React)

\- Tailwind CSS

\- React Query

Backend:

\- Python

\- FastAPI

\- SQLAlchemy ORM

\- Pydantic for validation

\- JWT authentication

Database:

\- PostgreSQL

External Services:

\- Google Calendar API (with Google Meet)

User Roles

Student:

\- Browse topics

\- Book slots

\- View upcoming/past sessions

Tutor:

\- Manage availability

\- View confirmed bookings

\- Receive calendar invites

Authentication

\- Email + password signup

\- Password hashing using bcrypt

\- JWT-based authentication

\- Role-based authorization dependencies (FastAPI)

Database Schema Overview

User

\- id (PK)

\- name

\- email (unique)

\- password\_hash

\- role (STUDENT | TUTOR)

\- created\_at

TutorProfile

\- id (PK)

\- user\_id (FK → User.id)

\- bio

\- qualifications

\- is\_verified

\- rating

Subject

\- id (PK)

\- name

\- exam\_board

Topic

\- id (PK)

\- subject\_id (FK)

\- name

\- difficulty

TutorTopic

\- id (PK)

\- tutor\_id (FK)

\- topic\_id (FK)

AvailabilitySlot

\- id (PK)

\- tutor\_id (FK)

\- start\_time (timestamp with timezone)

\- end\_time (timestamp with timezone)

\- status (AVAILABLE | BOOKED)

Booking

\- id (PK)

\- student\_id (FK)

\- tutor\_id (FK)

\- topic\_id (FK)

\- slot\_id (FK)

\- status (PENDING | CONFIRMED | CANCELLED)

\- calendar\_event\_id

\- meet\_link

\- created\_at

Google Calendar Integration (Option A)

\- Platform owns a single Google account

\- Service Account used for API access

\- Calendar events created under platform calendar

\- Google Meet links auto-generated

\- Student and Tutor added as attendees

Booking Flow

1\. Student selects topic, tutor, and slot

2\. Backend validates slot availability

3\. Booking created with PENDING status

4\. FastAPI service creates Google Calendar event

5\. Booking confirmed and slot marked as BOOKED

Cancellation Flow

\- Google Calendar event deleted

\- Booking marked CANCELLED

\- Slot freed

Security Considerations

\- JWT authentication middleware

\- Role-based access control

\- Tutor and student data isolation

\- Google credentials stored securely using environment variables

Deployment

Frontend:

\- Vercel

Backend:

\- FastAPI served via Uvicorn/Gunicorn

\- Dockerized deployment

Database:

\- Managed PostgreSQL (AWS RDS / Railway)


