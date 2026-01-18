import { CreateView, SerializeDates } from '@bene/shared';
import {
  WorkoutPerformance,
  WorkoutVerification,
  WorkoutType,
  WorkoutVerificationView,
} from '@/workouts/value-objects/index.js';
import { Reaction, ReactionView } from '../reaction/reaction.types.js';

interface CompletedWorkoutData {
  id: string;
  userId: string;

  // Reference to source plan/workout (if from a plan)
  planId?: string;
  workoutTemplateId?: string;
  weekNumber?: number;
  dayNumber?: number;

  // Workout details
  workoutType: WorkoutType; // "Upper Body Strength", "5K Run", etc.
  title: string;
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

// ============================================
// View Interface (API Presentation)
// ============================================

export interface EnrichedWorkoutPerformance extends WorkoutPerformance {
  totalVolume: number;
  totalSets: number;
  totalExercises: number;
  completionRate: number;
}



export type CompletedWorkoutView = CreateView<
  CompletedWorkout,
  'performance' | 'reactions',
  {
    performance: SerializeDates<EnrichedWorkoutPerformance>;
    reactions: ReactionView[];
    isVerified: boolean;
    reactionCount: number;
    verification: WorkoutVerificationView;
  }
>;
