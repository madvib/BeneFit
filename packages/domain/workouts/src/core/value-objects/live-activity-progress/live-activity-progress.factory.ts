import { Guard, Result } from '@bene/domain-shared';
import {
  IntervalProgress,
  ExerciseProgress,
  LiveActivityProgress,
} from './live-activity-progress.types.js';

export function createLiveActivityProgress(props: {
  activityType: 'warmup' | 'main' | 'cooldown' | 'interval' | 'circuit';
  activityIndex: number;
  totalActivities: number;
  intervalProgress?: IntervalProgress;
  exerciseProgress?: ExerciseProgress[];
}): Result<LiveActivityProgress> {
  const guardResult = Guard.combine([
    Guard.againstNullOrUndefinedBulk([
      { argument: props.activityType, argumentName: 'activityType' },
      { argument: props.activityIndex, argumentName: 'activityIndex' },
      { argument: props.totalActivities, argumentName: 'totalActivities' },
    ]),

    Guard.inRange(props.activityIndex, 0, props.totalActivities - 1, 'activityIndex'),
  ]);
  if (guardResult.isFailure) {
    return Result.fail(guardResult.error);
  }
  return Result.ok({
    activityType: props.activityType,
    activityIndex: props.activityIndex,
    totalActivities: props.totalActivities,
    intervalProgress: props.intervalProgress,
    exerciseProgress: props.exerciseProgress,
    activityStartedAt: new Date(),
    elapsedSeconds: 0,
  });
}
