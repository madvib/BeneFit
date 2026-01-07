import { ReactNode } from 'react';

interface DataCardProps {
  title: string;
  value: string | number;
  description: string;
  icon?: ReactNode;
  className?: string;
  variant?: 'default' | 'compact' | 'large';
}

export default function DataCard({
  title,
  value,
  description,
  icon,
  className = '',
  variant = 'default',
}: DataCardProps) {
  const titleSize = variant === 'compact' ? 'text-sm' : 'sm:text-base';
  let valueSize = 'text-2xl sm:text-3xl';
  if (variant === 'large') {
    valueSize = 'text-3xl sm:text-4xl';
  } else if (variant === 'compact') {
    valueSize = 'text-xl';
  }
  const descriptionSize = variant === 'compact' ? 'text-xs' : 'sm:text-sm';
  const paddingClass = variant === 'compact' ? 'p-4' : 'p-4 sm:p-6';

  return (
    <div
      className={`bg-background ${paddingClass} border-muted rounded-lg border shadow-sm ${className}`}
    >
      {icon ? (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <h4 className={`text-muted-foreground mb-1 font-medium ${titleSize}`}>{title}</h4>
            <div className={`text-primary font-bold ${valueSize}`}>{value}</div>
            <p className={`text-muted-foreground mt-2 ${descriptionSize}`}>{description}</p>
          </div>
          {icon && <div className="bg-primary/10 self-start rounded-lg p-3">{icon}</div>}
        </div>
      ) : (
        <div>
          <h4 className={`mb-2 font-medium ${titleSize}`}>{title}</h4>
          <div className={`text-primary font-bold ${valueSize}`}>{value}</div>
          <p className={`text-muted-foreground text-sm ${descriptionSize}`}>{description}</p>
        </div>
      )}
    </div>
  );
}
