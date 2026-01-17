import { faker } from '@faker-js/faker';
import { CoachContext, CurrentPlanContext, RecentWorkoutSummary, PerformanceTrends } from '../coach-context.types.js';
import type { FitnessGoals, TrainingConstraints, UserExperienceLevel, Injury } from '@bene/training-core';

export function createCurrentPlanContextFixture(
  overrides?: Partial<CurrentPlanContext>
): CurrentPlanContext {
  return {
    planId: faker.string.uuid(),
    planName: faker.lorem.words(3),
    weekNumber: faker.number.int({ min: 1, max: 12 }),
    dayNumber: faker.number.int({ min: 1, max: 7 }),
    totalWeeks: faker.number.int({ min: 8, max: 16 }),
    adherenceRate: faker.number.float({ min: 0.5, max: 1, fractionDigits: 2 }),
    completionRate: faker.number.float({ min: 0.4, max: 1, fractionDigits: 2 }),
    ...overrides,
  };
}

export function createRecentWorkoutSummaryFixture(
  overrides?: Partial<RecentWorkoutSummary>
): RecentWorkoutSummary {
  return {
    workoutId: faker.string.uuid(),
    date: faker.date.recent({ days: 14 }),
    type: faker.helpers.arrayElement(['strength', 'cardio', 'mobility', 'hiit']),
    durationMinutes: faker.number.int({ min: 20, max: 90 }),
    perceivedExertion: faker.number.int({ min: 1, max: 10 }),
    enjoyment: faker.number.int({ min: 1, max: 5 }),
    difficultyRating: faker.helpers.arrayElement(['too_easy', 'just_right', 'too_hard'] as const),
    completed: faker.datatype.boolean({ probability: 0.8 }),
    notes: faker.datatype.boolean() ? faker.lorem.sentence() : undefined,
    ...overrides,
  };
}

export function createPerformanceTrendsFixture(
  overrides?: Partial<PerformanceTrends>
): PerformanceTrends {
  return {
    volumeTrend: faker.helpers.arrayElement(['increasing', 'stable', 'decreasing'] as const),
    adherenceTrend: faker.helpers.arrayElement(['improving', 'stable', 'declining'] as const),
    energyTrend: faker.helpers.arrayElement(['high', 'medium', 'low'] as const),
    exertionTrend: faker.helpers.arrayElement(['increasing', 'stable', 'decreasing'] as const),
    enjoymentTrend: faker.helpers.arrayElement(['improving', 'stable', 'declining'] as const),
    ...overrides,
  };
}

export function createCoachContextFixture(overrides?: Partial<CoachContext>): CoachContext {
  const userGoals: FitnessGoals = {
    primary: faker.helpers.arrayElement(['strength', 'hypertrophy', 'endurance', 'weight_loss'] as const),
    secondary: faker.helpers.arrayElements(['mobility', 'endurance'], { min: 0, max: 2 }),
    targetWeight: {
      current: faker.number.int({ min: 60, max: 100 }),
      target: faker.number.int({ min: 70, max: 90 }),
      unit: 'kg',
    },
    targetBodyFat: faker.number.int({ min: 10, max: 25 }),
    targetDate: faker.date.future(),
    motivation: faker.lorem.sentence(),
    successCriteria: [faker.lorem.sentence()],
  };

  const userConstraints: TrainingConstraints = {
    availableDays: faker.helpers.arrayElements(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], { min: 3, max: 6 }),
    availableEquipment: faker.helpers.arrayElements(['dumbbells', 'barbell', 'resistance_bands'], {
      min: 1,
      max: 3,
    }),
    location: faker.helpers.arrayElement(['home', 'gym', 'outdoor', 'mixed'] as const),
    injuries: faker.datatype.boolean({ probability: 0.3 })
      ? [
        {
          bodyPart: faker.helpers.arrayElement(['knee', 'shoulder', 'back', 'ankle']),
          severity: faker.helpers.arrayElement(['minor', 'moderate', 'serious'] as const),
          reportedDate: faker.date.recent({ days: 30 }).toISOString(),
          avoidExercises: faker.helpers.arrayElements(['squats', 'deadlifts', 'overhead_press'], {
            min: 1,
            max: 2,
          }),
        } as Injury,
      ]
      : undefined,
  };

  return {
    currentPlan: faker.datatype.boolean() ? createCurrentPlanContextFixture() : undefined,
    recentWorkouts: faker.helpers.multiple(() => createRecentWorkoutSummaryFixture(), {
      count: { min: 3, max: 10 },
    }),
    userGoals,
    userConstraints,
    experienceLevel: faker.helpers.arrayElement([
      'beginner',
      'intermediate',
      'advanced',
      'elite',
    ] as UserExperienceLevel[]),
    trends: createPerformanceTrendsFixture(),
    daysIntoCurrentWeek: faker.number.int({ min: 0, max: 7 }),
    workoutsThisWeek: faker.number.int({ min: 0, max: 6 }),
    plannedWorkoutsThisWeek: faker.number.int({ min: 3, max: 6 }),
    reportedInjuries: userConstraints.injuries ? [...userConstraints.injuries] : undefined,
    energyLevel: faker.helpers.arrayElement(['low', 'medium', 'high'] as const),
    stressLevel: faker.helpers.arrayElement(['low', 'medium', 'high'] as const),
    sleepQuality: faker.helpers.arrayElement(['poor', 'fair', 'good'] as const),
    ...overrides,
  };
}
