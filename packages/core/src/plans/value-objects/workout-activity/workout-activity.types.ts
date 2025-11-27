import { ActivityValidationError } from '../../errors/workout-plan-errors.js';
import { ActivityStructure } from '../activity-structure/index.js';

export type ActivityType = 'warmup' | 'main' | 'cooldown' | 'interval' | 'circuit';

export interface WorkoutActivity {
  readonly name: string;
  readonly type: ActivityType;
  readonly order: number;
  readonly structure?: ActivityStructure;
  readonly instructions?: readonly string[];
  readonly distance?: number; // meters
  readonly duration?: number; // minutes
  readonly pace?: string; // e.g., "easy", "moderate", "5:30/km"
  readonly videoUrl?: string;
  readonly equipment?: readonly string[];
  readonly alternativeExercises?: readonly string[];
}

export interface WorkoutActivityValidation {
  isValid: boolean;
  errors: ActivityValidationError[];
}