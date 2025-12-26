'use client';

import { useForm } from '@tanstack/react-form';
import { getAuthClient, authSchemas } from '@bene/react-api-client';
import { Button, ControlledInput, FormSection } from '../../common';
import { useState, useEffect } from 'react';
import { useAccountController } from '@/controllers';

export default function PersonalInfoForm() {
  const { userProfile, isLoading, error } = useAccountController();
  const authClient = getAuthClient();
  const [success, setSuccess] = useState(false);

  const form = useForm({
    defaultValues: {
      name: userProfile?.firstName ?? '',
      surname: userProfile?.lastName ?? '',
      email: userProfile?.email ?? '',
      phone: userProfile?.phone ?? '',
    },
    validators: {
      onChange: authSchemas.PersonalInfoSchema,
    },
    onSubmit: async ({ value }) => {
      const fullName = `${value.name} ${value.surname}`;
      const { error } = await authClient.updateUser({
        name: fullName,
        // Note: Email updates usually trigger a confirmation flow in better-auth
        // and might need to be handled separately or via a specific method.
      });

      if (error) {
        form.setErrorMap({
          onSubmit: {
            form: error.message,
            fields: {},
          },
        });
      } else {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 5000);
      }
    },
  });

  // Sync form values if props change (e.g. after initial load)
  useEffect(() => {
    form.setFieldValue('name', firstName);
    form.setFieldValue('surname', lastName);
    form.setFieldValue('email', email);
    form.setFieldValue('phone', phone as string | undefined);
  }, [firstName, lastName, email, phone]);

  return (
    <FormSection title="Personal Information">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        {form.state.errorMap.onSubmit && (
          <p className="text-sm text-red-500">
            {form.state.errorMap.onSubmit as string}
          </p>
        )}

        {success && (
          <div className="bg-success/15 text-success flex items-center gap-x-2 rounded-md p-3 text-sm">
            <p>Personal information updated successfully!</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <form.Field
            name="name"
            validators={{
              onChange: authSchemas.PersonalInfoSchema.shape.name,
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
              onChange: authSchemas.PersonalInfoSchema.shape.surname,
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

          <form.Field
            name="email"
            validators={{
              onChange: authSchemas.PersonalInfoSchema.shape.email,
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
            name="phone"
            validators={{
              onChange: authSchemas.PersonalInfoSchema.shape.phone,
            }}
          >
            {(field) => (
              <ControlledInput
                field={field}
                label="Phone"
                type="tel"
                placeholder="+1234567890"
              />
            )}
          </form.Field>
        </div>

        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </FormSection>
  );
}
