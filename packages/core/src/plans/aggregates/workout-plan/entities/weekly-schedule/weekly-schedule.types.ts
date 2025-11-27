import { WorkoutTemplate } from '../workout-template/workout-template.deprecated.js';

export interface WeeklyScheduleData {
  id: string; // Must be part of the core data now
  weekNumber: number;
  planId: string;
  startDate: string;
  endDate: string;
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