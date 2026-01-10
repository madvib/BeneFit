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
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, AnimatePresence } from 'motion/react';
import { Button, ElectricBorder, Card } from '@/lib/components/ui-primitives';

const errorDisplayVariants = cva(
  'relative flex flex-col items-center justify-center overflow-hidden transition-all duration-300',
  {
    variants: {
      variant: {
        page: 'min-h-[calc(100dvh-var(--header-height))] w-full p-6 text-center lg:p-12',
        card: 'bg-background relative w-full rounded-3xl p-8 text-center',
        inline:
          'bg-destructive/5 border-destructive/10 w-full rounded-2xl border p-4 text-left items-start justify-start',
      },
      severity: {
        error: 'text-destructive',
        warning: 'text-yellow-600 dark:text-yellow-500',
        info: 'text-blue-600 dark:text-blue-400',
      },
    },
    defaultVariants: {
      variant: 'page',
      severity: 'error',
    },
  },
);

interface ErrorDisplayProps extends VariantProps<typeof errorDisplayVariants> {
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
  actions?: React.ReactNode;
}

export default function ErrorDisplay({
  variant,
  severity,
  title,
  message,
  error,
  showBackButton,
  showRefreshButton,
  showReportButton,
  onReportClick,
  onRefresh,
  backHref,
  className,
  actions,
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

  const errorId = React.useId();

  // Determine icon based on severity
  const Icon = React.useMemo(() => {
    if (severity === 'warning') return ShieldAlert;
    if (variant === 'inline') return AlertCircle;
    return XCircle;
  }, [severity, variant]);

  const technicalDetails = React.useMemo(() => {
    if (!error) return null;
    return typeof error === 'string' ? error : error.stack || error.message;
  }, [error]);

  const severityColor = React.useMemo(() => {
    switch (severity) {
      case 'warning':
        return '#f59e0b';
      case 'info':
        return '#3b82f6';
      default:
        return '#ef4444';
    }
  }, [severity]);

  const isPage = variant === 'page';
  const isCard = variant === 'card';
  const isInline = variant === 'inline';

  const footer = isPage && (
    <div className="text-muted-foreground/30 absolute bottom-12 left-1/2 flex -translate-x-1/2 items-center gap-2 text-xs font-medium tracking-widest uppercase">
      <Bug size={12} />
      Error ID: {errorId}
    </div>
  );

  const backgrounds = isPage && (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="bg-primary/5 absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full blur-3xl" />
      <div className="bg-destructive/10 absolute top-1/2 -right-24 h-64 w-64 rounded-full blur-3xl" />
    </div>
  );

  const mainContent = (
    <div className={`flex flex-col items-center justify-center ${isInline ? 'flex-row' : ''}`}>
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
          <h2
            className={`text-foreground font-bold tracking-tight ${
              isPage ? 'mb-4 text-3xl md:text-4xl' : 'mb-1 text-xl'
            }`}
          >
            {title}
          </h2>
        )}
        <p
          className={`text-muted-foreground max-w-lg leading-relaxed ${
            isPage ? 'text-lg md:text-xl' : 'text-sm'
          } ${isPage ? 'mx-auto' : ''}`}
        >
          {message}
        </p>

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
                  <pre className="bg-muted text-muted-foreground max-h-48 overflow-auto rounded-xl p-4 font-mono text-[10px] leading-tight">
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
              <Button onClick={handleRefresh} variant="default" className="rounded-2xl px-6">
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={errorDisplayVariants({ variant, severity, className })}
    >
      {backgrounds}

      {(() => {
        if (isPage) {
          return (
            <div className="flex w-full max-w-2xl flex-col items-center justify-center">
              <ElectricBorder color={severityColor} borderRadius={48} chaos={0.05} speed={0.4}>
                <Card
                  variant="borderless"
                  bodyClassName="p-12 md:p-20 bg-background/50 backdrop-blur-xl"
                >
                  {mainContent}
                </Card>
              </ElectricBorder>
            </div>
          );
        }

        if (isCard) {
          return (
            <ElectricBorder color={severityColor} borderRadius={24} chaos={0.1} speed={0.8}>
              <div className="bg-background flex flex-col items-center justify-center p-8">
                {mainContent}
              </div>
            </ElectricBorder>
          );
        }

        return mainContent;
      })()}

      {footer}
    </motion.div>
  );
}
