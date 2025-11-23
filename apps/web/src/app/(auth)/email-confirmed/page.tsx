'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components';
import { AlertTriangle, Check } from 'lucide-react';

export default function EmailConfirmedPage() {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // For now, simulate checking and show success
    const timer = setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      // Redirect after a delay to show success message
      router.push('/user/activity-feed');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  if (loading) {
    return <LoadingSpinner variant="screen" text="Verifying email confirmation..." />;
  }

  if (success) {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center p-8">
        <div className="bg-secondary w-full max-w-md rounded-lg p-8 text-center shadow-md">
          <div className="bg-success/10 mx-auto flex h-12 w-12 items-center justify-center rounded-full">
            <Check />
          </div>
          <h2 className="text-secondary-foreground mt-6 text-3xl font-bold">
            Email Confirmed!
          </h2>
          <p className="text-secondary-foreground mt-4">
            Your email has been successfully confirmed. You{"'"}re now logged in and can
            access all features.
          </p>
          <p className="text-secondary-foreground mt-2">
            Redirecting to your dashboard...
          </p>
        </div>
      </div>
    );
  }

  // In case neither loading nor success states are active
  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center p-8">
      <div className="bg-secondary w-full max-w-md rounded-lg p-8 text-center shadow-md">
        <div className="bg-error/10 mx-auto flex h-12 w-12 items-center justify-center rounded-full">
          <AlertTriangle />
        </div>
        <h2 className="text-secondary-foreground mt-6 text-3xl font-bold">
          Something went wrong
        </h2>
        <p className="text-secondary-foreground mt-4">
          We couldn{"'"}t confirm your email address. Please try logging in again or
          contact support.
        </p>
        <div className="mt-6">
          <button
            onClick={() => router.push('/login')}
            className="btn btn-primary w-full"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
}
