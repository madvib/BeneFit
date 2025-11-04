import { MockCoachRepository, MockRecommendationsRepository } from '@bene/infrastructure/coach';
import {
  GetSavedChatsUseCase,
  GetInitialMessagesUseCase,
  GetRecommendationsUseCase,
} from '@bene/application/coach';

// Create repository instances
const coachRepository = new MockCoachRepository();
const recommendationsRepository = new MockRecommendationsRepository();

// Instantiate use cases as constants
export const getSavedChatsUseCase = new GetSavedChatsUseCase(coachRepository);
export const getInitialMessagesUseCase = new GetInitialMessagesUseCase(coachRepository);
export const getRecommendationsUseCase = new GetRecommendationsUseCase(recommendationsRepository);

// Export all coach use cases
export const coachUseCases = {
  getSavedChatsUseCase,
  getInitialMessagesUseCase,
  getRecommendationsUseCase,
};