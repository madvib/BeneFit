import { describe, it, beforeEach, vi, expect, Mock } from 'vitest';
import { Result } from '@bene/shared';
import { FitnessPlanQueries, createFitnessPlanFixture, createWorkoutTemplateFixture, createWeeklyScheduleFixture } from '@bene/training-core';
import { GetTodaysWorkoutUseCase } from './get-todays-workout.js';
import { FitnessPlanRepository } from '../../repositories/fitness-plan-repository.js';


// Mock repositories and services
const mockPlanRepository = {
  findById: vi.fn(),
  findByUserId: vi.fn(),
  findActiveByUserId: vi.fn(),
  save: vi.fn(),
  delete: vi.fn(),
} as unknown as FitnessPlanRepository;

describe('GetTodaysWorkoutUseCase', () => {
  let useCase: GetTodaysWorkoutUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new GetTodaysWorkoutUseCase(mockPlanRepository);
  });

  it("should return today's workout when there is an active plan with a workout", async () => {
    // Arrange
    const userId = 'user-123';
    const mockWorkout = createWorkoutTemplateFixture({
      id: 'workout-456',
      type: 'strength',
      dayOfWeek: 1, // Monday
      status: 'scheduled',
      activities: [
        {
          name: 'Bench Press',
          type: 'main',
          order: 1,
          instructions: ['Do 3 sets of 10 reps'],
          duration: 45,
        },
      ],
    });

    const activePlan = createFitnessPlanFixture({
      id: 'plan-789',
      userId,
      weeks: [
        createWeeklyScheduleFixture({
          weekNumber: 1,
          workouts: [mockWorkout],
        }),
      ],
      currentPosition: { week: 1, day: 1 },
      startDate: new Date(),
    });

    vi.mocked(mockPlanRepository.findActiveByUserId).mockResolvedValue(Result.ok(activePlan));
    vi.spyOn(FitnessPlanQueries, 'getCurrentWorkout').mockReturnValue(mockWorkout);

    // Act
    const result = await useCase.execute({ userId });

    // Assert
    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.hasWorkout).toBe(true);
      expect(result.value.workout).toBeDefined();
      expect(result.value.workout?.workoutId).toBe('workout-456');
      expect(result.value.workout?.type).toBe('strength');
      expect(result.value.workout?.durationMinutes).toBe(45);
    }
  });

  it('should return no active plan message when no active plan exists', async () => {
    // Arrange
    const userId = 'user-123';

    vi.mocked(mockPlanRepository.findActiveByUserId).mockResolvedValue(
      Result.fail(new Error('No active plan')),
    );

    // Act
    const result = await useCase.execute({ userId });

    // Assert
    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.hasWorkout).toBe(false);
      expect(result.value.message).toBe(
        'No active plan. Create a plan to get started!',
      );
    }
  });

  it('should return rest day message when there is no workout for today', async () => {
    // Arrange
    const userId = 'user-123';
    const activePlan = createFitnessPlanFixture({
      id: 'plan-789',
      userId,
      weeks: [
        createWeeklyScheduleFixture({
          weekNumber: 1,
          workouts: [],
        }),
      ],
      currentPosition: { week: 1, day: 1 },
    });

    vi.mocked(mockPlanRepository.findActiveByUserId).mockResolvedValue(Result.ok(activePlan));
    vi.spyOn(FitnessPlanQueries, 'getCurrentWorkout').mockReturnValue(undefined);

    // Act
    const result = await useCase.execute({ userId });

    // Assert
    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.hasWorkout).toBe(false);
      expect(result.value.message).toBe('Rest day! Enjoy your recovery.');
    }
  });

  it('should return already completed message when workout is already completed', async () => {
    // Arrange
    const userId = 'user-123';
    const mockWorkout = createWorkoutTemplateFixture({
      id: 'workout-456',
      type: 'strength',
      dayOfWeek: 1,
      status: 'completed',
      activities: [
        {
          name: 'Bench Press',
          type: 'main',
          order: 1,
          instructions: ['Do 3 sets of 10 reps'],
          duration: 45,
        },
      ],
    });

    const activePlan = createFitnessPlanFixture({
      id: 'plan-789',
      userId,
      weeks: [
        createWeeklyScheduleFixture({
          weekNumber: 1,
          workouts: [mockWorkout],
        }),
      ],
      currentPosition: { week: 1, day: 1 },
    });

    vi.mocked(mockPlanRepository.findActiveByUserId).mockResolvedValue(Result.ok(activePlan));
    vi.spyOn(FitnessPlanQueries, 'getCurrentWorkout').mockReturnValue(mockWorkout);

    // Act
    const result = await useCase.execute({ userId });

    // Assert
    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.hasWorkout).toBe(false);
      expect(result.value.message).toBe(
        "Already completed today's workout! Great job!",
      );
    }
  });
});
