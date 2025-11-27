import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Result } from '@bene/core/shared';
import { GetUserSettingsUseCase } from './get-user-settings.use-case.js';
import { SettingsRepository } from '../../index.js';

interface MockSettingsRepository extends SettingsRepository {
  getUserSettings: (userId: string) => Promise<any>;
  // Add other methods as needed
}

describe('GetUserSettingsUseCase', () => {
  let useCase: GetUserSettingsUseCase;
  let mockRepository: MockSettingsRepository;

  beforeEach(() => {
    mockRepository = {
      getUserSettings: vi.fn(),
      findById: vi.fn(),
      save: vi.fn(),
      delete: vi.fn(),
      exists: vi.fn(),
      update: vi.fn(),
    };

    useCase = new GetUserSettingsUseCase(mockRepository);
  });

  describe('execute', () => {
    it('returns default settings when no user settings exist', async () => {
      // Setup: No settings found for the user
      (mockRepository.findById as vi.MockedFunction<any>).mockResolvedValue(
        Result.fail(new Error('Not found')),
      );

      const result = await useCase.execute('user-123');

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        const settings = result.value;
        expect(settings.userId).toBe('user-123');
        // Verify default values
        expect(settings.notificationPreferences.emailNotifications).toBe(true);
        expect(settings.notificationPreferences.pushNotifications).toBe(true);
        expect(settings.notificationPreferences.workoutReminders).toBe(true);
        expect(settings.privacySettings.profileVisibility).toBe('Public');
        expect(settings.privacySettings.activitySharing).toBe(false);
        expect(settings.fitnessPreferences.preferredUnits).toBe('Metric (kg, km)');
        expect(settings.fitnessPreferences.goalFocus).toBe('General Fitness');
      }
    });

    it('returns existing user settings when they exist', async () => {
      // Setup: Settings exist for the user
      const mockSettings = {
        id: 'user-123',
        userId: 'user-123',
        notificationPreferences: {
          emailNotifications: false,
          pushNotifications: true,
          workoutReminders: false,
        },
        privacySettings: {
          profileVisibility: 'Private' as const,
          activitySharing: true,
        },
        fitnessPreferences: {
          preferredUnits: 'Imperial (lbs, miles)' as const,
          goalFocus: 'Weight Loss' as const,
        },
        createdAt: new Date(),
      };

      (mockRepository.findById as vi.MockedFunction<any>).mockResolvedValue(
        Result.ok(mockSettings),
      );

      const result = await useCase.execute('user-123');

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        const settings = result.value;
        expect(settings.userId).toBe('user-123');
        expect(settings.notificationPreferences.emailNotifications).toBe(false);
        expect(settings.notificationPreferences.pushNotifications).toBe(true);
        expect(settings.privacySettings.profileVisibility).toBe('Private');
        expect(settings.fitnessPreferences.goalFocus).toBe('Weight Loss');
      }
    });

    it('handles repository errors gracefully', async () => {
      // Setup: Repository throws an error
      (mockRepository.findById as vi.MockedFunction<any>).mockRejectedValue(
        new Error('Database connection failed'),
      );

      const result = await useCase.execute('user-123');

      expect(result.isFailure).toBe(true);
      if (result.isFailure) {
        expect(result.error?.message).toContain('Failed to get user settings');
      }
    });

    it('preserves user ID in output even when using defaults', async () => {
      // Setup: No settings found, use defaults
      (mockRepository.findById as vi.MockedFunction<any>).mockResolvedValue(
        Result.fail(new Error('Not found')),
      );

      const result = await useCase.execute('different-user-id');

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.userId).toBe('different-user-id');
      }
    });

    it('maps repository settings to output format correctly', async () => {
      // Setup: Settings exist with specific values
      const mockSettings = {
        id: 'user-456',
        userId: 'user-456',
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
          preferredUnits: 'Metric (kg, km)' as const,
          goalFocus: 'Muscle Building' as const,
        },
        createdAt: new Date(),
      };

      (mockRepository.findById as vi.MockedFunction<any>).mockResolvedValue(
        Result.ok(mockSettings),
      );

      const result = await useCase.execute('user-456');

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        const settings = result.value;
        // Verify all properties are correctly mapped
        expect(settings.notificationPreferences).toEqual(
          mockSettings.notificationPreferences,
        );
        expect(settings.privacySettings).toEqual(mockSettings.privacySettings);
        expect(settings.fitnessPreferences).toEqual(mockSettings.fitnessPreferences);
        expect(settings.userId).toBe('user-456');
      }
    });
  });
});
