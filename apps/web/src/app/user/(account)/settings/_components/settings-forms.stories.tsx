import type { Meta, StoryObj } from '@storybook/react';
import { FitnessGoalsForm } from './fitness-goals-form';
import { AccountSettingsForm } from './account-settings-form';
import { PrivacySettings } from './privacy-settings';
import { NotificationPreferences } from './notification-preferences';
import { FitnessPreferences } from './fitness-preferences';

const meta: Meta = {
  title: 'Pages/Account/SettingsForms',
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-2xl p-4">
        <div className="bg-card rounded-xl border p-6 shadow-sm">
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;

export const AccountSettings: StoryObj<typeof AccountSettingsForm> = {
  render: () => (
    <AccountSettingsForm
      initialData={{
        name: 'John Doe',
        handle: '@johndoe',
        email: 'john@example.com',
      }}
      onSave={async (data) => {
        console.log('Account settings saved:', data);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }}
    />
  ),
};

export const FitnessGoals: StoryObj<typeof FitnessGoalsForm> = {
  render: () => (
    <FitnessGoalsForm
      initialPrimary="strength"
      initialSecondary={['consistency', 'mobility']}
      onSave={async (data) => {
        console.log('Goals saved:', data);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }}
    />
  ),
};

export const Privacy: StoryObj<typeof PrivacySettings> = {
  render: () => (
    <PrivacySettings
      initialSettings={{
        profileVisibility: 'public',
        activityVisibility: 'friends',
      }}
      onSave={async (data) => {
        console.log('Privacy saved:', data);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }}
    />
  ),
};

export const Notifications: StoryObj<typeof NotificationPreferences> = {
  render: () => (
    <NotificationPreferences
      initialPreferences={{
        emailUpdates: true,
        pushNotifications: false,
        marketingEmails: false,
      }}
      onSave={async (data) => {
        console.log('Notifications saved:', data);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }}
    />
  ),
};

export const FitnessPrefs: StoryObj<typeof FitnessPreferences> = {
  render: () => (
    <FitnessPreferences
      initialPreferences={{
        measurementSystem: 'imperial',
        weeklyWorkoutDays: 4,
      }}
      onSave={async (data) => {
        console.log('Fitness preferences saved:', data);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }}
    />
  ),
};
