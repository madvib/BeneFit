'use client';

import { useState, useEffect } from 'react';
import { getUserSettings, updateUserSettings, type SettingsData } from '@/controllers/settings';

interface UseSettingsControllerResult {
  settings: SettingsData | null;
  isLoading: boolean;
  error: string | null;
  fetchSettings: () => Promise<void>;
  updateSettings: (settings: Partial<SettingsData>) => Promise<void>;
  handleSaveSettings: () => Promise<void>;
  updateNotificationPreferences: (prefs: Partial<SettingsData['notificationPreferences']>) => void;
  updatePrivacySettings: (prefs: Partial<SettingsData['privacySettings']>) => void;
  updateFitnessPreferences: (prefs: Partial<SettingsData['fitnessPreferences']>) => void;
}

export function useSettingsController(): UseSettingsControllerResult {
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tempSettings, setTempSettings] = useState<Partial<SettingsData> | null>(null);

  const fetchSettings = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getUserSettings();

      if (result.success && result.data) {
        setSettings(result.data);
        setTempSettings(result.data);
      } else {
        setError(result.error || 'Failed to fetch settings');
      }
    } catch (err) {
      setError('Failed to load settings');
      console.error('Error fetching settings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettingsFunc = async (newSettings: Partial<SettingsData>) => {
    setError(null);
    setTempSettings(prev => ({ ...prev, ...newSettings }));
  };

  const handleSaveSettings = async () => {
    if (!tempSettings) return;
    
    try {
      const result = await updateUserSettings(tempSettings);

      if (result.success) {
        setSettings(prev => prev ? { ...prev, ...tempSettings } : null);
      } else {
        setError(result.error || 'Failed to save settings');
      }
    } catch (err) {
      setError('Failed to save settings');
      console.error('Error saving settings:', err);
    }
  };

  const updateNotificationPreferences = (prefs: Partial<SettingsData['notificationPreferences']>) => {
    setTempSettings(prev => ({
      ...prev,
      notificationPreferences: {
        ...prev?.notificationPreferences,
        ...prefs
      }
    }));
  };

  const updatePrivacySettings = (prefs: Partial<SettingsData['privacySettings']>) => {
    setTempSettings(prev => ({
      ...prev,
      privacySettings: {
        ...prev?.privacySettings,
        ...prefs
      }
    }));
  };

  const updateFitnessPreferences = (prefs: Partial<SettingsData['fitnessPreferences']>) => {
    setTempSettings(prev => ({
      ...prev,
      fitnessPreferences: {
        ...prev?.fitnessPreferences,
        ...prefs
      }
    }));
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (settings) {
      setTempSettings(settings);
    }
  }, [settings]);

  return {
    settings,
    isLoading,
    error,
    fetchSettings,
    updateSettings: updateSettingsFunc,
    handleSaveSettings,
    updateNotificationPreferences,
    updatePrivacySettings,
    updateFitnessPreferences,
  };
}