import { GetUserSettingsUseCase, UpdateUserSettingsUseCase } from '@bene/application/settings';
import { MockSettingsRepository } from '@bene/infrastructure/settings';

// Create repository instance
const settingsRepository = new MockSettingsRepository();

// Instantiate settings use cases as constants
export const getUserSettingsUseCase = new GetUserSettingsUseCase(settingsRepository);
export const updateUserSettingsUseCase = new UpdateUserSettingsUseCase(settingsRepository);

// Export all settings-related use cases
export const settingsUseCases = {
  getUserSettingsUseCase,
  updateUserSettingsUseCase,
};