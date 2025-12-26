'use client';

import { useForm } from '@tanstack/react-form';
import { getAuthClient, authSchemas } from '@bene/react-api-client';
import { useRouter } from 'next/navigation';
import { AuthError } from './auth-error/auth-error';
import { Button, ControlledInput } from '../common';
import { useState } from 'react';

interface UpdatePasswordFormProps {
  onPasswordUpdated?: () => void;
}

export function UpdatePasswordForm({ onPasswordUpdated }: UpdatePasswordFormProps) {
  const authClient = getAuthClient();
  const router = useRouter();
  const [success, setSuccess] = useState(false);

  const form = useForm({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
    validators: {
      onChange: authSchemas.UpdatePasswordSchema,
    },
    onSubmit: async ({ value }) => {
      const { error } = await authClient.resetPassword({
        newPassword: value.password,
      });

      if (error) {
        form.setErrorMap({
          onSubmit: {
            form: error.message,
            fields: { password: '', confirmPassword: '' },
          },
        });
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push('/login');
          onPasswordUpdated?.();
        }, 2000);
      }
    },
  });

  return (
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
          <p>Your password has been updated successfully!</p>
        </div>
      )}

      <form.Field
        name="password"
        validators={{
          onChange: authSchemas.UpdatePasswordSchema.shape.password,
        }}
      >
        {(field) => (
          <ControlledInput
            field={field}
            label="New Password"
            type="password"
            placeholder="••••••••"
          />
        )}
      </form.Field>

      <form.Field
        name="confirmPassword"
        validators={{
          onChange: authSchemas.UpdatePasswordSchema.shape.confirmPassword,
        }}
      >
        {(field) => (
          <ControlledInput
            field={field}
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
          />
        )}
      </form.Field>

      <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <Button disabled={!canSubmit || success}>
            {isSubmitting ? 'Updating Password...' : 'Update Password'}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
