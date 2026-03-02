"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import BookingSummary from "@/components/booking/BookingSummary";
import { Booking } from "@/types/booking";

export default function BookingConfirmPage() {
    const { bookingId } = useParams<{ bookingId: string }>();
    const router = useRouter();

    const { data: booking, isLoading, refetch } = useQuery<Booking>({
        queryKey: ["booking", bookingId],
        queryFn: async () => {
            // Fetch from the student bookings and filter
            const res = await api.get("/bookings/student");
            const bookings: Booking[] = res.data;
            const found = bookings.find((b) => b.id === bookingId);
            if (!found) throw new Error("Booking not found");
            return found;
        },
        enabled: !!bookingId,
    });

    const handleConfirm = async () => {
        try {
            await api.post(`/bookings/${bookingId}/confirm`);
            refetch();
        } catch (err) {
            console.error("Failed to confirm:", err);
        }
    };

    const handleCancel = async () => {
        try {
            await api.post(`/bookings/${bookingId}/cancel`);
            refetch();
        } catch (err) {
            console.error("Failed to cancel:", err);
        }
    };

    return (
        <ProtectedRoute>
            <div className="mx-auto max-w-lg px-6 py-12">
                <h1 className="mb-6 text-2xl font-bold text-white">
                    Booking Details
                </h1>

                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
                    </div>
                ) : booking ? (
                    <>
                        <BookingSummary
                            booking={booking}
                            onConfirm={booking.status === "PENDING" ? handleConfirm : undefined}
                            onCancel={booking.status !== "CANCELLED" ? handleCancel : undefined}
                        />
                        <button
                            onClick={() => router.back()}
                            className="mt-6 text-sm text-dark-300 hover:text-primary-400"
                        >
                            ← Back to dashboard
                        </button>
                    </>
                ) : (
                    <div className="rounded-xl border border-white/10 bg-dark-700/30 p-8 text-center">
                        <p className="text-dark-200">Booking not found.</p>
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}
