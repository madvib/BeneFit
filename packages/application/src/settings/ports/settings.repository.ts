import { Repository } from '@bene/core/shared';
import { Settings } from '@bene/core/settings';

// Settings repository interface
export interface SettingsRepository extends Repository<Settings> {
  getUserSettings(userId: string): Promise<Settings | null>;
  updateUserSettings(userId: string, settings: Partial<Omit<Settings, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<boolean>;
}