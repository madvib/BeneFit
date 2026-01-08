import type { Meta, StoryObj } from '@storybook/react';
import ProfileView from './profile-view';
import { SEED_USERS } from '@bene/shared';
import { Skeleton } from '@/lib/components';

// Helper to map seed user to profile format
const toProfile = (seedUser: (typeof SEED_USERS)[0]) => ({
  id: seedUser.id,
  email: seedUser.email,
  displayName: seedUser.name,
  bio: 'Fitness enthusiast and weekend warrior.',
  avatar: seedUser.avatarUrl,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  emailVerified: seedUser.emailVerified,
});

const DEFAULT_USER = toProfile(SEED_USERS[0]); // User 001

const MOCK_STATS = {
  totalWorkouts: 42,
  totalMinutes: 1250,
  totalVolume: 15_400,
  lastWorkoutDate: new Date().toISOString(),
  daysSinceLastWorkout: 2,
  currentStreak: 5,
  longestStreak: 12,
  streakActive: true,
  achievements: [
    {
      id: '1',
      name: 'Early Bird',
      description: 'Complete a workout before 6am',
      unlockedAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Marathoner',
      description: 'Run 42km in total',
      unlockedAt: new Date().toISOString(),
    },
  ],
  weeklyActivity: [
    { date: '2023-10-01', minutes: 30, calories: 300 },
    { date: '2023-10-02', minutes: 45, calories: 450 },
    { date: '2023-10-03', minutes: 0, calories: 0 },
    { date: '2023-10-04', minutes: 60, calories: 600 },
    { date: '2023-10-05', minutes: 30, calories: 300 },
    { date: '2023-10-06', minutes: 0, calories: 0 },
    { date: '2023-10-07', minutes: 90, calories: 900 },
  ],
};

const meta: Meta = {
  title: 'Pages/Account/Profile',
  component: ProfileView,
  parameters: {
    layout: 'padded',
  },
};

export default meta;

export const Default: StoryObj<typeof ProfileView> = {
  render: () => <ProfileView userProfile={DEFAULT_USER} userStats={MOCK_STATS} />,
};

export const EmptyBio: StoryObj<typeof ProfileView> = {
  render: () => (
    <ProfileView userProfile={{ ...DEFAULT_USER, bio: undefined }} userStats={MOCK_STATS} />
  ),
};

export const Loading: StoryObj<typeof ProfileView> = {
  render: () => (
    <div className="space-y-8">
      {/* Profile Header Skeleton */}
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="h-32 w-32 rounded-full" />
        <div className="space-y-2 text-center">
          <Skeleton className="mx-auto h-8 w-48" />
          <Skeleton className="mx-auto h-4 w-64" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-24 w-28 rounded-lg" />
          <Skeleton className="h-24 w-28 rounded-lg" />
          <Skeleton className="h-24 w-28 rounded-lg" />
        </div>
      </div>

      {/* Content Skeletons */}
      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    </div>
  ),
};
