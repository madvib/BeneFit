import {
  createFitnessPlanFixture

} from '@bene/training-core/fixtures';
import { toFitnessPlanView } from '@bene/training-core';
import type { GetCurrentPlanResponse } from '../get-current-plan.js';

/**
 * Build GetCurrentPlanResponse fixture using domain fixture + view mapper
 * 
 * Pattern: Domain fixture → View mapper → Use case response
 */
export function buildGetCurrentPlanResponse(
  overrides?: Partial<GetCurrentPlanResponse>
): GetCurrentPlanResponse {
  // 1. Create domain fixture
  const plan = createFitnessPlanFixture();

  // 2. Map to view
  const planView = toFitnessPlanView(plan);

  // 3. Apply any overrides and return
  return {
    plan: planView,
    ...overrides,
  };
}
