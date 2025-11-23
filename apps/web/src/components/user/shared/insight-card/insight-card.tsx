import { DataCard } from '@/components';

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
    <DataCard
      title={title}
      value={value}
      description={description}
      className={className}
      variant="compact"
    />
  );
}
