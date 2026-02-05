import { describe, it, beforeEach, vi, expect } from 'vitest';
import { faker } from '@faker-js/faker';


import { Result } from '@bene/shared';
import { createUserProfileFixture } from '@bene/training-core/fixtures';

import { UserProfileRepository } from '@/repositories/user-profile-repository.js';

import { GetProfileUseCase } from '../get-profile.js';

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

  it('should successfully get user profile', async () => {
    // Arrange
    const userId = crypto.randomUUID();
    const mockProfile = createUserProfileFixture({
      userId,
      displayName: 'Test User Display Name',
      stats: {
        totalWorkouts: 25,
        totalMinutes: 750,
        totalVolume: 2500,
        currentStreak: 5,
        longestStreak: 10,
        lastWorkoutDate: faker.date.recent(),
        achievements: [],
        firstWorkoutDate: faker.date.past(),
        joinedAt: faker.date.past(),
      },
    });

    vi.mocked(mockProfileRepository.findById).mockResolvedValue(Result.ok(mockProfile));

    // Act
    const result = await useCase.execute({ userId });

    // Assert
    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.userId).toBe(userId);
      expect(result.value.displayName).toBe(mockProfile.displayName);
      expect(result.value.experienceProfile.level).toBe(mockProfile.experienceProfile.level);
      expect(result.value.fitnessGoals.primary).toBe(mockProfile.fitnessGoals.primary);
      expect(result.value.stats.totalWorkouts).toBe(25);
      expect(result.value.stats.currentStreak).toBe(5);
    }
  });

  it('should fail if profile is not found', async () => {
    // Arrange
    const userId = crypto.randomUUID();

    vi.mocked(mockProfileRepository.findById).mockResolvedValue(
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
