import { Result, type BaseFixtureOptions, handleFixtureOptions } from '@bene/shared';
import {
  createUserProfileFixture,
} from '@bene/training-core/fixtures';
import { toTrainingConstraintsView } from '@bene/training-core';
import type { UpdateTrainingConstraintsResponse } from '../update-training-constraints.js';

/**
 * Build UpdateTrainingConstraintsResponse fixture using domain fixture + view mapper
 */
export function buildUpdateTrainingConstraintsResponse(
  options: BaseFixtureOptions<UpdateTrainingConstraintsResponse> = {}
): Result<UpdateTrainingConstraintsResponse> {
  const { overrides } = options;

  const errorResult = handleFixtureOptions(options, 'Failed to update training constraints');
  if (errorResult) return errorResult;

  const profile = createUserProfileFixture();
  const constraintsView = toTrainingConstraintsView(profile.trainingConstraints);

  return Result.ok({
    userId: profile.userId,
    constraints: constraintsView,
    shouldAdjustPlan: false,
    ...overrides,
  });
}
