import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';
import { Card, typography } from '@/lib/components';

export interface MetricCardProps {
  label: string;
  value: string | number | ReactNode;
  icon: LucideIcon;
  unit?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    label?: string;
  };
  className?: string; // Wrapper className
  bodyClassName?: string;
  iconClassName?: string;
}

export function MetricCard({
  label,
  value,
  icon: Icon,
  unit,
  className = '',
  bodyClassName = '',
  iconClassName = '',
}: MetricCardProps) {
  return (
    <Card 
      bodyClassName={`p-3 sm:p-4 flex flex-col gap-0.5 sm:gap-1 ${bodyClassName}`} 
      className={`border-border bg-card ${className}`}
    >
      <div className="text-muted-foreground flex items-center gap-2">
        <Icon size={16} className={iconClassName} />
        <span className={typography.mutedXs}>{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <div className={`text-xl font-bold sm:text-2xl tracking-tight text-foreground`}>
          {value}
        </div>
        {unit && (
          <span className={`${typography.muted} font-normal`}>{unit}</span>
        )}
      </div>
      {/* Todo: Adding trend support later if needed by designs */}
    </Card>
  );
}
