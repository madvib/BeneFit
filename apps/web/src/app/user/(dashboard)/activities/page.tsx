'use client';

import { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Filter,
  Users,
  User,
  Globe,
  TrendingUp,
  Activity,
  Calendar,
} from 'lucide-react';
import { Card } from '@/components/common/ui-primitives/card/card';

const FEED_ITEMS = [
  {
    id: '1',
    user: { name: 'Sarah Chen', avatar: 'SC', color: 'bg-blue-500' },
    action: 'completed a run',
    time: '2h ago',
    content: 'Morning 5k run in Central Park! 🏃‍♀️💨',
    stats: { distance: '5.2 km', duration: '28:45' },
    likes: 24,
    comments: 5,
    type: 'friends',
  },
  {
    id: '2',
    user: { name: 'Mike Ross', avatar: 'MR', color: 'bg-green-500' },
    action: 'hit a PR',
    time: '4h ago',
    content: 'Deadlift 150kg! 🏋️‍♂️💪',
    likes: 56,
    comments: 12,
    type: 'friends',
  },
  {
    id: '3',
    user: { name: 'Morning Yoga Club', avatar: '🧘', color: 'bg-purple-500' },
    action: 'posted an event',
    time: '5h ago',
    content: 'Sunrise Yoga session tomorrow at 6AM.',
    likes: 18,
    comments: 2,
    type: 'teams',
  },
  {
    id: '4',
    user: { name: 'Alex L.', avatar: 'AL', color: 'bg-primary' },
    action: 'logged a workout',
    time: 'Yesterday',
    content: 'Upper body power session complete.',
    stats: { duration: '45 min', calories: '320 kcal' },
    likes: 0,
    comments: 0,
    type: 'my-activity',
  },
  {
    id: '5',
    user: { name: 'Jessica Wu', avatar: 'JW', color: 'bg-pink-500' },
    action: 'completed a challenge',
    time: 'Yesterday',
    content: 'Finished the 30-day plank challenge! 🔥',
    likes: 42,
    comments: 8,
    type: 'friends',
  },
  {
    id: '6',
    user: { name: 'Runners United', avatar: '🏃', color: 'bg-orange-500' },
    action: 'shared a route',
    time: '2 days ago',
    content: 'New scenic route added for the weekend long run.',
    likes: 35,
    comments: 4,
    type: 'teams',
  },
  {
    id: '7',
    user: { name: 'David Kim', avatar: 'DK', color: 'bg-teal-500' },
    action: 'earned a badge',
    time: '2 days ago',
    content: 'Earned the "Early Bird" badge! 🌅',
    likes: 15,
    comments: 1,
    type: 'friends',
  },
  {
    id: '8',
    user: { name: 'Alex L.', avatar: 'AL', color: 'bg-primary' },
    action: 'updated goal',
    time: '3 days ago',
    content: 'Set a new goal: Run 50km this month.',
    likes: 0,
    comments: 0,
    type: 'my-activity',
  },
  {
    id: '9',
    user: { name: 'Lisa Park', avatar: 'LP', color: 'bg-indigo-500' },
    action: 'joined a team',
    time: '3 days ago',
    content: 'Joined "HIIT Blasters" team!',
    likes: 22,
    comments: 3,
    type: 'friends',
  },
  {
    id: '10',
    user: { name: 'CrossFit Box', avatar: '🏋️', color: 'bg-red-500' },
    action: 'posted a workout',
    time: '4 days ago',
    content: 'WOD: "Murph" - Good luck everyone!',
    likes: 60,
    comments: 25,
    type: 'teams',
  },
];

type TabType = 'my-activity' | 'friends' | 'teams';

export default function ActivityFeedPage() {
  const [activeTab, setActiveTab] = useState<TabType>('friends');
  const [visibleCount, setVisibleCount] = useState(5);

  const filteredItems = FEED_ITEMS.filter((item) => {
    if (activeTab === 'my-activity') return item.type === 'my-activity';
    if (activeTab === 'friends') return item.type === 'friends';
    if (activeTab === 'teams') return item.type === 'teams';
    return true;
  });

  const displayedItems = filteredItems.slice(0, visibleCount);

  return (
    <div className="mx-auto max-w-[1600px] p-4 md:p-6 lg:p-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Main Feed Area */}
        <div className="lg:col-span-8">
          {/* Header & Tabs */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-foreground text-2xl font-bold">Activity Feed</h1>

            <div className="bg-muted/50 flex items-center gap-1 rounded-full p-1">
              <button
                onClick={() => {
                  setActiveTab('my-activity');
                  setVisibleCount(5);
                }}
                className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  activeTab === 'my-activity'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <User size={14} />
                <span className="hidden sm:inline">My Activity</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('friends');
                  setVisibleCount(5);
                }}
                className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  activeTab === 'friends'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Users size={14} />
                <span className="hidden sm:inline">Friends</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('teams');
                  setVisibleCount(5);
                }}
                className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  activeTab === 'teams'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Globe size={14} />
                <span className="hidden sm:inline">Teams</span>
              </button>
            </div>
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
                      <span className="text-muted-foreground shrink-0 text-xs">
                        {item.time}
                      </span>
                    </div>

                    <p className="text-foreground/90 mt-1 text-sm">{item.content}</p>

                    {item.stats && (
                      <div className="text-muted-foreground mt-2 flex items-center gap-4 text-xs">
                        {Object.entries(item.stats).map(([key, value]) => (
                          <span
                            key={key}
                            className="bg-accent/50 flex items-center gap-1 rounded-md px-2 py-0.5"
                          >
                            <span className="tracking-wider uppercase opacity-70">
                              {key}:
                            </span>
                            <span className="text-foreground font-medium">{value}</span>
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
                {[40, 70, 30, 85, 50, 90, 60].map((height, i) => (
                  <div
                    key={i}
                    className="group relative flex w-full flex-col items-center gap-2"
                  >
                    <div
                      className="bg-primary/20 group-hover:bg-primary w-full rounded-t-lg transition-all duration-500"
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-muted-foreground text-[10px] font-medium">
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                    </span>
                  </div>
                ))}
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
