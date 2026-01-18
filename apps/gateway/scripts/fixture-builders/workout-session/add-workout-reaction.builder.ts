import type { AddWorkoutReactionResponse } from '@bene/training-application';

export function buildAddWorkoutReactionResponse(
  overrides?: Partial<AddWorkoutReactionResponse>
): AddWorkoutReactionResponse {
  const response: AddWorkoutReactionResponse = {
    workoutId: 'workout-123-uuid',
    totalReactions: 42,
  };

  return { ...response, ...overrides };
}
