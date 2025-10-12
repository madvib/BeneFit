'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Goal {
  id: number;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  status: 'active' | 'completed' | 'overdue';
}

export default function GoalsPage() {
  // Mock data for goals
  const goals: Goal[] = [
    { 
      id: 1, 
      title: 'Run 50 miles', 
      description: 'Complete 50 miles of running this month', 
      targetValue: 50, 
      currentValue: 32.5, 
      unit: 'miles', 
      deadline: '2023-05-31', 
      status: 'active' 
    },
    { 
      id: 2, 
      title: 'Strength Training', 
      description: 'Complete 20 strength sessions this month', 
      targetValue: 20, 
      currentValue: 14, 
      unit: 'sessions', 
      deadline: '2023-05-31', 
      status: 'active' 
    },
    { 
      id: 3, 
      title: 'Couch to 5K', 
      description: 'Complete the Couch to 5K program', 
      targetValue: 9, 
      currentValue: 9, 
      unit: 'weeks', 
      deadline: '2023-04-15', 
      status: 'completed' 
    },
    { 
      id: 4, 
      title: 'Daily Steps', 
      description: 'Walk 10,000 steps per day', 
      targetValue: 10000, 
      currentValue: 8542, 
      unit: 'steps/day', 
      deadline: '2023-05-31', 
      status: 'active' 
    }
  ];

  const statusColor = {
    active: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    overdue: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} />

      <main className="flex-grow container mx-auto p-8">
        <h2 className="text-4xl font-bold mb-8">Goals</h2>
        

        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-secondary p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Your Goals</h3>
                <button className="btn btn-primary">Create Goal</button>
              </div>
              
              <div className="space-y-6">
                {goals.map((goal) => {
                  const progressPercentage = (goal.currentValue / goal.targetValue) * 100;
                  const isCompleted = goal.status === 'completed';
                  
                  return (
                    <div key={goal.id} className="bg-background p-6 rounded-lg shadow-sm border border-muted">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-xl font-bold">{goal.title}</h4>
                          <p className="text-muted-foreground">{goal.description}</p>
                        </div>
                        <span className={`text-xs px-3 py-1 rounded-full ${statusColor[goal.status]}`}>
                          {goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span>{goal.currentValue} {goal.unit}</span>
                          <span>{goal.targetValue} {goal.unit}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-primary'}`} 
                            style={{ width: `${Math.min(100, progressPercentage)}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span>Deadline: {new Date(goal.deadline).toLocaleDateString()}</span>
                        <span>{Math.round(progressPercentage)}% complete</span>
                      </div>
                      
                      <div className="mt-4 flex space-x-3">
                        <button className="btn btn-ghost btn-sm">Edit</button>
                        <button className="btn btn-ghost btn-sm">Share</button>
                        <button className="btn btn-ghost btn-sm text-red-600">Delete</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-secondary p-6 rounded-lg shadow-md mb-8">
              <h3 className="text-xl font-bold mb-4">Goal Insights</h3>
              <div className="space-y-4">
                <div className="p-4 bg-background rounded-lg">
                  <h4 className="font-medium mb-2">Goal Completion Rate</h4>
                  <div className="text-3xl font-bold text-primary">67%</div>
                  <p className="text-sm text-muted-foreground">of goals reached this month</p>
                </div>
                
                <div className="p-4 bg-background rounded-lg">
                  <h4 className="font-medium mb-2">Avg. Goal Achievement</h4>
                  <div className="text-3xl font-bold text-primary">82%</div>
                  <p className="text-sm text-muted-foreground">across all active goals</p>
                </div>
                
                <div className="p-4 bg-background rounded-lg">
                  <h4 className="font-medium mb-2">Days to Goal</h4>
                  <div className="text-3xl font-bold text-primary">22</div>
                  <p className="text-sm text-muted-foreground">until next goal deadline</p>
                </div>
              </div>
            </div>
            
            <div className="bg-secondary p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">Goal Suggestions</h3>
              <div className="space-y-3">
                <div className="p-3 bg-background rounded-lg hover:bg-accent cursor-pointer">
                  <h4 className="font-medium">30-Day Plank Challenge</h4>
                  <p className="text-sm text-muted-foreground">Build core strength</p>
                </div>
                <div className="p-3 bg-background rounded-lg hover:bg-accent cursor-pointer">
                  <h4 className="font-medium">Yoga 3x/Week</h4>
                  <p className="text-sm text-muted-foreground">Improve flexibility</p>
                </div>
                <div className="p-3 bg-background rounded-lg hover:bg-accent cursor-pointer">
                  <h4 className="font-medium">Hydration Tracking</h4>
                  <p className="text-sm text-muted-foreground">Drink 8 glasses daily</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}