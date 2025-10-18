'use client';

import { useEffect, useState } from 'react';
import { createClient as createBrowserClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function EmailConfirmedPage() {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();
  const supabase = createBrowserClient();

  useEffect(() => {
    // Check if user is already signed in
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Check if user's email is confirmed
        if (session.user.email_confirmed_at) {
          setSuccess(true);
          // Redirect after a delay to show success message
          setTimeout(() => {
            router.push('/feed');
          }, 3000);
        } else {
          setError(true);
        }
      } else {
        // If no session, redirect to login
        router.push('/login');
      }
      
      setLoading(false);
    };

    checkSession();
  }, [supabase, router]);

  if (loading) {
    return (
      <div className="container mx-auto p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-secondary-foreground">Verifying email confirmation...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="container mx-auto p-8 flex items-center justify-center min-h-screen">
        <div className="bg-secondary p-8 rounded-lg shadow-md w-full max-w-md text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-success/10">
            <svg
              className="h-6 w-6 text-success"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-secondary-foreground">
            Email Confirmed!
          </h2>
          <p className="mt-4 text-secondary-foreground">
            Your email has been successfully confirmed. You{'\''}re now logged in and can access all features.
          </p>
          <p className="mt-2 text-secondary-foreground">
            Redirecting to your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8 flex items-center justify-center min-h-screen">
        <div className="bg-secondary p-8 rounded-lg shadow-md w-full max-w-md text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-error/10">
            <svg
              className="h-6 w-6 text-error"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-secondary-foreground">
            Email Not Confirmed
          </h2>
          <p className="mt-4 text-secondary-foreground">
            We couldn{'\''}t confirm your email address. Please try logging in again or contact support.
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

  return null;
}