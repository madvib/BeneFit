import { z } from 'zod';
import { UserPreferences, Theme, Units, CheckInFrequency, CoachTone, NotificationPreferences, PrivacySettings, CoachPreferences } from './user-preferences.types.js';

export const ThemeSchema = z.enum(['light', 'dark', 'auto']);
export const UnitsSchema = z.enum(['metric', 'imperial']);
export const CheckInFrequencySchema = z.enum(['daily', 'weekly', 'biweekly', 'never']);
export const CoachToneSchema = z.enum(['motivational', 'casual', 'professional', 'tough_love']);

export const NotificationPreferencesSchema = z.object({
  workoutReminders: z.boolean(),
  reminderTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  coachCheckIns: z.boolean(),
  teamActivity: z.boolean(),
  weeklyReports: z.boolean(),
  achievementAlerts: z.boolean(),
  pushEnabled: z.boolean(),
  emailEnabled: z.boolean(),
});

export const PrivacySettingsSchema = z.object({
  profileVisible: z.boolean(),
  workoutsPublic: z.boolean(),
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
  theme: ThemeSchema,
  units: UnitsSchema,
  notifications: NotificationPreferencesSchema,
  privacy: PrivacySettingsSchema,
  coaching: CoachPreferencesSchema,
  showRestTimers: z.boolean(),
  autoProgressWeights: z.boolean(),
  useVoiceAnnouncements: z.boolean(),
});

export type UserPreferencesPresentation = z.infer<typeof UserPreferencesSchema>;

export function toUserPreferencesSchema(prefs: UserPreferences): UserPreferencesPresentation {
  return {
    theme: prefs.theme,
    units: prefs.units,
    notifications: { ...prefs.notifications },
    privacy: { ...prefs.privacy },
    coaching: { ...prefs.coaching },
    showRestTimers: prefs.showRestTimers,
    autoProgressWeights: prefs.autoProgressWeights,
    useVoiceAnnouncements: prefs.useVoiceAnnouncements,
  };
}
