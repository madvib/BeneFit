'use client';

import { FormSuccessMessage } from '@/lib/components';
import { authClient, authSchemas } from '@bene/react-api-client';
import { ROUTES } from '@/lib/constants';
import { useAppForm } from '@/lib/components';
import { useAuthFormSubmit } from '@/lib/hooks/use-auth-submit';

interface UpdatePasswordFormProps {
  onPasswordUpdated?: () => void;
}

export function UpdatePasswordForm({ onPasswordUpdated }: UpdatePasswordFormProps) {
  const form = useAppForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    validators: {
      onBlur: authSchemas.UpdatePasswordSchema,
    },
    onSubmit: async ({ value }) => {
      await authClient.resetPassword({
        newPassword: value.password,
        fetchOptions: {
          onError(ctx) {
            authSubmit.onAuthError(ctx.error);
          },
          onSuccess() {
            if (onPasswordUpdated) onPasswordUpdated();
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
