import { describe, it, beforeEach, vi, expect } from 'vitest';
import { Result } from '@bene/core/shared';
import { WorkoutPlan, WorkoutPlanQueries } from '@bene/core/plans';
import { WorkoutTemplate } from '@bene/core/plans';
import { GetTodaysWorkoutUseCase } from './get-todays-workout';
import { WorkoutPlanRepository } from '../../../repositories/workout-plan-repository';

// Mock repositories and services
const mockPlanRepository = {
  findById: vi.fn(),
  findByUserId: vi.fn(),
  findActiveByUserId: vi.fn(),
  save: vi.fn(),
  delete: vi.fn(),
} as unknown as WorkoutPlanRepository;

describe('GetTodaysWorkoutUseCase', () => {
  let useCase: GetTodaysWorkoutUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new GetTodaysWorkoutUseCase(mockPlanRepository);
  });

  it('should return today\'s workout when there is an active plan with a workout', async () => {
    // Arrange
    const userId = 'user-123';
    const mockWorkout: WorkoutTemplate = {
      id: 'workout-456',
      type: 'strength',
      duration: 45,
      dayOfWeek: 1, // Monday
      status: 'scheduled',
      activities: [
        {
          type: 'main',
          instructions: 'Do 3 sets of 10 reps',
          duration: 30,
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const activePlan: WorkoutPlan = {
      id: 'plan-789',
      userId,
      title: 'Strength Plan',
      description: 'A plan for building strength',
      planType: 'strength_program',
      goals: { goalType: 'strength', target: 'build muscle' },
      progression: { strategy: 'linear' },
      constraints: { equipment: [], injuries: [], timeConstraints: [] },
      weeks: [{
        weekNumber: 1,
        workouts: [mockWorkout],
        workoutsCompleted: 0,
      }],
      status: 'active',
      currentPosition: { week: 1, day: 1 }, // Currently on Monday of week 1
      startDate: new Date().toISOString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPlanRepository.findActiveByUserId.mockResolvedValue(Result.ok(activePlan));
    vi.spyOn(WorkoutPlanQueries, 'getCurrentWorkout').mockReturnValue(mockWorkout);

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

    mockPlanRepository.findActiveByUserId.mockResolvedValue(Result.fail(new Error('No active plan')));

    // Act
    const result = await useCase.execute({ userId });

    // Assert
    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.hasWorkout).toBe(false);
      expect(result.value.message).toBe('No active plan. Create a plan to get started!');
    }
  });

  it('should return rest day message when there is no workout for today', async () => {
    // Arrange
    const userId = 'user-123';
    const activePlan: WorkoutPlan = {
      id: 'plan-789',
      userId,
      title: 'Strength Plan',
      description: 'A plan for building strength',
      planType: 'strength_program',
      goals: { goalType: 'strength', target: 'build muscle' },
      progression: { strategy: 'linear' },
      constraints: { equipment: [], injuries: [], timeConstraints: [] },
      weeks: [{
        weekNumber: 1,
        workouts: [],
        workoutsCompleted: 0,
      }],
      status: 'active',
      currentPosition: { week: 1, day: 1 }, // Currently on Monday of week 1
      startDate: new Date().toISOString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPlanRepository.findActiveByUserId.mockResolvedValue(Result.ok(activePlan));
    vi.spyOn(WorkoutPlanQueries, 'getCurrentWorkout').mockReturnValue(undefined);

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
    const mockWorkout: WorkoutTemplate = {
      id: 'workout-456',
      type: 'strength',
      duration: 45,
      dayOfWeek: 1, // Monday
      status: 'completed',
      activities: [
        {
          type: 'main',
          instructions: 'Do 3 sets of 10 reps',
          duration: 30,
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const activePlan: WorkoutPlan = {
      id: 'plan-789',
      userId,
      title: 'Strength Plan',
      description: 'A plan for building strength',
      planType: 'strength_program',
      goals: { goalType: 'strength', target: 'build muscle' },
      progression: { strategy: 'linear' },
      constraints: { equipment: [], injuries: [], timeConstraints: [] },
      weeks: [{
        weekNumber: 1,
        workouts: [mockWorkout],
        workoutsCompleted: 0,
      }],
      status: 'active',
      currentPosition: { week: 1, day: 1 }, // Currently on Monday of week 1
      startDate: new Date().toISOString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPlanRepository.findActiveByUserId.mockResolvedValue(Result.ok(activePlan));
    vi.spyOn(WorkoutPlanQueries, 'getCurrentWorkout').mockReturnValue(mockWorkout);

    // Act
    const result = await useCase.execute({ userId });

    // Assert
    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.hasWorkout).toBe(false);
      expect(result.value.message).toBe("Already completed today's workout! Great job!");
    }
  });
});