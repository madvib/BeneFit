'use client';

import { useState, useEffect } from 'react';
import { profile } from '@bene/react-api-client';
import { LoadingSpinner, ErrorPage, Spacer } from '@/lib/components';
import {
  AboutMeSection,
  GoalsSection,
  ProfileHeader,
  SaveChangesButton,
  StatisticsSection,
} from './#components';
import { ROUTES } from '@/lib/constants';

export default function ProfileClient() {
  const profileQuery = profile.useProfile();
  const userProfile = profileQuery.data;
  const isLoading = profileQuery.isLoading;
  const error = profileQuery.error;

  const [aboutMe, setAboutMe] = useState('');

  useEffect(() => {
    if (userProfile?.bio) {
      setAboutMe(userProfile.bio);
    }
  }, [userProfile]);

  const handleSave = async () => {
    // TODO: Implement when PATCH /profile is available
    console.log('Save profile clicked - functionality coming soon');
  };

  if (isLoading) {
    return <LoadingSpinner variant="screen" text="Loading profile..." />;
  }

  if (error) {
    return (
      <ErrorPage
        title="Profile Loading Error"
        message={'Failed to load profile data.'}
        error={error}
        backHref={ROUTES.HOME}
      />
    );
  }

  return (
    <div>
      <ProfileHeader
        name={userProfile?.name || 'User'}
        bio={userProfile?.bio || ''}
        profilePicture={userProfile?.profilePicture || undefined}
        totalWorkouts={userProfile?.fitnessStats?.totalWorkouts || 0}
        currentStreak={userProfile?.fitnessStats?.currentStreak || 0}
        totalAchievements={userProfile?.fitnessStats?.totalAchievements || 0}
        onEditPicture={() => console.log('Edit picture clicked')}
      />
      <Spacer />

      <AboutMeSection aboutMe={aboutMe} onChange={setAboutMe} />

      <div className="mb-6 grid grid-cols-1 gap-6">
        <GoalsSection goals={userProfile?.primaryGoal ? [userProfile.primaryGoal] : []} />
        <StatisticsSection
          stats={
            userProfile?.fitnessStats || {
              totalWorkouts: 0,
              currentStreak: 0,
              totalAchievements: 0,
              totalMinutes: 0,
              weeklyProgress: 0,
            }
          }
        />
      </div>
      <Spacer />

      <SaveChangesButton onClick={handleSave} disabled={true} />
      <p className="text-muted-foreground mt-2 text-center text-sm">
        Saving changes is temporarily disabled.
      </p>
    </div>
  );
}
