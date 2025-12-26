'use client';

import { profile } from '@bene/react-api-client';
import { useCallback, useEffect, useState } from 'react';
import type {
  NotificationPreferences,
  PrivacySettings,
  CoachPreferences,
} from '@bene/training-core';

// Define the SettingsData interface based on UserPreferences structure
interface SettingsData {
  theme: 'light' | 'dark' | 'auto';
  units: 'metric' | 'imperial';
  notifications: NotificationPreferences;
  privacy: PrivacySettings;
  coaching: CoachPreferences;
  showRestTimers: boolean;
  autoProgressWeights: boolean;
  useVoiceAnnouncements: boolean;
}

interface UseSettingsControllerResult {
  settings: SettingsData | null;
  isLoading: boolean;
  error: Error | null;
  fetchSettings: () => Promise<void>;
  updateSettings: (settings: Partial<SettingsData>) => Promise<void>;
  handleSaveSettings: () => Promise<void>;
  updateNotificationPreferences: (prefs: Partial<NotificationPreferences>) => void;
  updatePrivacySettings: (prefs: Partial<PrivacySettings>) => void;
  updateCoachingPreferences: (prefs: Partial<CoachPreferences>) => void;
}

export function useSettingsController(): UseSettingsControllerResult {
  // Use the API client hooks
  const profileQuery = profile.useProfile();
  const updatePreferencesMutation = profile.useUpdatePreferences();

  const [tempSettings, setTempSettings] = useState<Partial<SettingsData> | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const fetchSettings = useCallback(async () => {
    if (profileQuery.error) {
      await profileQuery.refetch();
    }
  }, [profileQuery]);

  const updateSettingsFunc = useCallback((newSettings: Partial<SettingsData>) => {
    setError(null);
    setTempSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const handleSaveSettings = useCallback(async () => {
    if (!tempSettings) return;

    try {
      // Prepare the preferences object for the API
      const preferencesData = {
        // Map the temporary settings to the expected API structure
        theme: tempSettings.theme,
        units: tempSettings.units,
        notifications: tempSettings.notifications,
        privacy: tempSettings.privacy,
        coaching: tempSettings.coaching,
        showRestTimers: tempSettings.showRestTimers,
        autoProgressWeights: tempSettings.autoProgressWeights,
        useVoiceAnnouncements: tempSettings.useVoiceAnnouncements,
      };

      await updatePreferencesMutation.mutateAsync(preferencesData as any);

      // The mutation will trigger a refetch of the profile due to invalidation
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to save settings');
      setError(error);
      console.error('Error saving settings:', error);
    }
  }, [tempSettings, updatePreferencesMutation]);

  const updateNotificationPreferences = useCallback(
    (prefs: Partial<NotificationPreferences>) => {
      setTempSettings((prev) => ({
        ...prev,
        notifications: {
          workoutReminders: false,
          coachCheckIns: false,
          teamActivity: false,
          weeklyReports: false,
          achievementAlerts: false,
          pushEnabled: false,
          emailEnabled: false,
          ...prev?.notifications,
          ...prefs,
        },
      }));
    },
    [],
  );

  const updatePrivacySettings = useCallback((prefs: Partial<PrivacySettings>) => {
    setTempSettings((prev) => ({
      ...prev,
      privacy: {
        profileVisible: false,
        workoutsPublic: false,
        allowTeamInvites: false,
        showRealName: false,
        shareProgress: false,
        ...prev?.privacy,
        ...prefs,
      },
    }));
  }, []);

  const updateCoachingPreferences = useCallback((prefs: Partial<CoachPreferences>) => {
    setTempSettings((prev) => ({
      ...prev,
      coaching: {
        checkInFrequency: 'weekly',
        tone: 'motivational',
        proactiveAdvice: false,
        celebrateWins: false,
        receiveFormTips: false,
        ...prev?.coaching,
        ...prefs,
      },
    }));
  }, []);

  // Initialize temp settings when profile data is available
  useEffect(() => {
    if (profileQuery.data && !tempSettings) {
      const profileData = profileQuery.data;
      if (profileData?.preferences) {
        setTempSettings({
          theme: profileData.preferences.theme,
          units: profileData.preferences.units,
          notifications: profileData.preferences.notifications,
          privacy: profileData.preferences.privacy,
          coaching: profileData.preferences.coaching,
          showRestTimers: profileData.preferences.showRestTimers,
          autoProgressWeights: profileData.preferences.autoProgressWeights,
          useVoiceAnnouncements: profileData.preferences.useVoiceAnnouncements,
        });
      }
    }
  }, [profileQuery.data, tempSettings]);

  return {
    settings: profileQuery.data?.preferences || null,
    isLoading: profileQuery.isLoading || updatePreferencesMutation.isPending,
    error: profileQuery.error || updatePreferencesMutation.error || error,
    fetchSettings,
    updateSettings: updateSettingsFunc,
    handleSaveSettings,
    updateNotificationPreferences,
    updatePrivacySettings,
    updateCoachingPreferences,
  };
}
