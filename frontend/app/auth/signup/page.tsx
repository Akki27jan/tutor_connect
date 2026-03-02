import AuthForm from "@/components/auth/AuthForm";

export const metadata = {
    title: "Sign Up — TutorConnect",
};

export default function SignupPage() {
    return (
        <div className="flex min-h-[80vh] items-center justify-center px-6 py-16">
            <AuthForm mode="signup" />
        </div>
    );
}
