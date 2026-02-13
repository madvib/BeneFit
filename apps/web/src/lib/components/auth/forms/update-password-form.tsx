import { useNavigate } from '@tanstack/react-router';
import { FormSuccessMessage } from '@/lib/components';
import { authClient, authSchemas } from '@bene/react-api-client';
import { ROUTES, MODALS } from '@/lib/constants';
import { useAppForm } from '@/lib/components';
import { useAuthFormSubmit } from '@/lib/hooks/use-auth-submit';

export function UpdatePasswordForm() {
  const navigate = useNavigate();
  const form = useAppForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    validators: {
      onBlur: authSchemas.UpdatePasswordSchema,
    },
    onSubmit: async ({ value }) => {
      await authClient().resetPassword({
        newPassword: value.password,
        fetchOptions: {
          onError(ctx) {
            authSubmit.onAuthError(ctx.error);
          },
          onSuccess() {
            navigate({
              search: (prev) => ({ ...prev, m: MODALS.LOGIN }),
              replace: true,
            });
            authSubmit.onAuthSuccess({
              message: 'Password changed successfully!',
              redirectTo: ROUTES.MODAL.LOGIN,
            });
          },
        },
      });
    },
  });
  const authSubmit = useAuthFormSubmit({ formApi: form });

  return (
    <form.AppForm>
      <form.Root title="Update Password">
        <form.SubmissionError />
        <FormSuccessMessage message={authSubmit.success} />
        <form.AppField name="password">
          {(field) => (
            <field.ControlledInput label="New Password" type="password" placeholder="••••••••" />
          )}
        </form.AppField>
        <form.AppField name="confirmPassword">
          {(field) => (
            <field.ControlledInput
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
            />
          )}
        </form.AppField>
        <form.SubmitButton
          label="Update Password"
          submitLabel="Updating Password..."
          className="w-full"
        />
      </form.Root>
    </form.AppForm>
  );
}
