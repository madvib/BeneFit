'use client';

import { PageContainer } from '@/components';
import { useSettingsController } from '@/controllers/settings';
import NotificationPreferences from './notification-preferences';
import PrivacySettings from './privacy-settings';
import FitnessPreferences from './fitness-preferences';
import SaveSettingsButton from './save-settings-button';

export default function SettingsClient() {
  const {
    settings,
    isLoading,
    error,
    handleSaveSettings,
    updateNotificationPreferences,
    updatePrivacySettings,
    updateFitnessPreferences
  } = useSettingsController();

  if (isLoading) {
    return (
      <PageContainer title="Settings">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </PageContainer>
    );
  }

  if (error || !settings) {
    return (
      <PageContainer title="Settings">
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-red-500">Error: {error || 'Failed to load settings'}</div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Settings">
      <div className="bg-secondary p-6 rounded-lg shadow-md max-w-3xl">
        <NotificationPreferences
          emailNotifications={settings.notificationPreferences.emailNotifications}
          pushNotifications={settings.notificationPreferences.pushNotifications}
          workoutReminders={settings.notificationPreferences.workoutReminders}
          onEmailNotificationsChange={(checked) => updateNotificationPreferences({ emailNotifications: checked })}
          onPushNotificationsChange={(checked) => updateNotificationPreferences({ pushNotifications: checked })}
          onWorkoutRemindersChange={(checked) => updateNotificationPreferences({ workoutReminders: checked })}
        />

        <PrivacySettings
          profileVisibility={settings.privacySettings.profileVisibility}
          activitySharing={settings.privacySettings.activitySharing}
          onProfileVisibilityChange={(value) => updatePrivacySettings({ profileVisibility: value })}
          onActivitySharingChange={(checked) => updatePrivacySettings({ activitySharing: checked })}
        />

        <FitnessPreferences
          preferredUnits={settings.fitnessPreferences.preferredUnits}
          goalFocus={settings.fitnessPreferences.goalFocus}
          onPreferredUnitsChange={(value) => updateFitnessPreferences({ preferredUnits: value })}
          onGoalFocusChange={(value) => updateFitnessPreferences({ goalFocus: value })}
        />

        <SaveSettingsButton 
          onClick={handleSaveSettings}
          disabled={isLoading}
        />
      </div>
    </PageContainer>
  );
}