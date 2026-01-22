import { describe, it, beforeEach, vi, expect } from 'vitest';
import { Result } from '@bene/shared';

import { CreateUserProfileUseCase } from './create-user-profile.js';
import { UserProfileRepository } from '../../repositories/user-profile-repository.js';
import { EventBus } from '@bene/shared';
import { createUserProfileFixture } from '@bene/training-core/fixtures';

// Mock repositories and services
const mockProfileRepository = {
  findById: vi.fn(),
  save: vi.fn(),
} as unknown as UserProfileRepository;

const mockEventBus = {
  publish: vi.fn(),
} as unknown as EventBus;



describe('CreateUserProfileUseCase', () => {
  let useCase: CreateUserProfileUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new CreateUserProfileUseCase(mockProfileRepository, mockEventBus);
  });

  const validUserId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

  it('should successfully create a user profile', async () => {
    // Arrange
    const request = {
      userId: validUserId,
      displayName: 'John Doe',
      timezone: 'America/New_York',
      experienceProfile: {
        level: 'intermediate' as const,
        history: { previousPrograms: [], sports: [], certifications: [] },
        capabilities: {
          canDoFullPushup: true,
          canDoFullPullup: false,
          canRunMile: true,
          canSquatBelowParallel: true,
        },
      },
      fitnessGoals: {
        primary: 'strength' as const,
        secondary: [],
        motivation: 'Get strong',
        successCriteria: [],
      },
      trainingConstraints: {
        availableDays: ['Monday', 'Wednesday', 'Friday'],
        availableEquipment: [],
        location: 'home' as const,
        maxDuration: 60,
        injuries: [],
      },
      bio: 'Fitness enthusiast',
    };



    vi.mocked(mockProfileRepository.findById).mockResolvedValue(Result.fail(new Error('Not found'))); // No existing profile

    vi.mocked(mockProfileRepository.save).mockResolvedValue(Result.ok());

    // Act
    const result = await useCase.execute(request as any);

    // Assert
    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.userId).toBe(validUserId);
      expect(result.value.displayName).toBe('John Doe');
      expect(result.value.experienceProfile.level).toBe('intermediate');
    }
    expect(mockEventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: validUserId,
      }),
    );
  });

  it('should fail if profile already exists', async () => {
    // Arrange
    const request = {
      userId: validUserId,
      displayName: 'John Doe',
      timezone: 'America/New_York',
      experienceProfile: {
        level: 'intermediate' as const,
        history: { previousPrograms: [], sports: [], certifications: [] },
        capabilities: {
          canDoFullPushup: true,
          canDoFullPullup: false,
          canRunMile: true,
          canSquatBelowParallel: true,
        },
      },
      fitnessGoals: {
        primary: 'strength' as const,
        secondary: [],
        motivation: 'Get strong',
        successCriteria: [],
      },
      trainingConstraints: {
        availableDays: ['Monday', 'Wednesday', 'Friday'],
        availableEquipment: [],
        location: 'home' as const,
        maxDuration: 60,
        injuries: [],
      },
    };

    const existingProfile = createUserProfileFixture({
      userId: validUserId,
    });

    vi.mocked(mockProfileRepository.findById).mockResolvedValue(Result.ok(existingProfile));

    // Act
    const result = await useCase.execute(request as any);

    // Assert
    expect(result.isFailure).toBe(true);
    expect(result.errorMessage).toContain('already exists');
  });
});
