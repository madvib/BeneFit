import { Card, InsightCard } from '@/components';

export default function InsightsPanel() {
  return (
    <Card title="Goal Insights">
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
    </Card>
  );
}
