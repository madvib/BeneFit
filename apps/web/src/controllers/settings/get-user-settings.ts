'use server';

import { settingsUseCases } from '@/providers/settings-use-cases';
import { getCurrentUser } from '@/controllers/auth';
import {
  NotificationPreferences,
  PrivacySettings,
  FitnessPreferences,
} from '@bene/core/settings';

// Define the return types for settings data
export interface SettingsData {
  notificationPreferences: NotificationPreferences;
  privacySettings: PrivacySettings;
  fitnessPreferences: FitnessPreferences;
}

interface GetUserSettingsResult {
  success: boolean;
  data?: SettingsData;
  error?: string;
}

export async function getUserSettings(): Promise<GetUserSettingsResult> {
  try {
    // Get user ID from session context
    const userResult = await getCurrentUser();

    if (!userResult.success || !userResult.data) {
      console.error('Failed to get current user:', userResult.error);
      return {
        success: false,
        error: userResult.error || 'User not authenticated',
      };
    }

    const userId = userResult.data.id;

    // Use the use case to get user settings
    const result = await settingsUseCases.getUserSettingsUseCase.execute(userId);

    if (result.isSuccess) {
      // Transform the result to match the UI requirements
      const settings = result.value;

      return {
        success: true,
        data: {
          notificationPreferences: settings.notificationPreferences,
          privacySettings: settings.privacySettings,
          fitnessPreferences: settings.fitnessPreferences,
        },
      };
    } else {
      console.error('Use case failed:', result.error);
      return {
        success: false,
        error: result.error?.message || 'Failed to fetch user settings',
      };
    }
  } catch (error) {
    console.error('Error in getUserSettings controller:', error);
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}

export interface UpdateUserSettingsInput {
  notificationPreferences?: NotificationPreferences;
  privacySettings?: PrivacySettings;
  fitnessPreferences?: FitnessPreferences;
}

interface UpdateUserSettingsResult {
  success: boolean;
  message?: string;
  error?: string;
}

export async function updateUserSettings(
  input: UpdateUserSettingsInput,
): Promise<UpdateUserSettingsResult> {
  try {
    // Get user ID from session context
    const userResult = await getCurrentUser();

    if (!userResult.success || !userResult.data) {
      console.error('Failed to get current user:', userResult.error);
      return {
        success: false,
        error: userResult.error || 'User not authenticated',
      };
    }

    const userId = userResult.data.id;

    // Use the use case to update user settings
    const result = await settingsUseCases.updateUserSettingsUseCase.execute({
      userId,
      settings: {
        notificationPreferences: input.notificationPreferences,
        privacySettings: input.privacySettings,
        fitnessPreferences: input.fitnessPreferences,
      },
    });

    if (result.isSuccess) {
      return {
        success: true,
        message: result.value.message,
      };
    } else {
      console.error('Use case failed:', result.error);
      return {
        success: false,
        error: result.error?.message || 'Failed to update user settings',
      };
    }
  } catch (error) {
    console.error('Error in updateUserSettings controller:', error);
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}
