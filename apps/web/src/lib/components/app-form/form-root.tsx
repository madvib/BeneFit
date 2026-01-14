import { ReactNode } from 'react';
import { useFormContext } from './app-form';
import { Card, typography } from '@/lib/components';

interface FormRootProps {
  readonly title?: string;
  readonly subtitle?: string;
  readonly children: ReactNode;
  readonly variant?: 'default' | 'borderless' | 'ghost';
}

export function Root({
  title,
  subtitle,
  children,
  variant = 'borderless',
}: Readonly<FormRootProps>) {
  const form = useFormContext();
  return (
    <Card variant={variant}>
      <div className="mb-6">
        {title && <h2 className={typography.h3}>{title}</h2>}
        {subtitle && <p className={`${typography.muted} mt-2`}>{subtitle}</p>}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        {children}
      </form>
    </Card>
  );
}
