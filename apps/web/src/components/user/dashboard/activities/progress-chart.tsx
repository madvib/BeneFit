import { BarChart3, TrendingUp } from 'lucide-react';

export default function ProgressChart({
  data,
}: {
  data: { date: string; value: number }[];
}) {
  const maxValue = Math.max(...data.map((d) => d.value), 10); // Ensure scaling

  return (
    <div className="bg-background border-muted flex flex-col overflow-hidden rounded-xl border shadow-sm">
      {/* Header */}
      <div className="border-muted bg-accent/20 flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <BarChart3 size={18} className="text-primary" />
          <h3 className="text-lg font-semibold tracking-tight">Weekly Progress</h3>
        </div>
        <span className="flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
          <TrendingUp size={10} /> +12%
        </span>
      </div>

      {/* Chart Body */}
      <div className="p-6">
        {/* Chart Area */}
        <div className="flex h-48 items-end justify-between gap-2 sm:gap-4">
          {data.map((point, index) => {
            const heightPercentage = (point.value / maxValue) * 100;
            const isZero = point.value === 0;

            return (
              <div
                key={index}
                className="group flex flex-1 flex-col items-center gap-2"
              >
                {/* Value Label (Hover only) */}
                <div className="text-primary absolute -mt-6 mb-1 text-[10px] font-bold opacity-0 transition-opacity group-hover:opacity-100">
                  {point.value}
                </div>

                {/* Bar Track */}
                <div className="bg-muted/30 relative flex h-full w-full max-w-[30px] items-end overflow-hidden rounded-t-md">
                  {/* Actual Bar */}
                  <div
                    className={`w-full rounded-t-md transition-all duration-500 ease-out ${isZero ? 'bg-muted-foreground/30 min-h-0.5' : 'bg-primary hover:bg-primary/90'}`}
                    style={{ height: `${Math.max(2, heightPercentage)}%` }}
                  ></div>
                </div>

                {/* X-Axis Label */}
                <div className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
                  {point.date}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Summary */}
        <div className="border-muted/60 mt-6 border-t pt-4 text-center">
          <p className="text-muted-foreground mb-1 text-xs">Total Distance</p>
          <p className="text-foreground text-2xl font-bold tracking-tight">
            32.4
            <span className="text-muted-foreground text-sm font-normal">miles</span>
          </p>
        </div>
      </div>
    </div>
  );
}
