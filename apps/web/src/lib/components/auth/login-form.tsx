'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { revalidateLogic } from '@tanstack/react-form';
import { authClient, authSchemas } from '@bene/react-api-client';
import { ROUTES } from '@/lib/constants';
import { useAuthFormSubmit } from '@/lib/hooks/use-auth-submit';
import { useAppForm } from '../app-form';
import { OAuthButton } from './oauth-button';

export function LoginForm({ isModal = false }) {
  const searchParameters = useSearchParams();
  const next = searchParameters.get('next') ?? ROUTES.USER.ACTIVITIES;

  const form = useAppForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onDynamic: authSchemas.LoginSchema,
    },
    validationLogic: revalidateLogic(),
    onSubmit: async ({ value }) => {
      await authClient.signIn.email({
        ...value,
        fetchOptions: {
          onError(ctx) {
            authSubmit.onAuthError(ctx.error);
          },
          onSuccess() {
            authSubmit.onAuthSuccess({
              redirectTo: next,
            });
          },
        },
      });
    },
  });
  const authSubmit = useAuthFormSubmit({ formApi: form });

  return (
    <form.AppForm>
      <form.Root title="Sign in">
        <div className="grid grid-cols-1 gap-4">
          <form.AppField
            name="email"
            children={(field) => (
              <field.ControlledInput label="Email" type="email" placeholder="you@example.com" />
            )}
          />
          <form.AppField
            name="password"
            children={(field) => (
              <field.ControlledInput label="Password" type="password" placeholder="••••••••" />
            )}
          />
        </div>
        <form.SubmissionError />
        <form.SubmitButton label="Sign in" submitLabel="Signing in..." />

        <div className="relative flex items-center py-2">
          <div className="border-border grow border-t"></div>
          <span className="text-muted-foreground mx-4 shrink text-sm">or</span>
          <div className="border-border grow border-t"></div>
        </div>

        <OAuthButton provider="google" />
        <div className="text-center text-sm">
          <Link
            href={isModal ? ROUTES.MODAL.PASSWORD_RESET : ROUTES.AUTH.PASSWORD_RESET}
            replace
            className="text-primary font-medium hover:underline"
          >
            Forgot password?
          </Link>
        </div>
      </form.Root>
    </form.AppForm>
  );
}
