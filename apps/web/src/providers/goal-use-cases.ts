import { MockGoalsRepository } from '@bene/infrastructure/goals';
import { GetCurrentGoalUseCase, GetGoalsUseCase } from '@bene/application/goals';

// Create repository instances
const goalsRepository = new MockGoalsRepository();

// Instantiate use cases as constants
export const getCurrentGoalUseCase = new GetCurrentGoalUseCase(goalsRepository);
export const getGoalsUseCase = new GetGoalsUseCase(goalsRepository);

// Export all feed-related use cases
export const goalUseCases = {
  getCurrentGoalUseCase,
  getGoalsUseCase,
};
