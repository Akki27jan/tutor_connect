"use client";

import ProtectedRoute from "@/components/common/ProtectedRoute";
import StudentSessions from "@/components/dashboard/StudentSessions";
import { useAuth } from "@/hooks/useAuth";

export default function StudentDashboardPage() {
    const { user } = useAuth();

    return (
        <ProtectedRoute requiredRole="STUDENT">
            <div className="mx-auto max-w-7xl px-6 py-10">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white">
                        Welcome back, {user?.name?.split(" ")[0] || "Student"} 👋
                    </h1>
                    <p className="mt-2 text-dark-200">
                        Manage your tutoring sessions and browse new subjects.
                    </p>
                </div>

                {/* Quick Actions */}
                <div className="mb-10 grid gap-4 sm:grid-cols-3">
                    <a
                        href="/search"
                        className="group rounded-2xl border border-white/10 bg-dark-700/30 p-5 transition-all hover:border-primary-500/20 hover:bg-dark-700/50"
                    >
                        <span className="text-2xl">🔍</span>
                        <h3 className="mt-2 font-semibold text-white">Browse Subjects</h3>
                        <p className="mt-1 text-xs text-dark-300">
                            Find topics and tutors
                        </p>
                    </a>
                    <div className="group rounded-2xl border border-white/10 bg-dark-700/30 p-5">
                        <span className="text-2xl">📅</span>
                        <h3 className="mt-2 font-semibold text-white">Upcoming</h3>
                        <p className="mt-1 text-xs text-dark-300">
                            View your scheduled sessions
                        </p>
                    </div>
                    <div className="group rounded-2xl border border-white/10 bg-dark-700/30 p-5">
                        <span className="text-2xl">📊</span>
                        <h3 className="mt-2 font-semibold text-white">History</h3>
                        <p className="mt-1 text-xs text-dark-300">
                            Past sessions and bookings
                        </p>
                    </div>
                </div>

                {/* Sessions List */}
                <StudentSessions />
            </div>
        </ProtectedRoute>
    );
}
