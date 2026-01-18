import { CreateView } from '@bene/shared';
import {
  PlanGoals,
  PlanGoalsView,
  ProgressionStrategy,
  PlanPosition,
  WorkoutPreview,
} from '@/fitness-plan/value-objects/index.js';
import { TrainingConstraints } from '@/shared/index.js';
import { WeeklySchedule, WeeklyScheduleView } from '../weekly-schedule/index.js';
import { WorkoutTemplateView } from '../workout-template/index.js';

export type PlanType =
  | 'event_training'
  | 'habit_building'
  | 'strength_program'
  | 'general_fitness';

export type PlanStatus = 'draft' | 'active' | 'paused' | 'completed' | 'abandoned';

interface FitnessPlanData {
  id: string; // Aggregate Root ID
  userId: string;
  title: string;
  description: string;
  planType: PlanType;
  templateId?: string; // Reference to plan template if created from one
  goals: PlanGoals;
  progression: ProgressionStrategy;
  constraints: TrainingConstraints;
  weeks: WeeklySchedule[];
  status: PlanStatus;
  currentPosition: PlanPosition;
  startDate: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// The core data structure is an immutable interface
export type FitnessPlan = Readonly<FitnessPlanData>;

// ============================================
// View Interface (API Presentation)
// ============================================

/**
 * FitnessPlan view for API consumption
 * 
 * Differences from entity:
 * - Dates serialized as ISO strings (handled by CreateView)
 * - Enriched with computed fields (currentWorkout, currentWeek, summary)
 * - Omits templateId (internal detail)
 */
export type FitnessPlanView = CreateView<
  FitnessPlan,
  'templateId' | 'weeks', // Omitted fields
  {
    weeks: WeeklyScheduleView[];
    // Computed/enriched fields
    // Note: 'goals' is auto-converted by CreateView > SerializeDates if not omitted
    // But we can explicitly override if we want to enforce the named type
    goals: PlanGoalsView;

    currentWorkout?: WorkoutTemplateView;
    currentWeek?: WeeklyScheduleView;
    summary: {
      total: number;
      completed: number;
    };
  }
>;

export interface PlanPreview {
  weekNumber: number;
  workouts: WorkoutPreview[];
}

