'use server';

import { planUseCases } from '@/providers/plan-use-cases';

// Define the return types for transformed plan data
export interface PlanData {
  id: string;
  name: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  progress: number;
}

export interface WeeklyWorkoutPlan {
  id: string;
  day: string;
  date: string;
  exercise: string;
  sets: number;
  reps: number;
  duration?: string;
  completed: boolean;
}

export interface PlanSuggestion {
  id: string;
  name: string;
  duration: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface GetPlanDataResult {
  success: boolean;
  data: {
    currentPlan: PlanData | null;
    weeklyWorkouts: WeeklyWorkoutPlan[];
    planSuggestions: PlanSuggestion[];
  };
  error?: string;
}

export async function getPlanData(): Promise<GetPlanDataResult> {
  try {
    const result = await planUseCases.getPlanDataUseCase.execute();

    if (result.isSuccess) {
      // Transform the Plan entities to plain objects for client consumption
      const { currentPlan, weeklyWorkouts, planSuggestions } = result.value;
      
      const transformedCurrentPlan = currentPlan ? {
        id: currentPlan.id,
        name: currentPlan.name,
        description: currentPlan.description,
        duration: currentPlan.duration,
        difficulty: currentPlan.difficulty,
        category: currentPlan.category,
        progress: currentPlan.progress,
      } : null;

      return {
        success: true,
        data: {
          currentPlan: transformedCurrentPlan,
          weeklyWorkouts,
          planSuggestions
        },
      };
    } else {
      console.error('Failed to fetch plan data:', result.error);
      return {
        success: false,
        data: {
          currentPlan: null,
          weeklyWorkouts: [],
          planSuggestions: [],
        },
        error: result.error?.message || 'Failed to fetch plan data',
      };
    }
  } catch (error) {
    console.error('Error in getPlanData controller:', error);
    return {
      success: false,
      data: {
        currentPlan: null,
        weeklyWorkouts: [],
        planSuggestions: [],
      },
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}