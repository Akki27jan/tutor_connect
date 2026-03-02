"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: "STUDENT" | "TUTOR";
}

export default function ProtectedRoute({
    children,
    requiredRole,
}: ProtectedRouteProps) {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/auth/login");
        }
        if (!isLoading && isAuthenticated && requiredRole && user?.role !== requiredRole) {
            router.push("/");
        }
    }, [isLoading, isAuthenticated, user, requiredRole, router]);

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
                    <p className="text-sm text-dark-200">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) return null;
    if (requiredRole && user?.role !== requiredRole) return null;

    return <>{children}</>;
}
