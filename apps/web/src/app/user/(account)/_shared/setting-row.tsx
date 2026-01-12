import { LucideIcon } from 'lucide-react';
import { typography } from '@/lib/components/theme/typography';

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
        {Icon && (
          <div className="bg-primary/10 text-primary mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
            <Icon size={20} />
          </div>
        )}
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
