import { LoadingSpinner, typography } from '@/lib/components';
import { useEffect, useState } from 'react';
import { AlertTriangle, Check } from 'lucide-react';
import { authClient } from '@bene/react-api-client';
import { ROUTES, MODALS } from '@/lib/constants';
import { useNavigate, useSearch } from '@tanstack/react-router';

export function VerifyEmail() {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Use loose typing for search to allow accessing token
  const search = useSearch({ strict: false });
  // @ts-expect-error - token might exist in search
  const token = search.token;
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
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
        setTimeout(() => {
            // Close modal and go to activities
            navigate({ to: ROUTES.USER.ACTIVITIES, search: {} });
        }, 2000);
      }
    };

    verify();
  }, [token, navigate]);

  if (loading) {
    return (
      <div className="p-8">
        <LoadingSpinner text="Verifying email..." />
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="bg-success/10 mx-auto flex h-12 w-12 items-center justify-center rounded-full">
          <Check className="text-success" />
        </div>
        <h2 className={`${typography.h3} mt-4`}>Email Confirmed!</h2>
        <p className={`${typography.muted} mt-2`}>
          Your email has been successfully confirmed. Redirecting...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="bg-error/10 mx-auto flex h-12 w-12 items-center justify-center rounded-full">
        <AlertTriangle className="text-error" />
      </div>
      <h2 className={`${typography.h3} mt-4`}>Verification Failed</h2>
      <p className={`${typography.muted} mt-2 mb-6`}>
        {error || "We couldn't confirm your email address. The link may have expired."}
      </p>
      <div className="w-full space-y-3">
        <button
          onClick={() => navigate({ search: { m: MODALS.LOGIN } })}
          className="btn btn-primary w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          Go to Login
        </button>
        <button
          onClick={() => navigate({ search: { m: MODALS.CONFIRM_EMAIL } })}
          className="btn btn-secondary w-full rounded-md border border-input bg-background px-4 py-2 hover:bg-accent hover:text-accent-foreground"
        >
          Resend Verification Email
        </button>
      </div>
    </div>
  );
}
