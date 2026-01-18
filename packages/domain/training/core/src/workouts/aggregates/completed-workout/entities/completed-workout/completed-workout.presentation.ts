import { z } from 'zod';
import { WorkoutPerformanceSchema, WorkoutTypeSchema } from '../../../../value-objects/index.js';
import { ReactionSchema } from '../reaction/reaction.presentation.js';
import { CompletedWorkout, CompletedWorkoutView } from './completed-workout.types.js';

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

export type CompletedWorkoutPresentation = CompletedWorkoutView;


// Deprecated: Use toCompletedWorkoutView from factory instead
export function toCompletedWorkoutSchema(entity: CompletedWorkout): CompletedWorkoutView {
  // Logic moved to factory
  throw new Error("Use toCompletedWorkoutView from factory");
}
