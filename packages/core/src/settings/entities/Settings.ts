import { Entity, Result } from '@bene/core/shared';

// Define the settings interfaces within this module to avoid circular dependency
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

interface SettingsProps {
  notificationPreferences: NotificationPreferences;
  privacySettings: PrivacySettings;
  fitnessPreferences: FitnessPreferences;
  userId: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class Settings extends Entity<SettingsProps> {
  get notificationPreferences(): NotificationPreferences {
    return this.props.notificationPreferences;
  }

  get privacySettings(): PrivacySettings {
    return this.props.privacySettings;
  }

  get fitnessPreferences(): FitnessPreferences {
    return this.props.fitnessPreferences;
  }

  get userId(): string {
    return this.props.userId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  private constructor(props: SettingsProps, id: string) {
    super(props, id);
  }

  public static create(props: Omit<SettingsProps, 'createdAt'> & { id: string }): Result<Settings> {
    const { id, ...rest } = props;

    // Validation can be added here as needed
    const settings = new Settings(
      {
        ...rest,
        createdAt: new Date(),
      },
      id,
    );

    return Result.ok(settings);
  }

  updateSettings(
    notificationPrefs?: Partial<NotificationPreferences>,
    privacyPrefs?: Partial<PrivacySettings>,
    fitnessPrefs?: Partial<FitnessPreferences>
  ): void {
    if (notificationPrefs) {
      this.props.notificationPreferences = {
        ...this.props.notificationPreferences,
        ...notificationPrefs,
      };
    }

    if (privacyPrefs) {
      this.props.privacySettings = {
        ...this.props.privacySettings,
        ...privacyPrefs,
      };
    }

    if (fitnessPrefs) {
      this.props.fitnessPreferences = {
        ...this.props.fitnessPreferences,
        ...fitnessPrefs,
      };
    }

    this.props.updatedAt = new Date();
  }
}