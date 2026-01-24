export const FITNESS_GOALS = [
  'strength',
  'hypertrophy',
  'endurance',
  'weight_loss',
  'weight_gain',
  'general_fitness',
  'sport_specific',
  'mobility',
  'rehabilitation',
] as const;


// Secondary goals organized by category
export const SECONDARY_GOAL_CATEGORIES = {
  'Performance': ['increase_power', 'improve_speed', 'build_stamina', 'enhance_mobility', 'improve_flexibility', 'better_balance', 'increase_explosiveness'],
  'Body composition': ['tone_muscles', 'gain_weight', 'body_recomposition'],
  'Health & Wellness': ['injury_prevention', 'rehabilitation', 'improve_posture', 'reduce_stress', 'better_sleep', 'increase_energy', 'boost_confidence'],
  'Lifestyle': ['build_consistency', 'improve_recovery', 'sport_specific_training', 'functional_fitness'],
} as const;

export const SECONDARY_GOALS = Object.values(SECONDARY_GOAL_CATEGORIES).flat();
