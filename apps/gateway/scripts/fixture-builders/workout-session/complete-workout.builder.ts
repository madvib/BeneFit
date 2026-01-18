import { createMinimalCompletedWorkoutFixture, toCompletedWorkoutView } from '@bene/training-core';
import type { CompleteWorkoutResponse } from '@bene/training-application';

export function buildCompleteWorkoutResponse(
  overrides?: Partial<CompleteWorkoutResponse>
): CompleteWorkoutResponse {
  const workoutEntity = createMinimalCompletedWorkoutFixture();
  const workoutView = toCompletedWorkoutView(workoutEntity);

  const response: CompleteWorkoutResponse = {
    workout: workoutView,
    newStreak: 5,
    achievementsEarned: [
      {
        id: 'achievement-1',
        type: 'milestone',
        name: 'First 5K',
        description: 'Completed your first 5K run',
        earnedAt: new Date().toISOString(),
      },
    ] as any, // Cast to any if Achievement type isn't perfectly matching fixture
    stats: {
      totalWorkouts: 10,
      totalVolume: 5000,
      totalMinutes: 300,
    },
  };

  return { ...response, ...overrides };
}
