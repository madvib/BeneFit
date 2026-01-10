import React from 'react';
import Typography from './typography';

interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export default function PageHeader({ title, description, className }: PageHeaderProps) {
  return (
    <div className={`mb-6 space-y-1 ${className ?? ''}`}>
      <Typography variant="h1" className="md:text-4xl">
        {title}
      </Typography>
      {description && <Typography variant="lead">{description}</Typography>}
    </div>
  );
}
