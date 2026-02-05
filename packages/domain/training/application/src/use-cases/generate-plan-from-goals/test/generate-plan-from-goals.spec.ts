import { describe, it, beforeEach, vi, expect } from 'vitest';


import { Result, type EventBus } from '@bene/shared';
import {
  createFitnessPlanFixture,
  createUserProfileFixture,
  createPlanGoalsFixture,
} from '@bene/training-core/fixtures';

import { FitnessPlanRepository } from '@/repositories/fitness-plan-repository.js';
import { AIPlanGenerator } from '@/services/ai-plan-generator.js';
import { UserProfileRepository } from '@/repositories/user-profile-repository.js';

import { GeneratePlanFromGoalsUseCase } from '../generate-plan-from-goals.js';

// Mock repositories and services
const mockPlanRepository = {
  findById: vi.fn(),
  findByUserId: vi.fn(),
  findActiveByUserId: vi.fn(),
  save: vi.fn(),
  delete: vi.fn(),
} as unknown as FitnessPlanRepository;

const mockProfileRepository = {
  findById: vi.fn(),
} as unknown as UserProfileRepository;

const mockAIPlanGenerator = {
  generatePlan: vi.fn(),
} as unknown as AIPlanGenerator;

const mockEventBus = {
  publish: vi.fn(),
  subscribe: vi.fn(),
} as unknown as EventBus;

describe('GeneratePlanFromGoalsUseCase', () => {
  let useCase: GeneratePlanFromGoalsUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new GeneratePlanFromGoalsUseCase(
      mockPlanRepository,
      mockProfileRepository,
      mockAIPlanGenerator,
      mockEventBus,
    );
  });

  it('should successfully generate a plan when user has no active plan', async () => {
    // Arrange
    const userId = crypto.randomUUID();
    const goals = createPlanGoalsFixture();
    const mockProfile = createUserProfileFixture({ userId });
    const mockPlan = createFitnessPlanFixture({
      userId,
      goals,
      status: 'draft',
    });
    const planId = mockPlan.id;

    vi.mocked(mockProfileRepository.findById).mockResolvedValue(Result.ok(mockProfile));
    vi.mocked(mockPlanRepository.findActiveByUserId).mockResolvedValue(
      Result.fail(new Error('No active plan')),
    );
    vi.mocked(mockAIPlanGenerator.generatePlan).mockResolvedValue(Result.ok(mockPlan));
    vi.mocked(mockPlanRepository.save).mockResolvedValue(Result.ok());

    // Act
    const result = await useCase.execute({
      userId,
      goals,
      customInstructions: 'Focus on upper body',
    });

    // Assert
    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.preview).toBeDefined();
      expect(result.value.preview.weekNumber).toBe(1);
      expect(result.value.preview.workouts).toHaveLength(mockPlan.weeks[0].workouts.length);
      // Basic check for preview structure
      expect(Array.isArray(result.value.preview.workouts)).toBe(true);
    }
    expect(mockPlanRepository.save).toHaveBeenCalledWith(mockPlan);
    expect(mockEventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        eventName: 'PlanGenerated',
        userId,
        planId,
      }),
    );
  });

  it('should fail if user profile is not found', async () => {
    // Arrange
    const userId = crypto.randomUUID();
    const goals = createPlanGoalsFixture();

    vi.mocked(mockProfileRepository.findById).mockResolvedValue(
      Result.fail(new Error('User profile not found')),
    );

    // Act
    const result = await useCase.execute({
      userId,
      goals,
    });

    // Assert
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.errorMessage).toBe('User profile not found');
    }
  });

  it('should fail if user already has an active plan', async () => {
    // Arrange
    const userId = crypto.randomUUID();
    const goals = createPlanGoalsFixture();
    const mockActivePlan = createFitnessPlanFixture({
      userId,
      status: 'active',
    });

    const mockProfile = createUserProfileFixture({ userId });

    vi.mocked(mockProfileRepository.findById).mockResolvedValue(Result.ok(mockProfile));
    vi.mocked(mockPlanRepository.findActiveByUserId).mockResolvedValue(Result.ok(mockActivePlan));

    // Act
    const result = await useCase.execute({
      userId,
      goals,
    });

    // Assert
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.errorMessage).toBe(
        'User already has an active plan. Pause or abandon it first.',
      );
    }
  });

  it('should fail if AI plan generation fails', async () => {
    // Arrange
    const userId = crypto.randomUUID();
    const goals = createPlanGoalsFixture();
    const mockProfile = createUserProfileFixture({ userId });

    vi.mocked(mockProfileRepository.findById).mockResolvedValue(Result.ok(mockProfile));
    vi.mocked(mockPlanRepository.findActiveByUserId).mockResolvedValue(
      Result.fail(new Error('No active plan')),
    );
    vi.mocked(mockAIPlanGenerator.generatePlan).mockResolvedValue(
      Result.fail(new Error('AI generation failed')),
    );

    // Act
    const result = await useCase.execute({
      userId,
      goals,
    });

    // Assert
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.errorMessage).toBe('Failed to generate plan: Error: AI generation failed');
    }
  });

  it('should fail if saving the plan fails', async () => {
    // Arrange
    const userId = crypto.randomUUID();
    const goals = createPlanGoalsFixture();
    const mockProfile = createUserProfileFixture({ userId });
    const mockPlan = createFitnessPlanFixture({
      userId,
      goals,
      status: 'draft',
    });

    vi.mocked(mockProfileRepository.findById).mockResolvedValue(Result.ok(mockProfile));
    vi.mocked(mockPlanRepository.findActiveByUserId).mockResolvedValue(
      Result.fail(new Error('No active plan')),
    );
    vi.mocked(mockAIPlanGenerator.generatePlan).mockResolvedValue(Result.ok(mockPlan));
    vi.mocked(mockPlanRepository.save).mockResolvedValue(Result.fail(new Error('Save failed')));

    // Act
    const result = await useCase.execute({
      userId,
      goals,
    });

    // Assert
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.errorMessage).toBe('Failed to save plan: Error: Save failed');
    }
  });
});
