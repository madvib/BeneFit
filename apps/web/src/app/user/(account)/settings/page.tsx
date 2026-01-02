'use client';

import { useState, useEffect } from 'react';
import { profile } from '@bene/react-api-client';
import { LoadingSpinner, ErrorPage, Spacer } from '@/lib/components';
import { PageHeader } from '../#shared/page-header';
import { PrivacySettings, FitnessPreferences, SaveSettingsButton } from './#components';
import { ROUTES } from '@/lib/constants';

export default function SettingsClient() {
  const profileQuery = profile.useProfile();
  const updatePreferencesMutation = profile.useUpdatePreferences();

  const settings = profileQuery.data?.preferences;
  const isLoading = profileQuery.isLoading || updatePreferencesMutation.isPending;
  const error = profileQuery.error || updatePreferencesMutation.error;

  const [localSettings, setLocalSettings] = useState<any>(null);

  useEffect(() => {
    if (settings && !localSettings) {
      setLocalSettings(settings);
    }
  }, [settings, localSettings]);

  const handleSaveSettings = async () => {
    if (localSettings) {
      await updatePreferencesMutation.mutateAsync(localSettings);
    }
  };

  const updatePrivacySettings = (updates: any) => {
    setLocalSettings((prev: any) => ({
      ...prev,
      privacy: { ...prev?.privacy, ...updates },
    }));
  };

  const updateFitnessPreferences = (updates: any) => {
    setLocalSettings((prev: any) => ({
      ...prev,
      units: updates.preferredUnits || prev?.units,
      coaching: { ...prev?.coaching, ...updates },
    }));
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading settings..." variant="screen" />;
  }

  if (error || !localSettings) {
    return (
      <ErrorPage
        title="Settings Loading Error"
        message={error ? 'Unable to load your settings.' : 'Failed to load settings data.'}
        error={(error as any) || 'Failed to load settings'}
        backHref={ROUTES.HOME}
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
        profileVisibility={localSettings.privacy?.profileVisible ? 'Public' : 'Private'}
        activitySharing={localSettings.privacy?.workoutsPublic || false}
        onProfileVisibilityChange={(value) =>
          updatePrivacySettings({ profileVisible: value === 'Public' })
        }
        onActivitySharingChange={(checked) => updatePrivacySettings({ workoutsPublic: checked })}
      />
      <Spacer />

      <FitnessPreferences
        preferredUnits={localSettings.units || 'metric'}
        goalFocus={localSettings.coaching?.tone || 'motivational'}
        onPreferredUnitsChange={(value) => updateFitnessPreferences({ preferredUnits: value })}
        onGoalFocusChange={(value) => updateFitnessPreferences({ tone: value })}
      />
      <Spacer />

      <SaveSettingsButton onClick={handleSaveSettings} disabled={isLoading} />
    </div>
  );
}
