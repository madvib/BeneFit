'use client';

import { workouts, profile } from '@bene/react-api-client';
import { useCallback } from 'react';

interface UseFeedControllerResult {
  currentGoal: any | null;
  chartData: any[];
  isLoading: boolean;
  error: Error | null;
  fetchFeedData: () => Promise<void>;
  handleSetNewGoal: () => void;
}

export function useFeedController(): UseFeedControllerResult {
  // React Query hooks from api-client
  const profileQuery = profile.useProfile();
  const historyQuery = workouts.useWorkoutHistory({});

  // Extract current goal from profile data
  const currentGoal = profileQuery.data?.fitnessGoals?.primaryGoal || null;

  const fetchFeedData = useCallback(async () => {
    if (profileQuery.error) {
      await profileQuery.refetch();
    }
    if (historyQuery.error) {
      await historyQuery.refetch();
    }
  }, [profileQuery, historyQuery]);

  const handleSetNewGoal = useCallback(() => {
    console.log('Setting new goal...');
    // TODO: Implement goal setting when backend endpoint is available
  }, []);

  // Consolidated loading state
  const isLoading = profileQuery.isLoading || historyQuery.isLoading;

  // Consolidated error
  const error = profileQuery.error || historyQuery.error;

  return {
    currentGoal,
    chartData: historyQuery.data || [],
    isLoading,
    error: error as Error | null,
    fetchFeedData,
    handleSetNewGoal,
  };
}
