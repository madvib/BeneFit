import { typography } from './typography';

interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
  align?: 'left' | 'center';
}

export function PageHeader({ title, description, className, align = 'center' }: PageHeaderProps) {
  const isLeft = align === 'left';
  
  return (
    <div className={`mb-6 space-y-1 ${isLeft ? 'text-left' : 'text-center'} ${className ?? ''}`}>
      <h1 className={`${typography.h1} mb-3 md:text-4xl ${isLeft ? '' : 'mx-auto'}`}>{title}</h1>
      {description && (
        <p className={`${typography.lead} max-w-3xl ${isLeft ? '' : 'mx-auto'}`}>
          {description}
        </p>
      )}
    </div>
  );
}
