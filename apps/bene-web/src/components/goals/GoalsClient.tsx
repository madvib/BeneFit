'use client';

import GoalCard from '@/components/common/GoalCard';
import RecommendationCard from '@/components/common/RecommendationCard';
import { InsightCard, PageContainer, TopTabNavigation } from '@/components';
import { useState, useEffect } from 'react';
import type { Goal, Recommendation } from '@/data/types/dataTypes';

export default function GoalsClient({ 
  initialGoals,
  recommendations
}: { 
  initialGoals: Goal[];
  recommendations: Recommendation[];
}) {
  const [isMobile, setIsMobile] = useState(false);

  // Check if it's mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const goalsView = () => (
    <div className="bg-secondary p-4 sm:p-6 rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h3 className="text-xl sm:text-2xl font-bold">Your Goals</h3>
        <button className="btn btn-primary w-full sm:w-auto">Create Goal</button>
      </div>
      
      <div className="space-y-4 sm:space-y-6">
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
  );

  const insightsView = () => (
    <div className="bg-secondary p-4 sm:p-6 rounded-lg shadow-md">
      <h3 className="text-lg sm:text-xl font-bold mb-4">Goal Insights</h3>
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
  );

  const suggestionsView = () => (
    <div className="bg-secondary p-4 sm:p-6 rounded-lg shadow-md">
      <h3 className="text-lg sm:text-xl font-bold mb-4">Goal Suggestions</h3>
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
  );

  const tabs = [
    { id: 'goals', label: 'Goals' },
    { id: 'insights', label: 'Insights' },
    { id: 'suggestions', label: 'Suggestions' },
  ];

  if (isMobile) {
    return (
      <PageContainer title="Goals" hideTitle={true}>
        <TopTabNavigation 
          tabs={tabs} 
          defaultActiveTab="goals"
        >
          {{
            'goals': goalsView(),
            'insights': insightsView(),
            'suggestions': suggestionsView(),
          }}
        </TopTabNavigation>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Goals" hideTitle={true}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-8">
        <div className="lg:col-span-2">
          {goalsView()}
        </div>
        
        <div className="space-y-6">
          {insightsView()}
          {suggestionsView()}
        </div>
      </div>
    </PageContainer>
  );
}