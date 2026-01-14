'use client';

import { Badge, Card, typography } from '@/lib/components';
import { BarChart3, TrendingUp, Sparkles } from 'lucide-react';

export function ProgressChart({ data }: Readonly<{ data: { date: string; value: number }[] }>) {
  const maxValue = Math.max(...data.map((d) => d.value), 10);

  return (
    <Card className="border-primary/10 flex flex-col overflow-hidden shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 text-primary flex h-8 w-8 items-center justify-center rounded-lg">
            <BarChart3 size={18} />
          </div>
          <h4 className={typography.h4}>Weekly Activity</h4>
        </div>
        <Badge variant="success" icon={TrendingUp} className={typography.labelXs}>
          +12.5%
        </Badge>
      </div>

      {/* Chart Body */}
      <div className="px-6 pb-6">
        <div className="bg-accent/30 flex h-56 items-end justify-between gap-3 rounded-2xl p-6 sm:gap-6">
          {data.map((point, index) => {
            const heightPercentage = (point.value / maxValue) * 100;
            const isZero = point.value === 0;

            return (
              <div
                key={index}
                className="group relative flex h-full flex-1 flex-col items-center justify-end gap-3"
              >
                {/* Value Label (Hover) */}
                <div
                  className={`${typography.labelXs} bg-primary text-primary-foreground absolute -top-8 z-10 scale-0 rounded-lg px-2 py-1 shadow-xl transition-all group-hover:scale-100`}
                >
                  {point.value}
                </div>

                {/* Bar Track */}
                <div className="bg-background/50 border-border/50 relative flex h-full w-full max-w-8 items-end overflow-hidden rounded-xl border shadow-inner">
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
        <div className="border-border/50 mt-8 flex items-center justify-between border-t pt-6">
          <div className="flex flex-col gap-1">
            <p className={typography.labelXs}>Total Distance</p>
            <div className="flex items-baseline gap-2">
              <h2 className={typography.displayMd}>32.4</h2>
              <p className={`${typography.small} text-muted-foreground italic`}>miles</p>
            </div>
          </div>
          <div className="bg-primary/5 border-primary/20 flex flex-col items-end rounded-2xl border px-4 py-3 text-right">
            <div className="mb-1 flex items-center gap-2">
              <Sparkles size={14} className="text-primary" />
              <p className={typography.labelXs}>Performance</p>
            </div>
            <p className={`${typography.small} text-foreground font-bold`}>Above Average</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
