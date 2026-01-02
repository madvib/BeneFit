'use client';

import { useState } from 'react';
import { authClient } from '@bene/react-api-client';
import { Button, FormSuccessMessage } from '@/lib/components';
import { useAppForm } from '@/lib/components/app-form';
import { useAuthFormSubmit } from '@/lib/hooks/use-auth-submit';

interface PersonalInfoFormProps {
  initialData?: {
    name: string;
    email: string;
    emailVerified: boolean;
  };
}

export default function PersonalInfoForm({ initialData }: PersonalInfoFormProps) {
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
    <div className="space-y-6">
      {/* Name Form */}
      <nameForm.AppForm>
        <nameForm.Root title="Update Name">
          <nameForm.SubmissionError />
          <FormSuccessMessage message={nameAuthSubmit.success} />

          <nameForm.AppField
            name="name"
            children={(field) => (
              <field.ControlledInput label="Full Name" type="text" placeholder="John Doe" />
            )}
          />

          <nameForm.SubmitButton label="Update Name" submitLabel="Saving..." />
        </nameForm.Root>
      </nameForm.AppForm>

      {/* Email Form */}
      <emailForm.AppForm>
        <emailForm.Root title="Update Email">
          <emailForm.SubmissionError />
          <FormSuccessMessage message={emailAuthSubmit.success} />

          {emailVerified ? (
            <>
              <emailForm.AppField
                name="email"
                children={(field) => (
                  <field.ControlledInput
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                  />
                )}
              />

              <emailForm.SubmitButton label="Update Email" submitLabel="Saving..." />
            </>
          ) : (
            <div className="space-y-3 rounded-md border border-yellow-200 bg-yellow-50 p-4">
              <p className="text-sm text-yellow-800">
                Your email must be verified before it can be changed.
              </p>

              <Button
                type="button"
                variant="secondary"
                onClick={async () => {
                  setIsVerifying(true);
                  try {
                    const { error } = await authClient.sendVerificationEmail({
                      email,
                      callbackURL: '/email-confirmed',
                    });

                    if (!error) {
                      setVerifySuccess(true);
                      setTimeout(() => setVerifySuccess(false), 3000);
                    }
                  } finally {
                    setIsVerifying(false);
                  }
                }}
                disabled={isVerifying}
              >
                {isVerifying ? 'Sending…' : 'Send Verification Email'}
              </Button>

              {verifySuccess && (
                <p className="text-sm text-green-600">Verification email sent successfully!</p>
              )}
            </div>
          )}
        </emailForm.Root>
      </emailForm.AppForm>
    </div>
  );
}
