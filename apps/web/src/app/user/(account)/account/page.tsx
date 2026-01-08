'use client';

import { authClient } from '@bene/react-api-client';
import { LoadingSpinner, ErrorPage } from '@/lib/components';
import { PageHeader } from '../_shared/page-header';
import { PersonalInfoForm, SecurityForm, OAuthProviderList, SessionInfo } from './_components';
import { ROUTES } from '@/lib/constants';

export default function AccountClient() {
  const { data, isPending, error } = authClient.useSession();

  if (isPending) {
    return <LoadingSpinner variant="screen" text="Loading account settings..." />;
  }

  if (error) {
    return (
      <ErrorPage
        title="Account Settings Loading Error"
        message="Unable to load your account settings."
        error={error}
        backHref={ROUTES.USER.ACTIVITIES}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Account Settings" description="Manage your account settings" />

      <SessionInfo />

      {/* OAuth Providers */}
      <OAuthProviderList />

      {/* Personal Info Form */}
      <PersonalInfoForm
        initialData={{
          name: data?.user?.name || '',
          email: data?.user?.email || '',
          emailVerified: data?.user?.emailVerified || false,
        }}
      />

      {/* Security Form */}
      <SecurityForm />
    </div>
  );
}
