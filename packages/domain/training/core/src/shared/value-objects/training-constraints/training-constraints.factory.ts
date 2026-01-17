import { Guard, Result, VALID_DAYS } from '@bene/shared';
import { ConstraintsValidationError } from '@/shared/errors/index.js';
import {
  TrainingConstraints,
  Injury,
  TrainingLocation,
  PreferredTime,
} from './training-constraints.types.js';

export interface TrainingConstraintsProps {
  readonly injuries?: readonly Injury[];
  readonly availableDays: readonly string[]; // ['Monday', 'Wednesday', 'Friday']
  readonly preferredTime?: PreferredTime;
  readonly maxDuration?: number; // minutes per workout
  readonly availableEquipment: readonly string[];
  readonly location: TrainingLocation;
}

export function createTrainingConstraints(
  props: TrainingConstraintsProps,
): Result<TrainingConstraints> {
  // Validate available days
  if (props.availableDays.length === 0) {
    return Result.fail(
      new ConstraintsValidationError('Must have at least one available day'),
    );
  }

  for (const day of props.availableDays) {
    if (!VALID_DAYS.includes(day)) {
      return Result.fail(
        new ConstraintsValidationError(
          `Invalid day: ${ day }. Must be one of: ${ VALID_DAYS.join(', ') }`,
          { day, validDays: VALID_DAYS },
        ),
      );
    }
  }

  // Check for duplicate days
  const uniqueDays = new Set(props.availableDays);
  if (uniqueDays.size !== props.availableDays.length) {
    return Result.fail(
      new ConstraintsValidationError('Duplicate days in available days', {
        availableDays: props.availableDays,
      }),
    );
  }

  // Validate max duration
  if (props.maxDuration !== undefined && props.maxDuration <= 0) {
    return Result.fail(
      new ConstraintsValidationError('Max duration must be positive', {
        maxDuration: props.maxDuration,
      }),
    );
  }

  // Validate injuries
  if (props.injuries) {
    for (const injury of props.injuries) {
      const injuryGuard = Guard.combine([
        Guard.againstEmptyString(injury.bodyPart, 'injury body part'),
        Guard.againstEmptyString(injury.severity, 'injury severity'),
      ]);
      if (injuryGuard.isFailure) {
        return Result.fail(injuryGuard.error);
      }
    }
  }

  return Result.ok(props);
}

// Factory methods for common constraint configurations
export function createHomeTrainingConstraints(
  availableDays: string[],
  equipment: string[] = [],
): Result<TrainingConstraints> {
  return createTrainingConstraints({
    availableDays,
    availableEquipment: equipment,
    location: 'home',
  });
}

export function createGymTrainingConstraints(
  availableDays: string[],
  maxDuration: number,
): Result<TrainingConstraints> {
  return createTrainingConstraints({
    availableDays,
    maxDuration,
    availableEquipment: [],
    location: 'gym',
  });
}

export function createInjuryConstraints(
  availableDays: string[],
  injuries: Injury[],
): Result<TrainingConstraints> {
  return createTrainingConstraints({
    availableDays,
    injuries,
    availableEquipment: [],
    location: 'home',
  });
}
