import { GetActivityFeedUseCase } from '@bene/application/activities';
import { MockWorkoutRepository } from '@bene/infrastructure/activities';

// Create repository instance
const workoutRepository = new MockWorkoutRepository();

// Instantiate feed use cases as constants
export const getActivityFeedUseCase = new GetActivityFeedUseCase(workoutRepository);

// Export all feed-related use cases
export const feedUseCases = {
  getActivityFeedUseCase,
};