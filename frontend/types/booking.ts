export interface Booking {
    id: string;
    student_id: string;
    tutor_id: string;
    topic_id: string;
    slot_id: string;
    status: "PENDING" | "CONFIRMED" | "CANCELLED";
    calendar_event_id: string | null;
    meet_link: string | null;
    created_at: string;
    student_name: string | null;
    student_email: string | null;
    tutor_name: string | null;
    topic_name: string | null;
    slot_start: string | null;
    slot_end: string | null;
}
