'use client';

import { useActionState, useEffect } from 'react';
import { AuthError } from './auth-error/auth-error';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginAction, LoginFormState } from '@/controllers/auth/auth-actions';
import { AuthSubmitButton, EmailInput, PasswordInput } from './auth-inputs';
import { OAuthButton } from './oauth-button';
import { useSession } from '@/controllers';

// Auth form component that handles errors and loading states
export function LoginForm({ isModal = false }) {
  const searchParameters = useSearchParams();
  const next = searchParameters.get('next') || '/feed';
  const [state, formAction] = useActionState<LoginFormState, FormData>(loginAction, {
    success: false,
  });
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
      <input type="hidden" name="next" value={next} />
      <EmailInput />
      <PasswordInput />
      <div className="text-right">
        <a href="/password-reset" className="text-sm text-primary hover:underline">
          Forgot password?
        </a>
      </div>
      <AuthSubmitButton pendingText="Signing in...">Sign in</AuthSubmitButton>

      <div className="relative flex items-center">
        <div className="flex-grow border-t text-secondary-foreground"></div>
        <span className="flex-shrink mx-4 text-secondary-foreground">or</span>
        <div className="flex-grow border-t text-secondary-foreground"></div>
      </div>

      <OAuthButton provider="google" />
    </form>
  );
}
