import type {
  FitnessGoals,
  Injury,
  TrainingConstraints,
  UserExperienceLevel,
} from '@bene/training-core';

export interface CurrentPlanContext {
  planId: string;
  planName: string;
  weekNumber: number;
  dayNumber: number;
  totalWeeks: number;
  adherenceRate: number; // 0-1
  completionRate: number; // 0-1
}

export interface RecentWorkoutSummary {
  workoutId: string;
  date: Date;
  type: string;
  durationMinutes: number;
  perceivedExertion: number; // 1-10
  enjoyment: number; // 1-5
  difficultyRating: 'too_easy' | 'just_right' | 'too_hard';
  completed: boolean;
  notes?: string;
}

export const TREND_MAPS = {
  quantity: {
    1: 'increasing',
    0: 'stable',
    [-1]: 'decreasing',
  } as const,

  relative: {
    1: 'high',
    0: 'medium',
    [-1]: 'low',
  } as const,

  subjective: {
    1: 'improving',
    0: 'stable',
    [-1]: 'declining',
  } as const,
} as const;

// Extract types from the mappings
type QuantityTrend = (typeof TREND_MAPS.quantity)[keyof typeof TREND_MAPS.quantity];
type RelativeTrend = (typeof TREND_MAPS.relative)[keyof typeof TREND_MAPS.relative];
type SubjectiveTrend =
  (typeof TREND_MAPS.subjective)[keyof typeof TREND_MAPS.subjective];

export interface PerformanceTrends {
  volumeTrend: QuantityTrend;
  adherenceTrend: SubjectiveTrend;
  energyTrend: RelativeTrend;
  exertionTrend: QuantityTrend;
  enjoymentTrend: SubjectiveTrend;
}

export interface CoachContextData {
  // Current plan state
  currentPlan?: CurrentPlanContext;

  // Recent workout history
  recentWorkouts: RecentWorkoutSummary[];

  // User profile (at time of conversation)
  userGoals: FitnessGoals;
  userConstraints: TrainingConstraints;
  experienceLevel: UserExperienceLevel;

  // Performance trends
  trends: PerformanceTrends;

  // Current state
  daysIntoCurrentWeek: number;
  workoutsThisWeek: number;
  plannedWorkoutsThisWeek: number;

  // Health signals
  reportedInjuries?: Injury[];
  energyLevel: 'low' | 'medium' | 'high';
  stressLevel?: 'low' | 'medium' | 'high';
  sleepQuality?: 'poor' | 'fair' | 'good';
}

export type CoachContext = Readonly<CoachContextData>;
