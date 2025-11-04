'use client';

import { PageContainer } from '@/components';
import { useAccountController } from '@/controllers/account';
import ProfileHeader from './profile-header';
import AboutMeSection from './about-me-section';
import GoalsSection from './goals-section';
import StatisticsSection from './statistics-section';
import SaveChangesButton from './save-changes-button';
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
    return (
      <PageContainer title="Profile">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </PageContainer>
    );
  }

  if (error || !userProfile) {
    return (
      <PageContainer title="Profile">
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-red-500">Error: {error || 'Failed to load profile'}</div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Profile">
      <div className="bg-secondary p-4 sm:p-6 rounded-lg shadow-md max-w-4xl mx-auto">
        <ProfileHeader
          name={userProfile.name || userProfile.firstName || 'User'}
          bio={userProfile.bio}
          profilePicture={userProfile.profilePicture}
          totalWorkouts={userProfile.fitnessStats.totalWorkouts}
          currentStreak={userProfile.fitnessStats.currentStreak}
          totalAchievements={userProfile.fitnessStats.totalAchievements}
          onEditPicture={() => console.log('Edit picture clicked')}
        />

        <AboutMeSection aboutMe={aboutMe} onChange={setAboutMe} />

        <div className="grid grid-cols-1 gap-6 mb-6">
          <GoalsSection goals={userProfile.goals} />
          <StatisticsSection stats={userProfile.fitnessStats} />
        </div>

        <SaveChangesButton onClick={handleSave} disabled={isLoading} />
      </div>
    </PageContainer>
  );
}
