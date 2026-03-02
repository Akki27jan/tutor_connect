"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSubjects, assignTutorSubjects } from "@/lib/api";
import api from "@/lib/api";
import { Subject } from "@/types/tutor";

export function useTutorProfile() {
    const queryClient = useQueryClient();

    // Fetch all available subjects and topics (keeping this just in case they want to still browse)
    const subjectsQuery = useQuery<Subject[]>({
        queryKey: ["subjects"],
        queryFn: getSubjects,
    });

    // Fetch current tutor's profile (which includes their assigned subjects)
    const profileQuery = useQuery({
        queryKey: ["tutor", "profile"],
        queryFn: async () => {
            const profileRes = await api.get("/tutors/profile");
            return profileRes.data;
        },
    });

    const assignSubjectsMutation = useMutation({
        mutationFn: (subjects: string[]) => assignTutorSubjects(subjects),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tutor", "profile"] });
        },
    });

    return {
        systemSubjects: subjectsQuery.data || [],
        isLoadingSystemSubjects: subjectsQuery.isLoading,
        profile: profileQuery.data,
        isLoadingProfile: profileQuery.isLoading,
        assignSubjects: assignSubjectsMutation.mutateAsync,
        isAssigning: assignSubjectsMutation.isPending,
        assignError: assignSubjectsMutation.error,
    };
}
