import { StructureValidationError } from '../../errors/workout-plan-errors.js';

export type IntensityLevel = 'easy' | 'moderate' | 'hard' | 'sprint';

export interface Interval {
  readonly duration: number; // seconds
  readonly intensity: IntensityLevel;
  readonly rest: number; // seconds
}

export interface Exercise {
  readonly name: string;
  readonly sets: number;
  readonly reps?: number | string; // number or "to failure"
  readonly weight?: number; // kg or lbs
  readonly duration?: number; // seconds for holds/timed exercises
  readonly rest: number; // seconds between sets
  readonly notes?: string;
}

export interface ActivityStructure {
  readonly intervals?: readonly Interval[];
  readonly rounds?: number;
  readonly exercises?: readonly Exercise[];
}

export interface ActivityStructureValidation {
  isValid: boolean;
  errors: StructureValidationError[];
}