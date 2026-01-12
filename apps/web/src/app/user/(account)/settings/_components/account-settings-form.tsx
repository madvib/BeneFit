'use client';

import { revalidateLogic } from '@tanstack/react-form';
import { z } from 'zod';
import { useAppForm } from '@/lib/components/app-form';
import { typography } from '@/lib/components/theme/typography';

const accountSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Invalid email address'),
});

interface AccountSettingsFormProps {
  initialName: string;
  initialEmail: string;
  onSave: (_data: { name: string; email: string }) => Promise<void>;
  isLoading?: boolean;
}

export function AccountSettingsForm({
  initialName,
  initialEmail,
  onSave,
  isLoading,
}: AccountSettingsFormProps) {
  const form = useAppForm({
    defaultValues: {
      name: initialName,
      email: initialEmail,
    },
    validators: {
      onChange: accountSchema,
    },
    validationLogic: revalidateLogic(),
    onSubmit: async ({ value }) => {
      await onSave(value);
    },
  });

  return (
    <form.AppForm>
      <form.Root title="Account Details" subtitle="Manage your personal information.">
        <div className="grid gap-6 md:grid-cols-2">
          <form.AppField name="name">
            {(field) => (
              <input
                className={`${typography.xs} border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 file:border-0 file:bg-transparent file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50`}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                disabled={isLoading}
              />
            )}
          </form.AppField>

          <form.AppField name="email">
            {(field) => (
              <input
                className={`${typography.xs} border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 file:border-0 file:bg-transparent file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50`}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                disabled={isLoading} // Typically email might need re-verification
              />
            )}
          </form.AppField>
        </div>
        <div className="flex justify-end pt-4">
          <form.SubmitButton label="Save Changes" submitLabel="Saving..." />
        </div>
      </form.Root>
    </form.AppForm>
  );
}
