import type { CompletedWorkout, WorkoutSession } from '@bene/shared';

// Union type for any item that can appear in the history list
export type HistoryItem = CompletedWorkout | WorkoutSession;
