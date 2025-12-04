import { WorkoutGoals } from '@/fitness-plan/value-objects/index.js';
import { WorkoutActivity } from '@/workouts/index.js';

// --- Type Definitions (Unchanged) ---
export type WorkoutType = 'running' | 'cycling' | 'strength' | 'rest' | 'custom'; // Abridged for brevity
export type WorkoutCategory = 'cardio' | 'strength' | 'recovery'; // Abridged
export type WorkoutStatus =
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'skipped'
  | 'rescheduled';
export type WorkoutImportance = 'optional' | 'recommended' | 'key' | 'critical';

export interface WorkoutAlternative {
  reason: string;
  activities: WorkoutActivity[];
}

export interface WorkoutTemplateData {
  id: string; // Entity ID
  planId: string;
  weekNumber: number;
  dayOfWeek: number;
  scheduledDate: string;
  title: string;
  type: WorkoutType;
  category: WorkoutCategory;
  goals: WorkoutGoals;
  activities: WorkoutActivity[];
  status: WorkoutStatus;
  completedWorkoutId?: string;
  userNotes?: string;
  rescheduledTo?: string;
  coachNotes?: string;
  importance: WorkoutImportance;
  alternatives?: WorkoutAlternative[];
}

// The core data structure is an immutable interface
export type WorkoutTemplate = Readonly<WorkoutTemplateData>;
