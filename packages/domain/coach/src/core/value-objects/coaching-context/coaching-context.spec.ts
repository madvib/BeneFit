import { describe, it, expect } from 'vitest';
import { createCoachingContext } from './coaching-context.factory.js';
import { createTrainingConstraints } from '@bene/training-core';
import {
  RecentWorkoutSummary,
  PerformanceTrends,
  CurrentPlanContext,
} from './coaching-context.types.js';

describe('CoachingContext Value Object', () => {
  const mockRecentWorkouts: RecentWorkoutSummary[] = [
    {
      workoutId: 'w1',
      date: new Date(),
      type: 'strength',
      durationMinutes: 45,
      perceivedExertion: 7,
      enjoyment: 4,
      difficultyRating: 'just_right',
      completed: true,
    },
  ];

  const mockUserGoals = {
    primaryGoal: 'strength',
    targetWeight: 75,
  };

  const mockUserConstraints = createTrainingConstraints({
    availableEquipment: ['dumbbells'],
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    maxDuration: 60,
    location: 'home',
  }).value;

  const mockTrends: PerformanceTrends = {
    volumeTrend: 'stable',
    adherenceTrend: 'improving',
    energyTrend: 'medium',
    exertionTrend: 'stable',
    enjoymentTrend: 'stable',
  };

  const mockCurrentPlan: CurrentPlanContext = {
    planId: 'p1',
    planName: 'Strength 101',
    weekNumber: 2,
    dayNumber: 3,
    totalWeeks: 8,
    adherenceRate: 0.9,
    completionRate: 0.2,
  };

  it('should create a valid coaching context', () => {
    const result = createCoachingContext({
      currentPlan: mockCurrentPlan,
      recentWorkouts: mockRecentWorkouts,
      userGoals: mockUserGoals,
      userConstraints: mockUserConstraints,
      experienceLevel: 'intermediate',
      trends: mockTrends,
      daysIntoCurrentWeek: 3,
      workoutsThisWeek: 2,
      plannedWorkoutsThisWeek: 3,
      energyLevel: 'medium',
      stressLevel: 'low',
      sleepQuality: 'good',
    });

    expect(result.isSuccess).toBe(true);
    const context = result.value;
    expect(context.currentPlan).toEqual(mockCurrentPlan);
    expect(context.recentWorkouts).toEqual(mockRecentWorkouts);
    expect(context.experienceLevel).toBe('intermediate');
    expect(context.trends).toEqual(mockTrends);
    expect(context.daysIntoCurrentWeek).toBe(3);
    expect(context.workoutsThisWeek).toBe(2);
    expect(context.plannedWorkoutsThisWeek).toBe(3);
    expect(context.energyLevel).toBe('medium');
    expect(context.stressLevel).toBe('low');
    expect(context.sleepQuality).toBe('good');
    expect(context.reportedInjuries).toEqual([]);
  });

  it('should fail if recentWorkouts is missing', () => {
    const result = createCoachingContext({
      // @ts-expect-error Testing invalid input
      recentWorkouts: null,
      userGoals: mockUserGoals,
      userConstraints: mockUserConstraints,
      experienceLevel: 'intermediate',
      trends: mockTrends,
      daysIntoCurrentWeek: 3,
      workoutsThisWeek: 2,
      plannedWorkoutsThisWeek: 3,
      energyLevel: 'medium',
    });

    expect(result.isFailure).toBe(true);
  });

  it('should fail if daysIntoCurrentWeek is negative', () => {
    const result = createCoachingContext({
      recentWorkouts: mockRecentWorkouts,
      userGoals: mockUserGoals,
      userConstraints: mockUserConstraints,
      experienceLevel: 'intermediate',
      trends: mockTrends,
      daysIntoCurrentWeek: -1,
      workoutsThisWeek: 2,
      plannedWorkoutsThisWeek: 3,
      energyLevel: 'medium',
    });

    expect(result.isFailure).toBe(true);
  });

  it('should fail if workoutsThisWeek is negative', () => {
    const result = createCoachingContext({
      recentWorkouts: mockRecentWorkouts,
      userGoals: mockUserGoals,
      userConstraints: mockUserConstraints,
      experienceLevel: 'intermediate',
      trends: mockTrends,
      daysIntoCurrentWeek: 3,
      workoutsThisWeek: -1,
      plannedWorkoutsThisWeek: 3,
      energyLevel: 'medium',
    });

    expect(result.isFailure).toBe(true);
  });

  it('should fail if plannedWorkoutsThisWeek is negative', () => {
    const result = createCoachingContext({
      recentWorkouts: mockRecentWorkouts,
      userGoals: mockUserGoals,
      userConstraints: mockUserConstraints,
      experienceLevel: 'intermediate',
      trends: mockTrends,
      daysIntoCurrentWeek: 3,
      workoutsThisWeek: 2,
      plannedWorkoutsThisWeek: -1,
      energyLevel: 'medium',
    });

    expect(result.isFailure).toBe(true);
  });
});
