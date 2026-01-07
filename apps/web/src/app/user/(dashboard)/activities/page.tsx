'use client';

import { useState } from 'react';
import { Heart, MessageCircle, Filter, TrendingUp, Activity, Calendar } from 'lucide-react';
import { workouts, profile } from '@bene/react-api-client';
import { Card, LoadingSpinner, ErrorPage } from '@/lib/components';
import { ROUTES } from '@/lib/constants';
import { safeFormatTimeAgo } from '@/lib/utils/date-format';

export default function ActivityFeedPage() {
  const [visibleCount, setVisibleCount] = useState(5);

  const historyQuery = workouts.useWorkoutHistory({ query: {} });
  const profileQuery = profile.useProfile();

  if (historyQuery.isLoading || profileQuery.isLoading) {
    return <LoadingSpinner variant="screen" text="Loading your feed..." />;
  }

  if (historyQuery.error || profileQuery.error) {
    return (
      <ErrorPage
        title="Feed Error"
        message="Failed to load your activity feed."
        error={(historyQuery.error || profileQuery.error) as Error}
        backHref={ROUTES.HOME}
      />
    );
  }

  // Transform real API data to the feed item structure
  // Note: For now, the API only returns 'my-activity'. 'friends' and 'teams' will show empty state
  const rawItems = historyQuery.data || { workouts: [] };

  interface ActivityItem {
    id: string;
    completedAt?: string;
    date?: string;
    notes?: string;
    activityType?: string;
    type?: string;
    durationMinutes?: number;
  }

  const mappedItems =
    rawItems.workouts?.map((item: ActivityItem) => ({
      id: item.id,
      user: {
        name: profileQuery.data?.displayName || 'Me',
        avatar: profileQuery.data?.displayName?.charAt(0) || 'U',
        color: 'bg-primary',
      },
      action: 'completed a workout',
      time: safeFormatTimeAgo(item.completedAt || item.date || new Date().toISOString()),
      content: item.notes || `Completed ${item.activityType || item.type} session.`,
      stats: {
        duration: item.durationMinutes ? `${item.durationMinutes} min` : undefined,
      },
      likes: 0,
      comments: 0,
      type: 'my-activity' as const,
    })) || [];

  const filteredItems = mappedItems;

  const displayedItems = filteredItems.slice(0, visibleCount);

  return (
    <div className="mx-auto max-w-[1600px] p-4 md:p-6 lg:p-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Main Feed Area */}
        <div className="lg:col-span-8">
          {/* Header */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-foreground text-2xl font-bold">My Activity</h1>
          </div>

          {/* Feed List */}
          <div className="space-y-3">
            {displayedItems.map((item) => (
              <Card
                key={item.id}
                className="group border-border bg-card hover:border-primary/30 transition-all hover:shadow-sm"
                bodyClassName="p-4"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${item.user.color}`}
                  >
                    {item.user.avatar}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-foreground truncate text-sm">
                        <span className="font-bold">{item.user.name}</span>{' '}
                        <span className="text-muted-foreground">{item.action}</span>
                      </p>
                      <span className="text-muted-foreground shrink-0 text-xs">{item.time}</span>
                    </div>

                    <p className="text-foreground/90 mt-1 text-sm">{item.content}</p>

                    {item.stats && (
                      <div className="text-muted-foreground mt-2 flex items-center gap-4 text-xs">
                        {Object.entries(item.stats).map(([key, value]) => (
                          <span
                            key={key}
                            className="bg-accent/50 flex items-center gap-1 rounded-md px-2 py-0.5"
                          >
                            <span className="tracking-wider uppercase opacity-70">{key}:</span>
                            <span className="text-foreground font-medium">{String(value)}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button className="text-muted-foreground rounded-full p-2 hover:bg-red-500/10 hover:text-red-500">
                      <Heart size={16} />
                    </button>
                    <button className="text-muted-foreground rounded-full p-2 hover:bg-blue-500/10 hover:text-blue-500">
                      <MessageCircle size={16} />
                    </button>
                  </div>
                </div>
              </Card>
            ))}

            {filteredItems.length === 0 && (
              <div className="text-muted-foreground flex flex-col items-center justify-center py-12 text-center">
                <Filter size={32} className="mb-3 opacity-20" />
                <p>No activity found in this tab.</p>
              </div>
            )}

            {filteredItems.length > visibleCount && (
              <button
                onClick={() => setVisibleCount((prev) => prev + 5)}
                className="border-border text-muted-foreground hover:border-primary/50 hover:bg-accent/5 hover:text-primary w-full rounded-xl border border-dashed py-3 text-sm font-medium transition-colors"
              >
                View All Activity
              </button>
            )}
          </div>
        </div>

        {/* Right Sidebar: Charts */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 space-y-6">
            {/* Weekly Progress Chart */}
            <Card
              title="Weekly Progress"
              icon={TrendingUp}
              className="border-border bg-card"
              headerClassName="border-b border-border"
            >
              <div className="flex h-40 items-end justify-between gap-2">
                {/* Weekly Progress Chart */}
                {(() => {
                  const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
                  return [40, 70, 30, 85, 50, 90, 60].map((height, i) => (
                    <div
                      key={i}
                      className="group relative flex w-full flex-col items-center gap-2"
                    >
                      <div
                        className="bg-primary/20 group-hover:bg-primary w-full rounded-t-lg transition-all duration-500"
                        style={{ height: `${height}%` }}
                      />
                      <span className="text-muted-foreground text-[10px] font-medium">
                        {
                          // eslint-disable-next-line security/detect-object-injection
                          DAYS[i]
                        }
                      </span>
                    </div>
                  ));
                })()}
              </div>
            </Card>

            {/* Activity Breakdown Chart */}
            <Card
              title="Activity Breakdown"
              icon={Activity}
              className="border-border bg-card"
              headerClassName="border-b border-border"
            >
              <div className="space-y-4">
                {[
                  { label: 'Running', value: 45, color: 'bg-blue-500' },
                  { label: 'Strength', value: 30, color: 'bg-green-500' },
                  { label: 'Yoga', value: 15, color: 'bg-purple-500' },
                  { label: 'Other', value: 10, color: 'bg-orange-500' },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-foreground font-medium">{item.label}</span>
                      <span className="text-muted-foreground">{item.value}%</span>
                    </div>
                    <div className="bg-accent h-2 w-full overflow-hidden rounded-full">
                      <div
                        className={`h-full rounded-full ${item.color}`}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Monthly Stats */}
            <Card
              title="This Month"
              icon={Calendar}
              className="border-border from-primary/5 bg-gradient-to-br to-transparent"
              headerClassName="bg-transparent border-b border-primary/10"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background/50 rounded-2xl p-4">
                  <p className="text-foreground text-2xl font-bold">12</p>
                  <p className="text-muted-foreground text-xs uppercase">Workouts</p>
                </div>
                <div className="bg-background/50 rounded-2xl p-4">
                  <p className="text-foreground text-2xl font-bold">8.5h</p>
                  <p className="text-muted-foreground text-xs uppercase">Active Time</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
