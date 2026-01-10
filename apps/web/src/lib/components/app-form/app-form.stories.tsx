import type { Meta, StoryObj } from '@storybook/react';
import { z } from 'zod';
import { useAppForm } from './app-form';

const userSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.email('Invalid email address'),
});

const AppFormWrapper = () => {
  const form = useAppForm({
    defaultValues: {
      username: '',
      email: '',
    },
    validators: {
      onSubmit: userSchema,
    },
    onSubmit: async ({ value }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert(JSON.stringify(value, null, 2));
    },
  });

  return (
    <div className="w-96 rounded-lg border p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold">User Registration</h3>
      <form.AppForm>
        <form.Root>
          <div className="space-y-4">
            <form.AppField name="username">
              {(field) => (
                <div>
                  <label className="mb-1 block text-sm font-medium">Username</label>
                  <input
                    type="text"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="johndoe"
                    className="w-full rounded-md border px-3 py-2"
                  />
                  <p className="text-muted-foreground mt-1 text-xs">Public display name</p>
                  {field.state.meta.errors && (
                    <p className="mt-1 text-xs text-red-500">
                      {field.state.meta.errors.join(', ')}
                    </p>
                  )}
                </div>
              )}
            </form.AppField>

            <form.AppField name="email">
              {(field) => (
                <div>
                  <label className="mb-1 block text-sm font-medium">Email Address</label>
                  <input
                    type="email"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.currentTarget.value)}
                    placeholder="john@example.com"
                    className="w-full rounded-md border px-3 py-2"
                  />
                  {field.state.meta.errors && (
                    <p className="mt-1 text-xs text-red-500">
                      {field.state.meta.errors.join(', ')}
                    </p>
                  )}
                </div>
              )}
            </form.AppField>

            <form.SubmitButton label="Register" />
          </div>
        </form.Root>
      </form.AppForm>
    </div>
  );
};

const meta: Meta = {
  title: 'Components/AppForm',
  parameters: {
    layout: 'centered',
  },
};

export default meta;

export const Default: StoryObj = {
  render: () => <AppFormWrapper />,
};
