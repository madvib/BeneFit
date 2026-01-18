import { CreateView } from '@bene/shared';
import { WorkoutGoals } from '@/fitness-plan/value-objects/index.js';
import { WorkoutActivity, WorkoutType } from '@/workouts/index.js';

// --- Type Definitions (Unchanged) ---
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
  scheduledDate: Date;
  title: string;
  description?: string;
  type: WorkoutType;
  category: WorkoutCategory;
  goals: WorkoutGoals;
  activities: WorkoutActivity[];
  status: WorkoutStatus;
  completedWorkoutId?: string;
  userNotes?: string;
  rescheduledTo?: Date;
  coachNotes?: string;
  importance: WorkoutImportance;
  alternatives?: WorkoutAlternative[];
}

// The core data structure is an immutable interface
export type WorkoutTemplate = Readonly<WorkoutTemplateData>;

// ============================================
// View Interface (API Presentation)
// ============================================

export type WorkoutTemplateView = CreateView<
  WorkoutTemplate,
  never,
  {
    scheduledDate: string;
    rescheduledTo?: string;
    // Computed fields from queries
    estimatedDuration: number;
    isPastDue: boolean;
    isCompleted: boolean;
  }
>;

