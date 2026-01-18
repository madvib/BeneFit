import { createWorkoutTemplateFixture, toWorkoutTemplateView } from '@bene/training-core';
import type { GetTodaysWorkoutResponse } from '@bene/training-application';

export function buildGetTodaysWorkoutResponse(
  overrides?: Partial<GetTodaysWorkoutResponse>
): GetTodaysWorkoutResponse {
  // Create a domain fixture for the workout template
  const workoutEntity = createWorkoutTemplateFixture();

  // Convert to view using the domain mapper
  const workoutView = toWorkoutTemplateView(workoutEntity);

  const response: GetTodaysWorkoutResponse = {
    hasWorkout: true,
    workout: workoutView,
  };

  return { ...response, ...overrides };
}
