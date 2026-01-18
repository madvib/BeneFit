import { createFitnessPlanFixture, FitnessPlanQueries } from '@bene/training-core';
import type { GeneratePlanFromGoalsResponse } from '@bene/training-application';

export function buildGeneratePlanFromGoalsResponse(
  overrides?: Partial<GeneratePlanFromGoalsResponse>
): GeneratePlanFromGoalsResponse {
  const plan = createFitnessPlanFixture();
  const firstWeek = plan.weeks[0];

  const response: GeneratePlanFromGoalsResponse = {
    planId: plan.id,
    name: plan.title,
    durationWeeks: plan.weeks.length,
    workoutsPerWeek: firstWeek?.workouts.length || 0,
    preview: FitnessPlanQueries.getPlanPreview(plan)
  };

  return { ...response, ...overrides };
}
