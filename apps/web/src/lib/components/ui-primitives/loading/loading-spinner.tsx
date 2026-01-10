'use client';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';
import ShinyText from '../text/shiny-text';

const spinnerVariants = cva('border-muted border-t-primary animate-spin rounded-full border-4', {
  variants: {
    size: {
      sm: 'w-4 h-4',
      md: 'w-8 h-8',
      lg: 'w-12 h-12',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

const containerVariants = cva('flex items-center justify-center', {
  variants: {
    variant: {
      default: '',
      screen: 'bg-background flex min-h-screen items-center justify-center',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface LoadingSpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string;
  text?: string;
  variant?: 'default' | 'screen';
}

const LoadingSpinner = forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ size, className = '', text, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-testid="loading-spinner"
        className={containerVariants({ variant, className })}
        {...props}
      >
        <div className="flex flex-col items-center gap-4">
          <div className={spinnerVariants({ size })}></div>
          {text && <ShinyText text={text} />}
        </div>
      </div>
    );
  },
);
LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;
