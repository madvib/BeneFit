import { faker } from '@faker-js/faker';
import { Result } from '@bene/shared';
import {
  createFitnessPlanFixture
} from '@bene/training-core/fixtures';
import { FitnessPlanCommands } from '@bene/training-core';
import type { PausePlanResponse } from '../pause-plan.js';

export interface PausePlanFixtureOptions {
  overrides?: Partial<PausePlanResponse>;
  temperature?: number; // 0 to 1, probability of returning a failure result
}

export function buildPausePlanResponse(
  options: PausePlanFixtureOptions = {}
): Result<PausePlanResponse> {
  const { overrides, temperature = 0 } = options;

  // Internal RNG to decide outcome based on temperature
  if (faker.datatype.boolean({ probability: temperature })) {
    return Result.fail(new Error('Plan is already paused or in an invalid state'));
  }

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
