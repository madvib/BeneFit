'use client';

import { workouts } from '@bene/react-api-client';
import { useState, useCallback, useEffect } from 'react';

// Infer Workout type from API response
type Workout = workouts.GetWorkoutHistoryResponse extends Array<infer T> ? T : never;

// Define filter option structure
interface FilterOption {
  value: string;
  label: string;
}

interface UseHistoryControllerResult {
  workoutHistory: Workout[];
  filteredWorkouts: Workout[];
  loading: boolean;
  error: Error | null;
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
  workouts: Workout[],
  searchTerm: string,
  timeFilter: string,
): Workout[] {
  return workouts.filter((workout) => {
    const matchesSearch =
      workout.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workout.duration?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workout.calories?.toString().includes(searchTerm);

    if (timeFilter === 'all') return matchesSearch;

    const workoutDate = new Date(workout.date || new Date().toISOString());
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
  // React Query hooks from api-client
  const historyQuery = workouts.useWorkoutHistory({});

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [timeFilter, setTimeFilter] = useState<string>('all');
  const [filteredWorkouts, setFilteredWorkouts] = useState<Workout[]>([]);

  // Define the filter options
  const defaultFilterOptions = [
    { value: 'all', label: 'All Activity' },
    { value: 'workout', label: 'Workouts' },
    { value: 'task', label: 'Tasks' },
    { value: 'goal', label: 'Goals' },
    { value: 'alert', label: 'Alerts' },
  ];

  // Apply filtering when search term or time filter changes
  useEffect(() => {
    if (historyQuery.data) {
      const filtered = filterWorkouts(historyQuery.data, searchTerm, timeFilter);
      setFilteredWorkouts(filtered);
    }
  }, [historyQuery.data, searchTerm, timeFilter]);

  const onExport = useCallback(() => {
    console.log('Exporting data');
    // In a real implementation, this would export the filtered data
  }, []);

  const handleEdit = useCallback((id: string) => {
    console.log(`Editing workout ${ id }`);
  }, []);

  const handleDelete = useCallback((id: string) => {
    console.log(`Deleting workout ${ id }`);
  }, []);

  return {
    workoutHistory: historyQuery.data || [],
    filteredWorkouts,
    loading: historyQuery.isLoading,
    error: historyQuery.error as Error | null,
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
