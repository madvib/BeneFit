import type { Meta, StoryObj } from '@storybook/react';
import ProfileView from './profile-view';
import { Skeleton } from '@/lib/components';
import { mockUserProfile, mockUserStats } from '@/lib/testing/fixtures';

const meta: Meta = {
  title: 'Features/Account/Profile',
  component: ProfileView,
  parameters: {
    layout: 'padded',
  },
};

export default meta;

export const Default: StoryObj<typeof ProfileView> = {
  render: () => <ProfileView userProfile={mockUserProfile} userStats={mockUserStats} />,
};

export const EmptyBio: StoryObj<typeof ProfileView> = {
  render: () => (
    <ProfileView userProfile={{ ...mockUserProfile, bio: undefined }} userStats={mockUserStats} />
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

// Consolidated Sub-Components
import ProfileSummary from './_components/profile-summary';
import AboutMeSection from './_components/about-me-section';
import { useState } from 'react';

export const ProfileSummaryHeader: StoryObj<typeof ProfileSummary> = {
  render: () => (
    <div className="border-b pb-8">
      <ProfileSummary
        name="Alex Johnson"
        bio="Fitness enthusiast | Marathon runner"
        totalWorkouts={127}
        currentStreak={12}
        totalAchievements={8}
        onEditPicture={() => console.log('Edit picture')}
      />
    </div>
  ),
};

export const AboutMe: StoryObj<typeof AboutMeSection> = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [text, setText] = useState("I'm passionate about endurance running.");
    return <AboutMeSection aboutMe={text} onChange={setText} />;
  },
};
