import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export const getSubjects = async () => {
    const res = await api.get("/subjects");
    return res.data;
};

export const assignTutorSubjects = async (subjects: string[]) => {
    const res = await api.post("/tutors/subjects", { subjects });
    return res.data;
};

export default api;
