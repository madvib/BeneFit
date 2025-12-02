import { describe, it, beforeEach, vi, expect } from 'vitest';
import { Result } from '@bene/domain-shared';
import { GetProfileUseCase } from './get-profile.js';
import { UserProfileRepository } from '../../repositories/user-profile-repository.js';

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
    const userId = 'user-123';

    const mockProfile = {
      userId,
      displayName: 'John Doe',
      timezone: 'America/New_York',
      experienceProfile: { level: 'intermediate' as const },
      fitnessGoals: { primary: 'strength', secondary: [] },
      trainingConstraints: { availableDays: ['Mon', 'Wed', 'Fri'] },
      preferences: {},
      stats: {
        totalWorkouts: 25,
        totalMinutes: 750,
        totalVolume: 2500,
        currentStreak: 5,
        longestStreak: 10,
        lastWorkoutDate: new Date(),
        achievements: [],
      },
      avatar: 'avatar-url',
      bio: 'Fitness enthusiast',
      location: 'New York',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastActiveAt: new Date(),
    };

    mockProfileRepository.findById.mockResolvedValue(Result.ok(mockProfile));

    // Act
    const result = await useCase.execute({ userId });

    // Assert
    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.userId).toBe(userId);
      expect(result.value.displayName).toBe('John Doe');
      expect(result.value.experienceLevel).toBe('intermediate');
      expect(result.value.primaryGoal).toBe('strength');
      expect(result.value.totalWorkouts).toBe(25);
      expect(result.value.currentStreak).toBe(5);
    }
  });

  it('should fail if profile is not found', async () => {
    // Arrange
    const userId = 'user-123';

    mockProfileRepository.findById.mockResolvedValue(Result.fail(new Error('Profile not found')));

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
