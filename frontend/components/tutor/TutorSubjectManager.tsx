"use client";

import { useState, useEffect } from "react";
import { useTutorProfile } from "@/hooks/useTutorProfile";

export default function TutorSubjectManager() {
    const { profile, isLoadingProfile, assignSubjects, isAssigning, assignError } = useTutorProfile();
    const [subjects, setSubjects] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // Initialize subjects from profile
    useEffect(() => {
        if (profile?.subjects) {
            setSubjects(profile.subjects);
        }
    }, [profile]);

    const handleAddSubject = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            const newSubject = inputValue.trim();
            if (newSubject && !subjects.includes(newSubject)) {
                setSubjects([...subjects, newSubject]);
            }
            setInputValue("");
            setSuccessMessage("");
        }
    };

    const removeSubject = (subjectToRemove: string) => {
        setSubjects(subjects.filter(s => s !== subjectToRemove));
        setSuccessMessage("");
    };

    const handleSave = async () => {
        setSuccessMessage("");
        try {
            await assignSubjects(subjects);
            setSuccessMessage("Subjects saved successfully!");
        } catch (err) {
            console.error("Failed to save subjects", err);
        }
    };

    if (isLoadingProfile) {
        return (
            <div className="flex animate-pulse space-y-4 rounded-2xl border border-white/10 bg-dark-700/50 p-6">
                <div className="h-6 w-1/3 rounded bg-dark-600"></div>
                <div className="h-20 rounded bg-dark-600"></div>
            </div>
        );
    }

    return (
        <section className="mb-8 rounded-2xl border border-white/10 bg-dark-700/50 p-6 backdrop-blur-sm">
            <h2 className="mb-4 text-xl font-bold text-white">Manage Your Subjects</h2>
            <p className="mb-6 text-sm text-dark-200">
                Type the specific subjects or topics you are available to teach, and press Enter to add them. Students will find you when they search for these terms.
            </p>

            {assignError && (
                <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    Failed to save subjects. Please try again.
                </div>
            )}

            {successMessage && (
                <div className="mb-4 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
                    {successMessage}
                </div>
            )}

            <div className="mb-6">
                <div className="flex flex-wrap gap-2 mb-3">
                    {subjects.map((subject) => (
                        <span
                            key={subject}
                            className="inline-flex items-center gap-1.5 rounded-full bg-primary-500/20 px-3 py-1.5 text-sm font-medium text-primary-300 border border-primary-500/30"
                        >
                            {subject}
                            <button
                                type="button"
                                onClick={() => removeSubject(subject)}
                                className="text-primary-400 hover:text-white transition-colors"
                            >
                                ✕
                            </button>
                        </span>
                    ))}
                </div>

                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleAddSubject}
                    placeholder="e.g. Advanced Calculus, AP Physics..."
                    className="w-full rounded-xl border border-white/10 bg-dark-600 px-4 py-3 text-sm text-white placeholder-dark-300 outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                />
            </div>

            <div className="mt-8 flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={isAssigning}
                    className="rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-8 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition-all hover:shadow-primary-600/40 hover:brightness-110 disabled:opacity-50"
                >
                    {isAssigning ? "Saving..." : "Save Subjects"}
                </button>
            </div>
        </section>
    );
}
