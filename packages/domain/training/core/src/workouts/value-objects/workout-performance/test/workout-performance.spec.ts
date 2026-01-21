import { describe, it, expect } from 'vitest';
import { CreateWorkoutPerformanceSchema } from '../workout-performance.factory.js';

describe('WorkoutPerformance', () => {
  const validActivity = {
    activityType: 'main' as const,
    completed: true,
    durationMinutes: 30,
  };

  const validInput = {
    startedAt: new Date('2023-01-01T10:00:00Z'),
    completedAt: new Date('2023-01-01T11:00:00Z'),
    activities: [validActivity],
    perceivedExertion: 5,
    energyLevel: 'medium' as const,
    enjoyment: 3,
    difficultyRating: 'just_right' as const,
  };

  describe('creation', () => {
    it('should create a valid workout performance', () => {
      // Act
      const result = CreateWorkoutPerformanceSchema.safeParse(validInput);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.durationMinutes).toBe(60);
        expect(result.data.activities.length).toBe(1);
      }
    });
  });

  describe('validation', () => {
    it('should fail if completedAt is before startedAt', () => {
      // Act
      const result = CreateWorkoutPerformanceSchema.safeParse({
        ...validInput,
        completedAt: new Date('2023-01-01T09:00:00Z'),
      });

      // Assert
      expect(result.success).toBe(false);
    });

    it('should fail if activities array is empty', () => {
      // Act
      const result = CreateWorkoutPerformanceSchema.safeParse({
        ...validInput,
        activities: [],
      });

      // Assert
      expect(result.success).toBe(false);
    });

    it('should fail if perceivedExertion is out of range', () => {
      // Act
      const result = CreateWorkoutPerformanceSchema.safeParse({
        ...validInput,
        perceivedExertion: 11,
      });

      // Assert
      expect(result.success).toBe(false);
    });

    it('should fail if enjoyment is out of range', () => {
      // Act
      const result = CreateWorkoutPerformanceSchema.safeParse({
        ...validInput,
        enjoyment: 0,
      });

      // Assert
      expect(result.success).toBe(false);
    });

    it('should validate heart rate data', () => {
      // Act
      const result = CreateWorkoutPerformanceSchema.safeParse({
        ...validInput,
        heartRate: {
          average: 150,
          max: 140, // Invalid: max < average
        },
      });

      // Assert
      expect(result.success).toBe(false);
    });

    it('should validate exercise data', () => {
      // Act
      const result = CreateWorkoutPerformanceSchema.safeParse({
        ...validInput,
        activities: [
          {
            ...validActivity,
            exercises: [
              {
                name: 'Squats',
                setsCompleted: 3,
                setsPlanned: 3,
                reps: [10, 10], // Invalid: length 2 != setsCompleted 3
              },
            ],
          },
        ],
      });

      // Assert
      expect(result.success).toBe(false);
    });

    it('should create with full exercise data', () => {
      // Act
      const result = CreateWorkoutPerformanceSchema.safeParse({
        ...validInput,
        activities: [
          {
            ...validActivity,
            exercises: [
              {
                name: 'Squats',
                setsCompleted: 3,
                setsPlanned: 3,
                reps: [10, 10, 10],
                weight: [100, 100, 100],
              },
            ],
          },
        ],
      });

      // Assert
      expect(result.success).toBe(true);
    });
  });
});

