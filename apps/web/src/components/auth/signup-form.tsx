'use client';

import { useActionState, useEffect, useEffectEvent } from 'react';
import { AuthError } from './auth-error/auth-error';
import { signupAction } from '@/controllers/auth/auth-actions';
import { AuthSubmitButton, EmailInput, PasswordInput } from './auth-inputs';
import { OAuthButton } from './oauth-button';
import { useSession } from '@/controllers';
import { useRouter } from 'next/navigation';
import { Card, FormField, Input } from '@/components';
import Link from 'next/link';

export function SignupForm({ isModal = false }) {
  const [state, formAction] = useActionState(signupAction, {});
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
        <h2 className="text-foreground text-2xl font-bold">Create your account</h2>
        <p className="text-muted-foreground mt-2">
          Join thousands of users achieving their goals
        </p>
      </div>

      <form action={formAction} className="space-y-4">
        {state?.error && <AuthError message={state.error} />}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField label="First Name">
            <Input
              type="text"
              id="name"
              name="name"
              placeholder="John"
              required
              aria-describedby="name-error"
            />
          </FormField>
          <FormField label="Last Name">
            <Input
              type="text"
              id="surname"
              name="surname"
              placeholder="Doe"
              required
              aria-describedby="surname-error"
            />
          </FormField>
        </div>
        <EmailInput />
        <PasswordInput />
        <PasswordInput label="Confirm Password" name="confirmPassword" />
        <AuthSubmitButton pendingText="Creating account...">
          Create Account
        </AuthSubmitButton>

        <div className="relative flex items-center">
          <div className="text-text-muted grow border-t"></div>
          <span className="text-text-muted mx-4 shrink">or</span>
          <div className="text-text-muted grow border-t"></div>
        </div>

        <OAuthButton provider="google" />
      </form>
      <div className="text-muted-foreground mt-6 text-center text-sm">
        Already have an account?{' '}
        <Link href="/login" className="text-primary font-medium hover:underline">
          Log in
        </Link>
      </div>
    </Card>
  );
}
