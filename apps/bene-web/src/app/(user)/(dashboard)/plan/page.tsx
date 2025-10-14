'use client';

import { Card, DashboardLayout, PageContainer, StatCard } from '@/components';
import { useState, useEffect } from 'react';
import { getPlanData } from '@/data/services/mockDataService';
import { Plan, WorkoutPlan, PlanSuggestion } from '@/data/types/dataTypes';

export default function PlanPage() {
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
  const [weeklyWorkouts, setWeeklyWorkouts] = useState<WorkoutPlan[]>([]);
  const [planSuggestions, setPlanSuggestions] = useState<PlanSuggestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlanData = async () => {
      try {
        const data = await getPlanData();
        setCurrentPlan(data.currentPlan);
        setWeeklyWorkouts(data.weeklyWorkouts);
        setPlanSuggestions(data.planSuggestions);
      } catch (error) {
        console.error('Error fetching plan data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlanData();
  }, []);

  if (loading || !currentPlan) {
    return (
      <PageContainer title="Training Plan" hideTitle={true}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Training Plan" hideTitle={true}>
      <DashboardLayout
          sidebar={
            <div>
              <Card title="Plan Suggestions" className="mb-8">
                <div className="space-y-4">
                  {planSuggestions.map((plan) => (
                    <div key={plan.id} className="p-4 bg-background rounded-lg border border-muted">
                      <h4 className="font-medium">{plan.name}</h4>
                      <div className="flex items-center space-x-3 mt-2">
                        <span className="text-xs bg-muted px-2 py-1 rounded">
                          {plan.difficulty}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {plan.duration}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {plan.category}
                        </span>
                      </div>
                      <button className="mt-3 w-full btn btn-ghost btn-sm">Preview</button>
                    </div>
                  ))}
                </div>
              </Card>
              
              <Card title="Plan Actions">
                <div className="space-y-3">
                  <button className="w-full btn btn-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Create New Plan
                  </button>
                  <button className="w-full btn btn-ghost">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                    </svg>
                    Save Current Plan
                  </button>
                  <button className="w-full btn btn-ghost">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2H16a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    Export Plan
                  </button>
                </div>
              </Card>
            </div>
          }
        >
          <div className="space-y-8">
            <Card 
              title={currentPlan.name}
              actions={
                <button className="btn btn-ghost">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
              }
            >
              <div>
                <p className="text-muted-foreground mb-4">{currentPlan.description}</p>
                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-sm bg-primary text-primary-foreground px-2 py-1 rounded">
                    {currentPlan.difficulty}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {currentPlan.duration}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {currentPlan.category}
                  </span>
                </div>
                
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress: {currentPlan.progress}%</span>
                    <span>Week 3 of 4</span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2.5">
                    <div 
                      className="bg-primary h-2.5 rounded-full" 
                      style={{ width: `${currentPlan.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <StatCard 
                    title="Workouts" 
                    value="18" 
                    description="Total planned" 
                  />
                  <StatCard 
                    title="Completed" 
                    value="12" 
                    description="Finished workouts" 
                  />
                  <StatCard 
                    title="Remaining" 
                    value="6" 
                    description="Upcoming sessions" 
                  />
                </div>
              </div>
            </Card>
            
            <Card title="Weekly Schedule">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {weeklyWorkouts.map((workout) => (
                  <div 
                    key={workout.id} 
                    className={`p-4 rounded-lg border ${
                      workout.completed 
                        ? 'bg-green-50 border-green-500 dark:bg-green-900/20' 
                        : 'bg-background border-muted'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold">{workout.day}</h4>
                        <p className="text-sm text-muted-foreground">{workout.date}</p>
                      </div>
                      {workout.completed && (
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                          Done
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-4">
                      <h5 className="font-medium">{workout.exercise}</h5>
                      {workout.sets > 0 && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {workout.sets} sets × {workout.reps} reps
                        </p>
                      )}
                      {workout.duration && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {workout.duration}
                        </p>
                      )}
                    </div>
                    
                    <button 
                      className={`mt-4 w-full btn ${
                        workout.completed 
                          ? 'btn-ghost text-green-600' 
                          : 'btn-primary'
                      }`}
                    >
                      {workout.completed ? 'Completed' : 'Start'}
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </DashboardLayout>
      </PageContainer>
  );
}