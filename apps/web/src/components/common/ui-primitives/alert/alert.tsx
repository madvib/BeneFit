'use client';

import { AlertTriangle, Bug, Check, Info, X } from 'lucide-react';

interface AlertProperties {
  title: string;
  description?: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  onClose?: () => void;
  className?: string;
}

export default function Alert({
  title,
  description,
  type = 'info',
  onClose,
  className = '',
}: AlertProperties) {
  const typeStyles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200',
    success:
      'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200',
    warning:
      'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200',
    error:
      'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200',
  };

  const iconPaths = {
    info: <Info />,
    success: <Check />,
    warning: <AlertTriangle />,
    error: <Bug />,
  };

  return (
    <div
      role="alert"
      className={`rounded-lg border p-4 ${typeStyles[type satisfies keyof typeof typeStyles]} ${className}`}
    >
      <div className="flex items-start">
        <div className="mr-3 shrink-0">
          {iconPaths[type satisfies keyof typeof iconPaths]}
        </div>
        <div className="flex-1">
          <h4 className="font-medium">{title}</h4>
          {description && <p className="mt-1 text-sm">{description}</p>}
        </div>
        {onClose && (
          <button onClick={onClose} className="ml-3 shrink-0" aria-label="Close alert">
            <X />
          </button>
        )}
      </div>
    </div>
  );
}
