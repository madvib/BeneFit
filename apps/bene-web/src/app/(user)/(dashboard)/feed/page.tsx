// Server Component - fetches data on the server
import ActivityFeed from '@/components/ActivityFeed';
import ProgressBar from '@/components/common/ProgressBar';
import { Card, DashboardLayout, PageContainer } from '@/components';
import { fetchCurrentGoal, fetchChartData } from '@/data/services/nextDataService';

// This is now a Server Component by default in Next.js App Router
export default async function DashboardPage() {
  // Fetch data on the server - no useEffect needed!
  const [currentGoal, progressData] = await Promise.all([
    fetchCurrentGoal(),
    fetchChartData()
  ]);

  return (
    <PageContainer title="Welcome, User!" hideTitle={true}>
      <DashboardLayout
        sidebar={
          <div className="space-y-6 w-full">
            {/* Current Goal Card */}
            <Card title="Current Goal">
              {currentGoal ? (
                <div>
                  <h4 className="font-semibold text-lg break-words">{currentGoal.title}</h4>
                  <p className="text-muted-foreground text-sm mb-4 break-words">{currentGoal.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex flex-wrap justify-between text-sm mb-1 gap-2">
                      <span>{currentGoal.currentValue} {currentGoal.unit}</span>
                      <span>{currentGoal.targetValue} {currentGoal.unit}</span>
                    </div>
                    <ProgressBar 
                      value={currentGoal.currentValue} 
                      max={currentGoal.targetValue} 
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="text-sm space-y-1">
                    <p className="text-muted-foreground break-words">Deadline: {new Date(currentGoal.deadline).toLocaleDateString()}</p>
                    <p className="text-muted-foreground break-words">Remaining: {(currentGoal.targetValue - currentGoal.currentValue).toFixed(1)} {currentGoal.unit}</p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground italic">No current goal set</p>
              )}
              
              <button className="mt-4 w-full btn btn-primary">
                Set New Goal
              </button>
            </Card>
            
            {/* Progress Chart Card */}
            <Card title="Progress Chart">
              <div className="h-48 sm:h-64 flex items-end space-x-1 sm:space-x-2 pt-4 sm:pt-6 overflow-x-auto pb-2">
                {progressData.map((data, index) => (
                  <div key={index} className="flex flex-col items-center flex-1 min-w-[30px]">
                    <div className="text-xs text-muted-foreground mb-1 shrink-0">{data.date}</div>
                    <div 
                      className="w-full bg-primary rounded-t hover:opacity-75 transition-opacity min-h-[5px]"
                      style={{ height: `${Math.max(5, (data.value / 50) * 100)}%` }}
                    ></div>
                    <div className="text-xs mt-1 shrink-0">{data.value}</div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-muted-foreground text-sm mb-2 break-words">Weekly Progress</p>
                <p className="text-xl sm:text-2xl font-bold text-primary break-words">+7.5 miles this week</p>
              </div>
            </Card>
          </div>
        }
      >
        <ActivityFeed />
      </DashboardLayout>
    </PageContainer>
  );
}