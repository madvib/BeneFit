import { z } from 'zod';

export const DistanceGoalSchema = z.object({
  value: z.number().min(0).max(100000), // meters, up to 100km
  unit: z.enum(['meters', 'km', 'miles']),
  pace: z.object({
    min: z.number().min(0).max(600), // seconds per unit
    max: z.number().min(0).max(600),
    target: z.number().min(0).max(600).optional(),
  }).optional(),
});

export const DurationGoalSchema = z.object({
  value: z.number().int().min(0).max(7200), // seconds, up to 2 hours
  intensity: z.enum(['easy', 'moderate', 'hard', 'max']).optional(),
  heartRateZone: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5)
  ]).optional(),
});

export const VolumeGoalSchema = z.object({
  totalSets: z.number().int().min(1).max(50),
  totalReps: z.number().int().min(1).max(500),
  targetWeight: z.union([
    z.literal('light'),
    z.literal('moderate'),
    z.literal('heavy'),
    z.number().min(0).max(1000) // kg
  ]).optional(),
});

export const CompletionCriteriaSchema = z.object({
  mustComplete: z.boolean(),
  minimumEffort: z.number().int().min(0).max(100).optional(), // percentage
  autoVerifiable: z.boolean(),
});

export const WorkoutGoalsSchema = z.object({
  distance: DistanceGoalSchema.optional(),
  duration: DurationGoalSchema.optional(),
  volume: VolumeGoalSchema.optional(),
  completionCriteria: CompletionCriteriaSchema,
});
