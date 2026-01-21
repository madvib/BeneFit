import { faker } from '@faker-js/faker';
import { WorkoutPerformance } from '../workout-performance.types.js';
import { workoutPerformanceFromPersistence } from '../workout-performance.factory.js';

/**
 * Canonical Fixtures for WorkoutPerformance
 */

export function createMinimalPerformanceFixture(overrides?: Partial<WorkoutPerformance>): WorkoutPerformance {
  const startedAt = faker.date.recent();
  const completedAt = new Date(startedAt.getTime() + 45 * 60000);

  const data = {
    startedAt,
    completedAt,
    durationMinutes: 45,
    activities: [{
      id: faker.string.uuid(),
      activityType: 'main' as const,
      completed: true,
      durationMinutes: 45,
      exercises: [{
        name: faker.helpers.arrayElement(['Bench Press', 'Squats', 'Deadlift']),
        setsCompleted: 3,
        setsPlanned: 3,
        reps: [10, 10, 8],
        weight: [60, 60, 65],
      }],
    }],
    perceivedExertion: 7,
    energyLevel: 'medium' as const,
    enjoyment: 4,
    difficultyRating: 'just_right' as const,
    ...overrides,
  };

  const result = workoutPerformanceFromPersistence(data);

  if (result.isFailure) {
    throw new Error(`Failed to create workout performance fixture: ${ result.error }`);
  }

  return result.value;
}

export function createFullPerformanceFixture(overrides?: Partial<WorkoutPerformance>): WorkoutPerformance {
  const startedAt = faker.date.recent();
  const completedAt = new Date(startedAt.getTime() + 80 * 60000);

  const data = {
    startedAt,
    completedAt,
    durationMinutes: 80,
    activities: [
      {
        id: faker.string.uuid(),
        activityType: 'warmup' as const,
        completed: true,
        durationMinutes: 10,
        notes: faker.lorem.sentence(),
      },
      {
        id: faker.string.uuid(),
        activityType: 'main' as const,
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
        id: faker.string.uuid(),
        activityType: 'cooldown' as const,
        completed: true,
        durationMinutes: 10,
        notes: faker.lorem.sentence(),
      },
    ],
    perceivedExertion: 8,
    energyLevel: 'high' as const,
    enjoyment: 5,
    difficultyRating: 'just_right' as const,
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
    notes: faker.lorem.paragraph(),
    ...overrides,
  };

  const result = workoutPerformanceFromPersistence(data);

  if (result.isFailure) {
    throw new Error(`Failed to create full performance fixture: ${ result.error }`);
  }

  return result.value;
}

export function createCardioPerformanceFixture(overrides?: Partial<WorkoutPerformance>): WorkoutPerformance {
  const startedAt = faker.date.recent();
  const completedAt = new Date(startedAt.getTime() + 60 * 60000);

  const data = {
    startedAt,
    completedAt,
    durationMinutes: 60,
    activities: [{
      id: faker.string.uuid(),
      activityType: 'main' as const,
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
    energyLevel: 'medium' as const,
    enjoyment: 4,
    difficultyRating: 'just_right' as const,
    heartRate: {
      average: 155,
      max: 180,
    },
    caloriesBurned: 600,
    ...overrides,
  };

  const result = workoutPerformanceFromPersistence(data);

  if (result.isFailure) {
    throw new Error(`Failed to create cardio performance fixture: ${ result.error }`);
  }

  return result.value;
}

