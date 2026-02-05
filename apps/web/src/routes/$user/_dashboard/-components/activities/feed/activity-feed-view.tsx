import { Badge, Button, Card, typography } from '@/lib/components';
import { useState } from 'react';
import { Heart, MessageCircle, Filter, History as HistoryIcon, LayoutList } from 'lucide-react';
import type { CompletedWorkout } from '@bene/react-api-client';
import { safeFormatTimeAgo } from '@/lib/utils/date-format';
import WorkoutList from '../history/workout-list';

// TODO This should be more legible and clear what is going on. try to reduce amount of code

interface UserProfile {
  displayName?: string;
}

export interface ActivityFeedViewProps {
  workouts: CompletedWorkout[]; // Using CompletedWorkout as the source of truth
  userProfile?: UserProfile;
  onSelectWorkout: (_workout: CompletedWorkout) => void;
  defaultTab?: 'feed' | 'history';
}

export function ActivityFeedView({
  workouts,
  userProfile,
  onSelectWorkout,
  defaultTab = 'feed',
}: Readonly<ActivityFeedViewProps>) {
  const [activeTab, setActiveTab] = useState<'feed' | 'history'>(defaultTab);
  const [visibleCount, setVisibleCount] = useState(5);

  // --- DATA MAPPING ---
  // In a real app, 'feed' might come from a different endpoint than 'history'
  // For now, we derive 'feed items' from the same workouts list
  const mappedFeedItems = workouts.map((item) => ({
    id: item.id,
    user: {
      name: userProfile?.displayName || 'Me',
      avatar: userProfile?.displayName?.charAt(0) || 'U',
      color: 'bg-primary',
    },
    action: 'completed a workout',
    time: safeFormatTimeAgo(
      item.recordedAt ||
        (item as { completedAt?: string }).completedAt ||
        (item as { date?: string }).date ||
        new Date().toISOString(),
    ),
    content:
      item.performance?.notes || item.description || `Completed ${item.workoutType} session.`,
    stats: {
      duration: item.performance?.durationMinutes
        ? `${item.performance.durationMinutes} min`
        : undefined,
    },
    likes: 0,
    comments: 0,
    type: 'my-activity' as const,
  }));

  const displayedFeedItems = mappedFeedItems.slice(0, visibleCount);

  // --- RENDERERS ---

  const renderTabs = () => (
    <div className="bg-muted/30 mx-auto mb-6 flex w-fit items-center justify-center gap-2 rounded-xl p-1">
      {/*Buttons? */}

      <button
        onClick={() => setActiveTab('feed')}
        className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-all ${
          activeTab === 'feed'
            ? `${typography.small} bg-background text-foreground shadow-sm`
            : `${typography.muted} hover:bg-background/50`
        }`}
      >
        <LayoutList size={16} />
        Activity Feed
      </button>
      <button
        onClick={() => setActiveTab('history')}
        className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-all ${
          activeTab === 'history'
            ? `${typography.small} bg-background text-foreground shadow-sm`
            : `${typography.muted} hover:bg-background/50`
        }`}
      >
        <HistoryIcon size={16} />
        Full History
      </button>
    </div>
  );

  const renderFeed = () => (
    <div className="animate-in fade-in flex h-full flex-col overflow-hidden duration-500">
      <div className="flex-1 space-y-3 overflow-y-auto">
        {displayedFeedItems.map((item) => (
          <Card
            key={item.id}
            className="group border-border bg-card hover:border-primary/30 transition-all hover:shadow-sm"
            bodyClassName="p-4"
          >
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div
                className={`${typography.small} flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white ${item.user.color}`}
              >
                {item.user.avatar}
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className={`${typography.small} truncate`}>
                    {item.user.name} <span className={typography.muted}>{item.action}</span>
                  </p>
                  <span className={`${typography.xs} text-muted-foreground shrink-0`}>
                    {item.time}
                  </span>
                </div>

                <p className={`${typography.small} text-foreground/90 mt-1`}>{item.content}</p>

                {item.stats && (
                  <div className="mt-2 flex items-center gap-4">
                    {Object.entries(item.stats).map(([key, value]) => (
                      <Badge
                        key={key}
                        variant="accent"
                        className={`${typography.xs} bg-accent/50 text-foreground`}
                      >
                        <span className="mr-1 tracking-wider uppercase opacity-70">{key}:</span>
                        <span>{String(value)}</span>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground h-8 w-8 rounded-full hover:bg-red-500/10 hover:text-red-500"
                >
                  <Heart size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground h-8 w-8 rounded-full hover:bg-blue-500/10 hover:text-blue-500"
                >
                  <MessageCircle size={16} />
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {mappedFeedItems.length === 0 && (
          <div className="text-muted-foreground flex flex-col items-center justify-center py-12 text-center">
            <Filter size={32} className="mb-3 opacity-20" />
            <p>No activity found.</p>
          </div>
        )}

        {mappedFeedItems.length > visibleCount && (
          <Button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setVisibleCount((prev) => prev + 5);
            }}
            variant="dashed"
            className={`${typography.small} h-auto w-full rounded-xl py-3`}
          >
            View More Activity
          </Button>
        )}
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4 flex h-full flex-col overflow-hidden duration-500">
      <WorkoutList
        workouts={workouts}
        onEdit={(id) => {
          const selected = workouts.find((w) => w.id === id);
          if (selected) onSelectWorkout(selected);
        }}
      />
    </div>
  );

  return (
    <>
      {renderTabs()}
      {activeTab === 'feed' ? renderFeed() : renderHistory()}
    </>
  );
}
