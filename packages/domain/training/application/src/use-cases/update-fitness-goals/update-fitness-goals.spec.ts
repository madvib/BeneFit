import { describe, it, beforeEach, vi, expect } from 'vitest';
import { Result, EventBus } from '@bene/shared';
import { createUserProfileFixture } from '@bene/training-core';
import { UpdateFitnessGoalsUseCase } from './update-fitness-goals.js';
import { UserProfileRepository } from '../../repositories/user-profile-repository.js';

// Mock repositories and services
const mockProfileRepository = {
  findById: vi.fn(),
  save: vi.fn(),
} as any;

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
    const newGoals = {
      primary: 'hypertrophy' as const,
      secondary: ['endurance'],
      motivation: 'Look better',
      successCriteria: ['Bigger muscles']
    };

    const mockProfile = createUserProfileFixture({
      userId,
      fitnessGoals: {
        primary: 'strength',
        secondary: [],
        motivation: 'Stay fit',
        successCriteria: ['Finish workouts']
      },
    });

    vi.mocked(mockProfileRepository.findById).mockResolvedValue(Result.ok(mockProfile));
    vi.mocked(mockProfileRepository.save).mockResolvedValue(Result.ok());

    // Act
    const result = await useCase.execute({
      userId,
      goals: newGoals,
    });

    // Assert
    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.userId).toBe(userId);
      expect(result.value.goals).toEqual(expect.objectContaining({
        primary: newGoals.primary,
        secondary: newGoals.secondary,
      }));
    }

    expect(mockProfileRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        userId,
        fitnessGoals: newGoals
      })
    );

    expect(mockEventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        eventName: 'FitnessGoalsUpdated',
        userId,
        newGoals: expect.objectContaining({
          primary: newGoals.primary,
        }),
        significantChange: true,
      }),
    );
  });

  it('should fail if profile is not found', async () => {
    // Arrange
    const userId = 'user-123';
    const newGoals = {
      primary: 'hypertrophy' as const,
      secondary: [],
      motivation: 'Get big',
      successCriteria: ['Bigger arms']
    };

    vi.mocked(mockProfileRepository.findById).mockResolvedValue(
      Result.fail(new Error('Profile not found')),
    );

    // Act
    const result = await useCase.execute({
      userId,
      goals: newGoals,
    });

    // Assert
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error).toBeInstanceOf(Error);
      expect((result.error as Error).message).toBe('Profile not found');
    }
  });
});
