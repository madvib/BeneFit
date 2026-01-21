import { createWorkoutListFixture } from '@bene/training-core/fixtures';
import { toCompletedWorkoutView } from '@bene/training-core';
import type { GetWorkoutHistoryResponse } from '../get-workout-history.js';

export function buildGetWorkoutHistoryResponse(
  overrides?: Partial<GetWorkoutHistoryResponse>
): GetWorkoutHistoryResponse {
  const workouts = createWorkoutListFixture(5);
  return {
    workouts: workouts.map(toCompletedWorkoutView),
    total: workouts.length,
    ...overrides,
  };
}
