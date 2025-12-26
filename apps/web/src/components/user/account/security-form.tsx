'use client';

import { useForm } from '@tanstack/react-form';
import { getAuthClient, authSchemas } from '@bene/react-api-client';
import { AuthError } from '../../auth/auth-error/auth-error';
import { Button, ControlledInput, FormSection } from '../../common';
import { useState } from 'react';

export default function SecurityForm() {
  const authClient = getAuthClient();
  const [success, setSuccess] = useState(false);

  const form = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validators: {
      onChange: authSchemas.ChangePasswordSchema,
    },
    onSubmit: async ({ value }) => {
      const { error } = await authClient.changePassword({
        currentPassword: value.currentPassword,
        newPassword: value.newPassword,
        revokeOtherSessions: true,
      });

      if (error) {
        form.setErrorMap({
          onSubmit: {
            form: error.message,
            fields: { currentPassword: '', newPassword: '', confirmPassword: '' },
          },
        });
      } else {
        setSuccess(true);
        form.reset();
        setTimeout(() => setSuccess(false), 5000);
      }
    },
  });

  return (
    <FormSection title="Security">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        {form.state.errorMap.onSubmit && (
          <AuthError message={form.state.errorMap.onSubmit as string} />
        )}

        {success && (
          <div className="bg-success/15 text-success flex items-center gap-x-2 rounded-md p-3 text-sm">
            <p>Password changed successfully!</p>
          </div>
        )}

        <div className="space-y-4">
          <form.Field
            name="currentPassword"
            validators={{
              onChange: authSchemas.ChangePasswordSchema.shape.currentPassword,
            }}
          >
            {(field) => (
              <ControlledInput
                field={field}
                label="Current Password"
                type="password"
                placeholder="Enter current password"
              />
            )}
          </form.Field>

          <form.Field
            name="newPassword"
            validators={{
              onChange: authSchemas.ChangePasswordSchema.shape.newPassword,
            }}
          >
            {(field) => (
              <ControlledInput
                field={field}
                label="New Password"
                type="password"
                placeholder="Enter new password"
              />
            )}
          </form.Field>

          <form.Field
            name="confirmPassword"
            validators={{
              onChange: authSchemas.ChangePasswordSchema.shape.confirmPassword,
            }}
          >
            {(field) => (
              <ControlledInput
                field={field}
                label="Confirm New Password"
                type="password"
                placeholder="Confirm new password"
              />
            )}
          </form.Field>
        </div>

        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit}>
              {isSubmitting ? 'Changing Password...' : 'Change Password'}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </FormSection>
  );
}
