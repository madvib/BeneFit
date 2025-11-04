import { Card } from '@/components';

interface ChartDataPoint {
  date: string;
  value: number;
}

interface ProgressChartProps {
  data: ChartDataPoint[];
}

export default function ProgressChart({ data }: ProgressChartProps) {
  return (
    <Card title="Progress Chart">
      <div className="h-48 sm:h-64 flex items-end space-x-1 sm:space-x-2 pt-4 sm:pt-6 overflow-x-auto pb-2 -mx-4 px-4">
        {data.map((point, index) => (
          <div
            key={index}
            className="flex flex-col items-center flex-1 min-w-[30px] max-w-[60px]"
          >
            <div className="text-xs text-muted-foreground mb-1 shrink-0">
              {point.date}
            </div>
            <div
              className="w-full bg-primary rounded-t hover:opacity-75 transition-opacity min-h-[5px]"
              style={{ height: `${Math.max(5, (point.value / 50) * 100)}%` }}
            ></div>
            <div className="text-xs mt-1 shrink-0">{point.value}</div>
          </div>
        ))}
      </div>
      <div className="mt-6 text-center pt-4 border-t border-accent">
        <p className="text-muted-foreground text-sm mb-2 break-words">
          Weekly Progress
        </p>
        <p className="text-xl sm:text-2xl font-bold text-primary break-words">
          +7.5 miles this week
        </p>
      </div>
    </Card>
  );
}