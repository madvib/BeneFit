'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthError } from '@/components/auth/auth-error/auth-error';

import { LoadingSpinner } from '@/components';

export default function ConfirmEmailPage() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [resendSuccess, setResendSuccess] = useState(false);
  const searchParameters = useSearchParams();
  const router = useRouter();
  const email = searchParameters.get('email') || '';

  useEffect(() => {
    // For now, just set loading to false
    setLoading(false);
  }, [router]);

  const handleResendEmail = async () => {
    if (!email) {
      setError('Email is required to resend confirmation.');
      return;
    }

    try {
      setError('');
      setLoading(true);

      // For now, simulate success
      setResendSuccess(true);
      setMessage('Confirmation email has been sent successfully!');
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
    return <LoadingSpinner variant="screen" text="Checking confirmation status..." />;
  }

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center p-8">
      <div className="bg-secondary w-full max-w-md rounded-lg p-8 shadow-md">
        <h2 className="text-secondary-foreground mb-6 text-center text-3xl font-bold">
          Confirm Your Email
        </h2>

        <div className="mb-6 rounded-md border border-blue-200 bg-blue-50/20 p-4">
          <p className="text-secondary-foreground text-center">
            We{"'"}ve sent a confirmation email to{' '}
            <span className="font-semibold">{email}</span>
          </p>
        </div>

        <p className="text-secondary-foreground mb-6 text-center">
          Please check your email and click the confirmation link to activate your
          account.
        </p>

        {error && <AuthError message={error} />}
        {resendSuccess && !error && (
          <div className="bg-success/15 text-success mb-4 flex items-center gap-x-2 rounded-md p-3 text-sm">
            <p>{message}</p>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleResendEmail}
            disabled={loading}
            className={`btn w-full ${loading ? 'btn-disabled' : 'btn-primary'}`}
          >
            {loading ? 'Sending...' : 'Resend Confirmation Email'}
          </button>

          <div className="text-secondary-foreground mt-4 text-center text-sm">
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
