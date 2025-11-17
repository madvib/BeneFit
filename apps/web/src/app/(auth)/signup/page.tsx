import Link from 'next/link';
import { SignupForm } from '@/components/auth/signup-form';

export default function SignupPage() {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-secondary-foreground">Create Account</h1>
        <p className="text-secondary-foreground/80 mt-2">
          Join us today and start your wellness journey
        </p>
      </div>

      <div className="bg-secondary p-8 rounded-lg shadow-md w-full">
        <SignupForm />

        <div className="text-center text-sm text-secondary-foreground/80 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
