import {
  GetUserProfileUseCase,
  UpdateUserProfileUseCase,
} from '@bene/application/auth';
import { authUserRepository } from './repositories.js';

// Instantiate account use cases as constants
export const getUserProfileUseCase = async () =>
  new GetUserProfileUseCase(await authUserRepository());
export const updateUserProfileUseCase = async () =>
  new UpdateUserProfileUseCase(await authUserRepository());

// Export all account-related use cases
export const accountUseCases = {
  getUserProfileUseCase,
  updateUserProfileUseCase,
};
