'use client';

import { useActionState, useEffect } from 'react';
import { AuthError } from './auth-error/auth-error';
import { useRouter } from 'next/navigation';
import {
  UpdatePasswordFormState,
  updatePasswordAction,
} from '@/controllers/auth/auth-actions';
import { AuthSubmitButton, PasswordInput } from './auth-inputs';

interface UpdatePasswordFormProps {
  onPasswordUpdated?: () => void;
}

// Auth form component that handles errors and loading states
export function UpdatePasswordForm({ onPasswordUpdated }: UpdatePasswordFormProps) {
  const [state, formAction] = useActionState<UpdatePasswordFormState, FormData>(
    updatePasswordAction,
    {
      success: false,
    },
  );
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      // Redirect after a short delay to show success message
      setTimeout(() => {
        router.push('/login');
        onPasswordUpdated?.();
      }, 2000);
    }
  }, [state.success, router, onPasswordUpdated]);

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && <AuthError message={state.error} />}
      {state.success && (
        <div className="bg-success/15 text-success flex items-center gap-x-2 rounded-md p-3 text-sm">
          <p>Your password has been updated successfully!</p>
        </div>
      )}
      <PasswordInput label="New Password" />
      <PasswordInput label="Confirm New Password" />
      <AuthSubmitButton pendingText="Updating Password">
        Update Password
      </AuthSubmitButton>
    </form>
  );
}
