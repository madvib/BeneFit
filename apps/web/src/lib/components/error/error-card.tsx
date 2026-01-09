import ErrorDisplay from './error-display';

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

export default function ErrorCard(props: ErrorCardProps) {
  return <ErrorDisplay {...props} variant="card" />;
}
