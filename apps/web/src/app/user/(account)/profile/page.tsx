'use client';

import { useState } from 'react';
import { profile } from '@bene/react-api-client';
import { LoadingSpinner, ErrorPage, Spacer } from '@/lib/components';
import {
  AboutMeSection,
  ProfileHeader,
  SaveChangesButton,
  StatisticsSection,
} from './#components';
import { ROUTES } from '@/lib/constants';

export default function ProfileClient() {
  const profileQuery = profile.useProfile();
  const statsQuery = profile.useUserStats();

  if (profileQuery.isLoading || statsQuery.isLoading) {
    return <LoadingSpinner variant="screen" text="Loading profile..." />;
  }

  if (profileQuery.error || statsQuery.error) {
    return (
      <ErrorPage
        title="Profile Loading Error"
        message={'Failed to load profile data.'}
        error={(profileQuery.error || statsQuery.error) as Error}
        backHref={ROUTES.USER.PLAN}
      />
    );
  }

  const userProfile = profileQuery.data;
  const userStats = statsQuery.data;

  if (!userProfile || !userStats) {
    return (
      <ErrorPage
        title="Profile Not Found"
        message="Unable to load your profile information."
        backHref={ROUTES.USER.PLAN}
      />
    );
  }

  return <ProfileContent userProfile={userProfile} userStats={userStats} />;
}

interface ProfileContentProps {
  userProfile: profile.GetProfileResponse;
  userStats: profile.GetUserStatsResponse;
}

function ProfileContent({ userProfile, userStats }: ProfileContentProps) {
  // Initialize state directly from props - no useEffect needed
  const [aboutMe, setAboutMe] = useState(userProfile.bio || '');

  const handleSave = async () => {
    // NOTE: Implement when PATCH /profile is available
    console.log('Save profile clicked - functionality coming soon');
  };

  return (
    <div>
      <ProfileHeader
        name={userProfile.displayName || 'User'}
        bio={userProfile.bio || ''}
        profilePicture={userProfile.avatar || undefined}
        totalWorkouts={userStats.totalWorkouts}
        currentStreak={userStats.currentStreak}
        totalAchievements={userStats.achievements.length}
        onEditPicture={() => console.log('Edit picture clicked')}
      />
      <Spacer />

      <AboutMeSection aboutMe={aboutMe} onChange={setAboutMe} />

      <div className="mb-6">
        <StatisticsSection stats={userStats} />
      </div>
      <Spacer />

      <SaveChangesButton onClick={handleSave} disabled={true} />
      <p className="text-muted-foreground mt-2 text-center text-sm">
        Saving changes is temporarily disabled.
      </p>
    </div>
  );
}
