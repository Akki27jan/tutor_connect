"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBarHome() {
    const [query, setQuery] = useState("");
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <form onSubmit={handleSearch} className="w-full max-w-xl relative">
            <div className="relative flex items-center">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <svg
                        className="h-5 w-5 text-dark-300"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                        />
                    </svg>
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="block w-full rounded-2xl border border-white/10 bg-dark-700/60 py-4 pl-12 pr-32 text-white placeholder-dark-300 backdrop-blur-md transition-all focus:border-primary-500 focus:bg-dark-600 focus:outline-none focus:ring-2 focus:ring-primary-500/20 shadow-xl"
                    placeholder="E.g. Calculus, AP History, Python..."
                    required
                />
                <button
                    type="submit"
                    className="absolute right-2 top-2 bottom-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-6 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition-all hover:shadow-primary-600/40 hover:brightness-110"
                >
                    Search
                </button>
            </div>
        </form>
    );
}
