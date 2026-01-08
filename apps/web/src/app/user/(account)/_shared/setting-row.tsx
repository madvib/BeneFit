import { LucideIcon } from 'lucide-react';

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
          <h3 className="font-semibold">{title}</h3>
          {description && (
            <p className="text-muted-foreground text-sm">{description}</p>
          )}
        </div>
      </div>
      {action && <div className="ml-4">{action}</div>}
    </div>
  );
}
