import { LiveActivityProgress } from "../../value-objects/live-activity-progress/live-activity-progress.js";
import { SessionConfiguration } from "../../value-objects/session-configuration/session-configuration.js";
import { SessionFeedItem } from "../../value-objects/session-feed-item/session-feed-item.js";
import { SessionParticipant } from "../../value-objects/session-participant/session-participant.js";
import { WorkoutActivity } from "../../value-objects/workout-activity/workout-activity.types.js";
import { ActivityPerformance } from "../../value-objects/workout-performance/workout-performance.js";

export type SessionState =
  | 'preparing'    // Created but not started
  | 'in_progress'  // Active workout
  | 'paused'       // Temporarily paused
  | 'completed'    // Finished successfully
  | 'abandoned';   // Stopped early

export interface WorkoutSession {
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
