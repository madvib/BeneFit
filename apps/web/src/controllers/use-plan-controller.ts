'use client';

import { fitnessPlan, workouts } from '@bene/react-api-client';
import { useCallback } from 'react';

// Use inferred types from API client as DTOs
type ActivePlanData = fitnessPlan.GetActivePlanResponse;
type UpcomingWorkoutsData = workouts.GetUpcomingWorkoutsResponse;

interface UsePlanControllerResult {
  // Return API data directly
  activePlanData: ActivePlanData | null;
  upcomingWorkouts: UpcomingWorkoutsData | null;
  isLoading: boolean;
  error: Error | null;
  // Mutation handlers
  handleGeneratePlan: (request: fitnessPlan.GeneratePlanRequest) => Promise<void>;
  handleActivatePlan: (request: fitnessPlan.ActivatePlanRequest) => Promise<void>;
  handleAdjustPlan: (request: fitnessPlan.AdjustPlanRequest) => Promise<void>;
  handlePausePlan: (request: fitnessPlan.PausePlanRequest) => Promise<void>;
}

export function usePlanController(): UsePlanControllerResult {
  // Use the API client hooks
  const activePlanQuery = fitnessPlan.useActivePlan();
  const upcomingWorkoutsQuery = workouts.useUpcomingWorkouts({});

  // Mutation hooks
  const generatePlanMutation = fitnessPlan.useGeneratePlan();
  const activatePlanMutation = fitnessPlan.useActivatePlan();
  const adjustPlanMutation = fitnessPlan.useAdjustPlan();
  const pausePlanMutation = fitnessPlan.usePausePlan();

  const handleGeneratePlan = useCallback(async (request: fitnessPlan.GeneratePlanRequest) => {
    try {
      await generatePlanMutation.mutateAsync(request);
    } catch (error) {
      console.error('Failed to generate plan:', error);
      throw error;
    }
  }, [generatePlanMutation]);

  const handleActivatePlan = useCallback(async (request: fitnessPlan.ActivatePlanRequest) => {
    try {
      await activatePlanMutation.mutateAsync(request);
    } catch (error) {
      console.error('Failed to activate plan:', error);
      throw error;
    }
  }, [activatePlanMutation]);

  const handleAdjustPlan = useCallback(async (request: fitnessPlan.AdjustPlanRequest) => {
    try {
      await adjustPlanMutation.mutateAsync(request);
    } catch (error) {
      console.error('Failed to adjust plan:', error);
      throw error;
    }
  }, [adjustPlanMutation]);

  const handlePausePlan = useCallback(async (request: fitnessPlan.PausePlanRequest) => {
    try {
      await pausePlanMutation.mutateAsync(request);
    } catch (error) {
      console.error('Failed to pause plan:', error);
      throw error;
    }
  }, [pausePlanMutation]);

  // Consolidated loading state
  const isLoading =
    activePlanQuery.isLoading ||
    upcomingWorkoutsQuery.isLoading ||
    generatePlanMutation.isPending ||
    activatePlanMutation.isPending ||
    adjustPlanMutation.isPending ||
    pausePlanMutation.isPending;

  // Consolidated error
  const error =
    activePlanQuery.error ||
    upcomingWorkoutsQuery.error ||
    generatePlanMutation.error ||
    activatePlanMutation.error ||
    adjustPlanMutation.error ||
    pausePlanMutation.error;

  return {
    // Return API data directly - views will adapt to the structure
    activePlanData: activePlanQuery.data || null,
    upcomingWorkouts: upcomingWorkoutsQuery.data || null,

    isLoading,
    error: error as Error | null,

    // Mutation handlers
    handleGeneratePlan,
    handleActivatePlan,
    handleAdjustPlan,
    handlePausePlan,
  };
}
