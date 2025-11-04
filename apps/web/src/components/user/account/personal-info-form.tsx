'use client';

import { Card } from '@/components';

interface PersonalInfoFormProps {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  onInputChange: (field: string, value: string) => void;
}

export default function PersonalInfoForm({ firstName, lastName, email, phone, onInputChange }: PersonalInfoFormProps) {
  return (
    <Card>
      <div className="mb-6">
        <h3 className="text-2xl font-semibold mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-foreground mb-2">First Name</label>
            <input
              type="text"
              className="w-full p-2 rounded border border-muted bg-background"
              value={firstName || ''}
              onChange={(e) => onInputChange('firstName', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-foreground mb-2">Last Name</label>
            <input
              type="text"
              className="w-full p-2 rounded border border-muted bg-background"
              value={lastName || ''}
              onChange={(e) => onInputChange('lastName', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-foreground mb-2">Email</label>
            <input
              type="email"
              className="w-full p-2 rounded border border-muted bg-background"
              value={email || ''}
              onChange={(e) => onInputChange('email', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-foreground mb-2">Phone</label>
            <input
              type="tel"
              className="w-full p-2 rounded border border-muted bg-background"
              value={phone || ''}
              onChange={(e) => onInputChange('phone', e.target.value)}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}