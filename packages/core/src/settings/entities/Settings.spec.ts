import { describe, it, expect } from 'vitest';
import { Settings } from './Settings';

describe('Settings', () => {
  describe('create', () => {
    it('should create valid Settings with required properties', () => {
      const props = {
        id: 'settings-123',
        userId: 'user-123',
        notificationPreferences: {
          emailNotifications: true,
          pushNotifications: false,
          workoutReminders: true,
        },
        privacySettings: {
          profileVisibility: 'Public' as const,
          activitySharing: true,
        },
        fitnessPreferences: {
          preferredUnits: 'Metric (kg, km)' as const,
          goalFocus: 'Weight Loss' as const,
        },
      };

      const result = Settings.create(props);

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.id).toBe('settings-123');
        expect(result.value.userId).toBe('user-123');
        expect(result.value.notificationPreferences).toEqual({
          emailNotifications: true,
          pushNotifications: false,
          workoutReminders: true,
        });
        expect(result.value.privacySettings).toEqual({
          profileVisibility: 'Public',
          activitySharing: true,
        });
        expect(result.value.fitnessPreferences).toEqual({
          preferredUnits: 'Metric (kg, km)',
          goalFocus: 'Weight Loss',
        });
        expect(result.value.createdAt).toBeInstanceOf(Date);
      }
    });
  });

  describe('getters', () => {
    it('should return correct values for all getters', () => {
      const props = {
        id: 'settings-123',
        userId: 'user-123',
        notificationPreferences: {
          emailNotifications: true,
          pushNotifications: false,
          workoutReminders: true,
        },
        privacySettings: {
          profileVisibility: 'Friends Only' as const,
          activitySharing: false,
        },
        fitnessPreferences: {
          preferredUnits: 'Imperial (lbs, miles)' as const,
          goalFocus: 'Muscle Building' as const,
        },
      };

      const settings = Settings.create(props).value;

      expect(settings.notificationPreferences).toEqual(props.notificationPreferences);
      expect(settings.privacySettings).toEqual(props.privacySettings);
      expect(settings.fitnessPreferences).toEqual(props.fitnessPreferences);
      expect(settings.userId).toBe('user-123');
      expect(settings.createdAt).toBeInstanceOf(Date);
      expect(settings.updatedAt).toBe(undefined);
    });
  });

  describe('updateSettings', () => {
    it('should update notification preferences', () => {
      const props = {
        id: 'settings-123',
        userId: 'user-123',
        notificationPreferences: {
          emailNotifications: true,
          pushNotifications: false,
          workoutReminders: true,
        },
        privacySettings: {
          profileVisibility: 'Public' as const,
          activitySharing: true,
        },
        fitnessPreferences: {
          preferredUnits: 'Metric (kg, km)' as const,
          goalFocus: 'Weight Loss' as const,
        },
      };

      const settings = Settings.create(props).value;
      const oldUpdatedAt = settings.updatedAt;

      settings.updateSettings({
        emailNotifications: false,
        workoutReminders: false,
      });

      expect(settings.notificationPreferences.emailNotifications).toBe(false);
      expect(settings.notificationPreferences.workoutReminders).toBe(false);
      expect(settings.notificationPreferences.pushNotifications).toBe(false); // unchanged

      // Check that updatedAt was updated
      expect(settings.updatedAt).not.toBe(oldUpdatedAt);
      expect(settings.updatedAt).toBeInstanceOf(Date);
    });

    it('should update privacy settings', () => {
      const props = {
        id: 'settings-123',
        userId: 'user-123',
        notificationPreferences: {
          emailNotifications: true,
          pushNotifications: false,
          workoutReminders: true,
        },
        privacySettings: {
          profileVisibility: 'Public' as const,
          activitySharing: true,
        },
        fitnessPreferences: {
          preferredUnits: 'Metric (kg, km)' as const,
          goalFocus: 'Weight Loss' as const,
        },
      };

      const settings = Settings.create(props).value;

      settings.updateSettings(
        undefined, // notificationPreferences
        { profileVisibility: 'Private' }
      );

      expect(settings.privacySettings.profileVisibility).toBe('Private');
      expect(settings.privacySettings.activitySharing).toBe(true); // unchanged
    });

    it('should update fitness preferences', () => {
      const props = {
        id: 'settings-123',
        userId: 'user-123',
        notificationPreferences: {
          emailNotifications: true,
          pushNotifications: false,
          workoutReminders: true,
        },
        privacySettings: {
          profileVisibility: 'Public' as const,
          activitySharing: true,
        },
        fitnessPreferences: {
          preferredUnits: 'Metric (kg, km)' as const,
          goalFocus: 'Weight Loss' as const,
        },
      };

      const settings = Settings.create(props).value;

      settings.updateSettings(
        undefined, // notificationPreferences
        undefined, // privacySettings
        { goalFocus: 'General Fitness' }
      );

      expect(settings.fitnessPreferences.goalFocus).toBe('General Fitness');
      expect(settings.fitnessPreferences.preferredUnits).toBe('Metric (kg, km)'); // unchanged
    });

    it('should update multiple preference types at once', () => {
      const props = {
        id: 'settings-123',
        userId: 'user-123',
        notificationPreferences: {
          emailNotifications: true,
          pushNotifications: false,
          workoutReminders: true,
        },
        privacySettings: {
          profileVisibility: 'Public' as const,
          activitySharing: true,
        },
        fitnessPreferences: {
          preferredUnits: 'Metric (kg, km)' as const,
          goalFocus: 'Weight Loss' as const,
        },
      };

      const settings = Settings.create(props).value;

      settings.updateSettings(
        { emailNotifications: false },
        { profileVisibility: 'Private' },
        { preferredUnits: 'Imperial (lbs, miles)' }
      );

      expect(settings.notificationPreferences.emailNotifications).toBe(false);
      expect(settings.privacySettings.profileVisibility).toBe('Private');
      expect(settings.fitnessPreferences.preferredUnits).toBe('Imperial (lbs, miles)');
    });

    it('should handle partial updates without errors', () => {
      const props = {
        id: 'settings-123',
        userId: 'user-123',
        notificationPreferences: {
          emailNotifications: true,
          pushNotifications: false,
          workoutReminders: true,
        },
        privacySettings: {
          profileVisibility: 'Public' as const,
          activitySharing: true,
        },
        fitnessPreferences: {
          preferredUnits: 'Metric (kg, km)' as const,
          goalFocus: 'Weight Loss' as const,
        },
      };

      const settings = Settings.create(props).value;

      // Update with only one property of each type
      settings.updateSettings(
        { pushNotifications: true },
        { activitySharing: false },
        { goalFocus: 'Muscle Building' }
      );

      expect(settings.notificationPreferences.pushNotifications).toBe(true);
      expect(settings.notificationPreferences.emailNotifications).toBe(true); // unchanged
      expect(settings.notificationPreferences.workoutReminders).toBe(true); // unchanged

      expect(settings.privacySettings.activitySharing).toBe(false);
      expect(settings.privacySettings.profileVisibility).toBe('Public'); // unchanged

      expect(settings.fitnessPreferences.goalFocus).toBe('Muscle Building');
      expect(settings.fitnessPreferences.preferredUnits).toBe('Metric (kg, km)'); // unchanged
    });
  });
});