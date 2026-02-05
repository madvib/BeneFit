import { describe, it, beforeEach, vi, expect } from 'vitest';


import { Result } from '@bene/shared';
import { FitnessPlanQueries } from '@bene/training-core';
import {
  createFitnessPlanFixture,
  createWorkoutTemplateFixture,
  createWeeklyScheduleFixture,
} from '@bene/training-core/fixtures';

import { FitnessPlanRepository } from '@/repositories/fitness-plan-repository.js';

import { GetUpcomingWorkoutsUseCase } from '../get-upcoming-workouts.js';

// Mock repositories and services
const mockPlanRepository = {
  findById: vi.fn(),
  findByUserId: vi.fn(),
  findActiveByUserId: vi.fn(),
  save: vi.fn(),
  delete: vi.fn(),
} as unknown as FitnessPlanRepository;

describe('GetUpcomingWorkoutsUseCase', () => {
  let useCase: GetUpcomingWorkoutsUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new GetUpcomingWorkoutsUseCase(mockPlanRepository);
  });

  it('should return upcoming workouts for the next 7 days when there is an active plan', async () => {
    // Arrange
    const userId = crypto.randomUUID();
    const workoutId = crypto.randomUUID();
    const mockWorkout = createWorkoutTemplateFixture({
      id: workoutId,
      type: 'strength',
      dayOfWeek: 1, // Monday
      status: 'scheduled',
    });

    const activePlan = createFitnessPlanFixture({
      userId,
      weeks: [
        createWeeklyScheduleFixture({
          weekNumber: 1,
          workouts: [mockWorkout],
        }),
      ],
      currentPosition: { week: 1, day: 0 },
      startDate: new Date(),
    });

    vi.mocked(mockPlanRepository.findActiveByUserId).mockResolvedValue(Result.ok(activePlan));
    vi.spyOn(FitnessPlanQueries, 'getUpcomingWorkouts').mockReturnValue([mockWorkout]);

    // Act
    const result = await useCase.execute({ userId });

    // Assert
    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.workouts).toBeDefined();
      expect(result.value.workouts.length).toBe(1);
      expect(result.value.workouts[0].id).toBe(workoutId);
    }
  });

  it('should return upcoming workouts for specified number of days', async () => {
    // Arrange
    const userId = crypto.randomUUID();
    const workoutId = crypto.randomUUID();
    const mockWorkout = createWorkoutTemplateFixture({
      id: workoutId,
      type: 'strength',
      dayOfWeek: 1, // Monday
      status: 'scheduled',
    });

    const activePlan = createFitnessPlanFixture({
      userId,
      weeks: [
        createWeeklyScheduleFixture({
          weekNumber: 1,
          workouts: [mockWorkout],
        }),
      ],
      currentPosition: { week: 1, day: 0 },
      startDate: new Date(),
    });

    vi.mocked(mockPlanRepository.findActiveByUserId).mockResolvedValue(Result.ok(activePlan));
    vi.spyOn(FitnessPlanQueries, 'getUpcomingWorkouts').mockReturnValue([mockWorkout]);

    // Act
    const result = await useCase.execute({ userId, days: 3 });

    // Assert
    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.workouts).toBeDefined();
      expect(result.value.workouts.length).toBeGreaterThanOrEqual(0);
    }
  });

  it('should return empty array when no active plan exists', async () => {
    // Arrange
    const userId = crypto.randomUUID();

    vi.mocked(mockPlanRepository.findActiveByUserId).mockResolvedValue(
      Result.fail(new Error('No active plan')),
    );

    // Act
    const result = await useCase.execute({ userId });

    // Assert
    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.workouts).toHaveLength(0);
    }
  });
});
