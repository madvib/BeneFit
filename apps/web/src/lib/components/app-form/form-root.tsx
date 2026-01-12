import { ReactNode } from 'react';
import { useFormContext } from './app-form';
import { Card } from '../ui-primitives';
import { typography } from '../theme/typography';

export function Root({
  title,
  subtitle,
  children,
  variant = 'borderless',
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  variant?: 'default' | 'borderless' | 'ghost';
}) {
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
