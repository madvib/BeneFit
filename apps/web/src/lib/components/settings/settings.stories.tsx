import type { Meta, StoryObj } from '@storybook/react';
import { NotificationPreferences, PrivacySettings } from './index';

const meta: Meta = {
  title: 'Components/Settings',
  parameters: {
    layout: 'centered',
  },
};

export default meta;

export const NotificationSettings: StoryObj<typeof NotificationPreferences> = {
  name: 'Notification Preferences',
  render: () => (
    <div className="w-[600px] rounded-xl border bg-background p-6">
      <NotificationPreferences
        emailNotifications={true}
        pushNotifications={false}
        workoutReminders={true}
        onEmailNotificationsChange={() => {}}
        onPushNotificationsChange={() => {}}
        onWorkoutRemindersChange={() => {}}
      />
    </div>
  ),
};

export const PrivacyPrefs: StoryObj<typeof PrivacySettings> = {
  name: 'Privacy Settings',
  render: () => (
    <div className="w-[600px] rounded-xl border bg-background p-6">
      <PrivacySettings
        profileVisibility="Public"
        activitySharing={true}
        onProfileVisibilityChange={() => {}}
        onActivitySharingChange={() => {}}
      />
    </div>
  ),
};
