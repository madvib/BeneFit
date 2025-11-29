import { describe, it, beforeEach, vi, expect } from 'vitest';
import { Result } from '@bene/domain-shared';
import { UserProfile } from '@core/index.js';
import { CreateUserProfileUseCase } from './create-user-profile.js';
import { UserProfileRepository } from '../../repositories/user-profile-repository.js';
import { EventBus } from '@bene/domain-shared';

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

  it('should successfully create a user profile', async () => {
    // Arrange
    const userId = 'user-123';
    const request = {
      userId,
      displayName: 'John Doe',
      timezone: 'America/New_York',
      experienceProfile: { level: 'intermediate' },
      fitnessGoals: { primary: 'strength', secondary: [] },
      trainingConstraints: { availableDays: ['Mon', 'Wed', 'Fri'] },
      bio: 'Fitness enthusiast',
    };

    const mockProfile: UserProfile = {
      userId,
      displayName: 'John Doe',
      timezone: 'America/New_York',
      experienceProfile: { level: 'intermediate' },
      fitnessGoals: { primary: 'strength', secondary: [] },
      trainingConstraints: { availableDays: ['Mon', 'Wed', 'Fri'] },
      preferences: {},
      stats: {
        totalWorkouts: 0,
        totalMinutes: 0,
        totalVolume: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastWorkoutDate: undefined,
        achievements: [],
      },
      avatar: undefined,
      bio: 'Fitness enthusiast',
      location: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockProfileRepository.findById.mockResolvedValue(Result.fail('Not found')); // No existing profile
    vi.mocked(vi.importActual('@core/index.js')).createUserProfile.mockReturnValue(
      Result.ok(mockProfile),
    ); // Mock factory
    mockProfileRepository.save.mockResolvedValue(Result.ok());

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
        type: 'ProfileCreated',
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
      experienceProfile: { level: 'intermediate' },
      fitnessGoals: { primary: 'strength', secondary: [] },
      trainingConstraints: { availableDays: ['Mon', 'Wed', 'Fri'] },
    };

    const existingProfile: UserProfile = {
      userId,
      displayName: 'Jane Smith',
      timezone: 'America/Los_Angeles',
      experienceProfile: { level: 'advanced' },
      fitnessGoals: { primary: 'hypertrophy', secondary: [] },
      trainingConstraints: { availableDays: ['Tue', 'Thu', 'Sat'] },
      preferences: {},
      stats: {
        totalWorkouts: 50,
        totalMinutes: 2500,
        totalVolume: 5000,
        currentStreak: 7,
        longestStreak: 14,
        lastWorkoutDate: new Date(),
        achievements: [],
      },
      avatar: undefined,
      bio: undefined,
      location: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockProfileRepository.findById.mockResolvedValue(Result.ok(existingProfile));

    // Act
    const result = await useCase.execute(request);

    // Assert
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error).toBe('Profile already exists for this user');
    }
  });

  it('should fail if profile creation fails', async () => {
    // Arrange
    const userId = 'user-123';
    const request = {
      userId,
      displayName: 'John Doe',
      timezone: 'America/New_York',
      experienceProfile: { level: 'intermediate' },
      fitnessGoals: { primary: 'strength', secondary: [] },
      trainingConstraints: { availableDays: ['Mon', 'Wed', 'Fri'] },
    };

    mockProfileRepository.findById.mockResolvedValue(Result.fail('Not found'));
    vi.mocked(vi.importActual('@core/index.js')).createUserProfile.mockReturnValue(
      Result.fail('Creation failed'),
    );

    // Act
    const result = await useCase.execute(request);

    // Assert
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error).toBe('Creation failed');
    }
  });
});
