import { describe, it, expect } from 'vitest';
import { CoachContextPresentationSchema, toCoachContextPresentation } from '../coach-context.presentation.js';
import { createCoachContextFixture } from './coach-context.fixtures.js';

describe('CoachContext Presentation', () => {
  it('should map a valid coach context to presentation DTO', () => {
    const context = createCoachContextFixture();
    const presentation = toCoachContextPresentation(context);

    const result = CoachContextPresentationSchema.safeParse(presentation);
    expect(result.success).toBe(true);
    if (!result.success) {
      console.log(JSON.stringify(result.error.format(), null, 2));
    }
    expect(presentation.experienceLevel).toBe(context.experienceLevel);
    expect(presentation.energyLevel).toBe(context.energyLevel);
  });

  it('should convert workout dates to ISO strings', () => {
    const context = createCoachContextFixture({
      recentWorkouts: [
        {
          workoutId: 'workout-1',
          date: new Date('2024-01-15T10:00:00Z'),
          type: 'strength',
          durationMinutes: 60,
          perceivedExertion: 7,
          enjoyment: 4,
          difficultyRating: 'just_right',
          completed: true,
        },
      ],
    });
    const presentation = toCoachContextPresentation(context);

    expect(presentation.recentWorkouts[0].date).toBe('2024-01-15T10:00:00.000Z');
  });

  it('should convert readonly arrays to mutable arrays', () => {
    const context = createCoachContextFixture();
    const presentation = toCoachContextPresentation(context);

    expect(Array.isArray(presentation.userGoals.secondary)).toBe(true);
    expect(Array.isArray(presentation.userConstraints.availableDays)).toBe(true);
    expect(Array.isArray(presentation.userConstraints.availableEquipment)).toBe(true);
  });

  it('should handle optional current plan', () => {
    const contextWithPlan = createCoachContextFixture({
      currentPlan: {
        planId: 'plan-123',
        planName: 'Test Plan',
        weekNumber: 2,
        dayNumber: 3,
        totalWeeks: 12,
        adherenceRate: 0.85,
        completionRate: 0.75,
      },
    });
    const contextWithoutPlan = createCoachContextFixture({
      currentPlan: undefined,
    });

    const presentationWith = toCoachContextPresentation(contextWithPlan);
    const presentationWithout = toCoachContextPresentation(contextWithoutPlan);

    expect(presentationWith.currentPlan).toBeDefined();
    expect(presentationWith.currentPlan?.planId).toBe('plan-123');
    expect(presentationWithout.currentPlan).toBeUndefined();
  });

  it('should handle injuries in constraints', () => {
    const context = createCoachContextFixture({
      userConstraints: {
        availableDays: [1, 3, 5],
        sessionDuration: 60,
        availableEquipment: ['dumbbells'],
        injuries: [
          {
            bodyPart: 'knee',
            severity: 'moderate',
            reportedDate: '2024-01-10',
            avoidExercises: ['squats', 'lunges'],
          },
        ],
      },
    });
    const presentation = toCoachContextPresentation(context);

    expect(presentation.userConstraints.injuries).toBeDefined();
    expect(presentation.userConstraints.injuries?.[0].bodyPart).toBe('knee');
    expect(Array.isArray(presentation.userConstraints.injuries?.[0].avoidExercises)).toBe(true);
  });

  it('should map all performance trends', () => {
    const context = createCoachContextFixture({
      trends: {
        volumeTrend: 'increasing',
        adherenceTrend: 'improving',
        energyTrend: 'high',
        exertionTrend: 'stable',
        enjoymentTrend: 'improving',
      },
    });
    const presentation = toCoachContextPresentation(context);

    expect(presentation.trends.volumeTrend).toBe('increasing');
    expect(presentation.trends.adherenceTrend).toBe('improving');
    expect(presentation.trends.energyTrend).toBe('high');
    expect(presentation.trends.exertionTrend).toBe('stable');
    expect(presentation.trends.enjoymentTrend).toBe('improving');
  });

  it('should handle optional health signals', () => {
    const context = createCoachContextFixture({
      stressLevel: 'high',
      sleepQuality: 'poor',
    });
    const presentation = toCoachContextPresentation(context);

    expect(presentation.stressLevel).toBe('high');
    expect(presentation.sleepQuality).toBe('poor');
  });
});
