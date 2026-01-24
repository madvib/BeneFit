import { z } from 'zod';
import { Result, Unbrand, unwrapOrIssue, mapZodError } from '@bene/shared';
import { UserPreferences, UserPreferencesSchema } from './user-preferences.types.js';

/**
 * ============================================================================
 * USER PREFERENCES FACTORY (Canonical Pattern)
 * ============================================================================
 * 
 * PUBLIC API (2 exports):
 * 1. userPreferencesFromPersistence() - For fixtures & DB hydration
 * 2. CreateUserPreferencesSchema - Zod transform for API boundaries
 * 
 * Everything else is internal. No Input types, no extra functions.
 * ============================================================================
 */

// ============================================================================
// INTERNAL HELPERS (not exported)
// ============================================================================

/** Validates and brands UserPreferences */
function validateUserPreferences(data: unknown): Result<UserPreferences> {
  const parseResult = UserPreferencesSchema.safeParse(data);

  if (!parseResult.success) {
    return Result.fail(mapZodError(parseResult.error));
  }

  return Result.ok(parseResult.data);
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  units: 'metric',
  language: 'EN',
  timezone: 'UTC',
  notifications: {
    workoutReminders: true,
    reminderTime: '09:00',
    coachCheckIns: true,
    teamActivity: true,
    weeklyReports: true,
    achievementAlerts: true,
    pushEnabled: true,
    emailEnabled: true,
  },
  privacy: {
    profileVisible: true,
    workoutsPublic: true,
    allowTeamInvites: true,
    showRealName: true,
    shareProgress: true,
  },
  coaching: {
    checkInFrequency: 'weekly',
    tone: 'motivational',
    proactiveAdvice: true,
    celebrateWins: true,
    receiveFormTips: true,
  },
  showRestTimers: true,
  autoProgressWeights: true,
  useVoiceAnnouncements: false,
};

// ============================================================================
// 1. REHYDRATION (for fixtures & DB)
// ============================================================================

/**
 * Rehydrates UserPreferences from persistence/fixtures (trusts the data).
 * This is the ONLY place where Unbrand is used.
 */
export function userPreferencesFromPersistence(
  data: Unbrand<UserPreferences>,
): Result<UserPreferences> {
  return Result.ok(data as UserPreferences);
}

// ============================================================================
// 2. CREATION (for API boundaries)
// ============================================================================

/**
 * Schema for creating or updating UserPreferences.
 * We manually construct a deep partial schema since Zod's .deepPartial() behavior can vary.
 */
export const CreateUserPreferencesFactorySchema = UserPreferencesSchema.omit({
  notifications: true,
  privacy: true,
  coaching: true,
}).extend({
  notifications: UserPreferencesSchema.shape.notifications.partial().optional(),
  privacy: UserPreferencesSchema.shape.privacy.partial().optional(),
  coaching: UserPreferencesSchema.shape.coaching.partial().optional(),
}).partial();

export type CreateUserPreferencesInput = z.infer<typeof CreateUserPreferencesFactorySchema>;

/**
 * Zod transform for creating or updating UserPreferences.
 * Use at API boundaries (controllers, resolvers).
 * 
 * Infer input type with: z.input<typeof CreateUserPreferencesSchema>
 */
export const CreateUserPreferencesSchema: z.ZodType<UserPreferences> = CreateUserPreferencesFactorySchema.transform(
  (input, ctx) => {
    // Merge defaults with deep partial input
    const data = {
      ...DEFAULT_PREFERENCES,
      ...input,
      notifications: { ...DEFAULT_PREFERENCES.notifications, ...(input.notifications || {}) },
      privacy: { ...DEFAULT_PREFERENCES.privacy, ...(input.privacy || {}) },
      coaching: { ...DEFAULT_PREFERENCES.coaching, ...(input.coaching || {}) },
    };

    const validationResult = validateUserPreferences(data);
    return unwrapOrIssue(validationResult, ctx);
  },
);
