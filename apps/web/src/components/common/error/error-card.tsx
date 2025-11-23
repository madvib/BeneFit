import { Card, Button } from '@/components';
import { AlertTriangle, Bug, RefreshCw } from 'lucide-react';

interface ErrorCardProps {
  title?: string;
  message: string;
  error?: string;
  showRefreshButton?: boolean;
  showReportButton?: boolean;
  onReportClick?: () => void;
  onRefresh?: () => void;
  className?: string;
}

export default function ErrorCard({
  title = 'Error',
  message,
  error,
  showRefreshButton = false,
  showReportButton = false,
  onReportClick,
  onRefresh,
  className = '',
}: ErrorCardProps) {
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      globalThis.location.reload();
    }
  };

  return (
    <Card className={`bg-destructive/5 border-destructive/20 ${className}`}>
      <div className="flex flex-col items-center gap-4 p-6 text-center">
        <div className="bg-destructive/10 rounded-full p-2">
          <AlertTriangle className="text-destructive h-6 w-6" />
        </div>

        <div>
          <h3 className="text-foreground font-semibold">{title}</h3>
          <p className="text-muted-foreground mt-1 text-sm">{message}</p>

          {error && (
            <p className="text-destructive bg-destructive/10 mt-2 rounded p-2 font-mono text-xs">
              {error}
            </p>
          )}
        </div>

        {(showRefreshButton || showReportButton) && (
          <div className="mt-3 flex gap-2">
            {showRefreshButton && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="flex items-center gap-1 text-xs"
              >
                <RefreshCw size={12} />
                Retry
              </Button>
            )}

            {showReportButton && (
              <Button
                variant="outline"
                size="sm"
                onClick={onReportClick}
                className="flex items-center gap-1 text-xs"
              >
                <Bug size={12} />
                Report
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
