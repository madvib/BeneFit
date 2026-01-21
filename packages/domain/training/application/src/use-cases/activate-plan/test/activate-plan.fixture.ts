import { faker } from '@faker-js/faker';
import { Result } from '@bene/shared';
import {
  createFitnessPlanFixture,

} from '@bene/training-core/fixtures';
import {
  toFitnessPlanView,
  FitnessPlanCommands,
} from '@bene/training-core'
import type { ActivatePlanResponse } from '../activate-plan.js';

export interface ActivatePlanFixtureOptions {
  overrides?: Partial<ActivatePlanResponse>;
  temperature?: number; // 0 to 1, probability of returning a failure result
}

/**
 * Build ActivatePlanResponse fixture using domain fixture + commands
 * 
 * Pattern: Domain fixture → Domain command → View mapper → Use case response
 */
export function buildActivatePlanResponse(
  options: ActivatePlanFixtureOptions = {}
): Result<ActivatePlanResponse> {
  const { overrides, temperature = 0 } = options;

  // Simulate a failure based on temperature
  if (faker.datatype.boolean({ probability: temperature })) {
    return Result.fail(new Error('Plan is already active or cannot be activated'));
  }

  // 1. Create domain fixture
  const plan = createFitnessPlanFixture({ status: 'draft' });

  // 2. Apply activate command
  const activatedPlanResult = FitnessPlanCommands.activatePlan(plan);
  if (activatedPlanResult.isFailure) {
    return Result.fail(activatedPlanResult.error);
  }

  // 3. Map to view
  const planView = toFitnessPlanView(activatedPlanResult.value);

  // 4. Return result
  return Result.ok({
    plan: planView,
    ...overrides,
  });
}
