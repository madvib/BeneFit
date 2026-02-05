import { describe, it, expect } from 'vitest';

import {
  createFitnessGoalsFixture,
  createTrainingConstraintsFixture
} from '@bene/training-core/fixtures';

import { CreateCoachContextSchema } from '../coach-context.factory.js';
import {
  createCoachContextFixture,
  createCurrentPlanContextFixture,
  createRecentWorkoutSummaryFixture,
  createPerformanceTrendsFixture
} from './coach-context.fixtures.js';

describe('CoachContext', () => {
  describe('Factory', () => {
    const mockRecentWorkouts = [createRecentWorkoutSummaryFixture()];
    const mockUserGoals = createFitnessGoalsFixture();
    const mockUserConstraints = createTrainingConstraintsFixture();
    const mockTrends = createPerformanceTrendsFixture();
    const mockCurrentPlan = createCurrentPlanContextFixture();

    it('should create a valid coaching context', () => {
      // Arrange
      const input = {
        currentPlan: mockCurrentPlan,
        recentWorkouts: mockRecentWorkouts,
        userGoals: mockUserGoals,
        userConstraints: mockUserConstraints,
        experienceLevel: 'intermediate' as const,
        trends: mockTrends,
        daysIntoCurrentWeek: 3,
        workoutsThisWeek: 2,
        plannedWorkoutsThisWeek: 3,
        energyLevel: 'medium' as const,
        stressLevel: 'low' as const,
        sleepQuality: 'good' as const,
      };

      // Act
      const result = CreateCoachContextSchema.safeParse(input);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        const context = result.data;
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
      }
    });

    it('should fail if recentWorkouts is missing', () => {
      // Act
      const result = CreateCoachContextSchema.safeParse({
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

      // Assert
      expect(result.success).toBe(false);
    });

    it('should fail if daysIntoCurrentWeek is negative', () => {
      const result = CreateCoachContextSchema.safeParse({
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

      expect(result.success).toBe(false);
    });

    it('should fail if workoutsThisWeek is invalid', () => {
      const result = CreateCoachContextSchema.safeParse({
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

      expect(result.success).toBe(false);
    });
  });

  describe('Fixtures', () => {
    it('should create valid fixture', () => {
      const fixture = createCoachContextFixture();

      expect(fixture.userGoals).toBeDefined();
      expect(fixture.userConstraints).toBeDefined();
      expect(fixture.trends).toBeDefined();
    });

    it('should allow overrides in fixture', () => {
      const fixture = createCoachContextFixture({ energyLevel: 'high' });

      expect(fixture.energyLevel).toBe('high');
    });
  });
});
