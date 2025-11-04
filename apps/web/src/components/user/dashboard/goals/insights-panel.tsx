import { InsightCard } from '@/components';

export default function InsightsPanel() {
  return (
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
}