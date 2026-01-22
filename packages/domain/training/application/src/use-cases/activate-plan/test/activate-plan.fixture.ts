import { Result, type BaseFixtureOptions, handleFixtureOptions } from '@bene/shared';
import {
  createFitnessPlanFixture,

} from '@bene/training-core/fixtures';
import {
  toFitnessPlanView,
  FitnessPlanCommands,
} from '@bene/training-core'
import type { ActivatePlanResponse } from '../activate-plan.js';


/**
 * Build ActivatePlanResponse fixture using domain fixture + commands
 * 
 * Pattern: Domain fixture → Domain command → View mapper → Use case response
 */
export function buildActivatePlanResponse(
  options: BaseFixtureOptions<ActivatePlanResponse> = {}
): Result<ActivatePlanResponse> {
  const { overrides } = options;

  const errorResult = handleFixtureOptions(options, 'Plan is already active or cannot be activated');
  if (errorResult) return errorResult;

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
