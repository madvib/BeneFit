import { MockAuthRepository } from '@bene/infrastructure/auth';
import { LoginUseCase, SignupUseCase, ResetPasswordUseCase, SignOutUseCase } from '@bene/application/auth';

// Create repository instance
const authRepository = new MockAuthRepository();

// Instantiate auth use cases as constants
export const loginUseCase = new LoginUseCase(authRepository);
export const signupUseCase = new SignupUseCase(authRepository);
export const resetPasswordUseCase = new ResetPasswordUseCase(authRepository);
export const signOutUseCase = new SignOutUseCase(authRepository);

// Export all auth-related use cases
export const authUseCases = {
  loginUseCase,
  signupUseCase,
  resetPasswordUseCase,
  signOutUseCase,
};