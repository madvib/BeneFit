import { createFitnessPlanFixture } from '@bene/training-core';
import type { PausePlanResponse } from '@bene/training-application';

export function buildPausePlanResponse(
  overrides?: Partial<PausePlanResponse>
): PausePlanResponse {
  const plan = createFitnessPlanFixture();

  const response: PausePlanResponse = {
    planId: plan.id,
    status: 'paused',
    pausedAt: new Date(),
  };

  return { ...response, ...overrides };
}
