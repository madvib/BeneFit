'use client';

import { useActionState, useEffect } from 'react';
import { AuthError } from './auth-error/auth-error';
import { signupAction } from '@/controllers/auth/auth-actions';
import { AuthSubmitButton, EmailInput, PasswordInput } from './auth-inputs';
import { OAuthButton } from './oauth-button';
import { useSession } from '@/controllers';
import { useRouter } from 'next/navigation';

export function SignupForm({ isModal = false }) {
  const [state, formAction] = useActionState(signupAction, {});
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (state.success) {
      session.refreshSession();
      if (isModal) router.back();
    }
  }, [state.success]);
  return (
    <form action={formAction} className="space-y-4">
      {state?.error && <AuthError message={state.error} />}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mb-4">
          <label className="block text-secondary-foreground mb-2" htmlFor="name">
            First Name
          </label>
          <input
            className="w-full px-3 py-2 border rounded-md bg-background text-foreground border-muted"
            type="text"
            id="name"
            name="name"
            placeholder="John"
            required
            aria-describedby="name-error"
          />
        </div>
        <div className="mb-4">
          <label className="block text-secondary-foreground mb-2" htmlFor="surname">
            Last Name
          </label>
          <input
            className="w-full px-3 py-2 border rounded-md bg-background text-foreground border-muted"
            type="text"
            id="surname"
            name="surname"
            placeholder="Doe"
            required
            aria-describedby="surname-error"
          />
        </div>
      </div>
      <EmailInput />
      <PasswordInput />
      <PasswordInput label="Confirm Password" name="confirmPassword" />
      <AuthSubmitButton pendingText="Creating account...">
        Create Account
      </AuthSubmitButton>

      <div className="relative flex items-center">
        <div className="flex-grow border-t text-secondary-foreground"></div>
        <span className="flex-shrink mx-4 text-secondary-foreground">or</span>
        <div className="flex-grow border-t text-secondary-foreground"></div>
      </div>

      <OAuthButton provider="google" />
    </form>
  );
}
