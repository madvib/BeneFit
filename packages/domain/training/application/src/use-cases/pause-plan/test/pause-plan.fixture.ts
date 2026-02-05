import { Result, type BaseFixtureOptions, handleFixtureOptions } from '@bene/shared';
import {
  createFitnessPlanFixture
} from '@bene/training-core/fixtures';
import { FitnessPlanCommands } from '@bene/training-core';
import type { PausePlanResponse } from '../pause-plan.js';

export type PausePlanFixtureOptions = BaseFixtureOptions<PausePlanResponse>;

export function buildPausePlanResponse(
  options: PausePlanFixtureOptions = {}
): Result<PausePlanResponse> {
  const { overrides } = options;

  const errorResult = handleFixtureOptions(options, 'Plan is already paused or in an invalid state');
  if (errorResult) return errorResult;

  const plan = createFitnessPlanFixture({ status: 'active' });
  const pausedResult = FitnessPlanCommands.pausePlan(plan, 'Testing');

  if (pausedResult.isFailure) {
    return Result.fail(pausedResult.error);
  }

  return Result.ok({
    planId: pausedResult.value.id,
    status: pausedResult.value.status,
    pausedAt: new Date(),
    ...overrides,
  });
}
