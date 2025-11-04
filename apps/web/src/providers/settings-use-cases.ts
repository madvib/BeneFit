import { GetUserSettingsUseCase, UpdateUserSettingsUseCase } from '@bene/application/settings';

// Instantiate settings use cases as constants
// In a real implementation, you'd pass repositories to the use cases
export const getUserSettingsUseCase = new GetUserSettingsUseCase();
export const updateUserSettingsUseCase = new UpdateUserSettingsUseCase();

// Export all settings-related use cases
export const settingsUseCases = {
  getUserSettingsUseCase,
  updateUserSettingsUseCase,
};