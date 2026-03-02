export interface TutorProfile {
    id: string;
    user_id: string;
    bio: string;
    qualifications: string;
    is_verified: boolean;
    rating: number;
    user_name: string | null;
    user_email: string | null;
}

export interface TutorWithSubjects extends TutorProfile {
    subjects: string[];
}

export interface Subject {
    id: string;
    name: string;
    exam_board: string;
    topics?: Topic[];
}

export interface Topic {
    id: string;
    subject_id: string;
    name: string;
    difficulty: string;
}

export interface AvailabilitySlot {
    id: string;
    tutor_id: string;
    start_time: string;
    end_time: string;
    status: "AVAILABLE" | "BOOKED";
}
