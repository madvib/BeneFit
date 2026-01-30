import { useState } from 'react';
import { 
  ChevronRight, 
  ChevronDown,
  CheckCircle2,
} from 'lucide-react';
import { Badge, Card, typography } from '@/lib/components';
import { getActivityTypeConfig } from '@/lib/constants/training-ui';

interface ActivityCardProps {
  readonly name: string;
  readonly type: string;
  readonly duration?: number;
  readonly instructions?: string[];
  readonly status?: 'completed' | 'skipped' | 'pending';
  readonly notes?: string;
  readonly isCollapsible?: boolean;
  readonly defaultExpanded?: boolean;
  readonly children: React.ReactNode;
}

export function ActivityCard({ 
  name, 
  type, 
  duration, 
  instructions, 
  status, 
  notes, 
  isCollapsible = false,
  defaultExpanded = true,
  children 
}: ActivityCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const isCompleted = status === 'completed';
  const typeConfig = getActivityTypeConfig(type);
  const Icon = typeConfig.icon;

  const toggleExpand = () => {
    if (isCollapsible) setIsExpanded(!isExpanded);
  };

  return (
    <Card className={`border-border/40 overflow-hidden shadow-md transition-all ${isCompleted ? 'border-success/30' : ''}`}>
      <div 
        onClick={toggleExpand}
        className={`bg-muted/30 border-border/40 flex items-center justify-between border-b px-5 py-4 ${isCompleted ? 'bg-success/5' : ''} ${isCollapsible ? 'cursor-pointer hover:bg-muted/50 transition-colors' : ''}`}
      >
        <div className="flex items-center gap-3">
{(() => {
    if (isCompleted) {
        return <CheckCircle2 size={20} className="text-success" />;
    }
    if (isCollapsible) {
        return isExpanded ? (
            <ChevronDown size={20} className="opacity-50" />
        ) : (
            <ChevronRight size={20} className="opacity-50" />
        );
    }
    return <Icon size={20} className={`${typeConfig.iconClass} opacity-70`} />;
})()}
<p className={`${typography.h4} font-bold capitalize tracking-tight`}>{name}</p>
        </div>
        <div className="flex items-center gap-2">
            {duration && (
                 <Badge variant="outline" className={`${typography.mutedXs} bg-background font-bold px-2 py-1`}>
                    {duration} min
                 </Badge>
            )}
            <Badge
            variant="secondary"
            className={`${typography.mutedXs} bg-background border-border/50 border font-bold px-2 py-1 ${typeConfig.iconClass}`}
            >
            {type}
            </Badge>
        </div>
      </div>

      <div className={`space-y-6 p-6 transition-all ${isCollapsible && !isExpanded ? 'hidden' : 'block'}`}>
        {children}

        {instructions && instructions.length > 0 && (
          <div className={`border-border/30 rounded-xl border p-4 ${typeConfig.colorClass} bg-opacity-5`}>
            <p className={`${typography.mutedXs} mb-3 block opacity-50`}>Coach Methodology</p>
            <ul className="space-y-2">
              {instructions.map((inst, idx) => (
                <li key={idx} className="flex gap-3">
                  <div
                    className={`${typography.small} text-foreground mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full font-bold bg-background shadow-sm`}
                  >
                    {idx + 1}
                  </div>
                  <p className={`${typography.mutedXs} leading-relaxed`}>{inst}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {notes && (
             <div className="bg-accent/10 border-border/30 rounded-xl border p-4">
                <p className={`${typography.mutedXs} italic opacity-70`}>Note: {notes}</p>
             </div>
        )}
      </div>
    </Card>
  );
}
