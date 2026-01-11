'use client';

import { useState } from 'react';
import { profile } from '@bene/react-api-client';
import { Spacer, StatisticsSection, Button } from '@/lib/components';
import { AboutMeSection, ProfileSummary } from './_components';

export interface ProfileViewProps {
  userProfile: profile.GetProfileResponse;
  userStats: profile.GetUserStatsResponse;
  onSave?: () => void;
}

export default function ProfileView({ userProfile, userStats, onSave }: ProfileViewProps) {
  // Initialize state directly from props - no useEffect needed
  const [aboutMe, setAboutMe] = useState(userProfile.bio || '');

  const handleSave = async () => {
    if (onSave) onSave();
    console.log('Save profile clicked - functionality coming soon');
  };

  return (
    <div>
      <ProfileSummary
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
      <Button variant="default" size="lg" onClick={handleSave} disabled>
        Save Profile
      </Button>
      <p className="text-muted-foreground mt-2 text-center text-sm">
        Saving changes is temporarily disabled.
      </p>
    </div>
  );
}
