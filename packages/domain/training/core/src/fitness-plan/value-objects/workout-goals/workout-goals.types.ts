import { z } from 'zod';
import { DISTANCE_UNITS } from '@bene/shared';
import { IntensityLevelSchema } from '@/shared/index.js';

export const DistanceUnitSchema = z.enum(DISTANCE_UNITS);

export const DistanceGoalSchema = z.object({
  value: z.number().min(0).max(100000), // meters, up to 100km
  unit: DistanceUnitSchema,
  pace: z
    .object({
      min: z.number().min(0).max(600), // seconds per unit
      max: z.number().min(0).max(600),
      target: z.number().min(0).max(600).optional(),
    })
    .optional(),
});
export type DistanceGoal = z.infer<typeof DistanceGoalSchema>;

export const DurationGoalSchema = z.object({
  value: z.number().int().min(0).max(7200), // seconds, up to 2 hours
  intensity: IntensityLevelSchema.optional(),
  heartRateZone: z
    .union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)])
    .optional(),
});
export type DurationGoal = z.infer<typeof DurationGoalSchema>;

export const VolumeGoalSchema = z.object({
  totalSets: z.number().int().min(1).max(50),
  totalReps: z.number().int().min(1).max(500),
  targetWeight: z
    .union([
      z.literal('light'),
      z.literal('moderate'),
      z.literal('heavy'),
      z.number().min(0).max(1000), // kg
    ])
    .optional(),
});
export type VolumeGoal = z.infer<typeof VolumeGoalSchema>;

export const CompletionCriteriaSchema = z.object({
  mustComplete: z.boolean(),
  minimumEffort: z.number().int().min(0).max(100).optional(), // percentage
  autoVerifiable: z.boolean(),
});
export type CompletionCriteria = z.infer<typeof CompletionCriteriaSchema>;

export const WorkoutGoalsSchema = z
  .object({
    distance: DistanceGoalSchema.optional(),
    duration: DurationGoalSchema.optional(),
    volume: VolumeGoalSchema.optional(),
    completionCriteria: CompletionCriteriaSchema,
  })
  .readonly();

export type WorkoutGoals = z.infer<typeof WorkoutGoalsSchema>;
