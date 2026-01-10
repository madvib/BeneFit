import * as React from 'react';
import { motion } from 'motion/react';
import { ErrorDisplay } from './error-display';
import { cva, type VariantProps } from 'class-variance-authority';

const inlineErrorVariants = cva(
  'bg-destructive/5 border-destructive/10 relative w-full overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300',
  {
    variants: {
      severity: {
        error: 'text-destructive',
        warning: 'text-yellow-600 dark:text-yellow-500',
        info: 'text-blue-600 dark:text-blue-400',
      },
    },
    defaultVariants: {
      severity: 'error',
    },
  },
);

interface InlineErrorProps extends VariantProps<typeof inlineErrorVariants> {
  title?: string;
  message: string;
  error?: Error | string;
  showRefreshButton?: boolean;
  showReportButton?: boolean;
  onReportClick?: () => void;
  onRefresh?: () => void;
  className?: string;
  actions?: React.ReactNode;
}

export default function InlineError({
  severity = 'error',
  className = '',
  ...props
}: InlineErrorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={inlineErrorVariants({ severity, className })}
    >
      <ErrorDisplay {...props} severity={severity} variant="inline" />
    </motion.div>
  );
}
