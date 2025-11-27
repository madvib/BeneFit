import { describe, it, beforeEach, vi, expect } from 'vitest';
import { Result } from '@bene/core/shared';
import { WorkoutPlan, WorkoutPlanQueries } from '@bene/core/plans';
import { WorkoutTemplate } from '@bene/core/plans';
import { GetUpcomingWorkoutsUseCase } from './get-upcoming-workouts';
import { WorkoutPlanRepository } from '../../../repositories/workout-plan-repository';

// Mock repositories and services
const mockPlanRepository = {
  findById: vi.fn(),
  findByUserId: vi.fn(),
  findActiveByUserId: vi.fn(),
  save: vi.fn(),
  delete: vi.fn(),
} as unknown as WorkoutPlanRepository;

describe('GetUpcomingWorkoutsUseCase', () => {
  let useCase: GetUpcomingWorkoutsUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new GetUpcomingWorkoutsUseCase(mockPlanRepository);
  });

  it('should return upcoming workouts for the next 7 days when there is an active plan', async () => {
    // Arrange
    const userId = 'user-123';
    const mockWorkout: WorkoutTemplate = {
      id: 'workout-456',
      type: 'strength',
      duration: 45,
      dayOfWeek: 1, // Monday
      status: 'scheduled',
      activities: [],
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
      currentPosition: { week: 1, day: 0 },
      startDate: new Date().toISOString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPlanRepository.findActiveByUserId.mockResolvedValue(Result.ok(activePlan));
    // Mock the getWorkoutForDate function to return the workout for specific dates
    vi.spyOn(WorkoutPlanQueries, 'getWorkoutForDate').mockReturnValue(mockWorkout);

    // Act
    const result = await useCase.execute({ userId });

    // Assert
    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.workouts).toHaveLength(7); // Default 7 days
      expect(result.value.workouts[0]).toBeDefined();
    }
  });

  it('should return upcoming workouts for specified number of days', async () => {
    // Arrange
    const userId = 'user-123';
    const mockWorkout: WorkoutTemplate = {
      id: 'workout-456',
      type: 'strength',
      duration: 45,
      dayOfWeek: 1, // Monday
      status: 'scheduled',
      activities: [],
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
      currentPosition: { week: 1, day: 0 },
      startDate: new Date().toISOString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPlanRepository.findActiveByUserId.mockResolvedValue(Result.ok(activePlan));
    // Mock the getWorkoutForDate function to return the workout for specific dates
    vi.spyOn(WorkoutPlanQueries, 'getWorkoutForDate').mockReturnValue(mockWorkout);

    // Act
    const result = await useCase.execute({ userId, days: 3 });

    // Assert
    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.workouts).toHaveLength(3); // 3 days as specified
      expect(result.value.workouts[0]).toBeDefined();
    }
  });

  it('should return empty array when no active plan exists', async () => {
    // Arrange
    const userId = 'user-123';

    mockPlanRepository.findActiveByUserId.mockResolvedValue(Result.fail(new Error('No active plan')));

    // Act
    const result = await useCase.execute({ userId });

    // Assert
    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.workouts).toHaveLength(0);
    }
  });
});