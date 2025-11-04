import { Result, UseCase } from '@bene/core/shared';
import { UserSettings } from '../get-user-settings/get-user-settings.use-case.js';

interface UpdateUserSettingsInput {
  userId: string;
  settings: Partial<UserSettings>;
}

interface UpdateUserSettingsOutput {
  success: boolean;
  message?: string;
}

export class UpdateUserSettingsUseCase implements UseCase<UpdateUserSettingsInput, Result<UpdateUserSettingsOutput>> {
  async execute(input: UpdateUserSettingsInput): Promise<Result<UpdateUserSettingsOutput>> {
    try {
      // In a real implementation, this would update user settings in a repository
      // For now, just return success
      console.log(`Updating settings for user ${input.userId}:`, input.settings);
      
      return Result.ok({
        success: true,
        message: 'Settings updated successfully'
      });
    } catch (error) {
      console.error('Error updating user settings:', error);
      return Result.fail(error instanceof Error ? error : new Error('Failed to update user settings'));
    }
  }
}