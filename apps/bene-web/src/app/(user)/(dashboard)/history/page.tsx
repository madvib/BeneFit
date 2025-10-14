'use client';

import SearchFilterBar from '@/components/common/SearchFilterBar';
import { PageContainer } from '@/components';
import { useState, useEffect } from 'react';
import { getWorkoutHistory, getFilterOptions } from '@/data/services/mockDataService';
import { Workout, FilterOption } from '@/data/types/dataTypes';

export default function HistoryPage() {
  const [workoutHistory, setWorkoutHistory] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchWorkoutHistory = async () => {
      try {
        const data = await getWorkoutHistory();
        setWorkoutHistory(data);
      } catch (error) {
        console.error('Error fetching workout history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkoutHistory();
  }, []);

  // Filter workouts based on search term and time filter
  const filteredWorkouts = workoutHistory.filter(workout => {
    const matchesSearch = 
      workout.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workout.duration.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workout.calories.toString().includes(searchTerm);
    
    if (timeFilter === 'all') return matchesSearch;
    
    const workoutDate = new Date(workout.date);
    const now = new Date();
    const cutoffDate = new Date();
    
    if (timeFilter === 'week') {
      cutoffDate.setDate(now.getDate() - 7);
    } else if (timeFilter === 'month') {
      cutoffDate.setMonth(now.getMonth() - 1);
    } else if (timeFilter === 'quarter') {
      cutoffDate.setMonth(now.getMonth() - 3);
    }
    
    const matchesTime = workoutDate >= cutoffDate;
    return matchesSearch && matchesTime;
  });

  const filterOptions: FilterOption[] = getFilterOptions();

  if (loading) {
    return (
      <PageContainer title="Workout History">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Workout History">
      <div className="bg-secondary p-6 rounded-lg shadow-md">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h3 className="text-2xl font-bold">Recent Workouts</h3>
          
          <SearchFilterBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterOptions={filterOptions}
            selectedFilter={timeFilter}
            onFilterChange={setTimeFilter}
            onExport={() => console.log('Exporting data')}
            placeholder="Search workouts..."
            showExportButton={true}
          />
        </div>
        
        {/* Table Headings */}
        <div className="hidden md:grid grid-cols-12 gap-4 mb-2 px-4 py-2 bg-background rounded-lg font-semibold">
          <div className="col-span-2">Date</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-2">Duration</div>
          <div className="col-span-3">Details</div>
          <div className="col-span-2">Calories</div>
          <div className="col-span-1">Actions</div>
        </div>
        
        {/* Card-like rows */}
        <div className="space-y-3">
          {filteredWorkouts.length > 0 ? (
            filteredWorkouts.map((workout) => (
              <div 
                key={workout.id} 
                className="md:grid md:grid-cols-12 gap-4 bg-background p-4 rounded-xl border border-muted hover:shadow-md transition-shadow"
              >
                <div className="md:col-span-2 mb-2 md:mb-0 font-medium">
                  {new Date(workout.date).toLocaleDateString()}
                </div>
                <div className="md:col-span-2 mb-2 md:mb-0 font-medium">
                  {workout.type}
                </div>
                <div className="md:col-span-2 mb-2 md-0">
                  {workout.duration}
                </div>
                <div className="md:col-span-3 mb-2 md:mb-0">
                  <div className="flex flex-wrap gap-2">
                    {workout.distance && (
                      <span className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded">
                        {workout.distance}
                      </span>
                    )}
                    {workout.sets && (
                      <span className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded">
                        {workout.sets} sets
                      </span>
                    )}
                    {workout.laps && (
                      <span className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded">
                        {workout.laps} laps
                      </span>
                    )}
                  </div>
                </div>
                <div className="md:col-span-2 mb-2 md:mb-0">
                  {workout.calories}
                </div>
                <div className="md:col-span-1 flex space-x-2">
                  <button className="p-2 rounded-full hover:bg-accent">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button className="p-2 rounded-full hover:bg-accent text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No workouts found matching your criteria
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}