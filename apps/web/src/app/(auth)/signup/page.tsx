import Link from "next/link";
import { SignupForm } from "@/presentation/auth/signup-form";

export default function SignupPage() {
  return (
    <div className="container mx-auto p-8 flex items-center justify-center min-h-screen">
      <div className="bg-secondary p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-secondary-foreground">
          Create Account
        </h2>
        <SignupForm />
        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
