'use client';

import { useForm } from '@tanstack/react-form';
import { getAuthClient, authSchemas } from '@bene/react-api-client';
import { AuthError } from './auth-error/auth-error';
import { Button, ControlledInput } from '../common';
import { useState } from 'react';

export function PasswordResetForm() {
  const authClient = getAuthClient();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      email: '',
    },
    validators: {
      onChange: authSchemas.PasswordResetSchema,
    },
    onSubmit: async ({ value }) => {
      const { error } = await authClient.requestPasswordReset({
        email: value.email,
        redirectTo: '/update-password',
      });

      if (error) {
        form.setErrorMap({
          onSubmit: { form: error.message, fields: { email: '' } },
        });
      } else {
        setSuccessMessage('Password reset email sent! Please check your inbox.');
      }
    },
  });

  if (successMessage) {
    return (
      <div className="bg-success/15 text-success flex items-center gap-x-2 rounded-md p-3 text-sm">
        <p>{successMessage}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      <form.Field
        name="email"
        validators={{
          onChange: authSchemas.PasswordResetSchema.shape.email,
        }}
      >
        {(field) => (
          <ControlledInput
            field={field}
            label="Email"
            type="email"
            placeholder="you@example.com"
          />
        )}
      </form.Field>

      {form.state.errorMap.onSubmit && (
        <AuthError message={form.state.errorMap.onSubmit as string} />
      )}

      <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <Button disabled={!canSubmit}>
            {isSubmitting ? 'Sending...' : 'Send Password Reset Email'}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
