import { z } from 'zod';
import type { DomainBrandTag } from '@bene/shared';
import {
  WorkoutPerformanceSchema,
  WorkoutVerificationSchema,
  WorkoutTypeSchema,

} from '@/workouts/value-objects/index.js';
import { ReactionSchema } from '../reaction/reaction.types.js';

/**
 * 1. DEFINE PROPS SCHEMA (Zod as Source of Truth)
 */
export const CompletedWorkoutSchema = z
  .object({
    id: z.uuid(),
    userId: z.uuid(),

    // Reference to source plan/workout (if from a plan)
    planId: z.uuid().optional(),
    workoutTemplateId: z.uuid().optional(),
    weekNumber: z.number().int().min(1).max(52).optional(),
    dayNumber: z.number().int().min(0).max(6).optional(),

    // Workout details
    workoutType: WorkoutTypeSchema,
    title: z.string().min(1).max(100),
    description: z.string().min(1).max(1000).optional(),

    // Performance data
    performance: WorkoutPerformanceSchema,

    // Verification for corporate sponsors
    verification: WorkoutVerificationSchema,

    // Social engagement
    reactions: z.array(ReactionSchema),
    isPublic: z.boolean(),

    // Multiplayer session reference (if applicable)
    multiplayerSessionId: z.uuid().optional(),

    // Metadata
    createdAt: z.coerce.date<Date>(),
    recordedAt: z.coerce.date<Date>(),
  })
  .brand<DomainBrandTag>();

/**
 * 2. INFER TYPES
 */
export type CompletedWorkout = Readonly<z.infer<typeof CompletedWorkoutSchema>>;


