import { createFitnessPlanFixture, toFitnessPlanView } from '@bene/training-core';
import type { ActivatePlanResponse } from '@bene/training-application';

export function buildActivatePlanResponse(
  overrides?: Partial<ActivatePlanResponse>
): ActivatePlanResponse {
  // Create a plan in 'active' state
  const plan = createFitnessPlanFixture({ status: 'active' });
  const planView = toFitnessPlanView(plan);

  const response: ActivatePlanResponse = {
    plan: planView,
  };

  return { ...response, ...overrides };
}
