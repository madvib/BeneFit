import { Result } from '@shared';

export type PrimaryFitnessGoal =
  | 'strength' // Get stronger
  | 'hypertrophy' // Build muscle
  | 'endurance' // Improve cardio
  | 'weight_loss' // Lose weight
  | 'weight_gain' // Gain weight/muscle
  | 'general_fitness' // Stay healthy
  | 'sport_specific' // Train for a sport
  | 'mobility' // Improve flexibility/mobility
  | 'rehabilitation'; // Recover from injury

export interface TargetWeight {
  current: number;
  target: number;
  unit: 'kg' | 'lbs';
}

export interface FitnessGoals {
  primary: PrimaryFitnessGoal;
  secondary: string[]; // Additional goals

  // Specific targets
  targetWeight?: TargetWeight;
  targetBodyFat?: number; // Percentage
  targetDate?: Date;

  // Qualitative
  motivation: string; // Why they're doing this
  successCriteria: string[]; // How they'll know they succeeded
}