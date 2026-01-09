// Equipment organized by category
export const EQUIPMENT_CATEGORIES = {
  'Free Weights': ['dumbbells', 'barbell', 'kettlebells', 'weight_plates'],
  'Machines & Racks': ['squat_rack', 'bench_press', 'cable_machine', 'leg_press', 'smith_machine'],
  'Cardio Equipment': ['treadmill', 'stationary_bike', 'rowing_machine', 'elliptical', 'jump_rope'],
  'Bodyweight & Accessories': ['pull_up_bar', 'dip_station', 'resistance_bands', 'suspension_trainer', 'medicine_ball', 'foam_roller', 'yoga_mat'],
  'Minimal': ['bodyweight_only', 'other'],
} as const;

// Flatten for backward compatibility
export const EQUIPMENT_OPTIONS = Object.values(EQUIPMENT_CATEGORIES).flat();

export const FITNESS_GOALS = [
  'strength',
  'muscle_growth',
  'weight_loss',
  'endurance',
  'athletic_performance',
  'general_health',
] as const;

export type FitnessGoal = (typeof FITNESS_GOALS)[number];

// Secondary goals organized by category
export const SECONDARY_GOAL_CATEGORIES = {
  'Performance': ['increase_power', 'improve_speed', 'build_stamina', 'enhance_mobility', 'improve_flexibility', 'better_balance', 'increase_explosiveness'],
  'Body Composition': ['tone_muscles', 'gain_weight', 'body_recomposition'],
  'Health & Wellness': ['injury_prevention', 'rehabilitation', 'improve_posture', 'reduce_stress', 'better_sleep', 'increase_energy', 'boost_confidence'],
  'Lifestyle': ['build_consistency', 'improve_recovery', 'sport_specific_training', 'functional_fitness'],
} as const;

// Flatten for backward compatibility
export const SECONDARY_GOALS = Object.values(SECONDARY_GOAL_CATEGORIES).flat();

export type SecondaryGoal = (typeof SECONDARY_GOALS)[number];

// Experience Levels
export const EXPERIENCE_LEVELS = ['beginner', 'intermediate', 'advanced'] as const;
export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number];

// Injury Severity
export const INJURY_SEVERITY_LEVELS = ['minor', 'moderate', 'serious'] as const;
export type InjurySeverity = (typeof INJURY_SEVERITY_LEVELS)[number];

// Preferred Training Times
export const PREFERRED_TIMES = ['morning', 'afternoon', 'evening'] as const;
export type PreferredTime = (typeof PREFERRED_TIMES)[number];

// Training Locations
export const TRAINING_LOCATIONS = ['home', 'gym', 'outdoor', 'mixed'] as const;
export type TrainingLocation = (typeof TRAINING_LOCATIONS)[number];

// Activity Difficulty Ratings
export const DIFFICULTY_RATINGS = ['too_easy', 'just_right', 'too_hard'] as const;
export type DifficultyRating = (typeof DIFFICULTY_RATINGS)[number];

// Verification Methods
export const VERIFICATION_METHODS = [
  'gps',
  'photo',
  'wearable',
  'witness',
  'gym_checkin',
  'manual',
] as const;
export type VerificationMethod = (typeof VERIFICATION_METHODS)[number];

// Weight Units
export const WEIGHT_UNITS = ['kg', 'lbs'] as const;
export type WeightUnit = (typeof WEIGHT_UNITS)[number];
