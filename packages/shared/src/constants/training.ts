export const SUPPORTED_EQUIPMENT = [
  'Dumbbells',
  'Barbell',
  'Kettlebell',
  'Pull-up Bar',
  'Resistance Bands',
  'Bench',
  'Squat Rack',
  'Cable Machine',
  'Bodyweight Only',
] as const;

export const FITNESS_GOALS = [
  'strength',
  'hypertrophy',
  'endurance',
  'weight_loss',
  'general_fitness',
  'weight_gain',
  'sport_specific',
  'mobility',
  'rehabilitation',
] as const;

export type FitnessGoal = (typeof FITNESS_GOALS)[number];

export const SECONDARY_GOALS = [
  'consistency',
  'flexibility',
  'mobility',
  'recovery',
  'injury_prevention',
] as const;

export type SecondaryGoal = (typeof SECONDARY_GOALS)[number];
