import { z } from 'zod';

// Activity Structure Schemas

export const IntensityLevelSchema = z.enum(['easy', 'moderate', 'hard', 'sprint']);

export const IntervalSchema = z.object({
  duration: z.number(), // seconds
  intensity: IntensityLevelSchema,
  rest: z.number(), // seconds
});

export const ExerciseSchema = z.object({
  name: z.string(),
  sets: z.number(),
  reps: z.union([z.number(), z.string()]), // number or "to failure"
  weight: z.number().optional(), // kg or lbs
  duration: z.number().optional(), // seconds for holds/timed exercises
  rest: z.number(), // seconds between sets
  notes: z.string().optional(),
});

export const ActivityStructureSchema = z.object({
  intervals: z.array(IntervalSchema).optional(),
  rounds: z.number().optional(),
  exercises: z.array(ExerciseSchema).optional(),
});

// Export inferred types
export type IntensityLevel = z.infer<typeof IntensityLevelSchema>;
export type Interval = z.infer<typeof IntervalSchema>;
export type Exercise = z.infer<typeof ExerciseSchema>;
export type ActivityStructure = z.infer<typeof ActivityStructureSchema>;
