import { Result, type BaseFixtureOptions, handleFixtureOptions } from '@bene/shared';
import {
  createUserProfileFixture,
} from '@bene/training-core/fixtures';
import { toFitnessGoalsView } from '@bene/training-core';
import type { UpdateFitnessGoalsResponse } from '../update-fitness-goals.js';


/**
 * Build UpdateFitnessGoalsResponse fixture using domain fixture + view mapper
 */
export function buildUpdateFitnessGoalsResponse(
  options: BaseFixtureOptions<UpdateFitnessGoalsResponse> = {}
): Result<UpdateFitnessGoalsResponse> {
  const { overrides } = options;

  const errorResult = handleFixtureOptions(options, 'Failed to update fitness goals');
  if (errorResult) return errorResult;

  const profile = createUserProfileFixture();
  const goalsView = toFitnessGoalsView(profile.fitnessGoals);

  return Result.ok({
    userId: profile.userId,
    goals: goalsView,
    suggestNewPlan: false,
    ...overrides,
  });
}
