import { z } from 'zod';
import { WorkoutPerformanceSchema, WorkoutTypeSchema } from '../../../../value-objects/index.js';
import { ReactionSchema, toReactionPresentation } from '../reaction/reaction.presentation.js';
import { CompletedWorkout } from './completed-workout.types.js';
import * as Queries from './completed-workout.queries.js';

// Completed Workout Schemas

export const CompletedWorkoutSchema = z.object({
  id: z.string(),
  userId: z.string(),
  // Reference to source plan/workout (if from a plan)
  planReference: z.object({
    planId: z.string(),
    weekNumber: z.number().int().min(1).max(52).optional(),
    dayNumber: z.number().int().min(0).max(6).optional(),
  }).optional(),
  workoutTemplateId: z.string().optional(),

  // Workout details
  workoutType: WorkoutTypeSchema,
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(1000).optional(),

  // Performance data (Enriched)
  performance: WorkoutPerformanceSchema.extend({
    totalVolume: z.number().min(0).max(100000), // total weight lifted
    totalSets: z.number().int().min(0).max(500),
    totalExercises: z.number().int().min(0).max(50),
    completionRate: z.number().min(0).max(1), // 0-1 percentage
    perceivedExertion: z.number().int().min(1).max(10),
    enjoyment: z.number().int().min(1).max(10),
  }),

  // Verification (Shielded)
  isVerified: z.boolean(),

  // Social engagement
  reactions: z.array(ReactionSchema),
  reactionCount: z.number().int().min(0).max(10000),

  isPublic: z.boolean(),

  // Multiplayer session reference
  multiplayerSessionId: z.string().optional(),

  // Metadata
  recordedAt: z.iso.datetime(),
});

export type CompletedWorkoutPresentation = z.infer<typeof CompletedWorkoutSchema>;

export function toCompletedWorkoutSchema(entity: CompletedWorkout): CompletedWorkoutPresentation {
  return {
    id: entity.id,
    userId: entity.userId,
    planReference: entity.planId ? {
      planId: entity.planId,
      weekNumber: entity.weekNumber,
      dayNumber: entity.dayNumber,
    } : undefined,
    workoutTemplateId: entity.workoutTemplateId,

    workoutType: entity.workoutType,
    title: entity.title,
    description: entity.description,

    performance: {
      ...entity.performance,
      totalVolume: Queries.getTotalVolume(entity),
      totalSets: Queries.getTotalSets(entity),
      totalExercises: Queries.getTotalExercises(entity),
      completionRate: Queries.getCompletionRate(entity),
      // Ensure these are passed through if they exist in performance, otherwise fallback or from query?
      // entity.performance has them.
      perceivedExertion: entity.performance.perceivedExertion,
      enjoyment: entity.performance.enjoyment,

      startedAt: entity.performance.startedAt instanceof Date ? entity.performance.startedAt.toISOString() : entity.performance.startedAt,
      completedAt: entity.performance.completedAt instanceof Date ? entity.performance.completedAt.toISOString() : entity.performance.completedAt,
    },

    isVerified: entity.verification.verified,

    reactions: entity.reactions.map(toReactionPresentation),
    reactionCount: Queries.getReactionCount(entity),

    isPublic: entity.isPublic,
    multiplayerSessionId: entity.multiplayerSessionId,

    recordedAt: entity.recordedAt.toISOString(),
  };
}
