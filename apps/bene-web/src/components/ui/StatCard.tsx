interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon?: React.ReactNode;
  className?: string;
}

export default function StatCard({
  title,
  value,
  description,
  icon,
  className = ''
}: StatCardProps) {
  return (
    <div className={`bg-background p-4 sm:p-6 rounded-lg shadow-sm border border-muted ${className}`}>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="flex-1">
          <h4 className="font-medium text-muted-foreground mb-1 text-sm sm:text-base">{title}</h4>
          <div className="text-2xl sm:text-3xl font-bold text-primary">{value}</div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-2">{description}</p>
        </div>
        {icon && (
          <div className="bg-primary/10 p-3 rounded-lg self-start">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}