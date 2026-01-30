import { useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { getAuthErrorContext, getAuthErrorMessage, type AuthError } from '@bene/react-api-client';
import { ROUTES } from '@/lib/constants/routes';
import { useFormSubmitFeedback } from './use-form-submit-feedback';
import { AnyFormApi } from '@tanstack/react-form';
import { SubmitErrorResolution } from '../components';


export function useAuthFormSubmit({ formApi }: { formApi: AnyFormApi }) {
  const navigate = useNavigate();
  const feedback = useFormSubmitFeedback(formApi);

  const onAuthError = useCallback(
    (err: unknown) => {
      const authError = err as AuthError;
      const code = authError.code || 'UNKNOWN_ERROR';
      const message = getAuthErrorMessage(code) || authError.message || 'Something went wrong';
      const context = getAuthErrorContext(code);

      // Build resolution from context
      const resolutions: SubmitErrorResolution[] = [];

      if (context.showSignupLink) {
        resolutions.push({
          message: "Don't have an account?",
          actions: [{ label: 'Sign up here', action: () => navigate({ to: ROUTES.AUTH.SIGNUP }) }],
        });
      }

      if (context.showLoginLink) {
        resolutions.push({
          message: 'Already have an account?',
          actions: [{ label: 'Log in here', action: () => navigate({ to: ROUTES.AUTH.LOGIN }) }],
        });
      }

      if (context.showPasswordResetLink) {
        resolutions.push({
          message: 'Forgot your password?',
          actions: [
            {
              label: 'Reset your password',
              action: () => navigate({ to: ROUTES.AUTH.PASSWORD_RESET }),
            },
          ],
        });
      }

      // write error to form
      feedback.submitError({ message, resolutions });

      // auth side effects
      if (context.requiresEmailVerification) {
        navigate({ to: ROUTES.AUTH.CONFIRM_EMAIL, replace: true });
      } else if (context.requiresReauth) {
        navigate({ to: ROUTES.AUTH.LOGIN, replace: true });
      }
    },
    [feedback, navigate],
  );

  const onAuthSuccess = useCallback(
    (options?: { message?: string; redirectTo?: string }) => {
      feedback.submitSuccess(options?.message);

      if (options?.redirectTo) {
        navigate({ to: options.redirectTo, replace: true });
      }
    },
    [feedback, navigate],
  );

  return {
    success: feedback.success,
    onAuthError,
    onAuthSuccess,
  };
}