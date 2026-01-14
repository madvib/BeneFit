import { z } from 'zod';
import { WorkoutPerformanceSchema } from './workout-performance.js';
import { WorkoutVerificationSchema } from './workout-verification.js';
import { ReactionSchema } from './reaction.js';
import { WorkoutTypeSchema } from './workout-type.js';

// Completed Workout Schemas

export const CompletedWorkoutSchema = z.object({
  id: z.string(),
  // Reference to source plan/workout (if from a plan)
  planId: z.string().optional(),
  workoutTemplateId: z.string().optional(),
  weekNumber: z.number().optional(),
  dayNumber: z.number().optional(),
  // Workout details
  workoutType: WorkoutTypeSchema,
  title: z.string().optional(),
  description: z.string().optional(),
  // Performance data
  performance: WorkoutPerformanceSchema,
  // Verification for corporate sponsors
  verification: WorkoutVerificationSchema,
  // Social engagement
  reactions: z.array(ReactionSchema),
  isPublic: z.boolean(), // Shared to team feed?
  // Multiplayer session reference (if applicable)
  multiplayerSessionId: z.string().optional(),
  // Metadata
  recordedAt: z.string(), // ISO date string - when workout actually completed
});

// Export inferred types
export type CompletedWorkout = z.infer<typeof CompletedWorkoutSchema>;
