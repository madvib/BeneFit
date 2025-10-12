interface StatusBadgeProps {
  status: string;
  className?: string;
}

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  // Define status colors
  const statusColors = {
    active: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    overdue: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    unread: 'bg-primary text-primary-foreground',
    online: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    offline: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    // Default fallback
    default: 'bg-muted text-foreground'
  };

  const statusColor = statusColors[status as keyof typeof statusColors] || statusColors.default;

  return (
    <span className={`text-xs px-2 py-1 rounded-full ${statusColor} ${className}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}