import api from "./api";
import { User } from "@/types/user";

export async function login(email: string, password: string): Promise<User> {
    const res = await api.post("/auth/login", { email, password });
    return res.data;
}

export async function signup(
    name: string,
    email: string,
    password: string,
    role: string
): Promise<User> {
    const res = await api.post("/auth/signup", { name, email, password, role });
    return res.data;
}

export async function logout(): Promise<void> {
    await api.post("/auth/logout");
}

export async function getMe(): Promise<User> {
    const res = await api.get("/auth/me");
    return res.data;
}
