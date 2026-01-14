import { typography } from './typography';

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({ title, description, action, className }: SectionHeaderProps) {
  return (
    <div className={`mb-4 flex items-center justify-between ${className ?? ''}`}>
      <div className="space-y-1">
        <h2 className={`${typography.h2} border-none pb-0`}>{title}</h2>
        {description && <p className={typography.muted}>{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
