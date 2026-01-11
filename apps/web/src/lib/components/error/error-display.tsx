'use client';

import * as React from 'react';
import {
  AlertCircle,
  ArrowLeft,
  Bug,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  ShieldAlert,
  XCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Button, Typography } from '@/lib/components/ui-primitives';

export const getSeverityColor = (severity?: string | null): string => {
  switch (severity) {
    case 'warning':
      return '#f59e0b';
    case 'info':
      return '#3b82f6';
    default:
      return '#ef4444';
  }
};

export interface ErrorDisplayProps {
  severity?: 'error' | 'warning' | 'info' | null;
  variant?: 'page' | 'card' | 'inline' | null;
  title?: string;
  message: string;
  error?: Error | string;
  showBackButton?: boolean;
  showRefreshButton?: boolean;
  showReportButton?: boolean;
  onReportClick?: () => void;
  onRefresh?: () => void;
  backHref?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function ErrorDisplay({
  severity = 'error',
  variant = 'page',
  title,
  message,
  error,
  showBackButton,
  showRefreshButton,
  showReportButton,
  onReportClick,
  onRefresh,
  backHref,
  actions,
  className,
}: ErrorDisplayProps) {
  const router = useRouter();
  const [showTechnicalDetails, setShowTechnicalDetails] = React.useState(false);

  const handleRefresh = React.useCallback(() => {
    if (onRefresh) {
      onRefresh();
    } else {
      globalThis.location.reload();
    }
  }, [onRefresh]);

  const handleBack = React.useCallback(() => {
    if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  }, [backHref, router]);

  // Determine icon based on severity
  const Icon = React.useMemo(() => {
    if (severity === 'warning') return ShieldAlert;
    if (variant === 'inline') return AlertCircle;
    return XCircle;
  }, [severity, variant]);

  const technicalDetails = React.useMemo(() => {
    if (!error) return null;

    // Environment-aware detail visibility
    const env = process.env.NEXT_PUBLIC_ENV || 'dev';
    const canShowDetails = env === 'dev' || env === 'staging';

    if (!canShowDetails && variant !== 'inline') {
      return null;
    }

    return typeof error === 'string' ? error : error.stack || error.message;
  }, [error, variant]);

  const isPage = variant === 'page';
  const isInline = variant === 'inline';

  return (
    <div
      className={`flex flex-col items-center justify-center ${isInline ? 'flex-row' : ''} ${className ?? ''}`}
    >
      {/* Icon Section */}
      <div
        className={`flex items-center justify-center rounded-3xl ${
          isInline ? 'mr-3 bg-transparent' : 'mb-6 h-20 w-20 bg-current/10 ring-1 ring-current/20'
        }`}
      >
        <Icon size={isInline ? 24 : 40} strokeWidth={1.5} />
      </div>

      {/* Text Section */}
      <div className={isInline ? 'flex-1 text-left' : 'text-center'}>
        {title && (
          <Typography
            variant={isPage ? 'h2' : 'h4'}
            className={`border-none pb-0 font-bold tracking-tight ${
              isPage ? 'mb-4 text-3xl md:text-4xl' : 'mb-1 text-xl'
            }`}
          >
            {title}
          </Typography>
        )}
        <Typography
          variant={isPage ? 'lead' : 'muted'}
          className={`mt-0 max-w-lg leading-relaxed ${
            isPage ? 'text-lg md:text-xl' : 'text-sm'
          } ${isPage ? 'mx-auto' : ''}`}
        >
          {message}
        </Typography>

        {/* Technical Details */}
        {technicalDetails && (
          <div className="mt-6 w-full text-left">
            <button
              onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
              className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs font-medium transition-colors"
            >
              {showTechnicalDetails ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              Technical Details
            </button>
            <AnimatePresence>
              {showTechnicalDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-2 overflow-hidden"
                >
                  <pre className="bg-muted text-muted-foreground max-h-48 overflow-auto rounded-xl p-4 font-mono text-[10px] leading-tight break-all whitespace-pre-wrap">
                    {technicalDetails}
                  </pre>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Action Section */}
        {(showBackButton || showRefreshButton || showReportButton || actions) && (
          <div
            className={`flex flex-wrap items-center gap-3 ${
              isInline ? 'mt-4' : 'mt-8 justify-center'
            }`}
          >
            {showBackButton && (
              <Button variant="outline" onClick={handleBack} className="rounded-2xl px-6">
                <ArrowLeft size={16} className="mr-2" />
                Go Back
              </Button>
            )}

            {showRefreshButton && (
              <Button
                onClick={handleRefresh}
                variant={severity === 'error' ? 'destructive' : 'default'}
                className="rounded-2xl px-6"
              >
                <RefreshCw size={16} className="mr-2" />
                Retry
              </Button>
            )}

            {showReportButton && (
              <Button
                variant="ghost"
                onClick={onReportClick}
                className="text-muted-foreground hover:text-foreground rounded-2xl px-6"
              >
                <Bug size={16} className="mr-2" />
                Report Bug
              </Button>
            )}

            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

export default ErrorDisplay;
