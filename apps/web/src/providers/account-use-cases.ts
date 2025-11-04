import { MockAuthRepository } from '@bene/infrastructure/auth';
import { MockWorkoutRepository } from '@bene/infrastructure/activities';
import { GetUserProfileUseCase, UpdateUserProfileUseCase } from '@bene/application/auth';

// Create repository instances
const authRepository = new MockAuthRepository();
const workoutRepository = new MockWorkoutRepository();

// Instantiate account use cases as constants
export const getUserProfileUseCase = new GetUserProfileUseCase(authRepository, workoutRepository);
export const updateUserProfileUseCase = new UpdateUserProfileUseCase(authRepository);

// Export all account-related use cases
export const accountUseCases = {
  getUserProfileUseCase,
  updateUserProfileUseCase,
};