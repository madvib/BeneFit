'use client';

import { useState, useEffect } from 'react';
import { getPlanData, type PlanData, type WeeklyWorkoutPlan, type PlanSuggestion } from '@/controllers/plan';

interface UsePlanControllerResult {
  currentPlan: PlanData | null;
  weeklyWorkouts: WeeklyWorkoutPlan[];
  planSuggestions: PlanSuggestion[];
  isLoading: boolean;
  error: string | null;
  fetchPlanData: () => Promise<void>;
  handleEditPlan: (id: string) => void;
  handleDeletePlan: (id: string) => void;
  handleSharePlan: (id: string) => void;
  handleCreatePlan: () => void;
}

export function usePlanController(): UsePlanControllerResult {
  const [currentPlan, setCurrentPlan] = useState<PlanData | null>(null);
  const [weeklyWorkouts, setWeeklyWorkouts] = useState<WeeklyWorkoutPlan[]>([]);
  const [planSuggestions, setPlanSuggestions] = useState<PlanSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlanData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getPlanData();

      if (result.success) {
        setCurrentPlan(result.data.currentPlan);
        setWeeklyWorkouts(result.data.weeklyWorkouts);
        setPlanSuggestions(result.data.planSuggestions);
      } else {
        setError(result.error || 'Failed to fetch plan data');
      }
    } catch (err) {
      setError('Failed to load plan data');
      console.error('Error fetching plan data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditPlan = (id: string) => {
    console.log(`Editing plan ${id}`);
  };

  const handleDeletePlan = (id: string) => {
    console.log(`Deleting plan ${id}`);
    // In a real implementation, this would remove the plan from state and make an API call
  };

  const handleSharePlan = (id: string) => {
    console.log(`Sharing plan ${id}`);
  };

  const handleCreatePlan = () => {
    console.log('Creating new plan...');
  };

  useEffect(() => {
    fetchPlanData();
  }, []);

  return {
    currentPlan,
    weeklyWorkouts,
    planSuggestions,
    isLoading,
    error,
    fetchPlanData,
    handleEditPlan,
    handleDeletePlan,
    handleSharePlan,
    handleCreatePlan,
  };
}