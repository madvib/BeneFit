import { cva, type VariantProps } from 'class-variance-authority';
import { LucideIcon } from 'lucide-react';
import { ReactNode, forwardRef } from 'react';

const cardVariants = cva('flex flex-col overflow-hidden rounded-xl shadow-sm', {
  variants: {
    variant: {
      default: 'bg-background border border-muted',
      borderless: 'bg-background',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const cardHeaderVariants = cva('flex items-center justify-between px-6 py-4', {
  variants: {
    variant: {
      default: 'border-muted bg-accent/20 border-b',
      borderless: 'bg-accent/20',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const cardBodyVariants = cva('flex-1 p-6', {
  variants: {
    variant: {
      default: '',
      borderless: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface CardProps extends VariantProps<typeof cardVariants> {
  title?: string;
  icon?: LucideIcon;
  headerAction?: ReactNode; // e.g. "View All" button
  children: ReactNode;
  className?: string;
  footer?: ReactNode;
  image?: string;
  description?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      title,
      icon: Icon,
      headerAction,
      children,
      className = '',
      footer,
      image,
      description,
      headerClassName = '',
      bodyClassName = '',
      footerClassName = '',
      variant = 'default',
      ...props
    },
    ref,
  ) => {
    return (
      <div ref={ref} className={cardVariants({ variant, className })} {...props}>
        {/* Header with title and optional icon */}
        {(title || headerAction) && (
          <div className={`${cardHeaderVariants({ variant })} ${headerClassName}`}>
            {title && (
              <div className="flex items-center gap-2">
                {Icon && <Icon size={18} className="text-primary" />}
                <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
              </div>
            )}
            {headerAction && <div>{headerAction}</div>}
          </div>
        )}

        {/* Image section (if provided) */}
        {image && (
          <div className="h-48 overflow-hidden">
            <img src={image} alt={title || ''} className="h-full w-full object-cover" />
          </div>
        )}

        {/* Body */}
        <div className={`${cardBodyVariants({ variant })} ${bodyClassName}`}>
          {description && <p className="text-muted-foreground mb-4">{description}</p>}
          {children}
        </div>

        {/* Footer (Optional) */}
        {footer && (
          <div
            className={`mx-6 py-4 ${variant === 'borderless' ? '' : 'border-muted/60 border-t'} ${footerClassName}`}
          >
            {footer}
          </div>
        )}
      </div>
    );
  },
);
Card.displayName = 'Card';

export { Card, cardVariants };
