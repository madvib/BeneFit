'use client';

import { Activity, ArrowRight } from 'lucide-react';
import { useActivityFeed } from '@/controllers';
import {
  getActivityColorClass,
  getActivityIcon,
} from '@/components/common/activity/activity-styles';

const formatTimeAgo = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    return `${diffInHours}h ago`;
  } else if (diffInDays === 1) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
};

export default function ActivityFeed() {
  const { activities } = useActivityFeed();

  return (
    <div className="bg-background border-muted flex h-full flex-col overflow-hidden rounded-xl border shadow-sm">
      <div className="border-muted bg-accent/20 flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <Activity size={18} className="text-primary" />
          <h3 className="text-lg font-semibold tracking-tight">Recent Activity</h3>
        </div>
        <button className="text-muted-foreground hover:text-primary flex items-center gap-1 text-xs font-medium transition-colors">
          View All <ArrowRight size={12} />
        </button>
      </div>

      <div className="flex flex-col gap-4 p-6">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="group border-muted bg-card hover:border-primary/40 relative flex gap-4 rounded-xl border p-4 transition-all duration-200 hover:shadow-md"
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${getActivityColorClass(activity.type)}`}
            >
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="flex items-start justify-between gap-4">
                <h4 className="text-foreground group-hover:text-primary truncate text-sm font-bold transition-colors">
                  {activity.title}
                </h4>
                <span className="text-muted-foreground shrink-0 font-mono text-[10px]">
                  {formatTimeAgo(activity.timestamp)}
                </span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {activity.description}
              </p>
              <div className="mt-2 flex items-center gap-2">
                {activity.calories && (
                  <span className="rounded bg-red-500/10 px-2 py-0.5 text-[10px] font-bold text-red-500">
                    {activity.calories} cal
                  </span>
                )}
                {activity.duration && (
                  <span className="text-muted-foreground bg-muted rounded px-2 py-0.5 text-[10px] font-medium">
                    {activity.duration}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
