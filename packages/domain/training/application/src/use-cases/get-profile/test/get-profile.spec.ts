import { describe, it, beforeEach, vi, expect } from 'vitest';
import { Result } from '@bene/shared';
import { GetProfileUseCase } from '../get-profile.js';
import { UserProfileRepository } from '../../../repositories/user-profile-repository.js';

import { createUserProfileFixture } from '@bene/training-core/fixtures';

// Mock repositories
const mockProfileRepository = {
  findById: vi.fn(),
  save: vi.fn(),
} as unknown as UserProfileRepository;

describe('GetProfileUseCase', () => {
  let useCase: GetProfileUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new GetProfileUseCase(mockProfileRepository);
  });

  const validUserId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

  it('should successfully get user profile', async () => {
    // Arrange
    const mockProfile = createUserProfileFixture({
      userId: validUserId,
      displayName: 'John Doe',
      stats: {
        totalWorkouts: 25,
        totalMinutes: 750,
        totalVolume: 2500,
        currentStreak: 5,
        longestStreak: 10,
        lastWorkoutDate: new Date(),
        achievements: [],
      } as any,
    });

    vi.mocked(mockProfileRepository.findById).mockResolvedValue(Result.ok(mockProfile));

    // Act
    const result = await useCase.execute({ userId: validUserId });

    // Assert
    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.userId).toBe(validUserId);
      expect(result.value.displayName).toBe('John Doe');
      expect(result.value.experienceLevel).toBe(mockProfile.experienceProfile.level);
      expect(result.value.primaryGoal).toBe(mockProfile.fitnessGoals.primary);
      expect(result.value.totalWorkouts).toBe(25);
      expect(result.value.currentStreak).toBe(5);
    }
  });

  it('should fail if profile is not found', async () => {
    // Arrange
    const userId = 'user-123';

    mockProfileRepository.findById.mockResolvedValue(
      Result.fail(new Error('Profile not found')),
    );

    // Act
    const result = await useCase.execute({ userId });

    // Assert
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error).toBeInstanceOf(Error);
      expect((result.error as Error).message).toBe('Profile not found');
    }
  });
});
