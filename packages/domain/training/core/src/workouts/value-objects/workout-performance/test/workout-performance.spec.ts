import { describe, it, expect } from 'vitest';
import { createWorkoutPerformance } from '../workout-performance.factory.js';

describe('WorkoutPerformance', () => {
  const validActivity = {
    activityType: 'main' as const,
    completed: true,
    durationMinutes: 30,
  };

  const validProps = {
    startedAt: new Date('2023-01-01T10:00:00Z'),
    completedAt: new Date('2023-01-01T11:00:00Z'),
    activities: [validActivity],
    perceivedExertion: 5,
    energyLevel: 'medium' as const,
    enjoyment: 3,
    difficultyRating: 'just_right' as const,
  };

  describe('createWorkoutPerformance', () => {
    it('should create a valid workout performance', () => {
      const result = createWorkoutPerformance(validProps);

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.durationMinutes).toBe(60);
        expect(result.value.activities.length).toBe(1);
      }
    });

    it('should fail if completedAt is before startedAt', () => {
      const result = createWorkoutPerformance({
        ...validProps,
        completedAt: new Date('2023-01-01T09:00:00Z'),
      });

      expect(result.isFailure).toBe(true);
    });

    it('should fail if activities array is empty', () => {
      const result = createWorkoutPerformance({
        ...validProps,
        activities: [],
      });

      expect(result.isFailure).toBe(true);
    });

    it('should fail if perceivedExertion is out of range', () => {
      const result = createWorkoutPerformance({
        ...validProps,
        perceivedExertion: 11,
      });

      expect(result.isFailure).toBe(true);
    });

    it('should fail if enjoyment is out of range', () => {
      const result = createWorkoutPerformance({
        ...validProps,
        enjoyment: 0,
      });

      expect(result.isFailure).toBe(true);
    });

    it('should validate heart rate data', () => {
      const result = createWorkoutPerformance({
        ...validProps,
        heartRate: {
          average: 150,
          max: 140, // Invalid: max < average
        },
      });

      expect(result.isFailure).toBe(true);
    });

    it('should validate exercise data', () => {
      const result = createWorkoutPerformance({
        ...validProps,
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

      expect(result.isFailure).toBe(true);
    });

    it('should create with full exercise data', () => {
      const result = createWorkoutPerformance({
        ...validProps,
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

      expect(result.isSuccess).toBe(true);
    });
  });
});
