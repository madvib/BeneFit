
import { describe, it, expect, beforeEach } from 'vitest';
import { CreateUserPreferencesSchema } from '../user-preferences.factory.js';
import { createUserPreferencesFixture } from '@/fixtures.js';
import { UserPreferences } from '../user-preferences.types.js';

describe('UserPreferences Value Object', () => {
  describe('Factory', () => {
    it('should create default preferences correctly', () => {
      // Act
      const result = CreateUserPreferencesSchema.safeParse({});

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        const preferences = result.data;
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
      }
    });

    it('should allow partial creation (overrides)', () => {
      // Act
      const result = CreateUserPreferencesSchema.safeParse({
        theme: 'dark',
        units: 'imperial',
      });

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        const preferences = result.data;
        expect(preferences.theme).toBe('dark');
        expect(preferences.units).toBe('imperial');
        // Defaults preserved
        expect(preferences.showRestTimers).toBe(true);
      }
    });

    it('should allow partial nested updates', () => {
      // Act
      const result = CreateUserPreferencesSchema.safeParse({
        notifications: {
          workoutReminders: false,
        },
      });

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        const preferences = result.data;
        expect(preferences.notifications.workoutReminders).toBe(false);
        // Other notifications preserved
        expect(preferences.notifications.coachCheckIns).toBe(true);
      }
    });
  });

  describe('Fixtures', () => {
    let defaultFixture: UserPreferences;

    beforeEach(() => {
      defaultFixture = createUserPreferencesFixture();
    });

    it('should create valid fixture', () => {
      expect(defaultFixture.theme).toBeDefined();
      expect(defaultFixture.notifications).toBeDefined();
    });

    it('should allow fixture overrides', () => {
      const customFixture = createUserPreferencesFixture({
        theme: 'dark'
      });
      expect(customFixture.theme).toBe('dark');
    });
  });
});
