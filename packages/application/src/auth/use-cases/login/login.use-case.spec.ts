import { describe, it, expect, beforeEach, vi, type Mocked } from 'vitest';
import { Result } from '@bene/core/shared';
import { LoginUseCase } from './login.use-case.js';
import { IAuthRepository } from '../../ports/auth.repository.js';
import { AuthError, InvalidCredentialsError } from '../../errors/index.js';

// Create a mock repository interface
type MockAuthRepository = Mocked<IAuthRepository>;

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;
  let mockAuthRepository: MockAuthRepository;

  beforeEach(() => {
    mockAuthRepository = {
      login: vi.fn(),
      signup: vi.fn(),
      resetPassword: vi.fn(),
      signOut: vi.fn(),
    } as unknown as MockAuthRepository;

    useCase = new LoginUseCase(mockAuthRepository);
  });

  describe('execute', () => {
    it('should return success when credentials are valid', async () => {
      // Arrange
      const input = { email: 'test@example.com', password: 'password123' };
      const expectedResult = { userId: '123', email: 'test@example.com' };

      mockAuthRepository.login.mockResolvedValue(Result.ok(expectedResult));

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value).toEqual(expectedResult);
      }
      expect(mockAuthRepository.login).toHaveBeenCalledWith(input);
    });

    it('should return failure when email is missing', async () => {
      // Arrange
      const input = { email: '', password: 'password123' };

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(result.isFailure).toBe(true);
      if (result.isFailure) {
        expect(result.error).toBeInstanceOf(AuthError);
        expect(result.error.message).toBe('Email and password are required');
      }
    });

    it('should return failure when password is missing', async () => {
      // Arrange
      const input = { email: 'test@example.com', password: '' };

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(result.isFailure).toBe(true);
      if (result.isFailure) {
        expect(result.error).toBeInstanceOf(AuthError);
        expect(result.error.message).toBe('Email and password are required');
      }
    });

    it('should return failure when email format is invalid', async () => {
      // Arrange
      const input = { email: 'invalid-email', password: 'password123' };

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(result.isFailure).toBe(true);
      if (result.isFailure) {
        expect(result.error).toBeInstanceOf(AuthError);
        expect(result.error.message).toBe('Invalid email format');
      }
    });

    it('should propagate repository errors', async () => {
      // Arrange
      const input = { email: 'test@example.com', password: 'password123' };
      const error = new InvalidCredentialsError();
      mockAuthRepository.login.mockResolvedValue(Result.fail(error));

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
      const input = {
        email: 'test@example.com',
        password: 'password123',
        next: '/dashboard',
      };

      // Act
      const validateInput = (useCase as any).validateInput(input);

      // Assert
      expect(validateInput.isSuccess).toBe(true);
    });

    it('should fail when email is empty', () => {
      // Arrange
      const input = { email: '', password: 'password123' };

      // Act
      const validateInput = (useCase as any).validateInput(input);

      // Assert
      expect(validateInput.isFailure).toBe(true);
      if (validateInput.isFailure) {
        expect(validateInput.error).toBeInstanceOf(AuthError);
        expect(validateInput.error.message).toBe(
          'Email and password are required',
        );
      }
    });

    it('should fail when password is empty', () => {
      // Arrange
      const input = { email: 'test@example.com', password: '' };

      // Act
      const validateInput = (useCase as any).validateInput(input);

      // Assert
      expect(validateInput.isFailure).toBe(true);
      if (validateInput.isFailure) {
        expect(validateInput.error).toBeInstanceOf(AuthError);
        expect(validateInput.error.message).toBe(
          'Email and password are required',
        );
      }
    });

    it('should fail when email format is invalid', () => {
      // Arrange
      const input = { email: 'invalid-email', password: 'password123' };

      // Act
      const validateInput = (useCase as any).validateInput(input);

      // Assert
      expect(validateInput.isFailure).toBe(true);
      if (validateInput.isFailure) {
        expect(validateInput.error).toBeInstanceOf(AuthError);
        expect(validateInput.error.message).toBe('Invalid email format');
      }
    });
  });
});
