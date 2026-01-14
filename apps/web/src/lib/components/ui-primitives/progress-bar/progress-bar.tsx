import { cva, type VariantProps } from 'class-variance-authority';

const progressBarVariants = cva('w-full overflow-hidden rounded-full transition-all', {
  variants: {
    variant: {
      default: 'bg-secondary/50 ring-1 ring-primary/5',
      solid: 'bg-secondary',
      ghost: 'bg-transparent border border-muted',
    },
    size: {
      xs: 'h-1',
      sm: 'h-1.5',
      md: 'h-2.5',
      lg: 'h-4',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

const barVariants = cva('h-full rounded-full transition-all duration-500 ease-out', {
  variants: {
    variant: {
      default:
        'bg-gradient-to-r from-blue-500 to-purple-600 shadow-[0_0_15px_rgba(59,130,246,0.3)]',
      solid: 'bg-primary shadow-sm',
      success: 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface ProgressBarProperties extends VariantProps<typeof progressBarVariants> {
  value: number;
  max: number;
  className?: string;
  barVariant?: VariantProps<typeof barVariants>['variant'];
  showPercentage?: boolean;
}

export function ProgressBar({
  value,
  max,
  className = '',
  variant,
  size,
  barVariant,
}: ProgressBarProperties) {
  const percentage = Math.min(100, Math.max(0, (value / (max || 1)) * 100));

  return (
    <div className={`${progressBarVariants({ variant, size })} ${className}`}>
      <div
        className={barVariants({
          variant: barVariant || (variant === 'solid' ? 'solid' : 'default'),
        })}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
