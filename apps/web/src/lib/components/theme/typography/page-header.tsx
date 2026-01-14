import { typography } from './typography';

interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export function PageHeader({ title, description, className }: PageHeaderProps) {
  return (
    <div className={`mb-6 space-y-1 ${className ?? ''}`}>
      <h1 className={`${typography.h1} mb-3 md:text-4xl`}>{title}</h1>
      {description && <p className={`${typography.lead} max-w-3xl`}>{description}</p>}
    </div>
  );
}
