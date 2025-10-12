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
    <div className={`bg-background p-6 rounded-lg shadow-sm border border-muted ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium text-muted-foreground mb-1">{title}</h4>
          <div className="text-3xl font-bold text-primary">{value}</div>
          <p className="text-sm text-muted-foreground mt-2">{description}</p>
        </div>
        {icon && (
          <div className="bg-primary/10 p-3 rounded-lg">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}