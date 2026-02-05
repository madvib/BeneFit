import { z } from 'zod';

export const TemplateDurationSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('fixed'), weeks: z.number().int().min(1).max(52) }),
  z.object({
    type: z.literal('variable'),
    min: z.number().int().min(1).max(52),
    max: z.number().int().min(1).max(52),
  }),
]);
export type TemplateDuration = Readonly<z.infer<typeof TemplateDurationSchema>>;

export const TemplateFrequencySchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('fixed'), workoutsPerWeek: z.number().int().min(1).max(7) }),
  z.object({
    type: z.literal('flexible'),
    min: z.number().int().min(1).max(7),
    max: z.number().int().min(1).max(7),
  }),
]);
export type TemplateFrequency = Readonly<z.infer<typeof TemplateFrequencySchema>>;

export const WorkoutActivityTemplateSchema = z.object({
  activityType: z.enum(['warmup', 'main', 'cooldown']),
  template: z.string().min(1).max(1000),
  variables: z.record(z.string(), z.unknown()),
});
export type WorkoutActivityTemplate = Readonly<z.infer<typeof WorkoutActivityTemplateSchema>>;

export const WorkoutDayTemplateSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6).optional(),
  type: z.enum(['strength', 'cardio', 'mobility', 'sport', 'rest']),
  durationMinutes: z.union([z.number().int().min(0), z.string()]),
  activities: z.array(WorkoutActivityTemplateSchema),
});
export type WorkoutDayTemplate = Readonly<z.infer<typeof WorkoutDayTemplateSchema>>;

export const WeekTemplateSchema = z.object({
  weekNumber: z.union([z.number().int().min(1).max(52), z.literal('*')]),
  workouts: z.array(WorkoutDayTemplateSchema),
});
export type WeekTemplate = Readonly<z.infer<typeof WeekTemplateSchema>>;

/**
 * 1. DEFINE PROPS SCHEMA
 */
export const TemplateStructureSchema = z.object({
  duration: TemplateDurationSchema,
  frequency: TemplateFrequencySchema,
  weeks: z.array(WeekTemplateSchema),
  deloadWeeks: z.array(z.number().int().min(1).max(52)).optional(),
  progressionFormula: z.string().min(1).max(500).optional(),
});

/**
 * 2. INFER TYPES
 */
export type TemplateStructure = Readonly<z.infer<typeof TemplateStructureSchema>>;

