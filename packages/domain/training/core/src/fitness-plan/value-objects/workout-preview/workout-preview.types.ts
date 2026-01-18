import { WorkoutType } from '@/workouts/value-objects/index.js';

export interface WorkoutPreviewData {
  weekNumber: number;
  dayOfWeek: number;
  workoutSummary: string;
  type?: WorkoutType;
}

export type WorkoutPreview = Readonly<WorkoutPreviewData>;
