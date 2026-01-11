import { cva, type VariantProps } from 'class-variance-authority';
import { LucideIcon, Sparkles } from 'lucide-react';

// Define variants that cover all current use cases in the codebase
const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-sm',
        secondary: 'bg-secondary text-secondary-foreground',
        success:
          'bg-success/10 text-success ring-1 ring-inset ring-success/20 dark:bg-success/20 dark:ring-0',
        warning:
          'bg-warning/10 text-warning ring-1 ring-inset ring-warning/20 dark:bg-warning/20 dark:ring-0',
        error:
          'bg-error/10 text-error ring-1 ring-inset ring-error/20 dark:bg-error/20 dark:ring-0',
        info: 'bg-info/10 text-info ring-1 ring-inset ring-info/20 dark:bg-info/20 dark:ring-0',
        active: 'bg-success/10 text-success ring-1 ring-inset ring-success/20 dark:bg-success/20',
        inactive: 'bg-muted text-muted-foreground ring-1 ring-inset ring-muted-foreground/10',
        outline: 'border border-border text-foreground',
        primaryLight: 'bg-primary/10 text-primary ring-1 ring-inset ring-primary/20',
        accent: 'bg-accent/50 text-accent-foreground border border-accent',
        ai: 'bg-primary/5 text-primary border border-primary/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  icon?: LucideIcon;
}

function Badge({
  className,
  variant,
  icon: Icon,
  children,
  ...props
}: BadgeProps & { children: React.ReactNode }) {
  const isAI = variant === 'ai';
  const EffectiveIcon = Icon || (isAI ? Sparkles : null);

  return (
    <span className={`${badgeVariants({ variant, className })}`} {...props}>
      {EffectiveIcon && (
        <EffectiveIcon
          size={isAI ? 12 : 10}
          className={`mr-1.5 ${isAI ? 'text-primary animate-pulse' : ''}`}
        />
      )}
      {children}
    </span>
  );
}

export default Badge;
export { badgeVariants };
