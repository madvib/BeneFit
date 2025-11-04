'use server';

import { getCurrentGoalUseCase } from '@/providers/goal-use-cases';

// Define the return types for transformed data
export interface GoalData {
  id: string;
  title: string;
  description: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  deadline: string; // ISO string
}

interface GetCurrentGoalResult {
  success: boolean;
  data: GoalData | null;
  error?: string;
}

export async function getCurrentGoal(): Promise<GetCurrentGoalResult> {
  try {
    const result = await getCurrentGoalUseCase.execute();

    if (result.isSuccess) {
      const goal = result.value;
      if (goal) {
        // Transform the Goal entity to a plain object for client consumption
        const transformedData = {
          id: goal.id,
          title: goal.title,
          description: goal.description,
          currentValue: goal.currentValue,
          targetValue: goal.targetValue,
          unit: goal.unit,
          deadline: goal.deadline.toString(),
        };

        return {
          success: true,
          data: transformedData,
        };
      } else {
        return {
          success: true,
          data: null,
        };
      }
    } else {
      console.error('Failed to fetch current goal:', result.error);
      return {
        success: false,
        data: null,
        error: result.error?.message || 'Failed to fetch current goal',
      };
    }
  } catch (error) {
    console.error('Error in getCurrentGoal controller:', error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}
