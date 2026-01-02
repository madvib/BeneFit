import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthErrorContext, getAuthErrorMessage } from '@bene/react-api-client';
import { ROUTES } from '@/lib/constants/routes';
import { useFormSubmitFeedback } from './use-form-submit-feedback';
import { AnyFormApi } from '@tanstack/react-form';

export function useAuthFormSubmit({ formApi }: { formApi: AnyFormApi }) {
  const router = useRouter();
  const feedback = useFormSubmitFeedback(formApi);

  const onAuthError = useCallback(
    (err: any) => {
      const code = err.body?.message || err.code || 'UNKNOWN_ERROR';
      const message = getAuthErrorMessage(code) || err.message || 'Something went wrong';
      const context = getAuthErrorContext(code);

      // Build resolution from context
      const resolutions = [];

      if (context.showSignupLink) {
        resolutions.push({
          message: "Don't have an account?",
          actions: [{ label: 'Sign up here', action: () => router.push(ROUTES.AUTH.SIGNUP) }],
        });
      }

      if (context.showLoginLink) {
        resolutions.push({
          message: 'Already have an account?',
          actions: [{ label: 'Log in here', action: () => router.push(ROUTES.AUTH.LOGIN) }],
        });
      }

      if (context.showPasswordResetLink) {
        resolutions.push({
          message: 'Forgot your password?',
          actions: [
            {
              label: 'Reset your password',
              action: () => router.push(ROUTES.AUTH.PASSWORD_RESET),
            },
          ],
        });
      }

      // write error to form
      feedback.submitError({ message, resolutions });

      // auth side effects
      if (context.requiresEmailVerification) {
        router.replace(ROUTES.AUTH.CONFIRM_EMAIL);
      } else if (context.requiresReauth) {
        router.replace(ROUTES.AUTH.LOGIN);
      }
    },
    [feedback, router],
  );

  const onAuthSuccess = useCallback(
    (options?: { message?: string; redirectTo?: string }) => {
      feedback.submitSuccess(options?.message);

      if (options?.redirectTo) {
        router.replace(options.redirectTo);
      }
    },
    [feedback, router],
  );

  return {
    success: feedback.success,
    onAuthError,
    onAuthSuccess,
  };
}
