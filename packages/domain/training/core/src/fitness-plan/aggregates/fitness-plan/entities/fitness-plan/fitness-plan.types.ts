import {
  PlanGoals,
  ProgressionStrategy,
  PlanPosition,
} from '@/fitness-plan/value-objects/index.js';
import { TrainingConstraints } from '@/shared/index.js';
import { WeeklySchedule } from '../weekly-schedule/index.js';
import { WorkoutTemplate } from '../workout-template/index.js';

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
 * - Dates serialized as ISO strings
 * - Enriched with computed fields (currentWorkout, currentWeek, summary)
 * - Omits templateId (internal detail)
 */
export interface FitnessPlanView extends Omit<FitnessPlan, 'startDate' | 'endDate' | 'createdAt' | 'updatedAt' | 'templateId'> {
  // Date fields as ISO strings for JSON serialization
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt?: string;

  // Computed/enriched fields
  currentWorkout?: WorkoutTemplate;
  currentWeek?: WeeklySchedule;
  summary: {
    total: number;
    completed: number;
  };
}

