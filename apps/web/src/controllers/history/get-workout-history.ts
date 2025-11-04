'use server';

import { getWorkoutHistoryUseCase } from '@/providers/activity-use-cases';

// Define the return types for transformed workout data
export interface WorkoutData {
  id: string;
  date: string; // ISO string
  type: string;
  duration: string;
  calories: number;
  distance?: string;
  sets?: number;
  laps?: number;
}

interface GetWorkoutHistoryResult {
  success: boolean;
  data: WorkoutData[];
  error?: string;
}

export async function getWorkoutHistory(): Promise<GetWorkoutHistoryResult> {
  try {
    const result = await getWorkoutHistoryUseCase.execute();

    if (result.isSuccess) {
      // Transform the Workout entities to plain objects for client consumption
      const transformedData = result.value.map((workout) => ({
        id: workout.id,
        date: workout.date.toString(),
        type: workout.type,
        duration: workout.duration,
        calories: workout.calories,
        distance: workout.distance,
        sets: workout.sets,
        laps: workout.laps,
      }));

      return {
        success: true,
        data: transformedData,
      };
    } else {
      console.error('Failed to fetch workout history:', result.error);
      return {
        success: false,
        data: [],
        error: result.error?.message || 'Failed to fetch workout history',
      };
    }
  } catch (error) {
    console.error('Error in getWorkoutHistory controller:', error);
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}
