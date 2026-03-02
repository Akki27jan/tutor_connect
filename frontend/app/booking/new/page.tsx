"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useStudentBookings } from "@/hooks/useStudentBookings";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import SlotPicker from "@/components/booking/SlotPicker";
import { AvailabilitySlot } from "@/types/tutor";

function NewBookingContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user } = useAuth();
    const { createBooking, isCreating } = useStudentBookings();

    const tutorId = searchParams.get("tutor_id") || "";
    const subject = searchParams.get("subject") || "";

    const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(
        null
    );
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleBook = async () => {
        if (!selectedSlot) return;
        setError("");

        try {
            await createBooking({
                tutor_id: tutorId,
                subject: subject,
                slot_id: selectedSlot.id,
            });
            setSuccess(true);
        } catch (err: any) {
            setError(
                err?.response?.data?.detail || "Failed to create booking."
            );
        }
    };

    if (success) {
        return (
            <ProtectedRoute requiredRole="STUDENT">
                <div className="mx-auto max-w-lg px-6 py-24 text-center">
                    <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-10">
                        <span className="text-5xl">🎉</span>
                        <h2 className="mt-4 text-2xl font-bold text-white">
                            Booking Created!
                        </h2>
                        <p className="mt-3 text-sm text-dark-200">
                            Your session has been booked. You can confirm it from your
                            dashboard.
                        </p>
                        <button
                            onClick={() => router.push("/dashboard/student")}
                            className="mt-6 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition-all hover:shadow-primary-600/40 hover:brightness-110"
                        >
                            Go to Dashboard
                        </button>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute requiredRole="STUDENT">
            <div className="mx-auto max-w-3xl px-6 py-12">
                <h1 className="mb-2 text-3xl font-bold text-white">
                    Book a Session
                </h1>
                <p className="mb-8 text-dark-200">
                    Select an available time slot to book your tutoring session.
                </p>

                {error && (
                    <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                        {error}
                    </div>
                )}

                {/* Slot Picker */}
                <SlotPicker
                    tutorId={tutorId}
                    selectedSlotId={selectedSlot?.id ?? null}
                    onSelectSlot={setSelectedSlot}
                />

                {/* Book Button */}
                {selectedSlot && (
                    <div className="mt-8 rounded-2xl border border-white/10 bg-dark-700/50 p-6 backdrop-blur-sm">
                        <h3 className="text-base font-semibold text-white">
                            Selected Slot
                        </h3>
                        <p className="mt-2 text-sm text-dark-200">
                            {new Date(selectedSlot.start_time).toLocaleString("en-US", {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            })}{" "}
                            –{" "}
                            {new Date(selectedSlot.end_time).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </p>
                        <button
                            onClick={handleBook}
                            disabled={isCreating}
                            className="mt-4 w-full rounded-xl bg-gradient-to-r from-accent-600 to-accent-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-600/20 transition-all hover:shadow-accent-600/30 hover:brightness-110 disabled:opacity-50"
                        >
                            {isCreating ? "Booking..." : "Confirm Booking"}
                        </button>
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}

export default function NewBookingPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-white">Loading...</div>}>
            <NewBookingContent />
        </Suspense>
    );
}
