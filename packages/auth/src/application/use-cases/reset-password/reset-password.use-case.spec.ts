import { describe, it, expect, beforeEach, vi, type Mocked } from 'vitest';
import { Result } from '@bene/shared-domain';
import { ResetPasswordUseCase, ResetPasswordInput } from './reset-password.use-case.js';
import { AuthError } from '../../errors/index.js';
import { IAuthService } from '../../index.js';

// Create a mock repository interface
type MockAuthRepository = Mocked<IAuthService>;

describe('ResetPasswordUseCase', () => {
  let useCase: ResetPasswordUseCase;
  let mockAuthRepository: MockAuthRepository;

  beforeEach(() => {
    mockAuthRepository = {
      login: vi.fn(),
      signup: vi.fn(),
      resetPassword: vi.fn(),
      signOut: vi.fn(),
    } as unknown as MockAuthRepository;

    useCase = new ResetPasswordUseCase(mockAuthRepository);
  });

  describe('execute', () => {
    it('should return success when reset password is valid', async () => {
      // Arrange
      const input = { email: 'test@example.com' };

      mockAuthRepository.resetPassword.mockResolvedValue(Result.ok(undefined));

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(result.isSuccess).toBe(true);
      expect(mockAuthRepository.resetPassword).toHaveBeenCalledWith(input);
    });

    it('should return failure when email is missing', async () => {
      // Arrange
      const input = { email: '' };

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(result.isFailure).toBe(true);
      if (result.isFailure) {
        expect(result.error).toBeInstanceOf(AuthError);
        expect(result.errorMessage).toBe('Email is required');
      }
    });

    it('should return failure when email format is invalid', async () => {
      // Arrange
      const input = { email: 'invalid-email' };

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(result.isFailure).toBe(true);
      if (result.isFailure) {
        expect(result.error).toBeInstanceOf(AuthError);
        expect(result.errorMessage).toBe('Invalid email format');
      }
    });

    it('should propagate repository errors', async () => {
      // Arrange
      const input = { email: 'test@example.com' };
      const error = new AuthError('Password reset failed');
      mockAuthRepository.resetPassword.mockResolvedValue(Result.fail(error));

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(result.isFailure).toBe(true);
      if (result.isFailure) {
        expect(result.error).toBe(error);
      }
    });
  });

  describe('validateInput', () => {
    it('should return success for valid input', () => {
      // Arrange
      const input = { email: 'test@example.com' };

      // Act
      const validateInput = (
        useCase as { validateInput(input: ResetPasswordInput): Result<void> }
      ).validateInput(input);

      // Assert
      expect(validateInput.isSuccess).toBe(true);
    });

    it('should fail when email is empty', () => {
      // Arrange
      const input = { email: '' };

      // Act
      const validateInput = (
        useCase as { validateInput(input: ResetPasswordInput): Result<void> }
      ).validateInput(input);

      // Assert
      expect(validateInput.isFailure).toBe(true);
      if (validateInput.isFailure) {
        expect(validateInput.error).toBeInstanceOf(AuthError);
        expect(validateInput.error.message).toBe('Email is required');
      }
    });

    it('should fail when email format is invalid', () => {
      // Arrange
      const input = { email: 'invalid-email' };

      // Act
      const validateInput = (
        useCase as { validateInput(input: ResetPasswordInput): Result<void> }
      ).validateInput(input);

      // Assert
      expect(validateInput.isFailure).toBe(true);
      if (validateInput.isFailure) {
        expect(validateInput.error).toBeInstanceOf(AuthError);
        expect(validateInput.error.message).toBe('Invalid email format');
      }
    });
  });
});
