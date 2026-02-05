import * as React from 'react';
import { motion } from 'motion/react';
import { Card, ElectricBorder } from '@/lib/components';
import { ErrorDisplay, getSeverityColor } from './error-display';

interface ErrorPageProps {
  title?: string;
  message: string;
  error?: Error | string;
  showBackButton?: boolean;
  showRefreshButton?: boolean;
  showReportButton?: boolean;
  onReportClick?: () => void;
  onRefresh?: () => void;
  backHref?: string;
  className?: string;
  severity?: 'error' | 'warning' | 'info' | null;
  actions?: React.ReactNode;
}

export function ErrorPage({
  severity = 'error',
  className = '',
  ...props
}: Readonly<ErrorPageProps>) {
  const severityColor = getSeverityColor(severity);

  const backgrounds = (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="bg-primary/5 absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full blur-3xl" />
      <div className="bg-destructive/10 absolute top-1/2 -right-24 h-64 w-64 rounded-full blur-3xl" />
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`relative flex min-h-[calc(100dvh-var(--header-height))] w-full flex-col items-center justify-center overflow-hidden p-6 text-center transition-all duration-300 lg:p-12 ${className}`}
    >
      {backgrounds}

      <div className="flex w-full max-w-2xl flex-col items-center justify-center">
        <ElectricBorder color={severityColor} borderRadius={24} chaos={0.07} speed={0.4}>
          <Card
            variant="borderless"
            className="rounded-[24px] shadow-none"
            bodyClassName="p-12 md:p-20 bg-background/50 backdrop-blur-xl"
          >
            <ErrorDisplay {...props} severity={severity} variant="page" />
          </Card>
        </ElectricBorder>
      </div>
    </motion.div>
  );
}
