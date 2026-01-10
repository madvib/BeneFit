import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export function PageHeader({ title, description, className }: PageHeaderProps) {
  return (
    <div className={`mb-6 space-y-1 ${className ?? ''}`}>
      <h1 className="text-foreground text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
      {description && <p className="text-muted-foreground text-lg">{description}</p>}
    </div>
  );
}
