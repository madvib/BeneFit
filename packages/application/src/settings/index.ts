// Settings module exports
export { GetUserSettingsUseCase } from './use-cases/get-user-settings/get-user-settings.use-case.js';
export { UpdateUserSettingsUseCase } from './use-cases/update-user-settings/update-user-settings.use-case.js';

// Export settings DTOs
export type { 
  NotificationPreferences, 
  PrivacySettings, 
  FitnessPreferences, 
  UserSettings,
  GetUserSettingsOutput 
} from './use-cases/get-user-settings/get-user-settings.use-case.js';