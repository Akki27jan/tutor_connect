"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Booking } from "@/types/booking";
import { AvailabilitySlot } from "@/types/tutor";

export function useTutorBookings() {
    const queryClient = useQueryClient();

    const bookingsQuery = useQuery<Booking[]>({
        queryKey: ["bookings", "tutor"],
        queryFn: async () => {
            const res = await api.get("/bookings/tutor");
            return res.data;
        },
    });

    const slotsQuery = useQuery<AvailabilitySlot[]>({
        queryKey: ["availability", "tutor"],
        queryFn: async () => {
            const res = await api.get("/availability/tutor");
            return res.data;
        },
    });

    const createSlotMutation = useMutation({
        mutationFn: async (data: { start_time: string; end_time: string }) => {
            const res = await api.post("/availability/", data);
            return res.data as AvailabilitySlot;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["availability", "tutor"] });
        },
    });

    const deleteSlotMutation = useMutation({
        mutationFn: async (slotId: string) => {
            await api.delete(`/availability/${slotId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["availability", "tutor"] });
        },
    });

    const confirmBookingMutation = useMutation({
        mutationFn: async (bookingId: string) => {
            const res = await api.post(`/bookings/${bookingId}/confirm`);
            return res.data as Booking;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bookings", "tutor"] });
        },
    });

    const cancelBookingMutation = useMutation({
        mutationFn: async (bookingId: string) => {
            const res = await api.post(`/bookings/${bookingId}/cancel`);
            return res.data as Booking;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bookings", "tutor"] });
            queryClient.invalidateQueries({ queryKey: ["availability", "tutor"] });
        },
    });

    return {
        bookings: bookingsQuery.data ?? [],
        slots: slotsQuery.data ?? [],
        isLoadingBookings: bookingsQuery.isLoading,
        isLoadingSlots: slotsQuery.isLoading,
        createSlot: createSlotMutation.mutateAsync,
        deleteSlot: deleteSlotMutation.mutateAsync,
        confirmBooking: confirmBookingMutation.mutateAsync,
        cancelBooking: cancelBookingMutation.mutateAsync,
        isCreatingSlot: createSlotMutation.isPending,
    };
}
