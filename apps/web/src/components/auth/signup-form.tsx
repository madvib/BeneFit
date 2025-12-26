'use client';

import { useForm } from '@tanstack/react-form';
import { getAuthClient, authSchemas } from '@bene/react-api-client';
import { useRouter } from 'next/navigation';
import { AuthError } from './auth-error/auth-error';
import { OAuthButton } from './oauth-button';
import { Button, Card, ControlledInput } from '../common';
import Link from 'next/link';

export function SignupForm({ isModal = false }) {
  const authClient = getAuthClient();
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      name: '',
      surname: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validators: {
      onChange: authSchemas.SignUpSchema,
    },
    onSubmit: async ({ value }) => {
      const fullName = `${value.name} ${value.surname}`;
      const { error } = await authClient.signUp.email({
        email: value.email,
        password: value.password,
        name: fullName,
      });

      if (error) {
        form.setErrorMap({
          onSubmit: { fields: { confirmPassword: error.message } },
        });
      } else {
        if (isModal) {
          router.back();
        } else {
          router.push('/user/activities');
        }
      }
    },
  });

  return (
    <Card variant={'borderless'}>
      <div className="mb-6">
        <h2 className="text-foreground text-2xl font-bold">Create your account</h2>
        <p className="text-muted-foreground mt-2">
          Join thousands of users achieving their goals
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation(); // Prevent propagation to parent forms
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <form.Field
            name="name"
            validators={{
              onChange: authSchemas.SignUpSchema.shape.name,
            }}
          >
            {(field) => (
              <ControlledInput
                field={field}
                label="First Name"
                type="text"
                placeholder="John"
              />
            )}
          </form.Field>

          <form.Field
            name="surname"
            validators={{
              onChange: authSchemas.SignUpSchema.shape.surname,
            }}
          >
            {(field) => (
              <ControlledInput
                field={field}
                label="Last Name"
                type="text"
                placeholder="Doe"
              />
            )}
          </form.Field>
        </div>

        <form.Field
          name="email"
          validators={{
            onChange: authSchemas.SignUpSchema.shape.email,
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
            onChange: authSchemas.SignUpSchema.shape.password,
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

        <form.Field
          name="confirmPassword"
          validators={{
            onChange: authSchemas.SignUpSchema.shape.confirmPassword,
          }}
        >
          {(field) => (
            <ControlledInput
              field={field}
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
            />
          )}
        </form.Field>

        {form.state.errorMap.onSubmit && (
          <AuthError message={form.state.errorMap.onSubmit} />
        )}

        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit}>
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </Button>
          )}
        </form.Subscribe>

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
