export const PLAN_STATUSES = ['draft', 'active', 'paused', 'completed', 'abandoned'] as const;

export const PLAN_TYPES = [
  'event_training',
  'habit_building',
  'strength_program',
  'general_fitness',
] as const;

export const PROGRESSION_STRATEGIES = ['linear', 'undulating', 'adaptive'] as const;
