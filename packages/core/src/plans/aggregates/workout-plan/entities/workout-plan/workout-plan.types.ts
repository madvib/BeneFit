import { PlanGoals } from '../../../../value-objects/plan-goals/plan-goals.js';
import { PlanPosition } from '../../../../value-objects/plan-position/plan-position.js';
import { ProgressionStrategy } from '../../../../value-objects/progression-strategy/progression-strategy.js';
import { TrainingConstraints } from '../../../../value-objects/training-constraints/training-constraints.js';
import { WeeklySchedule } from '../weekly-schedule/weekly-schedule.deprecated.js'; // Use the functional type when ready!

export type PlanType = 'event_training' | 'habit_building' | 'strength_program' | 'general_fitness';
export type PlanStatus = 'draft' | 'active' | 'paused' | 'completed' | 'abandoned';

export interface WorkoutPlanData {
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