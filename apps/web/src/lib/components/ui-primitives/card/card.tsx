import { cva, type VariantProps } from 'class-variance-authority';
import { LucideIcon } from 'lucide-react';
import { ReactNode, forwardRef } from 'react';

import Typography from '../typography/typography';

const cardVariants = cva(
  'flex flex-col overflow-hidden rounded-xl shadow-sm transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'bg-background border border-muted',
        borderless: 'bg-background-muted',
        ghost: 'bg-transparent border-none shadow-none',
        premium: 'bg-card/80 border-white/10 rounded-3xl shadow-2xl backdrop-blur-xl border',
        glass: 'bg-background/50 border-white/5 shadow-xl backdrop-blur-md border',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const cardHeaderVariants = cva('flex items-center justify-between px-4 py-4 sm:px-6', {
  variants: {
    variant: {
      default: 'border-muted bg-accent/20 border-b',
      borderless: 'bg-accent/20',
      ghost: 'bg-accent/20',
      premium: 'bg-white/5 border-white/10 border-b',
      glass: 'bg-white/5 border-white/10 border-b',
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
                <Typography variant="h4" className="font-semibold tracking-tight">
                  {title}
                </Typography>
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
        <div className={`flex-1 p-4 sm:p-6 ${bodyClassName}`}>
          {description && (
            <Typography variant="muted" className="mb-4">
              {description}
            </Typography>
          )}
          {children}
        </div>

        {/* Footer (Optional) */}
        {footer && (
          <div
            className={`px-4 py-4 sm:px-6 ${variant === 'borderless' ? '' : 'border-muted/60 border-t'} ${footerClassName}`}
          >
            {footer}
          </div>
        )}
      </div>
    );
  },
);
Card.displayName = 'Card';

export default Card;
export { cardVariants };
