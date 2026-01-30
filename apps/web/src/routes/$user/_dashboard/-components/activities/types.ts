import type { CompletedWorkout, WorkoutSession } from '@bene/react-api-client';

// Union type for any item that can appear in the history list
export type HistoryItem = CompletedWorkout | WorkoutSession;
