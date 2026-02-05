

import { Button, FormSuccessMessage, typography, useAppForm } from '@/lib/components';
import { useState } from 'react';
import { authClient } from '@bene/react-api-client';
import { useAuthFormSubmit } from '@/lib/hooks/use-auth-submit';

interface PersonalInfoFormProps {
  initialData?: {
    name: string;
    email: string;
    emailVerified: boolean;
  };
}

export function PersonalInfoForm({ initialData }: PersonalInfoFormProps) {
  const email = initialData?.email ?? '';
  const emailVerified = initialData?.emailVerified ?? false;
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifySuccess, setVerifySuccess] = useState(false);

  // ---- Name Form ----
  const nameForm = useAppForm({
    defaultValues: { name: initialData?.name ?? '' },
    onSubmit: async ({ value }) => {
      await authClient.updateUser({
        name: value.name,
        fetchOptions: {
          onError(ctx) {
            nameAuthSubmit.onAuthError(ctx.error);
          },
          onSuccess() {
            nameAuthSubmit.onAuthSuccess({ message: 'Name updated successfully!' });
          },
        },
      });
    },
  });
  const nameAuthSubmit = useAuthFormSubmit({ formApi: nameForm });

  // ---- Email Form ----
  const emailForm = useAppForm({
    defaultValues: { email },
    onSubmit: async ({ value }) => {
      await authClient.changeEmail({
        newEmail: value.email,
        fetchOptions: {
          onError(ctx) {
            emailAuthSubmit.onAuthError(ctx.error);
          },
          onSuccess() {
            emailAuthSubmit.onAuthSuccess({
              message:
                'Email updated successfully! Please check your inbox to verify the new email.',
            });
          },
        },
      });
    },
  });

  const emailAuthSubmit = useAuthFormSubmit({ formApi: emailForm });

  return (
    <div className="space-y-8">
      {/* Name Form */}
      <nameForm.AppForm>
        <nameForm.Root title="Display Name" subtitle="How you appear to others on Bene." variant="default">
          <nameForm.SubmissionError />
          <FormSuccessMessage message={nameAuthSubmit.success} />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <nameForm.AppField name="name">
              {(field) => (
                <field.ControlledInput label="Full Name" type="text" placeholder="John Doe" />
              )}
            </nameForm.AppField>
          </div>

          <div className="flex justify-end pt-4">
            <nameForm.SubmitButton label="Save Changes" submitLabel="Saving..." className="px-8" />
          </div>
        </nameForm.Root>
      </nameForm.AppForm>

      {/* Email Form */}
      <emailForm.AppForm>
        <emailForm.Root title="Email Address" subtitle="Your primary email for notifications and login." variant="default">
          <emailForm.SubmissionError />
          <FormSuccessMessage message={emailAuthSubmit.success} />

          {emailVerified ? (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <emailForm.AppField name="email">
                  {(field) => (
                    <field.ControlledInput
                      label="Email"
                      type="email"
                      placeholder="you@example.com"
                    />
                  )}
                </emailForm.AppField>
              </div>

              <div className="flex justify-end pt-4">
                <emailForm.SubmitButton label="Update Email" submitLabel="Saving..." className="px-8" />
              </div>
            </>
          ) : (
            <div className="space-y-4 rounded-xl border border-yellow-200/50 bg-yellow-50/50 p-6 dark:border-yellow-900/50 dark:bg-yellow-950/20">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full bg-yellow-100 p-1 dark:bg-yellow-900/30">
                  <span className="block h-2 w-2 rounded-full bg-yellow-600 dark:bg-yellow-500" />
                </div>
                <div className="space-y-1">
                  <p className={`${typography.p} text-yellow-800 dark:text-yellow-200 font-medium`}>
                    Email Verification Required
                  </p>
                  <p className={`${typography.muted} text-yellow-700/80 dark:text-yellow-400/80`}>
                    Your email must be verified before it can be changed to ensure account security.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={async () => {
                    setIsVerifying(true);
                    try {
                      await authClient.sendVerificationEmail({
                        email,
                        callbackURL: '/email-confirmed',
                      });
                      setVerifySuccess(true);
                      setTimeout(() => setVerifySuccess(false), 3000);
                    } finally {
                      setIsVerifying(false);
                    }
                  }}
                  disabled={isVerifying}
                  className="bg-yellow-100 hover:bg-yellow-200 text-yellow-900 border-none dark:bg-yellow-800 dark:text-yellow-100 dark:hover:bg-yellow-700"
                >
                  {isVerifying ? 'Sending…' : 'Send Verification Email'}
                </Button>

                {verifySuccess && (
                  <p className={`${typography.xs} text-green-600 font-medium animate-in fade-in slide-in-from-left-2`}>
                    Verification email sent successfully!
                  </p>
                )}
              </div>
            </div>
          )}
        </emailForm.Root>
      </emailForm.AppForm>
    </div>
  );
}
