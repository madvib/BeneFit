import {
  createWorkoutTemplateListFixture,

} from '@bene/training-core/fixtures';
import { toWorkoutTemplateView } from '@bene/training-core';
import type { GetUpcomingWorkoutsResponse } from '../get-upcoming-workouts.js';

export function buildGetUpcomingWorkoutsResponse(
  overrides?: Partial<GetUpcomingWorkoutsResponse>
): GetUpcomingWorkoutsResponse {
  const workouts = createWorkoutTemplateListFixture(2);
  return {
    workouts: workouts.map(toWorkoutTemplateView),
    ...overrides,
  };
}
