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
  const valueSize = variant === 'large' ? 'text-3xl sm:text-4xl' : variant === 'compact' ? 'text-xl' : 'text-2xl sm:text-3xl';
  const descriptionSize = variant === 'compact' ? 'text-xs' : 'sm:text-sm';
  const paddingClass = variant === 'compact' ? 'p-4' : 'p-4 sm:p-6';

  return (
    <div
      className={`bg-background ${paddingClass} rounded-lg shadow-sm border border-muted ${className}`}
    >
      {icon ? (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div className="flex-1">
            <h4 className={`font-medium text-muted-foreground mb-1 ${titleSize}`}>
              {title}
            </h4>
            <div className={`font-bold text-primary ${valueSize}`}>
              {value}
            </div>
            <p className={`text-muted-foreground mt-2 ${descriptionSize}`}>
              {description}
            </p>
          </div>
          {icon && (
            <div className="bg-primary/10 p-3 rounded-lg self-start">{icon}</div>
          )}
        </div>
      ) : (
        <div>
          <h4 className={`font-medium mb-2 ${titleSize}`}>{title}</h4>
          <div className={`font-bold text-primary ${valueSize}`}>{value}</div>
          <p className={`text-sm text-muted-foreground ${descriptionSize}`}>{description}</p>
        </div>
      )}
    </div>
  );
}