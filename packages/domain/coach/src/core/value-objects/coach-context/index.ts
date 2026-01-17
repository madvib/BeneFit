// Export all parts of the Coach Context value object
export type {
  CurrentPlanContext,
  RecentWorkoutSummary,
  PerformanceTrends,
  CoachContext,
} from './coach-context.types.js';
export { TREND_MAPS } from './coach-context.types.js';
export { createCoachContext } from './coach-context.factory.js';
export * from './coach-context.presentation.js';
export { createCoachContextFixture, createCurrentPlanContextFixture, createRecentWorkoutSummaryFixture, createPerformanceTrendsFixture } from './test/coach-context.fixtures.js';
