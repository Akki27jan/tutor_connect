export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "TutorConnect";

export const ROLES = {
    STUDENT: "STUDENT",
    TUTOR: "TUTOR",
} as const;

export const BOOKING_STATUS = {
    PENDING: "PENDING",
    CONFIRMED: "CONFIRMED",
    CANCELLED: "CANCELLED",
} as const;

export const SLOT_STATUS = {
    AVAILABLE: "AVAILABLE",
    BOOKED: "BOOKED",
} as const;
