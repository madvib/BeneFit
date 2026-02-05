import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';
import { IconBox, typography } from '@/lib/components';

interface ListTileProps {
  icon?: LucideIcon;
  iconClassName?: string;
  title: string;
  description?: string | ReactNode;
  action?: ReactNode;
  className?: string;
}

export function ListTile({
  icon: Icon,
  iconClassName,
  title,
  description,
  action,
  className,
}: Readonly<ListTileProps>) {
  return (
    <div className={`flex items-start justify-between ${className || ''}`}>
      <div className="flex gap-4">
        {Icon && (
          <IconBox icon={Icon} variant="default" size="md" className={`mt-1 ${iconClassName || ''}`} />
        )}
        <div>
          <h3 className={typography.large}>{title}</h3>
          {description && (
            <div className={`${typography.muted} mt-1`}>{description}</div>
          )}
        </div>
      </div>
      {action && <div className="ml-4">{action}</div>}
    </div>
  );
}
