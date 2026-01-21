import { createFitnessPlanFixture } from '@bene/training-core/fixtures';
import { toFitnessPlanView } from '@bene/training-core';
import type { AdjustPlanBasedOnFeedbackResponse } from '../adjust-plan-based-on-feedback.js';

export function buildAdjustPlanBasedOnFeedbackResponse(
  overrides?: Partial<AdjustPlanBasedOnFeedbackResponse>
): AdjustPlanBasedOnFeedbackResponse {
  const plan = createFitnessPlanFixture();
  return {
    plan: toFitnessPlanView(plan),
    message: 'Your plan has been adjusted based on your feedback',
    ...overrides,
  };
}
