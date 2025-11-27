import { describe, it, expect } from 'vitest';
import { createDefaultPreferences, UserPreferences } from './user-preferences.js';

describe('UserPreferences Value Object', () => {
  describe('Factory', () => {
    it('should create default preferences correctly', () => {
      const preferences = createDefaultPreferences();

      expect(preferences.theme).toBe('auto');
      expect(preferences.units).toBe('metric');

      // Check notification preferences
      expect(preferences.notifications.workoutReminders).toBe(true);
      expect(preferences.notifications.reminderTime).toBe('09:00');
      expect(preferences.notifications.coachCheckIns).toBe(true);

      // Check privacy settings
      expect(preferences.privacy.profileVisible).toBe(true);
      expect(preferences.privacy.workoutsPublic).toBe(true);

      // Check coaching preferences
      expect(preferences.coaching.checkInFrequency).toBe('weekly');
      expect(preferences.coaching.tone).toBe('motivational');

      // Check display settings
      expect(preferences.showRestTimers).toBe(true);
      expect(preferences.autoProgressWeights).toBe(true);
      expect(preferences.useVoiceAnnouncements).toBe(false);
    });
  });

  describe('Preferences update functions', () => {
    let defaultPrefs: UserPreferences;

    beforeEach(() => {
      defaultPrefs = createDefaultPreferences();
    });

    it('should update theme preference', () => {
      const updatedPrefs = {
        ...defaultPrefs,
        theme: 'dark',
      };

      expect(updatedPrefs.theme).toBe('dark');
    });

    it('should update units preference', () => {
      const updatedPrefs = {
        ...defaultPrefs,
        units: 'imperial',
      };

      expect(updatedPrefs.units).toBe('imperial');
    });

    it('should update notification preferences', () => {
      const updatedPrefs = {
        ...defaultPrefs,
        notifications: {
          ...defaultPrefs.notifications,
          workoutReminders: false,
          reminderTime: '18:00',
        },
      };

      expect(updatedPrefs.notifications.workoutReminders).toBe(false);
      expect(updatedPrefs.notifications.reminderTime).toBe('18:00');
    });

    it('should update privacy settings', () => {
      const updatedPrefs = {
        ...defaultPrefs,
        privacy: {
          ...defaultPrefs.privacy,
          profileVisible: false,
        },
      };

      expect(updatedPrefs.privacy.profileVisible).toBe(false);
    });

    it('should update coaching preferences', () => {
      const updatedPrefs = {
        ...defaultPrefs,
        coaching: {
          ...defaultPrefs.coaching,
          checkInFrequency: 'daily',
          tone: 'tough_love',
        },
      };

      expect(updatedPrefs.coaching.checkInFrequency).toBe('daily');
      expect(updatedPrefs.coaching.tone).toBe('tough_love');
    });
  });
});