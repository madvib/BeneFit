'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authClient, getAuthErrorMessage } from '@bene/react-api-client';
import { Button, AuthError } from '@/lib/components';
import { ROUTES } from '@/lib/constants';

export default function ConfirmEmailPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [resendSuccess, setResendSuccess] = useState(false);
  const searchParameters = useSearchParams();
  const email = searchParameters.get('email') || '';
  // authClient imported directly

  const handleResendEmail = async () => {
    if (!email) {
      setError('Email is required to resend confirmation.');
      return;
    }

    try {
      setError('');
      setLoading(true);
      setResendSuccess(false);

      // Use Better Auth to resend verification email
      const { error: resendError } = await authClient.sendVerificationEmail({
        email,
        callbackURL: `${window.location.origin}/email-confirmed`,
      });

      if (resendError) {
        setError(getAuthErrorMessage(resendError.code));
      } else {
        setResendSuccess(true);
        setMessage('Confirmation email has been sent successfully!');
      }
    } catch (error_) {
      setError(
        error_ instanceof Error ? error_.message : 'An error occurred while resending the email.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center p-8">
      <div className="bg-secondary w-full max-w-md rounded-lg p-8 shadow-md">
        <h2 className="text-secondary-foreground mb-6 text-center text-3xl font-bold">
          Confirm Your Email
        </h2>

        <div className="mb-6 rounded-md border border-blue-200 bg-blue-50/20 p-4">
          <p className="text-secondary-foreground text-center">
            We{"'"}ve sent a confirmation email to <span className="font-semibold">{email}</span>
          </p>
        </div>

        <p className="text-secondary-foreground mb-6 text-center">
          Please check your email and click the confirmation link to activate your account.
        </p>

        {error && <AuthError message={error} />}
        {resendSuccess && !error && (
          <div className="bg-success/15 text-success mb-4 flex items-center gap-x-2 rounded-md p-3 text-sm">
            <p>{message}</p>
          </div>
        )}

        <div className="space-y-4">
          <Button
            onClick={handleResendEmail}
            disabled={loading || resendSuccess}
            className="w-full"
          >
            {loading ? 'Sending...' : resendSuccess ? 'Email Sent!' : 'Resend Confirmation Email'}
          </Button>

          <div className="text-secondary-foreground mt-4 text-center text-sm">
            Already confirmed?{' '}
            <Link href={ROUTES.MODAL.LOGIN} className="text-primary hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
