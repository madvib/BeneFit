'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchFilterBar from '@/components/common/SearchFilterBar';
import { useState } from 'react';

interface Workout {
  id: number;
  date: string;
  type: string;
  duration: string;
  distance?: string;
  sets?: number;
  laps?: number;
  calories: number;
}

export default function HistoryPage() {
  // Mock data for workout history
  const [workoutHistory] = useState<Workout[]>([
    { id: 1, date: '2023-05-01', type: 'Running', duration: '45 min', distance: '5.2 miles', calories: 420 },
    { id: 2, date: '2023-04-29', type: 'Weight Training', duration: '60 min', sets: 15, calories: 380 },
    { id: 3, date: '2023-04-27', type: 'Cycling', duration: '90 min', distance: '18.5 miles', calories: 650 },
    { id: 4, date: '2023-04-25', type: 'Swimming', duration: '40 min', laps: 40, calories: 400 },
    { id: 5, date: '2023-04-23', type: 'HIIT', duration: '30 min', calories: 320 },
    { id: 6, date: '2023-04-20', type: 'Yoga', duration: '30 min', calories: 150 },
    { id: 7, date: '2023-04-18', type: 'Rowing', duration: '45 min', distance: '5.0 km', calories: 380 },
  ]);

  const [timeFilter, setTimeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter workouts based on search term and time filter
  const filteredWorkouts = workoutHistory.filter(workout => {
    const matchesSearch = 
      workout.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workout.duration.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workout.calories.toString().includes(searchTerm);
    
    if (timeFilter === 'all') return matchesSearch;
    
    const workoutDate = new Date(workout.date);
    const now = new Date();
    let cutoffDate = new Date();
    
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

  const filterOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'week', label: 'Last 7 Days' },
    { value: 'month', label: 'Last 30 Days' },
    { value: 'quarter', label: 'Last 90 Days' }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} />

      <main className="flex-grow container mx-auto p-8">
        <h2 className="text-4xl font-bold mb-8">Workout History</h2>
        
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
                  <div className="md:col-span-2 mb-2 md:mb-0">
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
      </main>

      <Footer />
    </div>
  );
}