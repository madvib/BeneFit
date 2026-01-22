import { Result, type BaseFixtureOptions, handleFixtureOptions } from '@bene/shared';
import { createFitnessPlanFixture } from '@bene/training-core/fixtures';
import { toFitnessPlanView } from '@bene/training-core';
import type { AdjustPlanBasedOnFeedbackResponse } from '../adjust-plan-based-on-feedback.js';


export function buildAdjustPlanBasedOnFeedbackResponse(
  options: BaseFixtureOptions<AdjustPlanBasedOnFeedbackResponse> = {}
): Result<AdjustPlanBasedOnFeedbackResponse> {
  const { overrides } = options;

  const errorResult = handleFixtureOptions(options, 'Failed to adjust plan');
  if (errorResult) return errorResult;

  const plan = createFitnessPlanFixture();
  return Result.ok({
    plan: toFitnessPlanView(plan),
    message: 'Your plan has been adjusted based on your feedback',
    ...overrides,
  });
}
