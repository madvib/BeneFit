import type { Meta, StoryObj } from '@storybook/react';
import { FitnessGoalsForm } from './_components/fitness-goals-form';

const meta: Meta = {
  title: 'Features/Account/Settings',
  parameters: {
    layout: 'centered',
  },
};

export default meta;

export const FitnessGoals: StoryObj<typeof FitnessGoalsForm> = {
  render: () => (
    <div className="bg-background w-[600px] rounded-xl border p-6">
      <FitnessGoalsForm
        initialPrimary="strength"
        initialSecondary={['consistency', 'recovery']}
        onSave={async (val) => {
          await new Promise((r) => setTimeout(r, 1000));
          alert(JSON.stringify(val, null, 2));
        }}
        isLoading={false}
      />
    </div>
  ),
};

export const FitnessGoalsLoading: StoryObj<typeof FitnessGoalsForm> = {
  render: () => (
    <div className="bg-background w-[600px] rounded-xl border p-6">
      <FitnessGoalsForm
        initialPrimary="strength"
        initialSecondary={[]}
        onSave={async () => {}}
        isLoading={true}
      />
    </div>
  ),
};

// Consolidated Forms
import { AccountSettingsForm } from './_components/account-settings-form';
import PrivacySettings from './_components/privacy-settings';
import NotificationPreferences from './_components/notification-preferences';
import FitnessPreferences from './_components/fitness-preferences';
import { TrainingConstraintsForm } from './_components/training-constraints-form';
import { mockUserProfile } from '@/lib/testing/fixtures';

export const AccountSettings: StoryObj<typeof AccountSettingsForm> = {
  render: () => (
    <div className="bg-background w-[600px] rounded-xl border p-6">
      <AccountSettingsForm
        initialName={mockUserProfile.displayName}
        initialEmail="user@example.com"
        onSave={async (data) => console.log(data)}
      />
    </div>
  ),
};

export const Privacy: StoryObj<typeof PrivacySettings> = {
  render: () => (
    <div className="bg-background w-[600px] rounded-xl border p-6">
      <PrivacySettings
        profileVisibility="Public"
        activitySharing={true}
        onProfileVisibilityChange={() => {}}
        onActivitySharingChange={() => {}}
      />
    </div>
  ),
};

export const Notifications: StoryObj<typeof NotificationPreferences> = {
  render: () => (
    <div className="bg-background w-[600px] rounded-xl border p-6">
      <NotificationPreferences
        emailNotifications={true}
        pushNotifications={false}
        workoutReminders={false}
        onEmailNotificationsChange={() => {}}
        onPushNotificationsChange={() => {}}
        onWorkoutRemindersChange={() => {}}
      />
    </div>
  ),
};

export const FitnessPrefs: StoryObj<typeof FitnessPreferences> = {
  render: () => (
    <div className="bg-background w-[600px] rounded-xl border p-6">
      <FitnessPreferences
        preferredUnits="imperial"
        goalFocus="motivational"
        onPreferredUnitsChange={() => {}}
        onGoalFocusChange={() => {}}
      />
    </div>
  ),
};

export const TrainingConstraints: StoryObj<typeof TrainingConstraintsForm> = {
  render: () => (
    <div className="bg-background w-[600px] rounded-xl border p-6">
      <TrainingConstraintsForm
        initialConstraints={{
          availableDays: ['Monday', 'Wednesday', 'Friday'],
          availableEquipment: ['dumbbells'],
          maxDuration: 45,
          injuries: [],
        }}
        onSave={async (val) => console.log(val)}
        isLoading={false}
      />
    </div>
  ),
};
