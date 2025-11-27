export type Theme = 'light' | 'dark' | 'auto';
export type Units = 'metric' | 'imperial';
export type CheckInFrequency = 'daily' | 'weekly' | 'biweekly' | 'never';
export type CoachTone = 'motivational' | 'casual' | 'professional' | 'tough_love';

export interface NotificationPreferences {
  workoutReminders: boolean;
  reminderTime?: string; // "09:00" in user's timezone
  coachCheckIns: boolean;
  teamActivity: boolean;
  weeklyReports: boolean;
  achievementAlerts: boolean;
  pushEnabled: boolean;
  emailEnabled: boolean;
}

export interface PrivacySettings {
  profileVisible: boolean;
  workoutsPublic: boolean; // Public to team
  allowTeamInvites: boolean;
  showRealName: boolean;
  shareProgress: boolean;
}

export interface CoachingPreferences {
  checkInFrequency: CheckInFrequency;
  tone: CoachTone;
  proactiveAdvice: boolean;
  celebrateWins: boolean;
  receiveFormTips: boolean;
}

interface UserPreferencesData {
  // UI
  theme: Theme;
  units: Units;

  // Notifications
  notifications: NotificationPreferences;

  // Privacy
  privacy: PrivacySettings;

  // AI Coach
  coaching: CoachingPreferences;

  // Display
  showRestTimers: boolean;
  autoProgressWeights: boolean;
  useVoiceAnnouncements: boolean;
}

export type UserPreferences = Readonly<UserPreferencesData>;
