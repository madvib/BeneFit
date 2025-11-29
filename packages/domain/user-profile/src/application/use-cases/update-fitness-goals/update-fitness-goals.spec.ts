import { describe, it, beforeEach, vi, expect } from 'vitest';
import { Result } from '@bene/domain-shared';
import { UserProfile } from '@core/index.js';
import { UpdateFitnessGoalsUseCase } from './update-fitness-goals.js';
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

describe('UpdateFitnessGoalsUseCase', () => {
  let useCase: UpdateFitnessGoalsUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new UpdateFitnessGoalsUseCase(mockProfileRepository, mockEventBus);
  });

  it('should successfully update fitness goals', async () => {
    // Arrange
    const userId = 'user-123';
    const newGoals = { primary: 'hypertrophy', secondary: ['endurance'] };

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
      bio: undefined,
      location: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedProfile: UserProfile = {
      ...mockProfile,
      fitnessGoals: newGoals,
      updatedAt: new Date(),
    };

    mockProfileRepository.findById.mockResolvedValue(Result.ok(mockProfile));
    vi.mocked(
      vi.importActual('@core/index.js'),
    ).UserProfileCommands.updateFitnessGoals.mockReturnValue(Result.ok(updatedProfile));
    mockProfileRepository.save.mockResolvedValue(Result.ok());

    // Act
    const result = await useCase.execute({
      userId,
      goals: newGoals,
    });

    // Assert
    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.userId).toBe(userId);
      expect(result.value.goals).toEqual(newGoals);
      expect(result.value.suggestNewPlan).toBe(true); // Since primary goal changed
    }
    expect(mockEventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'FitnessGoalsUpdated',
        userId,
        oldGoals: mockProfile.fitnessGoals,
        newGoals,
        significantChange: true,
      }),
    );
  });

  it('should fail if profile is not found', async () => {
    // Arrange
    const userId = 'user-123';
    const newGoals = { primary: 'hypertrophy', secondary: [] };

    mockProfileRepository.findById.mockResolvedValue(Result.fail('Not found'));

    // Act
    const result = await useCase.execute({
      userId,
      goals: newGoals,
    });

    // Assert
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error).toBe('Profile not found');
    }
  });
});
