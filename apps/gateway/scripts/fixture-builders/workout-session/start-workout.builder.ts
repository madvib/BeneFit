import { createWorkoutSessionFixture, toWorkoutSessionSchema } from '@bene/training-core';
import type { StartWorkoutResponse } from '@bene/training-application';

export function buildStartWorkoutResponse(
  overrides?: Partial<StartWorkoutResponse>
): StartWorkoutResponse {
  const sessionEntity = createWorkoutSessionFixture();
  const sessionView = toWorkoutSessionSchema(sessionEntity);

  const response: StartWorkoutResponse = {
    session: sessionView,
  };

  return { ...response, ...overrides };
}
