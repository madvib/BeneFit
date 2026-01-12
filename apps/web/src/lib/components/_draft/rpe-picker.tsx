'use client';

import { Slider, Typography } from '@/lib/components/ui-primitives';
import { useRPE } from '@/lib/hooks/_draft/use-rpe';

interface RPEPickerProps {
  value: number;
  onChange: (_value: number) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * [DRAFT] A specialized slider for picking RPE values.
 * Uses useRPE hook for labels and styling.
 */
export default function RPEPicker({ value, onChange, disabled, className }: RPEPickerProps) {
  const { label, colorClass } = useRPE(value);

  const getTickLabel = (t: number) => {
    if (t === 1) return 'Min';
    if (t === 5) return 'Medium';
    if (t === 10) return 'Max';
    return '';
  };

  return (
    <div className={`space-y-6 ${className || ''}`}>
      <div className="flex items-center justify-between gap-4">
        <div className="text-left">
          <Typography
            variant="h3"
            className={`mb-1 text-2xl font-black tracking-tighter capitalize italic transition-colors ${colorClass}`}
          >
            {label}
          </Typography>
          <Typography
            variant="muted"
            className="text-[10px] font-black tracking-[0.2em] uppercase opacity-50"
          >
            Intensity Index
          </Typography>
        </div>

        <div className="bg-primary/5 border-border/50 flex h-14 w-14 items-center justify-center rounded-2xl border shadow-sm">
          <Typography
            variant="h2"
            className={`text-2xl font-black italic transition-colors ${colorClass}`}
          >
            {value}
          </Typography>
        </div>
      </div>

      <div className="bg-accent/30 border-border/40 rounded-3xl border p-8">
        <Slider
          min={1}
          max={10}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          variant="gradient"
          ticks={[1, 5, 10]}
          getTickLabel={getTickLabel}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
