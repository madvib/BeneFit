import { LucideIcon } from 'lucide-react';

interface MetricPillProps {
  value: string | number;
  unit?: string;
  icon?: LucideIcon;
  variant?: 'default' | 'accent';
}

export function MetricPill({
  value,
  unit,
  icon: Icon,
  variant = 'default',
}: MetricPillProps) {
  const baseClass =
    'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors';
  const variants = () => {
    switch (variant) {
      case 'default':
        return 'bg-muted/30 text-muted-foreground border border-transparent';
      case 'accent':
        return 'bg-primary/5 text-primary border border-primary/10';
    }
  };

  return (
    <span className={`${baseClass} ${variants()}`}>
      {Icon && (
        <Icon
          size={12}
          className={variant === 'accent' ? 'text-primary' : 'text-muted-foreground'}
        />
      )}
      <span>
        {value}
        {unit && <span className="ml-0.5 opacity-70">{unit}</span>}
      </span>
    </span>
  );
}
