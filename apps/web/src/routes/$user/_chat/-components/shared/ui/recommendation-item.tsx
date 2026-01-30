import {
  Sparkles,
  Apple,
  BatteryPlus,
  BicepsFlexed,
  PersonStanding,
} from 'lucide-react';
import { typography } from '@/lib/components';

export const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Core':
    case 'Flexibility':
      return <PersonStanding size={14} />;
    case 'Nutrition':
      return <Apple size={14} />;
    case 'Wellness':
      return <BatteryPlus size={14} />;
    case 'Workout':
      return <BicepsFlexed size={14} />;
    default:
      return <Sparkles size={14} />;
  }
};

interface RecommendationItemProps {
  title: string;
  reason: string;
  type: string;
  onClick?: () => void;
  className?: string; // Allow external layout control
}

export function RecommendationItem({
  title,
  reason,
  type,
  onClick,
  className = '',
}: Readonly<RecommendationItemProps>) {
  return (
    <button
      onClick={onClick}
      className={`group bg-card/50 border-border/50 hover:border-primary/40 relative w-full rounded-2xl border p-4 text-left transition-all duration-300 hover:shadow-xl ${className}`}
    >
      <div className="flex items-start gap-4">
        <div className="bg-accent/80 text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary rounded-xl p-2.5 transition-all duration-300">
          {getCategoryIcon(type)}
        </div>
        <div>
          <p
            className={`${typography.small} group-hover:text-primary text-sm font-black whitespace-normal transition-colors`}
          >
            {title}
          </p>
          <p
            className={`${typography.muted} mt-1 text-[10px] leading-tight font-medium whitespace-normal opacity-70`}
          >
            {reason}
          </p>
        </div>
      </div>
      <div className="bg-primary/20 group-hover:bg-primary absolute top-4 right-4 h-2 w-2 rounded-full transition-colors" />
    </button>
  );
}
