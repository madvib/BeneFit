'use client';

import Link from 'next/link';
import { PasswordResetForm } from '@/components/auth/password-reset-form';

export default function PasswordResetPage() {
  return (
    <div className="container mx-auto p-8 flex items-center justify-center min-h-screen">
      <div className="bg-secondary p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-secondary-foreground">
          Reset Your Password
        </h2>
        <PasswordResetForm />
        <p className="text-center mt-4 text-secondary-foreground">
          Remember your password?{' '}
          <Link href="/login" className="text-primary hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
