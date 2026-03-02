export interface User {
    id: string;
    name: string;
    email: string;
    role: "STUDENT" | "TUTOR";
    created_at: string;
}
