
import { createWorkoutSessionFixture, } from '@bene/training-core/fixtures';
import { toWorkoutSessionView } from '@bene/training-core';
import type { StartWorkoutResponse } from '../start-workout.js';

export function buildStartWorkoutResponse(
  overrides?: Partial<StartWorkoutResponse>
): StartWorkoutResponse {
  const session = createWorkoutSessionFixture();
  return {
    session: toWorkoutSessionView(session),
    ...overrides,
  };
}
