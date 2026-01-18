import { CreateView } from '@bene/shared';
import { WorkoutTemplate, WorkoutTemplateView } from "../workout-template/index.js";

export interface WeeklyScheduleData {
  id: string;
  weekNumber: number;
  planId: string;
  startDate: Date;
  endDate: Date;
  focus: string;
  targetWorkouts: number;
  notes?: string;
  workouts: WorkoutTemplate[];
  workoutsCompleted: number;
}
export type WeeklySchedule = Readonly<WeeklyScheduleData>;

export interface TemplateCompatibilityResult {
  canUse: boolean;
  reasons: string[];
}

// ============================================
// View Interface (API Presentation)
// ============================================



export type WeeklyScheduleView = CreateView<
  WeeklySchedule,
  'workouts',
  {
    workouts: WorkoutTemplateView[];
    startDate: string;
    endDate: string;
    progress: {
      onTrack: boolean;
      completionRate: number;
      workoutsRemaining: number;
      daysRemaining: number;
    };
  }
>;
