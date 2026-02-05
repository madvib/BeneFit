import { CreateView, serializeForView } from '@bene/shared';
import {
  toLiveActivityProgressView,
  toSessionFeedItemView,
  toSessionParticipantView,
  toWorkoutActivityView
} from '../../value-objects/index.js';
import { WorkoutSession } from './workout-session.types.js';
import * as Queries from './workout-session.queries.js';


export type WorkoutSessionView = CreateView<
  WorkoutSession,
  never,
  {
    activeDuration: number;
    completionPercentage: number;
  }
>;

/**
 * CONVERSION (Entity → API View)
 */
export function toWorkoutSessionView(session: WorkoutSession): WorkoutSessionView {
  const base = serializeForView(session)
  return {
    ...base,
    activities: session.activities.map(toWorkoutActivityView),
    liveProgress: session.liveProgress
      ? toLiveActivityProgressView(session.liveProgress)
      : undefined,
    participants: session.participants.map(toSessionParticipantView),
    activityFeed: session.activityFeed.map(toSessionFeedItemView),

    // Computed fields
    activeDuration: Queries.getActiveDuration(session),
    completionPercentage: Queries.getCompletionPercentage(session),
  };
}
