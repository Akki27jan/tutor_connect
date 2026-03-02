"use client";

import { Booking } from "@/types/booking";

interface BookingSummaryProps {
    booking: Booking;
    onConfirm?: () => void;
    onCancel?: () => void;
    isLoading?: boolean;
}

export default function BookingSummary({
    booking,
    onConfirm,
    onCancel,
    isLoading,
}: BookingSummaryProps) {
    const statusColors: Record<string, string> = {
        PENDING:
            "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
        CONFIRMED:
            "bg-green-500/10 border-green-500/20 text-green-400",
        CANCELLED:
            "bg-red-500/10 border-red-500/20 text-red-400",
    };

    return (
        <div className="rounded-2xl border border-white/10 bg-dark-700/50 p-6 backdrop-blur-sm">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-white">
                        {booking.topic_name || "Session"}
                    </h3>
                    <p className="mt-1 text-sm text-dark-200">
                        with {booking.tutor_name || "Tutor"}
                    </p>
                </div>
                <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusColors[booking.status] || statusColors.PENDING
                        }`}
                >
                    {booking.status}
                </span>
            </div>

            <div className="mt-5 space-y-3">
                {booking.slot_start && (
                    <div className="flex items-center gap-3 text-sm">
                        <span className="text-dark-300">📅</span>
                        <span className="text-dark-100">
                            {new Date(booking.slot_start).toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                            })}
                        </span>
                    </div>
                )}
                {booking.slot_start && booking.slot_end && (
                    <div className="flex items-center gap-3 text-sm">
                        <span className="text-dark-300">🕐</span>
                        <span className="text-dark-100">
                            {new Date(booking.slot_start).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}{" "}
                            –{" "}
                            {new Date(booking.slot_end).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </span>
                    </div>
                )}
                {booking.student_name && (
                    <div className="flex items-center gap-3 text-sm">
                        <span className="text-dark-300">🎓</span>
                        <span className="text-dark-100">{booking.student_name}</span>
                    </div>
                )}
                {booking.meet_link && (
                    <div className="flex items-center gap-3 text-sm">
                        <span className="text-dark-300">🔗</span>
                        <a
                            href={booking.meet_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-primary-400 hover:text-primary-300"
                        >
                            Join Google Meet
                        </a>
                    </div>
                )}
            </div>

            {(onConfirm || onCancel) && booking.status === "PENDING" && (
                <div className="mt-6 flex gap-3">
                    {onConfirm && (
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className="flex-1 rounded-xl bg-gradient-to-r from-accent-600 to-accent-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-accent-600/20 transition-all hover:shadow-accent-600/30 hover:brightness-110 disabled:opacity-50"
                        >
                            Confirm
                        </button>
                    )}
                    {onCancel && (
                        <button
                            onClick={onCancel}
                            disabled={isLoading}
                            className="flex-1 rounded-xl border border-white/10 bg-dark-600 px-4 py-2.5 text-sm font-medium text-dark-100 transition-all hover:bg-dark-500 hover:text-white disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
