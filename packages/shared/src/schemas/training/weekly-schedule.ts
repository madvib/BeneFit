import { z } from 'zod';
import { WorkoutSummarySchema } from './fitness-plan.js';

// Weekly Schedule Schemas

export const WeeklyScheduleSchema = z.object({
  id: z.string(),
  weekNumber: z.number(),
  startDate: z.string(), // ISO date string
  endDate: z.string(), // ISO date string
  focus: z.string(), // e.g., "Build endurance", "Recovery week"
  targetWorkouts: z.number(),
  workoutsCompleted: z.number(),
  notes: z.string().optional(),
  workouts: z.array(WorkoutSummarySchema),
});

// Export inferred types
export type WeeklySchedule = z.infer<typeof WeeklyScheduleSchema>;
