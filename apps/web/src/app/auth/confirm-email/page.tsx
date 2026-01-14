'use client';

import { typography, useAppForm } from '@/lib/components';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authClient } from '@bene/react-api-client';
import { ROUTES } from '@/lib/constants';
import { useAuthFormSubmit } from '@/lib/hooks/use-auth-submit';

//TODO(UI) add to storybook

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
          <h2 className={`${typography.h2} text-secondary-foreground mb-6 text-center`}>
            Confirm Your Email
          </h2>

          <div className="mb-6 rounded-md border border-blue-200 bg-blue-50/20 p-4">
            <p className={`${typography.p} text-secondary-foreground text-center`}>
              We{"'"}ve sent a confirmation email to
              <span className={`${typography.small} ml-1 font-bold`}>{email}</span>
            </p>
          </div>

          <p className={`${typography.p} text-secondary-foreground mb-6 text-center`}>
            Please check your email and click the confirmation link to activate your account.
          </p>

          <form.SubmissionError />

          {authSubmit.success && (
            <div
              className={`${typography.small} bg-success/15 text-success mb-4 flex items-center gap-x-2 rounded-md p-3`}
            >
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
              className={`${typography.labelSm} bg-secondary text-secondary-foreground hover:bg-secondary/80 flex w-full items-center justify-center rounded-md border px-4 py-2 transition-colors`}
            >
              Confirm Later
            </Link>

            <div className={`${typography.small} text-secondary-foreground mt-4 text-center`}>
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
