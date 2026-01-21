import { describe, it, beforeEach, vi, expect } from 'vitest';
import { Result } from '@bene/shared';
import { CoachConversation, CoachMsg } from '../../../../core/index.js';
import { GetCoachHistoryUseCase } from '../get-coaching-history.js';
import { CoachConversationRepository } from '../../../ports/coach-conversation-repository.js';

// Mock repositories and services
const mockConversationRepository = {
  findById: vi.fn(),
  findByUserId: vi.fn(),
  save: vi.fn(),
} as any;

describe('GetCoachHistoryUseCase', () => {
  let useCase: GetCoachHistoryUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new GetCoachHistoryUseCase(mockConversationRepository);
  });

  it('should successfully retrieve coaching history', async () => {
    // Arrange
    const userId = '550e8400-e29b-41d4-a716-446655440000';

    const mockMessage: CoachMsg = {
      id: 'msg-123',
      role: 'user',
      content: 'Hello coach!',
      timestamp: new Date(),
    } as CoachMsg;

    const mockCheckIn = {
      id: '550e8400-e29b-41d4-a716-446655440006',
      type: 'proactive',
      question: 'How are you feeling today?',
      status: 'pending',
      createdAt: new Date(),
      triggeredBy: 'enjoyment_declining',
    };

    const mockConversation: CoachConversation = {
      id: '550e8400-e29b-41d4-a716-446655440007',
      userId,
      context: {
        recentWorkouts: [],
        userGoals: {
          primary: 'strength',
          secondary: [],
          motivation: 'test',
          successCriteria: [],
        },
        userConstraints: {
          availableDays: [],
          availableEquipment: [],
          location: 'home',
        },
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
      },
      messages: [mockMessage],
      checkIns: [mockCheckIn],
      totalMessages: 1,
      totalUserMessages: 1,
      totalCoachMessages: 0,
      totalCheckIns: 1,
      pendingCheckIns: 1,
      startedAt: new Date(),
      lastMessageAt: new Date(),
      lastContextUpdateAt: new Date(),
    };

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
    // Arrange
    const userId = '550e8400-e29b-41d4-a716-446655440000';
    const limit = 5;

    // Create multiple messages
    const messages: CoachMsg[] = [];
    for (let i = 0; i < 10; i++) {
      messages.push({
        id: `msg-${ i }`,
        role: i % 2 === 0 ? 'user' : 'coach',
        content: `Message ${ i }`,
        timestamp: new Date(),
      } as CoachMsg);
    }

    const mockCheckIn = {
      id: '550e8400-e29b-41d4-a716-446655440006',
      type: 'proactive',
      question: 'How are you feeling today?',
      status: 'pending',
      createdAt: new Date(),
      triggeredBy: 'enjoyment_declining',
    };

    const mockConversation: CoachConversation = {
      id: '550e8400-e29b-41d4-a716-446655440007',
      userId,
      context: {
        recentWorkouts: [],
        userGoals: {
          primary: 'strength',
          secondary: [],
          motivation: 'test',
          successCriteria: [],
        },
        userConstraints: {
          availableDays: [],
          availableEquipment: [],
          location: 'home',
        },
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
      },
      messages,
      checkIns: [mockCheckIn],
      totalMessages: 10,
      totalUserMessages: 5,
      totalCoachMessages: 5,
      totalCheckIns: 1,
      pendingCheckIns: 1,
      startedAt: new Date(),
      lastMessageAt: new Date(),
      lastContextUpdateAt: new Date(),
    };

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

  it('should fail if conversation is not found', async () => {
    // Arrange
    const userId = '550e8400-e29b-41d4-a716-446655440000';

    vi.mocked(mockConversationRepository.findByUserId).mockResolvedValue(
      Result.fail(new Error('No coaching history found')),
    );

    // Act
    const result = await useCase.execute({
      userId,
    });

    // Assert
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.errorMessage).toBe('No coaching history found');
    }
  });
});
