import { z } from 'zod';

export const IntensityLevelSchema = z.enum(['easy', 'moderate', 'hard', 'sprint']);
export type IntensityLevel = z.infer<typeof IntensityLevelSchema>;

export const IntervalSchema = z.object({
  duration: z.number().int().min(1).max(3600),
  intensity: IntensityLevelSchema,
  rest: z.number().int().min(0).max(3600),
});
export type Interval = z.infer<typeof IntervalSchema>;

export const ExerciseSchema = z.object({
  name: z.string().min(1).max(100),
  sets: z.number().int().min(1).max(50),
  reps: z.union([z.number().int().min(1), z.string()]).optional(),
  weight: z.number().min(0).max(1000).optional(),
  duration: z.number().int().min(1).max(3600).optional(),
  rest: z.number().int().min(0).max(3600),
  notes: z.string().max(500).optional(),
});
export type Exercise = z.infer<typeof ExerciseSchema>;

/**
 * 1. DEFINE PROPS SCHEMA
 */
export const ActivityStructureSchema = z.object({
  intervals: z.array(IntervalSchema).optional(),
  rounds: z.number().int().min(1).max(100).optional(),
  exercises: z.array(ExerciseSchema).optional(),
});

/**
 * 2. INFER TYPES
 */
export type ActivityStructureProps = z.infer<typeof ActivityStructureSchema>;
export type ActivityStructure = Readonly<ActivityStructureProps>;

/**
 * 3. VIEW TYPES
 */
export type ActivityStructureView = ActivityStructure;
