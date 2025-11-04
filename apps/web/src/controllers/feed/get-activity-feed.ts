'use server';

import { feedUseCases } from '@/providers/goal-use-cases';

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
    // In a real implementation, we would use the actual use case
    // For now, return mock data that matches the expected format
    // The actual implementation would be:
    // const result = await feedUseCases.getActivityFeedUseCase.execute();

    const mockActivities: ActivityData[] = [
      {
        id: '1',
        type: 'workout',
        title: 'Morning Run',
        description: 'Completed 5km run in 25 minutes',
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        user: 'John Doe',
        duration: '25 min',
        calories: 320,
      },
      {
        id: '2',
        type: 'nutrition',
        title: 'Post-Workout Meal',
        description: 'High protein meal after workout',
        timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        user: 'Jane Smith',
        calories: 450,
      },
      {
        id: '3',
        type: 'goal',
        title: 'Weekly Goal Update',
        description: 'Reached 80% of weekly exercise target',
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
        user: 'Mike Johnson',
        value: 80,
        goal: 100,
      },
      {
        id: '4',
        type: 'achievement',
        title: 'New Personal Record',
        description: 'Achieved new personal record in bench press',
        timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
        user: 'Sarah Williams',
      },
    ];

    return {
      success: true,
      data: mockActivities,
    };
  } catch (error) {
    console.error('Error in getActivityFeed controller:', error);
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}
