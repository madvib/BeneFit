'use client';

import { useForm } from '@tanstack/react-form';
import { getAuthClient, authSchemas } from '@bene/react-api-client';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthError } from './auth-error/auth-error';
import { OAuthButton } from './oauth-button';
import { Button, Card, ControlledInput } from '../common';

export function LoginForm({ isModal = false }) {
  const authClient = getAuthClient();
  const router = useRouter();
  const searchParameters = useSearchParams();
  const next = searchParameters.get('next') || '/user/activities';

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onChange: authSchemas.LoginSchema,
    },
    onSubmit: async ({ value }) => {
      const { error } = await authClient.signIn.email({
        email: value.email,
        password: value.password,
      });

      if (error) {
        form.setErrorMap({
          onSubmit: {
            form: error.message,
            fields: { email: error.message, password: error.message },
          },
        });
      } else {
        isModal ? router.back() : router.push(next);
      }
    },
  });

  return (
    <Card variant={'borderless'}>
      <div className="mb-6">
        <h2 className="text-foreground text-2xl font-bold">Sign in</h2>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <form.Field
          name="email"
          validators={{
            onChange: authSchemas.LoginSchema.shape.email,
          }}
        >
          {(field) => (
            <ControlledInput
              field={field}
              label="Email"
              type="email"
              placeholder="you@example.com"
            />
          )}
        </form.Field>

        <form.Field
          name="password"
          validators={{
            onChange: authSchemas.LoginSchema.shape.password,
          }}
        >
          {(field) => (
            <ControlledInput
              field={field}
              label="Password"
              type="password"
              placeholder="••••••••"
            />
          )}
        </form.Field>

        {/* Accessing Form-Level Submission Errors */}
        {form.state.errorMap.onSubmit && (
          <AuthError message={form.state.errorMap.onSubmit as string} />
        )}

        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <Button disabled={!canSubmit}>
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </Button>
          )}
        </form.Subscribe>

        <OAuthButton provider="google" />
      </form>
    </Card>
  );
}
