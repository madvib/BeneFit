import { TrainingConstraints } from '../../../plans/index.js';
import { FitnessGoals } from '../../../profile/value-objects/fitness-goals/fitness-goals.js';

type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

interface CurrentPlanContext {
  planId: string;
  planName: string;
  weekNumber: number;
  dayNumber: number;
  totalWeeks: number;
  adherenceRate: number; // 0-1
  completionRate: number; // 0-1
}

interface RecentWorkoutSummary {
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

interface PerformanceTrends {
  volumeTrend: 'increasing' | 'stable' | 'decreasing';
  adherenceTrend: 'improving' | 'stable' | 'declining';
  energyTrend: 'high' | 'medium' | 'low';
  exertionTrend: 'increasing' | 'stable' | 'decreasing';
  enjoymentTrend: 'improving' | 'stable' | 'declining';
}

interface CoachingContextData {
  // Current plan state
  currentPlan?: CurrentPlanContext;

  // Recent workout history
  recentWorkouts: RecentWorkoutSummary[];

  // User profile (at time of conversation)
  userGoals: FitnessGoals;
  userConstraints: TrainingConstraints;
  experienceLevel: ExperienceLevel;

  // Performance trends
  trends: PerformanceTrends;

  // Current state
  daysIntoCurrentWeek: number;
  workoutsThisWeek: number;
  plannedWorkoutsThisWeek: number;

  // Health signals
  reportedInjuries: string[];
  energyLevel: 'low' | 'medium' | 'high';
  stressLevel?: 'low' | 'medium' | 'high';
  sleepQuality?: 'poor' | 'fair' | 'good';
}

export type CoachingContext = Readonly<CoachingContextData>;
