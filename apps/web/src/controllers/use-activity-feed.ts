'use client';

import { workouts } from '@bene/react-api-client';

/**
 * Custom hook for managing activity feed data
 * Separates business logic from presentation concerns
 */
export const useActivityFeed = () => {
  const historyQuery = workouts.useWorkoutHistory({
    json: {
      limit: undefined,
      offset: undefined
    }
  });

  return {
    activities: historyQuery.data || [],
    loading: historyQuery.isLoading,
    error: historyQuery.error,
    refetch: () => {
      historyQuery.refetch();
    },
  };
};
