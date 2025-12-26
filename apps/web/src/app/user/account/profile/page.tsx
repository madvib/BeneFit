'use client';

import { LoadingSpinner, PageContainer, ErrorPage, Card } from '@/components';
import Spacer from '@/components/common/ui-primitives/spacer/spacer';
import {
  AboutMeSection,
  GoalsSection,
  ProfileHeader,
  SaveChangesButton,
  StatisticsSection,
} from '@/components/user/profile';
import { useAccountController } from '@/controllers';
import { useState } from 'react';

export default function ProfileClient() {
  const { userProfile, isLoading, error, handleSaveChanges } = useAccountController();

  const [aboutMe, setAboutMe] = useState(userProfile?.aboutMe || '');

  const handleSave = async () => {
    if (userProfile) {
      const updatedData = {
        ...userProfile,
        aboutMe: aboutMe,
      };
      await handleSaveChanges(updatedData);
    }
  };

  if (isLoading) {
    return <LoadingSpinner variant="screen" text="Loading profile..." />;
  }

  if (error || !userProfile) {
    return (
      <ErrorPage
        title="Profile Loading Error"
        message={error ?? 'Failed to load profile data.'}
        error={error || 'Failed to load profile'}
        backHref="/"
      />
    );
  }

  return (
    <div>
      <ProfileHeader
        name={userProfile.name || userProfile.firstName || 'User'}
        bio={userProfile.bio}
        profilePicture={userProfile.profilePicture}
        totalWorkouts={userProfile.fitnessStats.totalWorkouts}
        currentStreak={userProfile.fitnessStats.currentStreak}
        totalAchievements={userProfile.fitnessStats.totalAchievements}
        onEditPicture={() => console.log('Edit picture clicked')}
      />
      <Spacer />

      <AboutMeSection aboutMe={aboutMe} onChange={setAboutMe} />

      <div className="mb-6 grid grid-cols-1 gap-6">
        <GoalsSection goals={userProfile.goals} />
        <StatisticsSection stats={userProfile.fitnessStats} />
      </div>
      <Spacer />

      <SaveChangesButton onClick={handleSave} disabled={isLoading} />
    </div>
  );
}
