import { createWorkoutTemplateFixture } from '@bene/training-core/fixtures';
import { toWorkoutTemplateView } from '@bene/training-core';
import type { GetTodaysWorkoutResponse } from '../get-todays-workout.js';

export function buildGetTodaysWorkoutResponse(
  overrides?: Partial<GetTodaysWorkoutResponse>
): GetTodaysWorkoutResponse {
  const workout = createWorkoutTemplateFixture();
  return {
    hasWorkout: true,
    workout: toWorkoutTemplateView(workout),
    ...overrides,
  };
}
