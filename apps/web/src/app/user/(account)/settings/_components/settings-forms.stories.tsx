import type { Meta, StoryObj } from '@storybook/react';
import { mockFitnessGoals, mockUserProfile } from '@/lib/testing/fixtures';
import { FitnessGoalsForm } from './fitness-goals-form';
import { AccountSettingsForm } from './account-settings-form';
import PrivacySettings from './privacy-settings';
import NotificationPreferences from './notification-preferences';
import FitnessPreferences from './fitness-preferences';

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
      initialName={mockUserProfile.displayName}
      initialEmail="john@example.com"
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
      initialPrimary={mockFitnessGoals.primary}
      initialSecondary={mockFitnessGoals.secondary}
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
      profileVisibility="Public"
      activitySharing={true}
      onProfileVisibilityChange={(val) => console.log('Visibility:', val)}
      onActivitySharingChange={(val) => console.log('Sharing:', val)}
    />
  ),
};

export const Notifications: StoryObj<typeof NotificationPreferences> = {
  render: () => (
    <NotificationPreferences
      emailNotifications={true}
      pushNotifications={false}
      workoutReminders={false}
      onEmailNotificationsChange={(val) => console.log('Email:', val)}
      onPushNotificationsChange={(val) => console.log('Push:', val)}
      onWorkoutRemindersChange={(val) => console.log('Workout:', val)}
    />
  ),
};

export const FitnessPrefs: StoryObj<typeof FitnessPreferences> = {
  render: () => (
    <FitnessPreferences
      preferredUnits="imperial"
      goalFocus="motivational"
      onPreferredUnitsChange={(val) => console.log('Units:', val)}
      onGoalFocusChange={(val) => console.log('Focus:', val)}
    />
  ),
};
