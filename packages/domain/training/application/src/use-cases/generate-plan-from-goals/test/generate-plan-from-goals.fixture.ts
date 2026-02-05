import { Result, type BaseFixtureOptions, handleFixtureOptions } from '@bene/shared';
import {
  createFitnessPlanFixture,
} from '@bene/training-core/fixtures';
import { FitnessPlanQueries } from '@bene/training-core';
import type { GeneratePlanFromGoalsResponse } from '../generate-plan-from-goals.js';

export type GeneratePlanFromGoalsFixtureOptions = BaseFixtureOptions<GeneratePlanFromGoalsResponse>;

/**
 * Build GeneratePlanFromGoalsResponse fixture using domain fixture + queries
 * 
 * Pattern: Domain fixture → Domain queries → Use case response
 */
export function buildGeneratePlanFromGoalsResponse(
  options: GeneratePlanFromGoalsFixtureOptions = {}
): Result<GeneratePlanFromGoalsResponse> {
  const { overrides } = options;

  const errorResult = handleFixtureOptions(options, 'Plan generation failed');
  if (errorResult) return errorResult;

  // 1. Create domain fixture
  const plan = createFitnessPlanFixture();

  // 2. Use domain queries to compute fields
  const preview = FitnessPlanQueries.getPlanPreview(plan);

  // 3. Build response
  return Result.ok({
    planId: plan.id,
    name: plan.title,
    durationWeeks: plan.weeks.length,
    workoutsPerWeek: plan.weeks[0]?.workouts.length || 0,
    preview,
    ...overrides,
  });
}
