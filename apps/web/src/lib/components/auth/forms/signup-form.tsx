import { FormSuccessMessage } from '@/lib/components';
import { revalidateLogic } from '@tanstack/react-form';
import { Link } from '@tanstack/react-router';
import { authClient, authSchemas } from '@bene/react-api-client';
import { ROUTES, MODALS } from '@/lib/constants';
import { useAuthFormSubmit } from '@/lib/hooks/use-auth-submit';
import { useAppForm, typography } from '@/lib/components';
import { OAuthButton } from '@/lib/components/auth/social/oauth-button';

export function SignupForm({ isModalRoute = false }) {
  const form = useAppForm({
    defaultValues: {
      name: '',
      surname: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validators: {
      onDynamic: authSchemas.SignUpSchema,
    },
    validationLogic: revalidateLogic(),
    onSubmit: async ({ value }) => {
      const fullName = `${value.name} ${value.surname}`;

      await authClient().signUp.email({
        email: value.email,
        password: value.password,
        name: fullName,
        fetchOptions: {
          onError(ctx) {
            authSubmit.onAuthError(ctx.error);
          },
          onSuccess(ctx) {
            // Check if email verification is required
            const requiresVerification = ctx.data?.user && !ctx.data.user.emailVerified;

            if (requiresVerification) {
              // Redirect to email confirmation page
              authSubmit.onAuthSuccess({
                message:
                  'Account created successfully! Please check your email to verify your account.',
                redirectTo: `/?m=${MODALS.CONFIRM_EMAIL}&email=${encodeURIComponent(value.email)}`,
              });
            } else {
              // Email verification not required or already verified
              authSubmit.onAuthSuccess({
                message: 'Account created successfully!',
                redirectTo: ROUTES.USER.ACTIVITIES,
              });
            }
          },
        },
      });
    },
  });
  const authSubmit = useAuthFormSubmit({ formApi: form });

  return (
    <form.AppForm>
      <form.Root
        title="Create your account"
        subtitle="Join thousands of users achieving their goals"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <form.AppField name="name">
            {(field) => (
              <field.ControlledInput label="First Name" type="text" placeholder="John" />
            )}
          </form.AppField>

          <form.AppField name="surname">
            {(field) => <field.ControlledInput label="Last Name" type="text" placeholder="Doe" />}
          </form.AppField>
        </div>

        <form.AppField name="email">
          {(field) => (
            <field.ControlledInput label="Email" type="email" placeholder="you@example.com" />
          )}
        </form.AppField>

        <form.AppField name="password">
          {(field) => (
            <field.ControlledInput label="Password" type="password" placeholder="••••••••" />
          )}
        </form.AppField>

        <form.AppField name="confirmPassword">
          {(field) => (
            <field.ControlledInput
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
            />
          )}
        </form.AppField>

        <form.SubmissionError />
        <FormSuccessMessage message={authSubmit.success} />

        <form.SubmitButton
          label="Create Account"
          submitLabel="Creating account..."
          className="w-full"
        />

        <div className="relative flex items-center py-2">
          <div className="border-border grow border-t"></div>
          <span className={`${typography.muted} mx-4 shrink`}>or</span>
          <div className="border-border grow border-t"></div>
        </div>

        <OAuthButton provider="google" />
        <div className={`${typography.muted} mt-6 text-center`}>
          Already have an account?{' '}
          <Link
            to={isModalRoute ? '.' : ROUTES.AUTH.LOGIN}
            search={isModalRoute ? (prev: any) => ({ ...prev, m: 'login' }) : undefined}
            className={`${typography.small} text-primary hover:underline`}
            replace
          >
            Log in
          </Link>
        </div>
      </form.Root>
    </form.AppForm>
  );
}
