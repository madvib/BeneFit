import { cva, type VariantProps } from 'class-variance-authority';
import { LucideIcon } from 'lucide-react';
import { ButtonHTMLAttributes, forwardRef } from 'react';

const actionButtonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        text: 'text-muted-foreground hover:text-primary hover:bg-accent/50',
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm',
        outline:
          'border border-muted bg-background hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        sm: 'h-8 rounded-md px-2 text-xs',
        md: 'h-9 px-4 py-2',
        lg: 'h-11 rounded-md px-8 text-base',
      },
    },
    defaultVariants: {
      variant: 'text',
      size: 'md',
    },
  },
);

interface ActionButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof actionButtonVariants> {
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
}
const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  (
    { className, variant, size, icon: Icon, iconPosition = 'left', children, ...props },
    ref,
  ) => {
    const mapIconSize = () => {
      switch (size) {
        case 'sm':
          return 14;
        case 'md':
          return 16;
        case 'lg':
          return 18;
        default:
          return 16;
      }
    };
    return (
      <button
        className={actionButtonVariants({ variant, size, className })}
        ref={ref}
        {...props}
      >
        {iconPosition === 'left' && Icon && <Icon size={mapIconSize()} />}
        {children}
        {iconPosition === 'right' && Icon && <Icon size={mapIconSize()} />}
      </button>
    );
  },
);
ActionButton.displayName = 'ActionButton';

export { ActionButton, actionButtonVariants };
