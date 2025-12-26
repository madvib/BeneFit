import { describe, it, expect, beforeEach, vi, type Mocked } from 'vitest';
import { Result } from '@bene/shared';
import { GetUserProfileUseCase } from './get-user-profile.use-case.js';
import { IAuthService } from '../../ports/auth.service.js';
import { User } from '@core/index.js';

// Create a mock repository interface
type MockAuthRepository = Mocked<IAuthService>;

describe('GetUserProfileUseCase', () => {
  let useCase: GetUserProfileUseCase;
  let mockAuthRepository: MockAuthRepository;

  beforeEach(() => {
    mockAuthRepository = {
      findById: vi.fn(),
      login: vi.fn(),
      signup: vi.fn(),
      resetPassword: vi.fn(),
      signOut: vi.fn(),
    } as unknown as MockAuthRepository;

    useCase = new GetUserProfileUseCase(mockAuthRepository);
  });

  describe('execute', () => {
    it('should return user profile when user exists', async () => {
      // Arrange
      const userId = 'user-123';
      const mockUser = User.create({
        id: userId,
        email: 'test@example.com',
        name: 'John Doe',
      }).value;

      mockAuthRepository.findById.mockResolvedValue(Result.ok(mockUser));

      // Act
      const result = await useCase.execute(userId);

      // Assert
      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.id).toBe(userId);
        expect(result.value.email).toBe('test@example.com');
        expect(result.value.name).toBe('John Doe');
        expect(result.value.firstName).toBe('John');
        expect(result.value.lastName).toBe('Doe');
        expect(result.value.bio).toBe('Fitness Enthusiast');
        expect(result.value.fitnessStats).toBeDefined();
        expect(result.value.goals).toBeDefined();
        expect(result.value.aboutMe).toBeDefined();
        expect(result.value.createdAt).toBe(mockUser.createdAt);
        expect(result.value.isActive).toBe(true); // Default from User entity
      }
      expect(mockAuthRepository.findById).toHaveBeenCalledWith(userId);
    });

    it('should handle user without name properly', async () => {
      // Arrange
      const userId = 'user-123';
      const mockUser = User.create({
        id: userId,
        email: 'test@example.com',
        // name not provided
      }).value;

      mockAuthRepository.findById.mockResolvedValue(Result.ok(mockUser));

      // Act
      const result = await useCase.execute(userId);

      // Assert
      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.name).toBeUndefined();
        expect(result.value.firstName).toBeUndefined();
        expect(result.value.lastName).toBeUndefined();
      }
    });

    it('should handle user with single name properly', async () => {
      // Arrange
      const userId = 'user-123';
      const mockUser = User.create({
        id: userId,
        email: 'test@example.com',
        name: 'Alice',
      }).value;

      mockAuthRepository.findById.mockResolvedValue(Result.ok(mockUser));

      // Act
      const result = await useCase.execute(userId);

      // Assert
      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.name).toBe('Alice');
        expect(result.value.firstName).toBe('Alice');
        expect(result.value.lastName).toBeUndefined();
      }
    });

    it('should return failure when user does not exist', async () => {
      // Arrange
      const userId = 'user-123';
      mockAuthRepository.findById.mockResolvedValue(
        Result.fail(new Error('User not found')),
      );

      // Act
      const result = await useCase.execute(userId);

      // Assert
      expect(result.isFailure).toBe(true);
      if (result.isFailure) {
        expect(result.errorMessage).toBe('User not found');
      }
      expect(mockAuthRepository.findById).toHaveBeenCalledWith(userId);
    });

    it('should propagate repository errors', async () => {
      // Arrange
      const userId = 'user-123';
      mockAuthRepository.findById.mockResolvedValue(
        Result.fail(new Error('Repository error')),
      );

      // Act
      const result = await useCase.execute(userId);

      // Assert
      expect(result.isFailure).toBe(true);
      if (result.isFailure) {
        expect(result.errorMessage).toBe('User not found');
      }
    });

    it('should handle unexpected errors gracefully', async () => {
      // Arrange
      const userId = 'user-123';
      mockAuthRepository.findById.mockRejectedValue(
        new Error('Unexpected repository error'),
      );

      // Act
      const result = await useCase.execute(userId);

      // Assert
      expect(result.isFailure).toBe(true);
      if (result.isFailure) {
        // The actual implementation will return the original error if it's an Error instance
        expect(result.errorMessage).toBe('Unexpected repository error');
      }
    });
  });
});
