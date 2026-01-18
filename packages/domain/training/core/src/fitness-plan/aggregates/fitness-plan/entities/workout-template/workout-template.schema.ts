import { z } from 'zod';
import { WorkoutActivitySchema, toWorkoutActivitySchema } from '@/workouts/value-objects/index.js';
import { WorkoutGoalsSchema } from '@/fitness-plan/value-objects/index.js';
import { WorkoutTemplate } from './workout-template.types.js';

export const WorkoutCategorySchema = z.enum(['cardio', 'strength', 'recovery']);
export const WorkoutStatusSchema = z.enum(['scheduled', 'in_progress', 'completed', 'skipped', 'rescheduled']);
export const WorkoutImportanceSchema = z.enum(['optional', 'recommended', 'key', 'critical']);


export const WorkoutAlternativeSchema = z.object({
  reason: z.string(),
  activities: z.array(WorkoutActivitySchema),
});

export const WorkoutTemplateSchema = z.object({
  id: z.string(),
  planId: z.string(),
  weekNumber: z.number().int().min(1).max(52),
  dayOfWeek: z.number().int().min(0).max(6),
  scheduledDate: z.iso.datetime(), // ISO Date with format constraint
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(500).optional(),
  type: z.string(), // WorkoutType is usually string or enum
  category: WorkoutCategorySchema,
  goals: WorkoutGoalsSchema,
  activities: z.array(WorkoutActivitySchema),
  status: WorkoutStatusSchema,
  completedWorkoutId: z.string().optional(),
  userNotes: z.string().min(1).max(500).optional(),
  rescheduledTo: z.iso.datetime().optional(),
  coachNotes: z.string().min(1).max(500).optional(),
  importance: WorkoutImportanceSchema,
  alternatives: z.array(WorkoutAlternativeSchema).optional(),
});

export type WorkoutTemplatePresentation = z.infer<typeof WorkoutTemplateSchema>;

export function toWorkoutTemplateSchema(template: WorkoutTemplate): WorkoutTemplatePresentation {
  return {
    id: template.id,
    planId: template.planId,
    weekNumber: template.weekNumber,
    dayOfWeek: template.dayOfWeek,
    scheduledDate: template.scheduledDate.toISOString(),
    title: template.title,
    description: template.description,
    type: template.type,
    category: template.category,
    goals: template.goals,
    activities: template.activities.map(toWorkoutActivitySchema),
    status: template.status,
    completedWorkoutId: template.completedWorkoutId,
    userNotes: template.userNotes,
    rescheduledTo: template.rescheduledTo?.toISOString(),
    coachNotes: template.coachNotes,
    importance: template.importance,
    alternatives: template.alternatives ? template.alternatives.map(alt => ({
      reason: alt.reason,
      activities: alt.activities.map(toWorkoutActivitySchema)
    })) : undefined,
  };
}
