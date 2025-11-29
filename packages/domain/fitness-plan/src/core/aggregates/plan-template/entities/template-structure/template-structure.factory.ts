import { Guard, Result } from '@bene/domain-shared';
import {
  TemplateDuration,
  TemplateFrequency,
  WeekTemplate,
  TemplateStructure,
} from './template-structure.types.js';

export function createTemplateStructure(props: {
  duration: TemplateDuration;
  frequency: TemplateFrequency;
  weeks: WeekTemplate[];
  deloadWeeks?: number[];
  progressionFormula?: string;
}): Result<TemplateStructure> {
  // Validate duration
  if (props.duration.type === 'fixed') {
    const durationResult = Guard.againstNegativeOrZero(
      props.duration.weeks,
      'duration.weeks',
    );
    if (durationResult.isFailure) return Result.fail(durationResult.error);
  } else {
    const minResult = Guard.againstNegativeOrZero(props.duration.min, 'duration.min');
    if (minResult.isFailure) return Result.fail(minResult.error);
    const maxResult = Guard.againstNegativeOrZero(props.duration.max, 'duration.max');
    if (maxResult.isFailure) return Result.fail(maxResult.error);
    const rangeResult = Guard.isTrue(
      props.duration.min <= props.duration.max,
      'duration.min must be <= duration.max',
    );
    if (rangeResult.isFailure) return Result.fail(rangeResult.error);
  }

  // Validate frequency
  if (props.frequency.type === 'fixed') {
    const freqResult = Guard.inRange(
      props.frequency.workoutsPerWeek,
      1,
      7,
      'frequency.workoutsPerWeek',
    );
    if (freqResult.isFailure) return Result.fail(freqResult.error);
  } else {
    const minResult = Guard.inRange(props.frequency.min, 1, 7, 'frequency.min');
    if (minResult.isFailure) return Result.fail(minResult.error);
    const maxResult = Guard.inRange(props.frequency.max, 1, 7, 'frequency.max');
    if (maxResult.isFailure) return Result.fail(maxResult.error);
    const rangeResult = Guard.isTrue(
      props.frequency.min <= props.frequency.max,
      'frequency.min must be <= frequency.max',
    );
    if (rangeResult.isFailure) return Result.fail(rangeResult.error);
  }

  // Validate weeks
  const weeksGuard = Guard.againstNullOrUndefined(props.weeks, 'weeks');
  if (weeksGuard.isFailure) return Result.fail(weeksGuard.error);
  const weeksLenGuard = Guard.isTrue(
    props.weeks.length > 0,
    'weeks array cannot be empty',
  );
  if (weeksLenGuard.isFailure) return Result.fail(weeksLenGuard.error);

  // Validate each week template
  for (const week of props.weeks) {
    if (typeof week.weekNumber === 'number') {
      const weekNumResult = Guard.againstNegativeOrZero(week.weekNumber, 'weekNumber');
      if (weekNumResult.isFailure) return Result.fail(weekNumResult.error);
    }
    const workoutLenResult = Guard.isTrue(
      week.workouts.length > 0,
      `week ${week.weekNumber} must have at least one workout`,
    );
    if (workoutLenResult.isFailure) return Result.fail(workoutLenResult.error);

    // Validate each workout in the week
    for (const workout of week.workouts) {
      if (workout.dayOfWeek !== undefined) {
        const dayResult = Guard.inRange(workout.dayOfWeek, 0, 6, 'workout.dayOfWeek');
        if (dayResult.isFailure) return Result.fail(dayResult.error);
      }
      if (typeof workout.durationMinutes === 'number') {
        const durResult = Guard.againstNegativeOrZero(
          workout.durationMinutes,
          'workout.durationMinutes',
        );
        if (durResult.isFailure) return Result.fail(durResult.error);
      }
      const actLenResult = Guard.isTrue(
        workout.activities.length > 0,
        'workout must have at least one activity',
      );
      if (actLenResult.isFailure) return Result.fail(actLenResult.error);
    }
  }

  return Result.ok({
    duration: props.duration,
    frequency: props.frequency,
    weeks: props.weeks,
    deloadWeeks: props.deloadWeeks,
    progressionFormula: props.progressionFormula,
  });
}
