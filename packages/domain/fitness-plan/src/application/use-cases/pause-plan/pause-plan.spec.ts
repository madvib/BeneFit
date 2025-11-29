import { describe, it, beforeEach, vi, expect } from 'vitest';
import { Result } from '@bene/domain-shared';
import { WorkoutPlan, WorkoutPlanCommands } from '@core/index.js';
import { PausePlanUseCase } from './pause-plan.js';
import { WorkoutPlanRepository } from '../../../repositories/workout-plan-repository';
import { EventBus } from '@bene/domain-shared';

// Mock repositories and services
const mockPlanRepository = {
  findById: vi.fn(),
  findByUserId: vi.fn(),
  findActiveByUserId: vi.fn(),
  save: vi.fn(),
  delete: vi.fn(),
} as unknown as WorkoutPlanRepository;

const mockEventBus = {
  publish: vi.fn(),
} as unknown as EventBus;

describe('PausePlanUseCase', () => {
  let useCase: PausePlanUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new PausePlanUseCase(mockPlanRepository, mockEventBus);
  });

  it('should successfully pause an active plan', async () => {
    // Arrange
    const userId = 'user-123';
    const planId = 'plan-456';
    const reason = 'Going on vacation';

    const activePlan: WorkoutPlan = {
      id: planId,
      userId,
      title: 'Strength Plan',
      description: 'A plan for building strength',
      planType: 'strength_program',
      goals: { goalType: 'strength', target: 'build muscle' },
      progression: { strategy: 'linear' },
      constraints: { equipment: [], injuries: [], timeConstraints: [] },
      weeks: [
        {
          weekNumber: 1,
          workouts: [],
          workoutsCompleted: 0,
        },
      ],
      status: 'active',
      currentPosition: { week: 1, day: 0 },
      startDate: new Date().toISOString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const pausedPlan: WorkoutPlan = {
      ...activePlan,
      status: 'paused',
    };

    mockPlanRepository.findById.mockResolvedValue(Result.ok(activePlan));
    vi.spyOn(WorkoutPlanCommands, 'pausePlan').mockReturnValue(Result.ok(pausedPlan));

    // Act
    const result = await useCase.execute({
      userId,
      planId,
      reason,
    });

    // Assert
    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.planId).toBe(planId);
      expect(result.value.status).toBe('paused');
    }
    expect(mockPlanRepository.save).toHaveBeenCalledWith(pausedPlan);
    expect(mockEventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'PlanPaused',
        userId,
        planId,
        reason,
      }),
    );
  });

  it('should successfully pause an active plan without a reason', async () => {
    // Arrange
    const userId = 'user-123';
    const planId = 'plan-456';

    const activePlan: WorkoutPlan = {
      id: planId,
      userId,
      title: 'Strength Plan',
      description: 'A plan for building strength',
      planType: 'strength_program',
      goals: { goalType: 'strength', target: 'build muscle' },
      progression: { strategy: 'linear' },
      constraints: { equipment: [], injuries: [], timeConstraints: [] },
      weeks: [
        {
          weekNumber: 1,
          workouts: [],
          workoutsCompleted: 0,
        },
      ],
      status: 'active',
      currentPosition: { week: 1, day: 0 },
      startDate: new Date().toISOString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const pausedPlan: WorkoutPlan = {
      ...activePlan,
      status: 'paused',
    };

    mockPlanRepository.findById.mockResolvedValue(Result.ok(activePlan));
    vi.spyOn(WorkoutPlanCommands, 'pausePlan').mockReturnValue(Result.ok(pausedPlan));

    // Act
    const result = await useCase.execute({
      userId,
      planId,
    });

    // Assert
    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.planId).toBe(planId);
      expect(result.value.status).toBe('paused');
    }
    expect(mockPlanRepository.save).toHaveBeenCalledWith(pausedPlan);
    expect(mockEventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'PlanPaused',
        userId,
        planId,
        reason: undefined,
      }),
    );
  });

  it('should fail if plan is not found', async () => {
    // Arrange
    const userId = 'user-123';
    const planId = 'plan-456';

    mockPlanRepository.findById.mockResolvedValue(
      Result.fail(new Error('Plan not found')),
    );

    // Act
    const result = await useCase.execute({
      userId,
      planId,
    });

    // Assert
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.errorMessage).toBe('Plan not found');
    }
  });

  it('should fail if user is not authorized to pause the plan', async () => {
    // Arrange
    const userId = 'user-123';
    const otherUserId = 'user-789';
    const planId = 'plan-456';

    const activePlan: WorkoutPlan = {
      id: planId,
      userId: otherUserId, // Different user
      title: 'Strength Plan',
      description: 'A plan for building strength',
      planType: 'strength_program',
      goals: { goalType: 'strength', target: 'build muscle' },
      progression: { strategy: 'linear' },
      constraints: { equipment: [], injuries: [], timeConstraints: [] },
      weeks: [
        {
          weekNumber: 1,
          workouts: [],
          workoutsCompleted: 0,
        },
      ],
      status: 'active',
      currentPosition: { week: 1, day: 0 },
      startDate: new Date().toISOString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPlanRepository.findById.mockResolvedValue(Result.ok(activePlan));

    // Act
    const result = await useCase.execute({
      userId,
      planId,
    });

    // Assert
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.errorMessage).toBe('Not authorized');
    }
  });

  it('should fail if plan pause command fails', async () => {
    // Arrange
    const userId = 'user-123';
    const planId = 'plan-456';

    const activePlan: WorkoutPlan = {
      id: planId,
      userId,
      title: 'Strength Plan',
      description: 'A plan for building strength',
      planType: 'strength_program',
      goals: { goalType: 'strength', target: 'build muscle' },
      progression: { strategy: 'linear' },
      constraints: { equipment: [], injuries: [], timeConstraints: [] },
      weeks: [
        {
          weekNumber: 1,
          workouts: [],
          workoutsCompleted: 0,
        },
      ],
      status: 'active',
      currentPosition: { week: 1, day: 0 },
      startDate: new Date().toISOString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPlanRepository.findById.mockResolvedValue(Result.ok(activePlan));
    vi.spyOn(WorkoutPlanCommands, 'pausePlan').mockReturnValue(
      Result.fail(new Error('Cannot pause')),
    );

    // Act
    const result = await useCase.execute({
      userId,
      planId,
    });

    // Assert
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.errorMessage).toBe('Error: Cannot pause');
    }
  });
});
