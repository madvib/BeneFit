import { describe, it, beforeEach, vi, expect } from 'vitest';


import { Result, EventBus } from '@bene/shared';

import { createCoachContextFixture } from '@/fixtures.js';
import { CoachContextBuilder } from '@/application/services/coach-context-builder.js';
import { AICoachService } from '@/application/services/ai-coach-service.js';

import { GenerateWeeklySummaryUseCase } from '../generate-weekly-summary.js';

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
  const TEST_USER_ID = crypto.randomUUID();

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
    const userId = TEST_USER_ID;

    const mockContext = createCoachContextFixture();

    const mockSummary = {
      summary: 'Test weekly summary content',
      highlights: [
        'Test highlight 1',
        'Test highlight 2',
      ],
      suggestions: ['Test suggestion'],
    };

    vi.mocked(mockContextBuilder.buildContext).mockResolvedValue(Result.ok(mockContext));
    vi.mocked(mockAICoachService.generateWeeklySummary).mockResolvedValue(Result.ok(mockSummary));

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

  it('should fail if AI summary generation fails', async () => {
    // Arrange
    const userId = TEST_USER_ID;

    const mockContext = createCoachContextFixture();

    vi.mocked(mockContextBuilder.buildContext).mockResolvedValue(Result.ok(mockContext));
    vi.mocked(mockAICoachService.generateWeeklySummary).mockResolvedValue(
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
