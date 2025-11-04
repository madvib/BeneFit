import { MockWorkoutRepository } from '@bene/infrastructure/activities';
import {
  GetWorkoutHistoryUseCase,
  GetActivityFeedUseCase,
} from '@bene/application/activities';

// Create repository instances
const workoutRepository = new MockWorkoutRepository();

// Instantiate use cases as constants
export const getWorkoutHistoryUseCase = new GetWorkoutHistoryUseCase(workoutRepository);
export const getActivityFeedUseCase = new GetActivityFeedUseCase(workoutRepository);

// Export all activity use cases
export const activityUseCases = {
  getWorkoutHistoryUseCase,
  getActivityFeedUseCase,
};
