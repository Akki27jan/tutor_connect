"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { APP_NAME } from "@/lib/constants";

export default function Navbar() {
    const { user, isAuthenticated, logout, isLoading } = useAuth();

    return (
        <nav className="sticky top-0 z-50 border-b border-white/10 bg-dark-800/80 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-2 text-xl font-bold tracking-tight text-white"
                >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 text-sm font-black text-white shadow-lg shadow-primary-500/25">
                        T
                    </span>
                    <span className="bg-gradient-to-r from-white to-dark-100 bg-clip-text text-transparent">
                        {APP_NAME}
                    </span>
                </Link>

                {/* Navigation Links */}
                <div className="hidden items-center gap-8 md:flex">
                    <Link
                        href="/search"
                        className="text-sm font-medium text-dark-100 transition-colors hover:text-white"
                    >
                        Browse Subjects
                    </Link>

                    {!isLoading && (
                        <>
                            {isAuthenticated && user ? (
                                <>
                                    <Link
                                        href={
                                            user.role === "STUDENT"
                                                ? "/dashboard/student"
                                                : "/dashboard/tutor"
                                        }
                                        className="text-sm font-medium text-dark-100 transition-colors hover:text-white"
                                    >
                                        Dashboard
                                    </Link>
                                    <div className="flex items-center gap-4">
                                        <span className="rounded-full bg-dark-500 px-3 py-1 text-xs font-semibold text-primary-300">
                                            {user.role}
                                        </span>
                                        <span className="text-sm text-dark-100">{user.name}</span>
                                        <button
                                            onClick={() => logout()}
                                            className="rounded-lg bg-dark-500 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-dark-400"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Link
                                        href="/auth/login"
                                        className="rounded-lg px-4 py-2 text-sm font-medium text-dark-100 transition-colors hover:text-white"
                                    >
                                        Log In
                                    </Link>
                                    <Link
                                        href="/auth/signup"
                                        className="rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition-all hover:shadow-primary-600/40 hover:brightness-110"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-dark-500 text-white md:hidden">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="h-5 w-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                        />
                    </svg>
                </button>
            </div>
        </nav>
    );
}
