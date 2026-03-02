"use client";

import { useStudentBookings } from "@/hooks/useStudentBookings";
import BookingSummary from "@/components/booking/BookingSummary";

export default function StudentSessions() {
    const { bookings, isLoading, confirmBooking, cancelBooking } =
        useStudentBookings();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
            </div>
        );
    }

    const upcoming = bookings.filter(
        (b) => b.status === "PENDING" || b.status === "CONFIRMED"
    );
    const past = bookings.filter((b) => b.status === "CANCELLED");

    return (
        <div className="space-y-8">
            {/* Upcoming Sessions */}
            <section>
                <h2 className="mb-4 text-xl font-bold text-white">
                    Upcoming Sessions
                </h2>
                {upcoming.length === 0 ? (
                    <div className="rounded-xl border border-white/10 bg-dark-700/30 p-8 text-center">
                        <p className="text-dark-200">No upcoming sessions.</p>
                        <a
                            href="/search"
                            className="mt-3 inline-block text-sm font-medium text-primary-400 hover:text-primary-300"
                        >
                            Browse subjects to book a session →
                        </a>
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

            {/* Past / Cancelled Sessions */}
            {past.length > 0 && (
                <section>
                    <h2 className="mb-4 text-xl font-bold text-white">
                        Past &amp; Cancelled
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        {past.map((booking) => (
                            <BookingSummary key={booking.id} booking={booking} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
