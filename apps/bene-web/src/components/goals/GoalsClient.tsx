'use client';

import GoalCard from '@/components/common/GoalCard';
import RecommendationCard from '@/components/common/RecommendationCard';
import { InsightCard, PageContainer } from '@/components';
import type { Goal, Recommendation } from '@/data/types/dataTypes';

export default function GoalsClient({ 
  initialGoals,
  recommendations
}: { 
  initialGoals: Goal[];
  recommendations: Recommendation[];
}) {
  return (
    <PageContainer title="Goals">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <div className="bg-secondary p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Your Goals</h3>
              <button className="btn btn-primary">Create Goal</button>
            </div>
            
            <div className="space-y-6">
              {initialGoals.map((goal) => (
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
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}