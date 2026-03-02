"""Aggregate API router — mounts all route modules."""

from fastapi import APIRouter

from app.api.routes import auth, users, tutors, availability, bookings

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(tutors.router)
api_router.include_router(availability.router)
api_router.include_router(bookings.router)
