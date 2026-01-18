import { createFitnessPlanFixture, toFitnessPlanView } from '@bene/training-core';
import type { AdjustPlanBasedOnFeedbackResponse } from '@bene/training-application';

export function buildAdjustPlanBasedOnFeedbackResponse(
  overrides?: Partial<AdjustPlanBasedOnFeedbackResponse>
): AdjustPlanBasedOnFeedbackResponse {
  const plan = createFitnessPlanFixture();
  const planView = toFitnessPlanView(plan);

  const response: AdjustPlanBasedOnFeedbackResponse = {
    plan: planView,
    message: 'Your plan has been adjusted based on your feedback',
  };

  return { ...response, ...overrides };
}
