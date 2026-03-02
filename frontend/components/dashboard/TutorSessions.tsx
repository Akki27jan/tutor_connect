"use client";

import { useState } from "react";
import { useTutorBookings } from "@/hooks/useTutorBookings";
import BookingSummary from "@/components/booking/BookingSummary";

export default function TutorSessions() {
    const {
        bookings,
        slots,
        isLoadingBookings,
        isLoadingSlots,
        createSlot,
        deleteSlot,
        confirmBooking,
        cancelBooking,
        isCreatingSlot,
    } = useTutorBookings();

    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [slotError, setSlotError] = useState("");

    const handleAddSlot = async (e: React.FormEvent) => {
        e.preventDefault();
        setSlotError("");

        if (!startTime || !endTime) {
            setSlotError("Please select both start and end times.");
            return;
        }

        const start = new Date(startTime);
        const end = new Date(endTime);
        if (start >= end) {
            setSlotError("Start time must be before end time.");
            return;
        }

        try {
            await createSlot({
                start_time: start.toISOString(),
                end_time: end.toISOString(),
            });
            setStartTime("");
            setEndTime("");
        } catch (err: any) {
            setSlotError(
                err?.response?.data?.detail || "Failed to create slot."
            );
        }
    };

    if (isLoadingBookings || isLoadingSlots) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
            </div>
        );
    }

    const upcoming = bookings.filter(
        (b) => b.status === "PENDING" || b.status === "CONFIRMED"
    );

    return (
        <div className="space-y-10">
            {/* Availability Management */}
            <section>
                <h2 className="mb-4 text-xl font-bold text-white">
                    Manage Availability
                </h2>

                {/* Add Slot Form */}
                <form
                    onSubmit={handleAddSlot}
                    className="mb-6 rounded-2xl border border-white/10 bg-dark-700/50 p-6 backdrop-blur-sm"
                >
                    <h3 className="mb-4 text-base font-semibold text-white">
                        Add New Slot
                    </h3>

                    {slotError && (
                        <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                            {slotError}
                        </div>
                    )}

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-dark-100">
                                Start Time
                            </label>
                            <input
                                type="datetime-local"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="w-full rounded-xl border border-white/10 bg-dark-600 px-4 py-3 text-sm text-white outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 [color-scheme:dark]"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-dark-100">
                                End Time
                            </label>
                            <input
                                type="datetime-local"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="w-full rounded-xl border border-white/10 bg-dark-600 px-4 py-3 text-sm text-white outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 [color-scheme:dark]"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isCreatingSlot}
                        className="mt-4 rounded-xl bg-gradient-to-r from-accent-600 to-accent-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-accent-600/20 transition-all hover:shadow-accent-600/30 hover:brightness-110 disabled:opacity-50"
                    >
                        {isCreatingSlot ? "Adding..." : "Add Slot"}
                    </button>
                </form>

                {/* Existing Slots */}
                <div className="space-y-2">
                    {slots.length === 0 ? (
                        <p className="text-sm text-dark-200">
                            No slots added yet. Add your first availability slot above.
                        </p>
                    ) : (
                        slots.map((slot) => {
                            const start = new Date(slot.start_time);
                            const end = new Date(slot.end_time);
                            return (
                                <div
                                    key={slot.id}
                                    className="flex items-center justify-between rounded-xl border border-white/10 bg-dark-600/50 px-5 py-3"
                                >
                                    <div className="flex items-center gap-4">
                                        <span
                                            className={`h-2.5 w-2.5 rounded-full ${slot.status === "AVAILABLE"
                                                    ? "bg-green-400"
                                                    : "bg-yellow-400"
                                                }`}
                                        />
                                        <div>
                                            <p className="text-sm font-medium text-white">
                                                {start.toLocaleDateString("en-US", {
                                                    weekday: "short",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </p>
                                            <p className="text-xs text-dark-200">
                                                {start.toLocaleTimeString("en-US", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}{" "}
                                                –{" "}
                                                {end.toLocaleTimeString("en-US", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${slot.status === "AVAILABLE"
                                                    ? "bg-green-500/10 text-green-400"
                                                    : "bg-yellow-500/10 text-yellow-400"
                                                }`}
                                        >
                                            {slot.status}
                                        </span>
                                        {slot.status === "AVAILABLE" && (
                                            <button
                                                onClick={() => deleteSlot(slot.id)}
                                                className="rounded-lg p-1.5 text-dark-300 transition-colors hover:bg-red-500/10 hover:text-red-400"
                                                title="Delete slot"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </section>

            {/* Bookings */}
            <section>
                <h2 className="mb-4 text-xl font-bold text-white">
                    Your Sessions
                </h2>
                {upcoming.length === 0 ? (
                    <div className="rounded-xl border border-white/10 bg-dark-700/30 p-8 text-center">
                        <p className="text-dark-200">
                            No upcoming sessions yet. Students will book your available slots.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {upcoming.map((booking) => (
                            <BookingSummary
                                key={booking.id}
                                booking={booking}
                                onConfirm={
                                    booking.status === "PENDING"
                                        ? () => confirmBooking(booking.id)
                                        : undefined
                                }
                                onCancel={
                                    booking.status !== "CANCELLED"
                                        ? () => cancelBooking(booking.id)
                                        : undefined
                                }
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
