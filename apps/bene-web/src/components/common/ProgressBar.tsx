interface ProgressBarProps {
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
  showPercentage = true 
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  return (
    <div className={`w-full bg-background rounded-full h-2.5 ${className}`}>
      <div 
        className={`${barColor} h-2.5 rounded-full transition-all duration-300`}
        style={{ width: `${percentage}%` }}
      ></div>
      {showPercentage && (
        <div className="text-right text-xs mt-1">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
}