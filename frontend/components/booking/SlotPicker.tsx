"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { AvailabilitySlot } from "@/types/tutor";

interface SlotPickerProps {
    tutorId: string;
    selectedSlotId: string | null;
    onSelectSlot: (slot: AvailabilitySlot) => void;
}

export default function SlotPicker({
    tutorId,
    selectedSlotId,
    onSelectSlot,
}: SlotPickerProps) {
    const { data: slots, isLoading } = useQuery<AvailabilitySlot[]>({
        queryKey: ["availability", tutorId],
        queryFn: async () => {
            const res = await api.get(`/availability/${tutorId}`);
            return res.data;
        },
        enabled: !!tutorId,
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
            </div>
        );
    }

    if (!slots || slots.length === 0) {
        return (
            <div className="rounded-xl border border-white/10 bg-dark-700/30 p-6 text-center">
                <p className="text-sm text-dark-200">
                    No available slots for this tutor right now.
                </p>
            </div>
        );
    }

    // Group slots by date
    const grouped: Record<string, AvailabilitySlot[]> = {};
    slots.forEach((slot) => {
        const date = new Date(slot.start_time).toLocaleDateString("en-US", {
            weekday: "long",
            month: "short",
            day: "numeric",
        });
        if (!grouped[date]) grouped[date] = [];
        grouped[date].push(slot);
    });

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Available Slots</h3>
            {Object.entries(grouped).map(([date, dateSlots]) => (
                <div key={date}>
                    <p className="mb-3 text-sm font-medium text-dark-100">{date}</p>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                        {dateSlots.map((slot) => {
                            const start = new Date(slot.start_time);
                            const end = new Date(slot.end_time);
                            const timeStr = `${start.toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })} - ${end.toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}`;
                            const isSelected = selectedSlotId === slot.id;

                            return (
                                <button
                                    key={slot.id}
                                    onClick={() => onSelectSlot(slot)}
                                    className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all ${isSelected
                                            ? "border-primary-500 bg-primary-500/15 text-primary-400 shadow-lg shadow-primary-500/10"
                                            : "border-white/10 bg-dark-600 text-dark-100 hover:border-primary-500/50 hover:text-white"
                                        }`}
                                >
                                    {timeStr}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
}
