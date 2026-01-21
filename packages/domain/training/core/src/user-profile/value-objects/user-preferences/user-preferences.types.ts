import { z } from 'zod';
import { CreateView } from '@bene/shared';

export const ThemeSchema = z.enum(['light', 'dark', 'auto']);
export type Theme = z.infer<typeof ThemeSchema>;

export const UnitsSchema = z.enum(['metric', 'imperial']);
export type Units = z.infer<typeof UnitsSchema>;

export const CheckInFrequencySchema = z.enum(['daily', 'weekly', 'biweekly', 'never']);
export type CheckInFrequency = z.infer<typeof CheckInFrequencySchema>;

export const CoachToneSchema = z.enum(['motivational', 'casual', 'professional', 'tough_love']);
export type CoachTone = z.infer<typeof CoachToneSchema>;

export const NotificationPreferencesSchema = z.object({
  workoutReminders: z.boolean(),
  reminderTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .optional(),
  coachCheckIns: z.boolean(),
  teamActivity: z.boolean(),
  weeklyReports: z.boolean(),
  achievementAlerts: z.boolean(),
  pushEnabled: z.boolean(),
  emailEnabled: z.boolean(),
});
export type NotificationPreferences = z.infer<typeof NotificationPreferencesSchema>;

export const PrivacySettingsSchema = z.object({
  profileVisible: z.boolean(),
  workoutsPublic: z.boolean(),
  allowTeamInvites: z.boolean(),
  showRealName: z.boolean(),
  shareProgress: z.boolean(),
});
export type PrivacySettings = z.infer<typeof PrivacySettingsSchema>;

export const CoachPreferencesSchema = z.object({
  checkInFrequency: CheckInFrequencySchema,
  tone: CoachToneSchema,
  proactiveAdvice: z.boolean(),
  celebrateWins: z.boolean(),
  receiveFormTips: z.boolean(),
});
export type CoachPreferences = z.infer<typeof CoachPreferencesSchema>;

/**
 * CORE SCHEMA
 */
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

/**
 * INFERRED TYPES
 */
export type UserPreferences = Readonly<z.infer<typeof UserPreferencesSchema>>;
export type UserPreferencesView = CreateView<UserPreferences>;
