'use client';

import { BarChart3, TrendingUp, Sparkles } from 'lucide-react';
import { Card, Typography, Badge } from '@/lib/components';

export default function ProgressChart({ data }: { data: { date: string; value: number }[] }) {
  const maxValue = Math.max(...data.map((d) => d.value), 10);

  return (
    <Card className="border-primary/10 flex flex-col overflow-hidden shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 text-primary flex h-8 w-8 items-center justify-center rounded-lg">
            <BarChart3 size={18} />
          </div>
          <Typography variant="h4" className="text-lg font-black">
            Weekly Activity
          </Typography>
        </div>
        <Badge
          variant="success"
          icon={TrendingUp}
          className="text-[10px] font-black tracking-widest uppercase"
        >
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
                <div className="bg-primary text-primary-foreground absolute -top-8 z-10 scale-0 rounded-lg px-2 py-1 text-[10px] font-black shadow-xl transition-all group-hover:scale-100">
                  {point.value}
                </div>

                {/* Bar Track */}
                <div className="bg-background/50 border-border/50 relative flex h-full w-full max-w-[32px] items-end overflow-hidden rounded-xl border shadow-inner">
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
                <Typography
                  variant="muted"
                  className="group-hover:text-primary text-[10px] font-black tracking-widest uppercase transition-colors"
                >
                  {point.date}
                </Typography>
              </div>
            );
          })}
        </div>

        {/* Footer Summary */}
        <div className="border-border/50 mt-8 flex items-center justify-between border-t pt-6">
          <div className="flex flex-col gap-1">
            <Typography
              variant="muted"
              className="text-[10px] font-black tracking-widest uppercase"
            >
              Total Distance
            </Typography>
            <div className="flex items-baseline gap-2">
              <Typography variant="h2" className="text-3xl font-black tracking-tighter italic">
                32.4
              </Typography>
              <Typography variant="small" className="text-muted-foreground font-bold italic">
                miles
              </Typography>
            </div>
          </div>
          <div className="bg-primary/5 border-primary/20 flex flex-col items-end rounded-2xl border px-4 py-3 text-right">
            <div className="mb-1 flex items-center gap-2">
              <Sparkles size={14} className="text-primary" />
              <Typography
                variant="muted"
                className="text-[10px] font-black tracking-widest uppercase"
              >
                Performance
              </Typography>
            </div>
            <Typography variant="small" className="text-foreground font-black">
              Above Average
            </Typography>
          </div>
        </div>
      </div>
    </Card>
  );
}
