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
      },
      size: {
        sm: 'h-8 w-8',
        md: 'h-10 w-10',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16',
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

export default function IconBox({
  icon: Icon,
  children,
  variant,
  size,
  className,
  iconClassName,
}: IconBoxProps) {
  const iconSizeMap = {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
  };

  return (
    <div className={iconBoxVariants({ variant, size, className })}>
      {Icon ? <Icon size={size ? iconSizeMap[size] : 20} className={iconClassName} /> : children}
    </div>
  );
}
