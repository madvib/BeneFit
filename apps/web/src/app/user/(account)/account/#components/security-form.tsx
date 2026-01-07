'use client';

import { authClient, authSchemas } from '@bene/react-api-client';
import { useAppForm } from '@/lib/components/app-form';
import { useAuthFormSubmit } from '@/lib/hooks/use-auth-submit';
import { FormSuccessMessage } from '@/lib/components';

export default function SecurityForm() {
  const form = useAppForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validators: {
      onChange: authSchemas.ChangePasswordSchema,
    },
    onSubmit: async ({ value }) => {
      await authClient.changePassword({
        currentPassword: value.currentPassword,
        newPassword: value.newPassword,
        revokeOtherSessions: true,
        fetchOptions: {
          onError(ctx) {
            authSubmit.onAuthError(ctx.error);
          },
          onSuccess() {
            authSubmit.onAuthSuccess({
              message: 'Password changed successfully!',
            });
          },
        },
      });
    },
  });
  const authSubmit = useAuthFormSubmit({ formApi: form });

  return (
    <form.AppForm>
      <form.Root title="Security">
        <form.SubmissionError />
        <FormSuccessMessage message={authSubmit.success} />
        <div className="space-y-4">
          <form.AppField name="currentPassword">
            {(field) => (
              <field.ControlledInput
                label="Current Password"
                type="password"
                placeholder="Enter current password"
              />
            )}
          </form.AppField>

          <form.AppField name="newPassword">
            {(field) => (
              <field.ControlledInput
                label="New Password"
                type="password"
                placeholder="Enter new password"
              />
            )}
          </form.AppField>

          <form.AppField name="confirmPassword">
            {(field) => (
              <field.ControlledInput
                label="Confirm New Password"
                type="password"
                placeholder="Confirm new password"
              />
            )}
          </form.AppField>
        </div>
        <form.SubmitButton label="Change Password" submitLabel="Changing Password..." />
      </form.Root>
    </form.AppForm>
  );
}
