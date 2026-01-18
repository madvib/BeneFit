import type { SkipWorkoutResponse } from '@bene/training-application';

export function buildSkipWorkoutResponse(
  overrides?: Partial<SkipWorkoutResponse>
): SkipWorkoutResponse {
  const response: SkipWorkoutResponse = {
    planId: 'plan-123-uuid',
    skippedWorkoutId: 'workout-456-uuid',
    message: 'Workout skipped. Your coach may adjust your plan.',
  };

  return { ...response, ...overrides };
}
