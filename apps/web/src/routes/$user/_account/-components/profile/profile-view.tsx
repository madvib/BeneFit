import { Button, Spacer, StatisticsSection, typography } from '@/lib/components';
import { useState } from 'react';
import { GetProfileResponse, GetUserStatsResponse } from '@bene/react-api-client';
import AboutMeSection from './about-me-section';
import ProfileSummary from './profile-summary';

export interface ProfileViewProps {
  userProfile: GetProfileResponse;
  userStats: GetUserStatsResponse;
  onSave?: () => void;
}

export default function ProfileView({ userProfile, userStats, onSave }: Readonly<ProfileViewProps>) {
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
          profile={userProfile}
          stats={userStats}
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
          <p className={typography.mutedXs}>Saving changes is temporarily disabled.</p>
        </div>
      </div>
    </div>
  );
}
