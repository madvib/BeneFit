'use client';

import { Card } from '@/components';

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
    <Card>
      <div className="mb-6">
        <h3 className="text-2xl font-semibold mb-4">Security</h3>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-foreground mb-2">
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                className="w-full p-2 rounded border border-muted bg-background"
                placeholder="Enter current password"
              />
            </div>
            <div>
              <label className="block text-foreground mb-2">New Password</label>
              <input
                type="password"
                name="newPassword"
                className="w-full p-2 rounded border border-muted bg-background"
                placeholder="Enter new password"
              />
            </div>
            <div>
              <label className="block text-foreground mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                className="w-full p-2 rounded border border-muted bg-background"
                placeholder="Confirm new password"
              />
            </div>
          </div>
        </form>
      </div>
    </Card>
  );
}