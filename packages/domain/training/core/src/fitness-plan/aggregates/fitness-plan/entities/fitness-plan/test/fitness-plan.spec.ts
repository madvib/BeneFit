import { describe, it, expect } from 'vitest';
import { z } from 'zod';

import { createWeeklyScheduleFixture } from '../../weekly-schedule/test/weekly-schedule.fixtures.js';
import { createFitnessPlanFixture } from './fitness-plan.fixtures.js';
import {
  CreateDraftFitnessPlanSchema,
  ActivateFitnessPlanSchema,
} from '../fitness-plan.factory.js';
import { toFitnessPlanView } from '../fitness-plan.view.js';

type CreateDraftInput = z.input<typeof CreateDraftFitnessPlanSchema>;

describe('FitnessPlan Aggregate', () => {
  describe('Factory (Draft)', () => {
    it('should create valid draft plan', () => {
      // Arrange
      const input: CreateDraftInput = {
        userId: '550e8400-e29b-41d4-a716-446655440000',
        title: 'My Plan',
        description: 'Test Description',
        planType: 'general_fitness',
        goals: createFitnessPlanFixture().goals,
        progression: createFitnessPlanFixture().progression,
        constraints: createFitnessPlanFixture().constraints,
        startDate: new Date(),
        weeks: [createWeeklyScheduleFixture()],
      };

      // Act
      const result = CreateDraftFitnessPlanSchema.safeParse(input);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.status).toBe('draft');
        expect(result.data.title).toBe('My Plan');
        expect(result.data.id).toBeDefined();
        expect(result.data.createdAt).toBeInstanceOf(Date);
      }
    });

    it('should fail when title is empty', () => {
      // Arrange
      const input: CreateDraftInput = {
        userId: '550e8400-e29b-41d4-a716-446655440000',
        title: '',
        description: 'Test',
        planType: 'general_fitness',
        goals: createFitnessPlanFixture().goals,
        progression: createFitnessPlanFixture().progression,
        constraints: createFitnessPlanFixture().constraints,
        startDate: new Date(),
        weeks: [createWeeklyScheduleFixture()],
      };

      // Act
      const result = CreateDraftFitnessPlanSchema.safeParse(input);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toMatch(/too_small[\s\S]*min[\s\S]*1/i);
      }
    });
  });

  describe('Factory (Activation)', () => {
    it('should activate a valid draft plan', () => {
      // Arrange
      const draft = createFitnessPlanFixture({ status: 'draft' });
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const input = {
        ...draft,
        startDate: tomorrow,
      };

      // Act
      const result = ActivateFitnessPlanSchema.safeParse(input);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.status).toBe('active');
        expect(result.data.updatedAt.getTime()).toBeGreaterThan(draft.updatedAt.getTime());
      }
    });

    it('should fail if plan has no weeks', () => {
      // Arrange
      const draft = createFitnessPlanFixture({ status: 'draft', weeks: [] });

      // Act
      const result = ActivateFitnessPlanSchema.safeParse(draft);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toMatch(/no weeks/i);
      }
    });

    it('should fail if start date is in the past', () => {
      // Arrange
      const draft = createFitnessPlanFixture({ status: 'draft' });
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const input = {
        ...draft,
        startDate: yesterday,
      };

      // Act
      const result = ActivateFitnessPlanSchema.safeParse(input);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toMatch(/past/i);
      }
    });
  });

  describe('View Mapper', () => {
    it('should map entity to view model with all basic fields', () => {
      // Arrange
      const plan = createFitnessPlanFixture();

      // Act
      const view = toFitnessPlanView(plan);

      // Assert
      expect(view.id).toBe(plan.id);
      expect(view.title).toBe(plan.title);
      expect(view.planType).toBe(plan.planType);
      expect(typeof view.id).toBe('string');
      expect(typeof view.title).toBe('string');
    });

    it('should serialize dates as ISO strings', () => {
      // Arrange
      const plan = createFitnessPlanFixture();

      // Act
      const view = toFitnessPlanView(plan);

      // Assert
      expect(typeof view.startDate).toBe('string');
      expect(typeof view.createdAt).toBe('string');
      expect(typeof view.updatedAt).toBe('string');
      expect(() => new Date(view.startDate)).not.toThrow();
      expect(() => new Date(view.createdAt)).not.toThrow();
    });

    it('should include computed summary fields', () => {
      // Arrange
      const plan = createFitnessPlanFixture();

      // Act
      const view = toFitnessPlanView(plan);

      // Assert
      expect(view.summary).toBeDefined();
      expect(typeof view.summary.total).toBe('number');
      expect(typeof view.summary.completed).toBe('number');
      expect(view.summary.completed).toBeGreaterThanOrEqual(0);
      expect(view.summary.completed).toBeLessThanOrEqual(view.summary.total);
    });

    it('should include current workout when scheduled', () => {
      // Arrange
      const plan = createFitnessPlanFixture({
        currentPosition: { week: 1, day: 1 }
      });

      // Act
      const view = toFitnessPlanView(plan);

      // Assert
      expect(view.currentWorkout).toBeDefined();
      expect(view.currentWorkout?.dayOfWeek).toBe(1);
      expect(view.currentWorkout?.weekNumber).toBe(1);
    });

    it('should handle missing current workout gracefully', () => {
      // Arrange
      const plan = createFitnessPlanFixture({
        currentPosition: { week: 1, day: 2 } // Day 2 has no workout in fixture
      });

      // Act
      const view = toFitnessPlanView(plan);

      // Assert
      expect(view.currentWorkout).toBeUndefined();
    });

    it('should map readonly arrays to mutable presentation arrays', () => {
      // Arrange
      const plan = createFitnessPlanFixture();

      // Act
      const view = toFitnessPlanView(plan);

      // Assert
      expect(Array.isArray(view.goals.secondary)).toBe(true);
      expect(view.goals.secondary).toEqual(plan.goals.secondary);

      if (view.goals.targetMetrics.targetWeights) {
        expect(Array.isArray(view.goals.targetMetrics.targetWeights)).toBe(true);
      }

      expect(Array.isArray(view.weeks)).toBe(true);
      expect(view.weeks.length).toBe(plan.weeks.length);
    });

    it('should omit internal fields from view', () => {
      // Arrange
      const plan = createFitnessPlanFixture({ templateId: 'internal-template-123' });

      // Act
      const view = toFitnessPlanView(plan);

      // Assert
      expect('templateId' in view).toBe(false);
    });

    it('should include current week in view', () => {
      // Arrange
      const plan = createFitnessPlanFixture({
        currentPosition: { week: 1, day: 1 }
      });

      // Act
      const view = toFitnessPlanView(plan);

      // Assert
      expect(view.currentWeek).toBeDefined();
      expect(view.currentWeek?.weekNumber).toBe(1);
    });
  });
});
