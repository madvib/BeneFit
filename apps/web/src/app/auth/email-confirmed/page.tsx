'use client';

import { LoadingSpinner, typography } from '@/lib/components';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertTriangle, Check } from 'lucide-react';
import { authClient } from '@bene/react-api-client';
import { ROUTES } from '@/lib/constants';

export default function EmailConfirmedPage() {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setError('Verification token is missing');
        setLoading(false);
        return;
      }

      const { error: verifyError } = await authClient.verifyEmail({
        query: { token },
      });

      if (verifyError) {
        setError(verifyError.message || 'Failed to verify email');
        setLoading(false);
      } else {
        setSuccess(true);
        setLoading(false);
        setTimeout(() => router.push(ROUTES.USER.ACTIVITIES), 2000);
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  if (loading) {
    return <LoadingSpinner variant="screen" text="Verifying email confirmation..." />;
  }

  if (success) {
    // TODO(UI) PageContainer, IconBox, possibly Card?
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center p-8">
        <div className="bg-secondary w-full max-w-md rounded-lg p-8 text-center shadow-md">
          <div className="bg-success/10 mx-auto flex h-12 w-12 items-center justify-center rounded-full">
            <Check className="text-success" />
          </div>
          <h2 className={`${typography.h2} text-secondary-foreground mt-6`}>Email Confirmed!</h2>
          <p className={`${typography.p} text-secondary-foreground mt-4`}>
            Your email has been successfully confirmed. You&apos;re now logged in and can access
            all features.
          </p>
          <p className={`${typography.small} text-secondary-foreground mt-2`}>
            Redirecting to your dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Error state TODO(UI) use error display!
  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center p-8">
      <div className="bg-secondary w-full max-w-md rounded-lg p-8 text-center shadow-md">
        <div className="bg-error/10 mx-auto flex h-12 w-12 items-center justify-center rounded-full">
          <AlertTriangle className="text-error" />
        </div>
        <h2 className={`${typography.h2} text-secondary-foreground mt-6`}>Verification Failed</h2>
        <p className={`${typography.p} text-secondary-foreground mt-4`}>
          {error || "We couldn't confirm your email address. The link may have expired."}
        </p>
        <div className="mt-6 space-y-3">
          <button
            onClick={() => (globalThis.location.href = ROUTES.MODAL.LOGIN)}
            className="btn btn-primary w-full"
          >
            Go to Login
          </button>
          <button
            onClick={() => (globalThis.location.href = ROUTES.AUTH.CONFIRM_EMAIL)}
            className="btn btn-secondary w-full"
          >
            Resend Verification Email
          </button>
        </div>
      </div>
    </div>
  );
}
