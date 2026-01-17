import { describe, it, beforeEach, vi, expect } from 'vitest';
import { Result } from '@bene/shared';
import { UserProfile } from '@bene/training-core';
import { CreateUserProfileUseCase } from './create-user-profile.js';
import { UserProfileRepository } from '../../repositories/user-profile-repository.js';
import { EventBus } from '@bene/shared';
import { createUserProfile, createUserProfileFixture } from '@bene/training-core';

// Mock repositories and services
const mockProfileRepository = {
  findById: vi.fn(),
  save: vi.fn(),
} as unknown as UserProfileRepository;

const mockEventBus = {
  publish: vi.fn(),
} as unknown as EventBus;

vi.mock('@bene/training-core', async () => {
  const actual =
    await vi.importActual<typeof import('@bene/training-core')>('@bene/training-core');
  return {
    ...actual,
    createUserProfile: vi.fn(),
  };
});

describe('CreateUserProfileUseCase', () => {
  let useCase: CreateUserProfileUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new CreateUserProfileUseCase(mockProfileRepository, mockEventBus);
  });

  it('should successfully create a user profile', async () => {
    // Arrange
    const userId = 'user-123';
    const request = {
      userId,
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
        lastAssessmentDate: new Date().toISOString(),
      },
      fitnessGoals: {
        primary: 'strength' as const,
        secondary: [],
        motivation: 'Get strong',
        successCriteria: [],
      },
      trainingConstraints: {
        availableDays: ['monday', 'wednesday', 'friday'],
        availableEquipment: [],
        location: 'home',
        maxDuration: 60,
        timeConstraints: [],
        injuries: [],
      },
      bio: 'Fitness enthusiast',
    };

    const mockProfile = createUserProfileFixture({
      userId,
      displayName: 'John Doe',
    });

    vi.mocked(mockProfileRepository.findById).mockResolvedValue(Result.fail(new Error('Not found'))); // No existing profile
    vi.mocked(createUserProfile).mockReturnValue(Result.ok(mockProfile)); // Mock factory
    vi.mocked(mockProfileRepository.save).mockResolvedValue(Result.ok());

    // Act
    const result = await useCase.execute(request);

    // Assert
    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.userId).toBe(userId);
      expect(result.value.displayName).toBe('John Doe');
      expect(result.value.profileComplete).toBe(true);
    }
    expect(mockEventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        eventName: 'ProfileCreated',
        userId,
      }),
    );
  });

  it('should fail if profile already exists', async () => {
    // Arrange
    const userId = 'user-123';
    const request = {
      userId,
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
        lastAssessmentDate: new Date().toISOString(),
      },
      fitnessGoals: {
        primary: 'strength' as const,
        secondary: [],
        motivation: 'Get strong',
        successCriteria: [],
      },
      trainingConstraints: {
        availableDays: ['monday', 'wednesday', 'friday'],
        availableEquipment: [],
        location: 'home',
        maxDuration: 60,
        timeConstraints: [],
        injuries: [],
      },
    };

    const existingProfile = createUserProfileFixture({
      userId,
    });

    vi.mocked(mockProfileRepository.findById).mockResolvedValue(Result.ok(existingProfile));

    // Act
    const result = await useCase.execute(request);

    // Assert
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error).toBeInstanceOf(Error);
      expect((result.error as Error).message).toBe(
        'Profile already exists for this user',
      );
    }
  });

  it('should fail if profile creation fails', async () => {
    // Arrange
    const userId = 'user-123';
    const request = {
      userId,
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
        lastAssessmentDate: new Date().toISOString(),
      },
      fitnessGoals: {
        primary: 'strength' as const,
        secondary: [],
        motivation: 'Get strong',
        successCriteria: [],
      },
      trainingConstraints: {
        availableDays: ['monday', 'wednesday', 'friday'],
        availableEquipment: [],
        location: 'home',
        maxDuration: 60,
        timeConstraints: [],
        injuries: [],
      },
    };

    vi.mocked(mockProfileRepository.findById).mockResolvedValue(Result.fail(new Error('Not found')));
    vi.mocked(createUserProfile).mockReturnValue(
      Result.fail(new Error('Creation failed')),
    );

    // Act
    const result = await useCase.execute(request);

    // Assert
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error).toBeInstanceOf(Error);
      expect((result.error as Error).message).toBe('Creation failed');
    }
  });
});
