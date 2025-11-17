'use client';

import { useActionState } from 'react';
import { AuthError } from './auth-error/auth-error';
import { resetPasswordAction } from '@/controllers/auth/auth-actions';
import { AuthSubmitButton, EmailInput } from './auth-inputs';

export function PasswordResetForm() {
  const [state, formAction] = useActionState(resetPasswordAction, {});

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && <AuthError message={state.error} />}
      {state?.message && (
        <div className="bg-success/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-success">
          <p>{state.message}</p>
        </div>
      )}
      {!state?.message && (
        <>
          <EmailInput />
          <AuthSubmitButton pendingText={'Sending...'}>
            Send Password Reset Email
          </AuthSubmitButton>
        </>
      )}
    </form>
  );
}
