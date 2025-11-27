import { UserPreferences } from './user-preferences.types.js';

// Update functions
export function updateTheme(preferences: UserPreferences, theme: 'light' | 'dark' | 'auto'): UserPreferences {
  return {
    ...preferences,
    theme
  };
}

export function updateUnits(preferences: UserPreferences, units: 'metric' | 'imperial'): UserPreferences {
  return {
    ...preferences,
    units
  };
}

export function toggleWorkoutReminders(preferences: UserPreferences, enabled: boolean): UserPreferences {
  return {
    ...preferences,
    notifications: {
      ...preferences.notifications,
      workoutReminders: enabled
    }
  };
}

export function toggleProfileVisibility(preferences: UserPreferences, visible: boolean): UserPreferences {
  return {
    ...preferences,
    privacy: {
      ...preferences.privacy,
      profileVisible: visible
    }
  };
}

export function updateCoachTone(preferences: UserPreferences, tone: 'motivational' | 'casual' | 'professional' | 'tough_love'): UserPreferences {
  return {
    ...preferences,
    coaching: {
      ...preferences.coaching,
      tone
    }
  };
}

// Query functions
export function isDarkModePreferred(preferences: UserPreferences): boolean {
  return preferences.theme === 'dark' || (preferences.theme === 'auto' && prefersDarkColorScheme());
}

function prefersDarkColorScheme(): boolean {
  // This would typically check system preferences in a real app
  return window?.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function equals(preferences: UserPreferences, other: UserPreferences): boolean {
  if (!other) return false;
  return JSON.stringify(preferences) === JSON.stringify(other);
}