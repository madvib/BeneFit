import {
  createUserProfileFixture,
} from '@bene/training-core/fixtures';
import { toTrainingConstraintsView } from '@bene/training-core';
import type { UpdateTrainingConstraintsResponse } from '../update-training-constraints.js';

/**
 * Build UpdateTrainingConstraintsResponse fixture using domain fixture + view mapper
 */
export function buildUpdateTrainingConstraintsResponse(
  overrides?: Partial<UpdateTrainingConstraintsResponse>
): UpdateTrainingConstraintsResponse {
  const profile = createUserProfileFixture();
  const constraintsView = toTrainingConstraintsView(profile.trainingConstraints);

  return {
    userId: profile.userId,
    constraints: constraintsView,
    shouldAdjustPlan: false,
    ...overrides,
  };
}
