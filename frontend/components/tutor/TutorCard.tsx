"use client";

import Link from "next/link";
import { TutorWithSubjects } from "@/types/tutor";

interface TutorCardProps {
    tutor: TutorWithSubjects;
    subject: string;
}

export default function TutorCard({ tutor, subject }: TutorCardProps) {
    const initials = (tutor.user_name || "T")
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="group rounded-2xl border border-white/10 bg-dark-700/50 p-6 backdrop-blur-sm transition-all hover:border-primary-500/30 hover:shadow-xl hover:shadow-primary-500/5">
            <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 text-lg font-bold text-white shadow-lg shadow-primary-500/20">
                    {initials}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-white truncate">
                            {tutor.user_name || "Tutor"}
                        </h3>
                        {tutor.is_verified && (
                            <span className="flex-shrink-0 text-primary-400" title="Verified">
                                ✓
                            </span>
                        )}
                    </div>

                    {/* Rating */}
                    <div className="mt-1 flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    className={`text-sm ${star <= Math.round(tutor.rating)
                                        ? "text-yellow-400"
                                        : "text-dark-400"
                                        }`}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                        <span className="text-xs text-dark-200">
                            {tutor.rating.toFixed(1)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Bio */}
            {tutor.bio && (
                <p className="mt-4 text-sm leading-relaxed text-dark-200 line-clamp-2">
                    {tutor.bio}
                </p>
            )}

            {/* Qualifications */}
            {tutor.qualifications && (
                <p className="mt-2 text-xs text-dark-300">
                    📜 {tutor.qualifications}
                </p>
            )}

            {/* Subjects */}
            {tutor.subjects?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                    {tutor.subjects.map((s) => (
                        <span
                            key={s}
                            className="rounded-lg bg-dark-600 px-2.5 py-1 text-xs font-medium text-dark-100"
                        >
                            {s}
                        </span>
                    ))}
                </div>
            )}

            {/* CTA */}
            <Link
                href={`/booking/new?tutor_id=${tutor.id}&subject=${encodeURIComponent(subject)}`}
                className="mt-5 flex items-center justify-center rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-600/20 transition-all hover:shadow-primary-600/30 hover:brightness-110"
            >
                Book Session
            </Link>
        </div>
    );
}
