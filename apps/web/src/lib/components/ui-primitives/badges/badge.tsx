import { cva, type VariantProps } from 'class-variance-authority';
import { LucideIcon } from 'lucide-react';

// Define variants that cover all current use cases in the codebase
const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200',
        warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200',
        error: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200',
        info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
        active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
        inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-300',
        outline: 'border border-input text-foreground',
        primaryLight: 'bg-primary/10 text-primary border border-primary/20',
        accent: 'bg-accent/30 text-accent-foreground border border-accent/40',
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
  return (
    <span className={badgeVariants({ variant, className })} {...props}>
      {Icon && <Icon size={10} className="mr-1" />}
      {children}
    </span>
  );
}

export default Badge;
export { badgeVariants };
