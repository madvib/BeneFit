'use client';

import { useState, useEffect } from 'react';
import { getGoals, type GoalData } from '@/controllers/goals';

// Define the recommendation type
export interface RecommendationData {
  id: string;
  title: string;
  description: string;
  category: string;
}

interface GetRecommendationsResult {
  success: boolean;
  data: RecommendationData[];
  error?: string;
}

// Mock function to get recommendations - this should be replaced with actual use case
async function getRecommendations(): Promise<GetRecommendationsResult> {
  // This would typically be a server action that calls a use case
  // For now, return mock data
  try {
    const mockRecommendations: RecommendationData[] = [
      {
        id: '1',
        title: 'Try HIIT Training',
        description:
          'Based on your running progress, incorporating HIIT sessions could help improve your endurance.',
        category: 'Workout',
      },
      {
        id: '2',
        title: 'Hydration Check',
        description:
          'Your recent activities show you might need to increase water intake during long runs.',
        category: 'Nutrition',
      },
      {
        id: '3',
        title: 'Sleep Optimization',
        description:
          'To support your recovery, aim for 7-9 hours of sleep, especially on days with intense training.',
        category: 'Wellness',
      },
    ];

    return {
      success: true,
      data: mockRecommendations,
    };
  } catch (error) {
    console.error('Error in getRecommendations:', error);
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}

interface UseGoalsControllerResult {
  goals: GoalData[];
  recommendations: RecommendationData[];
  isLoading: boolean;
  error: string | null;
  fetchGoalsData: () => Promise<void>;
  handleEditGoal: (id: string) => void;
  handleDeleteGoal: (id: string) => void;
  handleShareGoal: (id: string) => void;
  handleCreateGoal: () => void;
}

export function useGoalsController(): UseGoalsControllerResult {
  const [goals, setGoals] = useState<GoalData[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGoalsData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [goalsResult, recommendationsResult] = await Promise.all([
        getGoals(),
        getRecommendations(),
      ]);

      if (goalsResult.success) {
        setGoals(goalsResult.data);
      } else {
        setError(goalsResult.error || 'Failed to fetch goals');
      }

      if (recommendationsResult.success) {
        setRecommendations(recommendationsResult.data);
      } else {
        setError(recommendationsResult.error || 'Failed to fetch recommendations');
      }
    } catch (err) {
      setError('Failed to load goals data');
      console.error('Error fetching goals data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditGoal = (id: string) => {
    console.log(`Editing goal ${id}`);
  };

  const handleDeleteGoal = (id: string) => {
    console.log(`Deleting goal ${id}`);
    // In a real implementation, this would remove the goal from state and make an API call
    setGoals((prev) => prev.filter((goal) => goal.id !== id));
  };

  const handleShareGoal = (id: string) => {
    console.log(`Sharing goal ${id}`);
  };

  const handleCreateGoal = () => {
    console.log('Creating new goal...');
  };

  useEffect(() => {
    fetchGoalsData();
  }, []);

  return {
    goals,
    recommendations,
    isLoading,
    error,
    fetchGoalsData,
    handleEditGoal,
    handleDeleteGoal,
    handleShareGoal,
    handleCreateGoal,
  };
}
