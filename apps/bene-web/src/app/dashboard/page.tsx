'use client'
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ActivityFeed from '@/components/ActivityFeed';

import { useState, useEffect } from 'react';

interface Goal {
  id: number;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
}

interface ChartData {
  date: string;
  value: number;
}

export default function DashboardPage() {
  const [currentGoal, setCurrentGoal] = useState<Goal | null>(null);
  const [progressData, setProgressData] = useState<ChartData[]>([]);

  // Mock data initialization
  useEffect(() => {
    // Mock goal data
    const mockGoal: Goal = {
      id: 1,
      title: "Run 50 miles",
      description: "Complete 50 miles of running this month",
      targetValue: 50,
      currentValue: 32.5,
      unit: "miles",
      deadline: "2023-05-31"
    };
    
    setCurrentGoal(mockGoal);
    
    // Mock progress data
    const mockData: ChartData[] = [
      { date: "Apr 1", value: 8.2 },
      { date: "Apr 7", value: 12.0 },
      { date: "Apr 14", value: 18.5 },
      { date: "Apr 21", value: 25.1 },
      { date: "Apr 28", value: 32.5 }
    ];
    
    setProgressData(mockData);
  }, []);

  // Calculate progress percentage
  const progressPercentage = currentGoal 
    ? Math.min(100, (currentGoal.currentValue / currentGoal.targetValue) * 100) 
    : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} />

      <main className="flex-grow container mx-auto p-8">
        <h2 className="text-4xl font-bold mb-8">Welcome, User!</h2>
        

        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Activity Feed - takes 3/4 of the width */}
          <div className="lg:col-span-3">
            <ActivityFeed />
          </div>
          
          {/* Side Panel - takes 1/4 of the width */}
          <div className="lg:col-span-1 space-y-8">
            {/* Current Goal Card */}
            <div className="bg-secondary p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">Current Goal</h3>
              
              {currentGoal ? (
                <div>
                  <h4 className="font-semibold text-lg">{currentGoal.title}</h4>
                  <p className="text-muted-foreground text-sm mb-4">{currentGoal.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>{currentGoal.currentValue} {currentGoal.unit}</span>
                      <span>{currentGoal.targetValue} {currentGoal.unit}</span>
                    </div>
                    <div className="w-full bg-background rounded-full h-2.5">
                      <div 
                        className="bg-primary h-2.5 rounded-full" 
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <p className="text-muted-foreground">Deadline: {new Date(currentGoal.deadline).toLocaleDateString()}</p>
                    <p className="text-muted-foreground">Remaining: {(currentGoal.targetValue - currentGoal.currentValue).toFixed(1)} {currentGoal.unit}</p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground italic">No current goal set</p>
              )}
              
              <button className="mt-4 w-full btn btn-primary">
                Set New Goal
              </button>
            </div>
            
            {/* Progress Chart Card */}
            <div className="bg-secondary p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">Progress Chart</h3>
              
              <div className="h-64 flex items-end space-x-2 pt-6">
                {progressData.map((data, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div className="text-xs text-muted-foreground mb-1">{data.date}</div>
                    <div 
                      className="w-full bg-primary rounded-t hover:opacity-75 transition-opacity"
                      style={{ height: `${(data.value / 50) * 100}%` }}
                    ></div>
                    <div className="text-xs mt-1">{data.value}</div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-muted-foreground text-sm mb-2">Weekly Progress</p>
                <p className="text-2xl font-bold text-primary">+7.5 miles this week</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}