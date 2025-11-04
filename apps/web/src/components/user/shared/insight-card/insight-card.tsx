interface InsightCardProperties {
  title: string;
  value: string | number;
  description: string;
  className?: string;
}

export default function InsightCard({
  title,
  value,
  description,
  className = "",
}: InsightCardProperties) {
  return (
    <div className={`p-4 bg-background rounded-lg ${className}`}>
      <h4 className="font-medium mb-2">{title}</h4>
      <div className="text-3xl font-bold text-primary">{value}</div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
