"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { login, signup, logout, getMe } from "@/lib/auth";
import { User } from "@/types/user";

export function useAuth() {
    const queryClient = useQueryClient();
    const router = useRouter();

    const userQuery = useQuery<User>({
        queryKey: ["auth", "me"],
        queryFn: getMe,
        retry: false,
        staleTime: 1000 * 60 * 5,
    });

    const loginMutation = useMutation({
        mutationFn: ({ email, password }: { email: string; password: string }) =>
            login(email, password),
        onSuccess: (user) => {
            queryClient.setQueryData(["auth", "me"], user);
            if (user.role === "STUDENT") {
                router.push("/dashboard/student");
            } else {
                router.push("/dashboard/tutor");
            }
        },
    });

    const signupMutation = useMutation({
        mutationFn: ({
            name,
            email,
            password,
            role,
        }: {
            name: string;
            email: string;
            password: string;
            role: string;
        }) => signup(name, email, password, role),
        onSuccess: (user) => {
            queryClient.setQueryData(["auth", "me"], user);
            if (user.role === "STUDENT") {
                router.push("/dashboard/student");
            } else {
                router.push("/dashboard/tutor");
            }
        },
    });

    const logoutMutation = useMutation({
        mutationFn: logout,
        onSuccess: () => {
            queryClient.clear();
            router.push("/auth/login");
        },
    });

    return {
        user: userQuery.data ?? null,
        isLoading: userQuery.isLoading,
        isAuthenticated: !!userQuery.data,
        login: loginMutation.mutateAsync,
        signup: signupMutation.mutateAsync,
        logout: logoutMutation.mutateAsync,
        loginError: loginMutation.error,
        signupError: signupMutation.error,
        isLoginPending: loginMutation.isPending,
        isSignupPending: signupMutation.isPending,
    };
}
