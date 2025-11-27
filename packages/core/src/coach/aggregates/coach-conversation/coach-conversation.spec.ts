import { describe, it, expect } from 'vitest';
import { createCoachingConversation } from './coach-conversation.factory.js';
import { CoachingContext } from '../../value-objects/coaching-context/coaching-context.js';
import { createTrainingConstraints } from '../../../plans/index.js';

describe('CoachConversation Aggregate', () => {
  const mockContext: CoachingContext = {
    recentWorkouts: [],
    userGoals: { primaryGoal: 'strength', targetWeight: 75 } as unknown,
    userConstraints: createTrainingConstraints({
      availableEquipment: [],
      availableDays: ['Monday', 'Wednesday', 'Friday'],
      maxDuration: 60,
      location: 'home',
    }).value,
    experienceLevel: 'intermediate',
    trends: {
      volumeTrend: 'stable',
      adherenceTrend: 'stable',
      energyTrend: 'medium',
      exertionTrend: 'stable',
      enjoymentTrend: 'stable',
    },
    daysIntoCurrentWeek: 1,
    workoutsThisWeek: 0,
    plannedWorkoutsThisWeek: 3,
    reportedInjuries: [],
    energyLevel: 'medium',
  };

  it('should create a valid coaching conversation', () => {
    const result = createCoachingConversation({
      userId: 'user-123',
      context: mockContext,
      initialMessage: 'Welcome!',
    });

    expect(result.isSuccess).toBe(true);
    const conversation = result.value;
    expect(conversation.id).toBeDefined();
    expect(conversation.userId).toBe('user-123');
    expect(conversation.context).toEqual(mockContext);
    expect(conversation.messages).toHaveLength(1);
    expect(conversation.messages[0]?.content).toBe('Welcome!');
    expect(conversation.totalMessages).toBe(1);
    expect(conversation.totalCoachMessages).toBe(1);
    expect(conversation.startedAt).toBeInstanceOf(Date);
  });

  it('should create a conversation without initial message', () => {
    const result = createCoachingConversation({
      userId: 'user-123',
      context: mockContext,
    });

    expect(result.isSuccess).toBe(true);
    const conversation = result.value;
    expect(conversation.messages).toHaveLength(0);
    expect(conversation.totalMessages).toBe(0);
  });

  it('should fail if userId is missing', () => {
    const result = createCoachingConversation({
      userId: null as never,
      context: mockContext,
    });

    expect(result.isFailure).toBe(true);
  });

  it('should fail if userId is empty', () => {
    const result = createCoachingConversation({
      userId: '',
      context: mockContext,
    });

    expect(result.isFailure).toBe(true);
  });

  it('should fail if context is missing', () => {
    const result = createCoachingConversation({
      userId: 'user-123',
      context: null as never,
    });

    expect(result.isFailure).toBe(true);
  });
});
