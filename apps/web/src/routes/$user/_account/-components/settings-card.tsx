import { Button, Card, typography } from '@/lib/components';
import { Edit2, LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface SettingsCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  onEdit: () => void;
  children?: ReactNode; // Summary content
  className?: string;
}

export function SettingsCard({
  title,
  description,
  icon: Icon,
  onEdit,
  children,
  className = '',
}: SettingsCardProps) {
  return (
    <Card className={`relative group ${className}`}>
      <div className="flex items-start justify-between p-6">
        <div className="flex gap-4">
          {Icon && (
            <div className="mt-1 rounded-xl bg-primary/10 p-2.5 text-primary dark:bg-primary/20">
              <Icon size={20} />
            </div>
          )}
          <div className="space-y-1">
            <h3 className={typography.h4}>{title}</h3>
            {description && (
              <p className={`${typography.muted} text-sm`}>{description}</p>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="text-muted-foreground hover:text-primary rounded-full transition-all"
        >
          <Edit2 size={16} className="mr-2" />
          Edit
        </Button>
      </div>

      {children && (
        <div className="border-t bg-muted/5 p-6 dark:bg-muted/10">
          {children}
        </div>
      )}
    </Card>
  );
}
