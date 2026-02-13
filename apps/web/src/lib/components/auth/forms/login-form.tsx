import { useSearch, Link } from '@tanstack/react-router';
import { revalidateLogic } from '@tanstack/react-form';
import { authClient, authSchemas } from '@bene/react-api-client';
import { ROUTES, MODALS } from '@/lib/constants';
import { useAuthFormSubmit } from '@/lib/hooks/use-auth-submit';
import { useAppForm, typography, OAuthButton } from '@/lib/components';

export function LoginForm() {
  const search = useSearch({ strict: false });
  const next = search?.next ?? ROUTES.USER.ACTIVITIES;
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
      await authClient().signIn.email({
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
        </div>
        <form.SubmissionError />
        <form.SubmitButton label="Sign in" submitLabel="Signing in..." className="w-full" />

        <div className="relative flex items-center py-2">
          <div className="border-border grow border-t"></div>
          <span className={`${typography.muted} mx-4 shrink`}>or</span>
          <div className="border-border grow border-t"></div>
        </div>

        <OAuthButton provider="google" />
        <div className={`${typography.muted} text-center`}>
          <Link
            search={(prev: any) => ({ ...prev, m: MODALS.RESET_PASSWORD })}
            replace
            className={`${typography.small} text-primary hover:underline`}
          >
            Forgot password?
          </Link>
        </div>
      </form.Root>
    </form.AppForm>
  );
}
