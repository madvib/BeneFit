import { Reaction } from "../reaction/reaction.js";
import { WorkoutPerformance } from "../../../../value-objects/workout-performance/workout-performance.js";
import { WorkoutVerification } from "../../../../value-objects/workout-verification/workout-verification.js";

export interface CompletedWorkout {
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

