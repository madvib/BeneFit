import { Guard, Result } from '@bene/domain-shared';
import {
  ActivityPerformance,
  EnergyLevel,
  DifficultyRating,
  HeartRateData,
  WorkoutPerformance,
} from './workout-performance.types.js';

export function createWorkoutPerformance(props: {
  startedAt: Date;
  completedAt: Date;
  activities: ActivityPerformance[];
  perceivedExertion: number;
  energyLevel: EnergyLevel;
  enjoyment: number;
  difficultyRating: DifficultyRating;
  heartRate?: HeartRateData;
  caloriesBurned?: number;
  notes?: string;
  injuries?: string[];
  modifications?: string[];
}): Result<WorkoutPerformance> {
  const durationMs = props.completedAt.getTime() - props.startedAt.getTime();
  const durationMinutes = Math.round(durationMs / 60000);

  const guards = [
    // Validate dates
    Guard.againstNullOrUndefinedBulk([
      { argument: props.startedAt, argumentName: 'startedAt' },
      { argument: props.completedAt, argumentName: 'completedAt' },
      { argument: props.activities, argumentName: 'activities' },
    ]),
    Guard.isTrue(
      props.completedAt >= props.startedAt,
      'completedAt must be after startedAt',
    ),

    // Validate duration and activities array length
    Guard.againstNegativeOrZero(durationMinutes, 'duration'),
    Guard.isTrue(props.activities?.length > 0, 'must have at least one activity'),

    // Validate subjective metrics
    Guard.inRange(props.perceivedExertion, 1, 10, 'perceivedExertion'),
    Guard.inRange(props.enjoyment, 1, 5, 'enjoyment'),

    // Validate optional metrics (using conditional checks)
    props.caloriesBurned !== undefined
      ? Guard.againstNegative(props.caloriesBurned, 'caloriesBurned')
      : Result.ok(),
    props.notes ? Guard.againstTooLong(props.notes, 2000, 'notes') : Result.ok(),
  ];

  if (props.activities) {
    for (const activity of props.activities) {
      guards.push(
        Guard.againstNegative(activity.durationMinutes, 'activity.durationMinutes'),
      );

      if (
        activity.intervalsCompleted !== undefined &&
        activity.intervalsPlanned !== undefined
      ) {
        guards.push(
          Guard.againstNegative(activity.intervalsCompleted, 'intervalsCompleted'),
        );
        guards.push(
          Guard.againstNegativeOrZero(activity.intervalsPlanned, 'intervalsPlanned'),
        );
      }

      if (activity.exercises) {
        for (const exercise of activity.exercises) {
          guards.push(Guard.againstEmptyString(exercise.name, 'exercise.name'));
          guards.push(Guard.againstNegative(exercise.setsCompleted, 'setsCompleted'));
          guards.push(Guard.againstNegativeOrZero(exercise.setsPlanned, 'setsPlanned'));

          if (exercise.reps) {
            guards.push(
              Guard.isTrue(
                exercise.reps.length === exercise.setsCompleted,
                'reps array length must match setsCompleted',
              ),
            );
          }
          if (exercise.weight) {
            guards.push(
              Guard.isTrue(
                exercise.weight.length === exercise.setsCompleted,
                'weight array length must match setsCompleted',
              ),
            );
          }
        }
      }
    }
  }

  // --- 3. Add checks for heart rate (must be done after activity loops) ---
  if (props.heartRate) {
    if (props.heartRate.average !== undefined) {
      guards.push(
        Guard.againstNegativeOrZero(props.heartRate.average, 'heartRate.average'),
      );
    }
    if (props.heartRate.max !== undefined) {
      guards.push(Guard.againstNegativeOrZero(props.heartRate.max, 'heartRate.max'));
    }
    if (props.heartRate.average && props.heartRate.max) {
      guards.push(
        Guard.isTrue(
          props.heartRate.average <= props.heartRate.max,
          'average heart rate must be <= max heart rate',
        ),
      );
    }
  }

  const finalGuardResult = Guard.combine(guards); // Filter out false/undefined/null from conditional checks

  if (finalGuardResult.isFailure) {
    return Result.fail(finalGuardResult.error);
  }

  return Result.ok({
    startedAt: props.startedAt,
    completedAt: props.completedAt,
    durationMinutes, // This is the derived property
    activities: props.activities,
    perceivedExertion: props.perceivedExertion,
    energyLevel: props.energyLevel,
    enjoyment: props.enjoyment,
    difficultyRating: props.difficultyRating,
    heartRate: props.heartRate,
    caloriesBurned: props.caloriesBurned,
    notes: props.notes,
    injuries: props.injuries,
    modifications: props.modifications,
  });
}
