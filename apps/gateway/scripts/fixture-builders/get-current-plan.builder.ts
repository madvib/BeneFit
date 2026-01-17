import { createFitnessPlanFixture, toFitnessPlanView } from '@bene/training-core';
import type { GetCurrentPlanResponse } from '@bene/training-application';

/**
 * Build a GetCurrentPlanResponse fixture using domain-level fixtures
 * and view mappers.
 * 
 * Pattern: Domain Fixture → View Mapper → API Response
 */
export function buildGetCurrentPlanResponse(
  variant: 'with-plan' | 'no-plan' = 'with-plan'
): GetCurrentPlanResponse {
  if (variant === 'no-plan') {
    return {
      hasPlan: false,
      message: 'No active plan. Create a plan to get started!',
    };
  }

  // 1. Create domain-level fixture (high-quality faker data)
  const planEntity = createFitnessPlanFixture();

  // 2. Apply view mapper (domain → API view model)
  const planView = toFitnessPlanView(planEntity);

  // 3. Build complete API response
  return {
    hasPlan: true,
    plan: planView,
  };
}
