import { Badge, Card, typography } from '@/lib/components';
import { BarChart3, TrendingUp, Sparkles } from 'lucide-react';

export function ProgressChart({ data }: Readonly<{ data: { date: string; value: number }[] }>) {
  const maxValue = Math.max(...data.map((d) => d.value), 10);

  return (
    <Card className="border-primary/10 flex w-full flex-col shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
            <BarChart3 size={18} />
          </div>
          <h4 className={typography.h4}>Weekly Activity</h4>
        </div>
        <Badge variant="success" icon={TrendingUp} className={typography.labelXs}>
          +12%
        </Badge>
      </div>

      {/* Chart Body */}
      <div className="px-5 pt-8 pb-5">
        <div className="bg-accent/30 flex h-48 w-full items-end gap-2 rounded-xl p-4">
          {data.map((point, index) => {
            const heightPercentage = (point.value / maxValue) * 100;
            const isZero = point.value === 0;

            return (
              <div
                key={index}
                className="group relative flex h-full flex-col items-center justify-end gap-2.5"
                style={{ flex: '1 1 0px' }}
              >
                {/* Value Label (Hover) */}
                <div
                  className={`${typography.labelXs} bg-primary text-primary-foreground absolute -top-11 left-1/2 z-10 -translate-x-1/2 scale-0 rounded-lg px-2 py-0.5 shadow-xl transition-all group-hover:scale-100`}
                >
                  {point.value}
                </div>

                {/* Bar Track */}
                <div className="bg-background/50 border-border/50 relative flex h-full w-full items-end overflow-hidden rounded-xl border shadow-inner">
                  {/* Actual Bar */}
                  <div
                    className={`cubic-bezier(0.34, 1.56, 0.64, 1) w-full rounded-t-lg transition-all duration-700 ${
                      isZero
                        ? 'bg-muted-foreground/20 h-1'
                        : 'bg-primary hover:bg-primary/90 shadow-[0_0_15px_-3px_rgba(var(--primary),0.4)]'
                    }`}
                    style={{ height: `${Math.max(2, heightPercentage)}%` }}
                  >
                    {!isZero && (
                      <div className="absolute top-0 right-0 left-0 h-1/2 bg-linear-to-b from-white/20 to-transparent" />
                    )}
                  </div>
                </div>

                {/* X-Axis Label */}
                <p className={`${typography.labelXs} group-hover:text-primary transition-colors`}>
                  {point.date}
                </p>
              </div>
            );
          })}
        </div>

        {/* Footer Summary */}
        <div className="border-border/50 mt-5 flex flex-col gap-3 border-t pt-5">
          <div className="flex flex-col gap-1">
            <p className={typography.labelXs}>Total Distance</p>
            <div className="flex items-baseline gap-2">
              <h2 className={typography.displayMd}>32.4</h2>
              <p className={`${typography.small} text-muted-foreground italic`}>miles</p>
            </div>
          </div>
          <div className="bg-primary/5 border-primary/20 flex flex-col rounded-xl border px-4 py-3">
            <div className="mb-1 flex items-center gap-2">
              <Sparkles size={14} className="text-primary shrink-0" />
              <p className={typography.labelXs}>Performance</p>
            </div>
            <p className={`${typography.small} text-foreground font-bold`}>Above Average</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
