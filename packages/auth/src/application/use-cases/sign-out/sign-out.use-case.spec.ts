import { describe, it, expect, beforeEach, vi, type Mocked } from 'vitest';
import { Result } from '@bene/shared';
import { SignOutUseCase } from './sign-out.use-case.js';
import { AuthError } from '../../errors/index.js';
import { IAuthService } from '../../ports/auth.service.js';

// Create a mock repository interface
type MockAuthRepository = Mocked<IAuthService>;

describe('SignOutUseCase', () => {
  let useCase: SignOutUseCase;
  let mockAuthRepository: MockAuthRepository;

  beforeEach(() => {
    mockAuthRepository = {
      login: vi.fn(),
      signup: vi.fn(),
      resetPassword: vi.fn(),
      signOut: vi.fn(),
    } as unknown as MockAuthRepository;

    useCase = new SignOutUseCase(mockAuthRepository);
  });

  describe('execute', () => {
    it('should return success when sign out is successful', async () => {
      // Arrange
      mockAuthRepository.signOut.mockResolvedValue(Result.ok(undefined));

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result.isSuccess).toBe(true);
      expect(mockAuthRepository.signOut).toHaveBeenCalled();
    });

    it('should propagate repository errors', async () => {
      // Arrange
      const error = new AuthError('Sign out failed');
      mockAuthRepository.signOut.mockResolvedValue(Result.fail(error));

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result.isFailure).toBe(true);
      if (result.isFailure) {
        expect(result.error).toBe(error);
      }
    });
  });

  // SignOut doesn't have input validation, so no need for validateInput tests
});
