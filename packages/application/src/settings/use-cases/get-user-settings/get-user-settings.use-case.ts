import { Result, UseCase } from '@bene/core/shared';

// Define the user settings interfaces
export interface NotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  workoutReminders: boolean;
}

export interface PrivacySettings {
  profileVisibility: 'Public' | 'Friends Only' | 'Private';
  activitySharing: boolean;
}

export interface FitnessPreferences {
  preferredUnits: 'Metric (kg, km)' | 'Imperial (lbs, miles)';
  goalFocus: 'Weight Loss' | 'Muscle Building' | 'General Fitness';
}

export interface UserSettings {
  notificationPreferences: NotificationPreferences;
  privacySettings: PrivacySettings;
  fitnessPreferences: FitnessPreferences;
}

// Output interface
export interface GetUserSettingsOutput extends UserSettings {
  userId: string;
}

export class GetUserSettingsUseCase implements UseCase<string, Result<GetUserSettingsOutput>> {
  async execute(userId: string): Promise<Result<GetUserSettingsOutput>> {
    try {
      // In a real implementation, this would fetch user settings from a repository
      // For now, return mock data
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
    } catch (error) {
      console.error('Error getting user settings:', error);
      return Result.fail(error instanceof Error ? error : new Error('Failed to get user settings'));
    }
  }
}