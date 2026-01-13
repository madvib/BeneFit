import { LucideIcon } from 'lucide-react';
import { typography, IconBox } from '@/lib/components';

interface SettingRowProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function SettingRow({
  icon: Icon,
  title,
  description,
  action,
  className,
}: SettingRowProps) {
  return (
    <div className={`flex items-start justify-between ${className || ''}`}>
      <div className="flex gap-4">
        {Icon && <IconBox icon={Icon} variant="default" size="md" className="mt-1" />}
        <div>
          <h3 className={typography.h4}>{title}</h3>
          {description && (
            <p className={`${typography.p} text-muted-foreground text-sm`}>{description}</p>
          )}
        </div>
      </div>
      {action && <div className="ml-4">{action}</div>}
    </div>
  );
}
