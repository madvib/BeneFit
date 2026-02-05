import { LucideIcon } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';

const iconBoxVariants = cva(
  'flex shrink-0 items-center justify-center rounded-full transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary/10 text-primary',
        secondary: 'bg-secondary text-secondary-foreground',
        muted: 'bg-muted text-muted-foreground',
        accent: 'bg-accent/10 text-accent-foreground',
        outline: 'border border-border bg-background text-foreground',
        ghost: 'bg-transparent text-foreground',
        destructive: 'bg-destructive/10 text-destructive',
      },
      size: {
        xs: 'h-5 w-5 text-sm',
        sm: 'h-8 w-8 text-lg',
        md: 'h-10 w-10 text-xl',
        lg: 'h-12 w-12 text-2xl',
        xl: 'h-16 w-16 text-4xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);

export interface IconBoxProps extends VariantProps<typeof iconBoxVariants> {
  icon?: LucideIcon | React.ElementType;
  children?: React.ReactNode;
  className?: string;
  iconClassName?: string;
}

export function IconBox({
  icon: Icon,
  children,
  variant,
  size,
  className,
  iconClassName,
}: IconBoxProps) {
  const iconSizeMap = {
    xs: 14,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 44,
  };

  return (
    <div className={iconBoxVariants({ variant, size, className })}>
      {Icon ? <Icon size={size ? iconSizeMap[size] : 20} className={iconClassName} /> : children}
    </div>
  );
}
