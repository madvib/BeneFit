import z from 'zod';
import { describe, it, expect } from 'vitest';
import { faker } from '@faker-js/faker';
import { randomUUID } from 'crypto';

import { createWorkoutTemplateFixture, createWeeklyScheduleFixture } from '@/fixtures.js';
import { CreateWeeklyScheduleSchema } from '../weekly-schedule.factory.js';
import { toWeeklyScheduleView } from '../weekly-schedule.view.js';

type CreateScheduleInput = z.input<typeof CreateWeeklyScheduleSchema>;

describe('WeeklySchedule Aggregate', () => {
  describe('Creation', () => {
    it('should create valid weekly schedule with default values', () => {
      // Arrange & Act
      const schedule = createWeeklyScheduleFixture();

      // Assert
      expect(schedule.id).toBeDefined();
      expect(schedule.weekNumber).toBeGreaterThanOrEqual(1);
      expect(schedule.workoutsCompleted).toBe(0);
    });

    it('should allow customization through overrides', () => {
      // Arrange & Act
      const focus = 'Test focus area';
      const targetWorkouts = 3;
      const schedule = createWeeklyScheduleFixture({
        focus,
        targetWorkouts,
      });

      // Assert
      expect(schedule.focus).toBe(focus);
      expect(schedule.targetWorkouts).toBe(targetWorkouts);
    });
  });

  describe('Validation', () => {
    const validInput: CreateScheduleInput = {
      planId: randomUUID(),
      weekNumber: 1,
      startDate: new Date(),
      endDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
      focus: 'Test focus',
      targetWorkouts: 3,
      workouts: [],
      workoutsCompleted: 0,
    };

    it('should fail when weekNumber is invalid', () => {
      // Arrange
      const input = { ...validInput, weekNumber: 0 };

      // Act
      const result = CreateWeeklyScheduleSchema.safeParse(input);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toMatch(/too_small/i);
      }
    });

    it('should fail when startDate is after endDate', () => {
      // Arrange
      const input = {
        ...validInput,
        startDate: faker.date.future(),
        endDate: faker.date.past(),
      };

      // Act
      const result = CreateWeeklyScheduleSchema.safeParse(input);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toMatch(/start date must be before/i);
      }
    });

    it('should fail when workouts exceed targetWorkouts', () => {
      // Arrange
      const workout = createWorkoutTemplateFixture();
      const input = {
        ...validInput,
        targetWorkouts: 0,
        workouts: [workout],
      };

      // Act
      const result = CreateWeeklyScheduleSchema.safeParse(input);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toMatch(/cannot have more workouts/i);
      }
    });
  });

  describe('View Mapper', () => {
    it('should map a valid weekly schedule entity to view model', () => {
      // Arrange
      const schedule = createWeeklyScheduleFixture();

      // Act
      const view = toWeeklyScheduleView(schedule);

      // Assert
      expect(view.id).toBe(schedule.id);
      expect(view.weekNumber).toBe(schedule.weekNumber);
      expect(view.focus).toBe(schedule.focus);
    });

    it('should map workouts and include progress', () => {
      // Arrange
      const schedule = createWeeklyScheduleFixture();

      // Act
      const view = toWeeklyScheduleView(schedule);

      // Assert
      expect(Array.isArray(view.workouts)).toBe(true);
      expect(view.workouts.length).toBe(schedule.workouts.length);
      expect(view.progress).toBeDefined();
      expect(typeof view.progress.completionRate).toBe('number');
      expect(typeof view.progress.onTrack).toBe('boolean');
    });
  });
});
