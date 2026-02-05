import { CreateView, SerializeDates, serializeForView } from '@bene/shared';
import { toWorkoutPerformanceView, WorkoutPerformance } from '@/workouts/value-objects/index.js';
import { ReactionView, toReactionView } from '../reaction/index.js';
import { CompletedWorkout } from './completed-workout.types.js';
import * as Queries from './completed-workout.queries.js';


export interface EnrichedWorkoutPerformance extends WorkoutPerformance {
  totalVolume: number;
  totalSets: number;
  totalExercises: number;
  completionRate: number;
}

export type CompletedWorkoutView = CreateView<
  CompletedWorkout,
  'verification' | 'planId' | 'weekNumber' | 'dayNumber',
  {
    performance: SerializeDates<EnrichedWorkoutPerformance>;
    reactions: ReactionView[];
    isVerified: boolean;
    reactionCount: number;
    planReference?: {
      planId: string;
      weekNumber?: number;
      dayNumber?: number;
    };
  }
>;

/**
 * Map CompletedWorkout entity to view model (API presentation)
 * 
 * - Serializes Date → ISO string
 * - Omits internal fields (performance, reactions, verification, planId, weekNumber, dayNumber)
 * - Enriches with computed fields (performance metrics, planReference, isVerified, reactionCount)
 */
export function toCompletedWorkoutView(
  entity: CompletedWorkout,
): CompletedWorkoutView {
  const performanceView = toWorkoutPerformanceView(entity.performance);

  const planReference = entity.planId
    ? {
      planId: entity.planId,
      weekNumber: entity.weekNumber,
      dayNumber: entity.dayNumber,
    }
    : undefined;

  const base = serializeForView(entity);

  return {
    ...base,
    planReference,

    performance: {
      ...performanceView,
      totalVolume: Queries.getTotalVolume(entity),
      totalSets: Queries.getTotalSets(entity),
      totalExercises: Queries.getTotalExercises(entity),
      completionRate: Queries.getCompletionRate(entity),
    },
    reactions: entity.reactions.map(toReactionView),
    isVerified: entity.verification.verified,
    reactionCount: Queries.getReactionCount(entity),
  };
}
