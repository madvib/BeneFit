'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthError } from '@/components/auth/auth-error/auth-error';

export default function ConfirmEmailPage() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [resendSuccess, setResendSuccess] = useState(false);
  const searchParameters = useSearchParams();
  const router = useRouter();
  const email = searchParameters.get('email') || '';

  useEffect(() => {
    // Check current session to see if user is already logged in
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        // If user is already logged in, redirect to feed
        router.push('/feed');
      } else {
        setLoading(false);
      }
    };

    checkSession();
  }, [supabase, router]);

  const handleResendEmail = async () => {
    if (!email) {
      setError('Email is required to resend confirmation.');
      return;
    }

    try {
      setError('');
      setLoading(true);

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${globalThis.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
      } else {
        setResendSuccess(true);
        setMessage('Confirmation email has been sent successfully!');
      }
    } catch (error_) {
      setError(
        error_ instanceof Error
          ? error_.message
          : 'An error occurred while resending the email.',
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-secondary-foreground">
            Checking confirmation status...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 flex items-center justify-center min-h-screen">
      <div className="bg-secondary p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-secondary-foreground">
          Confirm Your Email
        </h2>

        <div className="mb-6 p-4 bg-blue-50/20 rounded-md border border-blue-200">
          <p className="text-secondary-foreground text-center">
            We{"'"}ve sent a confirmation email to{' '}
            <span className="font-semibold">{email}</span>
          </p>
        </div>

        <p className="text-secondary-foreground mb-6 text-center">
          Please check your email and click the confirmation link to activate
          your account.
        </p>

        {error && <AuthError message={error} />}
        {resendSuccess && !error && (
          <div className="bg-success/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-success mb-4">
            <p>{message}</p>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleResendEmail}
            disabled={loading}
            className={`w-full btn ${loading ? 'btn-disabled' : 'btn-primary'}`}
          >
            {loading ? 'Sending...' : 'Resend Confirmation Email'}
          </button>

          <div className="text-center mt-4 text-sm text-secondary-foreground">
            Already confirmed?{' '}
            <a href="/login" className="text-primary hover:underline">
              Log in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
