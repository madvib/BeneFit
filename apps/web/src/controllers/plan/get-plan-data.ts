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
  // Added fields to match UI requirements
  weeklyProgress: number;
  totalWorkouts: number;
  currentWeek: number;
  totalWeeks: number;
  phase: string;
  stats: {
    streak: number;
    minutes: number;
    calories: number;
  };
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
      
      let transformedCurrentPlan: PlanData | null = null;

      if (currentPlan) {
        // Calculate weekly progress
        const totalWeeklyWorkouts = weeklyWorkouts.length;
        const completedWeeklyWorkouts = weeklyWorkouts.filter(w => w.completed).length;
        const weeklyProgress = totalWeeklyWorkouts > 0 
          ? Math.round((completedWeeklyWorkouts / totalWeeklyWorkouts) * 100) 
          : 0;

        transformedCurrentPlan = {
          id: currentPlan.id,
          name: currentPlan.name,
          description: currentPlan.description,
          duration: currentPlan.duration,
          difficulty: currentPlan.difficulty,
          category: currentPlan.category,
          progress: currentPlan.progress,
          // Populate new fields with calculated or mock data
          weeklyProgress,
          totalWorkouts: totalWeeklyWorkouts, // Using weekly count for now as total isn't available
          currentWeek: 1, // Mock value
          totalWeeks: 4, // Mock value
          phase: 'Foundation', // Mock value
          stats: {
            streak: 3, // Mock value
            minutes: 120, // Mock value
            calories: 850, // Mock value
          },
        };
      }

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