import { fitnessPlan } from '@bene/react-api-client';
import type { PlanGoals } from '@bene/shared';
import { mockTrainingConstraints } from './training.js';

export const mockPlanGoals: PlanGoals = {
  primary: 'strength',
  secondary: ['muscle_growth'],
  targetMetrics: {
    targetWeights: [
      { exercise: 'Squat', weight: 140 },
      { exercise: 'Bench Press', weight: 100 },
    ],
    totalWorkouts: 48,
  },
  targetDate: '2026-06-01',
};

export const mockActivePlan: fitnessPlan.GetActivePlanResponse = {
  hasPlan: true,
  plan: {
    id: 'plan-456',
    title: 'Strength Building Program',
    description: '12-week intermediate strength program',
    planType: 'strength_program',
    durationWeeks: 12,
    currentWeek: 4,
    currentPosition: { week: 4, day: 2 },
    status: 'active',
    startDate: '2025-12-15',
    endDate: '2026-03-08',
    startedAt: '2025-12-15T00:00:00Z',
    weeks: [
      {
        //TODO this is correct but we need to update the Gateway/UseCase!
        id: 'week-1',
        weekNumber: 1,
        startDate: '2025-12-15',
        endDate: '2025-12-21',
        focus: 'Foundation Week - Learning Movement Patterns',
        targetWorkouts: 3,
        workoutsCompleted: 3,
        notes: 'Focus on form over weight',
        workouts: [
          {
            id: 'workout-1',
            type: 'Upper Body Strength',
            dayOfWeek: 1,
            status: 'completed',
            durationMinutes: 60,
          },
          {
            id: 'workout-2',
            type: 'Lower Body Strength',
            dayOfWeek: 3,
            status: 'completed',
            durationMinutes: 60,
          },
          {
            id: 'workout-3',
            type: 'Full Body',
            dayOfWeek: 5,
            status: 'completed',
            durationMinutes: 55,
          },
        ],
      },
      {
        id: 'week-4',
        weekNumber: 4,
        startDate: '2026-01-05',
        endDate: '2026-01-11',
        focus: 'Deload Week - Recovery and Adaptation',
        targetWorkouts: 3,
        workoutsCompleted: 2,
        notes: 'Reduce weight by 40%, focus on recovery',
        workouts: [
          {
            id: 'workout-10',
            type: 'Upper Body Deload',
            dayOfWeek: 1,
            status: 'completed',
            durationMinutes: 45,
          },
          {
            id: 'workout-11',
            type: 'Lower Body Deload',
            dayOfWeek: 3,
            status: 'completed',
            durationMinutes: 45,
          },
          {
            id: 'workout-12',
            type: 'Active Recovery',
            dayOfWeek: 5,
            status: 'scheduled',
            durationMinutes: 30,
          },
        ],
      },
    ],
    summary: {
      total: 36,
      completed: 12,
    },
    goals: mockPlanGoals,
    progression: {
      type: 'linear',
      weeklyIncrease: 0.025, // 2.5% per week
      deloadWeeks: [4, 8, 12],
      maxIncrease: 5, // kg max increase per week
      minIncrease: 1.25, // kg minimum progression
    },
    constraints: mockTrainingConstraints,
  },
};
