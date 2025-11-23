'use client';

import { useActionState, useEffect, useEffectEvent } from 'react';
import { AuthError } from './auth-error/auth-error';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginAction, LoginFormState } from '@/controllers/auth/auth-actions';
import { AuthSubmitButton, EmailInput, PasswordInput } from './auth-inputs';
import { OAuthButton } from './oauth-button';
import { useSession } from '@/controllers';
import { Card } from '../common';
import Link from 'next/link';

// Auth form component that handles errors and loading states
export function LoginForm({ isModal = false }) {
  const searchParameters = useSearchParams();
  const next = searchParameters.get('next') || '/user/activity-feed';
  const [state, formAction] = useActionState<LoginFormState, FormData>(loginAction, {
    success: false,
  });
  const router = useRouter();
  const session = useSession();

  const onSuccess = useEffectEvent(() => {
    if (isModal) router.back();
    session.refreshSession();
  });
  useEffect(() => {
    if (state.success) {
      onSuccess();
    }
  }, [state.success]);

  return (
    <Card variant={'borderless'}>
      <div className="mb-6">
        <h2 className="text-foreground text-2xl font-bold">Sign in to your account</h2>
        <p className="text-muted-foreground mt-2">Enter your credentials to continue</p>
      </div>
      <form action={formAction} className="space-y-4">
        {state?.error && <AuthError message={state.error} />}
        <input type="hidden" name="next" value={next} />
        <EmailInput />
        <PasswordInput />
        <div className="text-right">
          <a href="/password-reset" className="text-primary text-sm hover:underline">
            Forgot password?
          </a>
        </div>
        <AuthSubmitButton pendingText="Signing in...">Sign in</AuthSubmitButton>

        <div className="relative flex items-center">
          <div className="text-secondary-foreground grow border-t"></div>
          <span className="text-secondary-foreground mx-4 shrink">or</span>
          <div className="text-secondary-foreground grow border-t"></div>
        </div>

        <OAuthButton provider="google" />
      </form>{' '}
      <div className="text-muted-foreground mt-6 text-center text-sm">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-primary font-medium hover:underline">
          Sign up
        </Link>
      </div>
    </Card>
  );
}
