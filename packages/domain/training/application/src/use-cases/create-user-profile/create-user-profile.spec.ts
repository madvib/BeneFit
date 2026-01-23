import { describe, it, beforeEach, vi, expect } from 'vitest';
import { randomUUID } from 'crypto';

import { Result, EventBus } from '@bene/shared';
import { createUserProfileFixture } from '@bene/training-core/fixtures';

import { UserProfileRepository } from '@/repositories/user-profile-repository.js';

import { CreateUserProfileUseCase } from './create-user-profile.js';

// Mock repositories and services
const mockProfileRepository = {
  findById: vi.fn(),
  save: vi.fn(),
} as unknown as UserProfileRepository;

const mockEventBus = {
  publish: vi.fn(),
  subscribe: vi.fn(),
} as unknown as EventBus;

describe('CreateUserProfileUseCase', () => {
  let useCase: CreateUserProfileUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new CreateUserProfileUseCase(mockProfileRepository, mockEventBus);
  });

  it('should successfully create a user profile', async () => {
    // Arrange
    const userId = randomUUID();
    const profile = createUserProfileFixture({ userId, displayName: 'User' });

    const request = {
      userId: profile.userId,
      displayName: profile.displayName,
      timezone: profile.timezone,
      experienceProfile: profile.experienceProfile,
      fitnessGoals: profile.fitnessGoals,
      trainingConstraints: profile.trainingConstraints,
      bio: profile.bio,
    };

    vi.mocked(mockProfileRepository.findById).mockResolvedValue(Result.fail(new Error('Not found'))); // No existing profile
    vi.mocked(mockProfileRepository.save).mockResolvedValue(Result.ok());

    // Act
    const result = await useCase.execute(request);

    // Assert
    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.userId).toBe(userId);
      expect(result.value.displayName).toBe(profile.displayName);
      expect(result.value.experienceProfile.level).toBe(profile.experienceProfile.level);
    }
    expect(mockEventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: userId,
      }),
    );
  });

  it('should fail if profile already exists', async () => {
    // Arrange
    const userId = randomUUID();
    const profile = createUserProfileFixture({ userId });
    const request = {
      userId,
      displayName: profile.displayName,
      timezone: profile.timezone,
      experienceProfile: profile.experienceProfile,
      fitnessGoals: profile.fitnessGoals,
      trainingConstraints: profile.trainingConstraints,
    };

    const existingProfile = createUserProfileFixture({
      userId,
    });

    vi.mocked(mockProfileRepository.findById).mockResolvedValue(Result.ok(existingProfile));

    // Act
    const result = await useCase.execute(request);

    // Assert
    expect(result.isFailure).toBe(true);
    expect(result.errorMessage).toContain('already exists');
  });
});
