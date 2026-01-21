import { z } from 'zod';
import { ActivityStructure } from './activity-structure.types.js';

export const IntensityLevelViewSchema = z.enum(['easy', 'moderate', 'hard', 'sprint']);

export const IntervalViewSchema = z.object({
  duration: z.number().int().min(5).max(600), // seconds
  intensity: IntensityLevelViewSchema,
  rest: z.number().int().min(0).max(300), // seconds
});

export const ExerciseViewSchema = z.object({
  name: z.string().min(1).max(100),
  sets: z.number().int().min(1).max(20),
  reps: z.union([z.number().int().min(1).max(100), z.string().min(1).max(20)]).optional(),
  weight: z.number().min(0).max(1000).optional(), // kg
  duration: z.number().int().min(0).max(600).optional(), // seconds
  rest: z.number().int().min(0).max(300), // seconds
  notes: z.string().min(1).max(200).optional(),
});

export const ActivityStructureViewSchema = z.object({
  intervals: z.array(IntervalViewSchema).optional(),
  rounds: z.number().int().min(1).max(10).optional(),
  exercises: z.array(ExerciseViewSchema).optional(),
});

type ActivityStructurePresentation = z.infer<typeof ActivityStructureViewSchema>;

export function toActivityStructureView(structure: ActivityStructure): ActivityStructurePresentation {
  return {
    intervals: structure.intervals ? structure.intervals.map(i => ({ ...i })) : undefined,
    rounds: structure.rounds,
    exercises: structure.exercises ? structure.exercises.map(e => ({ ...e })) : undefined,
  };
}
