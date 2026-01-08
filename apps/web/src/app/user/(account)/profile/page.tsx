'use client';

import { profile } from '@bene/react-api-client';
import { LoadingSpinner, ErrorPage } from '@/lib/components';
import { ROUTES } from '@/lib/constants';
import ProfileView from './profile-view';

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

  return <ProfileView userProfile={userProfile} userStats={userStats} />;
}
