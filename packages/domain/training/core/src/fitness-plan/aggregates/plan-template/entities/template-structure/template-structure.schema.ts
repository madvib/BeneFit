import { z } from 'zod';
import { TemplateStructure } from './template-structure.types.js';

export const TemplateDurationSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('fixed'), weeks: z.number().int().min(1).max(52) }),
  z.object({ type: z.literal('variable'), min: z.number().int().min(1).max(52), max: z.number().int().min(1).max(52) }),
]);

export const TemplateFrequencySchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('fixed'), workoutsPerWeek: z.number().int().min(1).max(7) }),
  z.object({ type: z.literal('flexible'), min: z.number().int().min(1).max(7), max: z.number().int().min(1).max(7) }),
]);

export const WorkoutActivityTemplateSchema = z.object({
  activityType: z.enum(['warmup', 'main', 'cooldown']),
  template: z.string().min(1).max(100),
  variables: z.record(z.string(), z.unknown()),
});

export const WorkoutDayTemplateSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6).optional(),
  type: z.enum(['strength', 'cardio', 'mobility', 'sport', 'rest']),
  durationMinutes: z.union([z.number().int().min(1).max(480), z.string().min(1).max(50)]),
  activities: z.array(WorkoutActivityTemplateSchema),
});

export const WeekTemplateSchema = z.object({
  weekNumber: z.union([z.number().int().min(1).max(52), z.literal('*')]),
  workouts: z.array(WorkoutDayTemplateSchema),
});

export const TemplateStructureSchema = z.object({
  duration: TemplateDurationSchema,
  frequency: TemplateFrequencySchema,
  weeks: z.array(WeekTemplateSchema),
  deloadWeeks: z.array(z.number().int().min(1).max(52)).optional(),
  progressionFormula: z.string().min(1).max(500).optional(),
});

export type TemplateStructurePresentation = z.infer<typeof TemplateStructureSchema>;

export function toTemplateStructureSchema(structure: TemplateStructure): TemplateStructurePresentation {
  return {
    duration: structure.duration,
    frequency: structure.frequency,
    weeks: structure.weeks.map(week => ({
      ...week,
      workouts: week.workouts.map(workout => ({
        ...workout,
        activities: workout.activities.map(activity => ({
          ...activity,
          variables: { ...activity.variables }
        }))
      }))
    })),
    deloadWeeks: structure.deloadWeeks ? [...structure.deloadWeeks] : undefined,
    progressionFormula: structure.progressionFormula,
  };
}
