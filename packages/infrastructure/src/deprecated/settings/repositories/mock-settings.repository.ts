import { Result } from '@bene/core/shared';
import { SettingsRepository } from '@bene/application/settings';
import { Settings, NotificationPreferences, PrivacySettings, FitnessPreferences } from '@bene/core/settings';

// Mock data directly in the code instead of importing JSON to avoid async issues
const MOCK_SETTINGS_DATA = {
  'default': {
    notificationPreferences: {
      emailNotifications: true,
      pushNotifications: true,
      workoutReminders: true
    },
    privacySettings: {
      profileVisibility: 'Public' as const,
      activitySharing: false
    },
    fitnessPreferences: {
      preferredUnits: 'Metric (kg, km)' as const,
      goalFocus: 'General Fitness' as const
    }
  },
  'user-1': {
    notificationPreferences: {
      emailNotifications: true,
      pushNotifications: false,
      workoutReminders: true
    },
    privacySettings: {
      profileVisibility: 'Friends Only' as const,
      activitySharing: true
    },
    fitnessPreferences: {
      preferredUnits: 'Imperial (lbs, miles)' as const,
      goalFocus: 'Weight Loss' as const
    }
  }
};

export class MockSettingsRepository implements SettingsRepository {
  private settingsMap: Map<string, Settings> = new Map();

  constructor() {
    // Initialize with mock data synchronously to avoid race conditions
    this.loadMockData();
  }

  private loadMockData() {
    // Load all settings into the map using the predefined mock data
    Object.entries(MOCK_SETTINGS_DATA).forEach(([userId, settings]) => {
      const settingsResult = Settings.create({
        id: userId,
        userId: userId,
        notificationPreferences: settings.notificationPreferences,
        privacySettings: settings.privacySettings,
        fitnessPreferences: settings.fitnessPreferences,
      });
      
      if (settingsResult.isSuccess) {
        this.settingsMap.set(userId, settingsResult.value);
      }
    });
  }

  async getUserSettings(userId: string): Promise<Settings | null> {
    // Return user-specific settings if they exist, or null if they don't exist
    // Default settings should only be used as template for creating new settings, not returned directly for nonexistent users
    const userSettings = this.settingsMap.get(userId) || null;
    return userSettings;
  }

  async updateUserSettings(userId: string, settings: Partial<Omit<Settings, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<boolean> {
    try {
      // Check if settings exist for this user
      const existingSettings = this.settingsMap.get(userId);
      
      if (existingSettings) {
        // Update existing settings using the entity's method
        existingSettings.updateSettings(
          settings.notificationPreferences,
          settings.privacySettings,
          settings.fitnessPreferences
        );
        return true;
      } else {
        // Create new settings
        const defaultSettings = this.settingsMap.get('default');
        // Prepare default settings if no default found
        const defaultNotificationPrefs = defaultSettings ? {
          emailNotifications: defaultSettings.notificationPreferences.emailNotifications,
          pushNotifications: defaultSettings.notificationPreferences.pushNotifications,
          workoutReminders: defaultSettings.notificationPreferences.workoutReminders,
        } : {
          emailNotifications: true,
          pushNotifications: true,
          workoutReminders: true,
        };

        const defaultPrivacyPrefs = defaultSettings ? {
          profileVisibility: defaultSettings.privacySettings.profileVisibility,
          activitySharing: defaultSettings.privacySettings.activitySharing,
        } : {
          profileVisibility: 'Public' as const,
          activitySharing: false,
        };

        const defaultFitnessPrefs = defaultSettings ? {
          preferredUnits: defaultSettings.fitnessPreferences.preferredUnits,
          goalFocus: defaultSettings.fitnessPreferences.goalFocus,
        } : {
          preferredUnits: 'Metric (kg, km)' as const,
          goalFocus: 'General Fitness' as const,
        };

        const newSettingsResult = Settings.create({
          id: userId,
          userId: userId,
          notificationPreferences: settings.notificationPreferences || defaultNotificationPrefs,
          privacySettings: settings.privacySettings || defaultPrivacyPrefs,
          fitnessPreferences: settings.fitnessPreferences || defaultFitnessPrefs,
        });
        
        if (newSettingsResult.isSuccess) {
          this.settingsMap.set(userId, newSettingsResult.value);
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error updating user settings:', error);
      return false;
    }
  }

  // Implement the base Repository interface methods
  async findById(id: string) {
    const settings = this.settingsMap.get(id);
    if (settings) {
      return Result.ok(settings);
    }
    return Result.fail(new Error('Settings not found'));
  }

  async save(entity: Settings) {
    // Check if it has the essential structure of a Settings entity
    if (!entity || typeof entity !== 'object' || 
        typeof (entity as any).id !== 'string' || 
        typeof (entity as any).userId !== 'string' ||
        typeof (entity as any).notificationPreferences === 'undefined' ||
        typeof (entity as any).privacySettings === 'undefined' ||
        typeof (entity as any).fitnessPreferences === 'undefined') {
      return Result.fail(new Error('Invalid entity structure - not a Settings entity'));
    }
    this.settingsMap.set(entity.id, entity);
    return Result.ok(undefined);
  }

  async delete(id: string) {
    const exists = this.settingsMap.has(id);
    const deleted = this.settingsMap.delete(id);
    // The repository should return success even if the settings didn't exist initially
    // This follows the principle that deletion is idempotent
    return Result.ok(undefined);
  }

  async exists(id: string) {
    return Result.ok(this.settingsMap.has(id));
  }

  async update(id: string, settings: Partial<Settings>) {
    const existingSettings = this.settingsMap.get(id);
    if (!existingSettings) {
      return Result.fail(new Error('Settings not found'));
    }
    
    // Update the settings object using the entity's method
    existingSettings.updateSettings(
      settings.notificationPreferences as Partial<NotificationPreferences> | undefined,
      settings.privacySettings as Partial<PrivacySettings> | undefined,
      settings.fitnessPreferences as Partial<FitnessPreferences> | undefined
    );
    
    return Result.ok(undefined);
  }
}