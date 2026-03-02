import axios from "axios";

const baseURL = typeof window !== 'undefined'
    ? "/api"
    : (process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/api` : "http://localhost:3000/api");

const api = axios.create({
    baseURL: baseURL,
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
