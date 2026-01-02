interface ProgressBarProperties {
  value: number;
  max: number;
  className?: string;
  barColor?: string;
  showPercentage?: boolean;
}

export default function ProgressBar({
  value,
  max,
  className = '',
  barColor = 'bg-primary',
}: ProgressBarProperties) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={`bg-background h-2.5 w-full rounded-full ${className}`}>
      <div
        className={`${barColor} h-2.5 rounded-full transition-all duration-300`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
}
