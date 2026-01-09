import ErrorDisplay from './error-display';

interface PageErrorProps {
  title?: string;
  message: string;
  error?: Error;
  showBackButton?: boolean;
  showRefreshButton?: boolean;
  showReportButton?: boolean;
  onReportClick?: () => void;
  onRefresh?: () => void;
  backHref?: string;
  className?: string;
}

export default function ErrorPage(props: PageErrorProps) {
  return <ErrorDisplay {...props} variant="page" />;
}
