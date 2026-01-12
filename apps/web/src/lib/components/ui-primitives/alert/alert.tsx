import { AlertTriangle, Bug, Check, Info, X, LucideIcon } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { typography } from '@/lib/components/theme/typography';

const alertVariants = cva('relative w-full rounded-2xl border p-4 shadow-sm transition-all', {
  variants: {
    variant: {
      info: 'bg-info/10 border-info/20 text-info dark:bg-info/20 dark:border-info/30',
      success:
        'bg-success/10 border-success/20 text-success dark:bg-success/20 dark:border-success/30',
      warning:
        'bg-warning/10 border-warning/20 text-warning dark:bg-warning/20 dark:border-warning/30',
      error: 'bg-error/10 border-error/20 text-error dark:bg-error/20 dark:border-error/30',
    },
  },
  defaultVariants: {
    variant: 'info',
  },
});

interface AlertProperties extends VariantProps<typeof alertVariants> {
  title: string;
  description?: string;
  onClose?: () => void;
  className?: string;
  icon?: LucideIcon;
}

export default function Alert({
  title,
  description,
  variant = 'info',
  onClose,
  className = '',
  icon: CustomIcon,
}: AlertProperties) {
  const Icon =
    CustomIcon ||
    {
      info: Info,
      success: Check,
      warning: AlertTriangle,
      error: Bug,
    }[variant ?? 'info'];

  return (
    <div role="alert" className={alertVariants({ variant, className })}>
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="shrink-0 pt-0.5">
            <Icon size={18} />
          </div>
        )}
        <div className="flex-1">
          <h4 className={`${typography.h4} text-sm leading-tight font-black tracking-tight`}>
            {title}
          </h4>
          {description && (
            <p className={`${typography.muted} mt-1 text-xs leading-relaxed font-medium italic`}>
              {description}
            </p>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground -mt-1 -mr-1 rounded-full p-1 transition-colors"
            aria-label="Close alert"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
