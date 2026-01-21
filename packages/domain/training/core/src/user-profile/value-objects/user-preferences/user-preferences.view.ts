import { UserPreferences, UserPreferencesView } from './user-preferences.types.js';

export function toUserPreferencesView(prefs: UserPreferences): UserPreferencesView {
  return {
    ...prefs,
    notifications: { ...prefs.notifications },
    privacy: { ...prefs.privacy },
    coaching: { ...prefs.coaching },
  };
}
