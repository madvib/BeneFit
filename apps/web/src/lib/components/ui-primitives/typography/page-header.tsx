import React from 'react';
import { typography } from '@/lib/components/theme/typography';

interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export default function PageHeader({ title, description, className }: PageHeaderProps) {
  return (
    <div className={`mb-6 space-y-1 ${className ?? ''}`}>
      <h1 className={`${typography.h1} md:text-4xl`}>{title}</h1>
      {description && <p className={typography.lead}>{description}</p>}
    </div>
  );
}
