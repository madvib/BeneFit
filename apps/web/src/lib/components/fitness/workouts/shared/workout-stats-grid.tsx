

import { MetricCard } from '@/lib/components';
import { LucideIcon } from 'lucide-react';

interface StatsGridProps {
  readonly items: {
    readonly label: string;
    readonly value: string | number | undefined;
    readonly unit?: string;
    readonly icon: LucideIcon;
    readonly highlight?: boolean;
  }[];
}

export function StatsGrid({ items }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item, idx) => (
        <MetricCard
          key={idx}
          label={item.label}
          value={item.value ?? '--'}
          unit={item.unit}
          icon={item.icon}
          className={`${item.highlight ? 'border-primary/20 bg-primary/5' : ''} transition-all hover:shadow-md`}
          iconClassName={item.highlight ? 'text-primary' : undefined}
        />
      ))}
    </div>
  );
}
