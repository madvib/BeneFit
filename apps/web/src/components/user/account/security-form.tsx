'use client';

import { FormSection, FormField, Input } from '@/components';

interface SecurityFormProps {
  onPasswordChange: (currentPassword: string, newPassword: string, confirmPassword: string) => Promise<void>;
}

export default function SecurityForm({ onPasswordChange }: SecurityFormProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const currentPassword = formData.get('currentPassword') as string;
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    await onPasswordChange(currentPassword, newPassword, confirmPassword);
  };

  return (
    <FormSection title="Security">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <FormField label="Current Password">
            <Input
              type="password"
              name="currentPassword"
              placeholder="Enter current password"
            />
          </FormField>
          <FormField label="New Password">
            <Input
              type="password"
              name="newPassword"
              placeholder="Enter new password"
            />
          </FormField>
          <FormField label="Confirm New Password">
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirm new password"
            />
          </FormField>
        </div>
      </form>
    </FormSection>
  );
}