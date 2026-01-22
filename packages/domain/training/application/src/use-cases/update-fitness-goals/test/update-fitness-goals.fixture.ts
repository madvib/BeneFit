import {
  createUserProfileFixture,
} from '@bene/training-core/fixtures';
import { toFitnessGoalsView } from '@bene/training-core';
import type { UpdateFitnessGoalsResponse } from '../update-fitness-goals.js';

/**
 * Build UpdateFitnessGoalsResponse fixture using domain fixture + view mapper
 */
export function buildUpdateFitnessGoalsResponse(
  overrides?: Partial<UpdateFitnessGoalsResponse>
): UpdateFitnessGoalsResponse {
  const profile = createUserProfileFixture();
  const goalsView = toFitnessGoalsView(profile.fitnessGoals);

  return {
    userId: profile.userId,
    goals: goalsView,
    suggestNewPlan: false,
    ...overrides,
  };
}
