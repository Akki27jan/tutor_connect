import { APP_NAME } from "@/lib/constants";

export default function Footer() {
    return (
        <footer className="border-t border-white/5 bg-dark-900">
            <div className="mx-auto max-w-7xl px-6 py-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 text-lg font-bold text-white">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 text-xs font-black text-white">
                                T
                            </span>
                            {APP_NAME}
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-dark-200">
                            Connecting students with expert tutors for personalized,
                            topic-focused learning sessions.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-dark-100">
                            Quick Links
                        </h3>
                        <ul className="space-y-2.5">
                            <li>
                                <a
                                    href="/search"
                                    className="text-sm text-dark-200 transition-colors hover:text-primary-400"
                                >
                                    Browse Subjects
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/auth/signup"
                                    className="text-sm text-dark-200 transition-colors hover:text-primary-400"
                                >
                                    Become a Tutor
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/auth/login"
                                    className="text-sm text-dark-200 transition-colors hover:text-primary-400"
                                >
                                    Student Login
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-dark-100">
                            Contact
                        </h3>
                        <ul className="space-y-2.5 text-sm text-dark-200">
                            <li>support@tutorconnect.com</li>
                            <li>Built with ❤️ using Next.js &amp; FastAPI</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-10 border-t border-white/5 pt-8 text-center text-xs text-dark-300">
                    © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
