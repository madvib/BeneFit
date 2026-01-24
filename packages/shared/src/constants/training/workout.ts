export const WORKOUT_TYPES = [
  'strength',
  'cardio',
  'flexibility',
  'hybrid',
  'running',
  'cycling',
  'yoga',
  'hiit',
  'rest',
  'custom',
] as const;

export const WORKOUT_CATEGORIES = ['cardio', 'strength', 'recovery'] as const;

export const WORKOUT_STATUSES = [
  'scheduled',
  'in_progress',
  'completed',
  'skipped',
  'rescheduled',
] as const;

export const WORKOUT_IMPORTANCE_LEVELS = ['optional', 'recommended', 'key', 'critical'] as const;

export const ACTIVITY_TYPES = ['warmup', 'main', 'cooldown', 'interval', 'circuit'] as const;

// Combined from Goals (max) and Intervals (sprint)
export const INTENSITY_LEVELS = ['easy', 'moderate', 'hard', 'sprint', 'max'] as const;

export const ENERGY_LEVELS = ['low', 'medium', 'high'] as const;

export const PERFORMANCE_DIFFICULTY_RATINGS = ['too_easy', 'just_right', 'too_hard'] as const;

export const VERIFICATION_METHODS = [
  'gps',
  'gym_checkin',
  'wearable',
  'photo',
  'witness',
  'manual',
] as const;

export const VERIFICATION_PLATFORMS = ['apple_health', 'garmin', 'fitbit', 'strava', 'other'] as const;
