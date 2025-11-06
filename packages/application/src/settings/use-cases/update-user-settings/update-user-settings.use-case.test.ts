import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Result } from '@bene/core/shared';
import {
  Settings,
  NotificationPreferences,
  PrivacySettings,
  FitnessPreferences,
} from '@bene/core/settings';
import { SettingsRepository } from '@bene/application/settings';
import {
  UpdateUserSettingsUseCase,
  UpdateUserSettingsInput,
} from './update-user-settings.use-case';

interface MockSettingsRepository extends SettingsRepository {
  findById: (id: string) => Promise<Result<any>>;
  save: (entity: any) => Promise<Result<void>>;
  delete: (id: string) => Promise<Result<void>>;
  exists: (id: string) => Promise<Result<boolean>>;
  update: (id: string, params: Partial<any>) => Promise<Result<void>>;
}

describe('UpdateUserSettingsUseCase', () => {
  let useCase: UpdateUserSettingsUseCase;
  let mockRepository: MockSettingsRepository;

  beforeEach(() => {
    mockRepository = {
      getUserSettings: vi.fn(),
      updateUserSettings: vi.fn(),
      findById: vi.fn(),
      save: vi.fn(),
      delete: vi.fn(),
      exists: vi.fn(),
      update: vi.fn(),
    };

    useCase = new UpdateUserSettingsUseCase(mockRepository);
  });

  describe('execute', () => {
    it('creates new settings when user has no existing settings', async () => {
      // Setup: No existing settings for the user
      (mockRepository.findById as vi.MockedFunction<any>).mockResolvedValue(
        Result.fail(new Error('Settings not found')),
      );

      const input: UpdateUserSettingsInput = {
        userId: 'user-123',
        settings: {
          notificationPreferences: {
            emailNotifications: false,
            pushNotifications: true,
            workoutReminders: true,
          },
        },
      };

      const result = await useCase.execute(input);

      expect(result.isSuccess).toBe(false);
      if (result.isSuccess) {
        expect(result.value.success).toBe(true);
        expect(result.value.message).toBe('Settings created successfully');
      }

      // Verify that save was called to create new settings
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('updates existing settings when they exist', async () => {
      // Setup: Existing settings exist
      const existingSettings = Settings.create({
        id: 'user-123',
        userId: 'user-123',
        notificationPreferences: {
          emailNotifications: true,
          pushNotifications: true,
          workoutReminders: true,
        },
        privacySettings: {
          profileVisibility: 'Public',
          activitySharing: true,
        },
        fitnessPreferences: {
          preferredUnits: 'Metric (kg, km)',
          goalFocus: 'General Fitness',
        },
      });

      if (existingSettings.isSuccess) {
        (mockRepository.findById as vi.MockedFunction<any>).mockResolvedValue(
          Result.ok(existingSettings.value),
        );

        // Mock successful save after update
        (mockRepository.save as vi.MockedFunction<any>).mockResolvedValue(
          Result.ok(undefined),
        );

        const input: UpdateUserSettingsInput = {
          userId: 'user-123',
          settings: {
            privacySettings: {
              profileVisibility: 'Private',
            },
          },
        };

        const result = await useCase.execute(input);

        expect(result.isSuccess).toBe(true);
        if (result.isSuccess) {
          expect(result.value.success).toBe(true);
          expect(result.value.message).toBe('Settings updated successfully');
        }

        // Verify that save was called after update
        expect(mockRepository.save).toHaveBeenCalled();
      }
    });

    it('handles repository save errors gracefully', async () => {
      // Setup: Repository save fails
      (mockRepository.findById as vi.MockedFunction<any>).mockResolvedValue(
        Result.fail(new Error('Settings not found')),
      );

      // Mock failing save
      (mockRepository.save as vi.MockedFunction<any>).mockResolvedValue(
        Result.fail(new Error('Save failed')),
      );

      const input: UpdateUserSettingsInput = {
        userId: 'user-123',
        settings: {
          notificationPreferences: {
            emailNotifications: false,
          },
        },
      };

      const result = await useCase.execute(input);

      expect(result.isFailure).toBe(true);
      if (result.isFailure) {
        expect(result.error?.message).toContain('Failed to save settings');
      }
    });

    it('updates only specified preferences', async () => {
      // Setup: Existing settings with full data
      const existingSettings = Settings.create({
        id: 'user-123',
        userId: 'user-123',
        notificationPreferences: {
          emailNotifications: true,
          pushNotifications: true,
          workoutReminders: true,
        },
        privacySettings: {
          profileVisibility: 'Public',
          activitySharing: true,
        },
        fitnessPreferences: {
          preferredUnits: 'Metric (kg, km)',
          goalFocus: 'General Fitness',
        },
      });

      if (existingSettings.isSuccess) {
        (mockRepository.findById as vi.MockedFunction<any>).mockResolvedValue(
          Result.ok(existingSettings.value),
        );

        (mockRepository.save as vi.MockedFunction<any>).mockResolvedValue(
          Result.ok(undefined),
        );

        const input: UpdateUserSettingsInput = {
          userId: 'user-123',
          settings: {
            privacySettings: {
              activitySharing: false, // Only update this field
            },
          },
        };

        const result = await useCase.execute(input);

        expect(result.isSuccess).toBe(true);
        if (result.isSuccess) {
          expect(result.value.success).toBe(true);
        }

        // Verify that save was called with updated settings
        expect(mockRepository.save).toHaveBeenCalledWith(
          expect.objectContaining({
            id: 'user-123',
            userId: 'user-123',
          }),
        );
      }
    });

    it('preserves all other settings when updating partially', async () => {
      // Setup: Existing settings with various values
      const existingSettings = Settings.create({
        id: 'user-123',
        userId: 'user-123',
        notificationPreferences: {
          emailNotifications: true,
          pushNotifications: true,
          workoutReminders: false,
        },
        privacySettings: {
          profileVisibility: 'Friends Only',
          activitySharing: true,
        },
        fitnessPreferences: {
          preferredUnits: 'Imperial (lbs, miles)',
          goalFocus: 'Weight Loss',
        },
      });

      if (existingSettings.isSuccess) {
        (mockRepository.findById as vi.MockedFunction<any>).mockResolvedValue(
          Result.ok(existingSettings.value),
        );

        (mockRepository.save as vi.MockedFunction<any>).mockResolvedValue(
          Result.ok(undefined),
        );

        const input: UpdateUserSettingsInput = {
          userId: 'user-123',
          settings: {
            fitnessPreferences: {
              goalFocus: 'General Fitness', // Only update this field
            },
          },
        };

        const result = await useCase.execute(input);

        expect(result.isSuccess).toBe(true);

        // Verify that save was called with settings that preserve other values
        expect(mockRepository.save).toHaveBeenCalledWith(
          expect.objectContaining({
            id: 'user-123',
            userId: 'user-123',
            // The updated field
            fitnessPreferences: expect.objectContaining({
              goalFocus: 'General Fitness',
            }),
          }),
        );
      }
    });

    it('handles complex updates with multiple preference types', async () => {
      // Setup: Existing settings
      const existingSettings = Settings.create({
        id: 'user-123',
        userId: 'user-123',
        notificationPreferences: {
          emailNotifications: true,
          pushNotifications: true,
          workoutReminders: true,
        },
        privacySettings: {
          profileVisibility: 'Public',
          activitySharing: true,
        },
        fitnessPreferences: {
          preferredUnits: 'Metric (kg, km)',
          goalFocus: 'General Fitness',
        },
      });

      if (existingSettings.isSuccess) {
        (mockRepository.findById as vi.MockedFunction<any>).mockResolvedValue(
          Result.ok(existingSettings.value),
        );

        (mockRepository.save as vi.MockedFunction<any>).mockResolvedValue(
          Result.ok(undefined),
        );

        const input: UpdateUserSettingsInput = {
          userId: 'user-123',
          settings: {
            notificationPreferences: {
              emailNotifications: false,
              pushNotifications: false,
            },
            privacySettings: {
              profileVisibility: 'Private',
              activitySharing: false,
            },
            fitnessPreferences: {
              goalFocus: 'Muscle Building',
            },
          },
        };

        const result = await useCase.execute(input);

        expect(result.isSuccess).toBe(true);
        if (result.isSuccess) {
          expect(result.value.success).toBe(true);
        }

        // Verify that save was called with all update fields applied
        expect(mockRepository.save).toHaveBeenCalledWith(
          expect.objectContaining({
            notificationPreferences: expect.objectContaining({
              emailNotifications: false,
              pushNotifications: false,
            }),
            privacySettings: expect.objectContaining({
              profileVisibility: 'Private',
              activitySharing: false,
            }),
            fitnessPreferences: expect.objectContaining({
              goalFocus: 'Muscle Building',
            }),
          }),
        );
      }
    });

    it('returns error when repository findById fails', async () => {
      // Setup: Repository findById throws an error
      (mockRepository.findById as vi.MockedFunction<any>).mockRejectedValue(
        new Error('Repository error'),
      );

      const input: UpdateUserSettingsInput = {
        userId: 'user-123',
        settings: {
          notificationPreferences: {
            emailNotifications: true,
          },
        },
      };

      const result = await useCase.execute(input);

      expect(result.isFailure).toBe(true);
      if (result.isFailure) {
        expect(result.error?.message).toContain('Failed to update user settings');
      }
    });

    it('provides success message on successful update', async () => {
      // Setup: Existing settings that will be updated
      const existingSettings = Settings.create({
        id: 'user-123',
        userId: 'user-123',
        notificationPreferences: {
          emailNotifications: true,
          pushNotifications: true,
          workoutReminders: true,
        },
        privacySettings: {
          profileVisibility: 'Public',
          activitySharing: true,
        },
        fitnessPreferences: {
          preferredUnits: 'Metric (kg, km)',
          goalFocus: 'General Fitness',
        },
      });

      if (existingSettings.isSuccess) {
        (mockRepository.findById as vi.MockedFunction<any>).mockResolvedValue(
          Result.ok(existingSettings.value),
        );

        (mockRepository.save as vi.MockedFunction<any>).mockResolvedValue(
          Result.ok(undefined),
        );

        const input: UpdateUserSettingsInput = {
          userId: 'user-123',
          settings: {
            notificationPreferences: {
              workoutReminders: false,
            },
          },
        };

        const result = await useCase.execute(input);

        expect(result.isSuccess).toBe(true);
        if (result.isSuccess) {
          expect(result.value.success).toBe(true);
          expect(result.value.message).toBe('Settings updated successfully');
        }
      }
    });
  });
});
