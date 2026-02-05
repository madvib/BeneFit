import { z } from 'zod';
import { WorkoutTemplateSchema } from '../workout-template/index.js';

export interface TemplateCompatibilityResult {
  canUse: boolean;
  reasons: string[];
}

export const WeeklyScheduleSchema = z.object({
  id: z.uuid(),
  weekNumber: z.number().int().min(1).max(52),
  planId: z.uuid(),

  // Dates
  startDate: z.coerce.date<Date>(),
  endDate: z.coerce.date<Date>(),

  focus: z.string().min(1).max(200),
  targetWorkouts: z.number().int().min(0).max(10),
  notes: z.string().min(1).max(500).optional(),

  workouts: z.array(WorkoutTemplateSchema),

  workoutsCompleted: z.number().int().min(0).max(10),
});

export type WeeklySchedule = Readonly<z.infer<typeof WeeklyScheduleSchema>>;
