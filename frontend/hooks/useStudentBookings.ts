"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Booking } from "@/types/booking";

export function useStudentBookings() {
    const queryClient = useQueryClient();

    const bookingsQuery = useQuery<Booking[]>({
        queryKey: ["bookings", "student"],
        queryFn: async () => {
            const res = await api.get("/bookings/student");
            return res.data;
        },
    });

    const createBookingMutation = useMutation({
        mutationFn: async (data: {
            tutor_id: string;
            subject: string;
            slot_id: string;
        }) => {
            const res = await api.post("/bookings/", data);
            return res.data as Booking;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bookings", "student"] });
        },
    });

    const confirmBookingMutation = useMutation({
        mutationFn: async (bookingId: string) => {
            const res = await api.post(`/bookings/${bookingId}/confirm`);
            return res.data as Booking;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bookings", "student"] });
        },
    });

    const cancelBookingMutation = useMutation({
        mutationFn: async (bookingId: string) => {
            const res = await api.post(`/bookings/${bookingId}/cancel`);
            return res.data as Booking;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bookings", "student"] });
        },
    });

    return {
        bookings: bookingsQuery.data ?? [],
        isLoading: bookingsQuery.isLoading,
        createBooking: createBookingMutation.mutateAsync,
        confirmBooking: confirmBookingMutation.mutateAsync,
        cancelBooking: cancelBookingMutation.mutateAsync,
        isCreating: createBookingMutation.isPending,
    };
}
