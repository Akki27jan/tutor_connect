"use client";

import { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { TutorWithSubjects } from "@/types/tutor";
import TutorCard from "@/components/tutor/TutorCard";
import SearchBarHome from "@/components/home/SearchBarHome";

function SearchResultsContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";

    const { data: tutors, isLoading } = useQuery<TutorWithSubjects[]>({
        queryKey: ["tutors", "search", query],
        queryFn: async () => {
            const res = await api.get(`/tutors/search?q=${encodeURIComponent(query)}`);
            return res.data;
        },
    });

    return (
        <div className="mx-auto max-w-7xl px-6 py-12">
            <div className="mb-2">
                <Link
                    href="/"
                    className="text-sm text-dark-300 hover:text-primary-400"
                >
                    ← Back Home
                </Link>
            </div>

            <div className="mb-10">
                <h1 className="text-3xl font-bold text-white">Search Results</h1>
                <p className="mt-2 text-dark-200">
                    {query ? `Showing tutors for "${query}"` : "Showing all tutors"}
                </p>
                <div className="mt-6 flex max-w-xl">
                    <SearchBarHome />
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
                </div>
            ) : tutors?.length === 0 ? (
                <div className="rounded-xl border border-white/10 bg-dark-700/30 p-12 text-center">
                    <p className="text-dark-200">
                        No tutors found teaching this subject yet.
                    </p>
                    <Link
                        href="/auth/signup"
                        className="mt-3 inline-block text-sm font-medium text-primary-400 hover:text-primary-300"
                    >
                        Become a tutor for this subject →
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {tutors?.map((tutor) => (
                        <TutorCard key={tutor.id} tutor={tutor} subject={query || tutor.subjects?.[0] || 'General'} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function SearchResultsPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-white">Loading search results...</div>}>
            <SearchResultsContent />
        </Suspense>
    );
}
