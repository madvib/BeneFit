import { z } from 'zod';
import { WorkoutTemplateSchema, toWorkoutTemplateSchema } from '../workout-template/workout-template.schema.js';
import { WeeklySchedule } from './weekly-schedule.types.js';

export const WeeklyScheduleSchema = z.object({
  id: z.string(),
  weekNumber: z.number().int().min(1).max(52),
  planId: z.string(),
  startDate: z.iso.datetime(),
  endDate: z.iso.datetime(),
  focus: z.string().min(1).max(200),
  targetWorkouts: z.number().int().min(0).max(10),
  notes: z.string().min(1).max(500).optional(),
  workouts: z.array(WorkoutTemplateSchema),
  workoutsCompleted: z.number().int().min(0).max(10),
});


export type WeeklySchedulePresentation = z.infer<typeof WeeklyScheduleSchema>;

export function toWeeklyScheduleSchema(schedule: WeeklySchedule): WeeklySchedulePresentation {
  return {
    id: schedule.id,
    weekNumber: schedule.weekNumber,
    planId: schedule.planId,
    startDate: schedule.startDate.toISOString(),
    endDate: schedule.endDate.toISOString(),
    focus: schedule.focus,
    targetWorkouts: schedule.targetWorkouts,
    notes: schedule.notes,
    workouts: schedule.workouts.map(toWorkoutTemplateSchema),
    workoutsCompleted: schedule.workoutsCompleted,
  };
}
