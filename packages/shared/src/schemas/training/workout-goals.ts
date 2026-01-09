import { z } from 'zod';

// Workout Goals Schemas

export const DistanceGoalSchema = z.object({
  value: z.number(),
  unit: z.enum(['meters', 'km', 'miles']),
  pace: z.object({
    min: z.number(),
    max: z.number(),
    target: z.number().optional(),
  }).optional(),
});

export const DurationGoalSchema = z.object({
  value: z.number(), // minutes
  intensity: z.enum(['easy', 'moderate', 'hard', 'max']).optional(),
  heartRateZone: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
  ]).optional(),
});

export const VolumeGoalSchema = z.object({
  totalSets: z.number(),
  totalReps: z.number(),
  targetWeight: z.union([
    z.enum(['light', 'moderate', 'heavy']),
    z.number(),
  ]).optional(),
});

export const CompletionCriteriaSchema = z.object({
  mustComplete: z.boolean(),
  minimumEffort: z.number().optional(), // 0-100 percentage
  autoVerifiable: z.boolean(),
});

export const WorkoutGoalsSchema = z.object({
  distance: DistanceGoalSchema.optional(),
  duration: DurationGoalSchema.optional(),
  volume: VolumeGoalSchema.optional(),
  completionCriteria: CompletionCriteriaSchema,
});

// Export inferred types
export type DistanceGoal = z.infer<typeof DistanceGoalSchema>;
export type DurationGoal = z.infer<typeof DurationGoalSchema>;
export type VolumeGoal = z.infer<typeof VolumeGoalSchema>;
export type CompletionCriteria = z.infer<typeof CompletionCriteriaSchema>;
export type WorkoutGoals = z.infer<typeof WorkoutGoalsSchema>;
