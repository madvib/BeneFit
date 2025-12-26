'use client';

import { LoadingSpinner, ErrorPage } from '@/components';
import Spacer from '@/components/common/ui-primitives/spacer/spacer';
import {
  PrivacySettings,
  FitnessPreferences,
  SaveSettingsButton,
} from '@/components/user/settings';
import { useSettingsController } from '@/controllers';
import { PageHeader } from '@/components/user/account/shared/page-header';

export default function SettingsClient() {
  const {
    settings,
    isLoading,
    error,
    handleSaveSettings,
    updatePrivacySettings,
    updateFitnessPreferences,
  } = useSettingsController();

  if (isLoading) {
    return <LoadingSpinner text="Loading settings..." variant="screen" />;
  }

  if (error || !settings) {
    return (
      <ErrorPage
        title="Settings Loading Error"
        message={
          error ? 'Unable to load your settings.' : 'Failed to load settings data.'
        }
        error={error || 'Failed to load settings'}
        backHref="/"
      />
    );
  }

  return (
    <div>
      <PageHeader
        title="Preferences"
        description="Manage your notification, privacy, and fitness settings"
      />
      <Spacer />

      <PrivacySettings
        profileVisibility={settings.privacySettings.profileVisibility}
        activitySharing={settings.privacySettings.activitySharing}
        onProfileVisibilityChange={(value) =>
          updatePrivacySettings({ profileVisibility: value })
        }
        onActivitySharingChange={(checked) =>
          updatePrivacySettings({ activitySharing: checked })
        }
      />
      <Spacer />

      <FitnessPreferences
        preferredUnits={settings.fitnessPreferences.preferredUnits}
        goalFocus={settings.fitnessPreferences.goalFocus}
        onPreferredUnitsChange={(value) =>
          updateFitnessPreferences({ preferredUnits: value })
        }
        onGoalFocusChange={(value) => updateFitnessPreferences({ goalFocus: value })}
      />
      <Spacer />

      <SaveSettingsButton onClick={handleSaveSettings} disabled={isLoading} />
    </div>
  );
}
