'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GoalCard from '@/components/common/GoalCard';
import RecommendationCard from '@/components/common/RecommendationCard';
import { InsightCard } from '@/components';

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

  const recommendations = [
    {
      id: 1,
      title: '30-Day Plank Challenge',
      description: 'Build core strength',
      category: 'Core'
    },
    {
      id: 2,
      title: 'Yoga 3x/Week',
      description: 'Improve flexibility',
      category: 'Flexibility'
    },
    {
      id: 3,
      title: 'Hydration Tracking',
      description: 'Drink 8 glasses daily',
      category: 'Wellness'
    }
  ];

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
                {goals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    id={goal.id}
                    title={goal.title}
                    description={goal.description}
                    currentValue={goal.currentValue}
                    targetValue={goal.targetValue}
                    unit={goal.unit}
                    deadline={goal.deadline}
                    status={goal.status}
                    onEdit={() => console.log(`Editing goal ${goal.id}`)}
                    onShare={() => console.log(`Sharing goal ${goal.id}`)}
                    onDelete={() => console.log(`Deleting goal ${goal.id}`)}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-secondary p-6 rounded-lg shadow-md mb-8">
              <h3 className="text-xl font-bold mb-4">Goal Insights</h3>
              <div className="space-y-4">
                <InsightCard 
                  title="Goal Completion Rate" 
                  value="67%" 
                  description="of goals reached this month" 
                />
                <InsightCard 
                  title="Avg. Goal Achievement" 
                  value="82%" 
                  description="across all active goals" 
                />
                <InsightCard 
                  title="Days to Goal" 
                  value="22" 
                  description="until next goal deadline" 
                />
              </div>
            </div>
            
            <div className="bg-secondary p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">Goal Suggestions</h3>
              <div className="space-y-3">
                {recommendations.map((rec) => (
                  <RecommendationCard
                    key={rec.id}
                    id={rec.id}
                    title={rec.title}
                    description={rec.description}
                    category={rec.category}
                    onLearnMore={() => console.log(`Learning more about ${rec.title}`)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}