'use client';

import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { typography } from '@/lib/components';

const sliderVariants = cva(
  'relative w-full cursor-pointer appearance-none rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: {
        sm: 'h-2',
        md: 'h-4',
        lg: 'h-6',
      },
      variant: {
        default: 'bg-accent',
        gradient: 'bg-gradient-to-r from-green-500 via-yellow-400 to-red-500',
        solid: 'bg-primary/20',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  },
);

// Custom styles for the slider thumb using browser-specific pseudo-elements
const thumbStyles = `
  [&::-webkit-slider-thumb]:appearance-none
  [&::-webkit-slider-thumb]:h-8
  [&::-webkit-slider-thumb]:w-8
  [&::-webkit-slider-thumb]:rounded-full
  [&::-webkit-slider-thumb]:bg-white
  [&::-webkit-slider-thumb]:shadow-[0_4px_12px_rgba(0,0,0,0.3)]
  [&::-webkit-slider-thumb]:border-4
  [&::-webkit-slider-thumb]:border-white/50
  [&::-webkit-slider-thumb]:transition-all
  [&::-webkit-slider-thumb]:hover:scale-110
  
  [&::-moz-range-thumb]:h-8
  [&::-moz-range-thumb]:w-8
  [&::-moz-range-thumb]:rounded-full
  [&::-moz-range-thumb]:bg-white
  [&::-moz-range-thumb]:border-4
  [&::-moz-range-thumb]:border-white/50
  [&::-moz-range-thumb]:shadow-lg
  [&::-moz-range-thumb]:transition-all
  [&::-moz-range-thumb]:hover:scale-110
`;

interface SliderProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof sliderVariants> {
  ticks?: number[];
  getTickLabel?: (_val: number) => string;
}

const Slider = forwardRef<HTMLInputElement, SliderProps>(
  ({ className, size, variant, ticks, getTickLabel, min = 0, max = 100, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <input
          type="range"
          ref={ref}
          min={min}
          max={max}
          className={`${sliderVariants({ size, variant })} ${thumbStyles} ${className}`}
          {...props}
        />

        {/* Ticks */}
        {ticks && (
          <div className="mt-4 flex justify-between px-1">
            {ticks.map((tick) => (
              <div
                key={tick}
                className="flex flex-col items-center gap-2"
                style={
                  {
                    // Calculate approximate position if needed, but flex justify-between works well for min/mid/max
                    // For precise positioning of many ticks, absolute positioning would be needed.
                    // For now, assuming simple use cases like start/middle/end.
                  }
                }
              >
                <div className="bg-border h-1.5 w-1.5 rounded-full" />
                {getTickLabel && (
                  <p
                    className={`${typography.muted} text-[9px] font-black tracking-widest uppercase opacity-40`}
                  >
                    {getTickLabel(tick)}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  },
);

Slider.displayName = 'Slider';

export default Slider;
