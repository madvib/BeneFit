import { Link } from '@tanstack/react-router';
import { authClient } from '@bene/react-api-client';
import { useAppForm, typography } from '@/lib/components';
import { MODALS } from '@/lib/constants';
import { useAuthFormSubmit } from '@/lib/hooks/use-auth-submit';

interface ConfirmEmailNoticeProps {
  email?: string;
  onClose?: () => void;
}

export function ConfirmEmailNotice({ email = '', onClose }: Readonly<ConfirmEmailNoticeProps>) {
  const form = useAppForm({
    defaultValues: {
      email,
    },
    onSubmit: async ({ value }) => {
      if (!value.email) {
        authSubmit.onAuthError({ message: 'Email is required to resend confirmation.' });
        return;
      }

      const { error } = await authClient().sendVerificationEmail({
        email: value.email,
        callbackURL: `${globalThis.location.origin}/callback`, // Handled by callback route
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
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <h2 className={`${typography.h3} mb-4`}>Confirm Your Email</h2>

        <div className="bg-primary/5 border-primary/10 mb-6 rounded-xl border p-4">
          <p className={`${typography.p}`}>
            We've sent a confirmation email to
            <span className={`${typography.small} ml-1 font-bold`}>{email}</span>
          </p>
        </div>

        <p className={`${typography.muted} mb-6`}>
          Please check your email and click the confirmation link to activate your account.
        </p>

        <form.SubmissionError />

        {authSubmit.success && (
          <div className="bg-success/15 text-success mb-4 flex w-full items-center justify-center gap-x-2 rounded-md p-3">
            <p className={typography.small}>{authSubmit.success}</p>
          </div>
        )}

        <div className="w-full space-y-4">
          <form.SubmitButton
            label="Resend Confirmation Email"
            submitLabel="Sending..."
            className="w-full"
          />

          <button
            type="button"
            onClick={onClose}
            className={`${typography.small} text-muted-foreground hover:text-foreground w-full py-2 transition-colors`}
          >
            Confirm Later
          </button>

          <div className={`${typography.mutedXs} mt-2`}>
            Already confirmed?{' '}
            <Link
              to="."
              search={(prev: any) => ({ ...prev, m: MODALS.LOGIN })}
              replace
              className="text-primary hover:underline"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </form.AppForm>
  );
}
