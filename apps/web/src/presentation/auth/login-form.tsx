"use client";

import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import { AuthError } from "./auth-error";
import { useSearchParams } from "next/navigation";
import { loginAction } from "@/app/(auth)/actions";

// Define form state type
type FormState = {
  message?: string;
  error?: string;
};

// Wrapper functions that catch errors and return a state object
async function loginWrapper(
  previousState: FormState | undefined,
  formData: FormData
): Promise<FormState> {
  try {
    await loginAction(formData);
    return { message: "Login successful" };
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "An unknown error occurred during login",
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
      {pending ? "Signing in..." : children}
    </button>
  );
}

// Auth form component that handles errors and loading states
export function LoginForm() {
  const searchParameters = useSearchParams();
  const next = searchParameters.get("next") || "/feed";
  const [state, formAction] = useActionState<FormState, FormData>(
    loginWrapper,
    {
      message: "",
    }
  );

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && <AuthError message={state.error} />}
      <input type="hidden" name="next" value={next} />
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
          aria-describedby="password-error"
        />
      </div>
      <div className="text-right">
        <a
          href="/password-reset"
          className="text-sm text-primary hover:underline"
        >
          Forgot password?
        </a>
      </div>
      <SubmitButton>Sign in</SubmitButton>
    </form>
  );
}
