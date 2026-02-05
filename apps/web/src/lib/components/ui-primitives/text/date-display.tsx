interface DateDisplayProps {
  date: Date | string | number;
  format?: 'short' | 'medium' | 'long' | 'full' | 'datetime';
  options?: Intl.DateTimeFormatOptions;
  className?: string;
  as?: 'span' | 'p' | 'div' | 'time';
}

const PRESETS: Record<string, Intl.DateTimeFormatOptions> = {
  short: { month: 'short', day: 'numeric', year: 'numeric' }, // Jan 14, 2024
  medium: { month: 'long', day: 'numeric', year: 'numeric' }, // January 14, 2024
  long: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }, // Sunday, January 14, 2024
  full: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }, // Same as long for now
  datetime: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' },
};

export function DateDisplay({ 
  date, 
  format = 'short', 
  options, 
  className = '',
  as: Component = 'span' 
}: Readonly<DateDisplayProps>) {
  const dateObj = new Date(date);
  
  if (Number.isNaN(dateObj.getTime())) {
    return null; // Or return a fallback string like "Invalid Date"
  }

  const formatOptions = options || PRESETS[format] || PRESETS.short;
  const formattedDate = dateObj.toLocaleDateString(undefined, formatOptions);

  return (
    <Component className={className} dateTime={dateObj.toISOString()}>
      {formattedDate}
    </Component>
  );
}
