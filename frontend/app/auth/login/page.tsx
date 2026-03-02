import AuthForm from "@/components/auth/AuthForm";

export const metadata = {
    title: "Log In — TutorConnect",
};

export default function LoginPage() {
    return (
        <div className="flex min-h-[80vh] items-center justify-center px-6 py-16">
            <AuthForm mode="login" />
        </div>
    );
}
