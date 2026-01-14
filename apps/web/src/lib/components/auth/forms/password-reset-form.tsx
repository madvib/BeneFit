'use client';

import { revalidateLogic } from '@tanstack/react-form';
import { authClient, authSchemas } from '@bene/react-api-client';
import { useAppForm, FormSuccessMessage, typography } from '@/lib/components';
import { useAuthFormSubmit } from '@/lib/hooks/use-auth-submit';
import { ROUTES } from '@/lib/constants';
import Link from 'next/link';

export function PasswordResetForm({ isModal = false }) {
  const form = useAppForm({
    defaultValues: {
      email: '',
    },
    validators: {
      onDynamic: authSchemas.PasswordResetSchema,
    },
    validationLogic: revalidateLogic(),
    onSubmit: async ({ value }) => {
      await authClient.requestPasswordReset({
        email: value.email,
        redirectTo: `${globalThis.location.origin}${ROUTES.AUTH.UPDATE_PASSWORD}`,
        fetchOptions: {
          onError(ctx) {
            authSubmit.onAuthError(ctx.error);
          },
          onSuccess() {
            authSubmit.onAuthSuccess({
              message: 'Password reset email sent! Please check your inbox.',
            });
          },
        },
      });
    },
  });
  const authSubmit = useAuthFormSubmit({ formApi: form });

  <FormSuccessMessage message={authSubmit.success} />;

  return (
    <form.AppForm>
      <form.Root title="Reset Password">
        <form.AppField name="email">
          {(field) => (
            <field.ControlledInput label="Email" type="email" placeholder="you@example.com" />
          )}
        </form.AppField>
        <form.SubmissionError />
        <form.SubmitButton label="Send Reset Email" submitLabel="Sending..." className="w-full" />
        <div className={`${typography.muted} mt-4 text-center`}>
          Remember your password?{' '}
          <Link
            href={isModal ? ROUTES.MODAL.LOGIN : ROUTES.AUTH.LOGIN}
            replace
            className={`${typography.small} text-primary hover:underline`}
          >
            Log in
          </Link>
        </div>
      </form.Root>
    </form.AppForm>
  );
}
