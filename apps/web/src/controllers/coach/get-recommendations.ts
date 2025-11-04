'use server';

import { getRecommendationsUseCase } from '@/providers/coach-use-cases';

// Define the return types for transformed data
export interface RecommendationData {
  id: string;
  title: string;
  description: string;
  category: string;
  createdAt: string;
}

interface GetRecommendationsResult {
  success: boolean;
  data: RecommendationData[];
  error?: string;
}

export async function getCoachRecommendations(userId: string): Promise<GetRecommendationsResult> {
  try {
    const result = await getRecommendationsUseCase.execute({ userId });
    
    if (result.isSuccess) {
      // Transform the Recommendation entities to plain objects for client consumption
      const transformedData = result.value.map(rec => ({
        id: rec.id,
        title: rec.title,
        description: rec.description,
        category: rec.category,
        createdAt: rec.createdAt.toISOString(),
      }));
      
      return {
        success: true,
        data: transformedData
      };
    } else {
      console.error('Failed to fetch recommendations:', result.error);
      return {
        success: false,
        data: [],
        error: result.error?.message || 'Failed to fetch recommendations'
      };
    }
  } catch (error) {
    console.error('Error in getCoachRecommendations controller:', error);
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}