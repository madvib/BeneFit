import React from 'react';
import { typography } from '@/lib/components/theme/typography';

interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export function PageHeader({ title, description, className }: PageHeaderProps) {
  return (
    <div className={`space-y-1 ${className || ''}`}>
      <h1 className={typography.h1}>{title}</h1>
      {description && <p className={typography.lead}>{description}</p>}
    </div>
  );
}
