import { describe, it, beforeEach, vi, expect } from 'vitest';
import { Result, EventBus } from '@bene/shared';
import { GenerateWeeklySummaryUseCase } from './generate-weekly-summary.js';
import { CoachContextBuilder } from '../../ports/coach-context-builder.js';
import { AICoachService } from '../../ports/ai-coach-service.js';

// Mock services
const mockContextBuilder = {
  buildContext: vi.fn(),
} as unknown as CoachContextBuilder;

const mockAICoachService = {
  getResponse: vi.fn(),
  generateCheckInQuestion: vi.fn(),
  analyzeCheckInResponse: vi.fn(),
  generateWeeklySummary: vi.fn(),
} as unknown as AICoachService;

const mockEventBus = {
  publish: vi.fn(),
} as unknown as EventBus;

describe('GenerateWeeklySummaryUseCase', () => {
  let useCase: GenerateWeeklySummaryUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new GenerateWeeklySummaryUseCase(
      mockContextBuilder,
      mockAICoachService,
      mockEventBus,
    );
  });

  it('should successfully generate a weekly summary', async () => {
    // Arrange
    const userId = 'user-123';

    const mockContext = {
      recentWorkouts: [],
      userGoals: {
        primary: 'strength',
        secondary: [],
        motivation: 'test',
        successCriteria: [],
      },
      userConstraints: { availableDays: [], availableEquipment: [], location: 'home' },
      experienceLevel: 'beginner',
      trends: {
        volumeTrend: 'stable',
        adherenceTrend: 'stable',
        energyTrend: 'medium',
        exertionTrend: 'stable',
        enjoymentTrend: 'stable',
      },
      daysIntoCurrentWeek: 0,
      workoutsThisWeek: 0,
      plannedWorkoutsThisWeek: 0,
      energyLevel: 'medium',
    };

    const mockSummary = {
      summary: 'This week you completed 3 out of 4 planned workouts. Good adherence!',
      highlights: [
        'Completed 75% of planned workouts',
        'Average exertion was appropriate',
      ],
      suggestions: ['Try to maintain this consistency next week'],
    };

    mockContextBuilder.buildContext.mockResolvedValue(Result.ok(mockContext));
    mockAICoachService.generateWeeklySummary.mockResolvedValue(Result.ok(mockSummary));

    // Act
    const result = await useCase.execute({
      userId,
    });

    // Assert
    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.summary).toBe(mockSummary.summary);
      expect(result.value.highlights).toHaveLength(2);
      expect(result.value.suggestions).toHaveLength(1);
    }
    expect(mockContextBuilder.buildContext).toHaveBeenCalledWith(userId);
    expect(mockAICoachService.generateWeeklySummary).toHaveBeenCalledWith({
      context: mockContext,
    });
    expect(mockEventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        eventName: 'WeeklySummaryGenerated',
        userId,
        summary: mockSummary.summary,
      }),
    );
  });

  it('should fail if context building fails', async () => {
    // Arrange
    const userId = 'user-123';

    mockContextBuilder.buildContext.mockResolvedValue(
      Result.fail(new Error('Failed to build context')),
    );

    // Act
    const result = await useCase.execute({
      userId,
    });

    // Assert
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error).toBeInstanceOf(Error);
      expect((result.error as Error).message).toBe('Failed to build context');
    }
  });

  it('should fail if AI summary generation fails', async () => {
    // Arrange
    const userId = 'user-123';

    const mockContext = {
      recentWorkouts: [],
      userGoals: {
        primary: 'strength',
        secondary: [],
        motivation: 'test',
        successCriteria: [],
      },
      userConstraints: { availableDays: [], availableEquipment: [], location: 'home' },
      experienceLevel: 'beginner',
      trends: {
        volumeTrend: 'stable',
        adherenceTrend: 'stable',
        energyTrend: 'medium',
        exertionTrend: 'stable',
        enjoymentTrend: 'stable',
      },
      daysIntoCurrentWeek: 0,
      workoutsThisWeek: 0,
      plannedWorkoutsThisWeek: 0,
      energyLevel: 'medium',
    };

    mockContextBuilder.buildContext.mockResolvedValue(Result.ok(mockContext));
    mockAICoachService.generateWeeklySummary.mockResolvedValue(
      Result.fail(new Error('AI generation failed')),
    );

    // Act
    const result = await useCase.execute({
      userId,
    });

    // Assert
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error).toBeInstanceOf(Error);
      expect((result.error as Error).message).toContain('AI generation failed');
    }
  });
});
