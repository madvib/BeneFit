'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Plan {
  id: number;
  name: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  progress: number;
}

interface Workout {
  id: number;
  day: string;
  date: string;
  exercise: string;
  sets: number;
  reps: number;
  duration?: string;
  completed: boolean;
}

export default function PlanPage() {
  // Mock data for user's current plan
  const currentPlan: Plan = {
    id: 1,
    name: '30-Day Strength Building',
    description: 'A comprehensive strength training program designed for intermediate users',
    duration: '4 weeks',
    difficulty: 'Intermediate',
    category: 'Strength',
    progress: 65
  };

  // Mock data for weekly workouts
  const weeklyWorkouts: Workout[] = [
    { id: 1, day: 'Mon', date: 'May 6', exercise: 'Chest & Triceps', sets: 4, reps: 12, completed: true },
    { id: 2, day: 'Tue', date: 'May 7', exercise: 'Back & Biceps', sets: 4, reps: 12, completed: true },
    { id: 3, day: 'Wed', date: 'May 8', exercise: 'Legs Day', sets: 5, reps: 10, completed: false },
    { id: 4, day: 'Thu', date: 'May 9', exercise: 'Shoulders & Abs', sets: 3, reps: 15, completed: false },
    { id: 5, day: 'Fri', date: 'May 10', exercise: 'Full Body', sets: 4, reps: 10, completed: false },
    { id: 6, day: 'Sat', date: 'May 11', exercise: 'Rest or Light Cardio', sets: 0, reps: 0, duration: '20-30 min', completed: false },
    { id: 7, day: 'Sun', date: 'May 12', exercise: 'Rest', sets: 0, reps: 0, completed: false },
  ];

  // Mock data for plan suggestions
  const planSuggestions = [
    { id: 1, name: 'Beginner Full Body', duration: '6 weeks', category: 'Strength', difficulty: 'Beginner' },
    { id: 2, name: 'HIIT Cardio Blast', duration: '4 weeks', category: 'Cardio', difficulty: 'Intermediate' },
    { id: 3, name: 'Yoga Flexibility', duration: '8 weeks', category: 'Flexibility', difficulty: 'Beginner' },
    { id: 4, name: 'Advanced Powerlifting', duration: '12 weeks', category: 'Strength', difficulty: 'Advanced' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} />

      <main className="flex-grow container mx-auto p-8">
        <h2 className="text-4xl font-bold mb-8">Training Plan</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-secondary p-6 rounded-lg shadow-md mb-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold">{currentPlan.name}</h3>
                  <p className="text-muted-foreground mb-2">{currentPlan.description}</p>
                  <div className="flex items-center space-x-4 mt-2">
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
                </div>
                <button className="btn btn-ghost">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
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
                <div className="bg-background p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold">18</p>
                  <p className="text-sm text-muted-foreground">Workouts</p>
                </div>
                <div className="bg-background p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
                <div className="bg-background p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold">6</p>
                  <p className="text-sm text-muted-foreground">Remaining</p>
                </div>
              </div>
            </div>
            
            <div className="bg-secondary p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-6">Weekly Schedule</h3>
              
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
            </div>
          </div>
          
          <div>
            <div className="bg-secondary p-6 rounded-lg shadow-md mb-8">
              <h3 className="text-xl font-bold mb-4">Plan Suggestions</h3>
              
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
            </div>
            
            <div className="bg-secondary p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">Plan Actions</h3>
              
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
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Export Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}