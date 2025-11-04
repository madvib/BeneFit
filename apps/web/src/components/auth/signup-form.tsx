'use client';

import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';
import { AuthError } from './auth-error/auth-error';
import { signupAction } from '@/app/(auth)/actions';

// Define form state type
type FormState = {
  message?: string;
  error?: string;
};

async function signupWrapper(
  previousState: FormState | undefined,
  formData: FormData,
): Promise<FormState> {
  try {
    await signupAction(formData);
    return { message: 'Signup successful' };
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error
          ? error.message
          : 'An unknown error occurred during signup',
    };
  }
}

// Submit button component that shows loading state
function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <button
      className="w-full btn btn-primary"
      type="submit"
      aria-disabled={pending}
    >
      {pending ? 'Creating account...' : children}
    </button>
  );
}

export function SignupForm() {
  const [state, formAction] = useActionState<FormState, FormData>(
    signupWrapper,
    {
      message: '',
    },
  );

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && <AuthError message={state.error} />}
      <div className="mb-4">
        <label className="block text-secondary-foreground mb-2" htmlFor="email">
          Email Address
        </label>
        <input
          className="w-full px-3 py-2 border rounded-md bg-background text-foreground border-muted"
          type="email"
          id="email"
          name="email"
          placeholder="you@example.com"
          required
          aria-describedby="email-error"
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-secondary-foreground mb-2"
          htmlFor="password"
        >
          Password
        </label>
        <input
          className="w-full px-3 py-2 border rounded-md bg-background text-foreground border-muted"
          type="password"
          id="password"
          name="password"
          placeholder="••••••••"
          required
          minLength={6}
          aria-describedby="password-error"
        />
      </div>
      <SubmitButton>Create Account</SubmitButton>
    </form>
  );
}
