import { ReactNode } from 'react';
import { Card, Typography } from '@/lib/components';

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
        <Typography variant="h4" className="mb-4">
          {title}
        </Typography>
        {description && (
          <Typography variant="muted" className="mb-4 block">
            {description}
          </Typography>
        )}
        {children}
      </div>
    </Card>
  );
}
