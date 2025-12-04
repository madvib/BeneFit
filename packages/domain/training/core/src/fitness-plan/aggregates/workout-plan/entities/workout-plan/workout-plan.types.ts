import {
  PlanGoals,
  ProgressionStrategy,
  PlanPosition,
} from '@/fitness-plan/value-objects/index.js';
import { TrainingConstraints } from '@/shared/index.js';
import { WeeklySchedule } from '../weekly-schedule/index.js';

export type PlanType =
  | 'event_training'
  | 'habit_building'
  | 'strength_program'
  | 'general_fitness';
export type PlanStatus = 'draft' | 'active' | 'paused' | 'completed' | 'abandoned';

interface WorkoutPlanData {
  id: string; // Aggregate Root ID
  userId: string;
  title: string;
  description: string;
  planType: PlanType;
  goals: PlanGoals;
  progression: ProgressionStrategy;
  constraints: TrainingConstraints;
  weeks: WeeklySchedule[];
  status: PlanStatus;
  currentPosition: PlanPosition;
  startDate: string;
  endDate?: string;
  createdAt: Date;
  updatedAt?: Date;
}

// The core data structure is an immutable interface
export type WorkoutPlan = Readonly<WorkoutPlanData>;
