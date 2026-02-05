import { describe, it, beforeEach, vi, expect } from 'vitest';


import { Result, EventBus } from '@bene/shared';
import { createUserProfileFixture } from '@bene/training-core/fixtures';

import { UserProfileRepository } from '@/repositories/user-profile-repository.js';

import { UpdateFitnessGoalsUseCase } from './update-fitness-goals.js';

// Mock repositories and services
const mockProfileRepository = {
  findById: vi.fn(),
  save: vi.fn(),
} as unknown as UserProfileRepository;

const mockEventBus = {
  publish: vi.fn(),
  subscribe: vi.fn(),
} as unknown as EventBus;

describe('UpdateFitnessGoalsUseCase', () => {
  let useCase: UpdateFitnessGoalsUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new UpdateFitnessGoalsUseCase(mockProfileRepository, mockEventBus);
  });

  it('should successfully update fitness goals', async () => {
    // Arrange
    const userId = crypto.randomUUID();
    const newGoals = {
      primary: 'hypertrophy' as const,
      secondary: ['endurance'],
      motivation: 'Test motivation',
      successCriteria: ['test']
    };

    const mockProfile = createUserProfileFixture({
      userId,
      fitnessGoals: {
        primary: 'strength',
        secondary: [],
        motivation: 'Original motivation',
        successCriteria: []
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
      expect(result.value.goals.primary).toBe(newGoals.primary);
    }

    expect(mockProfileRepository.save).toHaveBeenCalled();
    expect(mockEventBus.publish).toHaveBeenCalled();
  });

  it('should fail if profile is not found', async () => {
    // Arrange
    const userId = crypto.randomUUID();
    const newGoals = {
      primary: 'hypertrophy' as const,
      secondary: [],
      motivation: 'Test motivation',
      successCriteria: ['test']
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
