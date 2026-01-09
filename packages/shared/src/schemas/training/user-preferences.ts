import { z } from 'zod';

// User Preferences Schemas

export const ThemeSchema = z.enum(['light', 'dark', 'auto']);

export const UnitsSchema = z.enum(['metric', 'imperial']);

export const CheckInFrequencySchema = z.enum(['daily', 'weekly', 'biweekly', 'never']);

export const CoachToneSchema = z.enum(['motivational', 'casual', 'professional', 'tough_love']);

export const NotificationPreferencesSchema = z.object({
  workoutReminders: z.boolean(),
  reminderTime: z.string().optional(), // "09:00" in user's timezone
  coachCheckIns: z.boolean(),
  teamActivity: z.boolean(),
  weeklyReports: z.boolean(),
  achievementAlerts: z.boolean(),
  pushEnabled: z.boolean(),
  emailEnabled: z.boolean(),
});

export const PrivacySettingsSchema = z.object({
  profileVisible: z.boolean(),
  workoutsPublic: z.boolean(), // Public to team
  allowTeamInvites: z.boolean(),
  showRealName: z.boolean(),
  shareProgress: z.boolean(),
});

export const CoachPreferencesSchema = z.object({
  checkInFrequency: CheckInFrequencySchema,
  tone: CoachToneSchema,
  proactiveAdvice: z.boolean(),
  celebrateWins: z.boolean(),
  receiveFormTips: z.boolean(),
});

export const UserPreferencesSchema = z.object({
  // UI
  theme: ThemeSchema,
  units: UnitsSchema,
  // Notifications
  notifications: NotificationPreferencesSchema,
  // Privacy
  privacy: PrivacySettingsSchema,
  // AI Coach
  coaching: CoachPreferencesSchema,
  // Display
  showRestTimers: z.boolean(),
  autoProgressWeights: z.boolean(),
  useVoiceAnnouncements: z.boolean(),
});

// Export inferred types
export type Theme = z.infer<typeof ThemeSchema>;
export type Units = z.infer<typeof UnitsSchema>;
export type CheckInFrequency = z.infer<typeof CheckInFrequencySchema>;
export type CoachTone = z.infer<typeof CoachToneSchema>;
export type NotificationPreferences = z.infer<typeof NotificationPreferencesSchema>;
export type PrivacySettings = z.infer<typeof PrivacySettingsSchema>;
export type CoachPreferences = z.infer<typeof CoachPreferencesSchema>;
export type UserPreferences = z.infer<typeof UserPreferencesSchema>;
