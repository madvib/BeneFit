"use client";

import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import { AuthError } from "./AuthError";
import { resetPassword } from "@/app/(auth)/actions";

// Define form state type
type FormState = {
  message?: string;
  error?: string;
};

async function resetPasswordWrapper(
  prevState: FormState | undefined,
  formData: FormData,
): Promise<FormState> {
  try {
    await resetPassword(formData);
    return { message: "Password reset email sent successfully" };
  } catch (error: unknown) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "An unknown error occurred during password reset",
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
      {pending ? "Sending..." : children}
    </button>
  );
}

export function PasswordResetForm() {
  const [state, formAction] = useActionState<FormState, FormData>(
    resetPasswordWrapper,
    {
      message: "",
    },
  );

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
          <div className="mb-4">
            <label
              className="block text-secondary-foreground mb-2"
              htmlFor="email"
            >
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
          <SubmitButton>Send Password Reset Email</SubmitButton>
        </>
      )}
    </form>
  );
}
