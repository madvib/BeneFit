import { z } from 'zod';
import { WorkoutTypeSchema } from '@/workouts/value-objects/index.js';

export const WorkoutPreviewSchema = z.object({
  weekNumber: z.number().int().min(1).max(52),
  dayOfWeek: z.number().int().min(0).max(6),
  workoutSummary: z.string().min(1).max(200),
  type: WorkoutTypeSchema.optional(),
});
