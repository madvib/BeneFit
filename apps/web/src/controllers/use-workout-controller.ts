'use client';

import { workouts } from '@bene/react-api-client';
import { useCallback } from 'react';

interface UseWorkoutControllerResult {
  todaysWorkout: any;
  isLoading: boolean;
  error: Error | null;
  startWorkout: (workoutId: string) => void;
  completeWorkout: (sessionId: string, data: any) => void;
}

export function useWorkoutController(): UseWorkoutControllerResult {
  // React Query hooks from api-client
  const todaysWorkoutQuery = workouts.useTodaysWorkout();
  const startWorkoutMutation = workouts.useStartWorkout();
  const completeWorkoutMutation = workouts.useCompleteWorkout();

  const startWorkout = useCallback(
    async (workoutId: string) => {
      try {
        await startWorkoutMutation.mutateAsync({
          param: {
            sessionId: workoutId,
          },
          json: {
            workoutId,
          },
        });
      } catch (error) {
        throw error;
      }
    },
    [startWorkoutMutation],
  );

  const completeWorkout = useCallback(
    async (sessionId: string, data: any) => {
      try {
        await completeWorkoutMutation.mutateAsync({
          param: {
            sessionId,
          },
          json: {
            performance: data,
            sessionId: '',
            verification: {
              method: 'gps',
              verified: false,
              data: {
                timestamp: '',
                proof: undefined,
                location: undefined,
                duration: undefined
              },
              verifiedAt: '',
              verifierId: undefined,
              sponsorEligible: undefined
            }
          },
        });
      } catch (error) {
        throw error;
      }
    },
    [completeWorkoutMutation],
  );

  // Consolidated loading state
  const isLoading =
    todaysWorkoutQuery.isLoading ||
    startWorkoutMutation.isPending ||
    completeWorkoutMutation.isPending;

  // Consolidated error
  const error =
    todaysWorkoutQuery.error ||
    startWorkoutMutation.error ||
    completeWorkoutMutation.error;

  return {
    todaysWorkout: todaysWorkoutQuery.data,
    isLoading,
    error: error as Error | null,
    startWorkout,
    completeWorkout,
  };
}
