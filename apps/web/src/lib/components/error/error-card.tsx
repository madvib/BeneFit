import * as React from 'react';
import { motion } from 'motion/react';
import { Card, ElectricBorder } from '../ui-primitives';
import { ErrorDisplay, getSeverityColor } from './error-display';

interface ErrorCardProps {
  title?: string;
  message: string;
  error?: Error | string;
  showRefreshButton?: boolean;
  showReportButton?: boolean;
  onReportClick?: () => void;
  onRefresh?: () => void;
  className?: string;
  severity?: 'error' | 'warning' | 'info' | null;
  actions?: React.ReactNode;
}

export default function ErrorCard({
  severity = 'error',
  className = '',
  ...props
}: ErrorCardProps) {
  const severityColor = getSeverityColor(severity);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`w-full max-w-lg ${className}`}
    >
      <ElectricBorder color={severityColor} borderRadius={24} chaos={0.1} speed={0.8}>
        <Card
          variant="borderless"
          className="rounded-[24px] shadow-none"
          bodyClassName="bg-background flex flex-col items-center justify-center p-8"
        >
          <ErrorDisplay {...props} severity={severity} variant="card" />
        </Card>
      </ElectricBorder>
    </motion.div>
  );
}
