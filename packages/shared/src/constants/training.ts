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
  'fat_loss',
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
