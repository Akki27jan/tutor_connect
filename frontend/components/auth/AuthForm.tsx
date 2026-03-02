"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

interface AuthFormProps {
    mode: "login" | "signup";
}

export default function AuthForm({ mode }: AuthFormProps) {
    const { login, signup, loginError, signupError, isLoginPending, isSignupPending } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("STUDENT");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            if (mode === "login") {
                await login({ email, password });
            } else {
                await signup({ name, email, password, role });
            }
        } catch (err: any) {
            setError(
                err?.response?.data?.detail ||
                err?.message ||
                "Something went wrong. Please try again."
            );
        }
    };

    const isPending = mode === "login" ? isLoginPending : isSignupPending;

    return (
        <div className="mx-auto w-full max-w-md">
            <div className="rounded-2xl border border-white/10 bg-dark-700/50 p-8 shadow-2xl backdrop-blur-xl">
                <h2 className="mb-2 text-center text-2xl font-bold text-white">
                    {mode === "login" ? "Welcome Back" : "Create Account"}
                </h2>
                <p className="mb-8 text-center text-sm text-dark-200">
                    {mode === "login"
                        ? "Sign in to access your dashboard"
                        : "Join our tutoring community"}
                </p>

                {error && (
                    <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {mode === "signup" && (
                        <div>
                            <label className="mb-2 block text-sm font-medium text-dark-100">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="Alex Johnson"
                                className="w-full rounded-xl border border-white/10 bg-dark-600 px-4 py-3 text-sm text-white placeholder-dark-300 outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                            />
                        </div>
                    )}

                    <div>
                        <label className="mb-2 block text-sm font-medium text-dark-100">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="you@example.com"
                            className="w-full rounded-xl border border-white/10 bg-dark-600 px-4 py-3 text-sm text-white placeholder-dark-300 outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-dark-100">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            className="w-full rounded-xl border border-white/10 bg-dark-600 px-4 py-3 text-sm text-white placeholder-dark-300 outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                        />
                    </div>

                    {mode === "signup" && (
                        <div>
                            <label className="mb-2 block text-sm font-medium text-dark-100">
                                I am a
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setRole("STUDENT")}
                                    className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all ${role === "STUDENT"
                                            ? "border-primary-500 bg-primary-500/10 text-primary-400"
                                            : "border-white/10 bg-dark-600 text-dark-200 hover:border-white/20"
                                        }`}
                                >
                                    🎓 Student
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole("TUTOR")}
                                    className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all ${role === "TUTOR"
                                            ? "border-accent-500 bg-accent-500/10 text-accent-400"
                                            : "border-white/10 bg-dark-600 text-dark-200 hover:border-white/20"
                                        }`}
                                >
                                    📚 Tutor
                                </button>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition-all hover:shadow-primary-600/40 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isPending
                            ? "Please wait..."
                            : mode === "login"
                                ? "Sign In"
                                : "Create Account"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-dark-200">
                    {mode === "login" ? (
                        <>
                            Don&apos;t have an account?{" "}
                            <Link
                                href="/auth/signup"
                                className="font-medium text-primary-400 hover:text-primary-300"
                            >
                                Sign Up
                            </Link>
                        </>
                    ) : (
                        <>
                            Already have an account?{" "}
                            <Link
                                href="/auth/login"
                                className="font-medium text-primary-400 hover:text-primary-300"
                            >
                                Sign In
                            </Link>
                        </>
                    )}
                </p>
            </div>
        </div>
    );
}
