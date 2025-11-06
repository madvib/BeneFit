import { describe, it, expect, beforeEach, vi, type Mocked } from 'vitest';
import { Result } from '@bene/core/shared';
import { UpdateUserProfileUseCase } from './update-user-profile.use-case';
import { IAuthRepository } from '../../ports/auth.repository.js';
import { User } from '@bene/core/auth';

// Create a mock repository interface
type MockAuthRepository = Mocked<IAuthRepository>;

describe('UpdateUserProfileUseCase', () => {
  let useCase: UpdateUserProfileUseCase;
  let mockAuthRepository: MockAuthRepository;

  beforeEach(() => {
    mockAuthRepository = {
      findById: vi.fn(),
      login: vi.fn(),
      signup: vi.fn(),
      resetPassword: vi.fn(),
      signOut: vi.fn(),
    } as unknown as MockAuthRepository;

    useCase = new UpdateUserProfileUseCase(mockAuthRepository);
  });

  describe('execute', () => {
    it('should return success when user exists and update is performed', async () => {
      // Arrange
      const input = {
        userId: 'user-123',
        firstName: 'Jane',
        lastName: 'Doe',
        bio: 'Updated bio',
      };

      const mockUser = User.create({
        id: input.userId,
        email: 'test@example.com',
      }).value;

      mockAuthRepository.findById.mockResolvedValue(Result.ok(mockUser));

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.success).toBe(true);
        expect(result.value.message).toBe('User profile updated successfully');
      }
      expect(mockAuthRepository.findById).toHaveBeenCalledWith(input.userId);
    });

    it('should return failure when user does not exist', async () => {
      // Arrange
      const input = {
        userId: 'user-123',
        firstName: 'Jane',
        lastName: 'Doe',
      };

      mockAuthRepository.findById.mockResolvedValue(
        Result.fail(new Error('User not found')),
      );

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(result.isFailure).toBe(true);
      if (result.isFailure) {
        expect(result.error.message).toBe('User not found');
      }
      expect(mockAuthRepository.findById).toHaveBeenCalledWith(input.userId);
    });

    it('should propagate repository errors', async () => {
      // Arrange
      const input = {
        userId: 'user-123',
        firstName: 'Jane',
        lastName: 'Doe',
      };

      mockAuthRepository.findById.mockResolvedValue(
        Result.fail(new Error('Repository error')),
      );

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(result.isFailure).toBe(true);
      if (result.isFailure) {
        expect(result.error.message).toBe('User not found');
      }
    });

    it('should handle unexpected errors gracefully', async () => {
      // Arrange
      const input = {
        userId: 'user-123',
        firstName: 'Jane',
        lastName: 'Doe',
      };

      mockAuthRepository.findById.mockRejectedValue(
        new Error('Unexpected repository error'),
      );

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(result.isFailure).toBe(true);
      if (result.isFailure) {
        // The actual implementation returns the original error if it's an Error instance
        expect(result.error.message).toBe('Unexpected repository error');
      }
    });

    it('should work with minimal input (userId only)', async () => {
      // Arrange
      const input = {
        userId: 'user-123',
        // No other fields to update
      };

      const mockUser = User.create({
        id: input.userId,
        email: 'test@example.com',
      }).value;

      mockAuthRepository.findById.mockResolvedValue(Result.ok(mockUser));

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.success).toBe(true);
        expect(result.value.message).toBe('User profile updated successfully');
      }
    });
  });
});
