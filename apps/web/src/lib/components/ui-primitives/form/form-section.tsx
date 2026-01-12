import { ReactNode } from 'react';
import { Card, typography } from '@/lib/components';

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
        <h4 className={`${typography.h4} mb-4`}>{title}</h4>
        {description && <p className={`${typography.muted} mb-4 block`}>{description}</p>}
        {children}
      </div>
    </Card>
  );
}
