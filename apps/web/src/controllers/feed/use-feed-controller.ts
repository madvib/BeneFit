'use client';

import { useState, useEffect } from 'react';
import {
  getCurrentGoal,
  getChartData,
  type GoalData,
  type ChartDataPoint,
} from '@/controllers/index';

interface UseFeedControllerResult {
  currentGoal: GoalData | null;
  chartData: ChartDataPoint[];
  isLoading: boolean;
  error: string | null;
  fetchFeedData: () => Promise<void>;
  handleSetNewGoal: () => void;
}

export function useFeedController(): UseFeedControllerResult {
  const [currentGoal, setCurrentGoal] = useState<GoalData | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeedData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [goalResult, chartResult] = await Promise.all([
        getCurrentGoal(),
        getChartData(),
      ]);

      if (goalResult.success) {
        setCurrentGoal(goalResult.data);
      } else {
        setError(goalResult.error || 'Failed to fetch goal');
      }

      if (chartResult.success) {
        setChartData(chartResult.data);
      } else {
        setError(chartResult.error || 'Failed to fetch chart data');
      }
    } catch (err) {
      setError('Failed to load feed data');
      console.error('Error fetching feed data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetNewGoal = () => {
    console.log('Setting new goal...');
  };

  useEffect(() => {
    fetchFeedData();
  }, []);

  return {
    currentGoal,
    chartData,
    isLoading,
    error,
    fetchFeedData,
    handleSetNewGoal,
  };
}
