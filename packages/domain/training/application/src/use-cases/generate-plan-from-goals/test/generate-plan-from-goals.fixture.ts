import {
  createFitnessPlanFixture,

} from '@bene/training-core/fixtures';
import { FitnessPlanQueries } from '@bene/training-core';
import type { GeneratePlanFromGoalsResponse } from '../generate-plan-from-goals.js';

/**
 * Build GeneratePlanFromGoalsResponse fixture using domain fixture + queries
 * 
 * Pattern: Domain fixture → Domain queries → Use case response
 */
export function buildGeneratePlanFromGoalsResponse(
  overrides?: Partial<GeneratePlanFromGoalsResponse>
): GeneratePlanFromGoalsResponse {
  // 1. Create domain fixture
  const plan = createFitnessPlanFixture();

  // 2. Use domain queries to compute fields
  const preview = FitnessPlanQueries.getPlanPreview(plan);

  // 3. Build response
  return {
    planId: plan.id,
    name: plan.title,
    durationWeeks: plan.weeks.length,
    workoutsPerWeek: plan.weeks[0]?.workouts.length || 0,
    preview,
    ...overrides,
  };
}
