import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { typography } from '@/lib/components';

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
  iconClassName?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = '',
  iconClassName = '',
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-4 px-6 py-16 text-center ${className}`}>
      <div className={`bg-accent/50 text-muted-foreground mb-2 rounded-full p-4 ${iconClassName}`}>
        <Icon size={32} />
      </div>
      <h4 className={typography.h4}>{title}</h4>
      <p className={`${typography.muted} max-w-[280px]`}>
        {description}
      </p>
      {action && (
        <div className="mt-2 text-center">
          {action}
        </div>
      )}
    </div>
  );
}
