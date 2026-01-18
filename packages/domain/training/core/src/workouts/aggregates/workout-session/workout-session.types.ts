import { CreateView } from '@bene/shared';
import {
  LiveActivityProgress, SessionParticipant, SessionConfiguration,
  WorkoutActivity,
  ActivityPerformance,
  SessionFeedItem
} from '../../value-objects/index.js';

export type SessionState =
  | 'preparing' // Created but not started
  | 'in_progress' // Active workout
  | 'paused' // Temporarily paused
  | 'completed' // Finished successfully
  | 'abandoned'; // Stopped early

interface WorkoutSessionData {
  id: string;
  ownerId: string; // User who created the session

  // Source workout (if from a plan)
  planId?: string;
  workoutTemplateId?: string;

  // Workout structure
  workoutType: string; // "Upper Body", "5K Run", etc.
  activities: WorkoutActivity[];

  // Session state
  state: SessionState;
  currentActivityIndex: number;
  liveProgress?: LiveActivityProgress;

  // Performance tracking
  completedActivities: ActivityPerformance[];

  // Multiplayer
  configuration: SessionConfiguration;
  participants: SessionParticipant[];
  activityFeed: SessionFeedItem[];

  // Timing
  startedAt?: Date; // When workout actually started
  pausedAt?: Date;
  resumedAt?: Date;
  completedAt?: Date;
  abandonedAt?: Date;
  totalPausedSeconds: number;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export type WorkoutSession = Readonly<WorkoutSessionData>;

// ============================================
// View Interface (API Presentation)
// ============================================

export type WorkoutSessionView = CreateView<
  WorkoutSession,
  never,
  {
    activeDuration: number;
    completionPercentage: number;
  }
>;
