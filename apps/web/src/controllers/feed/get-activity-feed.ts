'use server';

import { feedUseCases } from '@/providers/feed-use-cases';

// Define the return types for transformed activity data
export interface ActivityData {
  id: string;
  type: 'workout' | 'nutrition' | 'goal' | 'achievement' | 'progress';
  title: string;
  description: string;
  timestamp: string; // ISO string
  avatar: string;
  user: string;
  duration?: string;
  calories?: number;
  value?: number;
  goal?: number;
}

interface GetActivityFeedResult {
  success: boolean;
  data: ActivityData[];
  error?: string;
}

export async function getActivityFeed(): Promise<GetActivityFeedResult> {
  try {
    // Use the use case to get activity feed data
    const result = await feedUseCases.getActivityFeedUseCase.execute();

    if (result.isSuccess) {
      // Transform Workout entities to ActivityData format
      const transformedActivities = result.value.map(workout => ({
        id: workout.id,
        type: 'workout' as const, // For now, default to workout type
        title: workout.type, // Use workout type as title
        description: `Completed ${workout.type} workout`,
        timestamp: workout.date,
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg', // Default avatar
        user: 'Current User', // Could get from context
        duration: workout.duration,
        calories: workout.calories,
      }));

      return {
        success: true,
        data: transformedActivities,
      };
    } else {
      console.error('Use case failed:', result.error);
      return {
        success: false,
        data: [],
        error: result.error?.message || 'Failed to fetch activity feed',
      };
    }
  } catch (error) {
    console.error('Error in getActivityFeed controller:', error);
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}
