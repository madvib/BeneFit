import { Slider, typography } from '@/lib/components';
import { useRPE } from '@/lib/hooks/_draft/use-rpe';

interface IntensitySliderProps {
  value: number;
  onChange: (_value: number) => void;
  variant: 'rpe' | 'frequency';
  disabled?: boolean;
  className?: string;
}

/**
 * A shared slider component for picking RPE or frequency values.
 */
export function IntensitySlider({
  value,
  onChange,
  variant,
  disabled,
  className
}: IntensitySliderProps) {
  // Get variant-specific data
  let label, description, min, max, step, ticks, getTickLabel, displayValue, colorClass;

  if (variant === 'rpe') {
    const { label: rpeLabel, colorClass: rpeColorClass } = useRPE(value);
    label = rpeLabel;
    description = 'Intensity Index';
    min = 1;
    max = 10;
    step = 1;
    ticks = [1, 5, 10];
    getTickLabel = (t: number) => {
      if (t === 1) return 'Min';
      if (t === 5) return 'Medium';
      if (t === 10) return 'Max';
      return '';
    };
    displayValue = value.toString();
    colorClass = rpeColorClass;
  } else { // frequency
    label = 'Workouts per Week';
    description = 'How many sessions can you commit to?';
    min = 4; // Min 1 per week * 4 weeks
    max = 28; // Max 7 per week * 4 weeks
    step = 4; // Increments by week
    ticks = [4, 14, 28]; // 1x week, 3.5x week, 7x week
    getTickLabel = (tickValue: number) => {
      const workoutsPerWeekValue = Math.round(tickValue / 4);
      if (workoutsPerWeekValue === 1) return 'Once';
      if (workoutsPerWeekValue === 7) return 'Daily';
      return `${workoutsPerWeekValue}x`;
    };
    displayValue = Math.round(value / 4).toString();
    colorClass = 'text-primary';
  }

  return (
    <div className={`space-y-6 ${className || ''}`}>
      <div className="flex items-center justify-between gap-4">
        <div className="text-left">
          <h3
            className={`${typography.h3} mb-1 transition-colors ${colorClass} 
              text-2xl font-black tracking-tighter capitalize italic`}
          >
            {label}
          </h3>
          <p
            className={`${typography.muted} text-[10px] font-black tracking-[0.2em] uppercase opacity-50`}
          >
            {description}
          </p>
        </div>

        <div className={`$bg-primary/5 border-border/50 ${colorClass} flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm ${
          variant === 'rpe' ? 'border' : ''
        }`}>
          <h2
            className={`${typography.displayMdInherit} text-2xl font-black italic ${colorClass}`}
          >
            {displayValue}
          </h2>
        </div>
      </div>

      <div className={`bg-accent/30 border-border/40 border rounded-3xl p-8`}>
        <Slider
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          variant='gradient'
          ticks={ticks}
          getTickLabel={getTickLabel}
          disabled={disabled}
        />
      </div>
    </div>
  );
}