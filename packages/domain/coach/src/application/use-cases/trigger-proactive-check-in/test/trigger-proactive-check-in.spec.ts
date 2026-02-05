import { describe, it, beforeEach, vi, expect } from 'vitest';

import { Result, type EventBus } from '@bene/shared';

import { createCoachConversationFixture, createCoachContextFixture, createPerformanceTrendsFixture } from '@/fixtures.js';
import { CoachConversationRepository } from '@/application/ports/coach-conversation-repository.js';
import { CoachContextBuilder, AICoachService } from '@/application/services/index.js';

import { TriggerProactiveCheckInUseCase } from '../trigger-proactive-check-in.js';

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
  const TEST_USER_ID = crypto.randomUUID();

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
    const userId = TEST_USER_ID;

    const mockContext = createCoachContextFixture({
      trends: createPerformanceTrendsFixture({
        enjoymentTrend: 'declining',
      }),
    });

    const mockConversation = createCoachConversationFixture({
      userId,
      context: mockContext,
    });

    const mockQuestion = 'How are you feeling about your progress this week?';

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
    const userId = TEST_USER_ID;

    const mockContext = createCoachContextFixture({
      trends: createPerformanceTrendsFixture({
        enjoymentTrend: 'declining',
      }),
    });

    const mockQuestion = 'How are you feeling about your progress this week?';

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
    const userId = TEST_USER_ID;

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
    const userId = TEST_USER_ID;

    const mockContext = createCoachContextFixture({
      trends: createPerformanceTrendsFixture({
        enjoymentTrend: 'stable',
      }),
      daysIntoCurrentWeek: 2,
    });

    const mockConversation = createCoachConversationFixture({
      userId,
      context: mockContext,
    });

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
    const userId = TEST_USER_ID;

    const mockContext = createCoachContextFixture({
      trends: createPerformanceTrendsFixture({
        enjoymentTrend: 'declining',
      }),
    });

    const mockConversation = createCoachConversationFixture({
      userId,
      context: mockContext,
    });

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
