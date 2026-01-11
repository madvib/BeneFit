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
    <div className="animate-in fade-in min-h-screen pb-20 duration-700">
      {/* Top Section */}
      <div className="relative pt-12">
        <ProfileSummary
          name={userProfile.displayName || 'User'}
          bio={aboutMe} // Use local state for bio to reflect immediate updates
          profilePicture={userProfile.avatar || undefined}
          totalWorkouts={userStats.totalWorkouts}
          currentStreak={userStats.currentStreak}
          totalAchievements={userStats.achievements.length}
          onEditPicture={() => console.log('Edit picture clicked')}
        />
      </div>

      <div className="container mx-auto max-w-4xl px-4">
        {/* Bio Section */}
        <div className="mb-12">
          <AboutMeSection aboutMe={aboutMe} onChange={setAboutMe} />
        </div>

        {/* Divider */}
        <div className="via-border mx-auto mb-12 h-px w-24 bg-gradient-to-r from-transparent to-transparent" />

        {/* Detailed Stats */}
        <div className="mb-12">
          <StatisticsSection stats={userStats} />
        </div>

        <Spacer />

        <div className="flex flex-col items-center gap-4">
          <Button
            variant="default"
            size="lg"
            onClick={handleSave}
            disabled
            className="shadow-primary/20 min-w-[200px] shadow-lg"
          >
            Save Profile
          </Button>
          <p className="text-muted-foreground text-xs">Saving changes is temporarily disabled.</p>
        </div>
      </div>
    </div>
  );
}
