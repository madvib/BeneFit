import { FormSuccessMessage, useAppForm, typography } from '@/lib/components';
import { authClient, authSchemas } from '@bene/react-api-client';
import { useAuthFormSubmit } from '@/lib/hooks/use-auth-submit';

export function SecurityForm() {
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
      await authClient().changePassword({
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
      <form.Root
        title="Security"
        subtitle="Manage your password and active sessions."
        variant="default"
      >
        <form.SubmissionError />
        <FormSuccessMessage message={authSubmit.success} />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-6">
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

          <div className="bg-muted/50 dark:bg-muted/20 flex flex-col justify-center gap-4 rounded-xl border p-6">
            <h4 className={`${typography.h4} text-primary`}>Password Requirements</h4>
            <ul className={`${typography.muted} list-inside list-disc space-y-2`}>
              <li>At least 8 characters long</li>
              <li>Must contain at least one uppercase letter</li>
              <li>Must contain at least one number</li>
              <li>Must contain at least one special character</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <form.SubmitButton label="Update Password" submitLabel="Updating..." className="px-8" />
        </div>
      </form.Root>
    </form.AppForm>
  );
}
