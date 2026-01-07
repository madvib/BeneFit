'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authClient } from '@bene/react-api-client';
import { ROUTES } from '@/lib/constants';
import { useAuthFormSubmit } from '@/lib/hooks/use-auth-submit';
import { useAppForm } from '@/lib/components/app-form';

export default function ConfirmEmailPage() {
  const searchParameters = useSearchParams();
  const email = searchParameters.get('email') || '';

  const form = useAppForm({
    defaultValues: {
      email,
    },
    onSubmit: async ({ value }) => {
      if (!value.email) {
        authSubmit.onAuthError({ message: 'Email is required to resend confirmation.' });
        return;
      }

      const { error } = await authClient.sendVerificationEmail({
        email: value.email,
        callbackURL: `${globalThis.location.origin}/email-confirmed`,
      });

      if (error) {
        authSubmit.onAuthError(error);
      } else {
        authSubmit.onAuthSuccess({
          message: 'Confirmation email has been sent successfully!',
        });
      }
    },
  });

  const authSubmit = useAuthFormSubmit({ formApi: form });

  return (
    <form.AppForm>
      <div className="container mx-auto flex min-h-screen items-center justify-center p-8">
        <div className="bg-secondary w-full max-w-md rounded-lg p-8 shadow-md">
          <h2 className="text-secondary-foreground mb-6 text-center text-3xl font-bold">
            Confirm Your Email
          </h2>

          <div className="mb-6 rounded-md border border-blue-200 bg-blue-50/20 p-4">
            <p className="text-secondary-foreground text-center">
              We{"'"}ve sent a confirmation email to
              <span className="font-semibold">{email}</span>
            </p>
          </div>

          <p className="text-secondary-foreground mb-6 text-center">
            Please check your email and click the confirmation link to activate your account.
          </p>

          <form.SubmissionError />

          {authSubmit.success && (
            <div className="bg-success/15 text-success mb-4 flex items-center gap-x-2 rounded-md p-3 text-sm">
              <p>{authSubmit.success}</p>
            </div>
          )}

          <div className="space-y-4">
            <form.SubmitButton
              label="Resend Confirmation Email"
              submitLabel="Sending..."
              className="w-full"
            />

            <Link
              href={ROUTES.HOME}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/80 flex w-full items-center justify-center rounded-md border px-4 py-2 text-sm font-medium transition-colors"
            >
              Confirm Later
            </Link>

            <div className="text-secondary-foreground mt-4 text-center text-sm">
              Already confirmed?{' '}
              <Link href={ROUTES.AUTH.LOGIN} className="text-primary hover:underline">
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </form.AppForm>
  );
}
