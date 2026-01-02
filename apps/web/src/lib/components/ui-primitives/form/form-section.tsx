import { ReactNode } from 'react';
import { Card } from '@/lib/components';

interface FormSectionProps {
  title: string;
  children: ReactNode;
  description?: string;
  className?: string;
}

export default function FormSection({
  title,
  children,
  description,
  className = '',
}: FormSectionProps) {
  return (
    <Card className={className}>
      <div className="mb-6">
        <h3 className="mb-4 text-2xl font-semibold">{title}</h3>
        {description && <p className="text-muted-foreground mb-4">{description}</p>}
        {children}
      </div>
    </Card>
  );
}
