import Link from 'next/link';
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-secondary-foreground">Welcome Back</h1>
        <p className="text-secondary-foreground/80 mt-2">Sign in to your account to continue</p>
      </div>

      <div className="bg-secondary p-8 rounded-lg shadow-md w-full">
        <LoginForm />

        <div className="text-center text-sm text-secondary-foreground/80 mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
