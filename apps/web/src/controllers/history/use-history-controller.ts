'use client';

import { useState, useEffect } from 'react';
import { getWorkoutHistory, type WorkoutData } from '@/controllers/history';

// Define filter option structure
interface FilterOption {
  value: string;
  label: string;
}

interface UseHistoryControllerResult {
  workoutHistory: WorkoutData[];
  filteredWorkouts: WorkoutData[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  timeFilter: string;
  filterOptions: FilterOption[];
  setSearchTerm: (value: string) => void;
  setTimeFilter: (value: string) => void;
  onExport: () => void;
  handleEdit: (id: string) => void;
  handleDelete: (id: string) => void;
}

// Function to filter workouts based on search term and time filter
function filterWorkouts(
  workouts: WorkoutData[],
  searchTerm: string,
  timeFilter: string
): WorkoutData[] {
  return workouts.filter((workout) => {
    const matchesSearch =
      workout.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workout.duration.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workout.calories.toString().includes(searchTerm);

    if (timeFilter === 'all') return matchesSearch;

    const workoutDate = new Date(workout.date);
    const now = new Date();
    const cutoffDate = new Date();

    switch (timeFilter) {
      case 'week': {
        cutoffDate.setDate(now.getDate() - 7);
        break;
      }
      case 'month': {
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      }
      case 'quarter': {
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
      }
      default:
        return matchesSearch;
    }

    const matchesTime = workoutDate >= cutoffDate;
    return matchesSearch && matchesTime;
  });
}

export function useHistoryController(): UseHistoryControllerResult {
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutData[]>([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState<WorkoutData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [timeFilter, setTimeFilter] = useState<string>('all');

  // Define the filter options
  const defaultFilterOptions: FilterOption[] = [
    { value: 'all', label: 'All Time' },
    { value: 'week', label: 'Last Week' },
    { value: 'month', label: 'Last Month' },
    { value: 'quarter', label: 'Last Quarter' },
  ];

  // Apply filtering when search term or time filter changes
  useEffect(() => {
    const filtered = filterWorkouts(workoutHistory, searchTerm, timeFilter);
    setFilteredWorkouts(filtered);
  }, [workoutHistory, searchTerm, timeFilter]);

  // Fetch initial workout history
  useEffect(() => {
    const fetchWorkoutHistory = async () => {
      try {
        setLoading(true);
        const result = await getWorkoutHistory();
        
        if (result.success) {
          setWorkoutHistory(result.data);
        } else {
          setError(result.error || 'Failed to fetch workout history');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch workout history');
        console.error('Error fetching workout history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkoutHistory();
  }, []);

  const onExport = () => {
    console.log('Exporting data');
    // In a real implementation, this would export the filtered data
  };

  const handleEdit = (id: string) => {
    console.log(`Editing workout ${id}`);
  };

  const handleDelete = (id: string) => {
    console.log(`Deleting workout ${id}`);
    // In a real implementation, this would remove the workout from the state and database
    setWorkoutHistory(prev => prev.filter(workout => workout.id !== id));
  };

  return {
    workoutHistory,
    filteredWorkouts,
    loading,
    error,
    searchTerm,
    timeFilter,
    filterOptions: defaultFilterOptions,
    setSearchTerm,
    setTimeFilter,
    onExport,
    handleEdit,
    handleDelete,
  };
}