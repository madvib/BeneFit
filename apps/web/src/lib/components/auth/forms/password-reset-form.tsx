import { Link } from '@tanstack/react-router';
import { revalidateLogic } from '@tanstack/react-form';
import { authClient, authSchemas } from '@bene/react-api-client';
import { useAppForm, FormSuccessMessage, typography } from '@/lib/components';
import { useAuthFormSubmit } from '@/lib/hooks/use-auth-submit';
import { MODALS } from '@/lib/constants';

export function PasswordResetForm() {
  const form = useAppForm({
    defaultValues: {
      email: '',
    },
    validators: {
      onDynamic: authSchemas.PasswordResetSchema,
    },
    validationLogic: revalidateLogic(),
    onSubmit: async ({ value }) => {
      await authClient().requestPasswordReset({
        email: value.email,
        redirectTo: `${globalThis.location.origin}/?m=${MODALS.UPDATE_PASSWORD}`,
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
            to="."
            search={(prev: any) => ({ ...prev, m: MODALS.LOGIN })}
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
