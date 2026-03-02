"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import TutorSessions from "@/components/dashboard/TutorSessions";
import TutorSubjectManager from "@/components/tutor/TutorSubjectManager";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";

export default function TutorDashboardPage() {
    const { user } = useAuth();
    const [hasProfile, setHasProfile] = useState<boolean | null>(null);
    const [bio, setBio] = useState("");
    const [qualifications, setQualifications] = useState("");
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        checkProfile();
    }, []);

    const checkProfile = async () => {
        try {
            await api.get("/tutors/profile");
            setHasProfile(true);
        } catch {
            setHasProfile(false);
        }
    };

    const handleCreateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);
        setError("");
        try {
            await api.post("/tutors/profile", { bio, qualifications });
            setHasProfile(true);
        } catch (err: any) {
            setError(err?.response?.data?.detail || "Failed to create profile");
        } finally {
            setCreating(false);
        }
    };

    return (
        <ProtectedRoute requiredRole="TUTOR">
            <div className="mx-auto max-w-7xl px-6 py-10">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white">
                        Tutor Dashboard 📚
                    </h1>
                    <p className="mt-2 text-dark-200">
                        Welcome, {user?.name || "Tutor"}. Manage your availability and
                        sessions.
                    </p>
                </div>

                {/* Profile Creation Gate */}
                {hasProfile === null && (
                    <div className="flex items-center justify-center py-12">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
                    </div>
                )}

                {hasProfile === false && (
                    <div className="mx-auto max-w-lg">
                        <div className="rounded-2xl border border-white/10 bg-dark-700/50 p-8 backdrop-blur-sm">
                            <h2 className="mb-2 text-xl font-bold text-white">
                                Complete Your Profile
                            </h2>
                            <p className="mb-6 text-sm text-dark-200">
                                Set up your tutor profile to start receiving bookings.
                            </p>

                            {error && (
                                <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleCreateProfile} className="space-y-5">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-dark-100">
                                        Bio
                                    </label>
                                    <textarea
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        rows={3}
                                        placeholder="Tell students about your teaching style..."
                                        className="w-full rounded-xl border border-white/10 bg-dark-600 px-4 py-3 text-sm text-white placeholder-dark-300 outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-dark-100">
                                        Qualifications
                                    </label>
                                    <input
                                        type="text"
                                        value={qualifications}
                                        onChange={(e) => setQualifications(e.target.value)}
                                        placeholder="e.g., M.Sc Mathematics, 5 years teaching experience"
                                        className="w-full rounded-xl border border-white/10 bg-dark-600 px-4 py-3 text-sm text-white placeholder-dark-300 outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={creating}
                                    className="w-full rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition-all hover:shadow-primary-600/40 hover:brightness-110 disabled:opacity-50"
                                >
                                    {creating ? "Creating..." : "Create Profile"}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {hasProfile === true && (
                    <div className="space-y-8">
                        <TutorSubjectManager />
                        <TutorSessions />
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}

