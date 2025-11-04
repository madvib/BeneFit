'use client';

import Image from 'next/image';
import { Card, EmptyState, LoadingSpinner } from '@/components';
import { useActivityFeed } from '@/controllers';
import { ActivityIcon } from './icons';

type ActivityType = 'workout' | 'nutrition' | 'goal' | 'achievement' | 'progress';

export default function ActivityFeed() {
  const { activities, loading, error } = useActivityFeed();

  // Simple time ago function
  const formatTimeAgo = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      // For longer periods, show the actual date
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <Card title="Activity Feed" className="h-full">
        <LoadingSpinner />
      </Card>
    );
  }

  if (error) {
    return (
      <Card title="Activity Feed" className="h-full">
        <div className="text-red-500 p-4">
          Error loading activity feed: {error}
        </div>
      </Card>
    );
  }

  return (
    <Card
      title="Activity Feed"
      actions={<button className="btn btn-ghost text-sm px-3 py-1.5">View All</button>}
      className="h-full"
    >
      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="bg-background p-4 rounded-lg shadow-sm border border-muted flex flex-col sm:flex-row gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <ActivityIcon type={activity.type} />
                </div>
                <div className="flex-1 min-w-0 w-full">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 w-full">
                    <h4 className="font-semibold text-sm sm:text-base break-words max-w-full">
                      {activity.title}
                    </h4>
                    <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap self-start sm:self-auto">
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                  <p className="text-foreground/80 text-sm mt-1 break-words max-w-full">
                    {activity.description}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-3 items-center pl-12 sm:pl-0">
                <div className="flex items-center min-w-0">
                  <Image
                    src={activity.avatar}
                    alt={activity.user}
                    width={24}
                    height={24}
                    className="rounded-full mr-2 flex-shrink-0"
                  />
                  <span className="text-sm text-muted-foreground truncate">
                    {activity.user}
                  </span>
                </div>

                {activity.duration && (
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded whitespace-nowrap flex-shrink-0">
                    {activity.duration}
                  </span>
                )}

                {activity.calories !== undefined && (
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded whitespace-nowrap flex-shrink-0">
                    {activity.calories} cal
                  </span>
                )}

                {activity.value !== undefined && activity.goal !== undefined && (
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded whitespace-nowrap flex-shrink-0">
                    {activity.value}/{activity.goal}
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <EmptyState
            title="No Recent Activity"
            description="There's no recent activity to display. Start working out to see your activity feed!"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
            action={{
              label: 'Start Workout',
              onClick: () => console.log('Start workout clicked'),
            }}
          />
        )}
      </div>
    </Card>
  );
}
