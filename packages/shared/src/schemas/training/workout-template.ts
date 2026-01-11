import { z } from 'zod';
import { WorkoutGoalsSchema } from './workout-goals.js';
import { WorkoutActivitySchema } from './workout-activity.js';

// Workout Template Schemas

export const WorkoutTypeSchema = z.string(); // "Upper Body Strength", "5K Run", etc.

export const WorkoutCategorySchema = z.enum(['cardio', 'strength', 'recovery']);

export const WorkoutStatusSchema = z.enum([
  'scheduled',
  'in_progress',
  'completed',
  'skipped',
  'rescheduled',
]);

export const WorkoutImportanceSchema = z.enum([
  'optional',
  'recommended',
  'key',
  'critical',
]);

export const WorkoutAlternativeSchema = z.object({
  reason: z.string(),
  activities: z.array(WorkoutActivitySchema),
});

export const WorkoutTemplateSchema = z.object({
  id: z.string(),
  weekNumber: z.number(),
  dayOfWeek: z.number(),
  scheduledDate: z.string(), // ISO date string
  title: z.string(),
  description: z.string().optional(),
  type: WorkoutTypeSchema,
  category: WorkoutCategorySchema,
  goals: WorkoutGoalsSchema,
  activities: z.array(WorkoutActivitySchema),
  status: WorkoutStatusSchema,
  completedWorkoutId: z.string().optional(),
  userNotes: z.string().optional(),
  rescheduledTo: z.string().optional(), // ISO date string
  coachNotes: z.string().optional(),
  importance: WorkoutImportanceSchema,
  alternatives: z.array(WorkoutAlternativeSchema).optional(),
});

// Export inferred types
export type WorkoutType = z.infer<typeof WorkoutTypeSchema>;
export type WorkoutCategory = z.infer<typeof WorkoutCategorySchema>;
export type WorkoutStatus = z.infer<typeof WorkoutStatusSchema>;
export type WorkoutImportance = z.infer<typeof WorkoutImportanceSchema>;
export type WorkoutAlternative = z.infer<typeof WorkoutAlternativeSchema>;
export type WorkoutTemplate = z.infer<typeof WorkoutTemplateSchema>;
