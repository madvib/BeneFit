'use client';

import { useFormStatus } from 'react-dom';
import { login as loginAction } from '@/app/(auth)/actions';
import { useActionState } from 'react';
import { AuthError } from './AuthError';

// Define form state type
type FormState = {
  message?: string;
  error?: string;
};

// Wrapper functions that catch errors and return a state object
async function loginWrapper(prevState: FormState | undefined, formData: FormData): Promise<FormState> {
  try {
    await loginAction(formData);
    return { message: 'Login successful' };
  } catch (error: unknown) {
    return { 
      error: error instanceof Error ? error.message : 'An unknown error occurred during login' 
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
      {pending ? 'Signing in...' : children}
    </button>
  );
}

// Auth form component that handles errors and loading states
export function LoginForm() {
  const [state, formAction] = useActionState<FormState, FormData>(loginWrapper, {
    message: '',
  });

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <AuthError message={state.error} />
      )}
      <div className="mb-4">
        <label className="block text-secondary-foreground mb-2" htmlFor="email">
          Email
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
      <div className="mb-6">
        <label className="block text-secondary-foreground mb-2" htmlFor="password">
          Password
        </label>
        <input
          className="w-full px-3 py-2 border rounded-md bg-background text-foreground border-muted"
          type="password"
          id="password"
          name="password"
          placeholder="••••••••"
          required
          aria-describedby="password-error"
        />
      </div>
      <SubmitButton>Sign in</SubmitButton>
    </form>
  );
}
