'use client';

import { Button, Card } from '@/components';
import { ArrowLeft, Bug, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface PageErrorProps {
  title?: string;
  message: string;
  error?: string;
  showBackButton?: boolean;
  showRefreshButton?: boolean;
  showReportButton?: boolean;
  onReportClick?: () => void;
  onRefresh?: () => void;
  backHref?: string;
  className?: string;
}

export default function ErrorPage({
  title = 'Something went wrong',
  message,
  error,
  showBackButton = true,
  showRefreshButton = true,
  showReportButton = true,
  onReportClick,
  onRefresh,
  backHref = '/',
  className = '',
}: PageErrorProps) {
  const handleRefresh = () => {
    if (onRefresh) {
      globalThis.location.reload();
      onRefresh();
    }
  };

  return (
    <div className={`flex min-h-screen items-center justify-center p-4 ${className}`}>
      <Card className="bg-destructive/5 border-destructive/20 w-full max-w-md">
        <div className="flex flex-col items-center gap-4 p-8 text-center">
          <div className="bg-destructive/10 rounded-full p-3">
            <Bug className="text-destructive h-8 w-8" />
          </div>

          <div>
            <h2 className="text-foreground text-xl font-bold">{title}</h2>
            <p className="text-muted-foreground mt-2">{message}</p>

            {error && (
              <p className="text-destructive bg-destructive/10 mt-2 rounded p-2 font-mono text-sm">
                {error}
              </p>
            )}
          </div>

          <div className="mt-4 flex w-full flex-wrap justify-center gap-3">
            {showBackButton && (
              <Button variant="outline" className="flex items-center gap-2">
                <Link href={backHref}>
                  <ArrowLeft size={16} />
                  Go Back
                </Link>
              </Button>
            )}

            {showRefreshButton && (
              <Button onClick={handleRefresh} className="flex items-center gap-2">
                <RefreshCw size={16} />
                Reload Page
              </Button>
            )}

            {showReportButton && (
              <Button
                variant="secondary"
                onClick={onReportClick}
                className="flex items-center gap-2"
              >
                <Bug size={16} />
                Report
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
