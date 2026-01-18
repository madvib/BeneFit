import { createWorkoutListFixture, toCompletedWorkoutView } from '@bene/training-core';
import type { GetWorkoutHistoryResponse } from '@bene/training-application';

export function buildGetWorkoutHistoryResponse(
  overrides?: Partial<GetWorkoutHistoryResponse>
): GetWorkoutHistoryResponse {
  const workouts = createWorkoutListFixture(5).map(toCompletedWorkoutView);
  const response: GetWorkoutHistoryResponse = {
    workouts,
    total: 24, // Realistic total count
  };

  return { ...response, ...overrides };
}
