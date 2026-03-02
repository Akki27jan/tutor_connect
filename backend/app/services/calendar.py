"""Google Calendar integration service.

Uses a Google Service Account to create calendar events with Google Meet links.
Gracefully no-ops when credentials are not configured.
"""

import logging
from typing import Optional, Tuple

from app.core.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


def _get_calendar_service():
    """Build a Google Calendar API service object.

    Returns None if credentials are not configured.
    """
    if not settings.GOOGLE_CREDENTIALS_FILE or not settings.GOOGLE_CALENDAR_ID:
        logger.info("Google Calendar credentials not configured — skipping.")
        return None

    try:
        from google.oauth2 import service_account
        from googleapiclient.discovery import build

        credentials = service_account.Credentials.from_service_account_file(
            settings.GOOGLE_CREDENTIALS_FILE,
            scopes=["https://www.googleapis.com/auth/calendar"],
        )
        service = build("calendar", "v3", credentials=credentials)
        return service
    except Exception as e:
        logger.error(f"Failed to build Google Calendar service: {e}")
        return None


def create_calendar_event(
    summary: str,
    description: str,
    start_time: str,
    end_time: str,
    attendee_emails: list[str],
) -> Tuple[Optional[str], Optional[str]]:
    """Create a Google Calendar event with a Google Meet link.

    Args:
        summary: Event title (e.g. "Tutoring: Algebra")
        description: Event description
        start_time: ISO 8601 datetime string
        end_time: ISO 8601 datetime string
        attendee_emails: List of attendee email addresses

    Returns:
        Tuple of (event_id, meet_link). Both are None if calendar is not configured.
    """
    service = _get_calendar_service()
    if not service:
        return None, None

    event_body = {
        "summary": summary,
        "description": description,
        "start": {"dateTime": start_time, "timeZone": "UTC"},
        "end": {"dateTime": end_time, "timeZone": "UTC"},
        "attendees": [{"email": email} for email in attendee_emails],
        "conferenceData": {
            "createRequest": {
                "requestId": f"tutoring-{start_time}",
                "conferenceSolutionKey": {"type": "hangoutsMeet"},
            }
        },
    }

    try:
        event = (
            service.events()
            .insert(
                calendarId=settings.GOOGLE_CALENDAR_ID,
                body=event_body,
                conferenceDataVersion=1,
                sendUpdates="all",
            )
            .execute()
        )
        event_id = event.get("id")
        meet_link = event.get("hangoutLink") or event.get("conferenceData", {}).get(
            "entryPoints", [{}]
        )[0].get("uri")
        logger.info(f"Calendar event created: {event_id}")
        return event_id, meet_link
    except Exception as e:
        logger.error(f"Failed to create calendar event: {e}")
        return None, None


def delete_calendar_event(event_id: str) -> bool:
    """Delete a Google Calendar event.

    Returns True if deletion succeeded (or was skipped due to no config).
    """
    service = _get_calendar_service()
    if not service:
        return True  # No-op is considered success

    try:
        service.events().delete(
            calendarId=settings.GOOGLE_CALENDAR_ID,
            eventId=event_id,
            sendUpdates="all",
        ).execute()
        logger.info(f"Calendar event deleted: {event_id}")
        return True
    except Exception as e:
        logger.error(f"Failed to delete calendar event: {e}")
        return False
