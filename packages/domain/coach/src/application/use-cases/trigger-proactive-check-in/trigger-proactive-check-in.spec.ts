import { describe, it, beforeEach, vi, expect } from 'vitest';
import { Result } from '@bene/shared';
import { CoachConversation } from '@core/index.js';
import { TriggerProactiveCheckInUseCase } from './trigger-proactive-check-in.js';
import { CoachConversationRepository } from '../../ports/coach-conversation-repository.js';
import { CoachContextBuilder } from '../../services/index.js';
import { AICoachService } from '../../services/index.js';
import { EventBus } from '@bene/shared';

// Mock repositories and services
const mockConversationRepository = {
  findById: vi.fn(),
  findByUserId: vi.fn(),
  save: vi.fn(),
} as unknown as CoachConversationRepository;

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

describe('TriggerProactiveCheckInUseCase', () => {
  let useCase: TriggerProactiveCheckInUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new TriggerProactiveCheckInUseCase(
      mockConversationRepository,
      mockContextBuilder,
      mockAICoachService,
      mockEventBus,
    );
  });

  it('should successfully trigger a proactive check-in', async () => {
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
        enjoymentTrend: 'declining',
      },
      daysIntoCurrentWeek: 0,
      workoutsThisWeek: 0,
      plannedWorkoutsThisWeek: 0,
      energyLevel: 'medium',
      currentPlan: {
        planId: 'plan-123',
        planName: 'Strength Plan',
        weekNumber: 1,
        dayNumber: 1,
        totalWeeks: 4,
        totalDays: 12,
        adherenceRate: 0.8,
        completionRate: 0.8,
      },
    };

    const mockConversation: CoachConversation = {
      id: 'conv-456',
      userId,
      context: mockContext,
      messages: [],
      checkIns: [],
      totalMessages: 0,
      totalUserMessages: 0,
      totalCoachMessages: 0,
      totalCheckIns: 0,
      pendingCheckIns: 0,
      startedAt: new Date(),
      lastMessageAt: new Date(),
      lastContextUpdateAt: new Date(),
    };

    const mockQuestion = 'How are you feeling about your workout routine?';

    vi.mocked(mockContextBuilder.buildContext).mockResolvedValue(Result.ok(mockContext));
    vi.mocked(mockConversationRepository.findByUserId).mockResolvedValue(
      Result.ok(mockConversation),
    );
    vi.mocked(mockAICoachService.generateCheckInQuestion).mockResolvedValue(
      Result.ok(mockQuestion),
    );
    vi.mocked(mockConversationRepository.save).mockResolvedValue(Result.ok());

    // Act
    const result = await useCase.execute({
      userId,
    });

    // Assert
    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.checkInId).toBeDefined();
      expect(result.value.question).toBe(mockQuestion);
      expect(result.value.triggeredBy).toBe('enjoyment_declining');
    }
    expect(mockContextBuilder.buildContext).toHaveBeenCalledWith(userId);
    expect(mockAICoachService.generateCheckInQuestion).toHaveBeenCalledWith({
      context: mockContext,
      trigger: 'enjoyment_declining',
    });
    expect(mockEventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        eventName: 'ProactiveCheckInTriggered',
        userId,
        trigger: 'enjoyment_declining',
      }),
    );
  });

  it('should create a new conversation if none exists', async () => {
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
        enjoymentTrend: 'declining',
      },
      daysIntoCurrentWeek: 0,
      workoutsThisWeek: 0,
      plannedWorkoutsThisWeek: 0,
      energyLevel: 'medium',
      currentPlan: {
        planId: 'plan-123',
        planName: 'Strength Plan',
        weekNumber: 1,
        dayNumber: 1,
        totalWeeks: 4,
        totalDays: 12,
        adherenceRate: 0.8,
        completionRate: 0.8,
      },
    };

    const mockQuestion = 'How are you feeling about your workout routine?';

    vi.mocked(mockContextBuilder.buildContext).mockResolvedValue(Result.ok(mockContext));
    vi.mocked(mockConversationRepository.findByUserId).mockResolvedValue(
      Result.fail(new Error('Not found')),
    );
    vi.mocked(mockAICoachService.generateCheckInQuestion).mockResolvedValue(
      Result.ok(mockQuestion),
    );
    vi.mocked(mockConversationRepository.save).mockResolvedValue(Result.ok());

    // Act
    const result = await useCase.execute({
      userId,
    });

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(mockConversationRepository.save).toHaveBeenCalled();
  });

  it('should fail if context building fails', async () => {
    // Arrange
    const userId = 'user-123';

    vi.mocked(mockContextBuilder.buildContext).mockResolvedValue(
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

  it('should fail if no check-in trigger is found', async () => {
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
      daysIntoCurrentWeek: 2, // Below threshold
      workoutsThisWeek: 2,
      plannedWorkoutsThisWeek: 3,
      energyLevel: 'medium',
    };

    const mockConversation: CoachConversation = {
      id: 'conv-456',
      userId,
      context: mockContext,
      messages: [],
      checkIns: [],
      totalMessages: 0,
      totalUserMessages: 0,
      totalCoachMessages: 0,
      totalCheckIns: 0,
      pendingCheckIns: 0,
      startedAt: new Date(),
      lastMessageAt: new Date(),
      lastContextUpdateAt: new Date(),
    };

    vi.mocked(mockContextBuilder.buildContext).mockResolvedValue(Result.ok(mockContext));
    vi.mocked(mockConversationRepository.findByUserId).mockResolvedValue(
      Result.ok(mockConversation),
    );

    // Act
    const result = await useCase.execute({
      userId,
    });

    // Assert
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error).toBeInstanceOf(Error);
      expect((result.error as Error).message).toBe('No check-in needed at this time');
    }
  });

  it('should fail if AI question generation fails', async () => {
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
        enjoymentTrend: 'declining',
      },
      daysIntoCurrentWeek: 0,
      workoutsThisWeek: 0,
      plannedWorkoutsThisWeek: 0,
      energyLevel: 'medium',
      currentPlan: {
        planId: 'plan-123',
        planName: 'Strength Plan',
        weekNumber: 1,
        dayNumber: 1,
        totalWeeks: 4,
        totalDays: 12,
        adherenceRate: 0.8,
        completionRate: 0.8,
      },
    };

    const mockConversation: CoachConversation = {
      id: 'conv-456',
      userId,
      context: mockContext,
      messages: [],
      checkIns: [],
      totalMessages: 0,
      totalUserMessages: 0,
      totalCoachMessages: 0,
      totalCheckIns: 0,
      pendingCheckIns: 0,
      startedAt: new Date(),
      lastMessageAt: new Date(),
      lastContextUpdateAt: new Date(),
    };

    vi.mocked(mockContextBuilder.buildContext).mockResolvedValue(Result.ok(mockContext));
    vi.mocked(mockConversationRepository.findByUserId).mockResolvedValue(
      Result.ok(mockConversation),
    );
    vi.mocked(mockAICoachService.generateCheckInQuestion).mockResolvedValue(
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
