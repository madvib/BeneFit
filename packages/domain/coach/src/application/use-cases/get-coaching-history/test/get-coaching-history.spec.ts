import { describe, it, beforeEach, vi, expect } from 'vitest';

import { Result, EntityNotFoundError } from '@bene/shared';

import {
  createCoachConversationFixture,
  createCoachMsgFixture,
  createCheckInFixture,
} from '@/fixtures.js';
import { CoachConversationRepository } from '@/application/ports/coach-conversation-repository.js';

import { GetCoachHistoryUseCase } from '../get-coaching-history.js';

// Mock repositories and services
const mockConversationRepository = {
  findById: vi.fn(),
  findByUserId: vi.fn(),
  save: vi.fn(),
} as unknown as CoachConversationRepository;

describe('GetCoachHistoryUseCase', () => {
  let useCase: GetCoachHistoryUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new GetCoachHistoryUseCase(mockConversationRepository);
  });

  it('should successfully retrieve coaching history', async () => {
    const userId = crypto.randomUUID();
    const mockMessage = createCoachMsgFixture({
      role: 'user',
      content: 'Hello coach!',
      actions: [],
    });
    const mockCheckIn = createCheckInFixture({ status: 'pending', actions: [] });
    const mockConversation = createCoachConversationFixture({
      userId,
      messages: [mockMessage],
      checkIns: [mockCheckIn],
    });

    vi.mocked(mockConversationRepository.findByUserId).mockResolvedValue(
      Result.ok(mockConversation),
    );

    // Act
    const result = await useCase.execute({
      userId,
    });

    // Assert
    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.messages).toHaveLength(1);
      expect(result.value.pendingCheckIns).toHaveLength(1);
      expect(result.value.stats.totalMessages).toBe(1);
      expect(result.value.stats.totalCheckIns).toBe(1);
      expect(result.value.stats.actionsApplied).toBe(0);
    }
  });

  it('should successfully retrieve coaching history with limit', async () => {
    const userId = crypto.randomUUID();
    const limit = 5;
    const messages = Array.from({ length: 10 }, () => createCoachMsgFixture());
    const mockConversation = createCoachConversationFixture({
      userId,
      messages,
      checkIns: [createCheckInFixture({ status: 'pending' })],
    });

    vi.mocked(mockConversationRepository.findByUserId).mockResolvedValue(
      Result.ok(mockConversation),
    );

    // Act
    const result = await useCase.execute({
      userId,
      limit,
    });

    // Assert
    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.messages).toHaveLength(limit); // Should be limited to 5
      expect(result.value.pendingCheckIns).toHaveLength(1);
    }
  });

  it('should return empty state for new users with no conversation', async () => {
    // Arrange
    const userId = crypto.randomUUID();

    vi.mocked(mockConversationRepository.findByUserId).mockResolvedValue(
      Result.fail(new EntityNotFoundError('CoachConversation', userId)),
    );

    // Act
    const result = await useCase.execute({
      userId,
    });

    // Assert - Should succeed with empty data
    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.messages).toEqual([]);
      expect(result.value.pendingCheckIns).toEqual([]);
      expect(result.value.stats.totalMessages).toBe(0);
      expect(result.value.stats.totalCheckIns).toBe(0);
      expect(result.value.stats.actionsApplied).toBe(0);
    }
  });

  it('should fail for database errors that are not EntityNotFoundError', async () => {
    // Arrange
    const userId = crypto.randomUUID();

    vi.mocked(mockConversationRepository.findByUserId).mockResolvedValue(
      Result.fail(new Error('Database connection failed')),
    );

    // Act
    const result = await useCase.execute({
      userId,
    });

    // Assert
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.errorMessage).toBe('Database connection failed');
    }
  });
});
