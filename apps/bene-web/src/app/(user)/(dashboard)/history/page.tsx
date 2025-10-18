'use client';

import SearchFilterBar from '@/components/common/SearchFilterBar';
import { PageContainer } from '@/components';
import { useState, useEffect } from 'react';
import { getWorkoutHistory, getFilterOptions } from '@/lib/data/mockDataService';
import { Workout, FilterOption } from '@/lib/data/types/dataTypes';

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
    <PageContainer title="Workout History" hideTitle={true}>
      <div className="w-full">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-2xl font-bold">Recent Workouts</h2>
          
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
        
        {/* Card-like rows for mobile, table for desktop */}
        <div className="space-y-4">
          {filteredWorkouts.length > 0 ? (
            filteredWorkouts.map((workout) => (
              <div 
                key={workout.id} 
                className="bg-background p-4 rounded-xl border border-muted hover:shadow-md transition-shadow w-full"
              >
                {/* Mobile List View */}
                <div className="md:hidden">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{workout.type}</h3>
                      <p className="text-muted-foreground text-sm">{new Date(workout.date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                        {workout.calories} cal
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium">{workout.duration}</span>
                    </div>
                    
                    {workout.distance && (
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Distance:</span>
                        <span className="font-medium">{workout.distance}</span>
                      </div>
                    )}
                    
                    {workout.sets && (
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Sets:</span>
                        <span className="font-medium">{workout.sets} sets</span>
                      </div>
                    )}
                    
                    {workout.laps && (
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Laps:</span>
                        <span className="font-medium">{workout.laps}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end mt-4 space-x-2">
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
                
                {/* Desktop Table View */}
                <div className="hidden md:grid grid-cols-12 gap-4">
                  <div className="col-span-2 font-medium">
                    {new Date(workout.date).toLocaleDateString()}
                  </div>
                  <div className="col-span-2 font-medium">
                    {workout.type}
                  </div>
                  <div className="col-span-2">
                    {workout.duration}
                  </div>
                  <div className="col-span-3">
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
                          {workout.laps}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-span-2">
                    {workout.calories}
                  </div>
                  <div className="col-span-1 flex space-x-2">
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
              </div>
            ))
          ) : (
            <div className="bg-background p-8 rounded-xl border border-muted text-center">
              <p className="text-muted-foreground">No workouts found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}