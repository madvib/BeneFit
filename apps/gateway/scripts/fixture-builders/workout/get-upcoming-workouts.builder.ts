import { createWorkoutTemplateFixture, toWorkoutTemplateView } from '@bene/training-core';
import type { GetUpcomingWorkoutsResponse } from '@bene/training-application';

export function buildGetUpcomingWorkoutsResponse(
  overrides?: Partial<GetUpcomingWorkoutsResponse>
): GetUpcomingWorkoutsResponse {
  // Create 3 upcoming workouts
  const workouts = Array.from({ length: 3 }).map(() => {
    const template = createWorkoutTemplateFixture();
    return toWorkoutTemplateView(template);
  });

  const response: GetUpcomingWorkoutsResponse = {
    workouts,
  };

  return { ...response, ...overrides };
}
