import { z } from 'zod';
import { WorkoutGoalsSchema } from '@/fitness-plan/value-objects/index.js';
import { WorkoutActivitySchema, WorkoutTypeSchema } from '@/workouts/index.js';

/**
 * 1. DEFINE Enums & Value Object Schemas
 */
export const WorkoutCategorySchema = z.enum(['cardio', 'strength', 'recovery']);
export type WorkoutCategory = z.infer<typeof WorkoutCategorySchema>;

export const WorkoutStatusSchema = z.enum([
  'scheduled',
  'in_progress',
  'completed',
  'skipped',
  'rescheduled',
]);
export type WorkoutStatus = z.infer<typeof WorkoutStatusSchema>;

export const WorkoutImportanceSchema = z.enum(['optional', 'recommended', 'key', 'critical']);
export type WorkoutImportance = z.infer<typeof WorkoutImportanceSchema>;

export const WorkoutAlternativeSchema = z.object({
  reason: z.string(),
  activities: z.array(WorkoutActivitySchema),
});
export type WorkoutAlternative = z.infer<typeof WorkoutAlternativeSchema>;

/**
 * 2. CORE SCHEMA
 */
export const WorkoutTemplateSchema = z.object({
  id: z.uuid(),
  planId: z.uuid(),
  weekNumber: z.number().int().min(1).max(52),
  dayOfWeek: z.number().int().min(0).max(6),

  // Dates
  scheduledDate: z.coerce.date<Date>(),
  rescheduledTo: z.coerce.date<Date>().optional(),

  title: z.string().min(1).max(100),
  description: z.string().optional(),

  type: WorkoutTypeSchema,
  category: WorkoutCategorySchema,

  goals: WorkoutGoalsSchema,
  activities: z.array(WorkoutActivitySchema),

  status: WorkoutStatusSchema,
  completedWorkoutId: z.string().optional(), // assuming string ID for external reference

  userNotes: z.string().optional(),
  coachNotes: z.string().optional(),

  importance: WorkoutImportanceSchema,
  alternatives: z.array(WorkoutAlternativeSchema).optional(),
});


export const WORKOUT_TEMPLATE_ERRORS = {
  MISSING_ACTIVITIES: 'Non-rest workouts must have at least one activity',
} as const;

export type WorkoutTemplate = Readonly<z.infer<typeof WorkoutTemplateSchema>>;
