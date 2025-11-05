import { Result, UseCase } from '@bene/core/shared';
import { SettingsRepository } from '../../ports/settings.repository.js';

import { 
  NotificationPreferences, 
  PrivacySettings, 
  FitnessPreferences 
} from '@bene/core/settings';

export interface UserSettings {
  notificationPreferences: NotificationPreferences;
  privacySettings: PrivacySettings;
  fitnessPreferences: FitnessPreferences;
}

// Output interface
export interface GetUserSettingsOutput extends UserSettings {
  userId: string;
}

export class GetUserSettingsUseCase implements UseCase<string, GetUserSettingsOutput> {
  constructor(private settingsRepository: SettingsRepository) {}

  async execute(userId: string): Promise<Result<GetUserSettingsOutput>> {
    try {
      // Fetch user settings from repository
      const settingsResult = await this.settingsRepository.findById(userId);

      if (settingsResult.isFailure || !settingsResult.value) {
        // Return default settings if user doesn't have settings saved
        return Result.ok({
          userId,
          notificationPreferences: {
            emailNotifications: true,
            pushNotifications: true,
            workoutReminders: true,
          },
          privacySettings: {
            profileVisibility: 'Public',
            activitySharing: false,
          },
          fitnessPreferences: {
            preferredUnits: 'Metric (kg, km)',
            goalFocus: 'General Fitness',
          }
        });
      }

      const settings = settingsResult.value;
      return Result.ok({
        notificationPreferences: settings.notificationPreferences,
        privacySettings: settings.privacySettings,
        fitnessPreferences: settings.fitnessPreferences,
        userId: settings.userId
      });
    } catch (error) {
      console.error('Error getting user settings:', error);
      return Result.fail(error instanceof Error ? error : new Error('Failed to get user settings'));
    }
  }
}