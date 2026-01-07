/**
 * Safe date formatting utilities
 * Prevents "Invalid time value" errors by handling null/undefined/invalid dates
 */

type DateValue = string | Date | null | undefined;

export function safeFormatDate(
  dateValue: DateValue,
  options: Intl.DateTimeFormatOptions = {}
): string {
  if (!dateValue) return 'N/A';

  try {
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;

    // Check if date is valid
    if (Number.isNaN(date.getTime())) {
      console.warn('Invalid date value:', dateValue);
      return 'Invalid date';
    }

    return date.toLocaleDateString(undefined, options);
  } catch (error) {
    console.error('Error formatting date:', error, dateValue);
    return 'Invalid date';
  }
}

const DEFAULT_DATETIME_OPTIONS: Intl.DateTimeFormatOptions = {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
};

export function safeFormatDateTime(
  dateValue: DateValue,
  options: Intl.DateTimeFormatOptions = DEFAULT_DATETIME_OPTIONS
): string {
  return safeFormatDate(dateValue, options);
}

export function safeFormatTimeAgo(dateValue: DateValue): string {
  if (!dateValue) return 'N/A';

  try {
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;

    if (Number.isNaN(date.getTime())) {
      console.warn('Invalid date value for time ago:', dateValue);
      return 'Invalid date';
    }

    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      if (diffInMinutes < 1) return 'Just now';
      if (diffInMinutes < 60) return `${ diffInMinutes }m ago`;
      return `${ diffInHours }h ago`;
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${ diffInDays }d ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  } catch (error) {
    console.error('Error formatting time ago:', error, dateValue);
    return 'Invalid date';
  }
}

export function isValidDate(dateValue: unknown): boolean {
  if (!dateValue) return false;
  const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
  return date instanceof Date && !Number.isNaN(date.getTime());
}
