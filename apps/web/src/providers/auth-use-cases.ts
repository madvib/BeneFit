import {
  LoginUseCase,
  SignupUseCase,
  ResetPasswordUseCase,
  SignOutUseCase,
  GetCurrentUserUseCase,
  GetCurrentSessionUseCase,
} from '@bene/auth';
import { BetterAuthService } from '@bene/auth';

let auth: BetterAuthService;
const loadAuthService = async () => {
  if (!auth) {
    const container = await import('./repositories.js');
    auth = await container.authService();
  }
  return auth;
};

// Instantiate auth use cases as constants
export const loginUseCase = async () => new LoginUseCase(await loadAuthService());
export const signupUseCase = async () => new SignupUseCase(await loadAuthService());
export const resetPasswordUseCase = async () =>
  new ResetPasswordUseCase(await loadAuthService());
export const signOutUseCase = async () => new SignOutUseCase(await loadAuthService());
export const getCurrentUserUseCase = async () =>
  new GetCurrentUserUseCase(await loadAuthService());
export const getCurrentSessionUseCase = async () =>
  new GetCurrentSessionUseCase(await loadAuthService());

// Export all auth-related use cases
export const authUseCases = {
  loginUseCase,
  signupUseCase,
  resetPasswordUseCase,
  signOutUseCase,
  getCurrentUserUseCase,
  getCurrentSessionUseCase,
};
