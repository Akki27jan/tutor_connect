import Link from "next/link";
import SearchBarHome from "@/components/home/SearchBarHome";

export default function HomePage() {
    return (
        <div className="relative overflow-hidden">
            {/* Background effects */}
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary-600/10 blur-[120px]" />
                <div className="absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-accent-500/8 blur-[100px]" />
            </div>

            {/* Hero Section */}
            <section className="mx-auto max-w-7xl px-6 pb-20 pt-24 text-center md:pt-32">
                <div className="animate-fade-in">
                    <span className="inline-block rounded-full border border-primary-500/20 bg-primary-500/10 px-4 py-1.5 text-xs font-semibold text-primary-400">
                        🎓 Find Expert Tutors For Any Subject
                    </span>

                    <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
                        Learn Anything with{" "}
                        <span className="bg-gradient-to-r from-primary-400 via-primary-300 to-accent-400 bg-clip-text text-transparent">
                            Expert Tutors
                        </span>
                    </h1>

                    <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-dark-200 md:text-xl">
                        Search for a subject, find the perfect tutor, and book
                        a live session with Google Meet — all in minutes.
                    </p>

                    <div className="mt-10 flex flex-col items-center justify-center">
                        <SearchBarHome />
                    </div>

                    <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                        <Link
                            href="/auth/signup"
                            className="rounded-2xl border border-white/10 bg-dark-600/80 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-dark-500"
                        >
                            Become a Tutor
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="mx-auto max-w-7xl px-6 pb-24">
                <div className="grid gap-6 md:grid-cols-3">
                    {[
                        {
                            icon: "🔍",
                            title: "Subject Search",
                            description:
                                "Search for any subject or topic to find exactly what you need to learn from our available tutors.",
                        },
                        {
                            icon: "📅",
                            title: "Flexible Scheduling",
                            description:
                                "Tutors set their availability. Pick a slot that works for you and book instantly.",
                        },
                        {
                            icon: "🎥",
                            title: "Google Meet Sessions",
                            description:
                                "Every confirmed session automatically gets a Google Meet link — no extra setup needed.",
                        },
                    ].map((feature) => (
                        <div
                            key={feature.title}
                            className="group rounded-2xl border border-white/10 bg-dark-700/30 p-8 backdrop-blur-sm transition-all hover:border-primary-500/20 hover:bg-dark-700/50"
                        >
                            <span className="text-3xl">{feature.icon}</span>
                            <h3 className="mt-4 text-xl font-bold text-white">
                                {feature.title}
                            </h3>
                            <p className="mt-3 text-sm leading-relaxed text-dark-200">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* How it Works */}
            <section className="border-t border-white/5 bg-dark-800/50">
                <div className="mx-auto max-w-7xl px-6 py-24">
                    <h2 className="mb-4 text-center text-3xl font-bold text-white md:text-4xl">
                        How It Works
                    </h2>
                    <p className="mx-auto mb-16 max-w-xl text-center text-dark-200">
                        Get started in 4 simple steps
                    </p>

                    <div className="grid gap-8 md:grid-cols-4">
                        {[
                            {
                                step: "01",
                                title: "Search Subjects",
                                desc: "Type what you want to learn to find available tutors.",
                            },
                            {
                                step: "02",
                                title: "Find a Tutor",
                                desc: "Review rated tutors who specialize in your topic.",
                            },
                            {
                                step: "03",
                                title: "Book a Slot",
                                desc: "Pick an available time that works for you.",
                            },
                            {
                                step: "04",
                                title: "Join Session",
                                desc: "Get a Google Meet link and start learning!",
                            },
                        ].map((item) => (
                            <div key={item.step} className="text-center">
                                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 text-lg font-bold text-primary-400">
                                    {item.step}
                                </div>
                                <h3 className="text-lg font-semibold text-white">
                                    {item.title}
                                </h3>
                                <p className="mt-2 text-sm text-dark-200">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="mx-auto max-w-7xl px-6 py-24 text-center">
                <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-primary-600/10 via-dark-700/50 to-accent-600/10 p-12 backdrop-blur-sm md:p-16">
                    <h2 className="text-3xl font-bold text-white md:text-4xl">
                        Ready to Start Learning?
                    </h2>
                    <p className="mx-auto mt-4 max-w-lg text-dark-200">
                        Join thousands of students and tutors on TutorConnect. Sign up for
                        free and book your first session today.
                    </p>
                    <Link
                        href="/auth/signup"
                        className="mt-8 inline-block rounded-2xl bg-gradient-to-r from-primary-600 to-primary-500 px-10 py-4 text-base font-semibold text-white shadow-xl shadow-primary-600/25 transition-all hover:shadow-primary-600/40 hover:brightness-110"
                    >
                        Get Started Free
                    </Link>
                </div>
            </section>
        </div>
    );
}
