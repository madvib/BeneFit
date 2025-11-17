import {
  GetUserProfileUseCase,
  UpdateUserProfileUseCase,
} from '@bene/application/auth';
import { authUserRepository } from './repositories.js';

// Instantiate account use cases as constants
export const getUserProfileUseCase = new GetUserProfileUseCase(authUserRepository);
export const updateUserProfileUseCase = new UpdateUserProfileUseCase(
  authUserRepository,
);

// Export all account-related use cases
export const accountUseCases = {
  getUserProfileUseCase,
  updateUserProfileUseCase,
};
