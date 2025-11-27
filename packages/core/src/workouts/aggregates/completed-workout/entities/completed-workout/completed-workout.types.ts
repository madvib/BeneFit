import { WorkoutPerformance, WorkoutVerification } from '../../../../value-objects/index.js';
import { Reaction } from '../reaction/reaction.types.js';

interface CompletedWorkoutData {
  id: string;
  userId: string;

  // Reference to source plan/workout (if from a plan)
  planId?: string;
  workoutTemplateId?: string;
  weekNumber?: number;
  dayNumber?: number;

  // Workout details
  workoutType: string; // "Upper Body Strength", "5K Run", etc.
  description?: string;

  // Performance data
  performance: WorkoutPerformance;

  // Verification for corporate sponsors
  verification: WorkoutVerification;

  // Social engagement
  reactions: Reaction[];
  isPublic: boolean; // Shared to team feed?

  // Multiplayer session reference (if applicable)
  multiplayerSessionId?: string;

  // Metadata
  createdAt: Date; // When recorded in system
  recordedAt: Date; // When workout actually completed (usually = performance.completedAt)
}

export type CompletedWorkout = Readonly<CompletedWorkoutData>;
