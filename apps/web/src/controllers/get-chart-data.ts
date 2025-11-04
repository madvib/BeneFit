'use server';

import { getActivityFeedUseCase } from '@/providers/activity-use-cases';

// Define the return types for chart data
export interface ChartDataPoint {
  date: string;
  value: number;
}

interface GetChartDataResult {
  success: boolean;
  data: ChartDataPoint[];
  error?: string;
}

export async function getChartData(): Promise<GetChartDataResult> {
  try {
    // For now, we'll generate mock chart data based on activity feed
    // In a real implementation, there would be a specific use case for chart data
    const result = await getActivityFeedUseCase.execute();

    if (result.isSuccess) {
      // Transform the activity feed to chart data format
      // This is a simplified approach - in a real app, there would be a dedicated use case
      const mockData: ChartDataPoint[] = [
        { date: 'Mon', value: 12 },
        { date: 'Tue', value: 19 },
        { date: 'Wed', value: 15 },
        { date: 'Thu', value: 22 },
        { date: 'Fri', value: 18 },
        { date: 'Sat', value: 24 },
        { date: 'Sun', value: 17 },
      ];

      return {
        success: true,
        data: mockData,
      };
    } else {
      console.error('Failed to fetch activity data for chart:', result.error);
      return {
        success: false,
        data: [],
        error: result.error?.message || 'Failed to fetch activity data for chart',
      };
    }
  } catch (error) {
    console.error('Error in getChartData controller:', error);
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}
