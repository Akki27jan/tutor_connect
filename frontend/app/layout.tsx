import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

export const metadata: Metadata = {
    title: "TutorConnect — Topic-Based Tutoring Platform",
    description:
        "Connect with expert tutors for personalized, topic-focused learning sessions. Browse subjects, pick your topic, and book instantly.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <Providers>
                    <div className="flex min-h-screen flex-col">
                        <Navbar />
                        <main className="flex-1">{children}</main>
                        <Footer />
                    </div>
                </Providers>
            </body>
        </html>
    );
}
