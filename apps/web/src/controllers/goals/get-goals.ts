'use server';

import { getGoalsUseCase } from '@/providers/goal-use-cases';

// Define the return types for transformed goal data
export interface GoalData {
  id: string;
  title: string;
  description: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  deadline: string; // ISO string
  status: string;
}

interface GetGoalsResult {
  success: boolean;
  data: GoalData[];
  error?: string;
}

export async function getGoals(): Promise<GetGoalsResult> {
  try {
    const result = await getGoalsUseCase.execute();

    if (result.isSuccess) {
      // Transform the Goal entities to plain objects for client consumption
      const transformedData = result.value.map((goal) => ({
        id: goal.id, // Keep as string
        title: goal.title,
        description: goal.description,
        currentValue: goal.currentValue,
        targetValue: goal.targetValue,
        unit: goal.unit,
        deadline: goal.deadline.toString(),
        status: goal.status || 'active',
      }));

      return {
        success: true,
        data: transformedData,
      };
    } else {
      console.error('Failed to fetch goals:', result.error);
      return {
        success: false,
        data: [],
        error: result.error?.message || 'Failed to fetch goals',
      };
    }
  } catch (error) {
    console.error('Error in getGoals controller:', error);
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}
