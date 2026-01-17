import { WorkoutPerformance } from '../workout-performance.types.js';
import { createWorkoutPerformance } from '../workout-performance.factory.js';

/**
 * Canonical Fixtures for WorkoutPerformance
 */

export function createMinimalPerformanceFixture(overrides?: Partial<WorkoutPerformance>): WorkoutPerformance {
  const result = createWorkoutPerformance({
    startedAt: new Date('2024-01-15T10:00:00Z'),
    completedAt: new Date('2024-01-15T11:00:00Z'),
    activities: [{
      activityType: 'main',
      completed: true,
      durationMinutes: 45,
      exercises: [{
        name: 'Bench Press',
        setsCompleted: 3,
        setsPlanned: 3,
        reps: [10, 10, 8],
        weight: [60, 60, 65],
      }],
    }],
    perceivedExertion: 7,
    energyLevel: 'medium',
    enjoyment: 4,
    difficultyRating: 'just_right',
  });

  if (result.isFailure) {
    throw new Error(`Failed to create fixture: ${ result.error }`);
  }

  return { ...result.value, ...overrides };
}

export function createFullPerformanceFixture(overrides?: Partial<WorkoutPerformance>): WorkoutPerformance {
  const result = createWorkoutPerformance({
    startedAt: new Date('2024-01-15T10:00:00Z'),
    completedAt: new Date('2024-01-15T11:30:00Z'),
    activities: [
      {
        activityType: 'warmup',
        completed: true,
        durationMinutes: 10,
        notes: 'Light cardio and stretching',
      },
      {
        activityType: 'main',
        completed: true,
        durationMinutes: 60,
        exercises: [
          {
            name: 'Squats',
            setsCompleted: 4,
            setsPlanned: 4,
            reps: [10, 10, 8, 6],
            weight: [100, 110, 120, 130],
          },
          {
            name: 'Bench Press',
            setsCompleted: 3,
            setsPlanned: 3,
            reps: [10, 8, 6],
            weight: [60, 70, 80],
          },
        ],
      },
      {
        activityType: 'cooldown',
        completed: true,
        durationMinutes: 10,
        notes: 'Stretching and foam rolling',
      },
    ],
    perceivedExertion: 8,
    energyLevel: 'high',
    enjoyment: 5,
    difficultyRating: 'just_right',
    heartRate: {
      average: 145,
      max: 175,
      zones: {
        'zone1': 300,
        'zone2': 1200,
        'zone3': 900,
        'zone4': 300,
      },
    },
    caloriesBurned: 450,
    notes: 'Great workout! Felt strong today.',
  });

  if (result.isFailure) {
    throw new Error(`Failed to create fixture: ${ result.error }`);
  }

  return { ...result.value, ...overrides };
}

export function createCardioPerformanceFixture(overrides?: Partial<WorkoutPerformance>): WorkoutPerformance {
  const result = createWorkoutPerformance({
    startedAt: new Date('2024-01-15T06:00:00Z'),
    completedAt: new Date('2024-01-15T07:00:00Z'),
    activities: [{
      activityType: 'main',
      completed: true,
      durationMinutes: 60,
      exercises: [{
        name: 'Running',
        setsCompleted: 1,
        setsPlanned: 1,
        distance: 10, // 10km
        duration: 3600, // 1 hour
      }],
    }],
    perceivedExertion: 7,
    energyLevel: 'medium',
    enjoyment: 4,
    difficultyRating: 'just_right',
    heartRate: {
      average: 155,
      max: 180,
    },
    caloriesBurned: 600,
  });

  if (result.isFailure) {
    throw new Error(`Failed to create fixture: ${ result.error }`);
  }

  return { ...result.value, ...overrides };
}
