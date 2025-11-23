'use client';

import { FormSection, FormField, Input } from '@/components';

interface PersonalInfoFormProps {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  onInputChange: (field: string, value: string) => void;
}

export default function PersonalInfoForm({ firstName, lastName, email, phone, onInputChange }: PersonalInfoFormProps) {
  return (
    <FormSection title="Personal Information">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="First Name">
          <Input
            type="text"
            value={firstName || ''}
            onChange={(e) => onInputChange('firstName', e.target.value)}
          />
        </FormField>
        <FormField label="Last Name">
          <Input
            type="text"
            value={lastName || ''}
            onChange={(e) => onInputChange('lastName', e.target.value)}
          />
        </FormField>
        <FormField label="Email">
          <Input
            type="email"
            value={email || ''}
            onChange={(e) => onInputChange('email', e.target.value)}
          />
        </FormField>
        <FormField label="Phone">
          <Input
            type="tel"
            value={phone || ''}
            onChange={(e) => onInputChange('phone', e.target.value)}
          />
        </FormField>
      </div>
    </FormSection>
  );
}