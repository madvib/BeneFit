import React from 'react';
import Typography from './typography';

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export default function SectionHeader({
  title,
  description,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div className={`mb-4 flex items-center justify-between ${className ?? ''}`}>
      <div className="space-y-1">
        <Typography variant="h2" className="border-none pb-0">
          {title}
        </Typography>
        {description && <Typography variant="muted">{description}</Typography>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
