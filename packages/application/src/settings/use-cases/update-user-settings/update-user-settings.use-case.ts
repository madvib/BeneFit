import { Result, UseCase } from '@bene/core/shared';
import { UserSettings } from '../get-user-settings/get-user-settings.use-case.js';
import { SettingsRepository } from '../../ports/settings.repository.js';
import { Settings } from '@bene/core/settings';

interface UpdateUserSettingsInput {
  userId: string;
  settings: Partial<UserSettings>;
}

interface UpdateUserSettingsOutput {
  success: boolean;
  message?: string;
}

export class UpdateUserSettingsUseCase implements UseCase<UpdateUserSettingsInput, UpdateUserSettingsOutput> {
  constructor(private settingsRepository: SettingsRepository) {}

  async execute(input: UpdateUserSettingsInput): Promise<Result<UpdateUserSettingsOutput>> {
    try {
      // Check if settings exist for this user
      const existingSettingsResult = await this.settingsRepository.findById(input.userId);

      if (existingSettingsResult.isFailure) {
        // Repository returned failure, meaning settings don't exist - create new ones
        const newSettingsResult = Settings.create({
          id: input.userId,
          userId: input.userId,
          notificationPreferences: input.settings.notificationPreferences || {
            emailNotifications: true,
            pushNotifications: true,
            workoutReminders: true,
          },
          privacySettings: input.settings.privacySettings || {
            profileVisibility: 'Public',
            activitySharing: false,
          },
          fitnessPreferences: input.settings.fitnessPreferences || {
            preferredUnits: 'Metric (kg, km)',
            goalFocus: 'General Fitness',
          },
        });

        if (newSettingsResult.isFailure) {
          return Result.fail(new Error('Failed to create settings'));
        }

        const saveResult = await this.settingsRepository.save(newSettingsResult.value);
        return saveResult.isSuccess
          ? Result.ok({ success: true, message: 'Settings created successfully' })
          : Result.fail(new Error('Failed to save settings'));
      } else if (existingSettingsResult.value) {
        // Update existing settings
        const existingSettings = existingSettingsResult.value;
        
        // Update the existing settings using the updateSettings method
        existingSettings.updateSettings(
          input.settings.notificationPreferences,
          input.settings.privacySettings,
          input.settings.fitnessPreferences
        );
        
        const saveResult = await this.settingsRepository.save(existingSettings);
        return saveResult.isSuccess
          ? Result.ok({ success: true, message: 'Settings updated successfully' })
          : Result.fail(new Error('Failed to save updated settings'));
      } else {
        // Result was successful but value was null, meaning no settings exist - create new ones
        const newSettingsResult = Settings.create({
          id: input.userId,
          userId: input.userId,
          notificationPreferences: input.settings.notificationPreferences || {
            emailNotifications: true,
            pushNotifications: true,
            workoutReminders: true,
          },
          privacySettings: input.settings.privacySettings || {
            profileVisibility: 'Public',
            activitySharing: false,
          },
          fitnessPreferences: input.settings.fitnessPreferences || {
            preferredUnits: 'Metric (kg, km)',
            goalFocus: 'General Fitness',
          },
        });

        if (newSettingsResult.isFailure) {
          return Result.fail(new Error('Failed to create settings'));
        }

        const saveResult = await this.settingsRepository.save(newSettingsResult.value);
        return saveResult.isSuccess
          ? Result.ok({ success: true, message: 'Settings created successfully' })
          : Result.fail(new Error('Failed to save settings'));
      }
    } catch (error) {
      console.error('Error updating user settings:', error);
      return Result.fail(new Error('Failed to update user settings'));
    }
  }
}